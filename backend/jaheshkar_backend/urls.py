import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.http import HttpResponse

# Custom Admin Branding
admin.site.site_header = "مدیریت آموزشگاه جهش کار"
admin.site.site_title = "جهش کار"
admin.site.index_title = "پنل مدیریت دوره‌ها، ویدیوها و کاربران"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/core/', include('core.urls')),
]

# Serve media files in development / fallback
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# If frontend build exists, serve it seamlessly via Django (perfect for cPanel / Passenger all-in-one deploy)
index_file = settings.BASE_DIR.parent / 'frontend' / 'dist' / 'index.html'
if index_file.exists():
    urlpatterns += [
        # Catch-all for React client-side routing
        re_path(r'^(?!api/|admin/|media/|static/).*$', TemplateView.as_view(template_name='index.html')),
    ]
else:
    def dev_welcome_view(request):
        return HttpResponse("""
        <div style="font-family: sans-serif; direction: rtl; text-align: center; padding: 50px;">
            <h1 style="color: #4f46e5;">بک‌اند جهش کار با موفقیت در حال اجرا است</h1>
            <p>جهت ورود به پنل ادمین جنگو به <a href="/admin/">/admin/</a> مراجعه فرمایید.</p>
            <p>جهت اجرای فرانت‌اند در حالت توسعه، دستور <code>npm run dev</code> را در پوشه frontend اجرا کنید.</p>
        </div>
        """)
    urlpatterns += [
        path('', dev_welcome_view),
    ]
