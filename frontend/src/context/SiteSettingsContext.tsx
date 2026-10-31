import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { SiteSetting } from '../types';

interface SiteSettingsContextType {
  settings: SiteSetting | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const defaultSettings: SiteSetting = {
  site_title: 'آواز آموز',
  logo_url: null,
  hero_badge: 'نخستین آکادمی تخصصی آموزش مداحی و صداسازی مذهبی',
  hero_title: 'آموزش اصولی مداحی، فن بیان و صداسازی با اساتید برجسته',
  hero_subtitle: 'از پرورش و تقویت حنجره تا تسلط بر دستگاه‌های آوازی، مقتل‌خوانی، نوحه‌سرایی و مجلس‌داری را به صورت گام‌به‌گام بیاموزید.',
  features_badge: 'چرا آکادمی آواز آموز؟',
  features_title: 'تربیت ذاکران و مداحان اهل‌بیت با اصیل‌ترین متدهای صوتی و معرفتی',
  features_subtitle: 'آموزش‌های کاربردی متناسب با اصول صداسازی علمی، لحن‌شناسی، ادعیه‌خوانی و آداب نوکری به همراه رفع اشکال و تمرین‌های صوتی هدفمند.',
  contact_phone: '۰۲۱-۹۱۰۰۰۰۰۰',
  contact_email: 'info@avazamouz.ir',
  telegram_url: 'https://t.me/avazamouz',
  instagram_url: '',
  footer_about: 'آواز آموز، مرجع تخصصی آموزش نوین و اصولی مداحی، صداسازی و فن بیان مذهبی است. رسالت ما توانمندسازی علاقه‌مندان به ستایشگری اهل‌بیت (ع) با تکیه بر علم صداسازی و اصالت‌های سنتی است.',
  enamad_html: "<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=752620&Code=1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=752620&Code=1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq' alt='' style='cursor:pointer' code='1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq'></a>",
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
