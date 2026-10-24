import random
import string
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta


class User(AbstractUser):
    phone_number = models.CharField(
        max_length=15,
        unique=True,
        null=True,
        blank=True,
        verbose_name="شماره موبایل"
    )
    full_name = models.CharField(
        max_length=150,
        blank=True,
        verbose_name="نام و نام خانوادگی"
    )
    avatar = models.ImageField(
        upload_to="avatars/",
        null=True,
        blank=True,
        verbose_name="تصویر پروفایل"
    )
    is_verified = models.BooleanField(
        default=False,
        verbose_name="تایید شده"
    )

    class Meta:
        verbose_name = "کاربر"
        verbose_name_plural = "کاربران"

    def __str__(self):
        return self.full_name or self.phone_number or self.username or f"User-{self.id}"


class PhoneOTP(models.Model):
    phone_number = models.CharField(max_length=15, db_index=True, verbose_name="شماره موبایل")
    code = models.CharField(max_length=6, verbose_name="کد تایید")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="زمان ایجاد")
    expires_at = models.DateTimeField(verbose_name="زمان انقضا")
    is_used = models.BooleanField(default=False, verbose_name="استفاده شده")

    class Meta:
        verbose_name = "کد اعتبارسنجی پیامکی"
        verbose_name_plural = "کدهای اعتبارسنجی پیامکی"
        ordering = ["-created_at"]

    @classmethod
    def generate_otp(cls, phone_number):
        # Generate 5-digit numeric OTP
        code = "".join(random.choices(string.digits, k=5))
        expires = timezone.now() + timedelta(minutes=3)
        otp = cls.objects.create(
            phone_number=phone_number,
            code=code,
            expires_at=expires
        )
        return otp

    def is_valid(self):
        return not self.is_used and timezone.now() <= self.expires_at

    def __str__(self):
        return f"{self.phone_number} - {self.code}"
