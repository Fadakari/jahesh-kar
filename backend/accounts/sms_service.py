import os
import requests
import xml.etree.ElementTree as ET
from pathlib import Path
from dotenv import load_dotenv
from django.conf import settings
from .models import PhoneOTP


class RayganSMSService:
    """
    سرویس ارسال و بررسی کد اعتبارسنجی پیامکی سریع (FastSend)
    سازگار با سامانه رایگان اس‌ام‌اس (RayganSMS.com) و پنل ترز (smspanel.trez.ir)
    """

    @classmethod
    def _reload_env(cls):
        env_path = settings.BASE_DIR / '.env'
        if env_path.exists():
            load_dotenv(env_path, override=True)

    @classmethod
    def get_config(cls):
        cls._reload_env()
        username = os.environ.get("SMS_USERNAME", "").strip()
        password = os.environ.get("SMS_PASSWORD", "").strip()
        footer = os.environ.get("SMS_FOOTER", "جهش کار").strip()
        url = os.environ.get("SMS_URL", "http://smspanel.trez.ir/FastSend.asmx").strip()
        return username, password, footer, url

    @classmethod
    def is_configured(cls) -> bool:
        username, password, _, _ = cls.get_config()
        return bool(username and password and username not in ["your_username", ""])

    @classmethod
    def clean_phone(cls, phone_number: str) -> str:
        if not phone_number:
            return ""
        persian_digits = "۰۱۲۳۴۵۶۷۸۹"
        arabic_digits = "٠١٢٣٤٥٦٧۸۹"
        phone = str(phone_number).strip()
        for i in range(10):
            phone = phone.replace(persian_digits[i], str(i)).replace(arabic_digits[i], str(i))
        
        for ch in [" ", "-", "(", ")", ".", "/", "\\", "_"]:
            phone = phone.replace(ch, "")
            
        if phone.startswith("+98"):
            phone = "0" + phone[3:]
        elif phone.startswith("0098"):
            phone = "0" + phone[4:]
        elif phone.startswith("98") and len(phone) == 12:
            phone = "0" + phone[2:]
        elif not phone.startswith("0") and len(phone) == 10 and phone.startswith("9"):
            phone = "0" + phone
        return phone

    @classmethod
    def send_auto_code(cls, phone_number: str) -> dict:
        phone = cls.clean_phone(phone_number)
        username, password, footer, gateway_url = cls.get_config()

        # اگر مشخصات در .env نبود -> شبیه‌ساز لوکال
        if not cls.is_configured():
            otp = PhoneOTP.generate_otp(phone)
            print("\n==========================================")
            print(f"[شبیه‌ساز پیامک جهش کار] کد ورود برای {phone}: {otp.code}")
            print("مشخصات SMS_USERNAME و SMS_PASSWORD را در .env قرار دهید.")
            print("==========================================\n")
            return {
                "success": True,
                "message": f"کد تایید برای {phone} ارسال شد.",
                "dev_code": otp.code if settings.DEBUG else None,
                "mode": "simulation"
            }

        # ارسال به وب‌سرویس اصلی RayganSMS با پروتکل SOAP 1.1
        soap_body = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <AutoSendCode xmlns="http://tempuri.org/">
      <Username>{username}</Username>
      <Password>{password}</Password>
      <ReciptionNumber>{phone}</ReciptionNumber>
      <Footer>{footer}</Footer>
    </AutoSendCode>
  </soap:Body>
</soap:Envelope>"""

        headers = {
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": "http://tempuri.org/AutoSendCode"
        }

        # لیست آدرس‌های سرویس جهت اطمینان از ارسال سریع
        target_urls = [
            gateway_url,
            "https://raygansms.com/FastSend.asmx",
            "http://smspanel.trez.ir/FastSend.asmx"
        ]

        last_error = "Error connecting to SMS service"
        for url in target_urls:
            try:
                # Safe print without windows cp1252 crash
                print(f"[SMS Gateway] Sending to {url} for {phone} (user: {username})...")
                response = requests.post(
                    url,
                    data=soap_body.encode("utf-8"),
                    headers=headers,
                    timeout=10
                )

                if response.status_code == 200:
                    root = ET.fromstring(response.text)
                    result_el = root.find(".//{http://tempuri.org/}AutoSendCodeResult")
                    if result_el is not None and result_el.text:
                        result_val = int(result_el.text.strip())
                        print(f"[SMS Gateway] Response code from {url}: {result_val}")

                        if result_val > 2000:
                            return {
                                "success": True,
                                "message": f"کد تایید با موفقیت به شماره {phone} پیامک شد.",
                                "tracking_id": result_val,
                                "mode": "live"
                            }
                        else:
                            last_error = cls._get_error_message(result_val)
                            print(f"[SMS Gateway] Failed with code {result_val}: {last_error}")
                            return {"success": False, "error": last_error, "code": result_val}

                last_error = f"پاسخ ناموفق از سامانه پیامک ({response.status_code})"

            except Exception as e:
                print(f"[SMS Gateway] Connection error to {url}: {e}")
                last_error = str(e)
                continue

        return {"success": False, "error": f"خطا در ارسال پیامک: {last_error}"}

    @classmethod
    def check_code(cls, phone_number: str, code: str) -> bool:
        phone = cls.clean_phone(phone_number)
        code = code.strip()
        username, password, _, gateway_url = cls.get_config()

        # حالت لوکال / شبیه‌ساز دیتابیسی
        if not cls.is_configured():
            otp = PhoneOTP.objects.filter(phone_number=phone, code=code, is_used=False).first()
            if otp and otp.is_valid():
                otp.is_used = True
                otp.save()
                return True
            return False

        soap_body = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CheckSendCode xmlns="http://tempuri.org/">
      <Username>{username}</Username>
      <Password>{password}</Password>
      <ReciptionNumber>{phone}</ReciptionNumber>
      <Code>{code}</Code>
    </CheckSendCode>
  </soap:Body>
</soap:Envelope>"""

        headers = {
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": "http://tempuri.org/CheckSendCode"
        }

        target_urls = [
            gateway_url,
            "http://smspanel.trez.ir/FastSend.asmx",
            "https://raygansms.com/FastSend.asmx"
        ]

        for url in target_urls:
            try:
                response = requests.post(
                    url,
                    data=soap_body.encode("utf-8"),
                    headers=headers,
                    timeout=8
                )
                if response.status_code == 200:
                    root = ET.fromstring(response.text)
                    result_el = root.find(".//{http://tempuri.org/}CheckSendCodeResult")
                    if result_el is not None and result_el.text:
                        return result_el.text.strip().lower() == "true"
            except Exception as e:
                print(f"[CheckSendCode Error] {url}: {e}")
                continue

        return False

    @staticmethod
    def _get_error_message(code: int) -> str:
        errors = {
            -1: "نام کاربری یا رمز عبور سامانه پیامک اشتباه است.",
            -2: "اعتبار ریالی پنل پیامک کافی نمی‌باشد.",
            -3: "شماره موبایل گیرنده نامعتبر است.",
            -4: "مشخصات ارسالی به وب‌سرویس نامعتبر است.",
            -5: "حساب کاربری در سامانه پیامک غیرفعال است.",
        }
        return errors.get(code, f"خطای سامانه پیامک (کد {code}). لطفا اعتبار پنل را بررسی کنید.")
