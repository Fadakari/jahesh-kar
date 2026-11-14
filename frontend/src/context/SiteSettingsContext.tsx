import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { SiteSetting } from '../types';

interface SiteSettingsContextType {
  settings: SiteSetting | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const defaultSettings: SiteSetting = {
  site_title: 'یاسین دهقان',
  logo_url: '/logo.png',
  hero_badge: 'آکادمی تخصصی یاسین دهقان',
  hero_title: 'شروع یادگیری مهارتی، ورود سریع به بازار کار',
  hero_subtitle: 'با دوره‌های تخصصی، پروژه‌محور و مهارت‌های موردنیاز صنعت با تدریس یاسین دهقان، مسیر شغلی خود را مطمئن‌تر بسازید.',
  features_badge: 'چرا یادگیری با یاسین دهقان؟',
  features_title: 'از آموزش تئوری خسته شدید؟ اینجا فقط روی پروژه‌های واقعی کار می‌کنید',
  features_subtitle: 'تمام دوره‌ها متناسب با نیاز روز بازار کار و به همراه پشتیبانی مستقیم مدرسان و فایل‌های سورس‌کد تهیه شده‌اند.',
  contact_phone: '۰۲۱-۹۱۰۰۰۰۰۰',
  contact_email: 'support@yasindehqan.ir',
  telegram_url: 'https://t.me/yasindehqan',
  instagram_url: '',
  footer_about: 'آکادمی یاسین دهقان مرجع تخصصی دوره‌های مهارتی و پروژه‌محور برای ورود به بازار کار تکنولوژی و کسب درآمد است. ما فاصله بین یادگیری تئوری و اجرای پروژه‌های واقعی را به حداقل رسانده‌ایم.',
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
