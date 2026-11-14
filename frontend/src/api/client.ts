import axios from 'axios';

declare global {
  interface Window {
    __API_URL__?: string;
  }
}

// Read API URL from runtime config.js, then build-time env, then fallback
const getBaseURL = () => {
  let url = '';
  if (typeof window !== 'undefined' && window.__API_URL__) {
    // If testing on localhost, connect to local Django server
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    }
    url = window.__API_URL__;
  } else {
    url = import.meta.env.VITE_API_URL || 'http://api.yasindehqan.ir';
  }

  // Handle protocol-relative URLs (e.g. "//api.yasindehqan.ir")
  if (url.startsWith('//')) {
    const proto = typeof window !== 'undefined' ? window.location.protocol : 'http:';
    url = `${proto}${url}`;
  }

  // Strip trailing slashes
  return url.replace(/\/+$/, '');
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
    let cleaned = window.__API_URL__.replace(/\/+$/, '');
    if (cleaned.startsWith('//')) {
      cleaned = `${window.location.protocol}${cleaned}`;
    }
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

// Interceptor to guard against HTML pages and auto-fallback between HTTP and HTTPS
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

    // Auto-fallback between HTTP and HTTPS if network connection fails
    if (
      originalRequest &&
      !originalRequest._retryProtocol &&
      typeof window !== 'undefined' &&
      (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response)
    ) {
      originalRequest._retryProtocol = true;
      const currentBase = originalRequest.baseURL || '';

      // If requested https and failed, try fallback to http
      if (currentBase.startsWith('https://')) {
        const httpBase = currentBase.replace('https://', 'http://');
        console.warn(`[API Fallback] اتصال امن به بک‌اند ناموفق بود. تلاش مجدد با پروتکل عادی (HTTP): ${httpBase}`);
        originalRequest.baseURL = httpBase;
        return api(originalRequest);
      }

      // If requested http and failed, try fallback to https
      if (currentBase.startsWith('http://')) {
        const httpsBase = currentBase.replace('http://', 'https://');
        console.warn(`[API Fallback] اتصال عادی ناموفق بود. تلاش مجدد با پروتکل امن (HTTPS): ${httpsBase}`);
        originalRequest.baseURL = httpsBase;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
