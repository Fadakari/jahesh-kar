from rest_framework import serializers
from .models import Category, Course, Section, Lesson
from orders.models import Enrollment


class CategorySerializer(serializers.ModelSerializer):
    courses_count = serializers.IntegerField(source="courses.count", read_only=True)

    class Meta:
        model = Category
        fields = ["id", "title", "slug", "icon", "description", "courses_count"]


class SimpleLessonSerializer(serializers.ModelSerializer):
    has_access = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "order",
            "duration",
            "is_free_preview",
            "has_access",
            "video_url",
            "attachment_url",
            "description",
        ]

    def get_has_access(self, obj):
        request = self.context.get("request")
        if obj.is_free_preview:
            return True
        if request and request.user.is_authenticated:
            if request.user.is_staff:
                return True
            return Enrollment.objects.filter(user=request.user, course=obj.course).exists()
        return False

    def get_video_url(self, obj):
        if self.get_has_access(obj):
            request = self.context.get("request")
            url = obj.effective_video_url
            if url and url.startswith("/media/") and request:
                return request.build_absolute_uri(url)
            return url
        return ""

    def get_attachment_url(self, obj):
        if self.get_has_access(obj):
            request = self.context.get("request")
            url = obj.effective_attachment_url
            if url and url.startswith("/media/") and request:
                return request.build_absolute_uri(url)
            return url
        return ""


class SectionSerializer(serializers.ModelSerializer):
    lessons = SimpleLessonSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = ["id", "title", "order", "lessons"]


class CourseListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    final_price = serializers.IntegerField(read_only=True)
    is_free = serializers.BooleanField(read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    lessons_count = serializers.IntegerField(source="total_lessons_count", read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    is_sales_enabled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "short_description",
            "instructor_name",
            "instructor_title",
            "price",
            "discount_price",
            "final_price",
            "is_free",
            "level",
            "duration",
            "students_count",
            "rating",
            "cover_image_url",
            "lessons_count",
            "is_enrolled",
            "is_sales_enabled",
        ]

    def get_is_sales_enabled(self, obj):
        if obj.is_free:
            return True
        from orders.models import PaymentGatewaySetting
        return PaymentGatewaySetting.get_active_setting().is_sales_enabled

    def get_cover_image_url(self, obj):
        request = self.context.get("request")
        url = obj.effective_cover
        if url and url.startswith("/media/") and request:
            return request.build_absolute_uri(url)
        return url

    def get_is_enrolled(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(user=request.user, course=obj).exists()
        return False


class CourseDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    sections = SectionSerializer(many=True, read_only=True)
    direct_lessons = serializers.SerializerMethodField()
    final_price = serializers.IntegerField(read_only=True)
    is_free = serializers.BooleanField(read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    intro_video_url = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    is_sales_enabled = serializers.SerializerMethodField()
    lessons_count = serializers.IntegerField(source="total_lessons_count", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "short_description",
            "description",
            "instructor_name",
            "instructor_title",
            "instructor_bio",
            "price",
            "discount_price",
            "final_price",
            "is_free",
            "level",
            "duration",
            "students_count",
            "rating",
            "cover_image_url",
            "intro_video_url",
            "what_you_will_learn",
            "prerequisites",
            "sections",
            "direct_lessons",
            "lessons_count",
            "is_enrolled",
            "is_sales_enabled",
            "created_at",
            "updated_at",
        ]

    def get_is_sales_enabled(self, obj):
        if obj.is_free:
            return True
        from orders.models import PaymentGatewaySetting
        return PaymentGatewaySetting.get_active_setting().is_sales_enabled

    def get_cover_image_url(self, obj):
        request = self.context.get("request")
        url = obj.effective_cover
        if url and url.startswith("/media/") and request:
            return request.build_absolute_uri(url)
        return url

    def get_intro_video_url(self, obj):
        request = self.context.get("request")
        url = obj.effective_intro_video
        if url and url.startswith("/media/") and request:
            return request.build_absolute_uri(url)
        return url

    def get_is_enrolled(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(user=request.user, course=obj).exists()
        return False

    def get_direct_lessons(self, obj):
        # Lessons that don't belong to any section
        standalone_lessons = obj.lessons.filter(section__isnull=True)
        return SimpleLessonSerializer(standalone_lessons, many=True, context=self.context).data
