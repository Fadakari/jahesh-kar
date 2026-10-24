from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404, redirect
from django.conf import settings
from courses.models import Course
from .models import Order, Enrollment, PaymentGatewaySetting
from .serializers import OrderSerializer, EnrollmentSerializer
from .payment_service import PaymentGatewayService


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

        # Create Order
        order = Order.create_order(user=request.user, course=course)

        # Request payment through configured gateway
        result = PaymentGatewayService.request_payment(request, order)

        if not result.get("success"):
            return Response({"error": result.get("error", "خطا در اتصال به درگاه پرداخت.")}, status=status.HTTP_400_BAD_REQUEST)

        return Response(result, status=status.HTTP_200_OK if result.get("mode") == "simulation" else status.HTTP_200_OK)


class PaymentVerifyView(APIView):
    """
    دریافت بازگشت کاربر از درگاه پرداخت و هدایت به صفحه نتیجه در فرانت‌اند
    """
    permission_classes = [AllowAny]

    def get(self, request):
        authority = request.query_params.get("Authority") or request.query_params.get("authority")
        status_param = request.query_params.get("Status") or request.query_params.get("status")

        if not authority:
            return redirect("/dashboard?payment=error&message=شناسه_پرداخت_یافت_نشد")

        res = PaymentGatewayService.verify_payment(request, authority, status_param)
        order = res.get("order")

        if res.get("success") and order:
            # هدایت کاربر به داشبورد و نمایش پیام موفقیت با کد رهگیری
            return redirect(f"/dashboard?payment=success&tracking={order.tracking_code}&course={order.course.slug}")
        else:
            course_slug = order.course.slug if order else ""
            return redirect(f"/course/{course_slug}?payment=failed&error={res.get('error', 'پرداخت_ناموفق')}")


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
