import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Phone, 
  KeyRound, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { sendOtp, verifyOtp, loginWithPassword } = useAuth();

  // Unified flow: step 1 = enter phone, step 2 = enter otp
  const [step, setStep] = useState<'phone' | 'otp' | 'password'>('phone');
  
  // Phone & OTP state
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);

  // Password Login state (alternative for admin)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Send OTP (unified for both new and existing users)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('لطفا شماره موبایل معتبر ۱۱ رقمی (مثلاً 09123456789) وارد کنید.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await sendOtp(cleanPhone);
      setStep('otp');
      if (res.dev_code) {
        setDevCode(res.dev_code);
        setOtpCode(res.dev_code); // Auto-fill in dev for zero-friction testing!
      }
    } catch (err: any) {
      const msg = err.response?.data?.phone_number?.[0] || err.response?.data?.error || 'خطا در ارسال پیامک تایید.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP (automatically logs in or creates account)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setError('لطفا کد تایید را به درستی وارد کنید.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await verifyOtp(phone.trim(), otpCode.trim());
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.response?.data?.error || 'کد تایید اشتباه است یا منقضی شده.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Password login for Admin / Staff
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('نام کاربری و کلمه عبور را وارد کنید.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await loginWithPassword(username.trim(), password);
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.response?.data?.error || 'نام کاربری یا رمز عبور اشتباه است.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-2xl shadow-indigo-500/5 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900">جهش کار</span>
          </Link>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              {step === 'phone' && 'ورود یا عضویت سریع'}
              {step === 'otp' && 'کد تایید را وارد کنید'}
              {step === 'password' && 'ورود با نام‌کاربری و رمز عبور'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {step === 'phone' && 'اگر قبلا ثبت‌نام نکرده‌اید، با وارد کردن شماره حسابتان خودکار ساخته می‌شود'}
              {step === 'otp' && `کد تایید به شماره ${phone} ارسال شد`}
              {step === 'password' && 'ویژه مدیران سامانه یا کاربران دارای رمز عبور'}
            </p>
          </div>
        </div>

        {/* Error message banner */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Phone input */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>شماره موبایل شما</span>
                <span className="text-[11px] font-normal text-slate-400">مثال: 09123456789</span>
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="09..."
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 tracking-wider focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال بررسی...
                </>
              ) : (
                <>
                  <span>دریافت کد تایید و ورود</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => {
                  setStep('password');
                  setError(null);
                }}
                className="text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                ورود با نام‌کاربری و رمز عبور
              </button>

              <span className="text-[11px] text-slate-400">بدون نیاز به ثبت نام مجزا</span>
            </div>
          </form>
        )}

        {/* STEP 2: OTP Code input */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            
            {/* Dev mode test code notice with auto-fill button */}
            {devCode && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>محیط توسعه لوکال (شبیه‌ساز پیامک فعال است)</span>
                </div>
                <div className="text-[11px] text-amber-700 leading-relaxed">
                  کد آزمایشی برای شما: <span className="font-mono font-black text-indigo-700 text-sm px-1.5 py-0.5 bg-white rounded-md border border-amber-200">{devCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(devCode)}
                  className="w-full py-1.5 px-3 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-[11px] transition-colors cursor-pointer text-center"
                >
                  کلیک برای درج خودکار کد تستی
                </button>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">کد تایید ۵ رقمی</label>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setError(null);
                  }}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  ویرایش شماره ({phone})
                </button>
              </div>

              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="•••••"
                  dir="ltr"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black tracking-widest text-center text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال تایید...
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5" />
                  تایید و ورود به سایت
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Password Login for Admin */}
        {step === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">نام کاربری یا شماره موبایل</label>
              <input
                type="text"
                placeholder="admin یا student"
                dir="ltr"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">کلمه عبور</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
              <div>اکانت‌های پیش‌فرض تست:</div>
              <div>• مدیر: <code className="text-indigo-600 font-bold">admin / admin123456</code></div>
              <div>• دانشجو: <code className="text-indigo-600 font-bold">student / user123456</code></div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ورود با رمز عبور'}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setError(null);
                }}
                className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                بازگشت به ورود با شماره موبایل
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
