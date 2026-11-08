import React, { useState, useEffect, useMemo } from 'react';
import {
  UserPlus,
  Users,
  MessageSquare,
  Trash2,
  Send,
  Search,
  Phone,
  Sun,
  Moon,
  RotateCcw
} from 'lucide-react';

interface Patient {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone: string;
}

const STORAGE_KEY = 'dr_yazdani_crm_patients_v1';
const SMS_TEXT_STORAGE_KEY = 'dr_yazdani_crm_sms_text_v1';
const THEME_STORAGE_KEY = 'dr_yazdani_crm_theme_v1';
const BATCH_SIZE = 30;
const APP_ICON_URL = '/assets/aistudio/1794122480792_5bfe6c5e.png';

const DEFAULT_SMS_MESSAGE =
  'بیمار گرامی، دکتر علیرضا یزدانی در تاریخ ... ساعت ... در بیمارستان سینا اصفهان حضور دارند. جهت هماهنگی ویزیت لطفا پاسخ دهید.';

function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

function normalizePhone(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[^0-9+]/g, '');
}

function getPatientDisplayName(patient: Patient): string {
  if (patient.fullName && patient.fullName.trim()) {
    return patient.fullName.trim();
  }
  return `${patient.firstName || ''} ${patient.lastName || ''}`.trim();
}

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  });

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

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [smsMessage, setSmsMessage] = useState<string>(() => {
    try {
      const savedSms = localStorage.getItem(SMS_TEXT_STORAGE_KEY);
      if (savedSms && savedSms.trim()) return savedSms;
    } catch {
      // ignore storage errors
    }
    return DEFAULT_SMS_MESSAGE;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [iconError, setIconError] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    } catch {
      // ignore storage errors
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem(SMS_TEXT_STORAGE_KEY, smsMessage);
    } catch {
      // ignore storage errors
    }
  }, [smsMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const normalizedPhone = normalizePhone(phone.trim());

    if (!trimmedName || !normalizedPhone) {
      showToast('لطفا نام و نام خانوادگی و شماره موبایل را وارد کنید');
      return;
    }

    const newPatient: Patient = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      fullName: trimmedName,
      phone: normalizedPhone
    };

    setPatients((prev) => [newPatient, ...prev]);
    setFullName('');
    setPhone('');
    showToast(`${trimmedName} ثبت شد`);
  };

  const handleDeletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    showToast('بیمار حذف شد');
  };

  const handleClearAll = () => {
    setPatients([]);
    setConfirmClearAll(false);
    showToast('لیست بیماران پاک شد');
  };

  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return patients;
    const normalizedQ = normalizePhone(q);
    return patients.filter((p) => {
      const name = getPatientDisplayName(p).toLowerCase();
      return (
        name.includes(q) ||
        p.phone.includes(q) ||
        (normalizedQ.length > 0 && p.phone.includes(normalizedQ))
      );
    });
  }, [patients, searchQuery]);

  const patientBatches = useMemo(() => {
    const groups: Patient[][] = [];
    for (let i = 0; i < patients.length; i += BATCH_SIZE) {
      groups.push(patients.slice(i, i + BATCH_SIZE));
    }
    return groups;
  }, [patients]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F4F7F6] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-[#00796B] dark:bg-slate-900 text-white border-b border-[#00695C] dark:border-slate-800 shadow-xs">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/15 shrink-0 flex items-center justify-center border border-white/20">
              {!iconError ? (
                <img
                  src={APP_ICON_URL}
                  alt="Dr Yazdani CRM"
                  referrerPolicy="no-referrer"
                  onError={() => setIconError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="w-5 h-5 text-white" />
              )}
            </div>
            <h1 className="text-xs sm:text-base font-extrabold tracking-tight text-white leading-snug break-words">
              سامانه مدیریت و اطلاع رسانی بیماران، Dr Yazdani CRM
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            aria-label="تغییر حالت شب و روز"
            className="min-w-[42px] min-h-[42px] px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-[#FFB020]" />
                <span className="hidden sm:inline">حالت روز</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span className="hidden sm:inline">حالت شب</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Column 1: Registration + SMS Notification */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 min-w-0">
            {/* 1. Patient Registration Form */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#E0F2F1] dark:bg-teal-950/70 text-[#00796B] dark:text-teal-400 flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                  ثبت بیمار جدید
                </h2>
              </div>

              <form onSubmit={handleAddPatient} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    نام و نام خانوادگی
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: علیرضا محمدی"
                    required
                    className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00796B] dark:focus:border-teal-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
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
                      className="w-full min-h-[46px] pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-left font-mono tabular-nums text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00796B] dark:focus:border-teal-500 outline-none transition-all"
                    />
                    <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFB020] hover:bg-[#F59E0B] active:scale-[0.99] text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 shrink-0" />
                  <span>ثبت و ذخیره بیمار</span>
                </button>
              </form>
            </section>

            {/* 2. Editable SMS Notification & 30-Patient Batch Sender */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E0F2F1] dark:bg-teal-950/70 text-[#00796B] dark:text-teal-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                    ارسال پیامک گروهی
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSmsMessage(DEFAULT_SMS_MESSAGE);
                    showToast('متن پیش‌فرض بازگردانی شد');
                  }}
                  className="px-2.5 py-1.5 min-h-[34px] rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>متن پیش‌فرض</span>
                </button>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label
                    htmlFor="smsMessageInput"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    متن پیامک
                  </label>
                  <textarea
                    id="smsMessageInput"
                    rows={4}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#E0F2F1]/50 dark:bg-slate-800/90 border border-[#B2DFDB] dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 leading-relaxed focus:bg-white dark:focus:bg-slate-800 focus:border-[#00796B] dark:focus:border-teal-500 outline-none transition-all resize-y"
                  />
                </div>

                {/* 30-Patient Batch Buttons */}
                {patientBatches.length > 0 && (
                  <div className="space-y-2 pt-1">
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
                          className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl bg-[#FFB020] hover:bg-[#F59E0B] active:scale-[0.99] text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-between gap-2 shadow-xs transition-all"
                        >
                          <span className="flex items-center gap-1.5 shrink-0">
                            <Send className="w-4 h-4 shrink-0" />
                            <span>ارسال به گروه {groupNumber}</span>
                          </span>
                          <span className="text-xs font-bold text-slate-900/80 tabular-nums truncate">
                            {toPersianDigits(batch.length)} نفر ({startRow} تا {endRow})
                          </span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Column 2: Saved Patient List */}
          <div className="lg:col-span-7 min-w-0">
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E0F2F1] dark:bg-teal-950/70 text-[#00796B] dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                    لیست بیماران ({toPersianDigits(patients.length)})
                  </h2>
                </div>

                {patients.length > 0 && (
                  confirmClearAll ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="px-3 py-1.5 min-h-[38px] rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer"
                      >
                        تایید حذف همه
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmClearAll(false)}
                        className="px-2.5 py-1.5 min-h-[38px] rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        انصراف
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmClearAll(true)}
                      className="px-3 py-1.5 min-h-[38px] rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      حذف همه
                    </button>
                  )
                )}
              </div>

              {/* Search Bar */}
              <div className="relative mb-3.5">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی نام یا شماره موبایل..."
                  className="w-full min-h-[44px] pr-10 pl-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-[#00796B] dark:focus:border-teal-500 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* List */}
              {filteredPatients.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {patients.length === 0
                      ? 'بیماری ثبت نشده است'
                      : 'موردی یافت نشد'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[540px] overflow-y-auto overflow-x-hidden">
                  {filteredPatients.map((patient, idx) => {
                    const groupIdx = Math.floor(idx / BATCH_SIZE) + 1;
                    return (
                      <div
                        key={patient.id}
                        className="py-2.5 px-1 flex items-center justify-between gap-2 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 rounded-xl transition-colors min-w-0"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-full bg-[#E0F2F1] dark:bg-teal-950 text-[#004D40] dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                            {toPersianDigits(idx + 1)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                              {getPatientDisplayName(patient)}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                              <span dir="ltr" className="font-mono tabular-nums text-slate-600 dark:text-slate-300 font-medium">
                                {patient.phone}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>گروه {toPersianDigits(groupIdx)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={`sms:${patient.phone}?body=${encodeURIComponent(smsMessage)}`}
                            title="ارسال پیامک تکی"
                            className="min-w-[40px] min-h-[40px] px-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/80 text-[#00796B] dark:text-teal-300 text-xs font-bold flex items-center justify-center transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeletePatient(patient.id)}
                            aria-label="حذف بیمار"
                            className="min-w-[40px] min-h-[40px] px-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/70 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </main>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] bg-slate-900 dark:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg border border-slate-700 text-center">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
