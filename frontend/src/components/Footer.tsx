import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Award, Headphones, Phone, Mail, Send, Sparkles, Music } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  const defaultEnamad = `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=752620&Code=1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=752620&Code=1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq' alt='' style='cursor:pointer' code='1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq'></a>`;

  return (
    <footer className="bg-[#051712] text-stone-300 pt-16 pb-12 mt-24 border-t border-amber-900/20 relative overflow-hidden">
      {/* Delicate background ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(217,119,6,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Features bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-emerald-900/50">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-950/50 border border-amber-500/20 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">آموزش اصولی و علمی</h4>
              <p className="text-xs text-stone-400 mt-1">سرفصل‌های منطبق با استاندارد صداسازی و الحان کهن</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-950/50 border border-emerald-800/40 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">دسترسی نامحدود و مادام‌العمر</h4>
              <p className="text-xs text-stone-400 mt-1">مشاهده جلسات با اینترنت نیم‌بهاء و بدون محدودیت زمانی</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-950/50 border border-teal-800/40 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">پشتیبانی و رفع اشکال صوتی</h4>
              <p className="text-xs text-stone-400 mt-1">ارسال فایل صوتی و بررسی تکنیک تحریر توسط اساتید</p>
            </div>
          </div>
        </div>

        {/* Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          <div className="md:col-span-2 space-y-4">
            <BrandLogo variant="dark" size="md" />
            <p className="text-stone-400 text-sm leading-relaxed max-w-md mt-3">
              {settings?.footer_about || 'آواز آموز، مرجع تخصصی آموزش نوین و اصولی مداحی، صداسازی و فن بیان مذهبی است. رسالت ما توانمندسازی علاقه‌مندان به ستایشگری اهل‌بیت (ع) با تکیه بر علم صداسازی و اصالت‌های سنتی است.'}
            </p>

            {/* Dynamic Contacts */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-stone-300">
              {settings?.contact_phone && (
                <div className="flex items-center gap-1.5 bg-emerald-950/70 px-3.5 py-2 rounded-xl border border-emerald-800/50">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span dir="ltr">{settings.contact_phone}</span>
                </div>
              )}
              {settings?.contact_email && (
                <div className="flex items-center gap-1.5 bg-emerald-950/70 px-3.5 py-2 rounded-xl border border-emerald-800/50">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>{settings.contact_email}</span>
                </div>
              )}
              {settings?.telegram_url && (
                <a
                  href={settings.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 bg-emerald-950/70 px-3.5 py-2 rounded-xl border border-amber-500/30 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>کانال تلگرام آواز آموز</span>
                </a>
              )}
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              دسترسی سریع
            </h5>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/courses" className="hover:text-amber-300 transition-colors">بانک دوره‌های مداحی</Link>
              </li>
              <li>
                <a href="#maqamat" className="hover:text-amber-300 transition-colors">آزمایشگاه نغمه‌شناسی</a>
              </li>
              <li>
                <Link to="/courses?price=free" className="hover:text-amber-300 transition-colors">آموزش‌های صوتی رایگان</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-300 transition-colors">ورود به حساب کاربری</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-amber-300 transition-colors">میز کار و دوره‌های من</Link>
              </li>
            </ul>
          </div>

          {/* Dynamic Enamad Section */}
          <div className="space-y-4">
            <h5 className="text-white font-bold text-base mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              نماد اعتماد الکترونیکی
            </h5>
            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-500/30 inline-flex items-center justify-center hover:bg-white/10 transition-all [&_img]:w-24 [&_img]:h-24 [&_img]:bg-white [&_img]:rounded-xl [&_img]:p-1 shadow-lg shadow-black/30">
              <div
                dangerouslySetInnerHTML={{
                  __html: settings?.enamad_html || defaultEnamad
                }}
              />
            </div>
            <p className="text-[11px] text-stone-400 leading-normal">
              دارای تاییدیه و نماد اعتماد الکترونیکی معتبر جهت ثبت‌نام و خرید امن دوره‌ها
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© تمامی حقوق مادی و معنوی برای آکادمی «{settings?.site_title || 'آواز آموز'}» محفوظ است.</p>
          <div className="flex items-center gap-1.5 text-amber-400/90 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ویژه علاقه‌مندان به ستایشگری و نوکری آستان اهل‌بیت (ع)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
