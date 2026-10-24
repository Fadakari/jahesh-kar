import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { Course, WatchLessonData } from '../types';
import { 
  ArrowRight, 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  Download, 
  ChevronRight, 
  ChevronLeft, 
  ListVideo, 
  FileText, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const CourseWatchPlayerPage: React.FC = () => {
  const { slug, lessonId } = useParams<{ slug: string; lessonId?: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<WatchLessonData | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(
    lessonId ? parseInt(lessonId) : null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch course structure
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await api.get(`/courses/${slug}/`);
        setCourse(res.data);

        // If no lessonId in URL, pick the first lesson available
        if (!lessonId) {
          let firstLessonId: number | null = null;
          if (res.data.sections && res.data.sections.length > 0) {
            for (const s of res.data.sections) {
              if (s.lessons && s.lessons.length > 0) {
                firstLessonId = s.lessons[0].id;
                break;
              }
            }
          } else if (res.data.direct_lessons && res.data.direct_lessons.length > 0) {
            firstLessonId = res.data.direct_lessons[0].id;
          }

          if (firstLessonId) {
            setActiveLessonId(firstLessonId);
          }
        } else {
          setActiveLessonId(parseInt(lessonId));
        }
      } catch (err: any) {
        setError('خطا در بارگذاری اطلاعات دوره.');
      }
    };
    fetchCourseData();
  }, [slug, lessonId]);

  // Fetch specific lesson watch details whenever activeLessonId changes
  useEffect(() => {
    if (!activeLessonId || !slug) return;

    const fetchLesson = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/courses/${slug}/lessons/${activeLessonId}/`);
        setCurrentLesson(res.data);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError(err.response?.data?.error || 'برای دسترسی به این ویدیو، ابتدا دوره را تهیه کنید.');
        } else {
          setError('خطا در پخش این جلسه.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [slug, activeLessonId]);

  const selectLesson = (id: number) => {
    setActiveLessonId(id);
    navigate(`/course/${slug}/watch/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Navigation Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            to={`/course/${slug}`}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به صفحه دوره</span>
          </Link>

          <div className="hidden sm:block border-r border-slate-700 pr-4">
            <h1 className="text-sm font-bold text-white truncate max-w-md">
              {course?.title || 'در حال بارگذاری...'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <ListVideo className="w-4 h-4" />
            <span>{sidebarOpen ? 'بستن لیست جلسات' : 'نمایش لیست جلسات'}</span>
          </button>
        </div>
      </header>

      {/* Main Learning Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Main Player & Content Column */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Video Container */}
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800 flex items-center justify-center">
              
              {loading ? (
                <div className="text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">در حال بارگذاری ویدیوی جلسه...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center max-w-md space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-white">محتوای قفل شده</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
                  <Link
                    to={`/course/${slug}`}
                    className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md"
                  >
                    ثبت‌نام و بازگشایی دوره
                  </Link>
                </div>
              ) : currentLesson?.video_url ? (
                <video
                  key={currentLesson.video_url}
                  src={currentLesson.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">ویدیویی برای این جلسه ثبت نشده است.</p>
                </div>
              )}

            </div>

            {/* Lesson Title & Controls */}
            {currentLesson && (
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-indigo-400">
                      جلسه {currentLesson.order} از {course?.lessons_count || ''}
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      {currentLesson.title}
                    </h2>
                  </div>

                  {/* Prev / Next buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => currentLesson.prev_lesson_id && selectLesson(currentLesson.prev_lesson_id)}
                      disabled={!currentLesson.prev_lesson_id}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>جلسه قبل</span>
                    </button>

                    <button
                      onClick={() => currentLesson.next_lesson_id && selectLesson(currentLesson.next_lesson_id)}
                      disabled={!currentLesson.next_lesson_id}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                      <span>جلسه بعد</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Attachments / Download Resources */}
                {currentLesson.attachment_url && (
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">فایل‌های تمرینی و سورس‌کد این جلسه</div>
                        <div className="text-xs text-slate-400">دانلود کدهای پروژه، اسلایدها و منابع جانبی</div>
                      </div>
                    </div>
                    <a
                      href={currentLesson.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <span>دانلود فایل</span>
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Lesson Description */}
                {currentLesson.description && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span>نکات و توضیحات این جلسه:</span>
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
                      {currentLesson.description}
                    </p>
                  </div>
                )}

              </div>
            )}
          </div>

        </main>

        {/* Sidebar Playlist */}
        {sidebarOpen && (
          <aside className="w-80 sm:w-96 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-hidden">
            
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <ListVideo className="w-4 h-4 text-indigo-400" />
                سرفصل‌ها و جلسات
              </span>
              <span className="text-xs text-slate-400">
                {course?.lessons_count || 0} ویدیو
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-4">
              
              {course?.sections && course.sections.length > 0 ? (
                course.sections.map((section) => (
                  <div key={section.id} className="space-y-1.5 pt-2">
                    <div className="px-3 py-1 text-xs font-black text-slate-400">
                      {section.title}
                    </div>

                    <div className="space-y-1">
                      {section.lessons.map((lesson) => {
                        const isActive = activeLessonId === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => selectLesson(lesson.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-2xl text-right transition-all cursor-pointer ${
                              isActive
                                ? 'bg-indigo-600 text-white shadow-md font-bold'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              {isActive ? (
                                <PlayCircle className="w-4 h-4 shrink-0 text-white fill-white/20 animate-pulse" />
                              ) : lesson.has_access || lesson.is_free_preview ? (
                                <PlayCircle className="w-4 h-4 shrink-0 text-slate-500" />
                              ) : (
                                <Lock className="w-4 h-4 shrink-0 text-slate-600" />
                              )}
                              <span className="text-xs truncate">
                                {lesson.order}. {lesson.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 pr-2">
                              <span className={`text-[11px] ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                                {lesson.duration}
                              </span>
                              {lesson.is_free_preview && !isActive && (
                                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                  رایگان
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : null}

              {/* Direct Lessons if any */}
              {course?.direct_lessons && course.direct_lessons.length > 0 && (
                <div className="space-y-1 pt-2">
                  {course.direct_lessons.map((lesson) => {
                    const isActive = activeLessonId === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => selectLesson(lesson.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-right transition-all cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md font-bold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <PlayCircle className="w-4 h-4 shrink-0" />
                          <span className="text-xs truncate">
                            {lesson.order}. {lesson.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{lesson.duration}</span>
                      </button>
                    );
                  })}
                </div>
              )}

            </div>

          </aside>
        )}

      </div>

    </div>
  );
};
