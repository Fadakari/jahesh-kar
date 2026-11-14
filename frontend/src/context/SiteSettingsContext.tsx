import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { SiteSetting } from '../types';

interface SiteSettingsContextType {
  settings: SiteSetting;
  loading: boolean;
  refetch: () => Promise<void>;
}

const defaultSettings: SiteSetting = {
  site_title: 'یاسین دهقان',
  logo_url: '/logo.png',
  announcement_active: true,
  announcement_badge: 'پیشنهاد ویژه',
  announcement_text: 'تخفیف ویژه دوره‌ها به مناسبت شروع فصل جدید آکادمی یاسین دهقان - دسترسی نامحدود به ویدیوها و سورس‌کدها',
  announcement_link: '/courses',
  hero_badge: 'آکادمی تخصصی برنامه‌نویسی و مهارت یاسین دهقان',
  hero_title: 'یادگیری عمیق، پروژه‌محور و ورود سریع به بازار کار تکنولوژی',
  hero_subtitle: 'مسیر یادگیری طراحی شده بر پایه نیازهای واقعی استخدام؛ بدون مباحث تئوری اضافه، مستقیماً سورس‌کدهای پروژه‌های تجاری را پیاده‌سازی کنید.',
  hero_cta_primary_text: 'مشاهده دوره‌های تخصصی',
  hero_cta_primary_link: '/courses',
  hero_cta_secondary_text: 'دوره‌های رایگان و نمونه درس‌ها',
  hero_cta_secondary_link: '/courses',
  stat_1_number: '+۱۲,۰۰۰',
  stat_1_label: 'دانشجوی فعال و رضایتمند',
  stat_2_number: '+۸۵ ساعت',
  stat_2_label: 'آموزش کاملاً پروژه‌محور',
  stat_3_number: '۹۸.۸٪',
  stat_3_label: 'رضایت دانشجویان از کیفیت تدریس',
  stat_4_number: '۱۰۰٪',
  stat_4_label: 'آمادگی برای استخدام و جذب پروژه',
  features_badge: 'چرا آکادمی یاسین دهقان؟',
  features_title: 'تفاوت آموزش آکادمیک با تجربه واقعی بازار کار چیست؟',
  features_subtitle: 'ما به جای آموزش‌های کش‌دار و تئوری‌های بی‌استفاده، سناریوهایی را حل می‌کنیم که هر روز در شرکت‌های نرم‌افزاری و پروژه‌های فریلنسری با آن‌ها مواجه می‌شوید.',
  contact_phone: '۰۲۱-۹۱۰۰۰۰۰۰',
  contact_email: 'info@yasindehqan.ir',
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
        setSettings({
          ...defaultSettings,
          ...res.data,
        });
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
