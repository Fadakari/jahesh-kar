from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from courses.models import Course
from .models import Order, Enrollment
from .serializers import OrderSerializer, EnrollmentSerializer


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        course_id = request.data.get("course_id")
        if not course_id:
            return Response({"error": "شناسه دوره الزامی است."}, status=status.HTTP_400_BAD_REQUEST)

        course = get_object_or_404(Course, id=course_id, is_published=True)

        # Check if already enrolled
        if Enrollment.objects.filter(user=request.user, course=course).exists():
            return Response({
                "already_enrolled": True,
                "message": "شما قبلا در این دوره ثبت نام کرده‌اید.",
                "course_slug": course.slug,
            }, status=status.HTTP_200_OK)

        with transaction.atomic():
            order = Order.create_order(user=request.user, course=course)
            # In simulation / direct enrollment, mark order completed
            order.status = "completed"
            order.save()

            enrollment = Enrollment.objects.create(
                user=request.user,
                course=course,
                order=order
            )

            # Update student count
            course.students_count += 1
            course.save(update_fields=["students_count"])

        return Response({
            "success": True,
            "message": "ثبت نام در دوره با موفقیت انجام شد!",
            "tracking_code": order.tracking_code,
            "course_title": course.title,
            "course_slug": course.slug,
            "enrolled_at": enrollment.enrolled_at,
        }, status=status.HTTP_201_CREATED)


class MyCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user).select_related("course", "course__category")
        serializer = EnrollmentSerializer(enrollments, many=True, context={"request": request})
        return Response(serializer.data)


class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).select_related("course")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
