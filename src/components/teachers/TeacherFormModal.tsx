import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { UserCheck, Upload, X, Save, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Teacher) => { success: boolean; error?: string };
  initialData?: Teacher | null;
  existingTeachers: Teacher[];
}

export const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingTeachers,
}) => {
  const [errorMsg, setErrorMsg] = useState('');

  // Fields
  const [teacherId, setTeacherId] = useState('');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [qualification, setQualification] = useState('');
  const [designation, setDesignation] = useState('');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [branch, setBranch] = useState('حفظ القرآن');
  const [assignedClass, setAssignedClass] = useState('');
  const [salaryType, setSalaryType] = useState<'ماہانہ' | 'گھنٹہ وار' | 'روزانہ'>('ماہانہ');
  const [basicSalary, setBasicSalary] = useState<number>(25000);
  const [bankInfo, setBankInfo] = useState('');
  const [easypaisa, setEasypaisa] = useState('');
  const [jazzcash, setJazzcash] = useState('');
  const [status, setStatus] = useState<'فعال' | 'رخصت پر' | 'سابقہ'>('فعال');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    if (initialData) {
      setTeacherId(initialData.teacherId);
      setName(initialData.name);
      setFatherName(initialData.fatherName);
      setCnic(initialData.cnic);
      setMobile(initialData.mobile);
      setWhatsapp(initialData.whatsapp || initialData.mobile);
      setDob(initialData.dob || '');
      setAddress(initialData.address || '');
      setQualification(initialData.qualification || '');
      setDesignation(initialData.designation || '');
      setJoiningDate(initialData.joiningDate || '');
      setBranch(initialData.branch || 'حفظ القرآن');
      setAssignedClass(initialData.assignedClass || '');
      setSalaryType(initialData.salaryType || 'ماہانہ');
      setBasicSalary(initialData.basicSalary || 0);
      setBankInfo(initialData.bankInfo || '');
      setEasypaisa(initialData.easypaisa || '');
      setJazzcash(initialData.jazzcash || '');
      setStatus(initialData.status || 'فعال');
      setNotes(initialData.notes || '');
      setPhoto(initialData.photo || '');
    } else {
      const nextNum = existingTeachers.length + 1;
      setTeacherId(`TCH-${String(nextNum).padStart(3, '0')}`);
      setName('');
      setFatherName('');
      setCnic('');
      setMobile('');
      setWhatsapp('');
      setDob('');
      setAddress('');
      setQualification('شہادۃ العالمیہ / ایم اے اسلامیات');
      setDesignation('مدرس');
      setJoiningDate(new Date().toISOString().split('T')[0]);
      setBranch('حفظ القرآن');
      setAssignedClass('');
      setSalaryType('ماہانہ');
      setBasicSalary(25000);
      setBankInfo('');
      setEasypaisa('');
      setJazzcash('');
      setStatus('فعال');
      setNotes('');
      setPhoto('');
    }
    setErrorMsg('');
  }, [initialData, existingTeachers, isOpen]);

  if (!isOpen) return null;

  // Format CNIC as user types: XXXXX-XXXXXXX-X
  const handleCnicChange = (val: string) => {
    // Keep only digits
    const digits = val.replace(/\D/g, '').slice(0, 13);
    let formatted = digits;
    if (digits.length > 5 && digits.length <= 12) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else if (digits.length > 12) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
    }
    setCnic(formatted);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('استاد کا نام درج کرنا لازمی ہے۔');
      return;
    }
    if (!fatherName.trim()) {
      setErrorMsg('والد کا نام درج کرنا لازمی ہے۔');
      return;
    }

    // CNIC Validation: exactly 13 digits (format 12345-1234567-1 or 13 digits)
    const cnicDigits = cnic.replace(/\D/g, '');
    if (cnicDigits.length !== 13) {
      setErrorMsg('درست 13 ہندسوں والا شناختی کارڈ نمبر درج کریں۔');
      return;
    }

    if (!mobile.trim()) {
      setErrorMsg('موبائل نمبر درج کرنا لازمی ہے۔');
      return;
    }

    const finalTeacher: Teacher = {
      id: initialData?.id || `TCH-${Date.now()}`,
      teacherId: teacherId.trim(),
      name: name.trim(),
      fatherName: fatherName.trim(),
      cnic: cnic.trim(),
      mobile: mobile.trim(),
      whatsapp: (whatsapp || mobile).trim(),
      dob,
      address,
      qualification,
      designation,
      joiningDate,
      branch,
      assignedClass,
      salaryType,
      basicSalary: Number(basicSalary) || 0,
      bankInfo,
      easypaisa,
      jazzcash,
      status,
      notes,
      photo,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = onSave(finalTeacher);
    if (!res.success) {
      setErrorMsg(res.error || 'ریکارڈ محفوظ نہیں ہو سکا۔ دوبارہ کوشش کریں۔');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-nastaliq leading-relaxed">
                {initialData ? 'استاد کے کوائف میں ترمیم' : 'نئے استاد کا اندراج (Add Teacher)'}
              </h2>
              <p className="text-xs text-slate-300">
                بنیادی ڈیٹا میں درست شناختی کارڈ (CNIC) درج کرنا لازمی ہے
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center gap-2 text-rose-700 text-xs font-bold shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-800 text-xs">
          {/* Top Identifier & Photo */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-5">
            <div className="flex flex-col items-center">
              <div className="w-24 h-28 rounded-xl bg-white border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shadow-xs">
                {photo ? (
                  <img src={photo} alt="تصویر" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <label className="mt-2 px-3 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1">
                <Upload className="w-3 h-3" />
                تصویر منتخب کریں
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  استاد ID <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  شناختی کارڈ نمبر (CNIC No.) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="17301-1234567-1"
                  value={cnic}
                  onChange={(e) => handleCnicChange(e.target.value)}
                  className="w-full border-2 border-blue-800 rounded-lg px-3 py-2 text-slate-900 font-bold text-left font-mono"
                />
                <span className="text-[10px] text-blue-900 font-semibold block mt-1">
                  مثال: 1-1234567-17301 (صرف 13 ہندسے)
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  استاد کا نام <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  والد کا نام <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Contact & Personal */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-1.5">
              رابطہ و ذاتی معلومات
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  موبائل نمبر <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp نمبر</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="w-full border border-emerald-300 rounded-lg px-3 py-2 text-slate-900 bg-emerald-50/20 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تاریخ پیدائش</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">مستقل پتہ</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="گاؤں، ڈاکخانہ، تحصیل، ضلع"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Academic & Designation */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-1.5">
              عہدہ و شعبہ جاتی تفصیلات
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">تعلیمی قابلیت</label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="شہادۃ العالمیہ / وفاق المدارس"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">عہدہ / ڈیزگنیشن</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="استاد الحدیث / قاری / ناظم"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تاریخ شمولیت</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">شعبہ</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                >
                  <option value="حفظ القرآن">حفظ القرآن</option>
                  <option value="تجوید للحفاظ">تجوید للحفاظ</option>
                  <option value="درس نظامی">درس نظامی</option>
                  <option value="انتظامیہ">انتظامیہ / دفتر</option>
                  <option value="دیگر">دیگر</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">مختص کلاس / درجہ</label>
                <input
                  type="text"
                  value={assignedClass}
                  onChange={(e) => setAssignedClass(e.target.value)}
                  placeholder="مثلاً سال سوم، دورۂ حدیث"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">حیثیت (Status)</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white font-bold"
                >
                  <option value="فعال">فعال (Active)</option>
                  <option value="رخصت پر">رخصت پر (On Leave)</option>
                  <option value="سابقہ">سابقہ (Relieved)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary & Bank details */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-amber-50/20">
            <h3 className="font-bold text-slate-800 text-sm border-b border-amber-200 pb-1.5">
              تنخواہ و ادائیگی کے اکاؤنٹس
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">بنیادی تنخواہ (روپے)</label>
                <input
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تنخواہ کی نوعیت</label>
                <select
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                >
                  <option value="ماہانہ">ماہانہ (Monthly)</option>
                  <option value="گھنٹہ وار">گھنٹہ وار (Hourly)</option>
                  <option value="روزانہ">روزانہ (Daily)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">بینک اکاؤنٹ کی تفصیل</label>
                <input
                  type="text"
                  value={bankInfo}
                  onChange={(e) => setBankInfo(e.target.value)}
                  placeholder="بینک کا نام اور اکاؤنٹ نمبر"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">EasyPaisa نمبر</label>
                <input
                  type="text"
                  value={easypaisa}
                  onChange={(e) => setEasypaisa(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">JazzCash نمبر</label>
                <input
                  type="text"
                  value={jazzcash}
                  onChange={(e) => setJazzcash(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">خصوصی نوٹس / ریمارکس</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="دیگر معلومات..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              منسوخ کریں
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              محفوظ کریں (Save Teacher)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
