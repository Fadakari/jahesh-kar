from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Course, Section, Lesson


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ["title", "section", "order", "duration", "video_file", "video_url", "is_free_preview"]
    show_change_link = True
    verbose_name = "جلسه آموزشی"
    verbose_name_plural = "جلسات آموزشی این دوره (مستقیم یا فصلی)"


class SectionInline(admin.StackedInline):
    model = Section
    extra = 1
    fields = ["title", "order"]
    show_change_link = True
    verbose_name = "فصل / سرفصل"
    verbose_name_plural = "فصل‌های دوره"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "icon", "courses_count_display"]
    search_fields = ["title", "slug"]
    prepopulated_fields = {"slug": ("title",)}

    def courses_count_display(self, obj):
        return obj.courses.count()
    courses_count_display.short_description = "تعداد دوره‌ها"


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "category",
        "instructor_name",
        "price_display",
        "level",
        "total_lessons_display",
        "students_count",
        "is_published",
        "created_at"
    ]
    list_filter = ["is_published", "level", "category", "created_at"]
    search_fields = ["title", "short_description", "description", "instructor_name"]
    prepopulated_fields = {"slug": ("title",)}
    inlines = [SectionInline, LessonInline]

    fieldsets = (
        ("اطلاعات اصلی دوره", {
            "fields": ("title", "slug", "category", "short_description", "description", "is_published")
        }),
        ("مدرس و مربی", {
            "fields": ("instructor_name", "instructor_title", "instructor_bio", "instructor_avatar")
        }),
        ("قیمت‌گذاری و تخفیف", {
            "fields": ("price", "discount_price"),
            "description": "قیمت را به تومان وارد کنید. در صورتی که دوره رایگان است، عدد صفر را وارد کنید."
        }),
        ("مشخصات و آمار دوره", {
            "fields": ("level", "duration", "students_count", "rating")
        }),
        ("رسانه‌ها و ویدیوی معرفی (تیزر)", {
            "fields": (
                "cover_image",
                "cover_image_url",
                "intro_video_file",
                "intro_video_url"
            ),
            "description": "می‌توانید ویدیوی تیزر یا معرفی را مستقیم آپلود کنید یا آدرس هاست دانلود/سرویس CDN را قرار دهید."
        }),
        ("جزئیات آموزشی و سرفصل‌ها", {
            "fields": ("what_you_will_learn", "prerequisites"),
            "description": "هر مورد از مهارت‌های کسب شده را در یک خط بنویسید."
        }),
    )

    def price_display(self, obj):
        if obj.is_free:
            return format_html('<span style="color: green; font-weight: bold;">رایگان</span>')
        if obj.discount_price:
            return format_html(
                '<span style="text-decoration: line-through; color: #888;">{} تومان</span> '
                '<b style="color: #e53e3e;">{} تومان</b>',
                f"{obj.price:,}",
                f"{obj.discount_price:,}"
            )
        return f"{obj.price:,} تومان"
    price_display.short_description = "قیمت"

    def total_lessons_display(self, obj):
        return obj.lessons.count()
    total_lessons_display.short_description = "تعداد ویدیوها"


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ["title", "course", "order", "lessons_count_display"]
    list_filter = ["course"]
    search_fields = ["title", "course__title"]
    inlines = [LessonInline]

    def lessons_count_display(self, obj):
        return obj.lessons.count()
    lessons_count_display.short_description = "تعداد ویدیوها"


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ["title", "course", "section", "order", "duration", "is_free_preview", "has_video_display", "created_at"]
    list_filter = ["course", "is_free_preview", "section"]
    search_fields = ["title", "course__title", "description"]
    ordering = ["course", "order"]

    fieldsets = (
        ("مشخصات درس", {
            "fields": ("course", "section", "title", "order", "duration", "description", "is_free_preview")
        }),
        ("ویدیوی آموزشی", {
            "fields": ("video_file", "video_url"),
            "description": "می‌توانید فایل mp4 ویدیو را مستقیما آپلود کنید یا لینک هاست دانلود/آروان را قرار دهید."
        }),
        ("فایل‌های ضمیمه و منابع", {
            "fields": ("attachment_file", "attachment_url"),
            "description": "اختیاری: فایل زیپ سورس‌کد، اسلاید، پی‌دی‌اف تمرین"
        }),
    )

    def has_video_display(self, obj):
        if obj.video_file:
            return format_html('<span style="color: green;">آپلود شده در سرور</span>')
        elif obj.video_url:
            return format_html('<span style="color: blue;">لینک خارجی / CDN</span>')
        return format_html('<span style="color: red;">بدون ویدیو</span>')
    has_video_display.short_description = "وضعیت ویدیو"
