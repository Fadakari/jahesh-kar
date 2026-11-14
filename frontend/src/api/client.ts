import axios from 'axios';

declare global {
  interface Window {
    __API_URL__?: string;
  }
}

// Normalize API URL to ensure it always targets the correct /api endpoint
export const normalizeApiUrl = (rawUrl?: string): string => {
  let url = (rawUrl || '').trim();
  if (!url) {
    return 'https://api.yasindehqan.ir/api';
  }

  // Handle protocol-relative URLs (e.g. "//api.yasindehqan.ir")
  if (url.startsWith('//')) {
    const proto = typeof window !== 'undefined' ? window.location.protocol : 'https:';
    url = `${proto}${url}`;
  }

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  // If full domain URL is provided without '/api' suffix, automatically append '/api'
  if ((url.startsWith('http://') || url.startsWith('https://')) && !url.endsWith('/api')) {
    url = `${url}/api`;
  }

  return url;
};

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // If testing on localhost, connect to local Django server
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    }
    if (window.__API_URL__) {
      return normalizeApiUrl(window.__API_URL__);
    }
  }
  return normalizeApiUrl(import.meta.env.VITE_API_URL || 'https://api.yasindehqan.ir/api');
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to dynamically update baseURL if window.__API_URL__ changes
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined' && window.__API_URL__) {
    const cleaned = normalizeApiUrl(window.__API_URL__);
    if (config.baseURL !== cleaned && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      config.baseURL = cleaned;
    }
  }

  const token = localStorage.getItem('jaheshkar_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Interceptor to guard against HTML pages and auto-fallback between HTTPS and HTTP
api.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
      console.warn(
        `[YasinDehqan API] Received HTML instead of JSON for ${response.config.url}. Check window.__API_URL__ in config.js!`
      );
      return Promise.reject({
        response: {
          data: {
            error: 'پاسخ نامعتبر از سرور (صفحه وب به جای داده JSON دریافت شد). لطفاً آدرس API در فایل config.js را بررسی نمایید.',
          },
        },
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Auto-fallback between HTTPS and HTTP if connection fails
    if (
      originalRequest &&
      !originalRequest._retryProtocol &&
      typeof window !== 'undefined' &&
      (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response)
    ) {
      originalRequest._retryProtocol = true;
      const currentBase = originalRequest.baseURL || '';

      // If requested https and failed, try http
      if (currentBase.startsWith('https://')) {
        const httpBase = currentBase.replace('https://', 'http://');
        console.warn(`[API Fallback] اتصال امن ناموفق بود، تلاش با پروتکل HTTP: ${httpBase}`);
        originalRequest.baseURL = httpBase;
        return api(originalRequest);
      }

      // If requested http and failed, try https
      if (currentBase.startsWith('http://')) {
        const httpsBase = currentBase.replace('http://', 'https://');
        console.warn(`[API Fallback] تلاش با پروتکل امن HTTPS: ${httpsBase}`);
        originalRequest.baseURL = httpsBase;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
