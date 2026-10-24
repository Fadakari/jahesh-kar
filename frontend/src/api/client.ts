import axios from 'axios';

declare global {
  interface Window {
    __API_URL__?: string;
  }
}

// Read API URL from runtime config.js, then build-time env, then relative '/api'
const getBaseURL = () => {
  if (typeof window !== 'undefined' && window.__API_URL__) {
    return window.__API_URL__;
  }
  return import.meta.env.VITE_API_URL || '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to dynamic update baseURL if window.__API_URL__ was set
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined' && window.__API_URL__ && config.baseURL !== window.__API_URL__) {
    config.baseURL = window.__API_URL__;
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
        `[JaheshKar API] Received HTML instead of JSON for ${response.config.url}. Check window.__API_URL__ in config.js!`
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
  (error) => Promise.reject(error)
);

export default api;
