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
  academy_scope: string;
  logo_url: string | null;
  announcement_active: boolean;
  announcement_badge: string;
  announcement_text: string;
  announcement_link: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_primary_text: string;
  hero_cta_primary_link: string;
  hero_cta_secondary_text: string;
  hero_cta_secondary_link: string;
  hero_image_url: string | null;
  hero_preview_badge: string;
  hero_preview_title: string;
  hero_preview_subtitle: string;
  hero_tagline_1: string;
  hero_tagline_2: string;
  hero_tagline_3: string;
  stat_1_number: string;
  stat_1_label: string;
  stat_2_number: string;
  stat_2_label: string;
  stat_3_number: string;
  stat_3_label: string;
  stat_4_number: string;
  stat_4_label: string;
  features_badge: string;
  features_title: string;
  features_subtitle: string;
  steps_active: boolean;
  steps_badge: string;
  steps_title: string;
  steps_subtitle: string;
  contact_phone: string;
  contact_email: string;
  telegram_url: string;
  instagram_url: string;
  footer_about: string;
}

export interface SiteFeature {
  id: number;
  title: string;
  description: string;
  badge: string;
  tag: string;
  icon_type: string;
  order: number;
}

export interface LearningStep {
  id: number;
  step_number: string;
  title: string;
  description: string;
  badge: string;
  order: number;
}

export interface Testimonial {
  id: number;
  student_name: string;
  student_role: string;
  avatar_initials: string;
  comment: string;
  rating: number;
  order: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}
