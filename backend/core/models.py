from django.db import models


class SiteSetting(models.Model):
    """
    تنظیمات داینامیک متون، لوگو و بخش‌های متغیر سایت
    طراحی شده به صورت Singleton (تنها یک رکورد فعال در سیستم وجود دارد)
    """
    site_title = models.CharField(
        max_length=150,
        default="جهش کار",
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
        default="پلتفرم ورود به بازار کار و اشتغال",
        verbose_name="نشان / بج بالای عنوان اصلی"
    )
    hero_title = models.CharField(
        max_length=255,
        default="شروع یادگیری مهارتی، ورود سریع به بازار کار",
        verbose_name="عنوان اصلی هیرو"
    )
    hero_subtitle = models.TextField(
        default="با دوره‌های تخصصی، پروژه‌محور و مهارت‌های موردنیاز صنعت، مسیر شغلی خود را سریع‌تر و مطمئن‌تر بسازید.",
        verbose_name="توضیحات زیر عنوان هیرو"
    )

    # بخش بنر مزایا و چرا جهش کار؟
    features_badge = models.CharField(
        max_length=150,
        default="چرا یادگیری با جهش کار؟",
        verbose_name="نشان بنر مزایا"
    )
    features_title = models.CharField(
        max_length=255,
        default="از آموزش تئوری خسته شدید؟ اینجا فقط روی پروژه‌های واقعی کار می‌کنید",
        verbose_name="عنوان بنر مزایا"
    )
    features_subtitle = models.TextField(
        default="تمام دوره‌ها متناسب با نیاز روز بازار کار و به همراه پشتیبانی مستقیم مدرسان و فایل‌های سورس‌کد تهیه شده‌اند.",
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
        default="support@jaheshkar.ir",
        verbose_name="ایمیل پشتیبانی"
    )
    telegram_url = models.CharField(
        max_length=255,
        blank=True,
        default="https://t.me/jaheshkar",
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
        default="جهش کار پلتفرم آموزش آنلاین و تخصصی مهارت‌های اشتغال است. ما به شما کمک می‌کنیم تا مسیر تبدیل شدن از یک مبتدی به یک فرد متخصص را در کوتاه‌ترین زمان ممکن طی کنید.",
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
