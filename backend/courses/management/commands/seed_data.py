import sys
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Category, Course, Section, Lesson
from orders.models import Order, Enrollment

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds database with realistic Persian sample data for JaheshKar"

    def handle(self, *args, **options):
        # Ensure utf-8 output on Windows consoles
        if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
            try:
                sys.stdout.reconfigure(encoding='utf-8')
            except Exception:
                pass

        try:
            self.stdout.write("Creating initial JaheshKar data...")
        except Exception:
            pass

        # 1. Superuser
        admin_user, created = User.objects.get_or_create(
            username="admin",
            defaults={
                "full_name": "مدیریت جهش کار",
                "phone_number": "09120000000",
                "email": "admin@jaheshkar.ir",
                "is_staff": True,
                "is_superuser": True,
                "is_verified": True,
            }
        )
        if created:
            admin_user.set_password("admin123456")
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Admin user created: admin / admin123456"))
        else:
            admin_user.set_password("admin123456")
            admin_user.save()

        # 2. Student user
        student_user, s_created = User.objects.get_or_create(
            username="student",
            defaults={
                "full_name": "علی رضایی",
                "phone_number": "09351234567",
                "email": "student@jaheshkar.ir",
                "is_verified": True,
            }
        )
        if s_created:
            student_user.set_password("user123456")
            student_user.save()
            self.stdout.write(self.style.SUCCESS("Test student user created: student / user123456"))

        # 3. Categories
        cat_web, _ = Category.objects.get_or_create(
            slug="web-dev",
            defaults={"title": "برنامه‌نویسی و وب", "icon": "Code2", "description": "توسعه وب، فرانت‌اند و بک‌اند مدرن"}
        )
        cat_ai, _ = Category.objects.get_or_create(
            slug="ai-data",
            defaults={"title": "هوش مصنوعی و پایتون", "icon": "Cpu", "description": "یادگیری ماشین، هوش مصنوعی مولد و تحلیل داده"}
        )
        cat_design, _ = Category.objects.get_or_create(
            slug="ui-ux",
            defaults={"title": "طراحی رابط کاربری UI/UX", "icon": "Palette", "description": "طراحی محصول، فیگما و تجربه کاربری"}
        )
        cat_career, _ = Category.objects.get_or_create(
            slug="career",
            defaults={"title": "ورود به بازار کار و فریلنسری", "icon": "Briefcase", "description": "رزومه‌نویسی، مصاحبه فنی و درآمد دلاری"}
        )

        # Reliable sample video URLs (using fast CDN test mp4 videos)
        sample_intro = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        sample_vid1 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        sample_vid2 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        sample_vid3 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"

        # 4. Courses
        # Course 1: Full-stack Python & React
        c1, _ = Course.objects.get_or_create(
            slug="fullstack-python-react",
            defaults={
                "title": "دوره جامع فول‌استک پایتون (جنگو) و ری‌اکت برای بازار کار",
                "category": cat_web,
                "short_description": "آموزش گام‌به‌گام و پروژه محور از صفر تا ساخت و استقرار سامانه‌های واقعی وب",
                "description": """در این دوره جامع شما از پایه‌ای‌ترین مفاهیم تا عمیق‌ترین تکنیک‌های روز معماری نرم‌افزار را فرا خواهید گرفت.
هدف این دوره تنها آموزش کدنویسی نیست، بلکه تربیت یک مهندس نرم‌افزار آماده استخدام در شرکت‌های معتبر و کسب درآمد بالا است.
در طول دوره ۳ پروژه بزرگ تجاری به همراه سیستم پرداخت آنلاین، داکرایز کردن و دیپلوی روی هاست و سرور را پیاده‌سازی خواهیم کرد.""",
                "instructor_name": "مهندس سامان کریمی",
                "instructor_title": "توسعه‌دهنده ارشد نرم‌افزار و مشاور فنی استارتاپ‌ها",
                "instructor_bio": "بیش از ۸ سال سابقه برنامه‌نویسی تجاری در ایران و پروژه‌های بین‌المللی",
                "price": 890000,
                "discount_price": 590000,
                "level": "all",
                "duration": "۲۴ ساعت",
                "students_count": 342,
                "rating": 4.9,
                "cover_image_url": "/media/courses/covers/course-1-fullstack.jpg",
                "intro_video_url": sample_intro,
                "what_you_will_learn": "تسلط کامل به پایتون مدرن و فریم‌ورک جنگو\nطراحی API‌های استاندارد REST با DRF\nساخت فرانت‌اند مدرن، سریع و واکنش‌گرا با React و Tailwind\nاحراز هویت پیامکی و امن با توکن\nاتصال به درگاه پرداخت شتابی و مدیریت سفارشات\nدیپلوی روی هاست اشتراکی و سرور لینوکس",
                "prerequisites": "علاقه‌مندی به یادگیری؛ آشنایی ابتدایی با مبانی کامپیوتر کافی است.",
                "is_published": True,
            }
        )

        # Sections & Lessons for Course 1
        sec1, _ = Section.objects.get_or_create(course=c1, title="فصل اول: مقدمه، نقشه راه و آمادگی محیط توسعه", defaults={"order": 1})
        Lesson.objects.get_or_create(
            course=c1,
            section=sec1,
            order=1,
            defaults={
                "title": "معرفی دوره و نقشه راه درآمدزایی از فول‌استک",
                "duration": "08:45",
                "is_free_preview": True,
                "video_url": sample_intro,
                "description": "در این جلسه با کل ساختار دوره، تکنولوژی‌ها و نیازمندی‌های بازار کار آشنا می‌شوید."
            }
        )
        Lesson.objects.get_or_create(
            course=c1,
            section=sec1,
            order=2,
            defaults={
                "title": "نصب پایتون، VS Code و راه‌اندازی Virtual Environment",
                "duration": "14:20",
                "is_free_preview": True,
                "video_url": sample_vid1,
                "description": "آماده‌سازی یک محیط توسعه حرفه‌ای، تمیز و بدون دردسر برای کار تیمی."
            }
        )

        sec2, _ = Section.objects.get_or_create(course=c1, title="فصل دوم: معماری بک‌اند با Django و DRF", defaults={"order": 2})
        Lesson.objects.get_or_create(
            course=c1,
            section=sec2,
            order=3,
            defaults={
                "title": "طراحی دیتابیس، مدل‌ها و ارتباطات یکپارچه",
                "duration": "22:15",
                "is_free_preview": False,
                "video_url": sample_vid2,
                "description": "تعریف مدل‌ها، ارتباطات یک‌به‌چند، ایندکس‌گذاری و مهاجرت‌ها در دیتابیس."
            }
        )
        Lesson.objects.get_or_create(
            course=c1,
            section=sec2,
            order=4,
            defaults={
                "title": "پیاده‌سازی ورود با پیامک (OTP) و احراز هویت با نام‌کاربری",
                "duration": "18:40",
                "is_free_preview": False,
                "video_url": sample_vid3,
                "description": "طراحی اندپوینت‌های امن احراز هویت، انقضای توکن و ثبت نام خودکار کاربر."
            }
        )

        # Course 2: AI & Python
        c2, _ = Course.objects.get_or_create(
            slug="ai-practical-prompt-engineering",
            defaults={
                "title": "مسترکلاس هوش مصنوعی کاربردی و اتوماسیون با پایتون",
                "category": cat_ai,
                "short_description": "چگونه با هوش مصنوعی و اسکریپت‌های پایتون، وظایف روزمره را در ۵ ثانیه انجام دهیم؟",
                "description": """این دوره برای تمام افرادی که می‌خواهند از هوش مصنوعی برای چندبرابر کردن سرعت کار و درآمدزایی استفاده کنند طراحی شده است.
یاد می‌گیرید چطور مدل‌های زبانی را به کدهای پایتون متصل کنید و بات‌های هوشمند خلق نمایید.""",
                "instructor_name": "دکتر نیما شمس",
                "instructor_title": "پژوهشگر هوش مصنوعی و داده‌کاو",
                "instructor_bio": "فعال در حوزه هوش مصنوعی و مدل‌های پردازش زبان طبیعی",
                "price": 650000,
                "discount_price": 420000,
                "level": "intermediate",
                "duration": "۱۵ ساعت",
                "students_count": 210,
                "rating": 4.8,
                "cover_image_url": "/media/courses/covers/course-2-ai.jpg",
                "intro_video_url": sample_intro,
                "what_you_will_learn": "آشنایی با مدل‌های زبانی بزرگ (LLM)\nنوشتن اسکریپت‌های خودکارسازی کارهای تکراری\nاتصال به API هوش مصنوعی\nساخت دستیار هوشمند اختصاصی",
                "prerequisites": "آشنایی پایه با پایتون",
                "is_published": True,
            }
        )
        sec_ai, _ = Section.objects.get_or_create(course=c2, title="فصل اول: ورود به دنیای هوش مصنوعی کاربردی", defaults={"order": 1})
        Lesson.objects.get_or_create(
            course=c2,
            section=sec_ai,
            order=1,
            defaults={
                "title": "انقلاب هوش مصنوعی و فرصت‌های بی‌نظیر درآمدی",
                "duration": "10:30",
                "is_free_preview": True,
                "video_url": sample_intro,
                "description": "چرا باید هم‌اکنون به سراغ ادغام هوش مصنوعی با تخصص خود بروید؟"
            }
        )
        Lesson.objects.get_or_create(
            course=c2,
            section=sec_ai,
            order=2,
            defaults={
                "title": "اولین پروژه عملی: اتصال پایتون به API",
                "duration": "16:45",
                "is_free_preview": False,
                "video_url": sample_vid1,
                "description": "نوشتن اولین خطوط کلاینت هوش مصنوعی در پایتون."
            }
        )

        # Course 3: UI/UX Figma
        c3, _ = Course.objects.get_or_create(
            slug="ui-ux-figma-mastery",
            defaults={
                "title": "صفر تا صد طراحی رابط کاربری (UI/UX) با فیگما",
                "category": cat_design,
                "short_description": "آموزش اصول دیزاین سیستم، وایرفریم، پروتوتایپ و تحویل اصولی طرح به برنامه‌نویسان",
                "description": """طراحی رابط کاربری یکی از پرتقاضاترین مهارت‌های دنیای دیجیتال است. در این دوره صفر تا صد فیگما و اصول روانشناسی رنگ، چیدمان و ساخت دیزاین سیستم را یاد می‌گیرید.""",
                "instructor_name": "سارا طاهری",
                "instructor_title": "طراح ارشد محصول (Product Designer)",
                "instructor_bio": "بیش از ۶ سال سابقه طراحی محصول برای شرکت‌های فین‌تک",
                "price": 540000,
                "discount_price": 380000,
                "level": "beginner",
                "duration": "۱۸ ساعت",
                "students_count": 185,
                "rating": 5.0,
                "cover_image_url": "/media/courses/covers/course-3-figma.jpg",
                "intro_video_url": sample_intro,
                "what_you_will_learn": "اصول طراحی رابط کاربری مدرن\nکار با نرم‌افزار فیگما از مقدماتی تا حرفه‌ای\nساخت کامپوننت‌ها و واریانت‌های هوشمند\nطراحی ریسپانسیو برای وب و موبایل",
                "prerequisites": "بدون پیش‌نیاز",
                "is_published": True,
            }
        )
        sec_des, _ = Section.objects.get_or_create(course=c3, title="فصل اول: پایه‌های طراحی محصول", defaults={"order": 1})
        Lesson.objects.get_or_create(
            course=c3,
            section=sec_des,
            order=1,
            defaults={
                "title": "آشنایی با محیط Figma و ابزارهای کلیدی",
                "duration": "12:10",
                "is_free_preview": True,
                "video_url": sample_intro,
                "description": "راهنمای گام‌به‌گام اولین تجربه در محیط فیگما."
            }
        )

        # Course 4: Freelancing & Career (Free Course!)
        c4, _ = Course.objects.get_or_create(
            slug="freelancing-and-market-entrance",
            defaults={
                "title": "راهنمای جامع ورود به بازار کار و جذب اولین پروژه‌ها (رایگان)",
                "category": cat_career,
                "short_description": "چگونه اولین مشتری و اولین شغل حوزه نرم‌افزار و طراحی را بدون سابقه رسمی بگیریم؟",
                "description": """بسیاری از افراد مهارت فنی دارند اما نحوه ارائه، ارتباط با کارفرما، قیمت‌گذاری و بستن قرارداد را نمی‌دانند. این دوره هدیه تیم جهش کار برای شماست تا سد ورود به بازار را بشکنید.""",
                "instructor_name": "تیم جهش کار",
                "instructor_title": "مربیان شغلی و کوچ‌های استخدام",
                "instructor_bio": "هدایت بیش از ۱۰۰۰ کارجو به سمت استخدام و فریلنسری موفق",
                "price": 0,
                "discount_price": None,
                "level": "all",
                "duration": "۵ ساعت",
                "students_count": 890,
                "rating": 4.9,
                "cover_image_url": "/media/courses/covers/course-4-career.jpg",
                "intro_video_url": sample_intro,
                "what_you_will_learn": "اصول ساخت رزومه جذاب و متقاعدکننده\nنحوه ارسال پیشنهاد (پروپوزال) موثر برای پروژه‌ها\nتکنیک‌های مذاکره مالی و افزایش دستمزد\nمدیریت زمان و تعهدات کاری",
                "prerequisites": "بدون پیش‌نیاز",
                "is_published": True,
            }
        )
        sec_free, _ = Section.objects.get_or_create(course=c4, title="فصل اول: ذهنیت موفقیت در بازار کار", defaults={"order": 1})
        Lesson.objects.get_or_create(
            course=c4,
            section=sec_free,
            order=1,
            defaults={
                "title": "از کجا شروع کنیم؟ شناسایی توانمندی‌های پنهان",
                "duration": "15:00",
                "is_free_preview": True,
                "video_url": sample_intro,
                "description": "چگونه داشته‌های خود را به ارزش قابل فروش تبدیل کنیم."
            }
        )
        Lesson.objects.get_or_create(
            course=c4,
            section=sec_free,
            order=2,
            defaults={
                "title": "فوت‌وفن رزومه‌نویسی حرفه‌ای برای جذب کارفرما",
                "duration": "18:20",
                "is_free_preview": True,
                "video_url": sample_vid2,
                "description": "بررسی نمونه رزومه‌های پذیرفته شده و رد شده."
            }
        )

        # 5. Enroll the demo student in course 1
        order = Order.create_order(student_user, c1)
        order.status = "completed"
        order.save()
        Enrollment.objects.get_or_create(user=student_user, course=c1, defaults={"order": order})

        self.stdout.write(self.style.SUCCESS("All initial seed data created successfully!"))
