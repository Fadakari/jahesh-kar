import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { BrandLogo } from './BrandLogo';
import { 
  BookOpen, 
  LogOut, 
  LogIn, 
  GraduationCap, 
  Menu, 
  X, 
  LayoutDashboard,
  Sparkles,
  Music2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="group flex items-center">
              <BrandLogo variant="light" size="md" />
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-stone-700">
              <Link 
                to="/courses" 
                className="hover:text-emerald-800 flex items-center gap-1.5 transition-colors py-2"
              >
                <BookOpen className="w-4 h-4 text-emerald-700" />
                بانک دوره‌ها
              </Link>
              <a 
                href="#maqamat" 
                className="hover:text-emerald-800 flex items-center gap-1.5 transition-colors py-2"
              >
                <Music2 className="w-4 h-4 text-amber-600" />
                آزمایشگاه نغمات
              </a>
              <Link 
                to="/courses?price=free" 
                className="hover:text-amber-700 transition-colors py-2 flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                آموزش‌های رایگان
              </Link>
            </nav>
          </div>

          {/* User Section Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-sm hover:bg-emerald-100 transition-colors border border-emerald-200/80 shadow-xs"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  دوره‌های من
                </Link>

                <div className="flex items-center gap-2 pr-2 border-r border-stone-200">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-stone-700 hover:text-emerald-800 text-sm font-semibold py-1 px-2.5 rounded-xl hover:bg-stone-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shadow-xs">
                      {user.full_name ? user.full_name.charAt(0) : 'ذ'}
                    </div>
                    <span>{user.full_name || user.username}</span>
                  </Link>

                  <button
                    onClick={logout}
                    title="خروج از حساب"
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-amber-300 font-bold text-sm shadow-md shadow-emerald-950/20 border border-emerald-700/60 hover:shadow-lg transition-all duration-200"
                >
                  <LogIn className="w-4 h-4 text-amber-400" />
                  ورود یا عضویت
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl text-stone-700 font-bold hover:bg-emerald-50"
          >
            <BookOpen className="w-5 h-5 text-emerald-700" />
            بانک دوره‌های مداحی
          </Link>
          <Link
            to="/courses?price=free"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl text-stone-700 font-bold hover:bg-amber-50"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            آموزش‌های رایگان
          </Link>

          <div className="pt-3 border-t border-stone-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-900 font-bold"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-emerald-700" />
                    داشبورد و دوره‌های من
                  </span>
                  <span className="text-xs text-emerald-800 bg-white px-2 py-1 rounded-md shadow-xs">
                    {user.full_name || user.username}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-3 text-rose-600 font-bold hover:bg-rose-50 rounded-xl cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  خروج از حساب کاربری
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-800 text-amber-300 font-bold shadow-md"
              >
                <LogIn className="w-5 h-5 text-amber-400" />
                ورود یا ثبت‌نام
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
