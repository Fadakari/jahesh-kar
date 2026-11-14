import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaheshkar_backend.settings')

import django
django.setup()

from core.models import SiteSetting, SiteFeature, Testimonial, FAQ

def seed():
    # 1. Update SiteSetting
    s = SiteSetting.get_settings()
    s.site_title = "یاسین دهقان"
    s.announcement_active = True
    s.announcement_badge = "پیشنهاد ویژه"
    s.announcement_text = "تخفیف ویژه دوره‌ها به مناسبت شروع فصل جدید آکادمی یاسین دهقان - دسترسی نامحدود به ویدیوها و سورس‌کدها"
    s.announcement_link = "/courses"

    s.hero_badge = "آکادمی تخصصی برنامه‌نویسی و مهارت یاسین دهقان"
    s.hero_title = "یادگیری عمیق، پروژه‌محور و ورود سریع به بازار کار تکنولوژی"
    s.hero_subtitle = "مسیر یادگیری طراحی شده بر پایه نیازهای واقعی استخدام؛ بدون مباحث تئوری اضافه، مستقیماً سورس‌کدهای پروژه‌های تجاری را پیاده‌سازی کنید."
    s.hero_cta_primary_text = "مشاهده دوره‌های تخصصی"
    s.hero_cta_primary_link = "/courses"
    s.hero_cta_secondary_text = "دوره‌های رایگان و نمونه درس‌ها"
    s.hero_cta_secondary_link = "/courses"

    s.stat_1_number = "+۱۲,۰۰۰"
    s.stat_1_label = "دانشجوی فعال و رضایتمند"
    s.stat_2_number = "+۸۵ ساعت"
    s.stat_2_label = "آموزش کاملاً پروژه‌محور"
    s.stat_3_number = "۹۸.۸٪"
    s.stat_3_label = "رضایت دانشجویان از کیفیت تدریس"
    s.stat_4_number = "۱۰۰٪"
    s.stat_4_label = "آمادگی برای استخدام و جذب پروژه"

    s.features_badge = "چرا آکادمی یاسین دهقان؟"
    s.features_title = "تفاوت آموزش آکادمیک با تجربه واقعی بازار کار چیست؟"
    s.features_subtitle = "ما به جای آموزش‌های کش‌دار و تئوری‌های بی‌استفاده، سناریوهایی را حل می‌کنیم که هر روز در شرکت‌های نرم‌افزاری و پروژه‌های فریلنسری با آن‌ها مواجه می‌شوید."

    s.contact_phone = "۰۲۱-۹۱۰۰۰۰۰۰"
    s.contact_email = "info@yasindehqan.ir"
    s.telegram_url = "https://t.me/yasindehqan"
    s.instagram_url = ""
    s.footer_about = "آکادمی یاسین دهقان مرجع تخصصی دوره‌های مهارتی و پروژه‌محور برای ورود به بازار کار تکنولوژی و کسب درآمد است. ما فاصله بین یادگیری تئوری و اجرای پروژه‌های واقعی را به حداقل رسانده‌ایم."
    s.save()
    print("SiteSetting updated successfully!")

    # 2. Seed Features
    if SiteFeature.objects.count() == 0:
        features_data = [
            {
                "title": "کدنویسی صنعتی و کلین آرکیتکچر",
                "description": "دوره‌ها بر مبنای استانداردهای پروژه‌های سازمانی تدریس شده‌اند؛ یاد می‌گیرید چطور کد تست‌پذیر، ماژولار و مقیاس‌پذیر بنویسید.",
                "badge": "معماری نرم‌افزار",
                "tag": "Clean Architecture • Design Patterns",
                "icon_type": "code",
                "order": 1,
            },
            {
                "title": "پروژه‌های تجاری پایان دوره",
                "description": "به جای ساخت برنامه‌های ساده آموزشی، سیستم‌های واقعی مانند فروشگاه، پنل ادمین، احراز هویت پیامکی و درگاه پرداخت را می‌سازید.",
                "badge": "پورتفولیو حرفه‌ای",
                "tag": "Fullstack Production Ready",
                "icon_type": "project",
                "order": 2,
            },
            {
                "title": "پشتیبانی مستقیم و رفع اشکال",
                "description": "ارتباط مستقیم با یاسین دهقان و تیم منتورینگ در گروه اختصاصی تلگرام؛ سوالات و باگ‌های کدهایتان بی‌پاسخ نمی‌ماند.",
                "badge": "منتورینگ اختصاصی",
                "tag": "پاسخگویی سریع کمتر از ۲ ساعت",
                "icon_type": "mentor",
                "order": 3,
            },
            {
                "title": "دسترسی مادام‌العمر و آپدیت رایگان",
                "description": "با ثبت‌نام در هر دوره، تمامی قسمت‌های جدید، آپدیت‌های تکنولوژی و سورس‌کدهای گیت‌هاب را بدون هیچ هزینه اضافی دریافت می‌کنید.",
                "badge": "سرمایه‌گذاری پایدار",
                "tag": "آپدیت منظم ۲۰۲۶",
                "icon_type": "update",
                "order": 4,
            },
        ]
        for f in features_data:
            SiteFeature.objects.create(**f)
        print(f"Created {len(features_data)} features.")
    else:
        print(f"Features already exist ({SiteFeature.objects.count()}).")

    # 3. Seed Testimonials
    if Testimonial.objects.count() == 0:
        testimonials_data = [
            {
                "student_name": "علیرضا حسینی",
                "student_role": "توسعه‌دهنده فرانت‌اند در شرکت فین‌تک",
                "avatar_initials": "ع.ح",
                "comment": "بعد از چند ماه سردرگمی بین آموزش‌های مختلف، دوره یاسین دهقان دقیقاً بهم یاد داد چطور پروژه‌ای بسازم که مصاحبه‌کننده فنی رو شگفت‌زده کنه. یک ماه بعد از اتمام دوره تونستم اولین قراردادم رو ببندم.",
                "rating": 5,
                "order": 1,
            },
            {
                "student_name": "مهسا محمدی",
                "student_role": "برنامه‌نویس بک‌اند پایتون و جنگو",
                "avatar_initials": "م.م",
                "comment": "نکته فوق‌العاده تدریس یاسین دهقان اینه که وقت روی تئوری‌های کسل‌کننده تلف نمیشه. از روز اول معماری سرویس، مدل‌سازی دیتابیس و اتصال امن API رو یاد گرفتیم و الان توی پروژه‌های فریلنسریم به راحتی پیاده‌سازیشون می‌کنم.",
                "rating": 5,
                "order": 2,
            },
            {
                "student_name": "پوریا راد",
                "student_role": "فریلنسر بین‌المللی فول‌استک",
                "avatar_initials": "پ.ر",
                "comment": "کیفیت سورس‌کدها و پشتیبانی دوره بی‌نظیر بود. هر زمان به چالش یا باگ پیچیده‌ای می‌خوردم، در کمتر از چند ساعت راهنمایی کامل دریافت می‌کردم. ارزش این دوره‌ها چندین برابر بیشتر از هزینه‌اش بود.",
                "rating": 5,
                "order": 3,
            },
        ]
        for t in testimonials_data:
            Testimonial.objects.create(**t)
        print(f"Created {len(testimonials_data)} testimonials.")
    else:
        print(f"Testimonials already exist ({Testimonial.objects.count()}).")

if __name__ == "__main__":
    seed()
