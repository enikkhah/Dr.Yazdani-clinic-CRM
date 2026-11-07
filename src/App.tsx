import React, { useState, useEffect, useMemo } from 'react';
import {
  UserPlus,
  Users,
  MessageSquare,
  Trash2,
  Send,
  Search,
  Copy,
  Check,
  Code2,
  Building2,
  Calendar,
  Clock,
  Phone,
  Sparkles,
  Download
} from 'lucide-react';
import {
  STANDALONE_INDEX_HTML,
  STANDALONE_PACKAGE_JSON,
  STANDALONE_CAPACITOR_CONFIG,
  STANDALONE_GITHUB_WORKFLOW
} from './capacitorBundleFiles';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const STORAGE_KEY = 'dr_yazdani_crm_patients_v1';
const BATCH_SIZE = 20;

const ISFAHAN_HOSPITALS = [
  'بیمارستان سعدی',
  'بیمارستان میلاد',
  'بیمارستان شریعتی',
  'بیمارستان الزهرا',
  'بیمارستان سپاهان',
  'بیمارستان خانواده'
];

function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

function normalizePhone(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[^0-9+]/g, '');
}

export default function App() {
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [visitDate, setVisitDate] = useState('سه‌شنبه ۲۵ آبان');
  const [visitTime, setVisitTime] = useState('۱۶ الی ۲۰');
  const [hospital, setHospital] = useState('بیمارستان سعدی');

  const [activeView, setActiveView] = useState<'crm' | 'github'>('crm');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    } catch {
      // ignore storage errors
    }
  }, [patients]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const normalizedPhone = normalizePhone(phone.trim());

    if (!trimmedFirst || !trimmedLast || !normalizedPhone) {
      showToast('لطفا نام، نام خانوادگی و شماره موبایل را کامل وارد کنید');
      return;
    }

    const newPatient: Patient = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      firstName: trimmedFirst,
      lastName: trimmedLast,
      phone: normalizedPhone
    };

    setPatients((prev) => [newPatient, ...prev]);
    setFirstName('');
    setLastName('');
    setPhone('');
    showToast(`${trimmedFirst} ${trimmedLast} در لیست بیماران ذخیره شد`);
  };

  const handleDeletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    showToast('بیمار از لیست حذف شد');
  };

  const handleSeedDemoPatients = () => {
    const firstNames = [
      'محمد', 'زهرا', 'علی', 'فاطمه', 'حسین', 'مریم', 'رضا', 'سارا',
      'مهدی', 'نرگس', 'امیر', 'ریحانه', 'سعید', 'الهام', 'بهرام', 'مینا',
      'پویا', 'شیما', 'کاوه', 'پریسا', 'احسان', 'مهسا', 'فرهاد', 'لیلا', 'آرش'
    ];
    const lastNames = [
      'رحیمی', 'موسوی', 'جعفری', 'حسینی', 'صادقی', 'مرادی', 'اکبری', 'حیدری',
      'قاسمی', 'هاشمی', 'کاظمی', 'رضایی', 'احمدی', 'محمدی', 'طاهری', 'نجفی',
      'فلاح', 'شریفی', 'زارعی', 'امینی', 'سلیمانی', 'فتحی', 'کریمی', 'تبریزی', 'اصفهانی'
    ];

    const demoBatch: Patient[] = Array.from({ length: 25 }, (_, i) => {
      const random7 = String(1000000 + Math.floor(Math.random() * 8999999));
      return {
        id: `${Date.now()}_demo_${i}`,
        firstName: firstNames[i % firstNames.length],
        lastName: lastNames[i % lastNames.length],
        phone: `0913${random7}`
      };
    });

    setPatients((prev) => [...demoBatch, ...prev]);
    showToast('۲۵ بیمار نمونه جهت تست ارسال گروهی ۲۰تایی اضافه شدند');
  };

  const handleClearAll = () => {
    setPatients([]);
    setConfirmClearAll(false);
    showToast('تمامی بیماران از حافظه پاک شدند');
  };

  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return patients;
    const normalizedQ = normalizePhone(q);
    return patients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      return (
        fullName.includes(q) ||
        p.phone.includes(q) ||
        (normalizedQ.length > 0 && p.phone.includes(normalizedQ))
      );
    });
  }, [patients, searchQuery]);

  const smsMessage = useMemo(() => {
    const d = visitDate.trim() || '[تاریخ]';
    const t = visitTime.trim() || '[ساعت]';
    const h = hospital.trim() || '[نام بیمارستان]';
    return `بیمار گرامی، دکتر علیرضا یزدانی در تاریخ ${d} ساعت ${t} در ${h} اصفهان حضور دارند. جهت هماهنگی ویزیت لطفا پاسخ دهید.`;
  }, [visitDate, visitTime, hospital]);

  const patientBatches = useMemo(() => {
    const groups: Patient[][] = [];
    for (let i = 0; i < patients.length; i += BATCH_SIZE) {
      groups.push(patients.slice(i, i + BATCH_SIZE));
    }
    return groups;
  }, [patients]);

  const repoFiles = useMemo(
    () => [
      {
        id: 'file-1',
        title: 'FILE 1: index.html',
        path: 'index.html',
        description: 'کل منطق، رابط کاربری فارسی (RTL) و ذخیره‌سازی localStorage در یک فایل مستقل',
        content: STANDALONE_INDEX_HTML
      },
      {
        id: 'file-2',
        title: 'FILE 2: package.json',
        path: 'package.json',
        description: 'پیکربندی استاندارد Capacitor شامل @capacitor/core، @capacitor/cli و @capacitor/android',
        content: STANDALONE_PACKAGE_JSON
      },
      {
        id: 'file-3',
        title: 'FILE 3: capacitor.config.json',
        path: 'capacitor.config.json',
        description: 'تنظیمات شناسه اپلیکیشن ir.narvanteam.cliniccrm و پوشه وب ریشه (.)',
        content: STANDALONE_CAPACITOR_CONFIG
      },
      {
        id: 'file-4',
        title: 'FILE 4: .github/workflows/build.yml',
        path: '.github/workflows/build.yml',
        description: 'فایل GitHub Actions جهت کامپایل خودکار APK با JDK 17 و آپلود در بخش Artifacts',
        content: STANDALONE_GITHUB_WORKFLOW
      }
    ],
    []
  );

  const handleCopyText = async (key: string, text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      showToast(`${label} در کلیپ‌بورد کپی شد`);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 2000);
    } catch {
      showToast('خطا در کپی خودکار؛ لطفا متن را انتخاب و کپی کنید');
    }
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.split('/').pop() || filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`فایل ${filename} دانلود شد`);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-slate-900 flex flex-col">
      {/* Top Bar following clean 3-zone contract */}
      <header className="sticky top-0 z-30 bg-[#00796B] text-white border-b border-[#00695C] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Title */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('crm');
            }}
            className="text-base sm:text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            مطب دکتر علیرضا یزدانی
          </a>

          {/* Zone 2: Navigation links */}
          <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-teal-100">
            <button
              type="button"
              onClick={() => setActiveView('crm')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'crm'
                  ? 'text-white font-bold underline underline-offset-8 decoration-[#FFB020] decoration-2'
                  : 'hover:text-white'
              }`}
            >
              پنل مدیریت و پیامک
            </button>
            <button
              type="button"
              onClick={() => setActiveView('github')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'github'
                  ? 'text-white font-bold underline underline-offset-8 decoration-[#FFB020] decoration-2'
                  : 'hover:text-white'
              }`}
            >
              فایل‌های گیت‌هاب (APK)
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setActiveView(activeView === 'crm' ? 'github' : 'crm')}
              className="px-3.5 py-2 min-h-[38px] rounded-xl bg-[#FFB020] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <Code2 className="w-4 h-4" />
              <span>{activeView === 'crm' ? 'کدهای ساخت APK' : 'بازگشت به CRM'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Top Summary Strip */}
        <div className="mb-6 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#004D40]">
              سامانه مدیریت بیماران و نوبت‌دهی بیمارستان‌های اصفهان
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              ذخیره آفلاین در حافظه گوشی (localStorage) · دسته‌بندی خودکار ۲۰تایی جهت ارسال پیامک گروهی
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-700 font-medium">
            <span>
              کل بیماران: <strong className="text-[#00796B] font-extrabold tabular-nums">{toPersianDigits(patients.length)}</strong> نفر
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              گروه‌های ۲۰تایی پیامک: <strong className="text-[#00796B] font-extrabold tabular-nums">{toPersianDigits(patientBatches.length)}</strong> گروه
            </span>
          </div>
        </div>

        {activeView === 'crm' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Right Column in RTL: Patient Registration + SMS Composer */}
            <div className="lg:col-span-5 space-y-6">
              {/* Feature 1: Patient Registration Form */}
              <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E0F2F1] text-[#00796B] flex items-center justify-center shrink-0">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">ثبت بیمار جدید</h2>
                      <p className="text-xs text-slate-500">افزودن مشخصات بیمار به لیست مخاطبین مطب</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 mb-1.5">
                      نام
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="مثال: علیرضا"
                      required
                      className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#00796B] focus:ring-3 focus:ring-[#00796B]/15 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-xs font-bold text-slate-700 mb-1.5">
                      نام خانوادگی
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="مثال: محمدی"
                      required
                      className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#00796B] focus:ring-3 focus:ring-[#00796B]/15 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                      شماره موبایل
                    </label>
                    <div className="relative">
                      <input
                        id="phone"
                        type="tel"
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09131234567"
                        required
                        className="w-full min-h-[46px] pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-left font-mono tabular-nums text-slate-900 focus:bg-white focus:border-[#00796B] focus:ring-3 focus:ring-[#00796B]/15 outline-none transition-all"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#FFB020] hover:bg-[#F59E0B] active:scale-[0.99] text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>ثبت و ذخیره بیمار</span>
                  </button>
                </form>
              </section>

              {/* Feature 3, 4, 5: SMS Composer & 20-Patient Batch Intent Generator */}
              <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E0F2F1] text-[#00796B] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">تنظیم و ارسال پیامک گروهی</h2>
                    <p className="text-xs text-slate-500">اطلاع‌رسانی حضور دکتر علیرضا یزدانی در بیمارستان‌های اصفهان</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="visitDate" className="block text-xs font-bold text-slate-700 mb-1.5">
                      تاریخ ویزیت
                    </label>
                    <div className="relative">
                      <input
                        id="visitDate"
                        type="text"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        placeholder="مثال: سه‌شنبه ۲۵ آبان"
                        className="w-full min-h-[46px] pr-10 pl-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#00796B] focus:ring-3 focus:ring-[#00796B]/15 outline-none transition-all"
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="visitTime" className="block text-xs font-bold text-slate-700 mb-1.5">
                      ساعت حضور
                    </label>
                    <div className="relative">
                      <input
                        id="visitTime"
                        type="text"
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        placeholder="مثال: ۱۶ الی ۲۰"
                        className="w-full min-h-[46px] pr-10 pl-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#00796B] focus:ring-3 focus:ring-[#00796B]/15 outline-none transition-all"
                      />
                      <Clock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="hospitalName" className="block text-xs font-bold text-slate-700 mb-1.5">
                      نام بیمارستان (اصفهان)
                    </label>
                    <div className="relative">
                      <input
                        id="hospitalName"
                        type="text"
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                        placeholder="مثال: بیمارستان سعدی"
                        className="w-full min-h-[46px] pr-10 pl-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#00796B] focus:ring-3 focus:ring-[#00796B]/15 outline-none transition-all"
                      />
                      <Building2 className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Quick Isfahan Hospital Filter/Selector Buttons */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {ISFAHAN_HOSPITALS.map((hosp) => (
                        <button
                          key={hosp}
                          type="button"
                          onClick={() => setHospital(hosp)}
                          className={`px-2.5 py-1.5 min-h-[34px] rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            hospital === hosp
                              ? 'bg-[#00796B] text-white'
                              : 'bg-[#E0F2F1]/70 text-[#004D40] hover:bg-[#E0F2F1]'
                          }`}
                        >
                          {hosp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generated SMS Preview */}
                  <div className="rounded-xl bg-[#E0F2F1]/60 border border-[#B2DFDB] p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#004D40]">پیش‌نمایش متن پیامک ارسالی:</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText('sms-body', smsMessage, 'متن پیامک')}
                        className="text-xs font-semibold text-[#00796B] hover:text-[#004D40] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'sms-body' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>کپی متن</span>
                      </button>
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {smsMessage}
                    </p>
                  </div>

                  {/* Dynamic 20-Patient Batch Intent Buttons */}
                  <div className="pt-2 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-bold text-slate-800">دکمه‌های ارسال گروهی (دسته‌های ۲۰ نفری):</span>
                      <span className="tabular-nums">{toPersianDigits(patients.length)} مخاطب</span>
                    </div>

                    {patientBatches.length === 0 ? (
                      <div className="rounded-xl bg-slate-50 border border-dashed border-slate-300 p-4 text-center">
                        <p className="text-xs text-slate-500 mb-2.5">
                          هنوز بیماری در لیست وجود ندارد. جهت تست دسته‌بندی ۲۰تایی، یک بیمار ثبت کنید یا دکمه زیر را بزنید:
                        </p>
                        <button
                          type="button"
                          onClick={handleSeedDemoPatients}
                          className="px-3.5 py-2 min-h-[40px] rounded-xl bg-[#00796B] hover:bg-[#00695C] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>افزودن ۲۵ بیمار نمونه برای تست گروه ۱ و ۲</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {patientBatches.map((batch, index) => {
                          const numbersList = batch.map((p) => p.phone).join(',');
                          const smsUri = `sms:${numbersList}?body=${encodeURIComponent(smsMessage)}`;
                          const groupNumber = toPersianDigits(index + 1);
                          const startRow = toPersianDigits(index * BATCH_SIZE + 1);
                          const endRow = toPersianDigits(index * BATCH_SIZE + batch.length);

                          return (
                            <a
                              key={index}
                              href={smsUri}
                              className="w-full min-h-[50px] px-4 py-3 rounded-xl bg-[#FFB020] hover:bg-[#F59E0B] active:scale-[0.99] text-slate-950 font-extrabold text-sm flex items-center justify-between shadow-sm transition-all"
                            >
                              <span className="flex items-center gap-2 whitespace-nowrap">
                                <Send className="w-4 h-4 shrink-0" />
                                <span>ارسال به گروه {groupNumber}</span>
                              </span>
                              <span className="text-xs font-bold text-slate-900/80 tabular-nums whitespace-nowrap">
                                {toPersianDigits(batch.length)} نفر · ردیف {startRow} تا {endRow}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Left Column in RTL: Patient List & Management */}
            <div className="lg:col-span-7">
              <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E0F2F1] text-[#00796B] flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">لیست بیماران ذخیره‌شده</h2>
                      <p className="text-xs text-slate-500">
                        نمایش {toPersianDigits(filteredPatients.length)} از {toPersianDigits(patients.length)} بیمار ثبت‌شده
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSeedDemoPatients}
                      className="px-3 py-2 min-h-[40px] rounded-xl bg-[#E0F2F1] hover:bg-[#B2DFDB] text-[#004D40] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>افزودن ۲۵ بیمار نمونه</span>
                    </button>

                    {patients.length > 0 && (
                      confirmClearAll ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleClearAll}
                            className="px-3 py-2 min-h-[40px] rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                          >
                            تایید حذف همه
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmClearAll(false)}
                            className="px-2.5 py-2 min-h-[40px] rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer whitespace-nowrap"
                          >
                            انصراف
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmClearAll(true)}
                          className="px-3 py-2 min-h-[40px] rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                        >
                          پاکسازی لیست
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative mb-4">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجو بر اساس نام، نام خانوادگی یا شماره موبایل..."
                    className="w-full min-h-[46px] pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:border-[#00796B] focus:ring-3 focus:ring-[#00796B]/15 outline-none transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Patient List Rows */}
                {filteredPatients.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-xl bg-slate-50 border border-slate-200/60">
                    <Users className="w-10 h-10 text-slate-400 mx-auto mb-2.5 stroke-[1.5]" />
                    <p className="text-sm font-bold text-slate-700">
                      {patients.length === 0
                        ? 'لیست بیماران خالی است'
                        : 'هیچ بیماری با عبارت جستجو شده مطابقت ندارد'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      از فرم ثبت بیمار جدید استفاده کنید یا ۲۵ بیمار نمونه را جهت آزمایش اضافه نمایید.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto pr-1">
                    {filteredPatients.map((patient, idx) => {
                      const groupIdx = Math.floor(idx / BATCH_SIZE) + 1;
                      return (
                        <div
                          key={patient.id}
                          className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-[#E0F2F1] text-[#004D40] font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                              {toPersianDigits(idx + 1)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-slate-900 truncate">
                                {patient.firstName} {patient.lastName}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <span dir="ltr" className="font-mono tabular-nums text-slate-600 font-medium">
                                  {patient.phone}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>گروه پیامکی {toPersianDigits(groupIdx)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href={`sms:${patient.phone}?body=${encodeURIComponent(smsMessage)}`}
                              title="ارسال پیامک تکی"
                              className="min-w-[44px] min-h-[44px] px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#00796B] text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">پیامک</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeletePatient(patient.id)}
                              className="min-w-[44px] min-h-[44px] px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : (
          /* GitHub & Capacitor APK Export View for Mobile Workflow */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mb-2">
                ۴ فایل آماده کپی در گیت‌هاب جهت ساخت خودکار APK (مخصوص موبایل)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                هر یک از ۴ فایل زیر را با یک لمس کپی کرده و مستقیماً در مخزن GitHub خود قرار دهید. پس از Push در شاخه <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">main</code>، سرویس GitHub Actions به صورت خودکار فایل نصبی اندروید (<code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">app-debug.apk</code>) را در بخش Artifacts تولید می‌کند.
              </p>

              {/* File Selector Tabs */}
              <div className="flex flex-wrap gap-2 mt-5">
                {repoFiles.map((file, idx) => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedFileIndex === idx
                        ? 'bg-[#00796B] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span dir="ltr">{file.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active File Code Viewer & One-Tap Copy */}
            {repoFiles[selectedFileIndex] && (
              <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
                <div className="p-4 sm:px-6 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div dir="ltr" className="font-mono text-sm font-bold text-[#FFB020]">
                      {repoFiles[selectedFileIndex].path}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {repoFiles[selectedFileIndex].description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadFile(
                          repoFiles[selectedFileIndex].path,
                          repoFiles[selectedFileIndex].content
                        )
                      }
                      className="px-3.5 py-2 min-h-[42px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      <span>دانلود فایل</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          repoFiles[selectedFileIndex].id,
                          repoFiles[selectedFileIndex].content,
                          repoFiles[selectedFileIndex].path
                        )
                      }
                      className="px-4 py-2 min-h-[42px] rounded-xl bg-[#FFB020] hover:bg-[#F59E0B] text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {copiedKey === repoFiles[selectedFileIndex].id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>کپی شد!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>کپی کامل کد</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <pre
                  dir="ltr"
                  className="p-4 sm:p-6 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto max-h-[540px] text-slate-200"
                >
                  <code>{repoFiles[selectedFileIndex].content}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg border border-slate-700 whitespace-nowrap">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
