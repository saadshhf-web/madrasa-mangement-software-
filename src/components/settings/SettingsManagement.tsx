import React, { useState, useRef } from 'react';
import { MadrasaSettings, BackupData } from '../../types';
import { DEFAULT_MADRASA_LOGO } from '../../services/storage';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import {
  Settings,
  Image as ImageIcon,
  Upload,
  Trash2,
  Save,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Building,
  RefreshCw,
  Shield,
  Key,
} from 'lucide-react';

interface SettingsManagementProps {
  settings: MadrasaSettings;
  onSaveSettings: (settings: MadrasaSettings) => boolean;
  onSaveLogo: (logoBase64: string) => boolean;
  onDeleteLogo: () => boolean;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => { success: boolean; error?: string; count?: Record<string, number> };
  onClearAllData: () => boolean;
}

export const SettingsManagement: React.FC<SettingsManagementProps> = ({
  settings,
  onSaveSettings,
  onSaveLogo,
  onDeleteLogo,
  onExportBackup,
  onImportBackup,
  onClearAllData,
}) => {
  const [activeTab, setActiveTab] = useState<'logo' | 'info' | 'whatsapp' | 'backup' | 'danger'>('logo');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  // Logo state
  const [previewLogo, setPreviewLogo] = useState<string>(settings.logoUrl);
  const [logoFeedback, setLogoFeedback] = useState<string>('');

  // Madrasa Info State
  const [madrasaName, setMadrasaName] = useState(settings.madrasaName);
  const [arabicName, setArabicName] = useState(settings.arabicName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [address, setAddress] = useState(settings.address);
  const [email, setEmail] = useState(settings.email);
  const [principalName, setPrincipalName] = useState(settings.principalName);
  const [educationDirectorName, setEducationDirectorName] = useState(settings.educationDirectorName);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);

  // WhatsApp Templates State
  const [absenceTemplate, setAbsenceTemplate] = useState(settings.whatsappTemplates.absence);
  const [feeReminderTemplate, setFeeReminderTemplate] = useState(settings.whatsappTemplates.feeReminder);
  const [feeReceiptTemplate, setFeeReceiptTemplate] = useState(settings.whatsappTemplates.feeReceipt);
  const [generalTemplate, setGeneralTemplate] = useState(settings.whatsappTemplates.general);

  // Status feedback
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Clear data confirm modal
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Handle Logo file select via real computer file picker
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type: PNG, JPG, JPEG, WEBP, SVG
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(png|jpe?g|webp|svg)$/i)) {
        alert('براہ کرم درست تصویر منتخب کریں (PNG, JPG, JPEG, WEBP, SVG)');
        return;
      }

      if (file.size > 3 * 1024 * 1024) {
        alert('لوگو کا سائز 3MB سے کم ہونا چاہیے۔');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewLogo(base64);
        setLogoFeedback('نئی تصویر منتخب ہو چکی ہے۔ محفوظ کرنے کے لیے "لوگو محفوظ کریں" پر کلک کریں۔');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogoClick = () => {
    const success = onSaveLogo(previewLogo);
    if (success) {
      setLogoFeedback('لوگو کامیابی سے محفوظ ہو چکا ہے اور تمام دستاویزات پر لاگو ہے۔');
      setTimeout(() => setLogoFeedback(''), 4000);
    } else {
      alert('لوگو محفوظ کرنے میں ناکامی ہوئی۔');
    }
  };

  const handleDeleteLogoClick = () => {
    if (confirm('کیا آپ واقعی لوگو کو ڈیفالٹ پر ری سیٹ کرنا چاہتے ہیں؟')) {
      onDeleteLogo();
      setPreviewLogo(DEFAULT_MADRASA_LOGO);
      setLogoFeedback('لوگو بنیادی ڈیفالٹ پر ری سیٹ کر دیا گیا ہے۔');
      setTimeout(() => setLogoFeedback(''), 4000);
    }
  };

  // Save General Info
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MadrasaSettings = {
      ...settings,
      madrasaName: madrasaName.trim() || 'Madrasa Arabia Madina Tul Uloom',
      arabicName,
      tagline,
      phone,
      whatsapp,
      address,
      email,
      principalName,
      educationDirectorName,
      academicYear,
    };

    const success = onSaveSettings(updated);
    if (success) {
      setStatusMsg({ text: 'مدرسہ کی معلومات کامیابی کے ساتھ محفوظ ہو گئی ہیں۔', type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  // Save WhatsApp Templates
  const handleSaveTemplates = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MadrasaSettings = {
      ...settings,
      whatsappTemplates: {
        absence: absenceTemplate,
        feeReminder: feeReminderTemplate,
        feeReceipt: feeReceiptTemplate,
        general: generalTemplate,
      },
    };

    const success = onSaveSettings(updated);
    if (success) {
      setStatusMsg({ text: 'WhatsApp ٹیمپلیٹس کامیابی کے ساتھ محفوظ ہو گئے ہیں۔', type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  // Handle Restore file import
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const res = onImportBackup(text);
          if (res.success) {
            alert(`بیک اپ کامیابی کے ساتھ بحال ہو گیا!\nطلبہ: ${res.count?.students}، اساتذہ: ${res.count?.teachers}`);
            window.location.reload();
          } else {
            alert(res.error || 'بیک اپ فائل درست نہیں ہے۔');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmClearAll = () => {
    const success = onClearAllData();
    if (success) {
      alert('تمام طلبہ، اساتذہ، حاضری، فیس اور ٹرانزیکشنز کا ڈیٹا کامیابی سے صاف ہو گیا ہے۔ سوفٹ ویئر نئی اینٹریز کے لیے تیار ہے۔');
      window.location.reload();
    }
    setIsClearModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 font-nastaliq leading-relaxed">
            ترتیبات و ڈیٹا مینجمنٹ (Settings & Data)
          </h1>
          <p className="text-xs text-slate-500">
            مدرسہ کا لوگو، رابطہ معلومات، WhatsApp پیغامات کی ترتیبات، بیک اپ اور بحالی
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1 text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('logo')}
          className={`px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
            activeTab === 'logo' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-amber-600" />
          مدرسہ کا لوگو (Logo Management)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
            activeTab === 'info' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Building className="w-4 h-4 text-blue-600" />
          مدرسہ کی تفصیلات
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
            activeTab === 'whatsapp' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          WhatsApp پیغامات کی ترتیبات
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
            activeTab === 'backup' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Download className="w-4 h-4 text-purple-600" />
          بیک اپ اور بحالی (Backup / Restore)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('danger')}
          className={`px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
            activeTab === 'danger' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Trash2 className="w-4 h-4 text-rose-600" />
          ڈیٹا کی صفائی (Data Cleanup)
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* TAB 1: LOGO MANAGEMENT */}
      {activeTab === 'logo' && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              مدرسہ کا لوگو (Madrasa Official Logo)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              اپنے کمپیوٹر سے لوگو منتخب کریں (PNG, JPG, WEBP, SVG)۔ یہ لوگو تمام کشف الدرجات (DMC)،
              شناختی کارڈز اور رسیدوں پر خودکار طریقے سے ظاہر ہوگا۔
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Logo Preview Canvas */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl">
              <span className="text-xs font-bold text-slate-600 mb-3">لوگو پریویو (Logo Preview)</span>
              <div className="w-44 h-44 bg-white rounded-2xl shadow-md border border-slate-200 p-2 flex items-center justify-center overflow-hidden">
                <img
                  src={previewLogo}
                  alt={settings.madrasaName}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-2">
                لوگو کے اصل تناسب (Aspect Ratio) کو برقرار رکھا گیا ہے
              </span>
            </div>

            {/* Action Buttons & Input */}
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                onChange={handleLogoFileChange}
                className="hidden"
              />

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  کمپیوٹر سے لوگو منتخب کریں (Browse Logo)
                </button>

                <p className="text-[11px] text-slate-500 text-center">
                  سپورٹ شدہ فارمیٹس: PNG, JPG, JPEG, WEBP, SVG (زیادہ سے زیادہ 3MB)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveLogoClick}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Save className="w-4 h-4" />
                  لوگو محفوظ کریں
                </button>

                <button
                  type="button"
                  onClick={handleDeleteLogoClick}
                  className="py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  لوگو حذف / ری سیٹ
                </button>
              </div>

              {logoFeedback && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold">
                  {logoFeedback}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MADRASA INFORMATION */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <form onSubmit={handleSaveInfo} className="space-y-4 text-xs text-slate-800">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-700" />
                مدرسہ کے بنیادی کوائف (Institution Info)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  مدرسہ کا سرکاری نام (Madrasa Name)
                </label>
                <input
                  type="text"
                  required
                  value={madrasaName}
                  onChange={(e) => setMadrasaName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">عربی نام</label>
                <input
                  type="text"
                  value={arabicName}
                  onChange={(e) => setArabicName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-arabic text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تعلیمی سال</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رابطہ فون نمبر</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سرکاری WhatsApp نمبر</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ای میل ایڈریس</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-left font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">حضرت مہتمم صاحب کا نام</label>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ناظم تعلیمات کا نام</label>
                <input
                  type="text"
                  value={educationDirectorName}
                  onChange={(e) => setEducationDirectorName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">مکمل پتہ و مقام</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                معلومات محفوظ کریں
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: WHATSAPP TEMPLATES */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <form onSubmit={handleSaveTemplates} className="space-y-6 text-xs text-slate-800">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                WhatsApp پیغام ٹیمپلیٹس کی ترتیبات
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                آپ ان ٹیمپلیٹس میں درج ذیل متغیرات (Variables) استعمال کر سکتے ہیں:{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-900">
                  {'{StudentName}'}
                </code>
                ,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-900">
                  {'{FatherName}'}
                </code>
                ,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-900">
                  {'{Class}'}
                </code>
                ,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-900">
                  {'{Date}'}
                </code>
                ,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-900">
                  {'{Month}'}
                </code>
                ,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-900">
                  {'{TotalFee}'}
                </code>
                ,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-900">
                  {'{Paid}'}
                </code>
                ,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-900">
                  {'{Remaining}'}
                </code>
                ,{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-900">
                  {'{ReceiptNo}'}
                </code>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Absence Template */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <label className="block font-bold text-slate-900 mb-2">
                  1. غیر حاضری کا پیغام (Absence Alert):
                </label>
                <textarea
                  rows={8}
                  value={absenceTemplate}
                  onChange={(e) => setAbsenceTemplate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 font-sans leading-relaxed"
                />
              </div>

              {/* Fee Reminder Template */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <label className="block font-bold text-slate-900 mb-2">
                  2. فیس یاد دہانی کا پیغام (Fee Reminder):
                </label>
                <textarea
                  rows={8}
                  value={feeReminderTemplate}
                  onChange={(e) => setFeeReminderTemplate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 font-sans leading-relaxed"
                />
              </div>

              {/* Fee Receipt Template */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <label className="block font-bold text-slate-900 mb-2">
                  3. فیس ادائیگی رسید کا پیغام (Fee Receipt Confirmation):
                </label>
                <textarea
                  rows={8}
                  value={feeReceiptTemplate}
                  onChange={(e) => setFeeReceiptTemplate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 font-sans leading-relaxed"
                />
              </div>

              {/* General Template */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <label className="block font-bold text-slate-900 mb-2">
                  4. عمومی رابطہ کا پیغام (General Contact Message):
                </label>
                <textarea
                  rows={8}
                  value={generalTemplate}
                  onChange={(e) => setGeneralTemplate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 font-sans leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                ٹیمپلیٹس محفوظ کریں
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
              <Download className="w-5 h-5 text-purple-600" />
              مکمل ڈیٹا بیک اپ اور بحالی (Backup & Restore)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              مدرسہ کا تمام ڈیٹا بشمول طلبہ، عصری تعلیم، اساتذہ، حاضری، فیسیں، اخراجات، امتحانات اور لوگو
              ایک محفوظ فائل (JSON) میں ایکسپورٹ اور دوبارہ امپورٹ کریں۔
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Card */}
            <div className="border border-purple-200 rounded-2xl p-6 bg-purple-50/30 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-purple-950 text-sm mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4 text-purple-700" />
                  ڈیٹا بیک اپ ڈاؤنلوڈ کریں (Export Backup)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  تمام ڈیٹا کی ایک آف لائن کاپی اپنے کمپیوٹر یا یو ایس بی ڈرائیو میں محفوظ کریں۔ یہ فائل
                  کسی بھی وقت دوبارہ استعمال ہو سکتی ہے۔
                </p>
              </div>

              <button
                type="button"
                onClick={onExportBackup}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                بیک اپ فائل ڈاؤنلوڈ کریں (JSON)
              </button>
            </div>

            {/* Import / Restore Card */}
            <div className="border border-blue-200 rounded-2xl p-6 bg-blue-50/30 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-blue-950 text-sm mb-2 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-blue-700" />
                  بیک اپ بحال کریں (Restore Backup)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  پہلے سے محفوظ شدہ بیک اپ JSON فائل منتخب کریں۔ سسٹم فائل کی توثیق کر کے تمام ڈیٹا بحال
                  کر دے گا۔
                </p>
              </div>

              <div>
                <input
                  ref={backupInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleRestoreFile}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => backupInputRef.current?.click()}
                  className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  بیک اپ فائل منتخب کریں (Restore JSON)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DANGER / DATA CLEANUP */}
      {activeTab === 'danger' && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-rose-200 space-y-4">
          <div className="border-b border-rose-100 pb-3">
            <h3 className="text-base font-bold text-rose-800 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              ڈیٹا کی مکمل صفائی (Master Data Cleanup)
            </h3>
            <p className="text-xs text-rose-600 mt-1">
              تمام ٹیسٹ، ڈیمو اور پرانے طلبہ، اساتذہ، حاضری، فیس اور مالی ریکارڈز کو فوری طور پر خالی
              کریں۔ ایپلیکیشن کا ڈھانچہ اور سیٹنگز محفوظ رہیں گی۔
            </p>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
            <div className="text-xs text-slate-800 leading-relaxed">
              <strong>اہم ہدایات: </strong>
              یہ عمل تمام طلبہ، حاضری، فیس، اخراجات، تنخواہیں اور امتحانات کے ریکارڈز کو مٹا کر سسٹم کو
              صفر (خالی) کر دے گا تاکہ آپ اپنی حقیقی اینٹریز شروع کر سکیں۔
            </div>

            <button
              type="button"
              onClick={() => setIsClearModalOpen(true)}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              تمام ریکارڈز صاف کریں (Clear All Records)
            </button>
          </div>
        </div>
      )}

      {/* Confirm Master Data Cleanup Modal */}
      <ConfirmDeleteModal
        isOpen={isClearModalOpen}
        title="تمام ریکارڈز صاف کرنے کی تصدیق"
        message="کیا آپ واقعی تمام ٹیسٹ / ڈیمو ڈیٹا (طلبہ، اساتذہ، فیس، حاضری وغیرہ) مٹانا چاہتے ہیں؟ سسٹم کا اسٹرکچر اور سیٹنگز برقرار رہیں گی اور تمام ٹیبلز خالی ہو جائیں گے۔"
        itemName="تمام طلبہ، اساتذہ، حاضری اور مالیاتی ریکارڈز"
        onConfirm={handleConfirmClearAll}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
};
