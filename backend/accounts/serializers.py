from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, PhoneOTP


def normalize_phone_number(val: str) -> str:
    if not val:
        return ""
    # Convert Persian/Arabic digits to ASCII
    persian_digits = "۰۱۲۳۴۵۶۷۸۹"
    arabic_digits = "٠١٢٣٤٥٦٧٨٩"
    cleaned = str(val).strip()
    for i in range(10):
        cleaned = cleaned.replace(persian_digits[i], str(i)).replace(arabic_digits[i], str(i))
    
    # Strip spaces, dashes, dots, parentheses
    for ch in [" ", "-", "(", ")", ".", "/", "\\", "_"]:
        cleaned = cleaned.replace(ch, "")
        
    if cleaned.startswith("+98"):
        cleaned = "0" + cleaned[3:]
    elif cleaned.startswith("0098"):
        cleaned = "0" + cleaned[4:]
    elif cleaned.startswith("98") and len(cleaned) == 12:
        cleaned = "0" + cleaned[2:]
    elif not cleaned.startswith("0") and len(cleaned) == 10 and cleaned.startswith("9"):
        cleaned = "0" + cleaned

    return cleaned


def normalize_code(val: str) -> str:
    if not val:
        return ""
    persian_digits = "۰۱۲۳۴۵۶۷۸۹"
    arabic_digits = "٠١٢٣٤٥٦٧٨٩"
    cleaned = str(val).strip()
    for i in range(10):
        cleaned = cleaned.replace(persian_digits[i], str(i)).replace(arabic_digits[i], str(i))
    return cleaned.replace(" ", "")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "phone_number", "full_name", "email", "is_staff", "date_joined"]
        read_only_fields = ["id", "is_staff", "date_joined"]


class SendOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=25)

    def validate_phone_number(self, value):
        cleaned = normalize_phone_number(value)
        if not (cleaned.startswith("09") and len(cleaned) == 11 and cleaned.isdigit()):
            raise serializers.ValidationError("شماره موبایل وارد شده معتبر نیست. نمونه صحیح: 09123456789")
        return cleaned


class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=25)
    code = serializers.CharField(max_length=10)
    full_name = serializers.CharField(max_length=150, required=False, allow_blank=True)

    def validate_phone_number(self, value):
        cleaned = normalize_phone_number(value)
        if not (cleaned.startswith("09") and len(cleaned) == 11 and cleaned.isdigit()):
            raise serializers.ValidationError("شماره موبایل وارد شده معتبر نیست.")
        return cleaned

    def validate_code(self, value):
        cleaned = normalize_code(value)
        if not cleaned:
            raise serializers.ValidationError("کد تایید را وارد کنید.")
        return cleaned


class PasswordRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(min_length=4, write_only=True)
    full_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone_number = serializers.CharField(max_length=25, required=False, allow_blank=True)

    def validate_username(self, value):
        val = value.strip().lower()
        if User.objects.filter(username=val).exists():
            raise serializers.ValidationError("این نام کاربری قبلا ثبت شده است.")
        return val

    def validate_phone_number(self, value):
        if not value:
            return ""
        cleaned = normalize_phone_number(value)
        if User.objects.filter(phone_number=cleaned).exists():
            raise serializers.ValidationError("این شماره موبایل قبلا ثبت شده است.")
        return cleaned


class PasswordLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=150)  # can be username or phone number
    password = serializers.CharField(write_only=True)
