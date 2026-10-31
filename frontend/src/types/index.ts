export interface User {
  id: number;
  username: string;
  phone_number?: string;
  full_name?: string;
  email?: string;
  is_staff: boolean;
  date_joined?: string;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  icon: string;
  description: string;
  courses_count: number;
}

export interface SimpleLesson {
  id: number;
  title: string;
  order: number;
  duration: string;
  is_free_preview: boolean;
  has_access: boolean;
  video_url: string;
  attachment_url: string;
  description: string;
}

export interface Section {
  id: number;
  title: string;
  order: number;
  lessons: SimpleLesson[];
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  category?: Category;
  short_description: string;
  description?: string;
  instructor_name: string;
  instructor_title: string;
  instructor_bio?: string;
  price: number;
  discount_price?: number;
  final_price: number;
  is_free: boolean;
  level: 'all' | 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  students_count: number;
  rating: number;
  cover_image_url: string;
  intro_video_url?: string;
  what_you_will_learn?: string;
  prerequisites?: string;
  sections?: Section[];
  direct_lessons?: SimpleLesson[];
  lessons_count: number;
  is_enrolled: boolean;
  is_sales_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WatchLessonData {
  id: number;
  title: string;
  order: number;
  duration: string;
  description: string;
  video_url: string;
  attachment_url: string;
  is_free_preview: boolean;
  prev_lesson_id: number | null;
  next_lesson_id: number | null;
  course_title: string;
  course_slug: string;
}

export interface Enrollment {
  id: number;
  course: Course;
  enrolled_at: string;
}

export interface Order {
  id: number;
  tracking_code: string;
  course_title: string;
  course_slug: string;
  amount: number;
  status: 'pending' | 'completed' | 'canceled';
  created_at: string;
}

export interface SiteSetting {
  site_title: string;
  logo_url: string | null;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  features_badge: string;
  features_title: string;
  features_subtitle: string;
  contact_phone: string;
  contact_email: string;
  telegram_url: string;
  instagram_url: string;
  footer_about: string;
  enamad_html?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}
