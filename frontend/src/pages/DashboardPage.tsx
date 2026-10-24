import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import confetti from 'canvas-confetti';
import { Enrollment, Order } from '../types';
import { 
  GraduationCap, 
  Receipt, 
  User as UserIcon, 
  PlayCircle, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  ShieldAlert,
  Loader2,
  Sparkles
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, isLoading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paymentStatus = searchParams.get('payment');
  const trackingParam = searchParams.get('tracking');
  const courseSlugParam = searchParams.get('course');
  const enrolledParam = searchParams.get('enrolled');

  const [activeTab, setActiveTab] = useState<'courses' | 'orders' | 'profile'>('courses');

  useEffect(() => {
    if (enrolledParam || searchParams.get('tab') === 'courses') {
      setActiveTab('courses');
    }
  }, [enrolledParam, searchParams]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (paymentStatus === 'success') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  }, [paymentStatus]);

  // Profile form
  const [fullNameInput, setFullNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login?redirect=/dashboard');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      setFullNameInput(user.full_name || '');
      setEmailInput(user.email || '');

      const fetchData = async () => {
        setLoadingData(true);
        try {
          const [enrRes, ordRes] = await Promise.all([
            api.get('/orders/my-courses/'),
            api.get('/orders/my-orders/'),
          ]);
          setEnrollments(Array.isArray(enrRes?.data) ? enrRes.data : []);
          setOrders(Array.isArray(ordRes?.data) ? ordRes.data : []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      await api.put('/accounts/me/', {
        full_name: fullNameInput,
        email: emailInput,
      });
      setProfileMsg('اطلاعات با موفقیت ذخیره شد.');
      await refreshUser();
    } catch {
      setProfileMsg('خطا در بروزرسانی اطلاعات.');
    } finally {
      setSavingProfile(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Payment Success Alert if returned from Bank Gateway */}
      {paymentStatus === 'success' && (
        <div className="bg-emerald-50 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-emerald-900 shadow-lg shadow-emerald-500/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-emerald-950">پرداخت شما با موفقیت انجام شد!</h2>
              <p className="text-xs text-emerald-700 mt-0.5">
                دسترسی کامل به دوره برای شما فعال شد. کد رهگیری: <span className="font-mono font-bold">{trackingParam}</span>
              </p>
            </div>
          </div>
          {courseSlugParam && (
            <div className="pt-2">
              <Link
                to={`/course/${courseSlugParam}/watch`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                <PlayCircle className="w-4 h-4" />
                <span>شروع تماشای دوره</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user.full_name ? user.full_name.charAt(0) : user.username.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-900">
              {user.full_name || user.username}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {user.phone_number && <span>شماره موبایل: {user.phone_number}</span>}
              <span>نام کاربری: @{user.username}</span>
            </div>
          </div>
        </div>

        {/* Admin quick link if staff */}
        {user.is_staff && (
          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition-colors shadow-md"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>ورود به پنل ادمین جنگو</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 text-sm font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>دوره‌های من ({enrollments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>تراکنش‌ها و فاکتورها</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>مشخصات حساب</span>
        </button>
      </div>

      {/* Tab 1: Enrolled Courses */}
      {activeTab === 'courses' && (
        <div>
          {loadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-4 border border-slate-100 animate-pulse space-y-4">
                  <div className="aspect-video bg-slate-200 rounded-2xl" />
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                </div>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">شما هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                از میان دوره‌های کاربردی جهش کار انتخاب کنید و یادگیری را همین امروز شروع کنید.
              </p>
              <Link
                to="/courses"
                className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md"
              >
                مشاهده دوره‌ها
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enr) => {
                const c = enr.course;
                const isJustEnrolled = enrolledParam === c.slug;
                return (
                  <div
                    key={enr.id}
                    className={`bg-white rounded-3xl overflow-hidden border transition-all flex flex-col justify-between ${
                      isJustEnrolled
                        ? 'border-emerald-500 ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/10'
                        : 'border-slate-200/90 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="aspect-video relative bg-slate-900">
                        <img
                          src={c.cover_image_url || '/courses/default-course.jpg'}
                          alt={c.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isJustEnrolled ? 'ثبت‌نام جدید' : 'فعال'}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        {isJustEnrolled && (
                          <div className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                            🎉 دوره تازه خریداری شده شما
                          </div>
                        )}
                        <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                          {c.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {c.short_description}
                        </p>
                        <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{c.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <Link
                        to={`/course/${c.slug}/watch`}
                        className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        تماشای ویدیوها و دانلود فایل‌ها
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">تاریخچه سفارشات و تراکنش‌ها</h3>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              هنوز هیچ تراکنشی ثبت نشده است.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4">کد رهگیری</th>
                    <th className="p-4">عنوان دوره</th>
                    <th className="p-4">مبلغ پرداختی</th>
                    <th className="p-4">وضعیت</th>
                    <th className="p-4">تاریخ ثبت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono font-bold text-indigo-600">{o.tracking_code}</td>
                      <td className="p-4 font-semibold text-slate-900">{o.course_title}</td>
                      <td className="p-4">{o.amount === 0 ? 'رایگان' : `${o.amount.toLocaleString('fa-IR')} تومان`}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                          {o.status === 'completed' ? 'پرداخت شده' : o.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(o.created_at).toLocaleDateString('fa-IR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 max-w-lg shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">ویرایش مشخصات فردی</h3>

          {profileMsg && (
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">نام و نام خانوادگی</label>
              <input
                type="text"
                value={fullNameInput}
                onChange={(e) => setFullNameInput(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">آدرس ایمیل</label>
              <input
                type="email"
                dir="ltr"
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ذخیره تغییرات'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
