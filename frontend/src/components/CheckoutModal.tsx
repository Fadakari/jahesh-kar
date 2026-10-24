import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import confetti from 'canvas-confetti';
import { X, CheckCircle, ShieldCheck, CreditCard, Sparkles, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  course,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string>('');

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/orders/checkout/', { course_id: course.id });

      // If bank gateway redirect (e.g. ZarinPal)
      if (res.data.mode === 'redirect' && res.data.payment_url) {
        window.location.href = res.data.payment_url;
        return;
      }

      setTrackingCode(res.data.tracking_code || 'JK-DIRECT');
      setIsSuccess(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'خطا در ثبت سفارش. لطفا مجددا تلاش کنید.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const goToPlayer = () => {
    onClose();
    navigate(`/course/${course.slug}/watch`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {course.is_free ? 'ثبت‌نام در دوره رایگان' : 'تایید سفارش و پرداخت'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">آموزشگاه آنلاین جهش کار</p>
              </div>
            </div>

            {/* Course mini overview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
              <div className="text-sm font-bold text-slate-800 leading-snug">
                {course.title}
              </div>
              <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                <span>مدرس: {course.instructor_name}</span>
                <span>مدت: {course.duration}</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-3 py-3 border-y border-slate-100 text-sm mb-6">
              <div className="flex items-center justify-between text-slate-600">
                <span>قیمت دوره:</span>
                <span>{course.price === 0 ? 'رایگان' : `${course.price.toLocaleString('fa-IR')} تومان`}</span>
              </div>

              {course.discount_price && course.discount_price < course.price && (
                <div className="flex items-center justify-between text-rose-600">
                  <span>تخفیف ویژه:</span>
                  <span>-{(course.price - course.discount_price).toLocaleString('fa-IR')} تومان</span>
                </div>
              )}

              <div className="flex items-center justify-between font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-lg text-indigo-600">
                  {course.final_price === 0 ? 'رایگان' : `${course.final_price.toLocaleString('fa-IR')} تومان`}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-4 text-center">
                {error}
              </div>
            )}

            {!user ? (
              <div className="space-y-3">
                <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200 text-center font-medium">
                  برای تکمیل ثبت نام، ابتدا وارد حساب کاربری خود شوید یا با شماره موبایل ثبت نام کنید.
                </div>
                <button
                  onClick={() => navigate('/login?redirect=' + encodeURIComponent(window.location.pathname))}
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all text-center"
                >
                  ورود یا ثبت‌نام سریع
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>دسترسی آنی و بدون محدودیت به تمام ویدیوها و فایل‌ها</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      در حال پردازش...
                    </>
                  ) : course.is_free ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      شروع یادگیری رایگان
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      تایید و پرداخت آنلاین
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-black text-slate-900">
              تبریک! ثبت‌نام شما تکمیل شد
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              دسترسی به تمامی ویدیوها و محتوای دوره برای شما فعال شد. کد پیگیری شما:
            </p>

            <div className="p-3 rounded-xl bg-slate-100 font-mono font-bold text-indigo-700 text-base tracking-wider inline-block">
              {trackingCode}
            </div>

            <div className="pt-4">
              <button
                onClick={goToPlayer}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                ورود به تماشای دوره
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
