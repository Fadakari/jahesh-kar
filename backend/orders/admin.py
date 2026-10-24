from django.contrib import admin
from .models import Order, Enrollment


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["tracking_code", "user", "course", "amount_display", "status", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["tracking_code", "user__username", "user__phone_number", "course__title"]
    readonly_fields = ["tracking_code", "created_at"]

    def amount_display(self, obj):
        return f"{obj.amount:,} تومان"
    amount_display.short_description = "مبلغ"


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ["user", "course", "order", "enrolled_at"]
    list_filter = ["enrolled_at", "course"]
    search_fields = ["user__username", "user__phone_number", "course__title"]
    readonly_fields = ["enrolled_at"]
