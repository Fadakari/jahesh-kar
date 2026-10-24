import os
import requests
import xml.etree.ElementTree as ET
from django.conf import settings
from .models import PhoneOTP

class RayganSMSService:
    """
    سرویس ارسال و بررسی کد اعتبارسنجی پیامکی سریع (FastSend)
    سازگار با سامانه رایگان اس‌ام‌اس (RayganSMS.com) و پنل ترز (smspanel.trez.ir)
    """

    GATEWAY_URL = os.environ.get("SMS_URL", "http://smspanel.trez.ir/FastSend.asmx")
    USERNAME = os.environ.get("SMS_USERNAME", "")
    PASSWORD = os.environ.get("SMS_PASSWORD", "")
    FOOTER = os.environ.get("SMS_FOOTER", "جهش کار")

    @classmethod
    def is_configured(cls) -> bool:
        """بررسی اینکه آیا نام‌کاربری و رمز عبور پنل پیامک در تنظیمات ست شده است یا خیر"""
        return bool(cls.USERNAME and cls.PASSWORD and cls.USERNAME != "your_username")

    @classmethod
    def clean_phone(cls, phone_number: str) -> str:
        """استانداردسازی شماره موبایل به فرمت 09xxxxxxxxx"""
        phone = phone_number.strip().replace(" ", "").replace("+98", "0")
        if phone.startswith("98"):
            phone = "0" + phone[2:]
        return phone

    @classmethod
    def send_auto_code(cls, phone_number: str) -> dict:
        """
        ارسال خودکار کد فعال‌سازی با متد AutoSendCode
        در این متد، خود پنل پیامک کد را تولید و ارسال می‌کند.
        """
        phone = cls.clean_phone(phone_number)

        # اگر اطلاعات پنل پیامک ست نشده بود، از شبیه‌ساز لوکال استفاده کن تا پروژه متوقف نشود
        if not cls.is_configured():
            otp = PhoneOTP.generate_otp(phone)
            print("\n==========================================")
            print(f"[شبیه‌ساز پیامک جهش کار] کد ورود برای {phone}: {otp.code}")
            print("جهت ارسال واقعی، SMS_USERNAME و SMS_PASSWORD را در .env ست کنید.")
            print("==========================================\n")
            return {
                "success": True,
                "message": f"کد تایید برای {phone} ارسال شد (حالت توسعه)",
                "dev_code": otp.code if settings.DEBUG else None,
                "mode": "simulation"
            }

        # اتصال به وب‌سرویس اصلی RayganSMS با پروتکل SOAP 1.1
        soap_body = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <AutoSendCode xmlns="http://tempuri.org/">
      <Username>{cls.USERNAME}</Username>
      <Password>{cls.PASSWORD}</Password>
      <ReciptionNumber>{phone}</ReciptionNumber>
      <Footer>{cls.FOOTER}</Footer>
    </AutoSendCode>
  </soap:Body>
</soap:Envelope>"""

        headers = {
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": "http://tempuri.org/AutoSendCode"
        }

        try:
            response = requests.post(
                cls.GATEWAY_URL,
                data=soap_body.encode("utf-8"),
                headers=headers,
                timeout=12
            )

            if response.status_code == 200:
                root = ET.fromstring(response.text)
                # جستجوی تگ AutoSendCodeResult
                result_el = root.find(".//{http://tempuri.org/}AutoSendCodeResult")
                if result_el is not None and result_el.text:
                    result_val = int(result_el.text.strip())
                    # طبق مستندات رایگان اس‌ام‌اس: عدد بزرگتر از 2000 شناسه پیگیری پیامک موفق است
                    if result_val > 2000:
                        return {
                            "success": True,
                            "message": f"کد تایید با موفقیت به شماره {phone} پیامک شد.",
                            "tracking_id": result_val,
                            "mode": "live"
                        }
                    else:
                        error_msg = cls._get_error_message(result_val)
                        return {"success": False, "error": error_msg, "code": result_val}

            return {
                "success": False,
                "error": f"خطا در ارتباط با وب‌سرویس پیامک (کد وضعیت {response.status_code})"
            }

        except requests.exceptions.Timeout:
            return {"success": False, "error": "مهلت اتصال به سامانه پیامک به پایان رسید. لطفا مجددا تلاش کنید."}
        except Exception as e:
            return {"success": False, "error": f"خطای پیش‌بینی نشده در ارسال پیامک: {str(e)}"}

    @classmethod
    def check_code(cls, phone_number: str, code: str) -> bool:
        """
        بررسی صحت کد وارد شده با متد CheckSendCode در پنل RayganSMS
        """
        phone = cls.clean_phone(phone_number)
        code = code.strip()

        # حالت لوکال / شبیه‌ساز دیتابیسی
        if not cls.is_configured():
            otp = PhoneOTP.objects.filter(phone_number=phone, code=code, is_used=False).first()
            if otp and otp.is_valid():
                otp.is_used = True
                otp.save()
                return True
            return False

        # ارسال به وب‌سرویس اصلی RayganSMS
        soap_body = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CheckSendCode xmlns="http://tempuri.org/">
      <Username>{cls.USERNAME}</Username>
      <Password>{cls.PASSWORD}</Password>
      <ReciptionNumber>{phone}</ReciptionNumber>
      <Code>{code}</Code>
    </CheckSendCode>
  </soap:Body>
</soap:Envelope>"""

        headers = {
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": "http://tempuri.org/CheckSendCode"
        }

        try:
            response = requests.post(
                cls.GATEWAY_URL,
                data=soap_body.encode("utf-8"),
                headers=headers,
                timeout=10
            )

            if response.status_code == 200:
                root = ET.fromstring(response.text)
                result_el = root.find(".//{http://tempuri.org/}CheckSendCodeResult")
                if result_el is not None and result_el.text:
                    return result_el.text.strip().lower() == "true"

            return False
        except Exception as e:
            print(f"[SMS Check Error] {e}")
            return False

    @staticmethod
    def _get_error_message(code: int) -> str:
        """تبدیل کدهای خطای رایگان اس‌ام‌اس به پیام فارسی روان"""
        errors = {
            -1: "نام کاربری یا رمز عبور سامانه پیامک اشتباه است.",
            -2: "اعتبار ریالی پنل پیامک کافی نمی‌باشد.",
            -3: "شماره موبایل گیرنده نامعتبر است.",
            -4: "متن یا مشخصات پیامک نامعتبر است.",
            -5: "حساب کاربری پیامکی غیرفعال است.",
        }
        return errors.get(code, f"خطای سامانه پیامک (کد {code}). لطفا اعتبار پنل را بررسی کنید.")
