import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Headphones, Award, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
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
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">جهش کار</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              جهش کار مرجع تخصصی دوره‌های مهارتی و پروژه‌محور برای ورود پرقدرت به بازار کار تکنولوژی و کسب درآمد است. ما فاصله بین یادگیری تئوری و شغل واقعی را به حداقل رسانده‌ایم.
            </p>
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

          <div>
            <h5 className="text-white font-bold text-base mb-4">ارتباط با ما</h5>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              جهت هرگونه سوال یا راهنمایی پیرامون ثبت نام در دوره‌ها با ما در ارتباط باشید:
            </p>
            <div className="space-y-2 text-sm text-slate-300 font-medium">
              <div>تلفن تماس: ۰۲۱-۸۸۸۸۹۹۹۹</div>
              <div>ایمیل: support@jaheshkar.ir</div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© تمامی حقوق مادی و معنوی برای «جهش کار» محفوظ است.</p>
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
