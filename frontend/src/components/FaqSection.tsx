import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { FAQ } from '../types';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { ChevronDown, HelpCircle, MessageCircleQuestion, Phone, Send, Sparkles } from 'lucide-react';

const FALLBACK_FAQS: FAQ[] = [
  {
    id: 1,
    question: 'آیا برای شرکت در دوره‌ها نیاز به صدای خاص یا زمینه قبلی دارم؟',
    answer: 'خیر، دوره‌ها به ویژه دوره «صداسازی جامع و پرورش حنجره» از پایه و صفر مطلق، با آموزش صحیح تنفس دیافراگمی، تلفظ حروف و باز کردن حجم صدا آغاز می‌شود. هر فرد با تمرین مستمر می‌تواند صدای خود را به زیبایی پرورش دهد.',
    order: 1,
    is_active: true,
  },
  {
    id: 2,
    question: 'آیا آموزش دستگاه‌های آوازی منطبق با سبک‌های مداحی است؟',
    answer: 'بله، در آواز آموز برخلاف کلاس‌های سنتی آواز که تئوریک هستند، تمامی گوشه‌ها و مقامات (شور، دشتی، همایون، چهارگاه و...) مستقیماً روی اشعار مرثیه، نوحه و مولودی شبیه‌سازی و اجرا می‌شوند.',
    order: 2,
    is_active: true,
  },
  {
    id: 3,
    question: 'آیا امکان مشاهده نمونه جلسات قبل از خرید دوره وجود دارد؟',
    answer: 'بله، در تمامی دوره‌ها جلسات با نشان «پیش‌نمایش رایگان» مشخص شده‌اند که هر علاقه‌مندی بدون پرداخت هزینه می‌تواند آن‌ها را تماشا کرده و با کیفیت تدریس اساتید آشنا شود.',
    order: 3,
    is_active: true,
  },
  {
    id: 4,
    question: 'آیا دوره‌ها دارای تمرین‌های عملی و صوتی هستند؟',
    answer: 'بله، در هر جلسه الگوهای صوتی و تمرینات حنجره به همراه فایل‌های صوتی ضمیمه قرار دارند که به صورت روزانه می‌توانید همراه با استاد تمرین کنید.',
    order: 4,
    is_active: true,
  },
  {
    id: 5,
    question: 'پس از ثبت‌نام، دسترسی به ویدیوها تا چه زمانی برقرار است؟',
    answer: 'دسترسی شما به دوره‌های ثبت‌نام شده همیشگی و نامحدود است و در تمام ۲۴ ساعت شبانه‌روز از طریق گوشی یا کامپیوتر می‌توانید ویدیوها را تماشا فرمایید.',
    order: 5,
    is_active: true,
  },
];

export const FaqSection: React.FC = () => {
  const { settings } = useSiteSettings();
  const [faqs, setFaqs] = useState<FAQ[]>(FALLBACK_FAQS);
  const [openIds, setOpenIds] = useState<Record<number, boolean>>({ 1: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/core/faqs/');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setFaqs(res.data);
          setOpenIds({ [res.data[0].id]: true });
        }
      } catch (err) {
        // Fallback to initial local FAQs
      }
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (id: number) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>پرسش‌های پرتکرار</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
          سوالات متداول هنرجویان و ذاکران
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
          پاسخ به متداول‌ترین سوالاتی که علاقه‌مندان قبل از آغاز یادگیری در آواز آموز جویا می‌شوند
        </p>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = Boolean(openIds[faq.id]);
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-emerald-400 shadow-md shadow-emerald-950/5'
                  : 'bg-white/90 border-stone-200/90 hover:border-emerald-200'
              }`}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between p-5 text-right font-bold text-stone-800 text-sm sm:text-base cursor-pointer gap-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-emerald-800 text-amber-300' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    <MessageCircleQuestion className="w-4 h-4" />
                  </span>
                  <span>{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-emerald-700' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact box */}
      <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-[#faf8f5] to-amber-50/50 border border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
        <div>
          <h4 className="text-sm font-bold text-stone-900">
            سوال دیگری درباره دوره‌ها یا حنجره خود دارید؟
          </h4>
          <p className="text-xs text-stone-500 mt-0.5">
            کارشناسان و اساتید آکادمی آماده راهنمایی و تعیین سطح شما هستند.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {settings?.telegram_url && (
            <a
              href={settings.telegram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>پشتیبانی تلگرام</span>
            </a>
          )}
          {settings?.contact_phone && (
            <a
              href={`tel:${settings.contact_phone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-bold text-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>{settings.contact_phone}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
