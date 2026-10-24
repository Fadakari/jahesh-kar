import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Course, Category } from '../types';
import { CourseCard } from '../components/CourseCard';
import { 
  Search, 
  Sparkles, 
  ArrowLeft, 
  BookOpen, 
  Code2, 
  Cpu, 
  Palette, 
  Briefcase, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Users 
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  Code2,
  Cpu,
  Palette,
  Briefcase,
  BookOpen,
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/60 via-white to-transparent">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-60" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>پلتفرم تخصصی جهش به سمت شغل دلخواه</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-snug">
              با <span className="bg-gradient-to-l from-indigo-600 via-indigo-700 to-cyan-600 bg-clip-text text-transparent">جهش کار</span>، مهارت‌های پولساز یاد بگیر و وارد بازار کار شو
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              آموزش‌های ویدیویی صفر تا صد، کاربردی و پروژه‌محور در حوزه‌های برنامه‌نویسی، هوش مصنوعی، طراحی و مهارت‌های فریلنسری با بالاترین استانداردهای آموزشی
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto pt-2">
              <div className="relative flex items-center shadow-lg shadow-indigo-500/10 rounded-2xl bg-white border border-slate-200/90 p-1.5 transition-all focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder="جستجو در بین دوره‌ها، تکنولوژی‌ها و مدرسین..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer shrink-0"
                >
                  جستجو
                </button>
              </div>
            </form>

            {/* Quick stats banner */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="p-3 bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200/60 shadow-xs text-center">
                <div className="text-2xl font-black text-indigo-600">۱۰۰٪</div>
                <div className="text-xs text-slate-500 mt-0.5">پروژه‌محور و عملی</div>
              </div>
              <div className="p-3 bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200/60 shadow-xs text-center">
                <div className="text-2xl font-black text-cyan-600">+۴۰ ساعت</div>
                <div className="text-xs text-slate-500 mt-0.5">ویدیو تخصصی</div>
              </div>
              <div className="p-3 bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200/60 shadow-xs text-center">
                <div className="text-2xl font-black text-emerald-600">همیشگی</div>
                <div className="text-xs text-slate-500 mt-0.5">دسترسی به فایل‌ها</div>
              </div>
              <div className="p-3 bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200/60 shadow-xs text-center">
                <div className="text-2xl font-black text-amber-500">۴.۹ / ۵</div>
                <div className="text-xs text-slate-500 mt-0.5">رضایت دانشجویان</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">دسته‌بندی‌های آموزشی</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">مسیر یادگیری خود را بر اساس علاقه و نیازمندی بازار انتخاب کنید</p>
          </div>
          <Link
            to="/courses"
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            مشاهده همه
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.isArray(categories) && categories.map((cat) => {
            const Icon = categoryIcons[cat.icon] || BookOpen;
            return (
              <Link
                key={cat.id}
                to={`/courses?category=${cat.slug}`}
                className="group p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {cat.courses_count} دوره آموزشی
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>محبوب‌ترین و کاربردی‌ترین</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">دوره‌های برگزیده بازار کار</h2>
          </div>
          <Link
            to="/courses"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors w-fit flex items-center gap-1"
          >
            دیدن تمام دوره‌ها
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
            {Array.isArray(courses) && courses.slice(0, 4).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>

      {/* Why JaheshKar Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
              چرا یادگیری با جهش کار؟
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-snug">
              از آموزش تئوری خسته شدید؟ اینجا فقط روی پروژه‌های واقعی کار می‌کنید
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              هر دوره شامل کدهای نمونه، سناریوهای واقعی استخدام و ویدیوی پیش‌نمایش رایگان برای ارزیابی کیفیت تدریس قبل از ثبت‌نام است.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/courses?price=free"
                className="px-6 py-3 rounded-xl bg-white text-indigo-900 font-black text-sm hover:bg-slate-100 transition-colors shadow-md"
              >
                شروع با دوره‌های رایگان
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
