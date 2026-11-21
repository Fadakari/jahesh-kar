from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404, redirect
from django.conf import settings
from courses.models import Course
from .models import Order, Enrollment, PaymentGatewaySetting, Coupon
from .serializers import OrderSerializer, EnrollmentSerializer
from .payment_service import PaymentGatewayService


class ValidateCouponView(APIView):
    """
    اعتبارسنجی کد تخفیف قبل از پرداخت و محاسبه مبلغ تخفیف
    """
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get("code", "").strip()
        course_id = request.data.get("course_id")

        if not code:
            return Response({"error": "لطفاً کد تخفیف را وارد کنید."}, status=status.HTTP_400_BAD_REQUEST)

        if not course_id:
            return Response({"error": "شناسه دوره نامعتبر است."}, status=status.HTTP_400_BAD_REQUEST)

        course = get_object_or_404(Course, id=course_id, is_published=True)
        coupon = Coupon.objects.filter(code__iexact=code).first()

        if not coupon:
            return Response({"error": "کد تخفیف وارد شده معتبر نیست یا وجود ندارد."}, status=status.HTTP_404_NOT_FOUND)

        is_valid, message = coupon.is_valid_for(course)
        if not is_valid:
            return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)

        original_price = course.final_price
        discount_amount, final_price = coupon.calculate_discount(original_price)

        return Response({
            "valid": True,
            "code": coupon.code,
            "discount_percent": coupon.discount_percent,
            "original_price": original_price,
            "discount_amount": discount_amount,
            "final_price": final_price,
            "message": f"کد تخفیف {coupon.discount_percent}٪ با موفقیت اعمال شد."
        }, status=status.HTTP_200_OK)


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        course_id = request.data.get("course_id")
        coupon_code = request.data.get("coupon_code", "").strip()

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

        # Validate Coupon if provided
        coupon = None
        if coupon_code:
            coupon = Coupon.objects.filter(code__iexact=coupon_code).first()
            if not coupon:
                return Response({"error": "کد تخفیف وارد شده معتبر نیست."}, status=status.HTTP_400_BAD_REQUEST)
            is_valid, msg = coupon.is_valid_for(course)
            if not is_valid:
                return Response({"error": msg}, status=status.HTTP_400_BAD_REQUEST)

        # Create Order
        order = Order.create_order(user=request.user, course=course, coupon=coupon)

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
        orders = Order.objects.filter(user=request.user).select_related("course", "coupon")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
