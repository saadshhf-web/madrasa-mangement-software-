import React, { useState, useEffect } from 'react';
import { Student, ModernEducationInfo, HifzInfo, TajweedInfo } from '../../types';
import {
  User,
  GraduationCap,
  BookOpen,
  Upload,
  X,
  Save,
  AlertCircle,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => { success: boolean; error?: string };
  initialData?: Student | null;
  existingStudents: Student[];
}

export const DARS_E_NIZAMI_CLASSES = [
  'اولیٰ (العام الاول)',
  'ثانیہ (العام الثانی)',
  'ثالثہ (العام الثالث)',
  'رابعہ (العام الرابع)',
  'خامسہ (العام الخامس)',
  'سادسہ (العالیہ)',
  'سابعہ (العالمیہ اول)',
  'ثامنہ (دورۂ حدیث شریف)',
];

export const MODERN_EDUCATION_LEVELS = [
  'نرسری',
  'کے جی',
  'جماعت اول',
  'جماعت دوم',
  'جماعت سوم',
  'جماعت چہارم',
  'جماعت پنجم',
  'جماعت ششم',
  'جماعت ہفتم',
  'جماعت ہشتم',
  'جماعت نہم (9th)',
  'جماعت دہم (Matric 10th)',
  'ایف اے (FA)',
  'ایف ایس سی (FSc)',
  'آئی سی ایس (ICS)',
  'آئی کام (I.Com)',
  'بی اے (BA)',
  'بی ایس (BS)',
  'بی کام (B.Com)',
  'ایم اے (MA)',
  'ایم ایس / ایم فل (MS/MPhil)',
  'دیگر',
];

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingStudents,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'modern' | 'branch_specific'>('basic');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [studentId, setStudentId] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [dob, setDob] = useState('');
  const [cnicOrBForm, setCnicOrBForm] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [address, setAddress] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('والد');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianAddress, setGuardianAddress] = useState('');
  const [guardianOccupation, setGuardianOccupation] = useState('');
  const [photo, setPhoto] = useState('');
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [branch, setBranch] = useState<'حفظ القرآن' | 'تجوید للحفاظ' | 'درس نظامی' | 'دیگر'>('حفظ القرآن');
  const [darja, setDarja] = useState('');
  const [section, setSection] = useState('الف');
  const [academicYear, setAcademicYear] = useState('1447-1448ھ / 2026-2027');
  const [status, setStatus] = useState<'فعال' | 'فارغ التحصیل' | 'خارج شدہ' | 'رخصت پر'>('فعال');
  const [notes, setNotes] = useState('');

  // Hifz Fields
  const [hifzStartDate, setHifzStartDate] = useState('');
  const [hifzCurrentPara, setHifzCurrentPara] = useState<number>(1);
  const [hifzCompletedParas, setHifzCompletedParas] = useState<number>(0);
  const [hifzManzil, setHifzManzil] = useState('');
  const [hifzSabaq, setHifzSabaq] = useState('');
  const [hifzSabqi, setHifzSabqi] = useState('');
  const [hifzPerformance, setHifzPerformance] = useState('بہتر');
  const [hifzComments, setHifzComments] = useState('');

  // Tajweed Fields
  const [tajweedCurrentPara, setTajweedCurrentPara] = useState<number>(1);
  const [tajweedCompletedParas, setTajweedCompletedParas] = useState<number>(0);
  const [tajweedLevel, setTajweedLevel] = useState('مبتدی');
  const [tajweedSabaq, setTajweedSabaq] = useState('');
  const [tajweedSabqi, setTajweedSabqi] = useState('');
  const [tajweedManzil, setTajweedManzil] = useState('');
  const [tajweedMistakes, setTajweedMistakes] = useState('');
  const [tajweedComments, setTajweedComments] = useState('');
  const [tajweedMonthlyAssessment, setTajweedMonthlyAssessment] = useState<any>('بہت اچھا');
  const [tajweedAnnualAssessment, setTajweedAnnualAssessment] = useState<any>('بہت اچھا');

  // Modern Education (عصری تعلیم)
  const [modernStatus, setModernStatus] = useState<'زیرِ تعلیم' | 'مکمل' | 'نہیں پڑھ رہا' | ''>('نہیں پڑھ رہا');
  const [modernLevel, setModernLevel] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [boardOrUniversity, setBoardOrUniversity] = useState('');
  const [modernRollNumber, setModernRollNumber] = useState('');
  const [modernAcademicYear, setModernAcademicYear] = useState('');
  const [lastCompletedClass, setLastCompletedClass] = useState('');
  const [lastExamResult, setLastExamResult] = useState('');
  const [modernSubjects, setModernSubjects] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [modernCity, setModernCity] = useState('');
  const [certificateDoc, setCertificateDoc] = useState('');

  // Reset or load initial data
  useEffect(() => {
    if (initialData) {
      setStudentId(initialData.studentId);
      setAdmissionNo(initialData.admissionNo);
      setRollNo(initialData.rollNo);
      setName(initialData.name);
      setFatherName(initialData.fatherName);
      setDob(initialData.dob || '');
      setCnicOrBForm(initialData.cnicOrBForm || '');
      setMobile(initialData.mobile || '');
      setWhatsapp(initialData.whatsapp || '');
      setAlternatePhone(initialData.alternatePhone || '');
      setAddress(initialData.address || '');
      setVillage(initialData.village || '');
      setDistrict(initialData.district || '');
      setProvince(initialData.province || '');
      setGuardianName(initialData.guardianName || '');
      setGuardianRelation(initialData.guardianRelation || 'والد');
      setGuardianPhone(initialData.guardianPhone || '');
      setGuardianAddress(initialData.guardianAddress || '');
      setGuardianOccupation(initialData.guardianOccupation || '');
      setPhoto(initialData.photo || '');
      setAdmissionDate(initialData.admissionDate || '');
      setBranch(initialData.branch || 'حفظ القرآن');
      setDarja(initialData.darja || '');
      setSection(initialData.section || 'الف');
      setAcademicYear(initialData.academicYear || '1447-1448ھ / 2026-2027');
      setStatus(initialData.status || 'فعال');
      setNotes(initialData.notes || '');

      // Hifz
      if (initialData.hifzInfo) {
        setHifzStartDate(initialData.hifzInfo.startDate || '');
        setHifzCurrentPara(initialData.hifzInfo.currentPara || 1);
        setHifzCompletedParas(initialData.hifzInfo.completedParas || 0);
        setHifzManzil(initialData.hifzInfo.manzil || '');
        setHifzSabaq(initialData.hifzInfo.sabaq || '');
        setHifzSabqi(initialData.hifzInfo.sabqi || '');
        setHifzPerformance(initialData.hifzInfo.tajweedPerformance || 'بہتر');
        setHifzComments(initialData.hifzInfo.teacherComments || '');
      }

      // Tajweed
      if (initialData.tajweedInfo) {
        setTajweedCurrentPara(initialData.tajweedInfo.currentPara || 1);
        setTajweedCompletedParas(initialData.tajweedInfo.completedParas || 0);
        setTajweedLevel(initialData.tajweedInfo.tajweedLevel || 'مبتدی');
        setTajweedSabaq(initialData.tajweedInfo.sabaq || '');
        setTajweedSabqi(initialData.tajweedInfo.sabqi || '');
        setTajweedManzil(initialData.tajweedInfo.manzil || '');
        setTajweedMistakes(initialData.tajweedInfo.tajweedMistakes || '');
        setTajweedComments(initialData.tajweedInfo.teacherComments || '');
        setTajweedMonthlyAssessment(initialData.tajweedInfo.monthlyAssessment || 'بہت اچھا');
        setTajweedAnnualAssessment(initialData.tajweedInfo.annualAssessment || 'بہت اچھا');
      }

      // Modern Education
      if (initialData.modernEducation) {
        setModernStatus(initialData.modernEducation.status || 'نہیں پڑھ رہا');
        setModernLevel(initialData.modernEducation.level || '');
        setInstitutionName(initialData.modernEducation.institutionName || '');
        setBoardOrUniversity(initialData.modernEducation.boardOrUniversity || '');
        setModernRollNumber(initialData.modernEducation.rollNumber || '');
        setModernAcademicYear(initialData.modernEducation.academicYear || '');
        setLastCompletedClass(initialData.modernEducation.lastCompletedClass || '');
        setLastExamResult(initialData.modernEducation.lastExamResult || '');
        setModernSubjects(initialData.modernEducation.subjects || '');
        setExtraInfo(initialData.modernEducation.extraInfo || '');
        setModernCity(initialData.modernEducation.city || '');
        setCertificateDoc(initialData.modernEducation.certificateDoc || '');
      }
    } else {
      // Auto generate fresh student IDs
      const nextNum = existingStudents.length + 1;
      setStudentId(`STU-${String(nextNum).padStart(4, '0')}`);
      setAdmissionNo(`ADM-${String(1000 + nextNum)}`);
      setRollNo(String(nextNum));
      setName('');
      setFatherName('');
      setDob('');
      setCnicOrBForm('');
      setMobile('');
      setWhatsapp('');
      setAlternatePhone('');
      setAddress('');
      setVillage('');
      setDistrict('پشاور');
      setProvince('خیبر پختونخوا');
      setGuardianName('');
      setGuardianRelation('والد');
      setGuardianPhone('');
      setGuardianAddress('');
      setGuardianOccupation('');
      setPhoto('');
      setAdmissionDate(new Date().toISOString().split('T')[0]);
      setBranch('حفظ القرآن');
      setDarja('');
      setSection('الف');
      setStatus('فعال');
      setNotes('');

      setHifzStartDate('');
      setHifzCurrentPara(1);
      setHifzCompletedParas(0);
      setHifzManzil('');
      setHifzSabaq('');
      setHifzSabqi('');
      setHifzPerformance('بہتر');
      setHifzComments('');

      setModernStatus('نہیں پڑھ رہا');
      setModernLevel('');
      setInstitutionName('');
      setBoardOrUniversity('');
      setModernRollNumber('');
      setModernAcademicYear('');
      setLastCompletedClass('');
      setLastExamResult('');
      setModernSubjects('');
      setExtraInfo('');
      setModernCity('');
      setCertificateDoc('');
    }
    setErrorMsg('');
  }, [initialData, existingStudents, isOpen]);

  if (!isOpen) return null;

  // File Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('تصویر کا سائز 2MB سے زیادہ نہیں ہونا چاہیے');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('فائل کا سائز 4MB سے زیادہ نہیں ہونا چاہیے');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificateDoc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!name.trim()) {
      setErrorMsg('طالب علم کا نام درج کرنا لازمی ہے۔');
      setActiveTab('basic');
      return;
    }
    if (!fatherName.trim()) {
      setErrorMsg('والد کا نام درج کرنا لازمی ہے۔');
      setActiveTab('basic');
      return;
    }
    if (!studentId.trim()) {
      setErrorMsg('طالب علم ID لازمی ہے۔');
      setActiveTab('basic');
      return;
    }
    if (!rollNo.trim()) {
      setErrorMsg('رول نمبر درج کرنا لازمی ہے۔');
      setActiveTab('basic');
      return;
    }

    // Para validations
    if (hifzCurrentPara < 1 || hifzCurrentPara > 30) {
      setErrorMsg('حفظ کا پارہ نمبر 1 تا 30 کے درمیان ہونا لازمی ہے۔');
      setActiveTab('branch_specific');
      return;
    }

    // Build Modern Education Object
    const modernEduData: ModernEducationInfo = {
      status: modernStatus,
      level: modernLevel,
      institutionName,
      boardOrUniversity,
      rollNumber: modernRollNumber,
      academicYear: modernAcademicYear,
      lastCompletedClass,
      lastExamResult,
      subjects: modernSubjects,
      extraInfo,
      city: modernCity,
      certificateDoc,
    };

    // Build Hifz Object
    const hifzData: HifzInfo = {
      startDate: hifzStartDate,
      currentPara: Number(hifzCurrentPara),
      completedParas: Number(hifzCompletedParas),
      manzil: hifzManzil,
      sabaq: hifzSabaq,
      sabqi: hifzSabqi,
      tajweedPerformance: hifzPerformance,
      teacherComments: hifzComments,
    };

    // Build Tajweed Object
    const tajweedData: TajweedInfo = {
      currentPara: Number(tajweedCurrentPara),
      completedParas: Number(tajweedCompletedParas),
      tajweedLevel,
      sabaq: tajweedSabaq,
      sabqi: tajweedSabqi,
      manzil: tajweedManzil,
      tajweedMistakes,
      teacherComments: tajweedComments,
      monthlyAssessment: tajweedMonthlyAssessment,
      annualAssessment: tajweedAnnualAssessment,
    };

    const finalStudent: Student = {
      id: initialData?.id || `STU-${Date.now()}`,
      studentId: studentId.trim(),
      admissionNo: admissionNo.trim() || `ADM-${Date.now().toString().slice(-4)}`,
      rollNo: rollNo.trim(),
      name: name.trim(),
      fatherName: fatherName.trim(),
      dob,
      cnicOrBForm,
      mobile: mobile.trim(),
      whatsapp: (whatsapp || mobile).trim(),
      alternatePhone,
      address,
      village,
      district,
      province,
      guardianName: guardianName.trim() || fatherName.trim(),
      guardianRelation,
      guardianPhone: (guardianPhone || mobile).trim(),
      guardianAddress,
      guardianOccupation,
      photo,
      admissionDate,
      branch,
      darja,
      section,
      academicYear,
      status,
      notes,
      hifzInfo: branch === 'حفظ القرآن' ? hifzData : undefined,
      tajweedInfo: branch === 'تجوید للحفاظ' ? tajweedData : undefined,
      modernEducation: modernEduData,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = onSave(finalStudent);
    if (!res.success) {
      setErrorMsg(res.error || 'ریکارڈ محفوظ نہیں ہو سکا۔ دوبارہ کوشش کریں۔');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-nastaliq leading-relaxed">
                {initialData ? 'طالب علم کے کوائف میں ترمیم' : 'نیا داخلہ فارم (New Student Admission)'}
              </h2>
              <p className="text-xs text-slate-300">
                مدرسہ عربیہ مدینۃ العلوم • تمام بنیادی و عصری تعلیم کے کوائف
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

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 border-b border-slate-200 px-6 gap-2 pt-2 shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'basic'
                ? 'bg-white text-blue-950 border-t-2 border-r border-l border-slate-200'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            بنیادی و شخصی کوائف *
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('modern')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'modern'
                ? 'bg-white text-amber-800 border-t-2 border-r border-l border-slate-200'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-600" />
            عصری تعلیم (Modern Education)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('branch_specific')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'branch_specific'
                ? 'bg-white text-emerald-800 border-t-2 border-r border-l border-slate-200'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            شعبہ جاتی ریکارڈ ({branch})
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center gap-2 text-rose-700 text-xs font-bold shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800 text-xs">
          {/* TAB 1: BASIC & ENROLLMENT */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Photo & Core Identifiers */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-28 rounded-xl bg-white border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center relative shadow-xs">
                    {photo ? (
                      <img src={photo} alt="تصویر" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                        <span className="text-[10px]">تصویر اپلوڈ کریں</span>
                      </div>
                    )}
                  </div>
                  <label className="mt-2 px-3 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    تصویر منتخب کریں
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto('')}
                      className="text-rose-600 hover:text-rose-700 text-[10px] mt-1"
                    >
                      تصویر ہٹائیں
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      طالب علم ID <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-800 focus:border-blue-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      داخلہ نمبر <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={admissionNo}
                      onChange={(e) => setAdmissionNo(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-800 focus:border-blue-800 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      رول نمبر <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-800 focus:border-blue-800 font-bold text-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      شعبہ <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white font-bold"
                    >
                      <option value="حفظ القرآن">حفظ القرآن</option>
                      <option value="تجوید للحفاظ">تجوید للحفاظ</option>
                      <option value="درس نظامی">درس نظامی</option>
                      <option value="دیگر">دیگر</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">درجہ / کلاس</label>
                    {branch === 'درس نظامی' ? (
                      <select
                        value={darja}
                        onChange={(e) => setDarja(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                      >
                        <option value="">درجہ منتخب کریں</option>
                        {DARS_E_NIZAMI_CLASSES.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="مثلاً درجہ اول، وغیرہ"
                        value={darja}
                        onChange={(e) => setDarja(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">سیکشن</label>
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      placeholder="الف، ب، وغیرہ"
                    />
                  </div>
                </div>
              </div>

              {/* Student Personal Info */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-1.5">
                  طالب علم کے ذاتی کوائف
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      طالب علم کا نام <span className="text-rose-600">*</span>
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
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
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

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">شناختی کارڈ / بے فارم نمبر</label>
                    <input
                      type="text"
                      value={cnicOrBForm}
                      onChange={(e) => setCnicOrBForm(e.target.value)}
                      placeholder="17301-XXXXXXX-X"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">موبائل نمبر</label>
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="03XXXXXXXXX"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      WhatsApp نمبر (والدین / سرپرست)
                    </label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="03XXXXXXXXX"
                      className="w-full border border-emerald-300 rounded-lg px-3 py-2 text-slate-900 bg-emerald-50/30 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">داخلہ تاریخ</label>
                    <input
                      type="date"
                      value={admissionDate}
                      onChange={(e) => setAdmissionDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">تعلیمی سال</label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">حیثیت (Status)</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white font-semibold"
                    >
                      <option value="فعال">فعال (Active)</option>
                      <option value="فارغ التحصیل">فارغ التحصیل (Graduated)</option>
                      <option value="خارج شدہ">خارج شدہ (Struck Off)</option>
                      <option value="رخصت پر">رخصت پر (On Leave)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Guardian & Residence */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-1.5">
                  سرپرست و رہائشی کوائف
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">سرپرست کا نام</label>
                    <input
                      type="text"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="اگر والد کے علاوہ ہو"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">سرپرست سے رشتہ</label>
                    <input
                      type="text"
                      value={guardianRelation}
                      onChange={(e) => setGuardianRelation(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">سرپرست کا موبائل نمبر</label>
                    <input
                      type="text"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      placeholder="03XXXXXXXXX"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">گاؤں / محلہ</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ضلع</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">صوبہ</label>
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">مکمل پتہ</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: عصری تعلیم (MODERN EDUCATION) */}
          {activeTab === 'modern' && (
            <div className="space-y-5 bg-amber-50/40 p-5 rounded-2xl border border-amber-200">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      عصری تعلیم کی مکمل معلومات (Modern School / College Education)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      اسکول یا کالج کی موجودہ تعلیم یا حاصل کردہ ڈگری کی تفصیل
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">حیثیت:</span>
                  <select
                    value={modernStatus}
                    onChange={(e) => setModernStatus(e.target.value as any)}
                    className="border border-amber-300 rounded-lg px-3 py-1.5 bg-white font-bold text-slate-900"
                  >
                    <option value="نہیں پڑھ رہا">نہیں پڑھ رہا</option>
                    <option value="زیرِ تعلیم">زیرِ تعلیم (Currently Studying)</option>
                    <option value="مکمل">مکمل (Completed)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    موجودہ تعلیمی سطح / کلاس
                  </label>
                  <select
                    value={modernLevel}
                    onChange={(e) => setModernLevel(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                  >
                    <option value="">کلاس منتخب کریں</option>
                    {MODERN_EDUCATION_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    اسکول / کالج / ادارے کا نام
                  </label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="مثلاً گورنمنٹ ہائی اسکول / اسلامیہ کالج"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  >
                  </input>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">بورڈ / یونیورسٹی</label>
                  <input
                    type="text"
                    value={boardOrUniversity}
                    onChange={(e) => setBoardOrUniversity(e.target.value)}
                    placeholder="مثلاً پشاور بورڈ، BISE لاہور، وغیرہ"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رول نمبر</label>
                  <input
                    type="text"
                    value={modernRollNumber}
                    onChange={(e) => setModernRollNumber(e.target.value)}
                    placeholder="اسکول / بورڈ کا رول نمبر"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">تعلیمی سال</label>
                  <input
                    type="text"
                    value={modernAcademicYear}
                    onChange={(e) => setModernAcademicYear(e.target.value)}
                    placeholder="مثلاً 2025-2026"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    حاصل کردہ آخری کلاس
                  </label>
                  <input
                    type="text"
                    value={lastCompletedClass}
                    onChange={(e) => setLastCompletedClass(e.target.value)}
                    placeholder="مثلاً مڈل / میٹرک"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    آخری امتحان کا نتیجہ / فیصد
                  </label>
                  <input
                    type="text"
                    value={lastExamResult}
                    onChange={(e) => setLastExamResult(e.target.value)}
                    placeholder="مثلاً 85% / A+ گریڈ"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسکول / کالج کا شہر</label>
                  <input
                    type="text"
                    value={modernCity}
                    onChange={(e) => setModernCity(e.target.value)}
                    placeholder="مثلاً پشاور، راولپنڈی"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    مضامین (Subjects)
                  </label>
                  <input
                    type="text"
                    value={modernSubjects}
                    onChange={(e) => setModernSubjects(e.target.value)}
                    placeholder="مثلاً سائنس، ریاضی، کمپیوٹر، انگلش"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">اضافی تعلیمی معلومات</label>
                  <textarea
                    rows={2}
                    value={extraInfo}
                    onChange={(e) => setExtraInfo(e.target.value)}
                    placeholder="دیگر کوئی خصوصی کارکردگی، وظیفہ یا نمایاں کامیابی وغیرہ"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                {/* Upload Certificate */}
                <div className="sm:col-span-3 border-t border-amber-200 pt-3">
                  <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-700" />
                    تعلیمی اسناد / رزلٹ کارڈ / سرٹیفکیٹ کی تصویر اپلوڈ کریں
                  </label>

                  <div className="flex items-center gap-4">
                    <label className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-xs">
                      <Upload className="w-4 h-4" />
                      فائل منتخب کریں (Browse Certificate)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCertificateUpload}
                        className="hidden"
                      />
                    </label>

                    {certificateDoc && (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-bold text-xs">سند منتخب ہو چکی ہے</span>
                        <button
                          type="button"
                          onClick={() => setCertificateDoc('')}
                          className="text-rose-600 hover:text-rose-700 underline text-xs"
                        >
                          ہٹائیں
                        </button>
                      </div>
                    )}
                  </div>

                  {certificateDoc && (
                    <div className="mt-3 max-w-sm max-h-48 border rounded-xl overflow-hidden bg-white p-1">
                      <img src={certificateDoc} alt="سند پریویو" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BRANCH SPECIFIC (HIFZ / TAJWEED / DARS-E-NIZAMI) */}
          {activeTab === 'branch_specific' && (
            <div className="space-y-5">
              {branch === 'حفظ القرآن' && (
                <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-4">
                  <h3 className="font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    شعبہ حفظ القرآن الکریم کا خصوصی فارم
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        موجودہ پارہ (1–30) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        required
                        value={hifzCurrentPara}
                        onChange={(e) => setHifzCurrentPara(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        مکمل شدہ پارے (0–30)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={hifzCompletedParas}
                        onChange={(e) => setHifzCompletedParas(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">حفظ آغاز تاریخ</label>
                      <input
                        type="date"
                        value={hifzStartDate}
                        onChange={(e) => setHifzStartDate(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">روزانہ کا سبق</label>
                      <input
                        type="text"
                        value={hifzSabaq}
                        onChange={(e) => setHifzSabaq(e.target.value)}
                        placeholder="مثلاً نصف صفحہ، 1 رکوع"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">سبقی</label>
                      <input
                        type="text"
                        value={hifzSabqi}
                        onChange={(e) => setHifzSabqi(e.target.value)}
                        placeholder="مثلاً 5 پاؤں"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">منزل</label>
                      <input
                        type="text"
                        value={hifzManzil}
                        onChange={(e) => setHifzManzil(e.target.value)}
                        placeholder="مثلاً 1 پارہ روزانہ"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">تجوید کارکردگی</label>
                      <select
                        value={hifzPerformance}
                        onChange={(e) => setHifzPerformance(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                      >
                        <option value="ممتاز">ممتاز (Excellent)</option>
                        <option value="بہت اچھا">بہت اچھا (Very Good)</option>
                        <option value="اچھا">اچھا (Good)</option>
                        <option value="تسلی بخش">تسلی بخش (Satisfactory)</option>
                        <option value="مزید محنت درکار">مزید محنت درکار (Needs Improvement)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">استاد کے تاثرات</label>
                      <input
                        type="text"
                        value={hifzComments}
                        onChange={(e) => setHifzComments(e.target.value)}
                        placeholder="استاد محترم کے عمومی ریمارکس"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {branch === 'تجوید للحفاظ' && (
                <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-200 space-y-4">
                  <h3 className="font-bold text-sky-950 text-sm border-b border-sky-200 pb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-700" />
                    شعبہ تجوید للحفاظ کا فارم
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">موجودہ پارہ</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={tajweedCurrentPara}
                        onChange={(e) => setTajweedCurrentPara(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">مکمل پارے</label>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={tajweedCompletedParas}
                        onChange={(e) => setTajweedCompletedParas(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">تجوید لیول</label>
                      <input
                        type="text"
                        value={tajweedLevel}
                        onChange={(e) => setTajweedLevel(e.target.value)}
                        placeholder="ابتدائی / متوسط / اعلیٰ"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ماہانہ جائزہ</label>
                      <select
                        value={tajweedMonthlyAssessment}
                        onChange={(e) => setTajweedMonthlyAssessment(e.target.value as any)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                      >
                        <option value="ممتاز">ممتاز</option>
                        <option value="بہت اچھا">بہت اچھا</option>
                        <option value="اچھا">اچھا</option>
                        <option value="تسلی بخش">تسلی بخش</option>
                        <option value="مزید محنت درکار">مزید محنت درکار</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">سالانہ جائزہ</label>
                      <select
                        value={tajweedAnnualAssessment}
                        onChange={(e) => setTajweedAnnualAssessment(e.target.value as any)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                      >
                        <option value="ممتاز">ممتاز</option>
                        <option value="بہت اچھا">بہت اچھا</option>
                        <option value="اچھا">اچھا</option>
                        <option value="تسلی بخش">تسلی بخش</option>
                        <option value="مزید محنت درکار">مزید محنت درکار</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">سبق / سبقی / منزل</label>
                      <input
                        type="text"
                        value={tajweedSabaq}
                        onChange={(e) => setTajweedSabaq(e.target.value)}
                        placeholder="سبق تفصیل"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block font-bold text-slate-700 mb-1">تجوید کی اصلاح طلب غلطیاں</label>
                      <input
                        type="text"
                        value={tajweedMistakes}
                        onChange={(e) => setTajweedMistakes(e.target.value)}
                        placeholder="مثلاً اخفاء و ادغام، مدات، مخارج وغیرہ"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {branch === 'درس نظامی' && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-sm mb-3">
                    درس نظامی درجہ کی تفصیلی معلومات
                  </h3>
                  <p className="text-slate-600 text-xs mb-4">
                    درس نظامی کے تمام درجات اولیٰ تا ثامنہ کے لیے مضامین Subject Management کے تحت خودکار طریقے سے منظم ہوتے ہیں۔
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">منتخب کردہ درجہ</label>
                      <select
                        value={darja}
                        onChange={(e) => setDarja(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white font-bold"
                      >
                        <option value="">درجہ منتخب کریں</option>
                        {DARS_E_NIZAMI_CLASSES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">سیکشن / ہاسٹل</label>
                      <input
                        type="text"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="سیکشن الف یا ہاسٹل روم نمبر"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            <div className="text-xs text-slate-500">
              * والے خانے پر کرنا لازمی ہیں۔
            </div>

            <div className="flex items-center gap-3">
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
                محفوظ کریں (Save)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
