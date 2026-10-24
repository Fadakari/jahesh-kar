from django.urls import path
from .views import (
    CategoryListView,
    CourseListView,
    CourseDetailView,
    LessonWatchView,
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='categories-list'),
    path('', CourseListView.as_view(), name='courses-list'),
    path('<slug:slug>/', CourseDetailView.as_view(), name='course-detail'),
    path('<slug:course_slug>/lessons/<int:lesson_id>/', LessonWatchView.as_view(), name='lesson-watch'),
]
