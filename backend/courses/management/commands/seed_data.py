import sys
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from courses.models import Category, Course, Section, Lesson
from orders.models import Order, Enrollment
from core.models import SiteSetting, FAQ

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds database with realistic Persian sample data for AvazAmuz (آموزش مداحی)"

    def handle(self, *args, **options):
        if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
            try:
                sys.stdout.reconfigure(encoding='utf-8')
            except Exception:
                pass

        try:
            self.stdout.write("Creating initial AvazAmuz data...")
        except Exception:
            pass

        # 1. Superuser
        admin_user, _ = User.objects.get_or_create(
            username="admin",
            defaults={
                "full_name": "مدیریت آکادمی آواز آموز",
                "phone_number": "09120000000",
                "email": "admin@avazamouz.ir",
                "is_staff": True,
                "is_superuser": True,
                "is_verified": True,
            }
        )
        admin_user.set_password("admin123456")
        admin_user.save()

        # 2. Student user
        student_user, _ = User.objects.get_or_create(
            username="student",
            defaults={
                "full_name": "محمدحسین رضایی",
                "phone_number": "09351234567",
                "email": "student@avazamouz.ir",
                "is_verified": True,
            }
        )
        student_user.set_password("user123456")
        student_user.save()

        # 3. Categories (آموزش مداحی و صداسازی)
        cat_seda, _ = Category.objects.get_or_create(
            slug="vocal-training",
            defaults={
                "title": "صداسازی و پرورش حنجره",
                "icon": "Mic",
                "description": "تکنیک‌های تنفس دیافراگمی، طنین صدا، تحریر، تقویت اوج و بهداشت صوتی مداح"
            }
        )
        cat_radif, _ = Category.objects.get_or_create(
            slug="maqamat-radif",
            defaults={
                "title": "دستگاه‌ها و نغمات آوازی",
                "icon": "Music",
                "description": "آموزش ردیف‌ها و دستگاه‌های سنتی متناسب با مرثیه‌خوانی، مولودی و ادعیه"
            }
        )
        cat_maqtal, _ = Category.objects.get_or_create(
            slug="maqtal-study",
            defaults={
                "title": "مقتل‌شناسی و شعر آیینی",
                "icon": "BookOpen",
                "description": "بررسی مقاتل معتبر، درک مفاهیم روایی و گزینش اشعار فاخر اهل‌بیت (ع)"
            }
        )
        cat_majles, _ = Category.objects.get_or_create(
            slug="speech-majles",
            defaults={
                "title": "فن بیان و مجلس‌داری",
                "icon": "Volume2",
                "description": "مدیریت جلسه، آداب ستایشگری، زبان بدن، اوج و فرود و ارتباط با مستمعین"
            }
        )

        sample_intro = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        sample_vid1 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        sample_vid2 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"

        # 4. Courses
        # Course 1: صداسازی جامع
        c1, _ = Course.objects.get_or_create(
            slug="mastering-maddahi-vocals",
            defaults={
                "title": "دوره جامع صداسازی علمی، تقویت حنجره و بهداشت صوت در مداحی",
                "category": cat_seda,
                "short_description": "آموزش گام‌به‌گام از تنفس صحیح دیافراگمی تا اجرای اوج‌های ممتد بدون گرفتگی صدا",
                "description": """در این دوره جامع شما با متدهای علمی بین‌المللی صداسازی ترکیب شده با سبک‌های مداحی سنتی و مدرن آشنا می‌شوید.
بسیاری از مادحین به دلیل ناآگاهی از نحوه استفاده از تارهای صوتی دچار خستگی زودرس یا آسیب حنجره می‌شوند.
در این دوره از پایه نحوه تقویت حجم صدا، تحریرهای متنوع، وسعت صوتی و اجرای با آرامش را فرا خواهید گرفت.""",
                "instructor_name": "استاد حاج مرتضی تهرانی",
                "instructor_title": "مدرس ارشد صداسازی مذهبی و قاری قرآن کریم",
                "instructor_bio": "بیش از ۱۵ سال سابقه تدریس صداسازی تخصصی و تربیت صدها مداح برجسته کشوری",
                "price": 890000,
                "discount_price": 590000,
                "level": "all",
                "duration": "۱۸ ساعت",
                "students_count": 480,
                "rating": 4.9,
                "cover_image_url": "/media/courses/covers/course-1-fullstack.jpg",
                "intro_video_url": sample_intro,
                "what_you_will_learn": "تنفس عمیق دیافراگمی و تسلط بر بازدم پایدار\nشناخت و استفاده از رزوناتورهای سر، دهان و سینه\nتکنیک‌های تقویت اوج‌خوانی بدون فشار به حنجره\nتمرینات ویژه انعطاف و غلتش تارهای صوتی\nبهداشت صوتی و تغذیه اختصاصی مداح قبل از مجالس",
                "prerequisites": "علاقه‌مندی به مداحی؛ این دوره از پایه طراحی شده و نیاز به زمینه قبلی ندارد.",
                "is_published": True,
            }
        )

        sec1, _ = Section.objects.get_or_create(course=c1, title="فصل اول: آناتومی حنجره و مبانی تنفس صحیح", defaults={"order": 1})
        Lesson.objects.get_or_create(
            course=c1,
            section=sec1,
            order=1,
            defaults={
                "title": "معرفی دوره و رازهای ماندگاری صدای مادحین کهن",
                "duration": "10:15",
                "is_free_preview": True,
                "video_url": sample_intro,
                "description": "بررسی نقشه راه دوره و مقدمه‌ای بر ساختار حنجره و نحوه تولید صوت."
            }
        )
        Lesson.objects.get_or_create(
            course=c1,
            section=sec1,
            order=2,
            defaults={
                "title": "تمرینات عملی تنفس شکمی و دیافراگمی",
                "duration": "16:40",
                "is_free_preview": True,
                "video_url": sample_vid1,
                "description": "یادگیری تکنیک‌های کنترل نفس برای جملات طولانی در روضه و نوحه."
            }
        )

        sec2, _ = Section.objects.get_or_create(course=c1, title="فصل دوم: طنین، پرتاب صدا و تحریرها", defaults={"order": 2})
        Lesson.objects.get_or_create(
            course=c1,
            section=sec2,
            order=3,
            defaults={
                "title": "رزوناتورهای صوتی و پرتاب صدای شفاف بدون میکروفون",
                "duration": "21:30",
                "is_free_preview": False,
                "video_url": sample_vid2,
                "description": "هدایت ارتعاشات به حفره‌های جمجمه و دهان جهت افزایش شفافیت صدا."
            }
        )

        # Course 2: دستگاه‌ها و نغمات در مداحی
        c2, _ = Course.objects.get_or_create(
            slug="radif-and-melodies-in-maddahi",
            defaults={
                "title": "آموزش گوشه‌ها و دستگاه‌های آوازی در مرثیه‌خوانی و ادعیه",
                "category": cat_radif,
                "short_description": "تسلط بر دستگاه‌های شور، دشتی، ابوعطا، همایون و چهارگاه با نمونه‌های اجرایی مجالس",
                "description": """یک مداح موفق باید بداند هر شعر و روضه را در چه مقامی بخواند تا بیشترین تاثیر عاطفی را بر دل مستمع بگذارد.
در این دوره مقامات و گوشه‌های اصیل متناسب با ادعیه، مناجات، روضه‌خوانی و نوحه‌سرایی آموزش داده می‌شود.""",
                "instructor_name": "استاد سیدعلی حسینی",
                "instructor_title": "ردیف‌دان و کارشناس موسیقی و الحان آیینی",
                "instructor_bio": "شاگرد اساتید مطرح آوازی و با سابقه تولید نواهای آیینی ماندگار",
                "price": 750000,
                "discount_price": 490000,
                "level": "intermediate",
                "duration": "۱۴ ساعت",
                "students_count": 310,
                "rating": 4.8,
                "cover_image_url": "/media/courses/covers/course-2-ai.jpg",
                "intro_video_url": sample_intro,
                "what_you_will_learn": "شناخت دستگاه شور و متعلقات آن (دشتی، ابوعطا، افشاری)\nکاربرد مقام همایون و شوشتری در نوحه‌های محرم\nتکنیک‌های انتقال از یک گوشه به گوشه دیگر (مدولاسیون)\nتطبیق اشعار کهن با نغمات مذهبی",
                "prerequisites": "گذراندن دوره صداسازی پایه یا آشنایی مقدماتی با زیر و بم صدا.",
                "is_published": True,
            }
        )
        sec_c2, _ = Section.objects.get_or_create(course=c2, title="فصل اول: آواز دشتی و حزن در مرثیه", defaults={"order": 1})
        Lesson.objects.get_or_create(
            course=c2,
            section=sec_c2,
            order=1,
            defaults={
                "title": "مقدمه گوشه اوج و فرود در دشتی",
                "duration": "12:50",
                "is_free_preview": True,
                "video_url": sample_intro,
                "description": "چرا آواز دشتی پایه اصلی روضه‌خوانی سنتی در ایران است؟"
            }
        )

        # Course 3: مقتل‌شناسی تحلیلی
        c3, _ = Course.objects.get_or_create(
            slug="authentic-maqtal-analysis",
            defaults={
                "title": "مقتل‌شناسی مستند و تطبیق روایات در مرثیه‌خوانی",
                "category": cat_maqtal,
                "short_description": "شناخت مقاتل دست‌اول، تفکیک روایات معتبر از تحریفات، و ساختاردهی به روضه",
                "description": """اخلاص و صداقت در نقل وقایع اهل‌بیت، جوهره مداحی با برکت است.
در این دوره کتب کهن نظیر مقتل ابومخنف، لهوف، نفس‌المهموم و روضه‌الشهدا با دیدی پژوهشی و کاربردی بررسی می‌شوند.""",
                "instructor_name": "حجت‌الاسلام دکتر موسوی",
                "instructor_title": "پژوهشگر تاریخ اسلام و متون آیینی",
                "instructor_bio": "نویسنده مقالات متعدد در حوزه بازشناسی متون مقتل کهن",
                "price": 620000,
                "discount_price": 380000,
                "level": "all",
                "duration": "۱۲ ساعت",
                "students_count": 225,
                "rating": 5.0,
                "cover_image_url": "/media/courses/covers/course-3-uiux.jpg",
                "intro_video_url": sample_intro,
                "what_you_will_learn": "آشنایی با سیر تحول مقاتل از قرن دوم تا عصر حاضر\nنحوه مطالعه و استخراج نکات عاطفی بدون تحریف\nتنظیم متن گریز روضه با اسناد معتبر\nادب مواجهه با مصائب اولیای الهی",
                "prerequisites": "بدون پیش‌نیاز",
                "is_published": True,
            }
        )
        sec_c3, _ = Section.objects.get_or_create(course=c3, title="فصل اول: اعتبارشناسی کتب تاریخی", defaults={"order": 1})
        Lesson.objects.get_or_create(
            course=c3,
            section=sec_c3,
            order=1,
            defaults={
                "title": "شاخصه‌های مقتل مستند و معیارهای پذیرش روایت",
                "duration": "14:15",
                "is_free_preview": True,
                "video_url": sample_intro,
                "description": "اصول بررسی رجال و متن روایات کربلا."
            }
        )

        # Course 4: فن بیان و آداب مجلس‌داری (رایگان)
        c4, _ = Course.objects.get_or_create(
            slug="majles-etiquette-and-speech-free",
            defaults={
                "title": "اصول و آداب مجلس‌داری و فن بیان در ستایشگری (رایگان)",
                "category": cat_majles,
                "short_description": "چگونه محفل را گرم کنیم؟ مدیریت زمان، احترام به مستمع و آداب نوکری اهل‌بیت",
                "description": """مداحی فقط خواندن نیست؛ اداره یک محفل معنوی است.
این دوره هدیه آکادمی آواز آموز است برای تمامی مادحین نوپا و ذاکران علاقه‌مند تا با آداب ظاهری و باطنی این مسیر آشنا شوند.""",
                "instructor_name": "اساتید آکادمی آواز آموز",
                "instructor_title": "هیئت علمی و پیشکسوتان مداحی",
                "instructor_bio": "جمعی از ذاکران باسابقه و اساتید فن بیان",
                "price": 0,
                "discount_price": None,
                "level": "beginner",
                "duration": "۶ ساعت",
                "students_count": 940,
                "rating": 4.9,
                "cover_image_url": "/media/courses/covers/course-4-career.jpg",
                "intro_video_url": sample_intro,
                "what_you_will_learn": "آداب ورود، شروع، اوج و دعای پایان مجلس\nارتباط موثر چشمی و روانشناسی جمعیتی مستمعین\nنحوه غلبه بر استرس و اضطراب صحنه\nاخلاق مداحی و پرهیز از آسیب‌های رایج",
                "prerequisites": "بدون نیاز به پیش‌نیاز",
                "is_published": True,
            }
        )
        sec_c4, _ = Section.objects.get_or_create(course=c4, title="فصل اول: آداب نوکری و روانشناسی مستمع", defaults={"order": 1})
        Lesson.objects.get_or_create(
            course=c4,
            section=sec_c4,
            order=1,
            defaults={
                "title": "آغاز مجلس: انتخاب شعر و نحوه ورود متین",
                "duration": "11:20",
                "is_free_preview": True,
                "video_url": sample_intro,
                "description": "چگونه در ۳ دقیقه اول آرامش و توجه مجلس را جلب کنیم؟"
            }
        )

        # 5. Enroll the demo student in course 1
        order = Order.create_order(student_user, c1)
        order.status = "completed"
        order.save()
        Enrollment.objects.get_or_create(user=student_user, course=c1, defaults={"order": order})

        # 6. Site Settings & Dynamic FAQs
        setting = SiteSetting.get_settings()
        setting.site_title = "آواز آموز"
        setting.hero_badge = "نخستین آکادمی تخصصی آموزش مداحی و صداسازی مذهبی"
        setting.hero_title = "آموزش اصولی مداحی، فن بیان و صداسازی با اساتید برجسته"
        setting.hero_subtitle = "از پرورش و تقویت حنجره تا تسلط بر دستگاه‌های آوازی، مقتل‌خوانی، نوحه‌سرایی و مجلس‌داری را به صورت گام‌به‌گام بیاموزید."
        setting.features_badge = "چرا آکادمی آواز آموز؟"
        setting.features_title = "تربیت ذاکران و مداحان اهل‌بیت با اصیل‌ترین متدهای صوتی و معرفتی"
        setting.features_subtitle = "آموزش‌های کاربردی متناسب با اصول صداسازی علمی، لحن‌شناسی، ادعیه‌خوانی و آداب نوکری به همراه رفع اشکال و تمرین‌های صوتی هدفمند."
        setting.contact_phone = "۰۲۱-۹۱۰۰۰۰۰۰"
        setting.contact_email = "info@avazamouz.ir"
        setting.telegram_url = "https://t.me/avazamouz"
        setting.footer_about = "آواز آموز، مرجع تخصصی آموزش نوین و اصولی مداحی، صداسازی و فن بیان مذهبی است. رسالت ما توانمندسازی علاقه‌مندان به ستایشگری اهل‌بیت (ع) با تکیه بر علم صداسازی و اصالت‌های سنتی است."
        setting.enamad_html = "<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=752620&Code=1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=752620&Code=1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq' alt='' style='cursor:pointer' code='1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq'></a>"
        setting.save()

        # Dynamic FAQs for AvazAmuz
        FAQ.objects.all().delete()
        faqs_data = [
            (
                "آیا برای شرکت در دوره‌ها نیاز به صدای خاص یا زمینه قبلی دارم؟",
                "خیر، دوره‌ها به ویژه دوره «صداسازی جامع و پرورش حنجره» از پایه و صفر مطلق، با آموزش صحیح تنفس دیافراگمی، تلفظ حروف و باز کردن حجم صدا آغاز می‌شود. هر فرد با تمرین مستمر می‌تواند صدای خود را به زیبایی پرورش دهد.",
                1
            ),
            (
                "آیا آموزش دستگاه‌های آوازی منطبق با سبک‌های مداحی است؟",
                "بله، در آواز آموز برخلاف کلاس‌های سنتی آواز که تئوریک هستند، تمامی گوشه‌ها و مقامات (شور، دشتی، همایون، چهارگاه و...) مستقیماً روی اشعار مرثیه، نوحه و مولودی شبیه‌سازی و اجرا می‌شوند.",
                2
            ),
            (
                "آیا امکان مشاهده نمونه جلسات قبل از خرید دوره وجود دارد؟",
                "بله، در تمامی دوره‌ها جلسات با نشان «پیش‌نمایش رایگان» مشخص شده‌اند که هر علاقه‌مندی بدون پرداخت هزینه می‌تواند آن‌ها را تماشا کرده و با کیفیت تدریس اساتید آشنا شود.",
                3
            ),
            (
                "آیا دوره‌ها دارای تمرین‌های عملی و صوتی هستند؟",
                "بله، در هر جلسه الگوهای صوتی و تمرینات حنجره به همراه سورس و فایل‌های صوتی ضمیمه قرار دارند که به صورت روزانه می‌توانید همراه با استاد تمرین کنید.",
                4
            ),
            (
                "پس از ثبت‌نام، دسترسی به ویدیوها تا چه زمانی برقرار است؟",
                "دسترسی شما به دوره‌های ثبت‌نام شده همیشگی و نامحدود است و در تمام ۲۴ ساعت شبانه‌روز از طریق گوشی یا کامپیوتر می‌توانید ویدیوها را تماشا کنید.",
                5
            ),
        ]

        for q, a, o in faqs_data:
            FAQ.objects.create(question=q, answer=a, order=o, is_active=True)

        self.stdout.write(self.style.SUCCESS("All AvazAmuz seed data created successfully!"))
