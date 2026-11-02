import React from 'react';

// Persian Islamic Corner Filigree (لچکی اسلیمی زرین)
export const GoldCorner: React.FC<{
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
  size?: number;
}> = ({ position = 'top-right', className = '', size = 36 }) => {
  const getTransforms = () => {
    switch (position) {
      case 'top-right':
        return '';
      case 'top-left':
        return 'scale-x-[-1]';
      case 'bottom-right':
        return 'scale-y-[-1]';
      case 'bottom-left':
        return 'scale-[-1]';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={`pointer-events-none text-amber-500/80 ${getTransforms()} ${className}`}
    >
      <path
        d="M2 2H24C34 2 44 8 46 20V46C46 32 38 24 24 24H2V2Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M2 2H30C40 2 46 8 46 22V46"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 6H24C34 6 42 12 42 22V42"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.6"
        strokeDasharray="2 2"
      />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <circle cx="2" cy="2" r="2" fill="currentColor" />
    </svg>
  );
};

// Persian Mehrab Arch Top Vector (طاق محرابی پنج و هفت مسجد)
export const MehrabArchTop: React.FC<{
  className?: string;
  fillColor?: string;
  strokeColor?: string;
}> = ({ className = '', fillColor = '#07241c', strokeColor = '#f59e0b' }) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        className="w-full h-16 sm:h-24 block"
      >
        {/* Outer Mehrab Arch Line */}
        <path
          d="M0,160 L0,80 Q300,80 500,40 Q570,22 600,0 Q630,22 700,40 Q900,80 1200,80 L1200,160 Z"
          fill={fillColor}
        />
        {/* Golden Ridge Trim */}
        <path
          d="M0,80 Q300,80 500,40 Q570,22 600,0 Q630,22 700,40 Q900,80 1200,80"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeOpacity="0.8"
        />
        {/* Inner Delicate Line */}
        <path
          d="M20,90 Q310,90 505,50 Q575,32 600,10 Q625,32 695,50 Q890,90 1180,90"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeOpacity="0.4"
          strokeDasharray="4 3"
        />
        {/* Apex Shamsah Finial */}
        <circle cx="600" cy="8" r="5" fill={strokeColor} />
      </svg>
    </div>
  );
};

// Traditional Mosque Ketabeh Calligraphic Ribbon (کتیبه سنتی کاشی‌کاری)
export const IslamicKetabeh: React.FC<{
  title: string;
  subtitle?: string;
  variant?: 'green' | 'blue' | 'black';
  className?: string;
}> = ({ title, subtitle, variant = 'green', className = '' }) => {
  const getTheme = () => {
    switch (variant) {
      case 'green':
        return 'bg-gradient-to-r from-[#05291e] via-[#094131] to-[#05291e] border-amber-400 text-amber-200';
      case 'blue':
        return 'bg-gradient-to-r from-[#0a1936] via-[#102a5c] to-[#0a1936] border-amber-400 text-amber-200';
      case 'black':
        return 'bg-gradient-to-r from-[#0a0a0c] via-[#1a1a20] to-[#0a0a0c] border-amber-500 text-amber-300';
    }
  };

  return (
    <div className={`relative inline-block text-center px-8 sm:px-14 py-3 sm:py-4 rounded-xl border-2 shadow-2xl shadow-stone-950/40 ${getTheme()} ${className}`}>
      {/* Golden Corner Diamonds */}
      <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rotate-45 bg-amber-400 border border-stone-900" />
      <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rotate-45 bg-amber-400 border border-stone-900" />
      <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rotate-45 bg-amber-400 border border-stone-900" />
      <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rotate-45 bg-amber-400 border border-stone-900" />

      {/* Subtle Inner Double Border */}
      <div className="absolute inset-1 border border-amber-400/40 rounded-lg pointer-events-none" />

      {subtitle && (
        <span className="text-[11px] sm:text-xs font-bold tracking-widest text-amber-400/90 block mb-1 uppercase">
          {subtitle}
        </span>
      )}
      <h3 className="text-lg sm:text-2xl font-black text-amber-300 tracking-tight leading-snug drop-shadow-md">
        {title}
      </h3>
    </div>
  );
};

// Persian 8-Pointed Star Shamsah (شمسه سنتی هشت‌پر تذهیب)
export const IslamicShamsah: React.FC<{
  size?: number;
  className?: string;
  color?: string;
}> = ({ size = 40, className = '', color = '#f59e0b' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`inline-block ${className}`}
    >
      {/* Outer 8-point star (2 overlapping squares at 45 deg) */}
      <rect
        x="12"
        y="12"
        width="40"
        height="40"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect
        x="12"
        y="12"
        width="40"
        height="40"
        transform="rotate(45 32 32)"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Inner Central Flower */}
      <circle cx="32" cy="32" r="10" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.2" />
      <circle cx="32" cy="32" r="4" fill={color} />
    </svg>
  );
};

// Traditional Mosque Tile Border Divider (حاشیه کاشی‌کاری محراب)
export const IslamicDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-3 my-8 ${className}`}>
      <div className="h-[2px] w-24 sm:w-48 bg-gradient-to-l from-amber-500 to-transparent" />
      <IslamicShamsah size={24} />
      <div className="h-[2px] w-24 sm:w-48 bg-gradient-to-r from-amber-500 to-transparent" />
    </div>
  );
};
