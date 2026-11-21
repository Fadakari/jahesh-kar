from django.urls import path
from .views import CheckoutView, PaymentVerifyView, MyCoursesView, MyOrdersView, ValidateCouponView

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('validate-coupon/', ValidateCouponView.as_view(), name='validate-coupon'),
    path('payment/verify/', PaymentVerifyView.as_view(), name='payment-verify'),
    path('my-courses/', MyCoursesView.as_view(), name='my-courses'),
    path('my-orders/', MyOrdersView.as_view(), name='my-orders'),
]
