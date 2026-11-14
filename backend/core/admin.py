from django.contrib import admin
from django.utils.html import format_html
from .models import SiteSetting, SiteFeature, Testimonial, FAQ


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ["site_title", "logo_preview", "announcement_active", "contact_phone", "updated_at"]

    fieldsets = (
        ("هویت و برندینگ سایت", {
            "fields": ("site_title", "logo", "logo_preview_large"),
            "description": "نام برند و تصویر لوگوی سایت (با فرمت PNG شفاف یا SVG)."
        }),
        ("نوار اعلان و تخفیف ویژه بالای سایت (Notice Banner)", {
            "fields": ("announcement_active", "announcement_badge", "announcement_text", "announcement_link"),
            "description": "نوار باریک متحرک یا ثابت در بالاترین نقطه سایت جهت اطلاع‌رسانی تخفیف‌ها یا اخبار فوری."
        }),
        ("بخش هیرو (Hero) در بالای صفحه نخست", {
            "fields": (
                "hero_badge",
                "hero_title",
                "hero_subtitle",
                ("hero_cta_primary_text", "hero_cta_primary_link"),
                ("hero_cta_secondary_text", "hero_cta_secondary_link"),
            ),
            "description": "تیترها، نشان‌ها و دکمه‌های اقدام‌به‌عمل (Call to Action) در هیرو."
        }),
        ("نوار آمار و ارقام کلیدی (Trust Metrics Strip)", {
            "fields": (
                ("stat_1_number", "stat_1_label"),
                ("stat_2_number", "stat_2_label"),
                ("stat_3_number", "stat_3_label"),
                ("stat_4_number", "stat_4_label"),
            ),
            "description": "آمارهای چشمگیر مانند تعداد دانشجویان، ساعات آموزش، رضایت‌مندی و..."
        }),
        ("بخش بنر مزایا و معرفی ویژگی‌ها", {
            "fields": ("features_badge", "features_title", "features_subtitle"),
            "description": "متن و تیتر سرتیتر بخش مزیت‌های رقابتی در صفحه اصلی."
        }),
        ("اطلاعات تماس، پشتیبانی و شبکه‌های اجتماعی", {
            "fields": ("contact_phone", "contact_email", "telegram_url", "instagram_url"),
            "description": "این اطلاعات در فوتر، هدر و بخش پشتیبانی نمایش داده می‌شوند."
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
                '<div style="padding: 10px; background: #000a4d; border-radius: 12px; display: inline-block;">'
                '<img src="{}" style="max-height: 80px; max-width: 250px; object-fit: contain;" />'
                '</div>',
                obj.logo.url
            )
        return "هنوز لوگویی آپلود نشده است (لوگوی پیش‌فرض یاسین دهقان نمایش داده می‌شود)."
    logo_preview_large.short_description = "لوگوی فعلی"

    def has_add_permission(self, request):
        if SiteSetting.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(SiteFeature)
class SiteFeatureAdmin(admin.ModelAdmin):
    list_display = ["title", "badge", "tag", "icon_type", "order", "is_active"]
    list_editable = ["order", "is_active"]
    list_filter = ["icon_type", "is_active"]
    search_fields = ["title", "description", "badge", "tag"]
    ordering = ["order", "id"]


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["student_name", "student_role", "rating", "order", "is_active", "created_at"]
    list_editable = ["order", "is_active"]
    list_filter = ["rating", "is_active"]
    search_fields = ["student_name", "student_role", "comment"]
    ordering = ["order", "id"]


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ["question", "order", "is_active", "created_at"]
    list_editable = ["order", "is_active"]
    list_filter = ["is_active", "created_at"]
    search_fields = ["question", "answer"]
    ordering = ["order", "id"]
