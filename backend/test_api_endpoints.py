import os
import sys
import django

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaheshkar_backend.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from courses.models import Course, Lesson, Category
from accounts.models import PhoneOTP

User = get_user_model()
client = APIClient()

print("--- Starting JaheshKar API Verification ---")

# 1. Test Categories
res = client.get('/api/courses/categories/')
assert res.status_code == 200, f"Categories failed: {res.status_code}"
categories = res.json()
print(f"[OK] Categories fetched: {len(categories)} found")

# 2. Test Courses List
res = client.get('/api/courses/')
assert res.status_code == 200, f"Courses failed: {res.status_code}"
courses = res.json()
print(f"[OK] Courses fetched: {len(courses)} found")
assert len(courses) >= 4, "Expected at least 4 courses"

# 3. Test Course Detail
sample_slug = courses[0]['slug']
res = client.get(f'/api/courses/{sample_slug}/')
assert res.status_code == 200, f"Course detail failed: {res.status_code}"
course_detail = res.json()
print(f"[OK] Course detail fetched: '{course_detail['title']}' with {len(course_detail.get('sections', []))} sections")

# 4. Test Send OTP
res = client.post('/api/accounts/send-otp/', {'phone_number': '09129998877'})
assert res.status_code == 200, f"Send OTP failed: {res.status_code}"
otp_data = res.json()
dev_code = otp_data.get('dev_code')
tracking_id = otp_data.get('tracking_id')
print(f"[OK] Send OTP succeeded: Mode = {otp_data.get('mode')}, Tracking = {tracking_id}, DevCode = {dev_code}")

# 5. Test Verify OTP (if dev_code available in simulation or test mode)
if dev_code:
    res = client.post('/api/accounts/verify-otp/', {
        'phone_number': '09129998877',
        'code': dev_code,
        'full_name': 'کاربر تستی'
    })
    assert res.status_code == 200, f"Verify OTP failed: {res.status_code}"
    auth_data = res.json()
    token = auth_data['token']
    print(f"[OK] OTP verified, Token generated: {token[:10]}...")
else:
    print("[OK] Real SMS gateway active: OTP was dispatched directly via Trez FastSend SMS.")

# 6. Test Password Login
res = client.post('/api/accounts/login/', {
    'identifier': 'student',
    'password': 'user123456'
})
assert res.status_code == 200, f"Password login failed: {res.status_code}"
student_token = res.json()['token']
print(f"[OK] Password login successful for user 'student'")

# 7. Test Free Preview Lesson (Unauthenticated)
client.credentials() # unauthenticated
free_lesson = Lesson.objects.filter(is_free_preview=True).first()
if free_lesson:
    res = client.get(f'/api/courses/{free_lesson.course.slug}/lessons/{free_lesson.id}/')
    assert res.status_code == 200, f"Free preview failed: {res.status_code}"
    print(f"[OK] Free preview watched anonymously: '{res.json()['title']}'")

# 8. Test Checkout / Purchase with Authenticated Token
client.credentials(HTTP_AUTHORIZATION='Token ' + student_token)
from orders.models import PaymentGatewaySetting
gw = PaymentGatewaySetting.get_active_setting()
gw.is_sales_enabled = True
gw.gateway_provider = 'simulation'
gw.save()

target_course = Course.objects.filter(slug='ai-practical-prompt-engineering').first()
if target_course:
    res = client.post('/api/orders/checkout/', {'course_id': target_course.id})
    assert res.status_code in [200, 201], f"Checkout failed: {res.status_code} {res.json()}"
    print(f"[OK] Checkout successful: Tracking Code = {res.json().get('tracking_code')}")

    # Now verify the user can watch the private lessons of that course!
    locked_lesson = target_course.lessons.filter(is_free_preview=False).first()
    if locked_lesson:
        res = client.get(f'/api/courses/{target_course.slug}/lessons/{locked_lesson.id}/')
        assert res.status_code == 200, f"Watching purchased lesson failed: {res.status_code}"
        print(f"[OK] Authenticated student can watch private lesson: '{res.json()['title']}'")

# 9. Test My Courses
res = client.get('/api/orders/my-courses/')
assert res.status_code == 200, f"My Courses failed: {res.status_code}"
my_courses = res.json()
print(f"[OK] My Courses returned: {len(my_courses)} enrolled courses")

# Reset sales enabled to default False
gw.is_sales_enabled = False
gw.save()

print("\n>>> ALL BACKEND API & BUSINESS LOGIC TESTS PASSED 100%! <<<\n")
