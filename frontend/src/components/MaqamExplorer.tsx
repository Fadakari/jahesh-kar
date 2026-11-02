import React, { useState } from 'react';
import { Music, Sparkles, BookOpen, ChevronLeft, Mic2, Compass, Layers, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoldCorner, IslamicKetabeh, IslamicShamsah, IslamicDivider } from './IslamicElements';

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
  historicalRoots: string;
  recommendedPoetry: string;
}

const MAQAMAT: MaqamItem[] = [
  {
    id: 'shoor-dashti',
    name: 'دستگاه شور و آواز دشتی',
    category: 'ام‌المقامات و نغمه سوز آیینی',
    mood: 'حزن عمیق، سوز و گداز، تضرع، غربت و اشک روان',
    vocalRange: 'دانگ میانی متمایل به بم (C3 الی G4)',
    application: 'مناسب‌ترین لحن برای روضه‌خوانی، نوحه‌سرایی سنتی و نوای سوزناک شب‌های محرم',
    description: 'شور اصیل‌ترین و فراگیرترین دستگاه در موسیقی مذهبی ایران است. فواصل صوتی این مقام با فطرت حزن شریف انسان پیوند خورده و زمینه روحی مستمع را برای اشک، توسل و همدردی با مصائب اولیای الهی مهیا می‌سازد. گوشه «دشتی» در این دستگاه اوج سوزناکی و گداز مرثیه است.',
    keyPhrases: ['گوشه دشتستانی', 'اوج عشاق در شور', 'فرود غم‌انگیز شور', 'تحریرهای غلتان حنجره'],
    courseSlug: 'maqamat-radif-maddahi',
    historicalRoots: 'ریشه کهن در نوای کاروان‌های نینوا و تعزیه‌خوانی کهن طهران و اصفهان',
    recommendedPoetry: 'اشعار مراثی دوازده‌بند محتشم کاشانی و اشعار سوگ عصر صفوی و قاجار',
  },
  {
    id: 'esfahan',
    name: 'آواز بیات اصفهان',
    category: 'نغمه عاطفه و نجواهای مناجات',
    mood: 'مناجات عاشقانه، حزن لطیف، غربت، توبه و دلتنگی',
    vocalRange: 'گستره فراگیر و منعطف (D3 الی A4)',
    application: 'ایده‌آل برای مناجات‌خوانی سحرگاه، دعای ابوحمزه، زیارت عاشورا و مراثی جانسوز',
    description: 'بیات اصفهان به دلیل فواصل صوتی خاص و گوشه «بیات راجع»، حسی عرفانی و زلال خلق می‌کند. در این آواز، مرثیه با مناجات و نجوا با حضرت حق گره می‌خورد و دل‌زدگی دنیا را از روح مستمع می‌زداید.',
    keyPhrases: ['گوشه بیات راجع', 'سوز و گداز اصفهان', 'اوج سوزناک در عشاق', 'تحریر بلبلی نرم'],
    courseSlug: 'maqamat-radif-maddahi',
    historicalRoots: 'متعلق به دستگاه همایون با پیشینه درخشان در ادعیه‌خوانی شب‌های قدر و سحرهای ماه رمضان',
    recommendedPoetry: 'فرازهای ادعیه مأثوره، مسمط‌های مناجاتی و اشعار استغاثه به امام عصر (عج)',
  },
  {
    id: 'homayoun',
    name: 'دستگاه همایون و شوشتری',
    category: 'طنین حماسه، جلال و وقار خطبه',
    mood: 'ابهت، وقار، اندوه شاهانه، شهامت و حماسه دلاوران',
    vocalRange: 'دانگ بم پرطنین تا اوج‌های رسا (C3 الی F4)',
    application: 'خطبه‌خوانی، مقتل‌خوانی شهامت اصحاب، دم‌گیری و نوحه‌های باوقار زنجیرزنی',
    description: 'همایون دستگاهی بسیار پرصلابت و پرشکوه است. گوشه‌های «شوشتری» و «بیداد» در این دستگاه روح هر شنونده‌ای را تسخیر کرده و سوز همراه با حماسه و غیرت دینی را تداعی می‌کند. این مقام مناسب روایت دلاوری‌های اصحاب عاشوراست.',
    keyPhrases: ['گوشه بیداد', 'نغمه شوشتری', 'اوج بختیاری', 'تحریر چکشی حماسی'],
    courseSlug: 'mastering-maddahi-vocals',
    historicalRoots: 'پیشینه در مراثی حماسی، خطبه‌های امیرالمؤمنین و نواهای آئینی جنوب و لرستان',
    recommendedPoetry: 'رجزهای حماسی روز عاشورا، مدایح علوی و اشعار رشادت‌های قمر بنی‌هاشم (ع)',
  },
  {
    id: 'mahour',
    name: 'دستگاه ماهور و چهارگاه',
    category: 'نغمات سرور، بهجت و ولادت ولایی',
    mood: 'امید، بهجت و شادی مذهبی، افتخار، شکوه و پیروزی',
    vocalRange: 'پرده‌های روشن و اوج درخشان (E3 الی B4)',
    application: 'مولودی‌خوانی اعیاد شعبانیه و غدیر، سرودهای همخوانی، رجزخوانی و مدایح',
    description: 'دستگاه‌های ماهور و چهارگاه پایه و اساس سرودن اشعار ولادت و اعیاد آل‌الله هستند. پرده‌های روشن ماهور طنین امید و اقتدار را به همراه دارند و صدای ستایشگر را در فضای حسینیه درخشان، رسا و باشکوه نمایان می‌سازند.',
    keyPhrases: ['گوشه فیلی', 'دلکش در ماهور', 'شکسته ماهور', 'تحریرهای مقطع سرور'],
    courseSlug: 'mastering-maddahi-vocals',
    historicalRoots: 'ردیف اصیل نغمه‌های جشن ولایی و سرودهای مذهبی اعیاد اسلامی',
    recommendedPoetry: 'قصاید فخیم در مدح ائمه معصومین، سرودهای ولادت و اشعار غدیریه',
  },
];

export const MaqamExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(MAQAMAT[0].id);
  const activeMaqam = MAQAMAT.find((m) => m.id === activeTab) || MAQAMAT[0];

  return (
    <div className="relative rounded-3xl bg-[#041a14] border-2 border-amber-600/40 p-6 sm:p-11 text-white shadow-2xl overflow-hidden">
      {/* Corner filigrees */}
      <GoldCorner position="top-right" size={42} className="absolute top-2 right-2 z-10" />
      <GoldCorner position="top-left" size={42} className="absolute top-2 left-2 z-10" />
      <GoldCorner position="bottom-right" size={42} className="absolute bottom-2 right-2 z-10" />
      <GoldCorner position="bottom-left" size={42} className="absolute bottom-2 left-2 z-10" />

      {/* Header Ketabeh */}
      <div className="text-center relative z-10 mb-10">
        <IslamicKetabeh
          title="نغمات، گوشه‌ها و مقامات آوازی در ستایشگری اهل‌بیت"
          subtitle="ردیف‌شناسی کاربردی مداحی و مرثیه‌خوانی"
          variant="green"
        />
        <p className="text-stone-300 text-xs sm:text-sm mt-4 max-w-2xl mx-auto leading-relaxed">
          مداح صاحب‌سبک بر هفت دستگاه آوازی و حس‌وحال معنوی هر نغمه مسلط است. یک مقام را انتخاب فرمایید:
        </p>
      </div>

      {/* Maqam Tabs Ribbon with Ketabeh Styling */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {MAQAMAT.map((maqam) => {
          const isActive = maqam.id === activeTab;
          return (
            <button
              key={maqam.id}
              onClick={() => setActiveTab(maqam.id)}
              className={`p-4.5 rounded-2xl text-right transition-all duration-300 cursor-pointer border relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-br from-amber-600/30 to-emerald-900/90 border-amber-400 shadow-xl text-white'
                  : 'bg-emerald-950/40 hover:bg-emerald-900/40 border-amber-600/20 text-emerald-200/70 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-amber-400/90 truncate">
                  {maqam.category}
                </span>
                <IslamicShamsah size={18} />
              </div>
              <h4 className="font-black text-sm sm:text-base leading-snug">
                {maqam.name}
              </h4>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Detailed Content in Traditional Arch Frame */}
      <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-black/40 rounded-3xl p-6 sm:p-9 border border-amber-600/30">
        
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40">
              {activeMaqam.name}
            </span>
            <span className="text-xs text-emerald-300/90 flex items-center gap-1.5 bg-black/60 px-3.5 py-1.5 rounded-xl border border-emerald-900/60">
              <Mic2 className="w-3.5 h-3.5 text-amber-400" />
              {activeMaqam.vocalRange}
            </span>
          </div>

          <p className="text-stone-200 text-sm sm:text-base leading-relaxed font-normal">
            {activeMaqam.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#051c15] p-4.5 rounded-2xl border border-amber-500/25">
              <span className="text-xs text-amber-400 font-bold block mb-1.5">
                حس و حال عاطفی در مجلس:
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {activeMaqam.mood}
              </p>
            </div>

            <div className="bg-[#051c15] p-4.5 rounded-2xl border border-amber-500/25">
              <span className="text-xs text-emerald-400 font-bold block mb-1.5">
                کاربرد در هیئت و منبر:
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {activeMaqam.application}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#041610] border border-amber-500/20 space-y-2 text-xs text-stone-300">
            <div>
              <strong className="text-amber-400 ml-1">پیشینه تاریخی در مجالس کهن:</strong>
              {activeMaqam.historicalRoots}
            </div>
            <div>
              <strong className="text-emerald-400 ml-1">اشعار منطبق بر این مقام:</strong>
              {activeMaqam.recommendedPoetry}
            </div>
          </div>

          <div className="pt-1">
            <span className="text-xs text-amber-300 font-bold block mb-2.5">
              گوشه‌ها و الحان تدریس‌شده در این مقام:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeMaqam.keyPhrases.map((phrase, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-950 text-amber-200 text-xs border border-amber-500/30 shadow-xs"
                >
                  ✓ {phrase}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between p-7 bg-gradient-to-b from-[#062119] to-[#03130e] rounded-3xl border border-amber-500/35 text-center shadow-xl">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/40 shadow-xs">
              <IslamicShamsah size={32} />
            </div>

            <div>
              <span className="text-xs text-emerald-300 font-medium block">
                دوره آموزشی مرتبط در آواز آموز
              </span>
              <h4 className="text-base font-black text-amber-300 mt-1.5 leading-snug">
                آموزش جامع ردیف‌های مداحی
              </h4>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              آموزش تصویری سرفصل‌های این دستگاه همراه با تمرین عملی صوت و الگوهای اجرایی در مجالس.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-emerald-900/60">
            <Link
              to="/courses"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 text-stone-950" />
              <span>مشاهده جلسات آموزشی</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
