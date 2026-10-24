from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, PhoneOTP


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "phone_number", "full_name", "email", "is_staff", "date_joined"]
        read_only_fields = ["id", "is_staff", "date_joined"]


class SendOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)

    def validate_phone_number(self, value):
        cleaned = value.strip().replace(" ", "").replace("+98", "0")
        if not (cleaned.startswith("09") and len(cleaned) == 11 and cleaned.isdigit()):
            raise serializers.ValidationError("شماره موبایل وارد شده معتبر نیست. نمونه: 09123456789")
        return cleaned


class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    code = serializers.CharField(max_length=6)
    full_name = serializers.CharField(max_length=150, required=False, allow_blank=True)

    def validate_phone_number(self, value):
        return value.strip().replace(" ", "").replace("+98", "0")


class PasswordRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(min_length=4, write_only=True)
    full_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone_number = serializers.CharField(max_length=15, required=False, allow_blank=True)

    def validate_username(self, value):
        val = value.strip().lower()
        if User.objects.filter(username=val).exists():
            raise serializers.ValidationError("این نام کاربری قبلا ثبت شده است.")
        return val

    def validate_phone_number(self, value):
        if not value:
            return ""
        cleaned = value.strip().replace(" ", "").replace("+98", "0")
        if User.objects.filter(phone_number=cleaned).exists():
            raise serializers.ValidationError("این شماره موبایل قبلا ثبت شده است.")
        return cleaned


class PasswordLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=150)  # can be username or phone number
    password = serializers.CharField(write_only=True)
