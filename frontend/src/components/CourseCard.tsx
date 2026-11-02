import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { Clock, PlayCircle, Star, CheckCircle2, Mic, ArrowLeft } from 'lucide-react';
import { GoldCorner, IslamicShamsah } from './IslamicElements';

interface CourseCardProps {
  course: Course;
}

const levelLabels: Record<string, string> = {
  all: 'عمومی و همه سطوح',
  beginner: 'مقدماتی و پایه',
  intermediate: 'متوسط و تکمیلی',
  advanced: 'پیشرفته و تخصصی',
};

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [imgSrc, setImgSrc] = React.useState(
    course.cover_image_url || '/courses/default-course.jpg'
  );

  return (
    <div className="group bg-[#061813] rounded-3xl overflow-hidden border-2 border-amber-600/35 hover:border-amber-400 shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between h-full relative">
      
      {/* Delicate Gold Corner Filigrees */}
      <GoldCorner position="top-right" size={28} className="absolute top-1 right-1 z-20" />
      <GoldCorner position="top-left" size={28} className="absolute top-1 left-1 z-20" />

      <div>
        {/* Cover Image & Mehrab Vignette */}
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          <img
            src={imgSrc}
            alt={course.title}
            onError={() => setImgSrc('/courses/default-course.jpg')}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061813] via-black/40 to-transparent pointer-events-none" />

          {/* Level badge styled as small Ketabeh */}
          <div className="absolute top-3 right-3 px-3 py-0.5 rounded-md text-[10px] font-bold bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/40">
            {levelLabels[course.level] || 'عمومی'}
          </div>

          {/* Enrolled banner if already bought */}
          {course.is_enrolled && (
            <div className="absolute top-3 left-3 px-3 py-0.5 rounded-md text-[10px] font-bold bg-emerald-800 text-amber-200 shadow-md flex items-center gap-1 border border-emerald-500/50">
              <CheckCircle2 className="w-3 h-3 text-amber-300" />
              هنرجوی دوره
            </div>
          )}

          {/* Meta stats overlaid on bottom of image */}
          <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between text-[11px] text-stone-200 font-medium">
            <span className="flex items-center gap-1.5 bg-black/75 px-2.5 py-1 rounded-lg border border-amber-500/20 text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1.5 bg-black/75 px-2.5 py-1 rounded-lg border border-emerald-500/20 text-emerald-300">
              <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
              {course.lessons_count} جلسه تدوین‌شده
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 text-right">
          {/* Category */}
          {course.category && (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 mb-3">
              <Mic className="w-3 h-3 text-amber-400" />
              <span>{course.category.title}</span>
            </div>
          )}

          {/* Title */}
          <Link to={`/course/${course.slug}`}>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-relaxed">
              {course.title}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-stone-300 line-clamp-2 mt-2 leading-relaxed font-normal">
            {course.short_description}
          </p>

          {/* Instructor & Rating */}
          <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-emerald-950 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-900 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                {course.instructor_name ? course.instructor_name.charAt(0) : 'ذ'}
              </div>
              <span className="font-semibold text-stone-200">{course.instructor_name}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-stone-300">{course.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="p-5 sm:p-6 pt-0">
        <div className="flex items-center justify-between pt-3.5 border-t border-emerald-950">
          <div>
            {course.is_enrolled ? (
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-700/50">ثبت‌نام شده</span>
            ) : course.is_free ? (
              <span className="text-base font-black text-emerald-400">رایگان و تبرکی</span>
            ) : (
              <div className="flex flex-col">
                {course.discount_price && course.discount_price < course.price && (
                  <span className="text-xs text-stone-500 line-through">
                    {course.price.toLocaleString('fa-IR')} تومان
                  </span>
                )}
                <span className="text-base font-black text-amber-300">
                  {course.final_price.toLocaleString('fa-IR')}{' '}
                  <span className="text-xs font-normal text-stone-400">تومان</span>
                </span>
              </div>
            )}
          </div>

          <Link
            to={course.is_enrolled ? `/course/${course.slug}/watch` : `/course/${course.slug}`}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              course.is_enrolled
                ? 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800 border border-emerald-600/40'
                : course.is_free
                ? 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-md border border-emerald-500/50'
                : course.is_sales_enabled === false
                ? 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black shadow-lg shadow-amber-950/40 border border-amber-300/40'
            }`}
          >
            <span>
              {course.is_enrolled
                ? 'ورود به کلاس'
                : course.is_free
                ? 'شروع رایگان'
                : course.is_sales_enabled === false
                ? 'به‌زودی'
                : 'مشاهده دوره'}
            </span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
