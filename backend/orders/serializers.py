from rest_framework import serializers
from .models import Order, Enrollment
from courses.serializers import CourseListSerializer


class OrderSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    course_slug = serializers.CharField(source="course.slug", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "tracking_code",
            "course_title",
            "course_slug",
            "amount",
            "status",
            "created_at",
        ]


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ["id", "course", "enrolled_at"]
