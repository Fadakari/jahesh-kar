from django.db import models


class SiteSetting(models.Model):
    """
    تنظیمات داینامیک متون، لوگو، آمار و بخش‌های متغیر سایت
    طراحی شده به صورت Singleton (تنها یک رکورد فعال در سیستم وجود دارد)
    به ادمین اجازه می‌دهد شخصیت، حوزه آموزشی و تمامی متون را به دلخواه تنظیم کند.
    """
    site_title = models.CharField(
        max_length=150,
        default="یاسین دهقان",
        verbose_name="عنوان و نام برند سایت"
    )
    academy_scope = models.CharField(
        max_length=150,
        default="آکادمی تخصصی مهارت و یادگیری",
        verbose_name="حوزه و زمینه فعالیت آموزشگاه (مثلاً: آموزش طراحی، زبان‌های خارجی، توسعه فردی، مدیریت و...)"
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
        default="تخفیف ویژه دوره‌ها به مناسبت شروع فصل جدید آکادمی یاسین دهقان - دسترسی نامحدود به ویدیوها و منابع",
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
        default="آکادمی تخصصی یاسین دهقان",
        verbose_name="نشان / بج بالای عنوان اصلی"
    )
    hero_title = models.CharField(
        max_length=255,
        default="یادگیری عمیق، کاربردی و مهارت‌های مورد نیاز بازار کار",
        verbose_name="عنوان اصلی هیرو"
    )
    hero_subtitle = models.TextField(
        default="مسیر یادگیری طراحی شده بر پایه تجربیات عملی و نیازهای واقعی روز؛ بدون اتلاف وقت، مستقیم مهارت‌های اصلی را بیاموزید و به کار ببندید.",
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

    # المان بصری و کارت معرفی هیرو (سمت چپ هیرو)
    hero_image = models.ImageField(
        upload_to="site/hero/",
        blank=True,
        null=True,
        verbose_name="تصویر اختصاصی بنر هیرو (اختیاری - در صورت آپلود، به جای کارت متنی نمایش می‌یابد)"
    )
    hero_preview_badge = models.CharField(
        max_length=80,
        default="متدولوژی اختصاصی آموزش",
        verbose_name="برچسب کارت شاخص هیرو"
    )
    hero_preview_title = models.CharField(
        max_length=150,
        default="آموزش کاربردی با پشتیبانی مستقیم مدرس",
        verbose_name="عنوان کارت شاخص هیرو"
    )
    hero_preview_subtitle = models.TextField(
        default="جلسات ویدیویی گام‌به‌گام با دسترسی همیشگی، تمرین‌های عملی و رفع اشکال مستمر.",
        verbose_name="توضیح کارت شاخص هیرو"
    )
    hero_tagline_1 = models.CharField(
        max_length=100,
        default="سرفصل‌های کاربردی و منطبق با نیاز روز",
        verbose_name="نکته برجسته اول در کارت هیرو"
    )
    hero_tagline_2 = models.CharField(
        max_length=100,
        default="پشتیبانی و رفع اشکال اختصاصی",
        verbose_name="نکته برجسته دوم در کارت هیرو"
    )
    hero_tagline_3 = models.CharField(
        max_length=100,
        default="دسترسی نامحدود و همیشگی به ویدیوها",
        verbose_name="نکته برجسته سوم در کارت هیرو"
    )

    # آمار و ارقام کلیدی (Trust Metrics Strip)
    stat_1_number = models.CharField(max_length=50, default="+۱۲,۰۰۰", verbose_name="عدد آمار اول")
    stat_1_label = models.CharField(max_length=120, default="دانشجوی فعال و رضایتمند", verbose_name="عنوان آمار اول")
    stat_2_number = models.CharField(max_length=50, default="+۸۵ ساعت", verbose_name="عدد آمار دوم")
    stat_2_label = models.CharField(max_length=120, default="آموزش کاملاً کاربردی و مهارتی", verbose_name="عنوان آمار دوم")
    stat_3_number = models.CharField(max_length=50, default="۹۸.۸٪", verbose_name="عدد آمار سوم")
    stat_3_label = models.CharField(max_length=120, default="رضایت دانشجویان از کیفیت تدریس", verbose_name="عنوان آمار سوم")
    stat_4_number = models.CharField(max_length=50, default="۱۰۰٪", verbose_name="عدد آمار چهارم")
    stat_4_label = models.CharField(max_length=120, default="آمادگی برای ورود به بازار کار و ارتقای شغلی", verbose_name="عنوان آمار چهارم")

    # بخش بنر مزایا و چرا این آموزشگاه؟
    features_badge = models.CharField(
        max_length=150,
        default="چرا آکادمی یاسین دهقان؟",
        verbose_name="نشان بنر مزایا"
    )
    features_title = models.CharField(
        max_length=255,
        default="ویژگی‌های متمایز دوره‌های آموزشی ما چیست؟",
        verbose_name="عنوان بخش مزایا"
    )
    features_subtitle = models.TextField(
        default="ما به جای آموزش‌های کش‌دار و تئوری‌های بی‌استفاده، روی مهارت‌هایی تمرکز می‌کنیم که مستقیماً در کار و فعالیت حرفه‌ای به آنها نیاز دارید.",
        verbose_name="توضیحات بخش مزایا"
    )

    # بخش گام‌ها و متدولوژی یادگیری
    steps_active = models.BooleanField(
        default=True,
        verbose_name="نمایش بخش گام‌های یادگیری"
    )
    steps_badge = models.CharField(
        max_length=100,
        default="مسیر یادگیری تا تسلط",
        verbose_name="نشان بخش گام‌ها"
    )
    steps_title = models.CharField(
        max_length=200,
        default="مسیر گام‌به‌گام یادگیری و رسیدن به هدف",
        verbose_name="عنوان بخش گام‌ها"
    )
    steps_subtitle = models.TextField(
        default="این همان مسیری است که با برداشتن هر گام، یک سطح به تسلط کامل نزدیک‌تر می‌شوید.",
        verbose_name="توضیحات بخش گام‌ها"
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
        default="آکادمی یاسین دهقان مرجع تخصصی دوره‌های مهارتی و کاربردی برای ارتقای توانمندی‌ها و ورود به بازار کار است. ما فاصله بین یادگیری تئوری و اجرای عملی را به حداقل رسانده‌ایم.",
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
    ویژگی‌ها و مزیت‌های رقابتی آموزشگاه (Bento Grid)
    ادمین می‌تواند متناسب با حوزه آموزشی، کارت‌های جدید اضافه یا ویرایش کند.
    """
    title = models.CharField(max_length=150, verbose_name="عنوان مزیت")
    description = models.TextField(verbose_name="توضیح کوتاه و دقیق")
    badge = models.CharField(max_length=60, blank=True, verbose_name="برچسب کوچک بالای کارت (مثلا: اختصاصی / پشتیبانی)")
    tag = models.CharField(max_length=100, blank=True, verbose_name="تگ یا ویژگی کلیدی")
    icon_type = models.CharField(
        max_length=50,
        default="practical",
        choices=[
            ("practical", "کاربردی و تمرین‌محور"),
            ("mentor", "پشتیبانی و رفع اشکال مستقیم"),
            ("star", "کیفیت و استاندارد بالا"),
            ("update", "دسترسی همیشگی و آپدیت رایگان"),
            ("speed", "مسیر سریع و بدون حاشیه"),
            ("shield", "تضمین کیفیت محتوا"),
            ("certificate", "آمادگی بازار کار و رزومه"),
            ("community", "شبکه و جامعه همراهان"),
            ("code", "تخصصی و فنی"),
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


class LearningStep(models.Model):
    """
    گام‌های نقشه راه آموزشی (۳ الی ۴ گام متدولوژی یادگیری)
    قابل تعریف و ویرایش متناسب با هر نوع موضوع آموزشی
    """
    step_number = models.CharField(max_length=20, default="۰۱", verbose_name="شماره گام (مثلاً: ۰۱)")
    title = models.CharField(max_length=150, verbose_name="عنوان گام")
    description = models.TextField(verbose_name="توضیح کامل گام آموزشی")
    badge = models.CharField(max_length=60, blank=True, verbose_name="برچسب یا خروجی این گام")
    order = models.PositiveIntegerField(default=0, verbose_name="ترتیب نمایش")
    is_active = models.BooleanField(default=True, verbose_name="فعال")

    class Meta:
        verbose_name = "گام یادگیری (متدولوژی)"
        verbose_name_plural = "گام‌های مسیر یادگیری (Methodology)"
        ordering = ["order", "id"]

    def __str__(self):
        return f"گام {self.step_number}: {self.title}"


class Testimonial(models.Model):
    """
    نظرات و تجربیات واقعی دانشجویان
    """
    student_name = models.CharField(max_length=120, verbose_name="نام و نام خانوادگی دانشجو")
    student_role = models.CharField(max_length=150, default="دانشجوی دوره جامع", verbose_name="دوره گذرانده شده یا سمت کاری")
    avatar_initials = models.CharField(max_length=10, blank=True, verbose_name="حروف اختصاری آواتار")
    comment = models.TextField(verbose_name="متن نظر یا تجربه دانشجو")
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
