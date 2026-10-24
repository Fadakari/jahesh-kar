from rest_framework import serializers
from .models import SiteSetting, FAQ


class SiteSettingSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSetting
        fields = [
            "site_title",
            "logo_url",
            "hero_badge",
            "hero_title",
            "hero_subtitle",
            "features_badge",
            "features_title",
            "features_subtitle",
            "contact_phone",
            "contact_email",
            "telegram_url",
            "instagram_url",
            "footer_about",
        ]

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return None


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer", "order"]
