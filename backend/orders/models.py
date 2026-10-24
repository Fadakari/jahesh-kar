import uuid
from django.db import models
from django.conf import settings
from courses.models import Course


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
