import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Course, Category } from '../types';
import { CourseCard } from '../components/CourseCard';
import { FaqSection } from '../components/FaqSection';
import { MaqamExplorer } from '../components/MaqamExplorer';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { 
  Search, 
  Sparkles, 
  ArrowLeft, 
  BookOpen, 
  Mic, 
  Music, 
  Volume2, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  Users,
  Radio,
  Activity,
  Award,
  Flame,
  Play
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  Mic,
  Music,
  BookOpen,
  Volume2,
  Heart,
  Radio,
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, catRes] = await Promise.all([
          api.get('/courses/'),
          api.get('/courses/categories/'),
        ]);
        setCourses(Array.isArray(coursesRes?.data) ? coursesRes.data : []);
        setCategories(Array.isArray(catRes?.data) ? catRes.data : []);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section - Royal Persian Vocal Academy Aura */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-[#faf5eb] via-[#faf8f5] to-transparent">
        {/* Subtle Decorative Aura Backgrounds */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(217,119,6,0.08)_0%,transparent_65%)] pointer-events-none -z-10" />
        <div className="absolute top-10 left-1/5 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_65%)] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Right Column: Hero Typography & Search */}
            <div className="lg:col-span-7 space-y-6 text-right">
              
              {/* Spiritual/Academic Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>{settings?.hero_badge || 'نخستین آکادمی تخصصی آموزش مداحی و صداسازی مذهبی'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[2.85rem] font-black text-stone-900 tracking-tight leading-snug sm:leading-tight">
                {settings?.hero_title ? (
                  <span>{settings.hero_title}</span>
                ) : (
                  <>
                    آموزش اصولی <span className="bg-gradient-to-l from-emerald-900 via-emerald-800 to-teal-900 bg-clip-text text-transparent">مداحی، فن بیان</span> و صداسازی حنجره
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-2xl">
                {settings?.hero_subtitle || 'از پرورش و تقویت حنجره تا تسلط بر دستگاه‌های آوازی، مقتل‌خوانی، نوحه‌سرایی و مجلس‌داری را به صورت گام‌به‌گام و علمی بیاموزید.'}
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-xl pt-2">
                <div className="relative flex items-center shadow-xl shadow-emerald-950/5 rounded-2xl bg-white border border-amber-900/15 p-1.5 transition-all focus-within:ring-2 focus-within:ring-emerald-700 focus-within:border-transparent">
                  <Search className="w-5 h-5 text-stone-400 mr-3" />
                  <input
                    type="text"
                    placeholder="جستجوی دوره، استاد، دستگاه آوازی (شور، دشتی...) یا مبحث مداحی..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2.5 px-3 bg-transparent text-sm font-semibold text-stone-900 focus:outline-none placeholder:text-stone-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-amber-300 font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer border border-emerald-700/60"
                  >
                    جستجو
                  </button>
                </div>
              </form>

              {/* Trust highlights */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>متدهای علمی پرورش حنجره بدون گرفتگی</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>تسلط بر ردیف آوازی و نغمات آیینی</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>دسترسی همیشگی و نامحدود به ویدیوها</span>
                </div>
              </div>

            </div>

            {/* Left Column: Interactive Vocal Resonance Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#06241b] via-[#0b382c] to-[#041913] p-7 text-white border border-amber-500/35 shadow-2xl shadow-emerald-950/30 overflow-hidden">
                
                {/* Decorative Shamsah Glow Background */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-[radial-gradient(circle,rgba(251,191,36,0.15)_0%,transparent_70%)] pointer-events-none" />
                
                {/* Header of Showcase Card */}
                <div className="flex items-center justify-between pb-5 border-b border-emerald-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">آنالیز صداسازی و طنین صوت</h4>
                      <p className="text-[11px] text-emerald-300/80">نمایشگر فرکانس حنجره و پرده‌های آوازی</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    زنده
                  </span>
                </div>

                {/* Animated Frequency Bars (Vocal Waveform) */}
                <div className="my-6 p-4 rounded-2xl bg-black/40 border border-emerald-900/60 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[11px] text-stone-300">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                      رزونانس صوتی و تحریرهای سنتی
                    </span>
                    <span className="text-amber-400 font-mono font-bold">432 Hz • دیافراگم</span>
                  </div>

                  {/* Equalizer Visualizer Bars */}
                  <div className="flex items-end justify-between gap-1 h-20 pt-2 px-1">
                    {[
                      { h: '35%', anim: 'animate-vocal-1' },
                      { h: '65%', anim: 'animate-vocal-2' },
                      { h: '45%', anim: 'animate-vocal-3' },
                      { h: '90%', anim: 'animate-vocal-4' },
                      { h: '75%', anim: 'animate-vocal-5' },
                      { h: '100%', anim: 'animate-vocal-2' },
                      { h: '80%', anim: 'animate-vocal-1' },
                      { h: '60%', anim: 'animate-vocal-3' },
                      { h: '88%', anim: 'animate-vocal-4' },
                      { h: '50%', anim: 'animate-vocal-5' },
                      { h: '70%', anim: 'animate-vocal-2' },
                      { h: '40%', anim: 'animate-vocal-1' },
                    ].map((bar, i) => (
                      <span
                        key={i}
                        className={`w-full rounded-full bg-gradient-to-t from-emerald-600 via-amber-400 to-amber-200 ${bar.anim}`}
                        style={{ height: bar.h }}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] text-stone-400 pt-1 font-mono">
                    <span>پرده بم (باس)</span>
                    <span>دانگ میانی (تنور)</span>
                    <span>اوج حماسی (آلتو)</span>
                  </div>
                </div>

                {/* Key Metrics in Card */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40">
                    <span className="text-[11px] text-emerald-300 font-medium block">دانش‌آموختگان مداحی</span>
                    <span className="text-base font-black text-amber-300 font-mono">+۱۲,۰۰۰ ذاکر</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40">
                    <span className="text-[11px] text-emerald-300 font-medium block">جلسات تصویری تدوین‌شده</span>
                    <span className="text-base font-black text-amber-300 font-mono">+۳۵۰ درسنامه</span>
                  </div>
                </div>

                {/* CTA inside Card */}
                <div className="mt-5">
                  <Link
                    to="/courses"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all duration-200"
                  >
                    <BookOpen className="w-4 h-4 text-stone-950" />
                    <span>ورود به هنرکده صداسازی و الحان</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Stats Strip (ویژگی‌های زرین آکادمی) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-amber-900/10 shadow-xl shadow-emerald-950/5">
          <div className="flex items-center gap-3.5 p-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-base font-black text-stone-900 font-mono">+۳۵۰ جلسه تخصصی</div>
              <p className="text-[11px] text-stone-500">آموزش گام‌به‌گام و کاربردی</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Users className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-base font-black text-stone-900 font-mono">+۱۲,۰۰۰ هنرجو</div>
              <p className="text-[11px] text-stone-500">جامعه مداحان و ستایشگران</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-800 flex items-center justify-center shrink-0 border border-teal-500/20">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <div className="text-base font-black text-stone-900">۱۰۰٪ علمی و استاندارد</div>
              <p className="text-[11px] text-stone-500">حفاظت از سلامت تارهای صوتی</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-base font-black text-stone-900">رفع اشکال صوتی</div>
              <p className="text-[11px] text-stone-500">پشتیبانی و هدایت توسط اساتید</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Categories Grid (هنرکده‌های تخصصی مداحی) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-2">
              <Mic className="w-3.5 h-3.5 text-emerald-700" />
              <span>شاخه‌های تخصصی آموزش</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900">هنرکده‌های مهارتی آواز آموز</h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              مسیر یادگیری خود را متناسب با نیاز صداسازی یا نغمات آوازی انتخاب فرمایید
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 group"
          >
            <span>مشاهده همه دوره‌ها</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComponent = categoryIcons[cat.icon] || Mic;
            return (
              <Link
                key={cat.id}
                to={`/courses?category=${cat.slug}`}
                className="group p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:shadow-xl hover:shadow-emerald-950/5 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center mb-4 group-hover:bg-gradient-to-tr group-hover:from-emerald-900 group-hover:to-emerald-800 group-hover:text-amber-300 transition-colors duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description || 'دوره‌های تخصصی و مهارتی در این حوزه'}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 group-hover:text-emerald-700">
                  <span className="font-semibold">{cat.courses_count || 0} دوره فعال</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Interactive Maqam & Vocal Mode Explorer (دستگاه‌شناس تخصصی مداحی) */}
      <section id="maqamat" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <MaqamExplorer />
      </section>

      {/* 5. Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>دوره‌های منتخب و محبوب</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900">جدیدترین دوره‌های تخصصی مداحی</h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              آموزش‌های تصویری جامع به همراه سرفصل‌های علمی و فایل‌های صوتی تمرین
            </p>
          </div>
          <Link
            to="/courses"
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>بانک تمام دوره‌ها</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-3xl bg-white border border-stone-100 p-4 space-y-4 animate-pulse">
                <div className="aspect-video bg-stone-200 rounded-2xl" />
                <div className="h-4 bg-stone-200 rounded-md w-3/4" />
                <div className="h-3 bg-stone-200 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.slice(0, 8).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Middle Banner (Dynamic from Site Settings: Features & Why Us) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#06221a] via-[#093125] to-[#041a13] text-white p-8 sm:p-12 lg:p-16 border border-amber-500/25 shadow-2xl shadow-emerald-950/20">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings?.features_badge || 'چرا آکادمی آواز آموز؟'}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              {settings?.features_title || 'تربیت ذاکران و مداحان اهل‌بیت با اصیل‌ترین متدهای صوتی و معرفتی'}
            </h3>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              {settings?.features_subtitle || 'آموزش‌های کاربردی متناسب با اصول صداسازی علمی، لحن‌شناسی، ادعیه‌خوانی و آداب نوکری به همراه رفع اشکال و تمرین‌های صوتی هدفمند.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-xs sm:text-sm font-semibold">تکنیک‌های پیشرفته اوج‌خوانی بدون فشار بر تارهای صوتی</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-xs sm:text-sm font-semibold">فایل‌های تمرین صوتی اختصاصی برای هر درس</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-xs sm:text-sm font-semibold">انتقال تجربیات مداحان و اساتید برجسته کشوری</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-xs sm:text-sm font-semibold">دسترسی دائمی و امن از گوشی و کامپیوتر</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm shadow-xl shadow-amber-950/40 transition-all hover:scale-105"
              >
                <span>مشاهده دوره‌ها و شروع یادگیری</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Dynamic FAQs Accordion */}
      <FaqSection />

    </div>
  );
};
