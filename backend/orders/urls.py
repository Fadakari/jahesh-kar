from django.urls import path
from .views import CheckoutView, PaymentVerifyView, MyCoursesView, MyOrdersView

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('payment/verify/', PaymentVerifyView.as_view(), name='payment-verify'),
    path('my-courses/', MyCoursesView.as_view(), name='my-courses'),
    path('my-orders/', MyOrdersView.as_view(), name='my-orders'),
]
