from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Category, Course, Lesson
from .serializers import CategorySerializer, CourseListSerializer, CourseDetailSerializer
from orders.models import Enrollment


class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class CourseListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        courses = Course.objects.filter(is_published=True)

        # Filter by Category slug
        category_slug = request.query_params.get("category")
        if category_slug:
            courses = courses.filter(category__slug=category_slug)

        # Search in title, description, instructor_name
        search = request.query_params.get("q")
        if search:
            courses = courses.filter(
                Q(title__icontains=search) |
                Q(short_description__icontains=search) |
                Q(description__icontains=search) |
                Q(instructor_name__icontains=search)
            )

        # Filter by Level
        level = request.query_params.get("level")
        if level and level != "all":
            courses = courses.filter(level=level)

        # Filter by Price (free or paid)
        price_filter = request.query_params.get("price")
        if price_filter == "free":
            courses = courses.filter(price=0)
        elif price_filter == "paid":
            courses = courses.filter(price__gt=0)

        serializer = CourseListSerializer(courses, many=True, context={"request": request})
        return Response(serializer.data)


class CourseDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        course = get_object_or_404(Course, slug=slug, is_published=True)
        serializer = CourseDetailSerializer(course, context={"request": request})
        return Response(serializer.data)


class LessonWatchView(APIView):
    """
    Returns full lesson data and streaming video URL.
    Checks whether the user has access (free preview or purchased).
    """
    permission_classes = [AllowAny]

    def get(self, request, course_slug, lesson_id):
        course = get_object_or_404(Course, slug=course_slug, is_published=True)
        lesson = get_object_or_404(Lesson, id=lesson_id, course=course)

        # Check access
        has_access = False
        if lesson.is_free_preview:
            has_access = True
        elif request.user.is_authenticated:
            if request.user.is_staff:
                has_access = True
            else:
                has_access = Enrollment.objects.filter(user=request.user, course=course).exists()

        if not has_access:
            return Response(
                {
                    "error": "دسترسی غیرمجاز. برای مشاهده این جلسه باید دوره را تهیه کنید.",
                    "requires_purchase": True,
                    "lesson_title": lesson.title,
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Find previous and next lessons
        all_lessons = list(course.lessons.all().order_by("order", "id"))
        current_index = -1
        for idx, l in enumerate(all_lessons):
            if l.id == lesson.id:
                current_index = idx
                break

        prev_lesson_id = all_lessons[current_index - 1].id if current_index > 0 else None
        next_lesson_id = all_lessons[current_index + 1].id if current_index < len(all_lessons) - 1 else None

        video_url = lesson.effective_video_url
        if video_url and video_url.startswith("/media/"):
            video_url = request.build_absolute_uri(video_url)

        attachment_url = lesson.effective_attachment_url
        if attachment_url and attachment_url.startswith("/media/"):
            attachment_url = request.build_absolute_uri(attachment_url)

        return Response({
            "id": lesson.id,
            "title": lesson.title,
            "order": lesson.order,
            "duration": lesson.duration,
            "description": lesson.description,
            "video_url": video_url,
            "attachment_url": attachment_url,
            "is_free_preview": lesson.is_free_preview,
            "prev_lesson_id": prev_lesson_id,
            "next_lesson_id": next_lesson_id,
            "course_title": course.title,
            "course_slug": course.slug,
        })
