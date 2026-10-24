from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import generics
from .models import SiteSetting, FAQ
from .serializers import SiteSettingSerializer, FAQSerializer


class SiteSettingView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        setting = SiteSetting.get_settings()
        serializer = SiteSettingSerializer(setting, context={"request": request})
        return Response(serializer.data)


class FAQListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = FAQSerializer

    def get_queryset(self):
        return FAQ.objects.filter(is_active=True).order_by("order", "id")
