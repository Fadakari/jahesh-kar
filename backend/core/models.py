from django.db import models


class SiteSetting(models.Model):
    """
    تنظیمات داینامیک متون، لوگو، آمار و بخش‌های متغیر سایت
    طراحی شده به صورت Singleton (تنها یک رکورد فعال در سیستم وجود دارد)
    """
    site_title = models.CharField(
        max_length=150,
        default="یاسین دهقان",
        verbose_name="عنوان و نام برند سایت"
    )
    logo = models.ImageField(
        upload_to="site/logo/",
        blank=True,
        null=True,
        default="site/logo/yasin-dehqan-logo.png",
        verbose_name="تصویر لوگوی سایت (PNG, SVG, JPG)"
    )

    # نوار اعلان و پیشنهاد ویژه بالای سایت
    announcement_active = models.BooleanField(
        default=True,
        verbose_name="فعال بودن نوار اطلاع‌رسانی بالای سایت"
    )
    announcement_badge = models.CharField(
        max_length=50,
        default="پیشنهاد ویژه",
        verbose_name="برچسب نوار بالا"
    )
    announcement_text = models.CharField(
        max_length=255,
        default="تخفیف ویژه دوره‌ها به مناسبت شروع فصل جدید آکادمی یاسین دهقان - دسترسی نامحدود به ویدیوها و سورس‌کدها",
        verbose_name="متن نوار بالای سایت"
    )
    announcement_link = models.CharField(
        max_length=255,
        blank=True,
        default="/courses",
        verbose_name="لینک کلیک نوار اعلان"
    )

    # بخش هیرو (Hero) در صفحه اصلی
    hero_badge = models.CharField(
        max_length=150,
        default="آکادمی تخصصی برنامه‌نویسی و مهارت یاسین دهقان",
        verbose_name="نشان / بج بالای عنوان اصلی"
    )
    hero_title = models.CharField(
        max_length=255,
        default="یادگیری عمیق، پروژه‌محور و ورود سریع به بازار کار تکنولوژی",
        verbose_name="عنوان اصلی هیرو"
    )
    hero_subtitle = models.TextField(
        default="مسیر یادگیری طراحی شده بر پایه نیازهای واقعی استخدام؛ بدون مباحث تئوری اضافه، مستقیماً سورس‌کدهای پروژه‌های تجاری را پیاده‌سازی کنید.",
        verbose_name="توضیحات زیر عنوان هیرو"
    )
    hero_cta_primary_text = models.CharField(
        max_length=80,
        default="مشاهده دوره‌های تخصصی",
        verbose_name="متن دکمه اصلی هیرو"
    )
    hero_cta_primary_link = models.CharField(
        max_length=150,
        default="/courses",
        verbose_name="لینک دکمه اصلی هیرو"
    )
    hero_cta_secondary_text = models.CharField(
        max_length=80,
        default="دوره‌های رایگان و آزمایشی",
        verbose_name="متن دکمه دوم هیرو"
    )
    hero_cta_secondary_link = models.CharField(
        max_length=150,
        default="/courses?price=free",
        verbose_name="لینک دکمه دوم هیرو"
    )

    # آمار و ارقام کلیدی (Trust Metrics Strip)
    stat_1_number = models.CharField(max_length=50, default="+۱۲,۰۰۰", verbose_name="عدد آمار اول")
    stat_1_label = models.CharField(max_length=120, default="دانشجوی فعال و رضایتمند", verbose_name="عنوان آمار اول")
    stat_2_number = models.CharField(max_length=50, default="+۸۵ ساعت", verbose_name="عدد آمار دوم")
    stat_2_label = models.CharField(max_length=120, default="آموزش کاملاً پروژه‌محور", verbose_name="عنوان آمار دوم")
    stat_3_number = models.CharField(max_length=50, default="۹۸.۸٪", verbose_name="عدد آمار سوم")
    stat_3_label = models.CharField(max_length=120, default="رضایت دانشجویان از کیفیت تدریس", verbose_name="عنوان آمار سوم")
    stat_4_number = models.CharField(max_length=50, default="۱۰۰٪", verbose_name="عدد آمار چهارم")
    stat_4_label = models.CharField(max_length=120, default="آمادگی برای استخدام و جذب پروژه", verbose_name="عنوان آمار چهارم")

    # بخش بنر مزایا و چرا یاسین دهقان؟
    features_badge = models.CharField(
        max_length=150,
        default="چرا آکادمی یاسین دهقان؟",
        verbose_name="نشان بنر مزایا"
    )
    features_title = models.CharField(
        max_length=255,
        default="تفاوت آموزش آکادمیک با تجربه واقعی بازار کار چیست؟",
        verbose_name="عنوان بخش مزایا"
    )
    features_subtitle = models.TextField(
        default="ما به جای آموزش‌های کش‌دار و تئوری‌های بی‌استفاده، سناریوهایی را حل می‌کنیم که هر روز در شرکت‌های نرم‌افزاری و پروژه‌های فریلنسری با آن‌ها مواجه می‌شوید.",
        verbose_name="توضیحات بخش مزایا"
    )

    # اطلاعات تماس و شبکه‌های اجتماعی
    contact_phone = models.CharField(
        max_length=50,
        blank=True,
        default="۰۲۱-۹۱۰۰۰۰۰۰",
        verbose_name="شماره تماس پشتیبانی"
    )
    contact_email = models.CharField(
        max_length=100,
        blank=True,
        default="support@yasindehqan.ir",
        verbose_name="ایمیل پشتیبانی"
    )
    telegram_url = models.CharField(
        max_length=255,
        blank=True,
        default="https://t.me/yasindehqan",
        verbose_name="لینک کانال یا پشتیبانی تلگرام"
    )
    instagram_url = models.CharField(
        max_length=255,
        blank=True,
        default="",
        verbose_name="لینک صفحه اینستاگرام"
    )

    # متن درباره ما در فوتر
    footer_about = models.TextField(
        blank=True,
        default="آکادمی یاسین دهقان مرجع تخصصی دوره‌های مهارتی و پروژه‌محور برای ورود به بازار کار تکنولوژی و کسب درآمد است. ما فاصله بین یادگیری تئوری و اجرای پروژه‌های واقعی را به حداقل رسانده‌ایم.",
        verbose_name="متن درباره ما در فوتر"
    )

    updated_at = models.DateTimeField(auto_now=True, verbose_name="آخرین به‌روزرسانی")

    class Meta:
        verbose_name = "تنظیمات محتوا و برندینگ سایت"
        verbose_name_plural = "تنظیمات محتوا و برندینگ سایت"

    def __str__(self):
        return f"{self.site_title} (آخرین ویرایش: {self.updated_at.strftime('%Y/%m/%d') if self.updated_at else '---'})"

    @classmethod
    def get_settings(cls):
        setting, _ = cls.objects.get_or_create(id=1)
        return setting


class SiteFeature(models.Model):
    """
    ویژگی‌ها و مزیت‌های رقابتی آکادمی (Bento Grid)
    """
    title = models.CharField(max_length=150, verbose_name="عنوان مزیت")
    description = models.TextField(verbose_name="توضیح کوتاه و دقیق")
    badge = models.CharField(max_length=60, blank=True, verbose_name="برچسب کوچک بالای کارت (مثلا: تجاری / پشتیبانی)")
    tag = models.CharField(max_length=100, blank=True, verbose_name="تگ فنی یا کلیدواژه (مثلا: Git, Clean Architecture)")
    icon_type = models.CharField(
        max_length=50,
        default="code",
        choices=[
            ("code", "کدنویسی و توسعه"),
            ("mentor", "پشتیبانی و منتورینگ"),
            ("project", "پروژه واقعی و تجاری"),
            ("update", "آپدیت مداوم و مادام‌العمر"),
            ("speed", "مسیر سریع و بدون حاشیه"),
            ("shield", "تضمین کیفیت محتوا"),
        ],
        verbose_name="نوع آیکون"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="ترتیب نمایش")
    is_active = models.BooleanField(default=True, verbose_name="فعال")

    class Meta:
        verbose_name = "مزیت رقابتی / ویژگی"
        verbose_name_plural = "مزیت‌های رقابتی (Bento Grid)"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    """
    نظرات و تجربیات واقعی دانشجویان
    """
    student_name = models.CharField(max_length=120, verbose_name="نام و نام خانوادگی دانشجو")
    student_role = models.CharField(max_length=150, default="توسعه‌دهنده فول‌استک", verbose_name="سمت کاری یا دوره گذرانده شده")
    avatar_initials = models.CharField(max_length=10, blank=True, verbose_name="حروف اختصاری آواتار")
    comment = models.TextField(verbose_name="متن نظر یا تجربه استخدام")
    rating = models.PositiveSmallIntegerField(default=5, verbose_name="امتیاز (۱ تا ۵)")
    order = models.PositiveIntegerField(default=0, verbose_name="ترتیب نمایش")
    is_active = models.BooleanField(default=True, verbose_name="فعال")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت")

    class Meta:
        verbose_name = "نظر دانشجو"
        verbose_name_plural = "نظرات و تجربیات دانشجویان"
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.student_name} ({self.student_role})"


class FAQ(models.Model):
    """
    سوالات متداول (FAQ) داینامیک قابل مدیریت توسط ادمین
    """
    question = models.CharField(max_length=300, verbose_name="پرسش / سوال")
    answer = models.TextField(verbose_name="پاسخ کامل")
    order = models.PositiveIntegerField(default=0, verbose_name="ترتیب نمایش (اولویت)")
    is_active = models.BooleanField(default=True, verbose_name="فعال و نمایش در سایت")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "سوال متداول"
        verbose_name_plural = "سوالات متداول (FAQ)"
        ordering = ["order", "id"]

    def __str__(self):
        return self.question
