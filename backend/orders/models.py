import uuid
from django.db import models
from django.conf import settings
from courses.models import Course


class PaymentGatewaySetting(models.Model):
    GATEWAY_CHOICES = [
        ("simulation", "شبیه‌ساز تستی (فعال فعلی - فعال‌سازی خودکار و رایگان دوره)"),
        ("zarinpal", "درگاه پرداخت زرین‌پال (ZarinPal v4)"),
        ("idpay", "درگاه پرداخت آیدی‌پی (IDPay)"),
        ("zibal", "درگاه پرداخت زیبال (Zibal)"),
    ]

    title = models.CharField(max_length=100, default="تنظیمات درگاه فعال", verbose_name="عنوان تنظیمات")
    is_sales_enabled = models.BooleanField(
        default=False,
        verbose_name="فعال بودن امکان خرید و فروش دوره‌های پولی",
        help_text="اگر این تیک غیرفعال باشد، دکمه‌های خرید در سایت قفل شده و به کاربر پیام می‌دهد که فروش موقتاً تا زمان اتصال درگاه غیرفعال است."
    )
    gateway_provider = models.CharField(
        max_length=30,
        choices=GATEWAY_CHOICES,
        default="simulation",
        verbose_name="نوع درگاه پرداخت"
    )
    is_active = models.BooleanField(default=True, verbose_name="فعال بودن این درگاه")
    merchant_id = models.CharField(
        max_length=150,
        blank=True,
        verbose_name="مرچنت کد یا کلید API درگاه",
        help_text="مرچنت کدی که پس از دریافت درگاه از زرین‌پال، آیدی‌پی یا زیبال دریافت می‌کنید را اینجا وارد کنید."
    )
    is_sandbox = models.BooleanField(
        default=False,
        verbose_name="حالت تستی / سندباکس درگاه",
        help_text="در صورتی که می‌خواهید قبل از فعال‌سازی نهایی در محیط تست پرداخت را آزمایش کنید."
    )
    callback_url = models.CharField(
        max_length=300,
        blank=True,
        verbose_name="آدرس بازگشت سفارشی (Callback URL)",
        help_text="در صورت خالی بودن، به صورت خودکار توسط سیستم به اندپوینت تایید هدایت می‌شود."
    )
    updated_at = models.DateTimeField(auto_now=True, verbose_name="آخرین بروزرسانی")

    class Meta:
        verbose_name = "تنظیمات درگاه پرداخت"
        verbose_name_plural = "تنظیمات درگاه‌های پرداخت"

    def __str__(self):
        return f"{self.get_gateway_provider_display()} - {'فعال' if self.is_active else 'غیرفعال'}"

    @classmethod
    def get_active_setting(cls):
        setting = cls.objects.filter(is_active=True).first()
        if not setting:
            setting, _ = cls.objects.get_or_create(
                id=1,
                defaults={
                    "title": "تنظیمات درگاه پرداخت یاسین دهقان",
                    "gateway_provider": "simulation",
                    "is_active": True,
                }
            )
        return setting


class Coupon(models.Model):
    """
    کدهای تخفیف با امکان تعیین درصد و سقف تعداد استفاده
    """
    code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="کد تخفیف (مثلاً: OFF30 یا NOWRUZ)"
    )
    discount_percent = models.PositiveSmallIntegerField(
        verbose_name="درصد تخفیف (۱ تا ۱۰۰)",
        help_text="عددی بین ۱ تا ۱۰۰ وارد کنید (مثلا ۲۰ برای ۲۰ درصد تخفیف)."
    )
    max_uses = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="حداکثر تعداد استفاده مجاز (اختیاری)",
        help_text="اگر می‌خواهید این کد بدون محدودیت تعداد باشد، این فیلد را خالی بگذارید."
    )
    used_count = models.PositiveIntegerField(
        default=0,
        verbose_name="تعداد دفعات استفاده شده"
    )
    course = models.ForeignKey(
        Course,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="coupons",
        verbose_name="دوره خاص (اختیاری)",
        help_text="اگر می‌خواهید این کد فقط روی یک دوره خاص معتبر باشد؛ در غیر این صورت روی تمامی دوره‌ها کار می‌کند."
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="فعال بودن کد تخفیف"
    )
    valid_from = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="تاریخ شروع اعتبار (اختیاری)"
    )
    valid_until = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="تاریخ پایان اعتبار (اختیاری)"
    )
    description = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="یادداشت مدیر (اختیاری)"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")

    class Meta:
        verbose_name = "کد تخفیف"
        verbose_name_plural = "کدهای تخفیف"
        ordering = ["-created_at"]

    def __str__(self):
        limit = f"حداکثر {self.max_uses} بار" if self.max_uses else "نامحدود"
        return f"{self.code} ({self.discount_percent}٪ - {limit} - مصرف: {self.used_count})"

    def save(self, *args, **kwargs):
        if self.code:
            self.code = self.code.strip().upper()
        super().save(*args, **kwargs)

    def is_valid_for(self, course=None):
        if not self.is_active:
            return False, "این کد تخفیف در حال حاضر غیرفعال است."
        if self.max_uses is not None and self.used_count >= self.max_uses:
            return False, "ظرفیت استفاده از این کد تخفیف به پایان رسیده است."
        from django.utils import timezone
        now = timezone.now()
        if self.valid_from and now < self.valid_from:
            return False, "مهلت استفاده از این کد تخفیف هنوز آغاز نشده است."
        if self.valid_until and now > self.valid_until:
            return False, "مهلت استفاده از این کد تخفیف منقضی شده است."
        if self.course and course and self.course != course:
            return False, f"این کد تخفیف فقط برای دوره «{self.course.title}» معتبر است."
        return True, "کد تخفیف معتبر است."

    def calculate_discount(self, original_price):
        if original_price <= 0:
            return 0, 0
        discount_amount = int((original_price * self.discount_percent) / 100)
        final_price = max(0, original_price - discount_amount)
        return discount_amount, final_price


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "در انتظار پرداخت"),
        ("completed", "پرداخت شده"),
        ("canceled", "لغو شده"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name="کاربر"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name="دوره"
    )
    coupon = models.ForeignKey(
        Coupon,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
        verbose_name="کد تخفیف استفاده شده"
    )
    original_amount = models.PositiveIntegerField(default=0, verbose_name="مبلغ اولیه قبل از تخفیف (تومان)")
    discount_amount = models.PositiveIntegerField(default=0, verbose_name="مبلغ تخفیف اعمال شده (تومان)")
    amount = models.PositiveIntegerField(verbose_name="مبلغ پرداختی نهایی (تومان)")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
        verbose_name="وضعیت سفارش"
    )
    tracking_code = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="کد رهگیری یا تراکنش"
    )
    authority = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        db_index=True,
        verbose_name="شناسه درگاه بانکی (Authority / TrackId)"
    )
    ref_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="شماره ارجاع تراکنش بانکی (RefID)"
    )
    card_pan = models.CharField(
        max_length=30,
        blank=True,
        null=True,
        verbose_name="شماره کارت پرداخت‌کننده (ماسک‌شده)"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت")

    class Meta:
        verbose_name = "سفارش"
        verbose_name_plural = "سفارشات"
        ordering = ["-created_at"]

    def __str__(self):
        return f"سفارش {self.tracking_code} - {self.user} - {self.course.title}"

    @classmethod
    def create_order(cls, user, course, coupon=None):
        tracking_code = "YD-" + uuid.uuid4().hex[:8].upper()
        original_price = course.final_price
        discount_amount = 0
        final_amount = original_price

        if coupon:
            is_valid, _ = coupon.is_valid_for(course)
            if is_valid:
                discount_amount, final_amount = coupon.calculate_discount(original_price)

        order = cls.objects.create(
            user=user,
            course=course,
            coupon=coupon,
            original_amount=original_price,
            discount_amount=discount_amount,
            amount=final_amount,
            status="pending",
            tracking_code=tracking_code
        )
        return order


class Enrollment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="enrollments",
        verbose_name="کاربر"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments",
        verbose_name="دوره"
    )
    order = models.ForeignKey(
        Order,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="enrollment",
        verbose_name="سفارش مرتبط"
    )
    enrolled_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت نام")

    class Meta:
        verbose_name = "ثبت‌نام دوره"
        verbose_name_plural = "ثبت‌نام‌های دوره‌ها"
        unique_together = ["user", "course"]
        ordering = ["-enrolled_at"]

    def __str__(self):
        return f"{self.user} در دوره {self.course.title}"
