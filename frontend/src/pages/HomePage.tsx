import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Course, Category, SiteFeature, Testimonial } from '../types';
import { CourseCard } from '../components/CourseCard';
import { FaqSection } from '../components/FaqSection';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { 
  ArrowLeft, 
  BookOpen, 
  Code2, 
  Cpu, 
  Palette, 
  Briefcase, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Terminal, 
  Layers, 
  RefreshCw, 
  Headphones, 
  Star, 
  X, 
  ExternalLink, 
  Send, 
  Phone, 
  Sparkles,
  Rocket,
  Check,
  FileCode2,
  FolderGit2
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  Code2,
  Cpu,
  Palette,
  Briefcase,
  BookOpen,
};

const featureIcons: Record<string, any> = {
  code: Terminal,
  mentor: Headphones,
  project: FolderGit2,
  update: RefreshCw,
  speed: Rocket,
  shield: ShieldCheck,
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [features, setFeatures] = useState<SiteFeature[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'backend' | 'frontend'>('backend');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, catRes, featRes, testRes] = await Promise.all([
          api.get('/courses/'),
          api.get('/courses/categories/'),
          api.get('/core/features/'),
          api.get('/core/testimonials/'),
        ]);
        setCourses(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
        setCategories(Array.isArray(catRes?.data) ? catRes.data : []);
        setFeatures(Array.isArray(featRes?.data) ? featRes.data : []);
        setTestimonials(Array.isArray(testRes?.data) ? testRes.data : []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      
      {/* 1. Dynamic Top Announcement Ribbon (نوار اعلان بالای صفحه) */}
      {settings?.announcement_active && !announcementDismissed && (
        <aside aria-label="اعلان و پیشنهاد ویژه" className="bg-gradient-to-r from-brand-navy via-indigo-950 to-brand-blue text-white text-xs sm:text-sm py-2.5 px-4 shadow-sm border-b border-indigo-500/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {settings.announcement_badge}
              </span>
              <p className="truncate font-medium text-slate-200">
                {settings.announcement_text}
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              {settings.announcement_link && (
                <Link
                  to={settings.announcement_link}
                  className="font-bold text-cyan-300 hover:text-white flex items-center gap-1 transition-colors text-xs underline underline-offset-4"
                >
                  <span>مشاهده</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              )}
              <button
                onClick={() => setAnnouncementDismissed(true)}
                className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
                title="بستن اعلان"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Bespoke Editorial Hero Section (هیرو نامتقارن و صنعتی) */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14">
        {/* Subtle architectural background grid - not generic blurry blob */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#000a4d08_1px,transparent_1px),linear-gradient(to_bottom,#000a4d08_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Right Column: High-Impact Typography & Action (ستون محتوا و تیترها) */}
            <div className="lg:col-span-7 space-y-6 text-right">
              
              {/* Verified Instructor Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50/90 border border-indigo-200/70 text-indigo-900 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span>{settings?.hero_badge || 'آکادمی تخصصی برنامه‌نویسی و مهارت یاسین دهقان'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.25] sm:leading-[1.25]">
                {settings?.hero_title || 'یادگیری عمیق، پروژه‌محور و ورود سریع به بازار کار تکنولوژی'}
              </h1>

              {/* Editorial Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                {settings?.hero_subtitle || 'مسیر یادگیری طراحی شده بر پایه نیازهای واقعی استخدام؛ بدون مباحث تئوری اضافه، مستقیماً سورس‌کدهای پروژه‌های تجاری را پیاده‌سازی کنید.'}
              </p>

              {/* Dual Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to={settings?.hero_cta_primary_link || '/courses'}
                  className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{settings?.hero_cta_primary_text || 'مشاهده دوره‌های تخصصی'}</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>

                <Link
                  to={settings?.hero_cta_secondary_link || '/courses?price=free'}
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300/80 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>{settings?.hero_cta_secondary_text || 'دوره‌های رایگان و نمونه درس‌ها'}</span>
                </Link>
              </div>

              {/* Trust & Proof Stack */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600 border-t border-slate-200/70">
                {/* Overlapping student avatar circles */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-700 text-white font-bold ring-2 ring-white text-[11px]">ع.ح</span>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-700 text-white font-bold ring-2 ring-white text-[11px]">م.م</span>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-white font-bold ring-2 ring-white text-[11px]">پ.ر</span>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-900 text-white font-bold ring-2 ring-white text-[11px]">س.ا</span>
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-sm">+{settings?.stat_1_number || '۱۲,۰۰۰'} دانشجو</div>
                    <div className="text-[11px] text-slate-500">مشغول یادگیری و فعالیت در بازار</div>
                  </div>
                </div>

                <div className="h-7 w-px bg-slate-200 hidden sm:block" />

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-800 text-sm">۴.۹</span>
                  <span className="text-[11px] text-slate-500">(بیش از ۸۰۰ نظر ثبت‌شده)</span>
                </div>

                <div className="h-7 w-px bg-slate-200 hidden sm:block" />

                {/* Mentorship indicator */}
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>پشتیبانی مستقیم یاسین دهقان</span>
                </div>
              </div>

            </div>

            {/* Left Column: Interactive Real Code IDE Window (پنجره ادیتور کد و پیش‌نمایش پروژه) */}
            <div className="lg:col-span-5 relative">
              
              {/* Sleek Dark Tech Card */}
              <div className="rounded-3xl bg-[#000a4d] text-slate-200 shadow-2xl shadow-indigo-950/20 border border-indigo-900/60 overflow-hidden text-left" dir="ltr">
                
                {/* IDE Window Title Bar */}
                <div className="bg-[#050b20] px-4 py-3 border-b border-indigo-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  
                  {/* File Tabs */}
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      onClick={() => setActiveCodeTab('backend')}
                      className={`px-3 py-1 rounded-lg font-mono transition-colors ${
                        activeCodeTab === 'backend'
                          ? 'bg-indigo-950 text-cyan-300 border border-indigo-700/50'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      server.py
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('frontend')}
                      className={`px-3 py-1 rounded-lg font-mono transition-colors ${
                        activeCodeTab === 'frontend'
                          ? 'bg-indigo-950 text-cyan-300 border border-indigo-700/50'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      App.tsx
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">UTF-8</span>
                </div>

                {/* Code Body */}
                <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-indigo-700">
                  {activeCodeTab === 'backend' ? (
                    <pre className="text-slate-300">
                      <code>
                        <span className="text-slate-500"># Production-grade Clean Architecture</span>{'\n'}
                        <span className="text-indigo-300">from</span> core.services <span className="text-indigo-300">import</span> SmsOTP, PaymentGateway{'\n'}
                        <span className="text-indigo-300">from</span> rest_framework.response <span className="text-indigo-300">import</span> Response{'\n'}
                        {'\n'}
                        <span className="text-cyan-400">@api_view</span>([<span className="text-emerald-300">'POST'</span>]){'\n'}
                        <span className="text-indigo-300">def</span> <span className="text-amber-300">enroll_student</span>(request, course_id):{'\n'}
                        {'    '}student = request.user{'\n'}
                        {'    '}order = PaymentGateway.create_order({'\n'}
                        {'        '}user=student,{'\n'}
                        {'        '}course_id=course_id,{'\n'}
                        {'        '}provider=<span className="text-emerald-300">'Zarinpal'</span>{'\n'}
                        {'    '}){'\n'}
                        {'    '}SmsOTP.send_welcome(student.phone){'\n'}
                        {'    '}<span className="text-indigo-300">return</span> Response({'{'}{'\n'}
                        {'        '}<span className="text-emerald-300">'status'</span>: <span className="text-emerald-300">'SUCCESS'</span>,{'\n'}
                        {'        '}<span className="text-emerald-300">'career_ready'</span>: <span className="text-cyan-300">True</span>,{'\n'}
                        {'        '}<span className="text-emerald-300">'mentor'</span>: <span className="text-emerald-300">'Yasin Dehqan'</span>{'\n'}
                        {'    '}{'}'})
                      </code>
                    </pre>
                  ) : (
                    <pre className="text-slate-300">
                      <code>
                        <span className="text-slate-500">// Modern High-Speed React 18 & TypeScript</span>{'\n'}
                        <span className="text-indigo-300">export const</span> <span className="text-amber-300">CareerPath</span> = () =&gt; {'{'}{'\n'}
                        {'  '}<span className="text-indigo-300">const</span> {'{'} user {'}'} = useAuth();{'\n'}
                        {'  '}<span className="text-indigo-300">const</span> [projects, setProjects] = useState([]);{'\n'}
                        {'\n'}
                        {'  '}&lt;<span className="text-cyan-400">div</span> className=<span className="text-emerald-300">"grid grid-cols-2 gap-4"</span>&gt;{'\n'}
                        {'    '}&lt;<span className="text-cyan-400">CourseVideoPlayer</span> autoNext=<span className="text-cyan-300">{'{true}'}</span> /&gt;{'\n'}
                        {'    '}&lt;<span className="text-cyan-400">GitHubRepoSync</span> commits=<span className="text-amber-300">{'{projects}'}</span> /&gt;{'\n'}
                        {'  '}&lt;/<span className="text-cyan-400">div</span>&gt;{'\n'}
                        {'}'};
                      </code>
                    </pre>
                  )}
                </div>

                {/* Bottom Status Ribbon */}
                <div className="bg-[#050b20] px-4 py-2.5 border-t border-indigo-900/40 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Yasin Dehqan Academy Engine v2.0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-300 font-mono">100% Production Ready</span>
                  </div>
                </div>

              </div>

              {/* Floating Overlay Badge on Hero Editor Card (به زبان فارسی) */}
              <div 
                className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl max-w-xs text-right space-y-1.5"
                dir="rtl"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-900">سورس‌کدهای تست شده در بازار</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  بدون نمونه‌های ساده تئوری؛ مستقیم پروژه‌های آماده ارائه به شرکت‌ها را پیاده‌سازی می‌کنید.
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-[10px] font-bold text-indigo-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>پروژه‌های پایان‌دوره با ارزش تجاری</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Integrated Trust Metrics Strip (نوار آمار و اعتبار سنجی داینامیک) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-800">
            
            <div className="pt-4 lg:pt-0 lg:px-6 text-center sm:text-right space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">
                {settings?.stat_1_number || '+۱۲,۰۰۰'}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-300">
                {settings?.stat_1_label || 'دانشجوی فعال و رضایتمند'}
              </div>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-6 text-center sm:text-right space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400 tracking-tight">
                {settings?.stat_2_number || '+۸۵ ساعت'}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-300">
                {settings?.stat_2_label || 'آموزش کاملاً پروژه‌محور'}
              </div>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-6 text-center sm:text-right space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                {settings?.stat_3_number || '۹۸.۸٪'}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-300">
                {settings?.stat_3_label || 'رضایت دانشجویان از کیفیت تدریس'}
              </div>
            </div>

            <div className="pt-4 lg:pt-0 lg:px-6 text-center sm:text-right space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                {settings?.stat_4_number || '۱۰۰٪'}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-300">
                {settings?.stat_4_label || 'آمادگی برای استخدام و جذب پروژه'}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Bento Grid of Academy Strengths (مزیت‌های رقابتی آکادمی - کاملاً داینامیک از بک‌اند) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>{settings?.features_badge || 'چرا آکادمی یاسین دهقان؟'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
            {settings?.features_title || 'تفاوت آموزش آکادمیک با تجربه واقعی بازار کار چیست؟'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {settings?.features_subtitle || 'ما به جای آموزش‌های کش‌دار و تئوری‌های بی‌استفاده، سناریوهایی را حل می‌کنیم که هر روز در شرکت‌های نرم‌افزاری و پروژه‌های فریلنسری با آن‌ها مواجه می‌شوید.'}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.length > 0 ? (
            features.map((feature, idx) => {
              const IconComponent = featureIcons[feature.icon_type] || Terminal;
              return (
                <div
                  key={feature.id || idx}
                  className="group p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      {feature.badge && (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                          {feature.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {feature.tag && (
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{feature.tag}</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            // Fallback skeleton if loading
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="p-6 rounded-3xl bg-white border border-slate-100 animate-pulse space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                <div className="h-16 bg-slate-200 rounded-md" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. Practical 3-Step Methodology (متدولوژی ۳ گامی رسیدن به درآمد) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-cyan-50/50 border border-indigo-100/80 p-8 sm:p-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
              مسیر تضمین شده موفقیت
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              ۳ گام ساده تا بستن اولین قرارداد کاری یا استخدام
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              این همان نقشه‌راهی است که صدها دانشجوی آکادمی یاسین دهقان با آن وارد بازار کار شدند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                ۰۱
              </div>
              <h3 className="text-base font-black text-slate-900">
                تسلط بر نیازمندی‌های روز صنعت
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                به جای یادگیری سرسری مفاهیم، ساختار پروژه‌های واقعی، کلین کد و ارتباط استاندارد بین بخش‌های مختلف نرم‌افزار را می‌آموزید.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white font-black text-sm flex items-center justify-center">
                ۰۲
              </div>
              <h3 className="text-base font-black text-slate-900">
                پیاده‌سازی پورتفولیو و سورس‌کد تجاری
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                همراه یاسین دهقان، یک پروژه واقعی با احراز هویت پیامکی، درگاه پرداخت، پنل ادمین و دیتابیس را پیاده‌سازی و روی گیت‌هاب دیپلوی می‌کنید.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                ۰۳
              </div>
              <h3 className="text-base font-black text-slate-900">
                پشتیبانی، رزومه‌سازی و درآمدزایی
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                با رفع اشکال مستقیم در گروه اختصاصی تلگرام و هدایت رزومه، در مصاحبه‌های استخدامی و مناقصات فریلنسری با دست پر حاضر می‌شوید.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Featured Courses Section (دوره‌های برگزیده بازار کار) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>پرمخاطب‌ترین دوره‌های آکادمی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">دوره‌های تخصصی ورود به بازار کار</h2>
          </div>
          <Link
            to="/courses"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors w-fit flex items-center gap-1.5 shadow-md"
          >
            مشاهده همه دوره‌ها ({courses.length})
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-4 border border-slate-100 animate-pulse space-y-4">
                <div className="aspect-video bg-slate-200 rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                <div className="h-3 bg-slate-200 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.slice(0, 4).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>

      {/* 7. Student Success Stories & Testimonials (نظرات و تجربیات دانشجویان - کاملاً داینامیک) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>داستان‌های واقعی موفقیت</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            تجربه دانشجویان از دوره‌های یاسین دهقان
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            دانشجویانی که مهارت‌هایشان را ارتقا دادند و توانستند در شرکت‌های معتبر استخدام شوند یا پروژه‌های بین‌المللی بگیرند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.length > 0 ? (
            testimonials.map((t, idx) => (
              <div
                key={t.id || idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    «{t.comment}»
                  </p>
                </div>

                {/* Student Info */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-xs">
                    {t.avatar_initials || t.student_name.slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.student_name}</h4>
                    <p className="text-[11px] text-slate-500">{t.student_role}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            [1, 2, 3].map((n) => (
              <div key={n} className="p-6 rounded-3xl bg-white border border-slate-100 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                <div className="h-16 bg-slate-200 rounded-md" />
                <div className="h-8 bg-slate-200 rounded-full w-1/2" />
              </div>
            ))
          )}
        </div>

      </section>

      {/* 8. Direct Mentorship & Telegram Banner (ارتباط مستقیم با یاسین دهقان) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-navy via-indigo-950 to-brand-blue text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              پشتیبانی مستقیم و بی‌واسطه
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-snug">
              هیچ سوالی بی‌پاسخ نمی‌ماند؛ ارتباط مستقیم با یاسین دهقان
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              با ثبت‌نام در دوره‌ها، به گروه اختصاصی رفع اشکال تلگرام متصل می‌شوید و کدهایتان را مستقیماً با خود یاسین دهقان بررسی و دیباگ می‌کنید.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              {settings?.telegram_url && (
                <a
                  href={settings.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-white text-indigo-950 font-black text-sm hover:bg-slate-100 transition-colors shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>عضویت در کانال و پشتیبانی تلگرام</span>
                </a>
              )}
              {settings?.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone.replace(/[^0-9]/g, '')}`}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-cyan-300" />
                  <span>مشاوره تلفنی: {settings.contact_phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Dynamic FAQs Section */}
      <FaqSection />

    </div>
  );
};
