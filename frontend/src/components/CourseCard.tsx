import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { Clock, PlayCircle, Star, Users, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const levelLabels: Record<string, string> = {
  all: 'همه سطوح',
  beginner: 'مقدماتی',
  intermediate: 'متوسط',
  advanced: 'پیشرفته',
};

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Image & Badges */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          <img
            src={course.cover_image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

          {/* Level badge */}
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-xs">
            {levelLabels[course.level] || 'عمومی'}
          </div>

          {/* Enrolled banner if already bought */}
          {course.is_enrolled && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              دانشجوی دوره
            </div>
          )}

          {/* Meta stats overlaid on bottom of image */}
          <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white/90 font-medium">
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-cyan-300" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
              <PlayCircle className="w-3.5 h-3.5 text-indigo-300" />
              {course.lessons_count} جلسه
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          {course.category && (
            <div className="text-xs font-bold text-indigo-600 mb-2">
              {course.category.title}
            </div>
          )}

          {/* Title */}
          <Link to={`/course/${course.slug}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-relaxed">
              {course.title}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
            {course.short_description}
          </p>

          {/* Instructor & Rating */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{course.instructor_name}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{course.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            {course.is_enrolled ? (
              <span className="text-xs font-bold text-emerald-600">ثبت‌نام شده</span>
            ) : course.is_free ? (
              <span className="text-base font-black text-emerald-600">رایگان!</span>
            ) : (
              <div className="flex flex-col">
                {course.discount_price && course.discount_price < course.price && (
                  <span className="text-xs text-slate-400 line-through">
                    {course.price.toLocaleString('fa-IR')} تومان
                  </span>
                )}
                <span className="text-base font-black text-slate-900">
                  {course.final_price.toLocaleString('fa-IR')}{' '}
                  <span className="text-xs font-normal text-slate-500">تومان</span>
                </span>
              </div>
            )}
          </div>

          <Link
            to={course.is_enrolled ? `/course/${course.slug}/watch` : `/course/${course.slug}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              course.is_enrolled
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-md'
            }`}
          >
            {course.is_enrolled ? 'تماشای دوره' : 'مشاهده و ثبت‌نام'}
          </Link>
        </div>
      </div>
    </div>
  );
};
