import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { SiteSetting } from '../types';

interface SiteSettingsContextType {
  settings: SiteSetting | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const defaultSettings: SiteSetting = {
  site_title: 'جهش کار',
  logo_url: null,
  hero_badge: 'پلتفرم ورود به بازار کار و اشتغال',
  hero_title: 'شروع یادگیری مهارتی، ورود سریع به بازار کار',
  hero_subtitle: 'با دوره‌های تخصصی، پروژه‌محور و مهارت‌های موردنیاز صنعت، مسیر شغلی خود را سریع‌تر و مطمئن‌تر بسازید.',
  features_badge: 'چرا یادگیری با جهش کار؟',
  features_title: 'از آموزش تئوری خسته شدید؟ اینجا فقط روی پروژه‌های واقعی کار می‌کنید',
  features_subtitle: 'تمام دوره‌ها متناسب با نیاز روز بازار کار و به همراه پشتیبانی مستقیم مدرسان و فایل‌های سورس‌کد تهیه شده‌اند.',
  contact_phone: '۰۲۱-۹۱۰۰۰۰۰۰',
  contact_email: 'support@jaheshkar.ir',
  telegram_url: 'https://t.me/jaheshkar',
  instagram_url: '',
  footer_about: 'جهش کار پلتفرم آموزش آنلاین و تخصصی مهارت‌های اشتغال است. ما به شما کمک می‌کنیم تا مسیر تبدیل شدن از یک مبتدی به یک فرد متخصص را در کوتاه‌ترین زمان ممکن طی کنید.',
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refetch: async () => {},
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSetting>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/core/settings/');
      if (res.data && typeof res.data === 'object' && res.data.site_title) {
        setSettings(res.data);
      }
    } catch (err) {
      console.warn('Failed to load dynamic site settings, falling back to default:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refetch: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
