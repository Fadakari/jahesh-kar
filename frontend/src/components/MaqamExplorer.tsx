import React, { useState } from 'react';
import { Volume2, Music, Sparkles, BookOpen, ChevronLeft, Mic2, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MaqamItem {
  id: string;
  name: string;
  category: string;
  mood: string;
  vocalRange: string;
  application: string;
  description: string;
  keyPhrases: string[];
  courseSlug: string;
  accentColor: string;
}

const MAQAMAT: MaqamItem[] = [
  {
    id: 'shoor-dashti',
    name: 'دستگاه شور و آواز دشتی',
    category: 'ام‌المقامات و نغمه سوز',
    mood: 'حزن عمیق، سوز و گداز، تضرع و خشوع',
    vocalRange: 'دانگ میانی متمایل به بم (C3 تا G4)',
    application: 'مناسب‌ترین لحن برای روضه‌خوانی، نوحه‌سرایی سنتی و نوای سوزناک شب‌های محرم',
    description: 'شور اصیل‌ترین دستگاه در موسیقی آیینی است که با غم شریف و دلنشین خود، قلب مستمع را برای گریه و توسل آماده می‌سازد. گوشه «دشتی» اوج سوز این دستگاه است.',
    keyPhrases: ['گوشه دشتستانی', 'اوج عشاق', 'فرود غم‌انگیز شور', 'تحریرهای غلتان'],
    courseSlug: 'maqamat-radif-maddahi',
    accentColor: 'from-amber-600 to-amber-700',
  },
  {
    id: 'esfahan',
    name: 'آواز بیات اصفهان',
    category: 'نغمه عاطفه و مناجات',
    mood: 'مناجات عاشقانه، غربت، اندوه لطیف و دلتنگی',
    vocalRange: 'گستره فراگیر و منعطف (D3 تا A4)',
    application: 'ایده‌آل برای مناجات‌خوانی سحرگاه، دعای ابوحمزه، زیارت عاشورا و مراثی جانسوز',
    description: 'بیات اصفهان به دلیل فواصل صوتی خاص، حسی عرفانی و عمیق خلق می‌کند و برای انتقال لطیف‌ترین مضامین مناجات با خدا و اهل‌بیت (ع) به کار می‌رود.',
    keyPhrases: ['گوشه بیات راجع', 'سوزگداز اصفهان', 'اوج سوزناک در عشاق', 'تحریر بلبلی'],
    courseSlug: 'maqamat-radif-maddahi',
    accentColor: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'homayoun',
    name: 'دستگاه همایون و شوشتری',
    category: 'طنین حماسه و جلال',
    mood: 'ابهت، وقار، اندوه شاهانه، غربت و حماسه',
    vocalRange: 'دانگ بم پرطنین تا اوج‌های رسا (C3 تا F4)',
    application: 'خطبه‌خوانی، مقتل‌خوانی شهامت اصحاب، دم‌گیری و نوحه‌های باوقار زنجیرزنی',
    description: 'همایون دستگاهی بسیار پرصلابت است. گوشه‌های «شوشتری» و «بیداد» در این دستگاه روح هر شنونده‌ای را تسخیر کرده و سوز همراه با حماسه را تداعی می‌کند.',
    keyPhrases: ['گوشه بیداد', 'نغمه شوشتری', 'اوج بختیاری', 'تحریر چکشی'],
    courseSlug: 'mastering-maddahi-vocals',
    accentColor: 'from-amber-700 to-emerald-900',
  },
  {
    id: 'mahour',
    name: 'دستگاه ماهور و چهارگاه',
    category: 'نغمات سرور و حماسه آیینی',
    mood: 'امید، بهجت و شادی مذهبی، افتخار و دلاوری',
    vocalRange: 'پرده‌های روشن و اوج درخشان (E3 تا B4)',
    application: 'مولودی‌خوانی اعیاد شعبانیه و غدیر، سرودهای همخوانی، رجزخوانی و مدایح',
    description: 'دستگاه‌های ماهور و چهارگاه پایه و اساس سرودن اشعار شادی اهل‌بیت و رجزهای حماسی روز عاشورا هستند و صدای مداح را پرتوان و رسا جلوه می‌دهند.',
    keyPhrases: ['گوشه فیلی', 'دلکش', 'شکسته ماهور', 'تحریرهای مقطع حماسی'],
    courseSlug: 'mastering-maddahi-vocals',
    accentColor: 'from-teal-600 to-emerald-800',
  },
];

export const MaqamExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(MAQAMAT[0].id);
  const activeMaqam = MAQAMAT.find((m) => m.id === activeTab) || MAQAMAT[0];

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-[#061e18] via-[#09261f] to-[#041410] border border-amber-500/30 p-6 sm:p-10 text-white shadow-2xl shadow-emerald-950/40 overflow-hidden">
      {/* Decorative Persian Girih Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(245,158,11,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-emerald-900/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>آزمایشگاه نغمه‌شناسی و دستگاه‌های آوازی</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            نغمات و پرده‌های آوازی در ستایشگری اهل‌بیت (ع)
          </h3>
          <p className="text-emerald-200/80 text-sm mt-2 max-w-2xl leading-relaxed">
            مداح تراز اول بر دستگاه‌های ردیف آوازی و حس‌وحال معنوی هر نغمه مسلط است. یک نغمه را انتخاب کنید تا ساختار و کاربرد آن را مرور نمایید:
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400/90 bg-emerald-950/60 px-4 py-2 rounded-xl border border-amber-500/20 self-start md:self-auto">
          <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>تحلیل تخصصی ردیف آوازی</span>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
        {MAQAMAT.map((maqam) => {
          const isActive = maqam.id === activeTab;
          return (
            <button
              key={maqam.id}
              onClick={() => setActiveTab(maqam.id)}
              className={`p-4 rounded-2xl text-right transition-all duration-300 cursor-pointer border ${
                isActive
                  ? 'bg-gradient-to-br from-amber-500/25 to-emerald-900/50 border-amber-400/80 shadow-lg shadow-amber-950/30 text-white'
                  : 'bg-emerald-950/40 hover:bg-emerald-900/30 border-emerald-800/40 text-emerald-200/70 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-amber-400/90 truncate">
                  {maqam.category}
                </span>
                <Music className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-500/60'}`} />
              </div>
              <h4 className="font-black text-sm sm:text-base leading-snug">
                {maqam.name}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Content Display for Active Maqam */}
      <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-emerald-950/60 rounded-3xl p-6 sm:p-8 border border-emerald-800/50 backdrop-blur-xs">
        
        {/* Left/Middle Details */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
              {activeMaqam.name}
            </span>
            <span className="text-xs text-emerald-300/80 flex items-center gap-1.5">
              <Mic2 className="w-3.5 h-3.5 text-amber-400" />
              {activeMaqam.vocalRange}
            </span>
          </div>

          <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
            {activeMaqam.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-black/30 p-3.5 rounded-2xl border border-emerald-900/60">
              <span className="text-xs text-amber-400 font-bold block mb-1">
                حال و هوای عاطفی در مجلس:
              </span>
              <p className="text-xs text-stone-300 leading-normal">
                {activeMaqam.mood}
              </p>
            </div>

            <div className="bg-black/30 p-3.5 rounded-2xl border border-emerald-900/60">
              <span className="text-xs text-emerald-400 font-bold block mb-1">
                کاربرد در هیئت و منبر:
              </span>
              <p className="text-xs text-stone-300 leading-normal">
                {activeMaqam.application}
              </p>
            </div>
          </div>

          {/* Key Techniques / Ornaments */}
          <div className="pt-2">
            <span className="text-xs text-emerald-300 font-bold block mb-2">
              گوشه‌ها و مهارت‌های تدریس‌شده در این مقام:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeMaqam.keyPhrases.map((phrase, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-emerald-900/50 text-emerald-200 text-xs border border-emerald-700/40"
                >
                  ✓ {phrase}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action & Animated Equalizer Widget */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#061a14] to-[#04120e] rounded-2xl border border-amber-500/25 text-center">
          {/* Animated Vocal Bars Visualizer */}
          <div className="flex items-end justify-center gap-1.5 h-16 w-full max-w-[200px] mb-4 px-4 bg-emerald-950/40 rounded-xl py-2 border border-emerald-800/40">
            <span className="w-2.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-vocal-1" style={{ height: '35%' }} />
            <span className="w-2.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-vocal-2" style={{ height: '70%' }} />
            <span className="w-2.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-vocal-3" style={{ height: '95%' }} />
            <span className="w-2.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-vocal-4" style={{ height: '60%' }} />
            <span className="w-2.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-vocal-5" style={{ height: '40%' }} />
            <span className="w-2.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-vocal-2" style={{ height: '80%' }} />
            <span className="w-2.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-vocal-4" style={{ height: '50%' }} />
          </div>

          <span className="text-xs font-bold text-amber-300 mb-1">
            دوره آموزشی مرتبط در آواز آموز
          </span>
          <p className="text-[11px] text-stone-400 mb-4">
            آموزش تخصصی سرفصل‌های این دستگاه همراه با تمرین عملی صوت
          </p>

          <Link
            to={`/courses`}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-lg shadow-amber-950/40 transition-all duration-200"
          >
            <BookOpen className="w-4 h-4 text-stone-950" />
            <span>مشاهده جلسات آموزشی</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
};
