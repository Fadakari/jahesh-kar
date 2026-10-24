from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.conf import settings
from .models import User, PhoneOTP
from .sms_service import RayganSMSService
from .serializers import (
    UserSerializer,
    SendOTPSerializer,
    VerifyOTPSerializer,
    PasswordRegisterSerializer,
    PasswordLoginSerializer,
)


class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        phone_number = serializer.validated_data["phone_number"]
        result = RayganSMSService.send_auto_code(phone_number)

        if not result.get("success"):
            return Response(
                {"error": result.get("error", "خطا در ارسال پیامک تایید.")},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(result, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        phone_number = serializer.validated_data["phone_number"]
        code = serializer.validated_data["code"].strip()
        full_name = serializer.validated_data.get("full_name", "").strip()

        # Check code validity via RayganSMS service or local fallback
        is_valid = RayganSMSService.check_code(phone_number, code)
        if not is_valid:
            return Response(
                {"error": "کد تایید اشتباه است یا منقضی شده است."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get or create user
        user = User.objects.filter(phone_number=phone_number).first()
        created = False
        if not user:
            username = f"user_{phone_number[-6:]}"
            # Ensure unique username
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1

            user = User.objects.create(
                username=username,
                phone_number=phone_number,
                full_name=full_name or f"کاربر {phone_number[-4:]}",
                is_verified=True,
            )
            created = True
        else:
            if full_name and not user.full_name:
                user.full_name = full_name
            user.is_verified = True
            user.save()

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "success": True,
            "is_new_user": created,
            "token": token.key,
            "user": UserSerializer(user).data,
            "message": "با موفقیت وارد شدید." if not created else "ثبت نام شما با موفقیت انجام شد."
        }, status=status.HTTP_200_OK)


class PasswordRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        user = User.objects.create_user(
            username=data["username"],
            password=data["password"],
            full_name=data.get("full_name", ""),
            phone_number=data.get("phone_number") or None,
            is_verified=True,
        )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "success": True,
            "token": token.key,
            "user": UserSerializer(user).data,
            "message": "ثبت نام با موفقیت انجام شد."
        }, status=status.HTTP_201_CREATED)


class PasswordLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        identifier = serializer.validated_data["identifier"].strip()
        password = serializer.validated_data["password"]

        # Identifier might be username or phone_number
        user = None
        if identifier.startswith("09") and len(identifier) == 11:
            user_obj = User.objects.filter(phone_number=identifier).first()
            if user_obj and user_obj.check_password(password):
                user = user_obj
        else:
            user = authenticate(username=identifier, password=password)

        if not user:
            return Response(
                {"error": "نام کاربری/شماره موبایل یا رمز عبور اشتباه است."},
                status=status.HTTP_400_BAD_REQUEST
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "success": True,
            "token": token.key,
            "user": UserSerializer(user).data,
            "message": "خوش آمدید!"
        }, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "user": UserSerializer(request.user).data,
        })

    def put(self, request):
        user = request.user
        full_name = request.data.get("full_name")
        email = request.data.get("email")
        if full_name is not None:
            user.full_name = full_name.strip()
        if email is not None:
            user.email = email.strip()
        user.save()
        return Response({
            "success": True,
            "user": UserSerializer(user).data,
            "message": "اطلاعات با موفقیت بروزرسانی شد."
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({"success": True, "message": "با موفقیت خارج شدید."})
