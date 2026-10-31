import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/BrandLogo';
import { 
  Phone, 
  KeyRound, 
  Lock, 
  Sparkles, 
  Loader2,
  AlertCircle,
  ArrowRight,
  UserCheck,
  RotateCcw,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

// Helper to convert Persian/Arabic numerals to ASCII standard
const toAsciiDigits = (str: string): string => {
  if (!str) return '';
  const p2e: Record<string, string> = {
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  };
  return str.replace(/[۰-۹٠-٩]/g, (w) => p2e[w] || w);
};

// Helper to extract error message from backend API response
const parseApiError = (err: any, fallback: string): string => {
  if (!err?.response?.data) return err?.message || fallback;
  const data = err.response.data;

  if (typeof data === 'string') return data;
  if (data.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
  if (data.message) return data.message;
  if (data.detail) return data.detail;

  for (const key of Object.keys(data)) {
    const val = data[key];
    if (Array.isArray(val) && val.length > 0) return String(val[0]);
    if (typeof val === 'string') return val;
  }

  return fallback;
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { sendOtp, verifyOtp, loginWithPassword } = useAuth();

  // Priority: 'password' is now default, with OTP easily accessible
  const [step, setStep] = useState<'password' | 'phone' | 'otp'>('password');
  
  // Password Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Phone & OTP state
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpResponseMeta, setOtpResponseMeta] = useState<Record<string, any>>({});

  // Resend Countdown Timer (Seconds)
  const [timer, setTimer] = useState<number>(0);

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Timer countdown hook
  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 1. Password login (Primary default)
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = toAsciiDigits(username).trim();
    if (!cleanUser || !password) {
      setError('لطفاً نام کاربری/شماره همراه و رمز عبور را وارد نمایید.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await loginWithPassword(cleanUser, password);
      navigate(redirectPath);
    } catch (err: any) {
      setError(parseApiError(err, 'نام کاربری یا رمز عبور اشتباه است.'));
    } finally {
      setLoading(false);
    }
  };

  // 2. Send OTP (Alternative/Fallback)
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = toAsciiDigits(phone).trim();
    if (!cleanPhone) {
      setError('لطفاً شماره تماس خود را وارد فرمایید.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessInfo(null);

    try {
      const res = await sendOtp(cleanPhone);
      setOtpResponseMeta(res || {});
      setStep('otp');

      const waitTime = res?.resend_after || res?.expires_in || 60;
      setTimer(typeof waitTime === 'number' ? waitTime : 60);

      if (res?.message) {
        setSuccessInfo(res.message);
      }
    } catch (err: any) {
      setError(parseApiError(err, 'خطا در ارسال کد تایید. لطفاً مجدداً بررسی و تلاش فرمایید.'));
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = toAsciiDigits(otpCode).trim();
    if (!cleanOtp) {
      setError('لطفاً کد تایید پیامک‌شده را وارد کنید.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cleanPhone = toAsciiDigits(phone).trim();
      await verifyOtp(cleanPhone, cleanOtp, undefined, otpResponseMeta);
      navigate(redirectPath);
    } catch (err: any) {
      setError(parseApiError(err, 'کد تایید اشتباه است یا منقضی شده است.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 via-[#fcfcfb] to-stone-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200/90 shadow-2xl shadow-emerald-950/5 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex justify-center group">
            <BrandLogo variant="light" size="lg" className="justify-center" />
          </Link>

          <div>
            <h2 className="text-xl font-black text-stone-900">
              {step === 'password' && 'ورود به حساب کاربری'}
              {step === 'phone' && 'ورود با کد تایید پیامکی'}
              {step === 'otp' && 'تایید شماره همراه'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {step === 'password' && 'نام کاربری یا شماره همراه و رمز عبور خود را وارد نمایید'}
              {step === 'phone' && 'شماره همراه خود را وارد کنید تا کد تایید برایتان ارسال شود'}
              {step === 'otp' && `کد تایید ارسال‌شده به شماره ${phone} را وارد فرمایید`}
            </p>
          </div>
        </div>

        {/* Success Info Banner */}
        {successInfo && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successInfo}</span>
          </div>
        )}

        {/* Error message banner */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: PASSWORD LOGIN (PRIMARY DEFAULT) */}
        {step === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">نام کاربری یا شماره همراه</label>
              <input
                type="text"
                placeholder="نام کاربری یا شماره همراه"
                dir="ltr"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 outline-none transition-all placeholder:text-stone-400"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">رمز عبور</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-11 pl-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 outline-none transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-sm shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-emerald-700/60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال بررسی...
                </>
              ) : (
                'ورود به حساب کاربری'
              )}
            </button>

            {/* Prominent OTP Login Option Card */}
            <div className="pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setError(null);
                  setSuccessInfo(null);
                }}
                className="w-full p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 text-amber-900 font-bold text-xs transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-200/70 flex items-center justify-center text-amber-800">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div className="text-right">
                    <div>ورود با کد تایید پیامکی (OTP)</div>
                    <div className="text-[10px] text-amber-700/80 font-normal">رمز عبور ندارید یا فراموش کرده‌اید؟ با پیامک وارد شوید</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 rotate-180 text-amber-700 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PHONE INPUT FOR OTP */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>شماره همراه شما</span>
                <span className="text-[11px] font-normal text-stone-400">مثال: 09123456789</span>
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="09..."
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pr-12 pl-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-base font-bold text-stone-900 tracking-wider focus:bg-white focus:ring-2 focus:ring-emerald-700 outline-none transition-all placeholder:text-stone-400"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-emerald-700/60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال ارسال کد...
                </>
              ) : (
                <>
                  <span>دریافت کد پیامکی</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('password');
                  setError(null);
                  setSuccessInfo(null);
                }}
                className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
              >
                بازگشت به ورود با رمز عبور
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-stone-700">کد تایید پیامک‌شده</label>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setError(null);
                    setSuccessInfo(null);
                  }}
                  className="text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  ویرایش شماره ({phone})
                </button>
              </div>

              <div className="relative">
                <KeyRound className="w-5 h-5 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="•••••"
                  dir="ltr"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full pr-12 pl-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-lg font-black tracking-widest text-center text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-700 outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-emerald-700/60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال تایید...
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5" />
                  تایید و ورود به آکادمی
                </>
              )}
            </button>

            {/* Resend OTP Section */}
            <div className="pt-2 flex items-center justify-center text-xs text-stone-500">
              {timer > 0 ? (
                <div className="text-stone-400 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>امکان ارسال مجدد کد تا: </span>
                  <span className="font-mono font-bold text-emerald-800" dir="ltr">
                    {formatTimer(timer)}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSendOtp()}
                  className="text-emerald-800 font-bold hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ارسال مجدد کد تایید</span>
                </button>
              )}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('password');
                  setError(null);
                  setSuccessInfo(null);
                }}
                className="text-xs text-stone-500 hover:text-stone-700 cursor-pointer"
              >
                ورود با نام کاربری و رمز عبور
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
