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
    url = import.meta.env.VITE_API_URL || 'https://api.yasindehqan.ir';
  }

  // Strip trailing slashes
  return url.replace(/\/+$/, '');
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to dynamically update baseURL if window.__API_URL__ changes
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined' && window.__API_URL__) {
    const cleaned = window.__API_URL__.replace(/\/+$/, '');
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

// Interceptor to guard against HTML pages (like index.html rewrite or 404 HTML)
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
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
