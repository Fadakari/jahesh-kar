from django.contrib import admin
from .models import Order, Enrollment, PaymentGatewaySetting, Coupon


@admin.register(PaymentGatewaySetting)
class PaymentGatewaySettingAdmin(admin.ModelAdmin):
    list_display = ["title", "is_sales_enabled", "gateway_provider", "is_active", "has_merchant_display", "is_sandbox", "updated_at"]
    list_editable = ["is_sales_enabled", "gateway_provider", "is_active", "is_sandbox"]
    fieldsets = (
        ("وضعیت کلی فروش دوره‌ها", {
            "fields": ("is_sales_enabled",),
            "description": "اگر می‌خواهید فروش دوره‌های پولی تا زمان اتصال درگاه غیرفعال باشد، این تیک را بردارید. دوره‌های رایگان در هر صورت قابل ثبت‌نام خواهند بود."
        }),
        ("انتخاب و وضعیت درگاه پرداخت", {
            "fields": ("title", "gateway_provider", "is_active"),
            "description": "برای شروع فوری، گزینه «شبیه‌ساز تستی» فعال است. هر زمان که درگاه زرین‌پال یا سایر درگاه‌ها تایید شد، کافیست نوع درگاه را روی زرین‌پال بگذارید و مرچنت کد را وارد کنید."
        }),
        ("مشخصات اتصال درگاه (API & Merchant)", {
            "fields": ("merchant_id", "is_sandbox", "callback_url"),
            "description": "مرچنت کد ۳۶ رقمی زرین‌پال را اینجا وارد کنید. نیازی به دستکاری کد پروژه نیست."
        }),
    )

    def has_merchant_display(self, obj):
        return bool(obj.merchant_id)
    has_merchant_display.boolean = True
    has_merchant_display.short_description = "دارای مرچنت کد"


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = [
        "code",
        "discount_percent_display",
        "usage_display",
        "course",
        "is_active",
        "valid_until",
        "created_at",
    ]
    list_filter = ["is_active", "course", "created_at"]
    search_fields = ["code", "description", "course__title"]
    fieldsets = (
        ("اطلاعات اصلی کد تخفیف", {
            "fields": ("code", "discount_percent", "is_active", "description"),
            "description": "کد تخفیف را وارد کنید (حروف کوچک خودکار بزرگ می‌شوند) و درصد تخفیف بین ۱ تا ۱۰۰ را مشخص کنید."
        }),
        ("محدودیت تعداد استفاده", {
            "fields": ("max_uses", "used_count"),
            "description": "اگر می‌خواهید این کد بدون محدودیت تعداد استفاده باشد، فیلد «حداکثر تعداد استفاده مجاز» را کاملاً خالی بگذارید."
        }),
        ("محدودیت دوره و تاریخ اعتبار (اختیاری)", {
            "fields": ("course", "valid_from", "valid_until"),
            "description": "اگر می‌خواهید این کد روی تمام دوره‌ها معتبر باشد دوره را خالی بگذارید. تاریخ‌های شروع و پایان نیز اختیاری هستند."
        }),
    )
    readonly_fields = ["used_count"]

    def discount_percent_display(self, obj):
        return f"{obj.discount_percent}٪"
    discount_percent_display.short_description = "درصد تخفیف"

    def usage_display(self, obj):
        if obj.max_uses is None:
            return f"{obj.used_count} بار (نامحدود)"
        remaining = max(0, obj.max_uses - obj.used_count)
        return f"{obj.used_count} از {obj.max_uses} ({remaining} باقی‌مانده)"
    usage_display.short_description = "میزان استفاده"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "tracking_code",
        "user",
        "course",
        "original_amount_display",
        "discount_display",
        "amount_display",
        "status",
        "ref_id",
        "created_at",
    ]
    list_filter = ["status", "created_at", "coupon"]
    search_fields = [
        "tracking_code",
        "ref_id",
        "authority",
        "user__username",
        "user__phone_number",
        "course__title",
        "coupon__code",
    ]
    readonly_fields = ["tracking_code", "authority", "ref_id", "card_pan", "created_at"]

    def original_amount_display(self, obj):
        return f"{obj.original_amount:,} تومان"
    original_amount_display.short_description = "مبلغ اولیه"

    def discount_display(self, obj):
        if obj.coupon:
            return f"{obj.discount_amount:,} تومان ({obj.coupon.code})"
        return "-"
    discount_display.short_description = "تخفیف"

    def amount_display(self, obj):
        return f"{obj.amount:,} تومان"
    amount_display.short_description = "مبلغ پرداختی"


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ["user", "course", "order", "enrolled_at"]
    list_filter = ["enrolled_at", "course"]
    search_fields = ["user__username", "user__phone_number", "course__title"]
    readonly_fields = ["enrolled_at"]
