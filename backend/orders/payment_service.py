import requests
from django.conf import settings
from django.db import transaction
from .models import PaymentGatewaySetting, Order, Enrollment


class PaymentGatewayService:
    """
    سرویس مدیریت درگاه‌های پرداخت با امکان تغییر آسان از طریق پنل ادمین
    پشتیبانی از:
    1. شبیه‌ساز پرداخت تستی (بدون نیاز به مرچنت)
    2. زرین‌پال نسخه ۴ (ZarinPal REST API v4)
    3. آیدی‌پی و زیبال
    """

    @classmethod
    def request_payment(cls, request, order: Order) -> dict:
        gateway_setting = PaymentGatewaySetting.get_active_setting()

        # ۱. اگر دوره رایگان بود یا درگاه روی حالت شبیه‌ساز تنظیم شده بود:
        if order.amount == 0 or gateway_setting.gateway_provider == "simulation":
            with transaction.atomic():
                order.status = "completed"
                order.save()
                enrollment, _ = Enrollment.objects.get_or_create(
                    user=order.user,
                    course=order.course,
                    defaults={"order": order}
                )
                order.course.students_count += 1
                order.course.save(update_fields=["students_count"])

            return {
                "mode": "simulation",
                "success": True,
                "message": "ثبت‌نام با موفقیت انجام شد!",
                "tracking_code": order.tracking_code,
                "course_slug": order.course.slug,
            }

        # ۲. درگاه زرین‌پال (ZarinPal v4)
        if gateway_setting.gateway_provider == "zarinpal":
            if not gateway_setting.merchant_id:
                return {
                    "success": False,
                    "error": "مرچنت کد درگاه زرین‌پال در پنل مدیریت تنظیم نشده است."
                }

            is_sandbox = gateway_setting.is_sandbox
            req_url = (
                "https://sandbox.zarinpal.com/pg/v4/payment/request.json"
                if is_sandbox
                else "https://payment.zarinpal.com/pg/v4/payment/request.json"
            )
            start_pay_url = (
                "https://sandbox.zarinpal.com/pg/StartPay/"
                if is_sandbox
                else "https://payment.zarinpal.com/pg/StartPay/"
            )

            # آدرس بازگشت پس از پرداخت
            callback_url = gateway_setting.callback_url
            if not callback_url:
                callback_url = request.build_absolute_uri("/api/orders/payment/verify/")

            # تبدیل تومان به ریال (زرین‌پال ریال دریافت می‌کند)
            amount_in_rial = order.amount * 10

            payload = {
                "merchant_id": gateway_setting.merchant_id,
                "amount": amount_in_rial,
                "description": f"خرید دوره {order.course.title} در جهش کار",
                "callback_url": callback_url,
                "metadata": {
                    "mobile": getattr(order.user, "phone_number", "") or "",
                    "email": getattr(order.user, "email", "") or "",
                    "order_id": order.id,
                },
            }

            try:
                res = requests.post(req_url, json=payload, timeout=12)
                data = res.json().get("data", {})
                errors = res.json().get("errors", [])

                if res.status_code == 200 and data.get("code") == 100:
                    authority = data.get("authority")
                    order.authority = authority
                    order.save(update_fields=["authority"])

                    return {
                        "mode": "redirect",
                        "success": True,
                        "payment_url": f"{start_pay_url}{authority}",
                        "authority": authority,
                    }
                else:
                    err_msg = "خطا در برقراری ارتباط با درگاه زرین‌پال."
                    if errors:
                        err_msg += f" ({errors})"
                    return {"success": False, "error": err_msg}

            except Exception as e:
                return {"success": False, "error": f"خطا در ارسال درخواست به درگاه بانکی: {str(e)}"}

        # سایر درگاه‌ها (پیش‌فرض)
        return {
            "success": False,
            "error": f"درگاه {gateway_setting.get_gateway_provider_display()} هنوز به طور کامل فعال‌سازی نشده است."
        }

    @classmethod
    def verify_payment(cls, request, authority: str, status_param: str) -> dict:
        """
        اعتبارسنجی تراکنش پس از بازگشت کاربر از درگاه بانک
        """
        gateway_setting = PaymentGatewaySetting.get_active_setting()
        order = Order.objects.filter(authority=authority).first()

        if not order:
            return {"success": False, "error": "سفارش مرتبط با این تراکنش یافت نشد."}

        if status_param != "OK":
            order.status = "canceled"
            order.save(update_fields=["status"])
            return {
                "success": False,
                "error": "پرداخت توسط کاربر لغو گردید یا با خطا مواجه شد.",
                "order": order
            }

        # اگر درگاه زرین‌پال است:
        if gateway_setting.gateway_provider == "zarinpal":
            is_sandbox = gateway_setting.is_sandbox
            verify_url = (
                "https://sandbox.zarinpal.com/pg/v4/payment/verify.json"
                if is_sandbox
                else "https://payment.zarinpal.com/pg/v4/payment/verify.json"
            )

            payload = {
                "merchant_id": gateway_setting.merchant_id,
                "amount": order.amount * 10,
                "authority": authority,
            }

            try:
                res = requests.post(verify_url, json=payload, timeout=12)
                data = res.json().get("data", {})

                # کد 100 یعنی پرداخت موفق، کد 101 یعنی قبلا تایید شده
                if res.status_code == 200 and data.get("code") in [100, 101]:
                    with transaction.atomic():
                        order.status = "completed"
                        order.ref_id = str(data.get("ref_id", ""))
                        order.card_pan = str(data.get("card_pan", ""))
                        order.save()

                        Enrollment.objects.get_or_create(
                            user=order.user,
                            course=order.course,
                            defaults={"order": order}
                        )
                        order.course.students_count += 1
                        order.course.save(update_fields=["students_count"])

                    return {
                        "success": True,
                        "order": order,
                        "ref_id": order.ref_id,
                        "message": "پرداخت با موفقیت انجام شد."
                    }
                else:
                    order.status = "canceled"
                    order.save(update_fields=["status"])
                    return {
                        "success": False,
                        "error": "تراکنش توسط درگاه زرین‌پال تایید نشد.",
                        "order": order
                    }

            except Exception as e:
                return {"success": False, "error": f"خطا در استعلام وضعیت پرداخت: {str(e)}", "order": order}

        return {"success": False, "error": "نوع درگاه نامعتبر است."}
