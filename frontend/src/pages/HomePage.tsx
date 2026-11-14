import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Course, Category, SiteFeature, LearningStep, Testimonial } from '../types';
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
  RefreshCw, 
  Headphones, 
  Star, 
  X, 
  Send, 
  Phone, 
  Rocket, 
  Check, 
  Award, 
  Flame, 
  GraduationCap 
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  Code2,
  Cpu,
  Palette,
  Briefcase,
  BookOpen,
  GraduationCap,
};

const featureIcons: Record<string, any> = {
  practical: Flame,
  mentor: Headphones,
  star: Award,
  update: RefreshCw,
  speed: Rocket,
  shield: ShieldCheck,
  certificate: GraduationCap,
  community: Users,
  code: Terminal,
};

const defaultFeatures: SiteFeature[] = [
  {
    id: 1,
    title: 'آموزش کاربردی و تمرین‌محور',
    description: 'دوره‌ها بر مبنای نیازهای واقعی و عملی طراحی شده‌اند؛ یاد می‌گیرید چطور تکنیک‌ها و اصول را مستقیماً اجرا کنید.',
    badge: 'تمرین عملی',
    tag: 'حل سناریوهای واقعی و مهارتی',
    icon_type: 'practical',
    order: 1,
  },
  {
    id: 2,
    title: 'پشتیبانی مستقیم و رفع اشکال',
    description: 'ارتباط مستقیم با یاسین دهقان و تیم پشتیبانی؛ هیچ سوال و ابهامی در طول مسیر یادگیری بی‌پاسخ نمی‌ماند.',
    badge: 'همراهی مستمر',
    tag: 'پاسخگویی سریع و راهنمایی گام‌به‌گام',
    icon_type: 'mentor',
    order: 2,
  },
  {
    id: 3,
    title: 'دسترسی همیشگی و آپدیت رایگان',
    description: 'با ثبت‌نام در هر دوره، دسترسی مادام‌العمر به فایل‌ها، چک‌لیست‌ها و آپدیت‌های تکمیلی دوره خواهید داشت.',
    badge: 'سرمایه‌گذاری پایدار',
    tag: 'مشاهده آنلاین و نامحدود در هر زمان',
    icon_type: 'update',
    order: 3,
  },
  {
    id: 4,
    title: 'آمادگی ورود به بازار کار و ارتقای مهارت',
    description: 'تمام سرفصل‌ها با تمرکز بر درآمدزایی، جذب پروژه یا ارتقای جایگاه شغلی تدوین شده است.',
    badge: 'نتیجه‌محور',
    tag: 'توسعه فردی و حرفه‌ای',
    icon_type: 'certificate',
    order: 4,
  },
];

const defaultSteps: LearningStep[] = [
  {
    id: 1,
    step_number: '۰۱',
    title: 'تسلط بر مبانی و اصول کاربردی',
    description: 'بدون حاشیه و تئوری‌های خسته‌کننده، اصول اولیه و کلیدی مهارت را به زبان ساده و روان یاد می‌گیرید.',
    badge: 'پایه‌ریزی اصولی',
    order: 1,
  },
  {
    id: 2,
    step_number: '۰۲',
    title: 'تمرین عملی و اجرای سناریوها',
    description: 'همراه با مدرس، مباحث را به شکل عملی تمرین کرده و چالش‌های واقعی را گام‌به‌گام حل می‌کنید.',
    badge: 'تثبیت مهارت',
    order: 2,
  },
  {
    id: 3,
    step_number: '۰۳',
    title: 'رفع اشکال، خروجی‌گیری و ورود به بازار',
    description: 'با رفع اشکال مستمر و بازخورد مستقیم مدرس، آماده اجرای مستقل پروژه‌ها و کسب درآمد می‌شوید.',
    badge: 'تسلط کامل',
    order: 3,
  },
];

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    student_name: 'علیرضا حسینی',
    student_role: 'دانشجوی دوره جامع',
    avatar_initials: 'ع.ح',
    comment: 'رویکرد عملی دوره یاسین دهقان واقعاً شگفت‌انگیز بود. بدون حاشیه مستقیم رفتیم سراغ اصل موضوع و بعد از اتمام دوره تونستم نتایج فوق‌العاده‌ای در کارم بگیرم.',
    rating: 5,
    order: 1,
  },
  {
    id: 2,
    student_name: 'مهسا محمدی',
    student_role: 'متخصص و فعال بازار',
    avatar_initials: 'م.م',
    comment: 'نکته متمایز تدریس یاسین دهقان اینه که فقط به آموزش ختم نمیشه؛ پشتیبانی و راهنمایی‌های دلسوزانه‌شون باعث شد در اجرا به اعتماد به نفس کامل برسم.',
    rating: 5,
    order: 2,
  },
  {
    id: 3,
    student_name: 'پوریا راد',
    student_role: 'فارغ‌التحصیل دوره پیشرفته',
    avatar_initials: 'پ.ر',
    comment: 'کیفیت محتوا و تعهد مدرس فراتر از انتظارم بود. هر جا به سوالی برخوردم سریع راهنمایی گرفتم. ارزش این دوره چندین برابر مبلغی بود که پرداختم.',
    rating: 5,
    order: 3,
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [features, setFeatures] = useState<SiteFeature[]>([]);
  const [steps, setSteps] = useState<LearningStep[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, catRes, featRes, stepsRes, testRes] = await Promise.all([
          api.get('/courses/'),
          api.get('/courses/categories/'),
          api.get('/core/features/'),
          api.get('/core/steps/'),
          api.get('/core/testimonials/'),
        ]);
        setCourses(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
        setCategories(Array.isArray(catRes?.data) ? catRes.data : []);
        setFeatures(Array.isArray(featRes?.data) ? featRes.data : []);
        setSteps(Array.isArray(stepsRes?.data) ? stepsRes.data : []);
        setTestimonials(Array.isArray(testRes?.data) ? testRes.data : []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayFeatures = features.length > 0 ? features : defaultFeatures;
  const displaySteps = steps.length > 0 ? steps : defaultSteps;
  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      
      {/* 1. Dynamic Top Announcement Ribbon */}
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
                className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                title="بستن اعلان"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Bespoke Editorial Hero Section */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#000a4d08_1px,transparent_1px),linear-gradient(to_bottom,#000a4d08_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Right Column: Hero Content & Scope */}
            <div className="lg:col-span-7 space-y-6 text-right">
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50/90 border border-indigo-200/70 text-indigo-900 text-xs font-bold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  <span>{settings?.hero_badge || 'آکادمی تخصصی یاسین دهقان'}</span>
                </div>
                {settings?.academy_scope && (
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200/70">
                    {settings.academy_scope}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.25] sm:leading-[1.25]">
                {settings?.hero_title || 'یادگیری عمیق، کاربردی و مهارت‌های مورد نیاز بازار کار'}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                {settings?.hero_subtitle || 'مسیر یادگیری طراحی شده بر پایه تجربیات عملی و نیازهای واقعی روز؛ بدون اتلاف وقت، مستقیم مهارت‌های اصلی را بیاموزید و به کار ببندید.'}
              </p>

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
                  <span>{settings?.hero_cta_secondary_text || 'دوره‌های رایگان و آزمایشی'}</span>
                </Link>
              </div>

              {/* Trust & Proof Stack */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-600 border-t border-slate-200/70">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 space-x-reverse overflow-hidden">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-700 text-white font-bold ring-2 ring-white text-[11px]">ع.ح</span>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-700 text-white font-bold ring-2 ring-white text-[11px]">م.م</span>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-white font-bold ring-2 ring-white text-[11px]">پ.ر</span>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-900 text-white font-bold ring-2 ring-white text-[11px]">س.ا</span>
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-sm">+{settings?.stat_1_number || '۱۲,۰۰۰'} دانشجو</div>
                    <div className="text-[11px] text-slate-500">مشغول یادگیری و کسب مهارت</div>
                  </div>
                </div>

                <div className="h-7 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-800 text-sm">۴.۹</span>
                  <span className="text-[11px] text-slate-500">رضایت دانشجویان</span>
                </div>

                <div className="h-7 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>پشتیبانی مستقیم یاسین دهقان</span>
                </div>
              </div>

            </div>

            {/* Left Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              
              {settings?.hero_image_url ? (
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl group">
                  <img
                    src={settings.hero_image_url}
                    alt={settings.hero_title}
                    className="w-full h-auto object-cover max-h-[460px] group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg text-right">
                    <span className="text-xs font-black text-indigo-700">{settings.hero_preview_badge}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{settings.hero_preview_title}</h4>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl bg-gradient-to-br from-[#000a4d] via-[#050b20] to-[#037298] text-white p-7 sm:p-9 shadow-2xl shadow-indigo-950/25 border border-indigo-800/40 relative overflow-hidden text-right space-y-6">
                  
                  <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-indigo-800/50 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 flex items-center justify-center border border-white/20">
                        <img
                          src={settings?.logo_url || '/logo.png'}
                          alt={settings?.site_title || 'یاسین دهقان'}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-black tracking-tight text-white">{settings?.site_title || 'یاسین دهقان'}</div>
                        <div className="text-[11px] text-cyan-300 font-medium">{settings?.academy_scope || 'آکادمی تخصصی مهارت'}</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      آموزش فعال
                    </span>
                  </div>

                  {/* Card Title & Subtitle */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 inline-block">
                      {settings?.hero_preview_badge || 'متدولوژی اختصاصی آموزش'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                      {settings?.hero_preview_title || 'آموزش کاربردی با پشتیبانی مستقیم مدرس'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {settings?.hero_preview_subtitle || 'جلسات ویدیویی گام‌به‌گام با دسترسی همیشگی، تمرین‌های عملی و رفع اشکال مستمر.'}
                    </p>
                  </div>

                  {/* 3 Dynamic Key Highlights */}
                  <div className="space-y-3 pt-2">
                    {settings?.hero_tagline_1 && (
                      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-semibold">{settings.hero_tagline_1}</span>
                      </div>
                    )}
                    {settings?.hero_tagline_2 && (
                      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-semibold">{settings.hero_tagline_2}</span>
                      </div>
                    )}
                    {settings?.hero_tagline_3 && (
                      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="font-semibold">{settings.hero_tagline_3}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-indigo-800/40">
                    <span>دسترسی آنی به دوره‌ها</span>
                    <span className="text-cyan-300 font-bold">بدون پیش‌نیاز پیچیده</span>
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* 3. Integrated Trust Metrics Strip */}
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
                {settings?.stat_2_label || 'آموزش کاملاً کاربردی و مهارتی'}
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
                {settings?.stat_4_label || 'آمادگی برای ورود به بازار کار و ارتقای شغلی'}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Bento Grid of Academy Strengths */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>{settings?.features_badge || 'چرا آکادمی یاسین دهقان؟'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
            {settings?.features_title || 'ویژگی‌های متمایز دوره‌های آموزشی ما چیست؟'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {settings?.features_subtitle || 'ما به جای آموزش‌های کش‌دار و تئوری‌های بی‌استفاده، روی مهارت‌هایی تمرکز می‌کنیم که مستقیماً در کار و فعالیت حرفه‌ای به آنها نیاز دارید.'}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="p-6 rounded-3xl bg-white border border-slate-100 animate-pulse space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                <div className="h-16 bg-slate-200 rounded-md" />
              </div>
            ))
          ) : (
            displayFeatures.map((feature, idx) => {
              const IconComponent = featureIcons[feature.icon_type] || Flame;
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
          )}
        </div>
      </section>

      {/* 5. Dynamic Methodology & Learning Steps */}
      {settings?.steps_active && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-cyan-50/50 border border-indigo-100/80 p-8 sm:p-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
                {settings.steps_badge || 'مسیر یادگیری تا تسلط'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {settings.steps_title || 'مسیر گام‌به‌گام یادگیری و رسیدن به هدف'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {settings.steps_subtitle || 'این همان مسیری است که با برداشتن هر گام، یک سطح به تسلط کامل و نتیجه مطلوب نزدیک‌تر می‌شوید.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {displaySteps.map((st) => (
                <div key={st.id} className="relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                        {st.step_number}
                      </div>
                      {st.badge && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                          {st.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-slate-900">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 6. Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 text-right">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>پرمخاطب‌ترین دوره‌های آموزشی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">دوره‌های تخصصی و کاربردی</h2>
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

      {/* 7. Student Success Stories & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>نظرات واقعی همراهان</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            تجربه دانشجویان از دوره‌های یاسین دهقان
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            دانشجویانی که با آموزش‌های کاربردی توانستند به مهارت دلخواه و پیشرفت کاری دست یابند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="p-6 rounded-3xl bg-white border border-slate-100 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                <div className="h-16 bg-slate-200 rounded-md" />
                <div className="h-8 bg-slate-200 rounded-full w-1/2" />
              </div>
            ))
          ) : (
            displayTestimonials.map((t, idx) => (
              <div
                key={t.id || idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    «{t.comment}»
                  </p>
                </div>

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
          )}
        </div>

      </section>

      {/* 8. Direct Mentorship & Support Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-navy via-indigo-950 to-brand-blue text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4 text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              پشتیبانی مستقیم و بی‌واسطه
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-snug">
              هیچ ابهامی بی‌پاسخ نمی‌ماند؛ همراهی مستقیم یاسین دهقان
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              با ثبت‌نام در دوره‌ها، سوالات و چالش‌هایتان را در طول مسیر مستقیماً با خود مدرس مطرح کرده و راهنمایی دریافت می‌کنید.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              {settings?.telegram_url && (
                <a
                  href={settings.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-white text-indigo-950 font-black text-sm hover:bg-slate-100 transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>عضویت در کانال و پشتیبانی تلگرام</span>
                </a>
              )}
              {settings?.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone.replace(/[^0-9]/g, '')}`}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors flex items-center gap-2 cursor-pointer"
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
