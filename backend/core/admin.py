from django.contrib import admin
from django.utils.html import format_html
from .models import SiteSetting, FAQ


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ["site_title", "logo_preview", "contact_phone", "contact_email", "updated_at"]

    fieldsets = (
        ("هویت و برندینگ سایت", {
            "fields": ("site_title", "logo", "logo_preview_large"),
            "description": "می‌توانید نام برند و تصویر لوگوی سایت (با فرمت PNG با پس‌زمینه شفاف یا SVG) را اینجا آپلود کنید."
        }),
        ("بخش هیرو (Hero) در بالای صفحه نخست", {
            "fields": ("hero_badge", "hero_title", "hero_subtitle"),
            "description": "عنوانی که کاربر در اولین لحظه ورود به سایت می‌بیند."
        }),
        ("بخش بنر مزایا و معرفی ویژگی‌ها", {
            "fields": ("features_badge", "features_title", "features_subtitle"),
            "description": "متن بنر تیره رنگ در میانه صفحه اصلی."
        }),
        ("اطلاعات تماس، پشتیبانی و شبکه‌های اجتماعی", {
            "fields": ("contact_phone", "contact_email", "telegram_url", "instagram_url"),
            "description": "این اطلاعات در فوتر و هدر سایت نمایش داده می‌شوند."
        }),
        ("متن درباره ما (فوتر)", {
            "fields": ("footer_about",),
        }),
    )

    readonly_fields = ["logo_preview_large", "updated_at"]

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="height: 30px; object-fit: contain;" />', obj.logo.url)
        return format_html('<span style="color: #999;">لوگوی پیش‌فرض</span>')
    logo_preview.short_description = "پیش‌نمایش لوگو"

    def logo_preview_large(self, obj):
        if obj.logo:
            return format_html(
                '<div style="padding: 10px; background: #f8fafc; border-radius: 12px; display: inline-block;">'
                '<img src="{}" style="max-height: 80px; max-width: 250px; object-fit: contain;" />'
                '</div>',
                obj.logo.url
            )
        return "هنوز لوگویی آپلود نشده است (لوگوی پیش‌فرض جهش کار نمایش داده می‌شود)."
    logo_preview_large.short_description = "لوگوی فعلی"

    def has_add_permission(self, request):
        # Don't allow multiple settings records
        if SiteSetting.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ["question", "order", "is_active", "created_at"]
    list_editable = ["order", "is_active"]
    list_filter = ["is_active", "created_at"]
    search_fields = ["question", "answer"]
    ordering = ["order", "id"]

    fieldsets = (
        ("پرسش و پاسخ", {
            "fields": ("question", "answer", "order", "is_active"),
            "description": "این سوال و پاسخ در بخش سوالات متداول در صفحه اصلی نمایش داده می‌شود."
        }),
    )
