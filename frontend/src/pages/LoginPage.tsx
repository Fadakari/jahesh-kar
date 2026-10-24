import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Phone, 
  KeyRound, 
  Lock, 
  Sparkles, 
  Loader2,
  AlertCircle,
  ArrowRight,
  UserCheck
} from 'lucide-react';

// Helper to convert Persian/Arabic numerals to ASCII standard
const toAsciiDigits = (str: string): string => {
  const p2e: Record<string, string> = {
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  };
  return str.replace(/[۰-۹٠-٩]/g, (w) => p2e[w] || w);
};

const normalizePhone = (str: string): string => {
  let cleaned = toAsciiDigits(str).trim();
  cleaned = cleaned.replace(/[\s\-()_./\\]+/g, '');
  if (cleaned.startsWith('+98')) cleaned = '0' + cleaned.slice(3);
  else if (cleaned.startsWith('0098')) cleaned = '0' + cleaned.slice(4);
  else if (cleaned.startsWith('98') && cleaned.length === 12) cleaned = '0' + cleaned.slice(2);
  else if (!cleaned.startsWith('0') && cleaned.length === 10 && cleaned.startsWith('9')) cleaned = '0' + cleaned;
  return cleaned;
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { sendOtp, verifyOtp, loginWithPassword } = useAuth();

  // Unified flow: step 1 = enter phone, step 2 = enter otp, step 3 = password
  const [step, setStep] = useState<'phone' | 'otp' | 'password'>('phone');
  
  // Phone & OTP state
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Password Login state (alternative for admin)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Send OTP (unified for both new and existing users)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone || cleanPhone.length !== 11 || !cleanPhone.startsWith('09')) {
      setError('لطفا شماره موبایل معتبر ۱۱ رقمی (مانند 09123456789) وارد کنید.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await sendOtp(cleanPhone);
      setStep('otp');
    } catch (err: any) {
      const msg = 
        err.response?.data?.phone_number?.[0] || 
        err.response?.data?.error || 
        err.response?.data?.detail || 
        'خطا در ارسال پیامک تایید. لطفاً لحظاتی دیگر تلاش کنید.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP (automatically logs in or creates account)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = toAsciiDigits(otpCode).trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      setError('لطفا کد تایید را به درستی وارد کنید.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const cleanPhone = normalizePhone(phone);
      await verifyOtp(cleanPhone, cleanOtp);
      navigate(redirectPath);
    } catch (err: any) {
      const msg = 
        err.response?.data?.code?.[0] || 
        err.response?.data?.error || 
        err.response?.data?.detail || 
        'کد تایید اشتباه است یا منقضی شده است.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 3. Password login for Admin / Staff
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('نام کاربری و رمز عبور را وارد کنید.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await loginWithPassword(toAsciiDigits(username.trim()), password);
      navigate(redirectPath);
    } catch (err: any) {
      const msg = 
        err.response?.data?.error || 
        err.response?.data?.detail || 
        'نام کاربری یا رمز عبور اشتباه است.';
      setError(msg);
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
              {step === 'otp' && `کد پیامک‌شده به شماره ${phone} را وارد کنید`}
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

              <span className="text-[11px] text-slate-400">ثبت‌نام خودکار با شماره</span>
            </div>
          </form>
        )}

        {/* STEP 2: OTP Code input */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">کد تایید پیامک‌شده</label>
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
              <label className="text-xs font-bold text-slate-700">نام کاربری یا شماره همراه</label>
              <input
                type="text"
                placeholder="نام کاربری یا شماره همراه"
                dir="ltr"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">رمز عبور</label>
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
