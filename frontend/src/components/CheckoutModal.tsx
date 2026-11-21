import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Loader2, 
  Tag, 
  Check, 
  Trash2 
} from 'lucide-react';

interface CheckoutModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AppliedCoupon {
  code: string;
  discount_percent: number;
  discount_amount: number;
  final_price: number;
  message: string;
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

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  if (!isOpen) return null;

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) {
      setCouponError('لطفاً کد تخفیف را وارد کنید.');
      return;
    }

    setValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await api.post('/orders/validate-coupon/', {
        code,
        course_id: course.id,
      });

      if (res.data.valid) {
        setAppliedCoupon(res.data);
        setCouponError(null);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'کد تخفیف وارد شده معتبر نیست.';
      setCouponError(msg);
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  const payablePrice = appliedCoupon ? appliedCoupon.final_price : course.final_price;

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: { course_id: number; coupon_code?: string } = {
        course_id: course.id,
      };

      if (appliedCoupon) {
        payload.coupon_code = appliedCoupon.code;
      }

      const res = await api.post('/orders/checkout/', payload);

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

  const goToMyCourses = () => {
    onClose();
    navigate(`/dashboard?tab=courses&enrolled=${course.slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
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
                <p className="text-xs text-slate-500 mt-0.5">آموزشگاه آنلاین یاسین دهقان</p>
              </div>
            </div>

            {/* Course mini overview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-5">
              <div className="text-sm font-bold text-slate-800 leading-snug">
                {course.title}
              </div>
              <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                <span>مدرس: {course.instructor_name}</span>
                <span>مدت: {course.duration}</span>
              </div>
            </div>

            {/* Discount Coupon Input (for non-free courses) */}
            {!course.is_free && (
              <div className="mb-5 space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  <span>کد تخفیف دارید؟</span>
                </label>

                {appliedCoupon ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-emerald-800 font-mono">
                          {appliedCoupon.code} ({appliedCoupon.discount_percent}٪ تخفیف)
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">
                          مبلغ {appliedCoupon.discount_amount.toLocaleString('fa-IR')} تومان کسر شد
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      title="حذف کد تخفیف"
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          if (couponError) setCouponError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        placeholder="مثلاً: OFF50 یا NOWRUZ"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono uppercase focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all placeholder:font-sans placeholder:normal-case"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || !couponInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1.5"
                      >
                        {validatingCoupon ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          'اعمال کد'
                        )}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] text-rose-600 font-medium pt-0.5">
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-2.5 py-3 border-y border-slate-100 text-xs sm:text-sm mb-5">
              <div className="flex items-center justify-between text-slate-600">
                <span>قیمت دوره:</span>
                <span>{course.price === 0 ? 'رایگان' : `${course.price.toLocaleString('fa-IR')} تومان`}</span>
              </div>

              {course.discount_price && course.discount_price < course.price && (
                <div className="flex items-center justify-between text-rose-600">
                  <span>تخفیف ویژه دوره:</span>
                  <span>-{(course.price - course.discount_price).toLocaleString('fa-IR')} تومان</span>
                </div>
              )}

              {appliedCoupon && appliedCoupon.discount_amount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-bold">
                  <span>تخفیف کوپن ({appliedCoupon.discount_percent}٪):</span>
                  <span>-{appliedCoupon.discount_amount.toLocaleString('fa-IR')} تومان</span>
                </div>
              )}

              <div className="flex items-center justify-between font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-base sm:text-lg text-indigo-600">
                  {payablePrice === 0 ? 'رایگان' : `${payablePrice.toLocaleString('fa-IR')} تومان`}
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
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all text-center cursor-pointer"
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
                  ) : payablePrice === 0 ? (
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

            <div className="pt-4 space-y-2">
              <button
                onClick={goToMyCourses}
                className="w-full py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                رفتن به دوره‌های من و مشاهده ویدیوها
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
