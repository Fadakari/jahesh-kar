from django.db import models


class SiteSetting(models.Model):
    """
    تنظیمات داینامیک متون، لوگو و بخش‌های متغیر سایت
    طراحی شده به صورت Singleton (تنها یک رکورد فعال در سیستم وجود دارد)
    """
    site_title = models.CharField(
        max_length=150,
        default="آواز آموز",
        verbose_name="عنوان و نام برند سایت"
    )
    logo = models.ImageField(
        upload_to="site/logo/",
        blank=True,
        null=True,
        verbose_name="تصویر لوگوی سایت (PNG, SVG, JPG)"
    )

    # بخش هیرو (Hero) در صفحه اصلی
    hero_badge = models.CharField(
        max_length=150,
        default="نخستین آکادمی تخصصی آموزش مداحی و صداسازی مذهبی",
        verbose_name="نشان / بج بالای عنوان اصلی"
    )
    hero_title = models.CharField(
        max_length=255,
        default="آموزش اصولی مداحی، فن بیان و صداسازی با اساتید برجسته",
        verbose_name="عنوان اصلی هیرو"
    )
    hero_subtitle = models.TextField(
        default="از پرورش و تقویت حنجره تا تسلط بر دستگاه‌های آوازی، مقتل‌خوانی، نوحه‌سرایی و مجلس‌داری را به صورت گام‌به‌گام بیاموزید.",
        verbose_name="توضیحات زیر عنوان هیرو"
    )

    # بخش بنر مزایا و چرا آواز آموز؟
    features_badge = models.CharField(
        max_length=150,
        default="چرا آکادمی آواز آموز؟",
        verbose_name="نشان بنر مزایا"
    )
    features_title = models.CharField(
        max_length=255,
        default="تربیت ذاکران و مداحان اهل‌بیت با اصیل‌ترین متدهای صوتی و معرفتی",
        verbose_name="عنوان بنر مزایا"
    )
    features_subtitle = models.TextField(
        default="آموزش‌های کاربردی متناسب با اصول صداسازی علمی، لحن‌شناسی، ادعیه‌خوانی و آداب نوکری به همراه رفع اشکال و تمرین‌های صوتی هدفمند.",
        verbose_name="توضیحات بنر مزایا"
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
        default="info@avazamouz.ir",
        verbose_name="ایمیل پشتیبانی"
    )
    telegram_url = models.CharField(
        max_length=255,
        blank=True,
        default="https://t.me/avazamouz",
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
        default="آواز آموز، مرجع تخصصی آموزش نوین و اصولی مداحی، صداسازی و فن بیان مذهبی است. رسالت ما توانمندسازی علاقه‌مندان به ستایشگری اهل‌بیت (ع) با تکیه بر علم صداسازی و اصالت‌های سنتی است.",
        verbose_name="متن درباره ما در فوتر"
    )

    # نماد اعتماد الکترونیکی (اینماد)
    enamad_html = models.TextField(
        blank=True,
        default="<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=752620&Code=1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=752620&Code=1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq' alt='' style='cursor:pointer' code='1jpueDeeZQVmkFdGo71Wt4m9mV0YnhDq'></a>",
        verbose_name="کد اینماد (HTML)",
        help_text="کد HTML رسمی اینماد دریافتی از سامانه اینماد"
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
