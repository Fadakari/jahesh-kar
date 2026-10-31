import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { Clock, PlayCircle, Star, CheckCircle2, Mic } from 'lucide-react';

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
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-amber-900/10 shadow-xs hover:shadow-xl hover:shadow-emerald-950/10 hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Image & Badges */}
        <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
          <img
            src={course.cover_image_url || '/courses/default-course.jpg'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent pointer-events-none" />

          {/* Level badge */}
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-[#faf8f5]/95 backdrop-blur-md text-stone-800 shadow-xs border border-amber-900/15">
            {levelLabels[course.level] || 'عمومی'}
          </div>

          {/* Enrolled banner if already bought */}
          {course.is_enrolled && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-md flex items-center gap-1 border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
              هنرجوی دوره
            </div>
          )}

          {/* Meta stats overlaid on bottom of image */}
          <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white/95 font-medium">
            <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
              {course.lessons_count} جلسه تصویری
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          {course.category && (
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/80 mb-2.5">
              <Mic className="w-3 h-3 text-amber-600" />
              <span>{course.category.title}</span>
            </div>
          )}

          {/* Title */}
          <Link to={`/course/${course.slug}`}>
            <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-900 transition-colors line-clamp-2 leading-relaxed">
              {course.title}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-2 leading-relaxed font-normal">
            {course.short_description}
          </p>

          {/* Instructor & Rating */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
            <span className="font-semibold text-stone-700">{course.instructor_name}</span>
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{course.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div>
            {course.is_enrolled ? (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md">ثبت‌نام شده</span>
            ) : course.is_free ? (
              <span className="text-base font-black text-emerald-700">رایگان!</span>
            ) : (
              <div className="flex flex-col">
                {course.discount_price && course.discount_price < course.price && (
                  <span className="text-xs text-stone-400 line-through">
                    {course.price.toLocaleString('fa-IR')} تومان
                  </span>
                )}
                <span className="text-base font-black text-stone-900">
                  {course.final_price.toLocaleString('fa-IR')}{' '}
                  <span className="text-xs font-normal text-stone-500">تومان</span>
                </span>
              </div>
            )}
          </div>

          <Link
            to={course.is_enrolled ? `/course/${course.slug}/watch` : `/course/${course.slug}`}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              course.is_enrolled
                ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                : course.is_free
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                : course.is_sales_enabled === false
                ? 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                : 'bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-amber-300 shadow-md shadow-emerald-950/20 hover:shadow-lg border border-emerald-700/60'
            }`}
          >
            {course.is_enrolled
              ? 'ورود به کلاس'
              : course.is_free
              ? 'شروع رایگان'
              : course.is_sales_enabled === false
              ? 'به‌زودی'
              : 'مشاهده و ثبت‌نام'}
          </Link>
        </div>
      </div>
    </div>
  );
};
