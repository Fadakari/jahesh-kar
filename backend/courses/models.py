from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    title = models.CharField(max_length=100, verbose_name="عنوان دسته‌بندی")
    slug = models.SlugField(max_length=120, unique=True, allow_unicode=True, verbose_name="نامک (Slug)")
    icon = models.CharField(max_length=50, default="BookOpen", blank=True, verbose_name="نام آیکون")
    description = models.TextField(blank=True, verbose_name="توضیحات دسته‌بندی")

    class Meta:
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"
        ordering = ["title"]

    def __str__(self):
        return self.title


class Course(models.Model):
    LEVEL_CHOICES = [
        ("all", "همه سطوح"),
        ("beginner", "مقدماتی"),
        ("intermediate", "متوسط"),
        ("advanced", "پیشرفته"),
    ]

    title = models.CharField(max_length=200, verbose_name="عنوان دوره")
    slug = models.SlugField(max_length=220, unique=True, allow_unicode=True, verbose_name="نامک یکتا (Slug)")
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="courses",
        verbose_name="دسته‌بندی"
    )
    short_description = models.CharField(max_length=300, verbose_name="خلاصه دوره (یک خطی)")
    description = models.TextField(verbose_name="توضیحات جامع دوره")
    
    # مدرس
    instructor_name = models.CharField(max_length=120, default="استاد آواز آموز", verbose_name="نام مدرس")
    instructor_title = models.CharField(max_length=150, default="متخصص و توسعه‌دهنده ارشد", blank=True, verbose_name="عنوان یا تخصص مدرس")
    instructor_bio = models.TextField(blank=True, verbose_name="بیوگرافی کوتاه مدرس")
    instructor_avatar = models.ImageField(upload_to="instructors/", null=True, blank=True, verbose_name="تصویر مدرس")

    # قیمت و تخفیف
    price = models.PositiveIntegerField(default=0, verbose_name="قیمت اصلی (تومان) - صفر یعنی رایگان")
    discount_price = models.PositiveIntegerField(null=True, blank=True, verbose_name="قیمت با تخفیف (تومان)")
    
    # مشخصات فنی و آماری
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="all", verbose_name="سطح آموزش")
    duration = models.CharField(max_length=50, default="۱۰ ساعت", verbose_name="طول دوره (مثلا: ۱۲ ساعت)")
    students_count = models.PositiveIntegerField(default=0, verbose_name="تعداد دانشجویان")
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0, verbose_name="امتیاز دوره")

    # تصاویر و ویدیو معرفی (معرفی می‌تواند هم فایل آپلودی باشد و هم لینک مستقیم)
    cover_image = models.ImageField(upload_to="courses/covers/", null=True, blank=True, verbose_name="تصویر کاور دوره")
    cover_image_url = models.URLField(max_length=500, blank=True, verbose_name="لینک عکس کاور (اختیاری اگر آپلود نشد)")
    intro_video_file = models.FileField(upload_to="courses/intros/", null=True, blank=True, verbose_name="آپلود فایل ویدیو معرفی")
    intro_video_url = models.CharField(max_length=500, blank=True, verbose_name="لینک ویدیو معرفی (آروان، هاست دانلود یا مستقیم)")

    # نکات کلیدی
    what_you_will_learn = models.TextField(blank=True, verbose_name="آنچه در این دوره یاد می‌گیرید (هر مورد در یک خط)")
    prerequisites = models.TextField(blank=True, verbose_name="پیش‌نیازهای دوره")

    # وضعیت
    is_published = models.BooleanField(default=True, verbose_name="منتشر شده")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="آخرین بروزرسانی")

    class Meta:
        verbose_name = "دوره آموزشی"
        verbose_name_plural = "دوره‌های آموزشی"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    @property
    def final_price(self):
        if self.discount_price and self.discount_price > 0 and self.discount_price < self.price:
            return self.discount_price
        return self.price

    @property
    def is_free(self):
        return self.price == 0

    @property
    def effective_cover(self):
        if self.cover_image:
            return self.cover_image.url
        return self.cover_image_url or ""

    @property
    def effective_intro_video(self):
        if self.intro_video_file:
            return self.intro_video_file.url
        return self.intro_video_url or ""

    @property
    def total_lessons_count(self):
        return self.lessons.count()


class Section(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="sections", verbose_name="دوره")
    title = models.CharField(max_length=200, verbose_name="عنوان فصل / بخش")
    order = models.PositiveIntegerField(default=1, verbose_name="ترتیب فصل")

    class Meta:
        verbose_name = "فصل دوره"
        verbose_name_plural = "فصل‌های دوره"
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons", verbose_name="دوره")
    section = models.ForeignKey(
        Section,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="lessons",
        verbose_name="فصل مربوطه (اختیاری)"
    )
    title = models.CharField(max_length=200, verbose_name="عنوان جلسه / ویدیو")
    order = models.PositiveIntegerField(default=1, verbose_name="ترتیب جلسه")
    duration = models.CharField(max_length=30, default="10:00", verbose_name="مدت زمان (مثلا: 15:30)")
    
    # ویدیو: آپلود مستقیم یا لینک بیرونی
    video_file = models.FileField(upload_to="courses/videos/", null=True, blank=True, verbose_name="آپلود فایل ویدیو جلسه")
    video_url = models.CharField(max_length=500, blank=True, verbose_name="لینک مستقیم ویدیو (هاست دانلود یا CDN)")
    
    # پیش‌نمایش رایگان (آیا برای عموم باز است؟)
    is_free_preview = models.BooleanField(default=False, verbose_name="پیش‌نمایش رایگان (بدون نیاز به خرید)")

    description = models.TextField(blank=True, verbose_name="توضیحات و نکات این جلسه")
    
    # فایل‌های ضمیمه (اسلاید، سورس‌کد، پی‌دی‌اف)
    attachment_file = models.FileField(upload_to="courses/attachments/", null=True, blank=True, verbose_name="آپلود فایل ضمیمه (زیپ یا PDF)")
    attachment_url = models.URLField(max_length=500, blank=True, verbose_name="لینک دانلود فایل ضمیمه")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "جلسه آموزشی"
        verbose_name_plural = "جلسات آموزشی"
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.course.title} - جلسه {self.order}: {self.title}"

    @property
    def effective_video_url(self):
        if self.video_file:
            return self.video_file.url
        return self.video_url or ""

    @property
    def effective_attachment_url(self):
        if self.attachment_file:
            return self.attachment_file.url
        return self.attachment_url or ""
