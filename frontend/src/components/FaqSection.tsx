import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { FAQ } from '../types';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { ChevronDown, HelpCircle, MessageCircleQuestion, Phone, Send } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { settings } = useSiteSettings();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIds, setOpenIds] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/core/faqs/');
        if (Array.isArray(res.data)) {
          setFaqs(res.data);
          if (res.data.length > 0) {
            setOpenIds({ [res.data[0].id]: true });
          }
        }
      } catch (err) {
        console.warn('Failed to load FAQs:', err);
      } finally {
        setLoading(false);
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

  if (!loading && faqs.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>پرسش‌های پرتکرار</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
          سوالات متداول هنرجویان
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
          پاسخ به سوالاتی که معمولاً علاقه‌مندان قبل از آغاز یادگیری در آواز آموز جویا می‌شوند
        </p>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="p-5 rounded-2xl bg-white border border-stone-100 animate-pulse space-y-3">
              <div className="h-5 bg-stone-200 rounded-md w-3/4" />
              <div className="h-3 bg-stone-200 rounded-md w-1/2" />
            </div>
          ))
        ) : (
          faqs.map((faq) => {
            const isOpen = Boolean(openIds[faq.id]);
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-emerald-300 shadow-md shadow-emerald-950/5'
                    : 'bg-white/90 border-stone-200/90 hover:border-emerald-200'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-right font-bold text-stone-800 text-sm sm:text-base cursor-pointer gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-emerald-800 text-amber-300' : 'bg-stone-100 text-stone-500'
                    }`}>
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
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                    <div className="pr-10">{faq.answer}</div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Help Banner at the bottom */}
      <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-50/60 via-stone-50 to-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
        <div>
          <h4 className="font-bold text-sm text-stone-900">سوال دیگری در ذهن دارید؟</h4>
          <p className="text-xs text-stone-500 mt-0.5">کارشناسان آموزشی آواز آموز آماده مشاوره و راهنمایی صوتی شما هستند.</p>
        </div>
        <div className="flex items-center gap-3">
          {settings?.contact_phone && (
            <a
              href={`tel:${settings.contact_phone.replace(/[^0-9]/g, '')}`}
              className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-emerald-800 hover:border-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>مشاوره تلفنی</span>
            </a>
          )}
          {settings?.telegram_url && (
            <a
              href={settings.telegram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors border border-emerald-700/60"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" />
              <span>پشتیبانی تلگرام</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
