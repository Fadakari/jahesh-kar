import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import { Course, Category, FAQ } from '../types';
import { CourseCard } from '../components/CourseCard';
import { MaqamExplorer } from '../components/MaqamExplorer';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { 
  GoldCorner, 
  IslamicKetabeh, 
  IslamicShamsah, 
  IslamicDivider 
} from '../components/IslamicElements';
import { 
  ScrollReveal, 
  StaggerContainer, 
  StaggerCardItem 
} from '../components/ScrollReveal';
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
  Award,
  Play,
  GraduationCap,
  ChevronLeft,
  Compass,
  Check,
  Flame,
  Clock,
  Layers,
  ChevronDown,
  Phone,
  Send,
  Star,
  PlayCircle
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  Mic,
  Music,
  BookOpen,
  Volume2,
  Heart,
};

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    title: 'صداسازی و پرورش حنجره',
    slug: 'vocal-training',
    icon: 'Mic',
    description: 'تکنیک‌های تنفس دیافراگمی، طنین صدا، تحریر، تقویت اوج و بهداشت صوتی مداح',
    courses_count: 4,
  },
  {
    id: 2,
    title: 'دستگاه‌ها و نغمات آوازی',
    slug: 'maqamat-radif',
    icon: 'Music',
    description: 'آموزش ردیف‌ها و دستگاه‌های سنتی متناسب با مرثیه‌خوانی، مولودی و ادعیه',
    courses_count: 5,
  },
  {
    id: 3,
    title: 'مقتل‌شناسی و شعر آیینی',
    slug: 'maqtal-study',
    icon: 'BookOpen',
    description: 'بررسی مقاتل معتبر، درک مفاهیم روایی و گزینش اشعار فاخر اهل‌بیت (ع)',
    courses_count: 3,
  },
  {
    id: 4,
    title: 'فن بیان و مجلس‌داری',
    slug: 'speech-majles',
    icon: 'Volume2',
    description: 'مدیریت جلسه، آداب ستایشگری، زبان بدن، اوج و فرود و ارتباط با مستمعین',
    courses_count: 3,
  },
];

const FALLBACK_COURSES: Course[] = [
  {
    id: 1,
    title: 'دوره جامع صداسازی علمی، تقویت حنجره و بهداشت صوت در مداحی',
    slug: 'mastering-maddahi-vocals',
    short_description: 'آموزش گام‌به‌گام از تنفس صحیح دیافراگمی تا اجرای اوج‌های ممتد بدون گرفتگی صدا',
    instructor_name: 'استاد حاج مرتضی تهرانی',
    instructor_title: 'مدرس ارشد صداسازی مذهبی و قاری قرآن کریم',
    price: 890000,
    discount_price: 590000,
    final_price: 590000,
    is_free: false,
    level: 'all',
    duration: '۱۸ ساعت',
    students_count: 480,
    rating: 4.9,
    cover_image_url: '/courses/course-1-fullstack.jpg',
    lessons_count: 24,
    is_enrolled: false,
    category: FALLBACK_CATEGORIES[0],
  },
  {
    id: 2,
    title: 'آموزش گوشه‌ها و دستگاه‌های آوازی در مرثیه‌خوانی و ادعیه',
    slug: 'radif-and-melodies-in-maddahi',
    short_description: 'تسلط بر دستگاه‌های شور، دشتی، ابوعطا، همایون و چهارگاه با نمونه‌های اجرایی مجالس',
    instructor_name: 'استاد سیدعلی حسینی',
    instructor_title: 'ردیف‌دان و کارشناس موسیقی و الحان آیینی',
    price: 750000,
    discount_price: 490000,
    final_price: 490000,
    is_free: false,
    level: 'intermediate',
    duration: '۱۴ ساعت',
    students_count: 310,
    rating: 4.8,
    cover_image_url: '/courses/course-2-ai.jpg',
    lessons_count: 18,
    is_enrolled: false,
    category: FALLBACK_CATEGORIES[1],
  },
  {
    id: 3,
    title: 'مقتل‌شناسی مستند و تطبیق روایات در مرثیه‌خوانی',
    slug: 'authentic-maqtal-analysis',
    short_description: 'شناخت مقاتل دست‌اول، تفکیک روایات معتبر از تحریفات، و ساختاردهی به روضه',
    instructor_name: 'حجت‌الاسلام دکتر موسوی',
    instructor_title: 'پژوهشگر تاریخ اسلام و متون آیینی',
    price: 620000,
    discount_price: 380000,
    final_price: 380000,
    is_free: false,
    level: 'all',
    duration: '۱۲ ساعت',
    students_count: 225,
    rating: 5.0,
    cover_image_url: '/courses/course-3-figma.jpg',
    lessons_count: 16,
    is_enrolled: false,
    category: FALLBACK_CATEGORIES[2],
  },
  {
    id: 4,
    title: 'اصول و آداب مجلس‌داری و فن بیان در ستایشگری (رایگان)',
    slug: 'majles-etiquette-and-speech-free',
    short_description: 'چگونه محفل را گرم کنیم؟ مدیریت زمان، احترام به مستمع و آداب نوکری اهل‌بیت',
    instructor_name: 'اساتید آکادمی آواز آموز',
    instructor_title: 'هیئت علمی و پیشکسوتان مداحی',
    price: 0,
    final_price: 0,
    is_free: true,
    level: 'beginner',
    duration: '۶ ساعت',
    students_count: 940,
    rating: 4.9,
    cover_image_url: '/courses/course-4-career.jpg',
    lessons_count: 10,
    is_enrolled: false,
    category: FALLBACK_CATEGORIES[3],
  },
];

const FALLBACK_FAQS: FAQ[] = [
  {
    id: 1,
    question: 'آیا برای شرکت در دوره‌ها نیاز به صدای خاص یا زمینه قبلی دارم؟',
    answer: 'خیر، دوره‌ها به ویژه دوره «صداسازی جامع و پرورش حنجره» از پایه و صفر مطلق، با آموزش صحیح تنفس دیافراگمی، تلفظ حروف و باز کردن حجم صدا آغاز می‌شود. هر فرد با تمرین مستمر می‌تواند صدای خود را به زیبایی پرورش دهد.',
    order: 1,
    is_active: true,
  },
  {
    id: 2,
    question: 'آیا آموزش دستگاه‌های آوازی منطبق با سبک‌های مداحی است؟',
    answer: 'بله، در آواز آموز برخلاف کلاس‌های سنتی آواز که تئوریک هستند، تمامی گوشه‌ها و مقامات (شور، دشتی، همایون، چهارگاه و...) مستقیماً روی اشعار مرثیه، نوحه و مولودی شبیه‌سازی و اجرا می‌شوند.',
    order: 2,
    is_active: true,
  },
  {
    id: 3,
    question: 'آیا امکان مشاهده نمونه جلسات قبل از خرید دوره وجود دارد؟',
    answer: 'بله، در تمامی دوره‌ها جلسات با نشان «پیش‌نمایش رایگان» مشخص شده‌اند که هر علاقه‌مندی بدون پرداخت هزینه می‌تواند آن‌ها را تماشا کرده و با کیفیت تدریس اساتید آشنا شود.',
    order: 3,
    is_active: true,
  },
  {
    id: 4,
    question: 'پس از ثبت‌نام، دسترسی به ویدیوها تا چه زمانی برقرار است؟',
    answer: 'دسترسی شما به دوره‌های ثبت‌نام شده همیشگی و نامحدود است و در تمام ۲۴ ساعت شبانه‌روز از طریق گوشی یا کامپیوتر می‌توانید ویدیوها را تماشا فرمایید.',
    order: 4,
    is_active: true,
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [courses, setCourses] = useState<Course[]>(FALLBACK_COURSES);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [faqs, setFaqs] = useState<FAQ[]>(FALLBACK_FAQS);
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourseCategory, setActiveCourseCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, catRes, faqsRes] = await Promise.all([
          api.get('/courses/'),
          api.get('/courses/categories/'),
          api.get('/core/faqs/'),
        ]);
        if (Array.isArray(coursesRes?.data) && coursesRes.data.length > 0) {
          setCourses(coursesRes.data);
        }
        if (Array.isArray(catRes?.data) && catRes.data.length > 0) {
          setCategories(catRes.data);
        }
        if (Array.isArray(faqsRes?.data) && faqsRes.data.length > 0) {
          setFaqs(faqsRes.data);
          setOpenFaqId(faqsRes.data[0].id);
        }
      } catch (_) {}
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredCourses = courses.filter((c) => {
    if (activeCourseCategory === 'all') return true;
    return c.category?.slug === activeCourseCategory;
  });

  return (
    <div className="bg-[#041410] text-[#f5f2eb] min-h-screen space-y-24 pb-24 overflow-x-hidden">

      {/* ========================================================================= */}
      {/* 1. سردر و ایوان ورودی آکادمی (The Grand Mosque Iwan Sanctuary) */}
      {/* ========================================================================= */}
      <section className="relative pt-10 pb-20 px-4 sm:px-6 lg:px-8 bg-kashi-sacred border-b-2 border-amber-600/40">
        
        {/* Subtle Islamic Girih Grid */}
        <div className="absolute inset-0 bg-girih-mosque opacity-40 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-8">
          
          {/* Top Traditional Calligraphic Ketabeh Header: Unfolds smoothly on entry */}
          <ScrollReveal direction="expand" delay={0.05} repeat={true}>
            <IslamicKetabeh
              title={settings?.hero_badge || 'نخستین آکادمی تخصصی آموزش مداحی، صداسازی و الحان مذهبی'}
              subtitle="بسم‌الله‌الرحمن‌الرحیم • توسل، معرفت و صیانت از حنجره"
              variant="green"
            />
          </ScrollReveal>

          {/* Central Monumental Poetic Headline: Glides up gracefully */}
          <div className="space-y-4 max-w-4xl mx-auto pt-2">
            <ScrollReveal direction="up" delay={0.15} repeat={true}>
              <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.3] text-gold-calligraphy drop-shadow-lg">
                {settings?.hero_title ? (
                  <span>{settings.hero_title}</span>
                ) : (
                  <>
                    آموزش اصولی مداحی، ردیف‌های آوازی و <br className="hidden sm:inline" />
                    <span className="text-turquoise-sacred border-b border-amber-500/40 pb-1">
                      فن بیان و آداب ستایشگری اهل‌بیت
                    </span>
                  </>
                )}
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.25} repeat={true}>
              <p className="text-sm sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-2xl mx-auto">
                {settings?.hero_subtitle || 'از پرورش و تقویت حنجره تا تسلط بر دستگاه‌های آوازی، مقتل‌خوانی، نوحه‌سرایی و مجلس‌داری را به صورت گام‌به‌گام و علمی بیاموزید.'}
              </p>
            </ScrollReveal>
          </div>

          {/* Traditional Arched Search Bar with Architectural Unfold */}
          <div className="max-w-2xl mx-auto pt-2">
            <ScrollReveal direction="unfold" delay={0.35} repeat={true}>
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center p-2 rounded-2xl bg-[#031510] border-2 border-amber-500/60 shadow-2xl focus-within:border-amber-400">
                  <Search className="w-5 h-5 text-amber-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجوی دوره، استاد، دستگاه آوازی (شور، دشتی، همایون) یا مقتل..."
                    className="w-full py-2.5 px-2 bg-transparent text-sm sm:text-base font-semibold text-amber-100 focus:outline-none placeholder:text-stone-400"
                  />
                  <button
                    type="submit"
                    className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm transition-all cursor-pointer shadow-lg shrink-0"
                  >
                    جستجو در دروس
                  </button>
                </div>
              </form>
            </ScrollReveal>

            {/* Quick Topic Chips */}
            <ScrollReveal direction="up" delay={0.4} repeat={true}>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
                <span className="text-amber-400 font-bold">الحان و دروس پرمخاطب:</span>
                {[
                  { label: 'دستگاه شور و آواز دشتی', q: 'شور' },
                  { label: 'تقویت حنجره و دیافراگم', q: 'دیافراگم' },
                  { label: 'مقتل‌شناسی تحلیلی', q: 'مقتل' },
                  { label: 'فن بیان مجلس‌داری', q: 'مجلس' },
                  { label: 'آموزش‌های تبرکی و رایگان', q: 'رایگان' },
                ].map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(`/courses?q=${encodeURIComponent(tag.q)}`)}
                    className="px-3 py-1 rounded-lg bg-emerald-950/80 hover:bg-amber-500 hover:text-stone-950 text-amber-200 border border-amber-500/30 transition-all text-[11px] cursor-pointer"
                  >
                    #{tag.label}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Three Sacred Gilded Seal Tablets: Flips in with Directional 3D Momentum */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-4xl mx-auto text-xs">
            <ScrollReveal direction="flip-right" delay={0.4} repeat={true}>
              <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-[#062018] border border-amber-500/40 text-amber-200 shadow-lg">
                <IslamicShamsah size={18} />
                <span>متدهای علمی بدون گرفتگی حنجره</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="bloom" delay={0.45} repeat={true}>
              <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-[#062018] border border-amber-500/40 text-amber-200 shadow-lg">
                <IslamicShamsah size={18} />
                <span>تسلط بر ردیف آوازی و نغمات آیینی</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="flip-left" delay={0.4} repeat={true}>
              <div className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-[#062018] border border-amber-500/40 text-amber-200 shadow-lg">
                <IslamicShamsah size={18} />
                <span>دسترسی دائمی و نامحدود به جلسات</span>
              </div>
            </ScrollReveal>
          </div>

        </div>

      </section>


      {/* ========================================================================= */}
      {/* 2. صُفه ارقام و نشان‌های زرین آکادمی (The Shrine Plinth Metrics) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <ScrollReveal direction="unfold" delay={0.1} repeat={true}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-[#031913] border-2 border-amber-500/40 shadow-2xl relative">
            <GoldCorner position="top-right" size={28} className="absolute top-1 right-1" />
            <GoldCorner position="top-left" size={28} className="absolute top-1 left-1" />
            <GoldCorner position="bottom-right" size={28} className="absolute bottom-1 right-1" />
            <GoldCorner position="bottom-left" size={28} className="absolute bottom-1 left-1" />

            <div className="flex items-center gap-4 p-2 text-right">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <IslamicShamsah size={26} color="#fbbf24" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">+۳۵۰ درسنامه</div>
                <p className="text-xs text-emerald-200/80">آموزش تصویری با فایل صوتی</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2 text-right">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">+۱۲,۰۰۰ ذاکر</div>
                <p className="text-xs text-emerald-200/80">جامعه مادحین سراسر کشور</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2 text-right">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">۱۰۰٪ علمی</div>
                <p className="text-xs text-emerald-200/80">صیانت از سلامت تارهای صوتی</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2 text-right">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-300">رفع اشکال</div>
                <p className="text-xs text-emerald-200/80">پشتیبانی توسط اساتید دوره</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>


      {/* ========================================================================= */}
      {/* 3. رواق هنرکده‌های چهارگانه ستایشگری (The Sacred Ateliers) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-12">
          <ScrollReveal direction="expand" repeat={true}>
            <IslamicKetabeh
              title="هنرکده‌های مهارتی آواز آموز"
              subtitle="چهار شاخه بنیادین در تربیت ستایشگران اهل‌بیت"
              variant="blue"
            />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1} repeat={true}>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
              مسیر تخصصی خود را متناسب با نیاز صداسازی، ردیف آوازی یا مقتل‌شناسی برگزینید:
            </p>
          </ScrollReveal>
        </div>

        {/* 4 Sacred Arched Pavilions with Directional 3D Swings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const IconComp = categoryIcons[cat.icon] || Mic;
            const ordinalTitles = ['هنرکده اول', 'هنرکده دوم', 'هنرکده سوم', 'هنرکده چهارم'];
            const directionVariant = idx === 0 ? 'flip-right' : idx === 3 ? 'flip-left' : 'up';
            return (
              <ScrollReveal key={cat.id} direction={directionVariant} delay={idx * 0.1} repeat={true}>
                <Link
                  to={`/courses?category=${cat.slug}`}
                  className="group relative p-7 rounded-3xl bg-[#061e17] border-2 border-amber-600/35 hover:border-amber-400 shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full"
                >
                  {/* Gold Corners */}
                  <GoldCorner position="top-right" size={26} className="absolute top-1 right-1" />
                  <GoldCorner position="top-left" size={26} className="absolute top-1 left-1" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400 bg-black/50 px-2.5 py-1 rounded-md border border-amber-500/30">
                        {ordinalTitles[idx] || `هنرکده ${idx + 1}`}
                      </span>
                      <IconComp className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                    </div>

                    <h3 className="text-lg font-black text-amber-200 group-hover:text-amber-300 transition-colors">
                      {cat.title}
                    </h3>

                    <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                      {cat.description || 'دوره‌های تخصصی و مهارتی در این حوزه'}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 pt-4 border-t border-emerald-950 flex items-center justify-between text-xs text-amber-400">
                    <span className="font-semibold">{cat.courses_count || 0} دوره فعال</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

      </section>


      {/* ========================================================================= */}
      {/* 4. شبستان نغمه‌شناسی و دستگاه‌های آوازی (MaqamExplorer) */}
      {/* ========================================================================= */}
      <section id="maqamat" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <ScrollReveal direction="unfold" delay={0.1} repeat={true}>
          <MaqamExplorer />
        </ScrollReveal>
      </section>


      {/* ========================================================================= */}
      {/* 5. صحن دوره‌های تخصصی مداحی (Featured Courses) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-amber-900/30">
          <ScrollReveal direction="right" repeat={true}>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                <IslamicShamsah size={16} />
                <span>آموزش‌های ویدیویی جامع و سرفصل‌های تدوین‌شده</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-amber-200 tracking-tight">
                جدیدترین دوره‌های تخصصی مداحی و نغمه‌خوانی
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" repeat={true}>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveCourseCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCourseCategory === 'all'
                    ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                    : 'bg-[#062018] text-amber-200 border border-amber-600/30 hover:border-amber-400'
                }`}
              >
                همه عناوین ({courses.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCourseCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCourseCategory === cat.slug
                      ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                      : 'bg-[#062018] text-amber-200 border border-amber-600/30 hover:border-amber-400'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Course Cards Grid with Alternating Stagger In-View Motion */}
        <StaggerContainer staggerDelay={0.09} repeat={true} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.slice(0, 8).map((course, idx) => (
            <StaggerCardItem key={course.id} index={idx}>
              <CourseCard course={course} />
            </StaggerCardItem>
          ))}
        </StaggerContainer>

      </section>


      {/* ========================================================================= */}
      {/* 6. کتیبه بیانیه خادمان و مانیفست آکادمی (Why Us / Manifesto) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal direction="unfold" delay={0.1} repeat={true}>
          <div className="relative rounded-3xl bg-[#031510] border-2 border-amber-500/50 p-8 sm:p-14 shadow-2xl overflow-hidden">
            
            <GoldCorner position="top-right" size={40} className="absolute top-2 right-2" />
            <GoldCorner position="top-left" size={40} className="absolute top-2 left-2" />
            <GoldCorner position="bottom-right" size={40} className="absolute bottom-2 right-2" />
            <GoldCorner position="bottom-left" size={40} className="absolute bottom-2 left-2" />

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
              
              <ScrollReveal direction="expand" delay={0.15} repeat={true}>
                <IslamicKetabeh
                  title={settings?.features_badge || 'چرا آکادمی آواز آموز؟'}
                  subtitle="عهدنامه خدمت و صیانت از منبر اهل‌بیت"
                  variant="black"
                />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.2} repeat={true}>
                <h3 className="text-2xl sm:text-4xl font-black text-gold-calligraphy tracking-tight leading-snug">
                  {settings?.features_title || 'تربیت ذاکران و مداحان اهل‌بیت با اصیل‌ترین متدهای صوتی و معرفتی'}
                </h3>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.25} repeat={true}>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                  {settings?.features_subtitle || 'آموزش‌های کاربردی متناسب با اصول صداسازی علمی، لحن‌شناسی، ادعیه‌خوانی و آداب نوکری به همراه رفع اشکال و تمرین‌های صوتی هدفمند.'}
                </p>
              </ScrollReveal>

              {/* 4 Gilded Tablets: Directional Left/Right Momentum */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-right">
                
                <ScrollReveal direction="flip-right" delay={0.25} repeat={true}>
                  <div className="p-5 rounded-2xl bg-[#062018] border border-amber-500/30 space-y-2 h-full shadow-lg">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                      <IslamicShamsah size={18} />
                      <span>تکنیک‌های پیشرفته اوج‌خوانی</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed pr-6">
                      ورود به پرده‌های بالا بدون فشار به حنجره با تکنیک ماسک و تقویت دیافراگم.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="flip-left" delay={0.3} repeat={true}>
                  <div className="p-5 rounded-2xl bg-[#062018] border border-amber-500/30 space-y-2 h-full shadow-lg">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                      <IslamicShamsah size={18} />
                      <span>فایل‌های تمرین صوتی مجزا</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed pr-6">
                      فایل‌های صوتی ضمیمه برای تکرار روزانه تمرینات حنجره همگام با استاد.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="flip-right" delay={0.35} repeat={true}>
                  <div className="p-5 rounded-2xl bg-[#062018] border border-amber-500/30 space-y-2 h-full shadow-lg">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                      <IslamicShamsah size={18} />
                      <span>انتقال تجربیات اساتید کشوری</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed pr-6">
                      ترکیب دانش ردیف‌های کهن با سبک‌های نوین مرثیه‌خوانی و نوحه‌سرایی.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="flip-left" delay={0.4} repeat={true}>
                  <div className="p-5 rounded-2xl bg-[#062018] border border-amber-500/30 space-y-2 h-full shadow-lg">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                      <IslamicShamsah size={18} />
                      <span>دسترسی دائمی و امن</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed pr-6">
                      تماشای نامحدود در تمام ساعات شبانه‌روز از طریق موبایل و رایانه.
                    </p>
                  </div>
                </ScrollReveal>

              </div>

              <div className="pt-6">
                <ScrollReveal direction="bloom" delay={0.45} repeat={true}>
                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm transition-all shadow-xl"
                  >
                    <span>مشاهده همه دوره‌ها و آغاز آموزش</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </ScrollReveal>
              </div>

            </div>

          </div>
        </ScrollReveal>

      </section>


      {/* ========================================================================= */}
      {/* 7. حجره پرسش و پاسخ هنرجویان (FAQs) */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-10">
          <ScrollReveal direction="expand" repeat={true}>
            <IslamicKetabeh
              title="سوالات متداول هنرجویان و ذاکران"
              subtitle="پاسخ به سوالات پیرامون دوره‌ها و ثبت‌نام"
              variant="green"
            />
          </ScrollReveal>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqId === faq.id;
            const direction = idx % 2 === 0 ? 'flip-right' : 'flip-left';
            return (
              <ScrollReveal key={faq.id} direction={direction} delay={idx * 0.08} repeat={true}>
                <div
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-[#07241c] border-amber-400 shadow-xl'
                      : 'bg-[#051812] border-amber-500/20 hover:border-amber-500/40'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-right font-bold text-sm sm:text-base text-amber-200 cursor-pointer gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <IslamicShamsah size={16} />
                      <span>{faq.question}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-amber-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-300 leading-relaxed border-t border-emerald-950">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Contact Strip */}
        <ScrollReveal direction="unfold" delay={0.2} repeat={true}>
          <div className="mt-8 p-6 rounded-2xl bg-[#031510] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right shadow-xl">
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                نیاز به راهنمایی بیشتری دارید؟
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                اساتید و خادمان آکادمی آماده پاسخ‌گویی به شما هستند.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {settings?.telegram_url && (
                <a
                  href={settings.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>پشتیبانی تلگرام</span>
                </a>
              )}
              {settings?.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/60 text-amber-200 text-xs font-bold border border-amber-500/30 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{settings.contact_phone}</span>
                </a>
              )}
            </div>
          </div>
        </ScrollReveal>

      </section>

    </div>
  );
};
