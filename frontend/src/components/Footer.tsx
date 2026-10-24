import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Sparkles, ShieldCheck, Headphones, Award, Heart, Phone, Mail, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-24 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">تضمین کیفیت آموزش</h4>
              <p className="text-xs text-slate-400 mt-1">سرفصل‌های منطبق با جدیدترین نیاز بازار کار</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">دسترسی همیشگی به ویدیوها</h4>
              <p className="text-xs text-slate-400 mt-1">مشاهده آنلاین و نامحدود در هر زمان و دستگاه</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">پشتیبانی و پاسخگویی</h4>
              <p className="text-xs text-slate-400 mt-1">همراهی با شما تا رسیدن به نتیجه مطلوب</p>
            </div>
          </div>
        </div>

        {/* Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.site_title || 'جهش کار'}
                  className="h-10 w-auto max-w-[160px] object-contain brightness-0 invert"
                />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-white">{settings?.site_title || 'جهش کار'}</span>
                </>
              )}
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {settings?.footer_about || 'جهش کار مرجع تخصصی دوره‌های مهارتی و پروژه‌محور برای ورود پرقدرت به بازار کار تکنولوژی و کسب درآمد است. ما فاصله بین یادگیری تئوری و شغل واقعی را به حداقل رسانده‌ایم.'}
            </p>

            {/* Dynamic Contacts */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              {settings?.contact_phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span dir="ltr">{settings.contact_phone}</span>
                </div>
              )}
              {settings?.contact_email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{settings.contact_email}</span>
                </div>
              )}
              {settings?.telegram_url && (
                <a
                  href={settings.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sky-400 hover:underline"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>کانال تلگرام</span>
                </a>
              )}
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-base mb-4">دسترسی سریع</h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">لیست همه دوره‌ها</Link>
              </li>
              <li>
                <Link to="/courses?price=free" className="hover:text-indigo-400 transition-colors">دوره‌های رایگان</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">ورود / ثبت‌نام</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400 transition-colors">پنل کاربری و دوره‌های من</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-white font-bold text-base mb-2">نماد اعتماد الکترونیکی</h5>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 inline-flex items-center justify-center hover:bg-white/20 transition-all [&_img]:w-24 [&_img]:h-24 [&_img]:bg-white [&_img]:rounded-xl [&_img]:p-1">
              <div
                dangerouslySetInnerHTML={{
                  __html: `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=752620&Code=1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=752620&Code=1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq' alt='' style='cursor:pointer' code='1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq'></a>`
                }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              دارای نماد اعتماد الکترونیکی معتبر از مرکز توسعه تجارت الکترونیکی
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© تمامی حقوق مادی و معنوی برای «{settings?.site_title || 'جهش کار'}» محفوظ است.</p>
          <div className="flex items-center gap-1">
            <span>توسعه یافته با</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>برای ارتقای دانش متخصصان فارسی زبان</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
