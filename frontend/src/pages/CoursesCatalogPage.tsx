import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { Course, Category } from '../types';
import { CourseCard } from '../components/CourseCard';
import { Search, BookOpen, RotateCcw } from 'lucide-react';

export const CoursesCatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const selectedLevel = searchParams.get('level') || 'all';
  const selectedPrice = searchParams.get('price') || '';
  const searchQuery = searchParams.get('q') || '';

  const [inputSearch, setInputSearch] = useState(searchQuery);

  useEffect(() => {
    setInputSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/courses/categories/');
        setCategories(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCategory) params.category = selectedCategory;
        if (selectedLevel && selectedLevel !== 'all') params.level = selectedLevel;
        if (selectedPrice) params.price = selectedPrice;
        if (searchQuery) params.q = searchQuery;

        const res = await api.get('/courses/', { params });
        setCourses(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [selectedCategory, selectedLevel, selectedPrice, searchQuery]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('q', inputSearch.trim());
  };

  const clearFilters = () => {
    setInputSearch('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-stone-900">بانک دوره‌های تخصصی مداحی</h1>
        <p className="text-sm text-stone-500">
          مجموعه کامل آموزش‌های عملی صداسازی، ردیف‌های آوازی، مقتل‌شناسی و فن بیان در ستایشگری
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
        
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="جستجوی نام دوره، دستگاه آوازی یا استاد..."
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              className="w-full pr-12 pl-4 py-3 text-sm bg-stone-50 rounded-2xl border border-stone-200 focus:bg-white focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-none transition-all placeholder:text-stone-400"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-sm transition-colors cursor-pointer border border-emerald-700/60 shadow-xs"
          >
            اعمال جستجو
          </button>
        </form>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <span className="text-xs font-bold text-stone-400 ml-2">دسته‌بندی:</span>
          
          <button
            onClick={() => updateParam('category', '')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              !selectedCategory
                ? 'bg-emerald-800 text-amber-300 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            همه موارد
          </button>

          {Array.isArray(categories) && categories.map((c) => (
            <button
              key={c.id}
              onClick={() => updateParam('category', c.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === c.slug
                  ? 'bg-emerald-800 text-amber-300 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Secondary filters: Level & Price */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Level */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-500">سطح آموزشی:</span>
              <select
                value={selectedLevel}
                onChange={(e) => updateParam('level', e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-700 font-medium outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="all">همه سطوح</option>
                <option value="beginner">مقدماتی و پایه</option>
                <option value="intermediate">متوسط و تکمیلی</option>
                <option value="advanced">پیشرفته و تخصصی</option>
              </select>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-500">نوع دوره:</span>
              <select
                value={selectedPrice}
                onChange={(e) => updateParam('price', e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-700 font-medium outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="">همه دوره‌ها</option>
                <option value="free">فقط آموزش‌های رایگان</option>
                <option value="paid">دوره‌های جامع تخصصی</option>
              </select>
            </div>

          </div>

          {(selectedCategory || selectedPrice || (selectedLevel && selectedLevel !== 'all') || searchQuery) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-rose-600 font-bold hover:text-rose-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              حذف همه فیلترها
            </button>
          )}
        </div>

      </div>

      {/* Courses List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-4 border border-stone-100 animate-pulse space-y-4">
              <div className="aspect-video bg-stone-200 rounded-2xl" />
              <div className="h-4 bg-stone-200 rounded-md w-3/4" />
              <div className="h-3 bg-stone-200 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/90 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-100">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">هیچ دوره‌ای با این مشخصات یافت نشد</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            می‌توانید کلمات جستجو یا فیلترهای اعمال شده را تغییر دهید تا به دوره‌های دلخواه برسید.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs transition-colors cursor-pointer border border-emerald-700/60"
          >
            مشاهده تمام دوره‌ها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(courses) && courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

    </div>
  );
};
