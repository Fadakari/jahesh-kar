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
  academy_scope: 'آکادمی تخصصی مهارت و یادگیری',
  logo_url: '/logo.png',
  announcement_active: true,
  announcement_badge: 'پیشنهاد ویژه',
  announcement_text: 'تخفیف ویژه دوره‌ها به مناسبت شروع فصل جدید آکادمی یاسین دهقان - دسترسی نامحدود به ویدیوها و منابع',
  announcement_link: '/courses',
  hero_badge: 'آکادمی تخصصی یاسین دهقان',
  hero_title: 'یادگیری عمیق، کاربردی و مهارت‌های مورد نیاز بازار کار',
  hero_subtitle: 'مسیر یادگیری طراحی شده بر پایه تجربیات عملی و نیازهای واقعی روز؛ بدون اتلاف وقت، مستقیم مهارت‌های اصلی را بیاموزید و به کار ببندید.',
  hero_cta_primary_text: 'مشاهده دوره‌های تخصصی',
  hero_cta_primary_link: '/courses',
  hero_cta_secondary_text: 'دوره‌های رایگان و آزمایشی',
  hero_cta_secondary_link: '/courses?price=free',
  hero_image_url: null,
  hero_preview_badge: 'متدولوژی اختصاصی آموزش',
  hero_preview_title: 'آموزش کاربردی با پشتیبانی مستقیم مدرس',
  hero_preview_subtitle: 'جلسات ویدیویی گام‌به‌گام با دسترسی همیشگی، تمرین‌های عملی و رفع اشکال مستمر.',
  hero_tagline_1: 'سرفصل‌های کاربردی و منطبق با نیاز روز',
  hero_tagline_2: 'پشتیبانی و رفع اشکال اختصاصی توسط مدرس',
  hero_tagline_3: 'دسترسی نامحدود و همیشگی به ویدیوها و منابع',
  stat_1_number: '+۱۲,۰۰۰',
  stat_1_label: 'دانشجوی فعال و رضایتمند',
  stat_2_number: '+۸۵ ساعت',
  stat_2_label: 'آموزش کاملاً کاربردی و مهارتی',
  stat_3_number: '۹۸.۸٪',
  stat_3_label: 'رضایت دانشجویان از کیفیت تدریس',
  stat_4_number: '۱۰۰٪',
  stat_4_label: 'آمادگی برای ورود به بازار کار و ارتقای شغلی',
  features_badge: 'چرا آکادمی یاسین دهقان؟',
  features_title: 'ویژگی‌های متمایز دوره‌های آموزشی ما چیست؟',
  features_subtitle: 'ما به جای آموزش‌های کش‌دار و تئوری‌های بی‌استفاده، روی مهارت‌هایی تمرکز می‌کنیم که مستقیماً در کار و فعالیت حرفه‌ای به آنها نیاز دارید.',
  steps_active: true,
  steps_badge: 'مسیر یادگیری تا تسلط',
  steps_title: 'مسیر گام‌به‌گام یادگیری و رسیدن به هدف',
  steps_subtitle: 'این همان مسیری است که با برداشتن هر گام، یک سطح به تسلط کامل و نتیجه مطلوب نزدیک‌تر می‌شوید.',
  contact_phone: '۰۲۱-۹۱۰۰۰۰۰۰',
  contact_email: 'info@yasindehqan.ir',
  telegram_url: 'https://t.me/yasindehqan',
  instagram_url: '',
  footer_about: 'آکادمی یاسین دهقان مرجع تخصصی دوره‌های مهارتی و کاربردی برای ارتقای توانمندی‌ها و ورود به بازار کار است. ما فاصله بین یادگیری تئوری و اجرای عملی را به حداقل رسانده‌ایم.',
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
