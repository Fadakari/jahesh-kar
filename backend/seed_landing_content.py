import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaheshkar_backend.settings')

import django
django.setup()

from core.models import SiteSetting, SiteFeature, LearningStep, Testimonial, FAQ

def seed():
    # 1. Update SiteSetting
    s = SiteSetting.get_settings()
    s.site_title = "یاسین دهقان"
    s.academy_scope = "آکادمی تخصصی مهارت و یادگیری"
    s.announcement_active = True
    s.announcement_badge = "پیشنهاد ویژه"
    s.announcement_text = "تخفیف ویژه دوره‌ها به مناسبت شروع فصل جدید آکادمی یاسین دهقان - دسترسی نامحدود به ویدیوها و منابع"
    s.announcement_link = "/courses"

    s.hero_badge = "آکادمی تخصصی یاسین دهقان"
    s.hero_title = "یادگیری عمیق، کاربردی و مهارت‌های مورد نیاز بازار کار"
    s.hero_subtitle = "مسیر یادگیری طراحی شده بر پایه تجربیات عملی و نیازهای واقعی روز؛ بدون اتلاف وقت، مستقیم مهارت‌های اصلی را بیاموزید و به کار ببندید."
    s.hero_cta_primary_text = "مشاهده دوره‌های تخصصی"
    s.hero_cta_primary_link = "/courses"
    s.hero_cta_secondary_text = "دوره‌های رایگان و آزمایشی"
    s.hero_cta_secondary_link = "/courses?price=free"

    # Hero Visual Showcase
    s.hero_preview_badge = "متدولوژی اختصاصی آموزش"
    s.hero_preview_title = "آموزش کاربردی با پشتیبانی مستقیم مدرس"
    s.hero_preview_subtitle = "جلسات ویدیویی گام‌به‌گام با دسترسی همیشگی، تمرین‌های عملی و رفع اشکال مستمر."
    s.hero_tagline_1 = "سرفصل‌های کاربردی و منطبق با نیاز روز"
    s.hero_tagline_2 = "پشتیبانی و رفع اشکال اختصاصی توسط مدرس"
    s.hero_tagline_3 = "دسترسی نامحدود و همیشگی به ویدیوها و منابع"

    s.stat_1_number = "+۱۲,۰۰۰"
    s.stat_1_label = "دانشجوی فعال و رضایتمند"
    s.stat_2_number = "+۸۵ ساعت"
    s.stat_2_label = "آموزش کاملاً کاربردی و مهارتی"
    s.stat_3_number = "۹۸.۸٪"
    s.stat_3_label = "رضایت دانشجویان از کیفیت تدریس"
    s.stat_4_number = "۱۰۰٪"
    s.stat_4_label = "آمادگی برای ورود به بازار کار و ارتقای شغلی"

    s.features_badge = "چرا آکادمی یاسین دهقان؟"
    s.features_title = "ویژگی‌های متمایز دوره‌های آموزشی ما چیست؟"
    s.features_subtitle = "ما به جای آموزش‌های کش‌دار و تئوری‌های بی‌استفاده، روی مهارت‌هایی تمرکز می‌کنیم که مستقیماً در کار و فعالیت حرفه‌ای به آنها نیاز دارید."

    s.steps_active = True
    s.steps_badge = "مسیر یادگیری تا تسلط"
    s.steps_title = "مسیر گام‌به‌گام یادگیری و رسیدن به هدف"
    s.steps_subtitle = "این همان مسیری است که با برداشتن هر گام، یک سطح به تسلط کامل و نتیجه مطلوب نزدیک‌تر می‌شوید."

    s.contact_phone = "۰۲۱-۹۱۰۰۰۰۰۰"
    s.contact_email = "info@yasindehqan.ir"
    s.telegram_url = "https://t.me/yasindehqan"
    s.instagram_url = ""
    s.footer_about = "آکادمی یاسین دهقان مرجع تخصصی دوره‌های مهارتی و کاربردی برای ارتقای توانمندی‌ها و ورود به بازار کار است. ما فاصله بین یادگیری تئوری و اجرای عملی را به حداقل رسانده‌ایم."
    s.save()
    print("SiteSetting updated successfully!")

    # 2. Reset and seed Features with universal domain-agnostic items
    SiteFeature.objects.all().delete()
    features_data = [
        {
            "title": "آموزش کاربردی و تمرین‌محور",
            "description": "دوره‌ها بر مبنای نیازهای واقعی و عملی طراحی شده‌اند؛ یاد می‌گیرید چطور تکنیک‌ها و اصول را مستقیماً اجرا کنید.",
            "badge": "تمرین عملی",
            "tag": "حل سناریوهای واقعی و مهارتی",
            "icon_type": "practical",
            "order": 1,
        },
        {
            "title": "پشتیبانی مستقیم و رفع اشکال",
            "description": "ارتباط مستقیم با یاسین دهقان و تیم پشتیبانی؛ هیچ سوال و ابهامی در طول مسیر یادگیری بی‌پاسخ نمی‌ماند.",
            "badge": "همراهی مستمر",
            "tag": "پاسخگویی سریع و راهنمایی گام‌به‌گام",
            "icon_type": "mentor",
            "order": 2,
        },
        {
            "title": "دسترسی همیشگی و آپدیت رایگان",
            "description": "با ثبت‌نام در هر دوره، دسترسی مادام‌العمر به فایل‌ها، چک‌لیست‌ها و آپدیت‌های تکمیلی دوره خواهید داشت.",
            "badge": "سرمایه‌گذاری پایدار",
            "tag": "مشاهده آنلاین و نامحدود در هر زمان",
            "icon_type": "update",
            "order": 3,
        },
        {
            "title": "آمادگی ورود به بازار کار و ارتقای مهارت",
            "description": "تمام سرفصل‌ها با تمرکز بر درآمدزایی، جذب پروژه یا ارتقای جایگاه شغلی تدوین شده است.",
            "badge": "نتیجه‌محور",
            "tag": "توسعه فردی و حرفه‌ای",
            "icon_type": "certificate",
            "order": 4,
        },
    ]
    for f in features_data:
        SiteFeature.objects.create(**f)
    print(f"Created {len(features_data)} features.")

    # 3. Seed LearningSteps
    LearningStep.objects.all().delete()
    steps_data = [
        {
            "step_number": "۰۱",
            "title": "تسلط بر مبانی و اصول کاربردی",
            "description": "بدون حاشیه و تئوری‌های خسته‌کننده، اصول اولیه و کلیدی مهارت را به زبان ساده و روان یاد می‌گیرید.",
            "badge": "پایه‌ریزی اصولی",
            "order": 1,
        },
        {
            "step_number": "۰۲",
            "title": "تمرین عملی و اجرای سناریوها",
            "description": "همراه با مدرس، مباحث را به شکل عملی تمرین کرده و چالش‌های واقعی را گام‌به‌گام حل می‌کنید.",
            "badge": "تثبیت مهارت",
            "order": 2,
        },
        {
            "step_number": "۰۳",
            "title": "رفع اشکال، خروجی‌گیری و ورود به بازار",
            "description": "با رفع اشکال مستمر و بازخورد مستقیم مدرس، آماده اجرای مستقل پروژه‌ها و کسب درآمد می‌شوید.",
            "badge": "تسلط کامل",
            "order": 3,
        },
    ]
    for st in steps_data:
        LearningStep.objects.create(**st)
    print(f"Created {len(steps_data)} learning steps.")

    # 4. Seed Testimonials (universal)
    Testimonial.objects.all().delete()
    testimonials_data = [
        {
            "student_name": "علیرضا حسینی",
            "student_role": "دانشجوی دوره جامع",
            "avatar_initials": "ع.ح",
            "comment": "رویکرد عملی دوره یاسین دهقان واقعاً شگفت‌انگیز بود. بدون حاشیه مستقیم رفتیم سراغ اصل موضوع و بعد از اتمام دوره تونستم نتایج فوق‌العاده‌ای در کارم بگیرم.",
            "rating": 5,
            "order": 1,
        },
        {
            "student_name": "مهسا محمدی",
            "student_role": "متخصص و فعال بازار",
            "avatar_initials": "م.م",
            "comment": "نکته متمایز تدریس یاسین دهقان اینه که فقط به آموزش ختم نمیشه؛ پشتیبانی و راهنمایی‌های دلسوزانه‌شون باعث شد در اجرا به اعتماد به نفس کامل برسم.",
            "rating": 5,
            "order": 2,
        },
        {
            "student_name": "پوریا راد",
            "student_role": "فارغ‌التحصیل دوره پیشرفته",
            "avatar_initials": "پ.ر",
            "comment": "کیفیت محتوا و تعهد مدرس فراتر از انتظارم بود. هر جا به سوالی برخوردم سریع راهنمایی گرفتم. ارزش این دوره چندین برابر مبلغی بود که پرداختم.",
            "rating": 5,
            "order": 3,
        },
    ]
    for t in testimonials_data:
        Testimonial.objects.create(**t)
    print(f"Created {len(testimonials_data)} testimonials.")

if __name__ == "__main__":
    seed()
