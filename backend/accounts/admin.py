from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, PhoneOTP


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ["username", "full_name", "phone_number", "is_staff", "is_verified", "date_joined"]
    list_filter = ["is_staff", "is_superuser", "is_verified", "is_active"]
    search_fields = ["username", "full_name", "phone_number", "email"]
    ordering = ["-date_joined"]
    fieldsets = BaseUserAdmin.fieldsets + (
        ("اطلاعات تکمیلی آواز آموز", {
            "fields": ("phone_number", "full_name", "avatar", "is_verified"),
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("اطلاعات تکمیلی", {
            "fields": ("phone_number", "full_name", "is_verified"),
        }),
    )


@admin.register(PhoneOTP)
class PhoneOTPAdmin(admin.ModelAdmin):
    list_display = ["phone_number", "code", "created_at", "expires_at", "is_used"]
    list_filter = ["is_used", "created_at"]
    search_fields = ["phone_number", "code"]
    readonly_fields = ["phone_number", "code", "created_at", "expires_at", "is_used"]
