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
                    "title": "تنظیمات درگاه پرداخت جهش کار",
                    "gateway_provider": "simulation",
                    "is_active": True,
                }
            )
        return setting


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
    amount = models.PositiveIntegerField(verbose_name="مبلغ پرداختی (تومان)")
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
    def create_order(cls, user, course):
        tracking_code = "JK-" + uuid.uuid4().hex[:8].upper()
        amount = course.final_price
        order = cls.objects.create(
            user=user,
            course=course,
            amount=amount,
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
