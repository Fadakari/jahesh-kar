import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>مستند فنی و راهنمای پیاده‌سازی بک‌اند آکادمی آواز آموز</title>
  <style>
    body {
      font-family: 'Noto Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif;
      direction: rtl;
      text-align: right;
      color: #1c1917;
      background: #ffffff;
      line-height: 1.7;
      font-size: 9.5pt;
      margin: 0;
      padding: 0;
    }

    /* Page Breaks */
    .page-break {
      page-break-before: always;
    }

    /* Header Banner */
    .doc-header {
      background: linear-gradient(135deg, #06261d 0%, #0b382c 60%, #041812 100%);
      color: #ffffff;
      padding: 24px;
      border-radius: 16px;
      margin-bottom: 24px;
      border: 1px solid #f59e0b;
      position: relative;
    }
    .doc-header h1 {
      margin: 0 0 6px 0;
      font-size: 19pt;
      font-weight: 900;
      color: #fde68a;
    }
    .doc-header .subtitle {
      font-size: 11pt;
      color: #d1fae5;
      margin-bottom: 14px;
    }
    .doc-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 8.5pt;
      color: #cbd5e1;
      border-top: 1px solid rgba(245, 158, 11, 0.3);
      padding-top: 10px;
    }
    .doc-meta span {
      background: rgba(0,0,0,0.3);
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    /* Section Headings */
    h2 {
      color: #064e3b;
      font-size: 14pt;
      font-weight: 900;
      border-right: 4px solid #f59e0b;
      padding-right: 10px;
      margin-top: 26px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }
    h3 {
      color: #0f766e;
      font-size: 11.5pt;
      font-weight: 800;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    h4 {
      color: #1f2937;
      font-size: 10pt;
      font-weight: 700;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    p {
      margin: 6px 0;
      text-align: justify;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 18px 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 7px 10px;
      text-align: right;
    }
    th {
      background-color: #06261d;
      color: #fde68a;
      font-weight: 800;
    }
    tr:nth-child(even) {
      background-color: #f8fafc;
    }

    /* Callout Boxes */
    .callout {
      border-radius: 12px;
      padding: 12px 14px;
      margin: 12px 0;
      font-size: 8.8pt;
      page-break-inside: avoid;
    }
    .callout-warning {
      background-color: #fffbeb;
      border-right: 4px solid #f59e0b;
      color: #92400e;
    }
    .callout-danger {
      background-color: #fef2f2;
      border-right: 4px solid #ef4444;
      color: #991b1b;
    }
    .callout-success {
      background-color: #f0fdf4;
      border-right: 4px solid #10b981;
      color: #065f46;
    }
    .callout-info {
      background-color: #f0f9ff;
      border-right: 4px solid #0284c7;
      color: #075985;
    }
    .callout-title {
      font-weight: 800;
      margin-bottom: 4px;
      display: block;
    }

    /* Code Blocks */
    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 14px;
      border-radius: 10px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 8pt;
      direction: ltr;
      text-align: left;
      overflow-x: auto;
      margin: 8px 0 14px 0;
      border: 1px solid #334155;
      page-break-inside: avoid;
      line-height: 1.45;
    }
    code {
      font-family: 'Courier New', Courier, monospace;
      background: #f1f5f9;
      color: #0f766e;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 8.5pt;
      direction: ltr;
      display: inline-block;
    }
    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 6px;
      font-size: 7.5pt;
      font-weight: 700;
      font-family: monospace;
    }
    .badge-get { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .badge-post { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-put { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .badge-auth { background: #fce7f3; color: #9d174d; border: 1px solid #fbcfe8; }
    .badge-public { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }

    ul, ol {
      margin: 6px 0;
      padding-right: 20px;
    }
    li {
      margin-bottom: 4px;
    }
  </style>
</head>
<body>

  <!-- DOCUMENT HEADER -->
  <div class="doc-header">
    <h1>مستند جامع پیاده‌سازی بک‌اند و قرارداد وب‌سرویس‌ها (API)</h1>
    <div class="subtitle">ویژه پیاده‌سازی کامل بک‌اند آکادمی تخصصی «آواز آموز» (آموزش مداحی و صداسازی)</div>
    <div class="doc-meta">
      <span>نسخه سند: ۲.۰ (جامع)</span>
      <span>مخاطب: تیم / توسعه‌دهنده بک‌اند</span>
      <span>وضعیت فرانت‌اند: بیلد شده و آماده استقرار (Production Ready)</span>
      <span>فرمت تبادل داده: RESTful JSON</span>
    </div>
  </div>

  <!-- SECTION 1 -->
  <h2>۱. مقدمه، معماری کلی و نحوه اتصال فرانت‌اند</h2>
  <p>
    این سند فنی به عنوان دستورالعمل قطعی و قرارداد رسمی وب‌سرویس‌ها (API Contract) میان فرانت‌اند بیلد شده آکادمی <strong>«آواز آموز»</strong> و سیستم بک‌اند تهیه گردیده است. فرانت‌اند این پروژه با React 19، Vite و Tailwind CSS به صورت یک اپلیکیشن تک‌صفحه‌ای (SPA) کاملاً مستقل (Decoupled) توسعه یافته است. بک‌اند این سامانه می‌تواند با هر فریم‌ورک استانداردی نظیر <strong>Django / Python، Laravel / PHP، Node.js، Go یا .NET</strong> از ابتدا پیاده‌سازی شود، مشروط بر آنکه تمامی اندپوینت‌ها، ساختارهای JSON ورودی و خروجی، کدهای وضعیت HTTP و الزامات امنیتی تشریح‌شده در این مستند دقیقاً رعایت گردند.
  </p>

  <div class="callout callout-info">
    <span class="callout-title">نحوه اتصال داینامیک فرانت‌اند به آدرس بک‌اند شما:</span>
    در بسته فرانت‌اند، فایلی به نام <code>config.js</code> در ریشه قرار دارد. فرانت‌اند در زمان اجرا ابتدا آدرس API را از این فایل می‌خواند. توسعه‌دهنده بدون نیاز به ری‌بیلد کردن پروژه، تنها با قرار دادن آدرس دامنه بک‌اند در این فایل می‌تواند ارتباط را برقرار کند:
    <pre><code>// public/config.js یا dist/config.js
window.__API_URL__ = "https://api.yourdomain.ir/api";</code></pre>
    در صورتی که این مقدار خالی باشد، فرانت‌اند به صورت پیش‌فرض درخواست‌ها را به آدرس نسبی <code>/api</code> ارسال خواهد کرد.
  </div>

  <h3>تنظیمات ضروری CORS (Cross-Origin Resource Sharing)</h3>
  <p>
    بک‌اند شما باید هدرهای CORS زیر را برای تمامی درخواست‌ها (به ویژه درخواست‌های Preflight متد <code>OPTIONS</code>) بازگرداند:
  </p>
  <ul>
    <li><code>Access-Control-Allow-Origin</code>: آدرس دامنه فرانت‌اند (مثلاً <code>https://avazamouz.ir</code> یا <code>*</code> در فاز توسعه).</li>
    <li><code>Access-Control-Allow-Methods</code>: <code>GET, POST, PUT, PATCH, DELETE, OPTIONS</code></li>
    <li><code>Access-Control-Allow-Headers</code>: <code>Authorization, Content-Type, Accept, X-Requested-With</code></li>
    <li><code>Access-Control-Allow-Credentials</code>: <code>true</code></li>
  </ul>

  <!-- SECTION 2 -->
  <div class="page-break"></div>
  <h2>۲. معماری حیاتی امنیت ویدیوها و جلوگیری از دانلود غیرمجاز (DRM & Anti-Download)</h2>
  
  <div class="callout callout-danger">
    <span class="callout-title">قانون طلایی امنیت فایل‌های دوره:</span>
    <strong>هرگز و تحت هیچ شرایطی نباید آدرس مستقیم و فایل فیزیکی استاتیک MP4 به کاربر بازگردانده شود!</strong> ارسال آدرس مستقیم <code>.mp4</code> باعث می‌شود هر افزونه دانلودر مرورگر (مانند IDM) با یک کلیک فایل را سرقت کند.
  </div>

  <p>
    فرانت‌اند آکادمی آواز آموز مجهز به پلیر فوق‌امنیتی اختصاصی <strong>(SecureVideoPlayer)</strong> بر پایه کتابخانه <code>hls.js</code> است. این پلیر لایه‌های امنیتی زیر را در کلاینت پیاده کرده است:
  </p>
  <ul>
    <li>مسدودسازی کلیک‌راست و منوی contextmenu مرورگر روی ویدیو.</li>
    <li>توقف خودکار ویدیو به محض باز شدن DevTools یا فشردن کلیدهای F12، Inspect Element و Ctrl+U.</li>
    <li>توقف خودکار ویدیو هنگام تغییر تب مرورگر یا فعال شدن ابزارهای فیلم‌برداری از صفحه (Window Blur & Visibility API).</li>
    <li>پوشش نامرئی (Shield Overlay) جهت عقیم‌سازی کلیک دانلودرهای افزونه‌ای مرورگر.</li>
    <li>پخش استریم‌های رمزنگاری شده HLS AES-128 همراه با تزریق خودکار توکن کاربر به ریکوئست‌های سگمنت و کلید.</li>
  </ul>

  <h3>زنجیره رمزنگاری HLS + AES-128 در بک‌اند (وظیفه سرور):</h3>
  <ol>
    <li>
      <strong>تبدیل ویدیوها به سگمنت‌های رمزنگاری شده HLS:</strong>
      ویدیوهای دوره‌ها باید توسط ابزار <code>ffmpeg</code> به قطعات کوچک چند ثانیه‌ای (سگمنت‌های <code>.ts</code>) تقسیم و با کلید ۱۶ بایتی تصادفی AES-128 رمزنگاری شوند:
      <pre><code>ffmpeg -i lesson.mp4 -c:v h264 -c:a aac -hls_time 6 -hls_playlist_type vod \
-hls_key_info_file key_info.txt -hls_segment_filename "segment_%03d.ts" master.m3u8</code></pre>
    </li>
    <li>
      <strong>محافظت از فایل کلید رمزگشایی (Decryption Key Gate):</strong>
      در فایل <code>key_info.txt</code> آدرس دریافت کلید به اندپوینت اختصاصی بک‌اند متصل می‌شود:
      <pre><code>https://api.yourdomain.ir/api/courses/stream-key/?token=SECURE_SIGNED_TOKEN</code></pre>
    </li>
    <li>
      <strong>منطق تایید دسترسی در اندپوینت کلید (`/stream-key/`):</strong>
      سرور تنها و تنها زمانی مقدار باینری ۱۶ بایتی کلید رمزگشایی را صادر می‌کند که:
      <ul>
        <li>کاربر وارد حساب خود شده باشد (Authorization Token در هدر یا پارامتر Query ارسالی از <code>hls.js</code>).</li>
        <li>کاربر در دیتابیس، دوره مورد نظر را خریده باشد (<code>is_enrolled == true</code>) یا جلسه دارای فلگ <code>is_free_preview == true</code> باشد.</li>
        <li>توکن دارای امضای زمانی معتبر و منقضی‌نشده باشد (مانند توکن‌های HMAC با انقضای ۳۰ دقیقه).</li>
      </ul>
      در غیر این صورت، سرور بلافاصله خطای <strong>403 Forbidden</strong> بازمی‌گرداند. بدین ترتیب حتی اگر شخصی فایل <code>.m3u8</code> یا سگمنت‌های <code>.ts</code> را ذخیره کند، فایل‌ها به صورت دیتای غیرقابل پخش و رمزنگاری‌شده خواهند بود.
    </li>
    <li>
      <strong>عدم افشای فیلد `video_url` برای جلسات قفل‌شده:</strong>
      در اندپوینت دریافت جزئیات دوره (<code>GET /courses/{slug}/</code>)، برای جلساتی که کاربر به آن‌ها دسترسی ندارد، فیلد <code>video_url</code> باید به صورت <code>null</code> یا رشته خالی باشد. آدرس مانیفست استریم فقط و فقط در اندپوینت <code>GET /courses/{slug}/lessons/{id}/</code> پس از راستی‌آزمایی دسترسی دانشجو برگردانده می‌شود.
    </li>
  </ol>

  <!-- SECTION 3 -->
  <div class="page-break"></div>
  <h2>۳. احراز هویت، ورود دوگانه (رمز عبور / پیامک OTP) و مدیریت کاربران</h2>
  <p>
    فرانت‌اند سیستم ورود هوشمندی دارد که به صورت پیش‌فرض <strong>فرم نام کاربری/شماره + رمز عبور</strong> را نمایش می‌دهد و در صورت نیاز کاربر، تب ورود با <strong>کد تایید پیامکی (OTP)</strong> در اختیار او قرار می‌گیرد.
  </p>

  <h3>هدرهای احراز هویت قابل قبول:</h3>
  <p>
    کلاینت به صورت خودکار توکن احراز هویت را در تمامی ریکوئست‌های محافظت‌شده ارسال می‌کند. بک‌اند شما می‌تواند از هر یک از دو استاندارد زیر استفاده کند (فرانت‌اند هر دو را می‌شناسد):
  </p>
  <ul>
    <li><code>Authorization: Bearer &lt;JWT_TOKEN&gt;</code> (معماری JWT)</li>
    <li><code>Authorization: Token &lt;DATABASE_TOKEN_KEY&gt;</code> (معماری توکن جنگو / لاراول)</li>
  </ul>

  <h3>۱. ورود با رمز عبور (Password Login)</h3>
  <div class="badge badge-post">POST</div> <code>/api/accounts/login/</code> | <span class="badge badge-public">عمومی</span>
  <p>کاربر می‌تواند در فیلد شناسه، <strong>نام کاربری</strong> یا <strong>شماره موبایل</strong> خود را وارد کند.</p>
  <pre><code>// Request Body
{
  "identifier": "09121112233",  // فرانت‌اند فیلدهای زیر را نیز همزمان ارسال می‌کند
  "username": "09121112233",
  "phone_number": "09121112233",
  "password": "user_password_123"
}

// Response (HTTP 200 OK)
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b", // یا فیلد "access" در JWT
  "user": {
    "id": 1,
    "username": "student",
    "phone_number": "09121112233",
    "full_name": "محمد رضایی",
    "email": "m.rezaei@example.com",
    "is_staff": false
  }
}</code></pre>

  <h3>۲. ارسال کد تایید پیامکی (Send OTP)</h3>
  <div class="badge badge-post">POST</div> <code>/api/accounts/send-otp/</code> | <span class="badge badge-public">عمومی</span>
  <pre><code>// Request Body
{
  "phone_number": "09121112233" // فرانت‌اند فیلدهای phone و mobile را نیز ارسال می‌کند
}

// Response (HTTP 200 OK)
{
  "success": true,
  "message": "کد تایید با موفقیت پیامک شد.",
  "dev_code": "58214" // فقط در محیط لوکال و DEBUG مجاز است، در پروداکشن ارسال نشود
}</code></pre>

  <div class="callout callout-warning">
    <span class="callout-title">الزامات امنیتی درگاه پیامک OTP در بک‌اند:</span>
    <ul>
      <li><strong>محدودیت نرخ (Rate Limiting):</strong> برای هر شماره موبایل، حداکثر یک درخواست در هر ۲ دقیقه (۱۲۰ ثانیه) مجاز است. در صورت درخواست زودهنگام خطای 429 بازگردانید.</li>
      <li><strong>طول و انقضا:</strong> کد باید ۵ یا ۶ رقم تصادفی بوده و پس از ۱۲۰ ثانیه منقضی شود.</li>
      <li><strong>محافظت Brute-Force:</strong> پس از ۳ تلاش ناموفق برای ورود کد، کد OTP باید منقضی شده و کاربر ملزم به درخواست کد جدید باشد.</li>
    </ul>
  </div>

  <h3>۳. تایید کد پیامکی و ورود / ثبت‌نام خودکار (Verify OTP)</h3>
  <div class="badge badge-post">POST</div> <code>/api/accounts/verify-otp/</code> | <span class="badge badge-public">عمومی</span>
  <p>
    اگر کاربر قبلاً با این شماره ثبت شده بود وارد سیستم شود؛ اگر شماره جدید بود، یک کاربر جدید به صورت خودکار ایجاد و توکن او صادر شود.
  </p>
  <pre><code>// Request Body
{
  "phone_number": "09121112233",
  "code": "58214",
  "full_name": "اختیاری"
}

// Response (HTTP 200 OK)
{
  "token": "jwt_or_database_token_string",
  "user": {
    "id": 1,
    "username": "09121112233",
    "phone_number": "09121112233",
    "full_name": "کاربر آواز آموز",
    "is_staff": false
  }
}</code></pre>

  <h3>۴. دریافت و ویرایش اطلاعات کاربر جاری (Current User Profile)</h3>
  <div class="badge badge-get">GET</div> <div class="badge badge-put">PUT</div> <code>/api/accounts/me/</code> | <span class="badge badge-auth">نیازمند لاگین</span>
  <p>جهت بررسی زنده معتبر بودن توکن در هنگام لود صفحات و همچنین ویرایش نام و ایمیل کاربر در پنل کاربری.</p>
  <pre><code>// GET /api/accounts/me/ -> Response (HTTP 200 OK)
{
  "id": 1,
  "username": "student",
  "phone_number": "09121112233",
  "full_name": "محمد رضایی",
  "email": "m.rezaei@example.com",
  "is_staff": false,
  "date_joined": "2026-03-15T10:00:00Z"
}

// PUT /api/accounts/me/ -> Request Body (جهت به‌روزرسانی پروفایل)
{
  "full_name": "محمد رضایی اصل",
  "email": "new.email@example.com"
}</code></pre>

  <!-- SECTION 4 -->
  <div class="page-break"></div>
  <h2>۴. محتوای داینامیک، تنظیمات برندینگ، لوگو و اینماد</h2>
  <p>
    تمامی متون هیرو، بنر مزایا، اطلاعات تماس، نماد اعتماد الکترونیکی (اینماد)، اطلاعات فوتر و سوالات متداول به شکل داینامیک از بک‌اند خوانده می‌شوند. کلاینت برای جلوگیری از ترافیک اضافی، این مقادیر را در یک کانتکست کلاینتی کش می‌کند.
  </p>

  <h3>تنظیمات اصلی سایت (Site Settings)</h3>
  <div class="badge badge-get">GET</div> <code>/api/core/settings/</code> | <span class="badge badge-public">عمومی</span>
  <pre><code>// Response (HTTP 200 OK)
{
  "site_title": "آواز آموز",
  "logo_url": "https://api.yourdomain.ir/media/site/logo.png", // اگر عکسی آپلود نشده باشد مقدار null ارسال شود
  "hero_badge": "نخستین آکادمی تخصصی آموزش مداحی و صداسازی مذهبی",
  "hero_title": "آموزش اصولی مداحی، فن بیان و صداسازی با اساتید برجسته",
  "hero_subtitle": "از پرورش و تقویت حنجره تا تسلط بر دستگاه‌های آوازی، مقتل‌خوانی، نوحه‌سرایی و مجلس‌داری را به صورت گام‌به‌گام بیاموزید.",
  "features_badge": "چرا آکادمی آواز آموز؟",
  "features_title": "تربیت ذاکران و مداحان اهل‌بیت با اصیل‌ترین متدهای صوتی و معرفتی",
  "features_subtitle": "آموزش‌های کاربردی متناسب با اصول صداسازی علمی، لحن‌شناسی، ادعیه‌خوانی و آداب نوکری به همراه رفع اشکال و تمرین‌های صوتی هدفمند.",
  "contact_phone": "۰۲۱-۹۱۰۰۰۰۰۰",
  "contact_email": "info@avazamouz.ir",
  "telegram_url": "https://t.me/avazamouz",
  "instagram_url": "https://instagram.com/avazamouz",
  "footer_about": "آواز آموز، مرجع تخصصی آموزش نوین و اصولی مداحی، صداسازی و فن بیان مذهبی است. رسالت ما توانمندسازی علاقه‌مندان به ستایشگری اهل‌بیت (ع) با تکیه بر علم صداسازی و اصالت‌های سنتی است.",
  "enamad_html": "&lt;a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/...'&gt;&lt;img src='https://trustseal.enamad.ir/logo.aspx?...' alt='اینماد'&gt;&lt;/a&gt;"
}</code></pre>

  <div class="callout callout-success">
    <span class="callout-title">نکته مهم در رابطه با لوگو:</span>
    اگر در فیلد <code>logo_url</code> مقدار <code>null</code> ارسال شود یا تصویری آپلود نشده باشد، فرانت‌اند به صورت خودکار و یکپارچه، نشان وکتور طراحی‌شده آکادمی آواز آموز را نمایش می‌دهد. به محض اینکه ادمین تصویری در بک‌اند آپلود کند، تصویر او در تمام سایت جایگزین خواهد شد.
  </div>

  <h3>سوالات متداول (FAQs)</h3>
  <div class="badge badge-get">GET</div> <code>/api/core/faqs/</code> | <span class="badge badge-public">عمومی</span>
  <pre><code>// Response (HTTP 200 OK)
[
  {
    "id": 1,
    "question": "آیا برای شرکت در دوره‌ها نیاز به پیش‌زمینه خوانندگی یا مداحی داریم؟",
    "answer": "خیر، دوره‌های سطح مقدماتی از اصول پایه صداسازی، بهداشت حنجره و تنفس دیافراگمی آغاز می‌شوند و برای کلیه علاقه‌مندان مناسب است.",
    "order": 1
  },
  {
    "id": 2,
    "question": "نحوه ارسال تمرین‌های صوتی و رفع اشکال با اساتید چگونه است؟",
    "answer": "هنرجویان می‌توانند پس از مشاهده جلسات، فایل صوتی تمرین خود را در پنل یا پیام‌رسان پشتیبانی ارسال کرده و بازخورد اختصاصی دریافت نمایند.",
    "order": 2
  }
]</code></pre>

  <!-- SECTION 5 -->
  <div class="page-break"></div>
  <h2>۵. مدیریت دوره‌ها، دسته‌بندی‌ها، سرفصل‌ها و جلسات آموزشی</h2>

  <h3>۱. دسته‌بندی‌ها (Categories)</h3>
  <div class="badge badge-get">GET</div> <code>/api/courses/categories/</code> | <span class="badge badge-public">عمومی</span>
  <pre><code>// Response (HTTP 200 OK)
[
  {
    "id": 1,
    "title": "صداسازی و پرورش حنجره",
    "slug": "vocal-training",
    "icon": "Mic", // یکی از آیکون‌های استاندارد: Mic, Music, BookOpen, Volume2, Heart, Radio
    "description": "تقویت عضلات تنفسی، انعطاف تارهای صوتی، پرده‌های صوتی و رفع گرفتگی صدا",
    "courses_count": 3
  },
  {
    "id": 2,
    "title": "دستگاه‌ها و نغمات آوازی",
    "slug": "maqamat-radif",
    "icon": "Music",
    "description": "آموزش ردیف آوازی و الحان سنتی شامل شور، دشتی، بیات اصفهان، همایون و شوشتری در مداحی",
    "courses_count": 2
  }
]</code></pre>

  <h3>۲. بانک دوره‌ها (Courses Catalog & Search)</h3>
  <div class="badge badge-get">GET</div> <code>/api/courses/</code> | <span class="badge badge-public">عمومی (با احتساب توکن جهت وضعیت خرید)</span>
  <p>پارامترهای قابل قبول در Query String:</p>
  <ul>
    <li><code>category=slug</code>: فیلتر بر اساس اسلاگ دسته‌بندی</li>
    <li><code>level=all|beginner|intermediate|advanced</code>: فیلتر سطح دوره</li>
    <li><code>price=free|paid</code>: فیلتر رایگان یا پولی</li>
    <li><code>q=جستجو</code>: جستجو در عنوان، نام استاد، دستگاه آوازی یا خلاصه دوره</li>
  </ul>
  <pre><code>// Response (HTTP 200 OK) - لیستی از دوره‌ها
[
  {
    "id": 1,
    "title": "دوره جامع صداسازی تخصصی مداحی و پرورش حنجره",
    "slug": "mastering-maddahi-vocals",
    "category": {
      "id": 1,
      "title": "صداسازی و پرورش حنجره",
      "slug": "vocal-training"
    },
    "short_description": "آموزش گام‌به‌گام تنفس صحیح دیافراگمی، افزایش دانگ و حجم صدا، تحریرهای سنتی و اوج‌خوانی بدون آسیب به تارهای صوتی.",
    "instructor_name": "استاد حاج مرتضی طاهری",
    "instructor_title": "مدرس عالی صداسازی و ردیف‌های آوازی ستایشگری",
    "duration": "۱۸ ساعت آموزش ویدیویی",
    "lessons_count": 24,
    "rating": 4.9,
    "students_count": 1420,
    "price": 1490000,
    "discount_price": 980000,
    "final_price": 980000,
    "is_free": false,
    "is_sales_enabled": true,
    "cover_image_url": "https://api.yourdomain.ir/media/courses/cover-1.jpg",
    "level": "intermediate", // all, beginner, intermediate, advanced
    "is_enrolled": false // اگر کاربر لاگین باشد و دوره را خریده باشد true ارسال شود
  }
]</code></pre>

  <h3>۳. جزئیات کامل یک دوره و سرفصل‌ها (Course Detail)</h3>
  <div class="badge badge-get">GET</div> <code>/api/courses/{slug}/</code> | <span class="badge badge-public">عمومی</span>
  <p>
    این اندپوینت سرفصل‌ها (Sections) و جلسات (Lessons) زیرمجموعه را بازمی‌گرداند.
  </p>
  <pre><code>// Response (HTTP 200 OK)
{
  "id": 1,
  "title": "دوره جامع صداسازی تخصصی مداحی و پرورش حنجره",
  "slug": "mastering-maddahi-vocals",
  "short_description": "آموزش گام‌به‌گام تنفس صحیح دیافراگمی...",
  "description": "متن کامل و جامع توضیحات دوره همراه با معرفی اساتید و ساختار جلسات...",
  "what_you_will_learn": "تکنیک‌های تنفس دیافراگمی و تسلط بر پرده‌های صوتی\nاجرای تحریرهای مقطع و پیوسته سنتی\nمدیریت حنجره در مجالس طولانی بدون احساس خستگی",
  "instructor_name": "استاد حاج مرتضی طاهری",
  "instructor_title": "مدرس عالی صداسازی و ردیف‌های آوازی ستایشگری",
  "instructor_bio": "بیش از ۳۰ سال سابقه تدریس صداسازی و نغمه‌خوانی آیینی...",
  "duration": "۱۸ ساعت",
  "lessons_count": 24,
  "rating": 4.9,
  "students_count": 1420,
  "price": 1490000,
  "discount_price": 980000,
  "final_price": 980000,
  "is_free": false,
  "is_sales_enabled": true,
  "cover_image_url": "https://api.yourdomain.ir/media/courses/cover-1.jpg",
  "intro_video_url": "https://api.yourdomain.ir/media/hls/intro/master.m3u8", // ویدیوی معرفی رایگان
  "level": "intermediate",
  "is_enrolled": false,
  "sections": [
    {
      "id": 10,
      "title": "فصل اول: فیزیولوژی حنجره و مبانی تنفس دیافراگمی",
      "order": 1,
      "lessons": [
        {
          "id": 101,
          "title": "آشنایی با مکانیزم حنجره و بهداشت صوت در مجالس",
          "order": 1,
          "duration": "۱۸:۴۵",
          "is_free_preview": true, // قابل تماشای رایگان توسط همه
          "has_access": true,
          "video_url": "", // در این اندپوینت عمومی نیازی به پر کردن لینک ویدیو نیست
          "description": "نکات اولیه حفظ سلامت حنجره..."
        },
        {
          "id": 102,
          "title": "تمرینات عملی تنفس دیافراگمی و حبس نفس",
          "order": 2,
          "duration": "۲۴:۱۰",
          "is_free_preview": false,
          "has_access": false
        }
      ]
    }
  ]
}</code></pre>

  <!-- SECTION 6 -->
  <div class="page-break"></div>
  <h2>۶. پخش ویدیو در پلیر اختصاصی (Lesson Watch Player)</h2>
  <div class="badge badge-get">GET</div> <code>/api/courses/{slug}/lessons/{lesson_id}/</code> | <span class="badge badge-auth">محافظت‌شده</span>
  
  <p>
    هنگامی که کاربر وارد اتاق پخش جلسه (صفحه <code>/course/:slug/watch/:lessonId</code>) می‌شود، فرانت‌اند این اندپوینت را فراخوانی می‌کند.
  </p>

  <div class="callout callout-danger">
    <span class="callout-title">بررسی سطح دسترسی (Authorization Gate):</span>
    سرور باید وضعیت کاربر را بررسی کند:
    <ul>
      <li>اگر <code>is_free_preview == true</code> باشد: بدون نیاز به ثبت‌نام دوره، لینک استریم تولید و ارسال شود.</li>
      <li>اگر جلسه پولی باشد: سرور باید بررسی کند آیا کاربر در این دوره ثبت‌نام کرده است یا خیر. در صورت عدم ثبت‌نام، حتماً خطای <strong>403 Forbidden</strong> با پیام فارسی بازگردانده شود:
      <pre><code>// Response (HTTP 403 Forbidden)
{
  "error": "برای تماشای این جلسه آموزشی، ابتدا در دوره ثبت‌نام فرمایید."
}</code></pre>
      </li>
    </ul>
  </div>

  <p>در صورت تایید دسترسی، پاسخ با ساختار زیر ارسال می‌گردد:</p>
  <pre><code>// Response (HTTP 200 OK)
{
  "id": 101,
  "title": "آشنایی با مکانیزم حنجره و بهداشت صوت در مجالس",
  "order": 1,
  "duration": "۱۸:۴۵",
  "description": "در این درس با آناتومی تارهای صوتی و تمرینات جلوگیری از خستگی حنجره آشنا می‌شوید...",
  "video_url": "https://api.yourdomain.ir/media/hls/lesson-101/master.m3u8?token=SIGNED_EXPIRING_HMAC_TOKEN",
  "attachment_url": "https://api.yourdomain.ir/media/attachments/lesson-101-notes.pdf", // اختیاری (فایل جزوه یا صوت تمرین)
  "is_free_preview": true,
  "prev_lesson_id": null,
  "next_lesson_id": 102,
  "course_title": "دوره جامع صداسازی تخصصی مداحی و پرورش حنجره",
  "course_slug": "mastering-maddahi-vocals"
}</code></pre>

  <!-- SECTION 7 -->
  <div class="page-break"></div>
  <h2>۷. فرآیند خرید، صدور فاکتور و اتصال به درگاه پرداخت بانکی (Checkout)</h2>

  <h3>۱. شروع فرآیند خرید (Checkout)</h3>
  <div class="badge badge-post">POST</div> <code>/api/orders/checkout/</code> | <span class="badge badge-auth">نیازمند لاگین</span>
  <pre><code>// Request Body
{
  "course_id": 1
}</code></pre>

  <div class="callout callout-info">
    <span class="callout-title">حالت اول: دوره رایگان یا مبلغ نهایی صفر تومان</span>
    اگر دوره رایگان باشد، نباید به درگاه پرداخت متصل شود؛ بلافاصله رکورد دسترسی (Enrollment) برای دانشجو ایجاد شده و پاسخ موفق بازگردانده می‌شود:
    <pre><code>// Response (HTTP 200 OK)
{
  "success": true,
  "status": "completed",
  "tracking_code": "ORD-FREE-74892",
  "message": "ثبت‌نام شما در دوره رایگان با موفقیت انجام شد."
}</code></pre>
  </div>

  <div class="callout callout-warning">
    <span class="callout-title">حالت دوم: دوره پولی و نیازمند پرداخت بانکی</span>
    یک رکورد سفارش با وضعیت <code>pending</code> ثبت شده و کاربر با آدرس دریافتی به درگاه رسمی متصل می‌شود:
    <pre><code>// Response (HTTP 200 OK)
{
  "success": true,
  "status": "pending",
  "tracking_code": "ORD-140307-8821",
  "payment_url": "https://payment.zarinpal.com/pg/StartPay/000000000000000000000000000000000000"
}</code></pre>
  </div>

  <h3>۲. کال‌بک درگاه بانکی و اعتبارسنجی تراکنش (Payment Verification)</h3>
  <p>
    هنگامی که مشتری در صفحه شاپرک پرداخت را انجام داد، بانک کاربر را به آدرس بازگشت (Callback URL) بک‌اند شما هدایت می‌کند.
  </p>
  <ol>
    <li>
      <strong>استعلام قطعی از وب‌سرویس بانک:</strong>
      بک‌اند حتماً باید متد <code>PaymentVerification</code> را با مرجع پرداخت فراخوانی کند. هرگز به متغیرهای ارسالی در Query String اعتماد نکنید.
    </li>
    <li>
      <strong>ثبت دسترسی دوره در صورت موفقیت:</strong>
      وضعیت سفارش به <code>completed</code> تغییر کرده و دوره به لیست دوره‌های فعال کاربر اضافه می‌شود.
    </li>
    <li>
      <strong>ریدایرکت کاربر به پنل فرانت‌اند:</strong>
      بک‌اند باید مرورگر کاربر را با آدرس و پارامترهای زیر به فرانت‌اند هدایت کند:
      <pre><code>// در صورت موفقیت:
Location: https://avazamouz.ir/dashboard?payment=success&tracking=ORD-140307-8821&course=mastering-maddahi-vocals&enrolled=true

// در صورت انصراف یا خطا:
Location: https://avazamouz.ir/dashboard?payment=failed&tracking=ORD-140307-8821</code></pre>
    </li>
  </ol>

  <h3>۳. دوره‌های خریداری‌شده من (My Courses)</h3>
  <div class="badge badge-get">GET</div> <code>/api/orders/my-courses/</code> (یا <code>/api/courses/my-courses/</code>) | <span class="badge badge-auth">نیازمند لاگین</span>
  <pre><code>// Response (HTTP 200 OK)
[
  {
    "id": 12,
    "enrolled_at": "2026-03-20T14:30:00Z",
    "course": {
      "id": 1,
      "title": "دوره جامع صداسازی تخصصی مداحی و پرورش حنجره",
      "slug": "mastering-maddahi-vocals",
      "cover_image_url": "https://api.yourdomain.ir/media/courses/cover-1.jpg",
      "duration": "۱۸ ساعت",
      "lessons_count": 24,
      "instructor_name": "استاد حاج مرتضی طاهری"
    }
  }
]</code></pre>

  <h3>۴. تاریخچه سفارش‌ها و فاکتورها (My Orders)</h3>
  <div class="badge badge-get">GET</div> <code>/api/orders/my-orders/</code> | <span class="badge badge-auth">نیازمند لاگین</span>
  <pre><code>// Response (HTTP 200 OK)
[
  {
    "id": 48,
    "tracking_code": "ORD-140307-8821",
    "course_title": "دوره جامع صداسازی تخصصی مداحی و پرورش حنجره",
    "course_slug": "mastering-maddahi-vocals",
    "amount": 980000,
    "status": "completed", // completed, pending, canceled
    "created_at": "2026-03-20T14:28:10Z"
  }
]</code></pre>

  <!-- SECTION 8 -->
  <div class="page-break"></div>
  <h2>۸. چک‌لیست جامع امنیتی سمت سرور (Backend Security Checklist)</h2>
  
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">حوزه امنیتی</th>
        <th style="width: 35%;">تهدید یا ریسک بالقوه</th>
        <th style="width: 40%;">دستورالعمل اجرایی در بک‌اند</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>محافظت از فایل‌های ویدیویی</strong></td>
        <td>سرقت مستقیم دوره‌ها با نرم‌افزارهای دانلود منیجر یا اسکریپت‌های وب‌اسکرپینگ</td>
        <td>سگمنت‌بندی HLS + رمزنگاری AES-128 + گیت کنترل دسترسی بر روی اندپوینت صدور کلید رمزگشایی با Signed Token منقضی‌شونده.</td>
      </tr>
      <tr>
        <td><strong>کنترل دسترسی اشیاء (IDOR)</strong></td>
        <td>دسترسی غیرمجاز به فاکتورها، دوره‌ها یا ویرایش مشخصات سایر کاربران با حدس زدن ID</td>
        <td>بررسی مالکیت رکورد در تمام اندپوینت‌ها؛ کاربر تنها باید به رکوردهایی که <code>user_id == request.user.id</code> دارند دسترسی داشته باشد.</td>
      </tr>
      <tr>
        <td><strong>سوءاستفاده از پنل پیامک (SMS Flooding)</strong></td>
        <td>ارسال مکرر پیامک توسط ربات‌ها و ایجاد هزینه‌های سرسام‌آور شارژ پیامک</td>
        <td>اعمال Rate Limit سخت‌گیرانه (۱ پیامک در هر ۲ دقیقه برای هر شماره تلفن و حداکثر ۵ درخواست در ساعت از یک IP).</td>
      </tr>
      <tr>
        <td><strong>تایید تراکنش مالی (Payment Spoofing)</strong></td>
        <td>اعلام موفقیت ساختگی پرداخت با دستکاری مقادیر بازگشتی مرورگر بدون واریز وجه</td>
        <td>استعلام مستقیم از API درگاه با Secret Key سمت سرور و ذخیره کد رهگیری بانک قبل از فعال‌سازی دوره برای کاربر.</td>
      </tr>
      <tr>
        <td><strong>تزریق کد و کوئری (SQL Injection & XSS)</strong></td>
        <td>دستکاری دیتابیس یا اجرای اسکریپت مخرب در متن فیلدها</td>
        <td>استفاده مطلق از ORM استاندارد، پارامترایز کردن کوئری‌ها و Escape کردن فیلدهای ورودی قبل از ذخیره.</td>
      </tr>
      <tr>
        <td><strong>ذخیره‌سازی رمزهای عبور</strong></td>
        <td>لو رفتن پسوردهای کاربران در صورت نشت احتمالی دیتابیس</td>
        <td>استفاده از الگوریتم‌های استاندارد نظیر Argon2 یا PBKDF2 با فاکتور کاری (Work Factor) و Salt تصادفی منحصر به فرد.</td>
      </tr>
      <tr>
        <td><strong>مدیریت پیام‌های خطا (Error Handling)</strong></td>
        <td>افشای ساختار دیتابیس و فریم‌ورک از طریق متن Traceback</td>
        <td>عدم نمایش Stack Trace در حالت پروداکشن و بازگرداندن پاسخ‌های استاندارد JSON با ساختار <code>{"error": "پیام خوانا"}</code>.</td>
      </tr>
    </tbody>
  </table>

  <h3>خلاصه فایل‌های بسته‌بندی فرانت‌اند تحویل‌شده:</h3>
  <ul>
    <li>
      <strong><code>avazamouz-frontend-dist.zip</code>:</strong> پکیج بیلد نهایی و آماده پروداکشن (شامل <code>index.html</code>, <code>assets/</code>, <code>config.js</code>, <code>.htaccess</code>) جهت بارگذاری در هاست لینوکسی، Nginx، Apache یا هاست‌های ابری cPanel.
    </li>
    <li>
      <strong><code>avazamouz-frontend-source.zip</code>:</strong> سورس‌کد کامل پروژه فرانت‌اند بر پایه React 19 + TypeScript جهت اعمال تغییرات احتمالی بعدی.
    </li>
    <li>
      <strong><code>avazamouz-backend-specification.pdf</code>:</strong> نسخه PDF همین مستند فنی جهت تحویل به توسعه‌دهنده بک‌اند.
    </li>
  </ul>

  <div style="margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 8pt; color: #64748b;">
    آکادمی تخصصی آموزش مداحی و صداسازی «آواز آموز» • تمامی حقوق فنی و آموزشی محفوظ است.
  </div>

</body>
</html>
"""

with open('/tmp/backend_doc.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("HTML template written to /tmp/backend_doc.html")

output_pdf = '/home/fadakar/Projects/jahesh-kar/avazamouz-backend-specification.pdf'
cmd = [
    'google-chrome',
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    '--user-data-dir=/tmp/pdf_chrome_profile',
    f'--print-to-pdf={output_pdf}',
    '--no-pdf-header-footer',
    '/tmp/backend_doc.html'
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome return code:", res.returncode)
print("Chrome stderr:", res.stderr)

if os.path.exists(output_pdf):
    size_kb = os.path.getsize(output_pdf) / 1024
    print(f"SUCCESS: Generated PDF at {output_pdf} ({size_kb:.1f} KB)")
else:
    print("ERROR: PDF was not generated.")
