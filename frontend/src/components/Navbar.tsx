import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  GraduationCap, 
  Menu, 
  X, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  جهش کار
                </span>
                <span className="text-[11px] font-medium text-slate-500 -mt-1">
                  پلتفرم مهارت و ورود به بازار کار
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <Link 
                to="/courses" 
                className="hover:text-indigo-600 flex items-center gap-1.5 transition-colors py-2"
              >
                <BookOpen className="w-4 h-4" />
                همه دوره‌ها
              </Link>
              <Link 
                to="/courses?price=free" 
                className="hover:text-emerald-600 transition-colors py-2 flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                دوره‌های رایگان
              </Link>
            </nav>
          </div>

          {/* User Section Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm hover:bg-indigo-100 transition-colors border border-indigo-200/60"
                >
                  <GraduationCap className="w-4 h-4" />
                  دوره‌های من
                </Link>

                <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 text-sm font-semibold py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {user.full_name ? user.full_name.charAt(0) : 'ک'}
                    </div>
                    <span>{user.full_name || user.username}</span>
                  </Link>

                  <button
                    onClick={logout}
                    title="خروج از حساب"
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  ورود یا عضویت
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
          >
            <BookOpen className="w-5 h-5 text-indigo-600" />
            همه دوره‌های آموزشی
          </Link>
          <Link
            to="/courses?price=free"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            دوره‌های رایگان
          </Link>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 text-indigo-800 font-bold"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                    داشبورد و دوره‌های من
                  </span>
                  <span className="text-xs text-indigo-600 bg-white px-2 py-1 rounded-md">
                    {user.full_name || user.username}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-3 text-rose-600 font-bold hover:bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-5 h-5" />
                  خروج از حساب کاربری
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-bold"
              >
                <LogIn className="w-5 h-5" />
                ورود یا ثبت‌نام
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
