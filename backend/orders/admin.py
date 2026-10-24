from django.contrib import admin
from .models import Order, Enrollment, PaymentGatewaySetting


@admin.register(PaymentGatewaySetting)
class PaymentGatewaySettingAdmin(admin.ModelAdmin):
    list_display = ["title", "gateway_provider", "is_active", "has_merchant_display", "is_sandbox", "updated_at"]
    list_editable = ["gateway_provider", "is_active", "is_sandbox"]
    fieldsets = (
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


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["tracking_code", "user", "course", "amount_display", "status", "ref_id", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["tracking_code", "ref_id", "authority", "user__username", "user__phone_number", "course__title"]
    readonly_fields = ["tracking_code", "authority", "ref_id", "card_pan", "created_at"]

    def amount_display(self, obj):
        return f"{obj.amount:,} تومان"
    amount_display.short_description = "مبلغ"


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ["user", "course", "order", "enrolled_at"]
    list_filter = ["enrolled_at", "course"]
    search_fields = ["user__username", "user__phone_number", "course__title"]
    readonly_fields = ["enrolled_at"]
