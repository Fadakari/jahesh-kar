from django.urls import path
from .views import (
    SiteSettingView,
    SiteFeatureListView,
    TestimonialListView,
    FAQListView,
)

urlpatterns = [
    path("settings/", SiteSettingView.as_view(), name="site-settings"),
    path("features/", SiteFeatureListView.as_view(), name="site-features"),
    path("testimonials/", TestimonialListView.as_view(), name="site-testimonials"),
    path("faqs/", FAQListView.as_view(), name="faqs-list"),
]
