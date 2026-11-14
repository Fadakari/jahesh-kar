from rest_framework import serializers
from .models import SiteSetting, SiteFeature, Testimonial, FAQ


class SiteSettingSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSetting
        fields = [
            "site_title",
            "logo_url",
            # Announcement
            "announcement_active",
            "announcement_badge",
            "announcement_text",
            "announcement_link",
            # Hero
            "hero_badge",
            "hero_title",
            "hero_subtitle",
            "hero_cta_primary_text",
            "hero_cta_primary_link",
            "hero_cta_secondary_text",
            "hero_cta_secondary_link",
            # Metrics
            "stat_1_number",
            "stat_1_label",
            "stat_2_number",
            "stat_2_label",
            "stat_3_number",
            "stat_3_label",
            "stat_4_number",
            "stat_4_label",
            # Features banner
            "features_badge",
            "features_title",
            "features_subtitle",
            # Contacts & Social
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


class SiteFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteFeature
        fields = ["id", "title", "description", "badge", "tag", "icon_type", "order"]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["id", "student_name", "student_role", "avatar_initials", "comment", "rating", "order"]


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer", "order"]
