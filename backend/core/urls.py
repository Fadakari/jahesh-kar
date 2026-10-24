from django.urls import path
from .views import SiteSettingView, FAQListView

urlpatterns = [
    path("settings/", SiteSettingView.as_view(), name="site-settings"),
    path("faqs/", FAQListView.as_view(), name="faqs-list"),
]
