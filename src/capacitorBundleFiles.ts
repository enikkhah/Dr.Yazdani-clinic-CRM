export const STANDALONE_INDEX_HTML = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#00796B" />
  <title>مطب دکتر علیرضا یزدانی | مدیریت بیماران</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #00796B;
      --primary-dark: #004D40;
      --primary-soft: #E0F2F1;
      --accent: #FFB020;
      --accent-hover: #F59E0B;
      --bg: #F4F7F6;
      --surface: #FFFFFF;
      --text: #0F172A;
      --text-muted: #64748B;
      --border: #E2E8F0;
      --danger: #DC2626;
      --danger-soft: #FEE2E2;
      --radius-lg: 18px;
      --radius-md: 12px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      font-family: 'Vazirmatn', system-ui, -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      direction: rtl;
      line-height: 1.6;
      padding-bottom: 40px;
    }

    /* Header */
    .app-header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: #FFFFFF;
      padding: 18px 20px;
      position: sticky;
      top: 0;
      z-index: 30;
      box-shadow: 0 4px 16px rgba(0, 77, 64, 0.16);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-title {
      font-size: 1.1rem;
      font-weight: 800;
      letter-spacing: -0.01em;
    }

    .brand-subtitle {
      font-size: 0.78rem;
      opacity: 0.88;
      margin-top: 2px;
    }

    .count-stat {
      background: rgba(255, 255, 255, 0.16);
      padding: 6px 12px;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 600;
      white-space: nowrap;
    }

    /* Container */
    .container {
      max-width: 960px;
      margin: 20px auto;
      padding: 0 16px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }

    @media (min-width: 768px) {
      .container {
        grid-template-columns: 1fr 1.1fr;
        align-items: start;
      }
    }

    /* Cards */
    .card {
      background: var(--surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      padding: 20px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
      margin-bottom: 20px;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-desc {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    /* Forms */
    .form-group {
      margin-bottom: 14px;
    }

    .form-label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 6px;
    }

    .form-input {
      width: 100%;
      min-height: 46px;
      padding: 10px 14px;
      font-family: inherit;
      font-size: 0.92rem;
      color: var(--text);
      background-color: #F8FAFC;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      outline: none;
      transition: border-color 0.15s ease, background-color 0.15s ease;
    }

    .form-input:focus {
      background-color: #FFFFFF;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.12);
    }

    .preset-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .preset-btn {
      background: var(--primary-soft);
      color: var(--primary-dark);
      border: none;
      border-radius: 8px;
      padding: 5px 10px;
      font-family: inherit;
      font-size: 0.76rem;
      font-weight: 600;
      cursor: pointer;
    }

    /* Buttons */
    .btn-cta {
      width: 100%;
      min-height: 48px;
      background-color: var(--accent);
      color: #0F172A;
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: 800;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none;
      transition: transform 0.12s ease, background-color 0.15s ease;
      box-shadow: 0 4px 12px rgba(255, 176, 32, 0.25);
    }

    .btn-cta:hover {
      background-color: var(--accent-hover);
    }

    .btn-cta:active {
      transform: scale(0.98);
    }

    .btn-secondary {
      background: #F1F5F9;
      color: #334155;
      border: 1px solid var(--border);
      padding: 6px 12px;
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.76rem;
      font-weight: 600;
      cursor: pointer;
      min-height: 36px;
    }

    /* SMS Preview */
    .sms-preview-box {
      background: var(--primary-soft);
      border: 1px solid #B2DFDB;
      border-radius: var(--radius-md);
      padding: 14px;
      font-size: 0.88rem;
      color: var(--primary-dark);
      line-height: 1.75;
      margin: 14px 0 18px;
    }

    .batch-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .batch-meta {
      font-size: 0.78rem;
      font-weight: 600;
      opacity: 0.85;
    }

    /* Patient List */
    .patient-list {
      list-style: none;
      max-height: 460px;
      overflow-y: auto;
    }

    .patient-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 4px;
      border-bottom: 1px solid #F1F5F9;
      gap: 12px;
    }

    .patient-item:last-child {
      border-bottom: none;
    }

    .patient-info {
      display: flex;
      flex-direction: column;
    }

    .patient-name {
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--text);
    }

    .patient-phone {
      font-size: 0.82rem;
      color: var(--text-muted);
      direction: ltr;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    .btn-delete {
      background: var(--danger-soft);
      color: var(--danger);
      border: none;
      min-width: 44px;
      min-height: 44px;
      padding: 0 12px;
      border-radius: 10px;
      font-family: inherit;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      flex-shrink: 0;
    }

    .empty-state {
      text-align: center;
      padding: 32px 16px;
      color: var(--text-muted);
      font-size: 0.88rem;
    }

    .toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #0F172A;
      color: #FFFFFF;
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 0.84rem;
      font-weight: 600;
      z-index: 50;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }

    .toast.show {
      opacity: 1;
    }
  </style>
</head>
<body>

  <header class="app-header">
    <div>
      <h1 class="brand-title">مطب دکتر علیرضا یزدانی</h1>
      <p class="brand-subtitle">مدیریت بیماران و اطلاع‌رسانی ویزیت اصفهان</p>
    </div>
    <div class="count-stat" id="headerCount">۰ بیمار</div>
  </header>

  <main class="container">
    <!-- Column 1: Registration & SMS Composer -->
    <div>
      <!-- 1. Patient Registration Form -->
      <section class="card">
        <div class="card-title">
          <span>ثبت بیمار جدید</span>
        </div>
        <p class="card-desc">اطلاعات بیمار را جهت ذخیره در حافظه دستگاه وارد نمایید.</p>

        <form id="patientForm">
          <div class="form-group">
            <label class="form-label" for="firstName">نام</label>
            <input class="form-input" type="text" id="firstName" placeholder="مثال: محمد" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="lastName">نام خانوادگی</label>
            <input class="form-input" type="text" id="lastName" placeholder="مثال: کریمی" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="phone">شماره موبایل</label>
            <input class="form-input" type="tel" id="phone" dir="ltr" placeholder="09130000000" required />
          </div>
          <button type="submit" class="btn-cta">ثبت و ذخیره بیمار</button>
        </form>
      </section>

      <!-- 3 & 4 & 5. SMS Composer & Batch Intent Generator -->
      <section class="card">
        <div class="card-title">
          <span>ارسال پیامک گروهی نوبت‌دهی</span>
        </div>
        <p class="card-desc">شماره‌ها به‌صورت خودکار در دسته‌های ۲۰ نفری تقسیم می‌شوند.</p>

        <div class="form-group">
          <label class="form-label" for="visitDate">تاریخ ویزیت</label>
          <input class="form-input" type="text" id="visitDate" placeholder="مثال: سه‌شنبه ۲۵ آبان" value="سه‌شنبه ۲۵ آبان" />
        </div>

        <div class="form-group">
          <label class="form-label" for="visitTime">ساعت حضور</label>
          <input class="form-input" type="text" id="visitTime" placeholder="مثال: ۱۶ الی ۲۰" value="۱۶ الی ۲۰" />
        </div>

        <div class="form-group">
          <label class="form-label" for="hospitalName">نام بیمارستان</label>
          <input class="form-input" type="text" id="hospitalName" placeholder="مثال: بیمارستان سعدی" value="بیمارستان سعدی" />
          <div class="preset-row">
            <button type="button" class="preset-btn" onclick="setHospital('بیمارستان سعدی')">بیمارستان سعدی</button>
            <button type="button" class="preset-btn" onclick="setHospital('بیمارستان میلاد')">بیمارستان میلاد</button>
            <button type="button" class="preset-btn" onclick="setHospital('بیمارستان شریعتی')">بیمارستان شریعتی</button>
            <button type="button" class="preset-btn" onclick="setHospital('بیمارستان الزهرا')">بیمارستان الزهرا</button>
            <button type="button" class="preset-btn" onclick="setHospital('بیمارستان سپاهان')">بیمارستان سپاهان</button>
          </div>
        </div>

        <div class="sms-preview-box" id="smsPreview"></div>

        <div class="batch-grid" id="smsBatchButtons"></div>
      </section>
    </div>

    <!-- Column 2: Saved Patient List -->
    <div>
      <section class="card">
        <div class="card-title">
          <span>لیست بیماران ذخیره‌شده</span>
          <button type="button" class="btn-secondary" id="seedDemoBtn">افزودن ۲۵ بیمار نمونه</button>
        </div>
        <p class="card-desc">مدیریت شماره‌های ثبت‌شده برای ارسال گروهی پیامک</p>

        <div class="form-group">
          <input class="form-input" type="search" id="searchInput" placeholder="جستجوی نام یا شماره موبایل..." />
        </div>

        <ul class="patient-list" id="patientList"></ul>
      </section>
    </div>
  </main>

  <div class="toast" id="toast"></div>

  <script>
    const STORAGE_KEY = 'dr_yazdani_crm_patients_v1';
    const BATCH_SIZE = 20;

    let patients = [];

    const patientForm = document.getElementById('patientForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const phoneInput = document.getElementById('phone');
    const visitDateInput = document.getElementById('visitDate');
    const visitTimeInput = document.getElementById('visitTime');
    const hospitalNameInput = document.getElementById('hospitalName');
    const smsPreviewEl = document.getElementById('smsPreview');
    const smsBatchButtonsEl = document.getElementById('smsBatchButtons');
    const patientListEl = document.getElementById('patientList');
    const headerCountEl = document.getElementById('headerCount');
    const searchInput = document.getElementById('searchInput');
    const seedDemoBtn = document.getElementById('seedDemoBtn');
    const toastEl = document.getElementById('toast');

    function toPersianDigits(num) {
      return String(num).replace(/\\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
    }

    function normalizeDigitsToEnglish(str) {
      return String(str)
        .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
        .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
        .replace(/[^0-9+]/g, '');
    }

    function showToast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      setTimeout(() => toastEl.classList.remove('show'), 2200);
    }

    function loadPatients() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        patients = raw ? JSON.parse(raw) : [];
      } catch (e) {
        patients = [];
      }
    }

    function savePatients() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
      renderAll();
    }

    function setHospital(name) {
      hospitalNameInput.value = name;
      renderSMS();
    }

    function buildSmsMessage() {
      const dateVal = visitDateInput.value.trim() || '[تاریخ]';
      const timeVal = visitTimeInput.value.trim() || '[ساعت]';
      const hospitalVal = hospitalNameInput.value.trim() || '[نام بیمارستان]';
      return \`بیمار گرامی، دکتر علیرضا یزدانی در تاریخ \${dateVal} ساعت \${timeVal} در \${hospitalVal} اصفهان حضور دارند. جهت هماهنگی ویزیت لطفا پاسخ دهید.\`;
    }

    function renderSMS() {
      const message = buildSmsMessage();
      smsPreviewEl.textContent = message;
      smsBatchButtonsEl.innerHTML = '';

      if (patients.length === 0) {
        const emptyInfo = document.createElement('div');
        emptyInfo.className = 'empty-state';
        emptyInfo.style.padding = '12px';
        emptyInfo.textContent = 'ابتدا حداقل یک بیمار ثبت کنید تا دکمه‌های ارسال پیامک فعال شوند.';
        smsBatchButtonsEl.appendChild(emptyInfo);
        return;
      }

      const encodedBody = encodeURIComponent(message);
      const totalGroups = Math.ceil(patients.length / BATCH_SIZE);

      for (let i = 0; i < totalGroups; i++) {
        const start = i * BATCH_SIZE;
        const chunk = patients.slice(start, start + BATCH_SIZE);
        const numbers = chunk.map(p => p.phone).join(',');
        const smsHref = \`sms:\${numbers}?body=\${encodedBody}\`;

        const link = document.createElement('a');
        link.href = smsHref;
        link.className = 'btn-cta';
        const groupNum = toPersianDigits(i + 1);
        const countNum = toPersianDigits(chunk.length);
        const rangeStart = toPersianDigits(start + 1);
        const rangeEnd = toPersianDigits(start + chunk.length);

        link.innerHTML = \`
          <span>ارسال به گروه \${groupNum}</span>
          <span class="batch-meta">(\${countNum} نفر · ردیف \${rangeStart} تا \${rangeEnd})</span>
        \`;
        smsBatchButtonsEl.appendChild(link);
      }
    }

    function deletePatient(id) {
      patients = patients.filter(p => p.id !== id);
      savePatients();
      showToast('بیمار از لیست حذف شد');
    }

    function renderPatientList() {
      const query = searchInput.value.trim().toLowerCase();
      const filtered = patients.filter(p => {
        const full = \`\${p.firstName} \${p.lastName} \${p.phone}\`.toLowerCase();
        return full.includes(query);
      });

      headerCountEl.textContent = \`\${toPersianDigits(patients.length)} بیمار\`;
      patientListEl.innerHTML = '';

      if (filtered.length === 0) {
        const li = document.createElement('li');
        li.className = 'empty-state';
        li.textContent = patients.length === 0
          ? 'هنوز بیماری ثبت نشده است.'
          : 'موردی مطابق جستجوی شما یافت نشد.';
        patientListEl.appendChild(li);
        return;
      }

      filtered.forEach((p, idx) => {
        const li = document.createElement('li');
        li.className = 'patient-item';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'patient-info';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'patient-name';
        nameSpan.textContent = \`\${toPersianDigits(idx + 1)}. \${p.firstName} \${p.lastName}\`;

        const phoneSpan = document.createElement('span');
        phoneSpan.className = 'patient-phone';
        phoneSpan.textContent = p.phone;

        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(phoneSpan);

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'btn-delete';
        delBtn.textContent = 'حذف';
        delBtn.onclick = () => deletePatient(p.id);

        li.appendChild(infoDiv);
        li.appendChild(delBtn);
        patientListEl.appendChild(li);
      });
    }

    function renderAll() {
      renderPatientList();
      renderSMS();
    }

    patientForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const firstName = firstNameInput.value.trim();
      const lastName = lastNameInput.value.trim();
      const phone = normalizeDigitsToEnglish(phoneInput.value.trim());

      if (!firstName || !lastName || !phone) {
        showToast('لطفا تمام فیلدها را تکمیل کنید');
        return;
      }

      patients.unshift({
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
        firstName,
        lastName,
        phone
      });

      firstNameInput.value = '';
      lastNameInput.value = '';
      phoneInput.value = '';
      savePatients();
      showToast('بیمار با موفقیت ثبت شد');
    });

    [visitDateInput, visitTimeInput, hospitalNameInput].forEach(input => {
      input.addEventListener('input', renderSMS);
    });

    searchInput.addEventListener('input', renderPatientList);

    seedDemoBtn.addEventListener('click', function() {
      const sampleFirstNames = ['محمد', 'زهرا', 'علی', 'فاطمه', 'حسین', 'مریم', 'رضا', 'سارا', 'مهدی', 'نرگس', 'امیر', 'ریحانه', 'سعید', 'الهام', 'بهرام', 'مینا', 'پویا', 'شیما', 'کاوه', 'پریسا', 'احسان', 'مهسا', 'فرهاد', 'لیلا', 'آرش'];
      const sampleLastNames = ['رحیمی', 'موسوی', 'جعفری', 'حسینی', 'صادقی', 'مرادی', 'اکبری', 'حیدری', 'قاسمی', 'هاشمی', 'کاظمی', 'رضایی', 'احمدی', 'محمدی', 'طاهری', 'نجفی', 'فلاح', 'شریفی', 'زارعی', 'امینی', 'سلیمانی', 'فتحی', 'کریمی', 'تبریزی', 'اصفهانی'];
      for (let i = 0; i < 25; i++) {
        const suffix = String(1000000 + Math.floor(Math.random() * 8999999));
        patients.push({
          id: Date.now().toString() + '_' + i,
          firstName: sampleFirstNames[i % sampleFirstNames.length],
          lastName: sampleLastNames[i % sampleLastNames.length],
          phone: '0913' + suffix
        });
      }
      savePatients();
      showToast('۲۵ بیمار نمونه جهت تست دسته‌بندی ۲۰تایی اضافه شد');
    });

    loadPatients();
    renderAll();
  </script>
</body>
</html>`;

export const STANDALONE_PACKAGE_JSON = `{
  "name": "dr-yazdani-crm",
  "version": "1.0.0",
  "description": "Minimalist Patient CRM and Batch SMS App for Dr. Alireza Yazdani Clinic in Isfahan",
  "main": "index.html",
  "scripts": {
    "build": "echo \\"Static HTML project ready\\"",
    "cap:add": "npx cap add android",
    "cap:sync": "npx cap sync android"
  },
  "dependencies": {
    "@capacitor/android": "^6.0.0",
    "@capacitor/core": "^6.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^6.0.0"
  }
}`;

export const STANDALONE_CAPACITOR_CONFIG = `{
  "appId": "ir.narvanteam.cliniccrm",
  "appName": "Dr Yazdani CRM",
  "webDir": ".",
  "bundledWebRuntime": false
}`;

export const STANDALONE_GITHUB_WORKFLOW = `name: Build Android APK

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build-apk:
    name: Build Debug APK with Capacitor
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install NPM Dependencies
        run: npm install

      - name: Setup Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Add and Sync Capacitor Android Platform
        run: |
          if [ ! -d "android" ]; then
            npx cap add android
          fi
          npx cap sync android

      - name: Grant Execute Permission for Gradlew
        working-directory: ./android
        run: chmod +x gradlew

      - name: Build Debug APK
        working-directory: ./android
        run: ./gradlew assembleDebug

      - name: Upload Generated APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: Dr-Yazdani-CRM-Debug-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk
          if-no-files-found: error`;
