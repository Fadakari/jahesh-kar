import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Phone, 
  KeyRound, 
  User, 
  Lock, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  MessageSquare, 
  Loader2,
  AlertCircle
} from 'lucide-react';

type AuthMode = 'otp' | 'password_login' | 'register';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { sendOtp, verifyOtp, loginWithPassword, registerWithPassword } = useAuth();

  const [mode, setMode] = useState<AuthMode>('otp');
  
  // OTP State
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [fullName, setFullName] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);

  // Password Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('لطفا شماره موبایل معتبر ۱۱ رقمی وارد کنید.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await sendOtp(phone);
      setOtpSent(true);
      setSuccessMsg(res.message);
      if (res.dev_code) {
        setDevCode(res.dev_code);
      }
    } catch (err: any) {
      setError(err.response?.data?.phone_number?.[0] || 'خطا در ارسال پیامک تایید.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('لطفا کد تایید را به درستی وارد کنید.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await verifyOtp(phone, otpCode, fullName);
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.response?.data?.error || 'کد تایید اشتباه است یا منقضی شده.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      setError('لطفا نام کاربری و رمز عبور را وارد کنید.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await loginWithPassword(loginIdentifier, loginPassword);
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.response?.data?.error || 'اطلاعات ورود نامعتبر است.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Password Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regPassword) {
      setError('نام کاربری و رمز عبور الزامی است.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await registerWithPassword(regUsername, regPassword, regFullName, regPhone);
      navigate(redirectPath);
    } catch (err: any) {
      const errData = err.response?.data;
      const msg = errData?.username?.[0] || errData?.phone_number?.[0] || 'خطا در ثبت‌نام.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl shadow-indigo-500/5 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900">جهش کار</span>
          </Link>
          <h2 className="text-xl font-black text-slate-900">
            {mode === 'otp' && 'ورود با پیامک (سریع‌ترین روش)'}
            {mode === 'password_login' && 'ورود با نام کاربری و رمز عبور'}
            {mode === 'register' && 'عضویت در آکادمی جهش کار'}
          </h2>
          <p className="text-xs text-slate-500">
            روش ورود مورد نظر خود را به سادگی انتخاب کنید
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold text-slate-600">
          <button
            onClick={() => {
              setMode('otp');
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'otp'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            کد پیامکی
          </button>

          <button
            onClick={() => {
              setMode('password_login');
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'password_login'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            رمز عبور
          </button>

          <button
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            ثبت‌نام جدید
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Phone OTP */}
        {mode === 'otp' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">شماره موبایل</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="09123456789"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'دریافت کد تایید پیامکی'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>کد به {phone} ارسال شد.</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode('');
                    }}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    ویرایش شماره
                  </button>
                </div>

                {devCode && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center font-bold">
                    کد تایید تستی شما: <span className="text-sm font-mono tracking-widest text-indigo-700">{devCode}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">کد تایید ۵ رقمی</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="12345"
                      dir="ltr"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black tracking-widest text-center text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">نام و نام خانوادگی (اختیاری)</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="مثال: علی محمدی"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تایید و ورود به سایت'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Username & Password Login */}
        {mode === 'password_login' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">نام کاربری یا شماره موبایل</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="admin یا student یا شماره موبایل"
                  dir="ltr"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">کلمه عبور</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  dir="ltr"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              اکانت‌های پیش‌فرض تست: <br />
              • ادمین: <code className="text-indigo-600 font-bold">admin / admin123456</code><br />
              • دانشجو: <code className="text-indigo-600 font-bold">student / user123456</code>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ورود به حساب کاربری'}
            </button>
          </form>
        )}

        {/* Tab 3: Register */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">نام و نام خانوادگی</label>
              <input
                type="text"
                placeholder="مثال: رضا صادقی"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">نام کاربری دلخواه (انگلیسی)</label>
              <input
                type="text"
                placeholder="my_username"
                dir="ltr"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">شماره موبایل (اختیاری جهت پیامک)</label>
              <input
                type="tel"
                placeholder="09123456789"
                dir="ltr"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">رمز عبور</label>
              <input
                type="password"
                placeholder="حداقل ۴ کاراکتر"
                dir="ltr"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'عضویت و ورود'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
