from django.urls import path
from .views import (
    SendOTPView,
    VerifyOTPView,
    PasswordRegisterView,
    PasswordLoginView,
    UserProfileView,
    LogoutView,
)

urlpatterns = [
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('register/', PasswordRegisterView.as_view(), name='register'),
    path('login/', PasswordLoginView.as_view(), name='login'),
    path('me/', UserProfileView.as_view(), name='me'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
