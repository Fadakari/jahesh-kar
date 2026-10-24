import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Course } from '../types';
import { CheckoutModal } from '../components/CheckoutModal';
import { 
  PlayCircle, 
  Lock, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Users, 
  Star, 
  Calendar, 
  ShieldCheck, 
  Download, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  GraduationCap
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${slug}/`);
      setCourse(res.data);

      // Default expand all sections
      if (res.data.sections) {
        const initialOpen: Record<number, boolean> = {};
        res.data.sections.forEach((s: any) => {
          initialOpen[s.id] = true;
        });
        setOpenSections(initialOpen);
      }
    } catch (err: any) {
      setError('دوره مورد نظر یافت نشد یا در دسترس نیست.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const toggleSection = (id: number) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3 mx-auto mb-4" />
        <div className="h-4 bg-slate-200 rounded-lg w-1/2 mx-auto mb-10" />
        <div className="aspect-video max-w-3xl bg-slate-200 rounded-3xl mx-auto" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">{error || 'خطا در بارگذاری دوره'}</h2>
        <Link
          to="/courses"
          className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm"
        >
          بازگشت به لیست دوره‌ها
        </Link>
      </div>
    );
  }

  const learnPoints = course.what_you_will_learn
    ? course.what_you_will_learn.split('\n').filter((p) => p.trim())
    : [];

  return (
    <div className="pb-24">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-slate-900 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            
            {course.category && (
              <Link
                to={`/courses?category=${course.category.slug}`}
                className="inline-block text-xs font-bold text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full hover:bg-indigo-500/30 transition-colors"
              >
                {course.category.title}
              </Link>
            )}

            <h1 className="text-2xl sm:text-4xl font-black leading-snug tracking-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {course.short_description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{course.rating}</span>
                <span className="text-slate-400 font-normal">({course.students_count} دانشجو)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>طول دوره: {course.duration}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>{course.lessons_count} جلسه آموزشی</span>
              </div>
            </div>

            {/* Instructor badge */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {course.instructor_name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{course.instructor_name}</div>
                <div className="text-xs text-slate-400">{course.instructor_title}</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 lg:-mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Main Details & Curriculum) */}
          <div className="lg:col-span-2 space-y-10 order-2 lg:order-1 pt-6">

            {/* Intro Video Player (if available) */}
            {course.intro_video_url && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-indigo-600" />
                  ویدیوی معرفی و سرفصل‌های دوره (رایگان)
                </h3>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
                  <video
                    src={course.intro_video_url}
                    controls
                    poster={course.cover_image_url}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* What you'll learn */}
            {learnPoints.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  آنچه در این دوره یاد خواهید گرفت
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {learnPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-slate-900">توضیحات و اهداف دوره</h3>
              <div className="text-sm text-slate-600 leading-loose whitespace-pre-line">
                {course.description}
              </div>
            </div>

            {/* Curriculum (Sections & Lessons) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">سرفصل‌ها و جلسات دوره</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    شامل {course.lessons_count} ویدیوی آموزشی کاربردی
                  </p>
                </div>
              </div>

              {/* Sections Accordion */}
              <div className="space-y-4">
                {course.sections && course.sections.length > 0 ? (
                  course.sections.map((section) => {
                    const isOpen = openSections[section.id] !== false;
                    return (
                      <div
                        key={section.id}
                        className="rounded-2xl border border-slate-200 overflow-hidden"
                      >
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-4 bg-slate-50/80 hover:bg-slate-100 transition-colors text-right cursor-pointer"
                        >
                          <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">
                              {section.order}
                            </span>
                            <span>{section.title}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>{section.lessons.length} جلسه</span>
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {/* Lessons List inside Section */}
                        {isOpen && (
                          <div className="divide-y divide-slate-100 bg-white">
                            {section.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-4 hover:bg-slate-50/60 transition-colors text-xs sm:text-sm"
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.has_access || lesson.is_free_preview ? (
                                    <PlayCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                  )}
                                  <span className="font-semibold text-slate-800">
                                    جلسه {lesson.order}: {lesson.title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-slate-400 text-xs">{lesson.duration}</span>
                                  {lesson.is_free_preview && !course.is_enrolled && (
                                    <Link
                                      to={`/course/${course.slug}/watch/${lesson.id}`}
                                      className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100"
                                    >
                                      پیش‌نمایش رایگان
                                    </Link>
                                  )}
                                  {course.is_enrolled && (
                                    <Link
                                      to={`/course/${course.slug}/watch/${lesson.id}`}
                                      className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold hover:bg-indigo-100"
                                    >
                                      تماشا
                                    </Link>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : null}

                {/* Direct standalone lessons if no sections */}
                {course.direct_lessons && course.direct_lessons.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden bg-white">
                    {course.direct_lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 hover:bg-slate-50/60 transition-colors text-xs sm:text-sm"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.has_access || lesson.is_free_preview ? (
                            <PlayCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="font-semibold text-slate-800">
                            جلسه {lesson.order}: {lesson.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-slate-400 text-xs">{lesson.duration}</span>
                          {(lesson.has_access || lesson.is_free_preview) && (
                            <Link
                              to={`/course/${course.slug}/watch/${lesson.id}`}
                              className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold"
                            >
                              تماشا
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-base font-bold text-slate-900">پیش‌نیازهای دوره</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {course.prerequisites}
                </p>
              </div>
            )}

            {/* Instructor Bio */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                {course.instructor_name.charAt(0)}
              </div>
              <div className="space-y-1.5">
                <div className="text-base font-black text-slate-900">{course.instructor_name}</div>
                <div className="text-xs font-semibold text-indigo-600">{course.instructor_title}</div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  {course.instructor_bio || 'مدرس و مشاور تخصصی جهش کار، با تمرکز بر آموزش پروژه‌محور و مهارت‌های استخدام.'}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (Sticky Purchase Box) */}
          <div className="lg:col-span-1 order-1 lg:order-2 sticky top-28 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl shadow-indigo-500/5">
              
              {/* Cover */}
              <div className="aspect-video relative bg-slate-900">
                <img
                  src={course.cover_image_url || '/courses/default-course.jpg'}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Price & Action */}
              <div className="p-6 space-y-5">
                
                {/* Price block */}
                <div>
                  {course.is_enrolled ? (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                      <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        شما دانشجوی این دوره هستید
                      </div>
                    </div>
                  ) : course.is_free ? (
                    <div className="text-center">
                      <span className="text-2xl font-black text-emerald-600">رایگان!</span>
                      <p className="text-xs text-slate-500 mt-1">با دسترسی نامحدود به تمامی جلسات</p>
                    </div>
                  ) : (
                    <div>
                      {course.discount_price && course.discount_price < course.price && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-slate-400 line-through">
                            {course.price.toLocaleString('fa-IR')} تومان
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-xs font-bold">
                            تخفیف ویژه
                          </span>
                        </div>
                      )}
                      <div className="text-2xl font-black text-slate-900">
                        {course.final_price.toLocaleString('fa-IR')}{' '}
                        <span className="text-xs font-normal text-slate-500">تومان</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary CTA button */}
                {course.is_enrolled ? (
                  <Link
                    to={`/course/${course.slug}/watch`}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <GraduationCap className="w-5 h-5" />
                    ورود به کلاس و تماشای ویدیوها
                  </Link>
                ) : course.is_free ? (
                  <button
                    onClick={() => setCheckoutModalOpen(true)}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5" />
                    ثبت‌نام رایگان در دوره
                  </button>
                ) : course.is_sales_enabled === false ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold leading-relaxed text-center">
                      🔒 فروش این دوره موقتاً غیرفعال است (درگاه پرداخت بانکی در حال اتصال می‌باشد).
                    </div>
                    <button
                      disabled
                      className="w-full py-4 rounded-2xl bg-slate-200 text-slate-400 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      فروش موقتاً غیرفعال است
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setCheckoutModalOpen(true)}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5" />
                    خرید و شروع یادگیری
                  </button>
                )}

                {/* Guarantee Features */}
                <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>دسترسی همیشگی و نامحدود به محتوا</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-indigo-600" />
                    <span>دانلود سورس‌کدها و اسلایدهای هر جلسه</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-600" />
                    <span>پشتیبانی مستقیم و رفع اشکال فنی</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        course={course}
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onSuccess={() => {
          fetchCourse();
        }}
      />
    </div>
  );
};
