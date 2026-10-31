import React, { useState } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  showText = true,
  className = '',
}) => {
  const { settings } = useSiteSettings();
  const [imgError, setImgError] = useState(false);

  // Dynamic values with elegant fallbacks
  const siteTitle = settings?.site_title || 'آواز آموز';
  const logoUrl = settings?.logo_url;

  // Sizing definitions
  const sizeClasses = {
    sm: {
      icon: 'w-8 h-8 rounded-xl',
      img: 'h-8 max-w-[130px]',
      title: 'text-lg font-black',
      subtitle: 'text-[10px]',
    },
    md: {
      icon: 'w-11 h-11 rounded-2xl',
      img: 'h-11 max-w-[170px]',
      title: 'text-2xl font-black',
      subtitle: 'text-[11px]',
    },
    lg: {
      icon: 'w-14 h-14 rounded-3xl',
      img: 'h-14 max-w-[210px]',
      title: 'text-3xl font-black',
      subtitle: 'text-xs',
    },
  }[size];

  // Default Vector Emblem for AvazAmuz (Mehrab Arch + Acoustic Soundwave + Shamsah Star)
  const renderFallbackIcon = () => (
    <div
      className={`${sizeClasses.icon} relative flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[#06261d] via-[#0b382c] to-[#041812] border border-amber-500/40 shadow-md shadow-emerald-950/20 overflow-hidden group-hover:scale-105 group-hover:border-amber-400 transition-all duration-300`}
    >
      {/* Delicate Inner Glow Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.18)_0%,transparent_70%)] pointer-events-none" />

      {/* Styled Acoustic Soundwave + Arch Vector */}
      <svg
        className="w-3/4 h-3/4 text-amber-400 transition-transform duration-300 group-hover:scale-110"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Arch outline */}
        <path
          d="M10 28V18C10 12.4772 14.4772 8 20 8C25.5228 8 30 12.4772 30 18V28"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="2 1.5"
          opacity="0.45"
        />
        {/* Audio Equalizer Vocal Waves */}
        <path d="M12 24V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M16 26V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M20 28V15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 26V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M28 24V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        {/* Base cradle */}
        <path d="M14 29C16 31 24 31 26 29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Golden Apex Star */}
        <circle cx="20" cy="6" r="1.5" fill="#fde68a" />
      </svg>
    </div>
  );

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 1. Dynamic Backend Logo if provided and valid */}
      {logoUrl && !imgError ? (
        <img
          src={logoUrl}
          alt={siteTitle}
          onError={() => setImgError(true)}
          className={`${sizeClasses.img} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
        />
      ) : (
        /* 2. Seamless Fallback Vector Emblem */
        renderFallbackIcon()
      )}

      {/* Brand Text (When showing default icon or explicitly requested) */}
      {(!logoUrl || imgError || showText) && (
        <div className="flex flex-col">
          <span
            className={`${sizeClasses.title} tracking-tight transition-colors ${
              variant === 'dark'
                ? 'bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-950 bg-clip-text text-transparent'
            }`}
          >
            {siteTitle}
          </span>
          {showSubtitle && (
            <span
              className={`${sizeClasses.subtitle} font-medium -mt-0.5 tracking-wide ${
                variant === 'dark' ? 'text-emerald-300/80' : 'text-stone-500'
              }`}
            >
              آکادمی تخصصی آموزش مداحی و صداسازی
            </span>
          )}
        </div>
      )}
    </div>
  );
};
