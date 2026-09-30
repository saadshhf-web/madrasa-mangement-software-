import React, { useState } from 'react';
import {
  Student,
  MadrasaSettings,
  AttendanceRecord,
  FeeRecord,
  Exam,
  ExamMark,
  Subject,
} from '../../types';
import { PrintHeader } from '../common/PrintHeader';
import { openWhatsAppChat, formatMessageTemplate } from '../../utils/whatsapp';
import { triggerPrint } from '../../utils/print';
import {
  User,
  Phone,
  Calendar,
  BookOpen,
  GraduationCap,
  FileText,
  DollarSign,
  Printer,
  X,
  MessageSquare,
  Award,
  IdCard,
  Edit,
  Building,
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  settings: MadrasaSettings;
  attendance: AttendanceRecord[];
  fees: FeeRecord[];
  exams: Exam[];
  marks: ExamMark[];
  subjects: Subject[];
  onEdit: (student: Student) => void;
  onOpenIdCard: (student: Student) => void;
  onOpenDmc: (student: Student, exam: Exam) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  settings,
  attendance,
  fees,
  exams,
  marks,
  subjects,
  onEdit,
  onOpenIdCard,
  onOpenDmc,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'basic'
    | 'modern'
    | 'hifz_tajweed'
    | 'academic'
    | 'exams'
    | 'attendance'
    | 'fees'
    | 'docs'
  >('basic');

  if (!isOpen || !student) return null;

  // Student specific data
  const studentAttendance = attendance
    .filter((a) => a.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const studentFees = fees.filter((f) => f.studentId === student.id);
  const studentMarks = marks.filter((m) => m.studentId === student.id);

  // Attendance stats
  const totalDays = studentAttendance.length;
  const presentDays = studentAttendance.filter((a) => a.status === 'حاضر').length;
  const absentDays = studentAttendance.filter((a) => a.status === 'غیر حاضر').length;
  const leaveDays = studentAttendance.filter((a) => a.status === 'رخصت').length;
  const lateDays = studentAttendance.filter((a) => a.status === 'تاخیر سے حاضر').length;
  const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Contact Guardian WhatsApp
  const handleContactWhatsApp = () => {
    const phone = student.whatsapp || student.guardianPhone || student.mobile;
    const msg = formatMessageTemplate(settings.whatsappTemplates.general, {
      StudentName: student.name,
      FatherName: student.fatherName,
      Class: student.darja || student.branch,
      Branch: student.branch,
    });
    const res = openWhatsAppChat(phone, msg);
    if (!res.success) {
      alert(res.error || 'طالب علم کا درست WhatsApp نمبر موجود نہیں ہے۔');
    }
  };

  // Absence single notification from history
  const handleSendAbsenceNotice = (date: string) => {
    const phone = student.whatsapp || student.guardianPhone || student.mobile;
    const msg = formatMessageTemplate(settings.whatsappTemplates.absence, {
      StudentName: student.name,
      FatherName: student.fatherName,
      Class: student.darja || student.branch,
      Date: date,
    });
    const res = openWhatsAppChat(phone, msg);
    if (!res.success) {
      alert(res.error || 'طالب علم کا درست WhatsApp نمبر موجود نہیں ہے۔');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Top Bar (No Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>پروفائل: {student.name}</span>
                <span className="text-xs font-normal text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {student.branch}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                طالب علم ID: {student.studentId} | رول نمبر: {student.rollNo} | داخلہ نمبر: {student.admissionNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleContactWhatsApp}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="والدین سے WhatsApp پر رابطہ"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp والدین</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenIdCard(student)}
              className="px-3.5 py-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="شناختی کارڈ پرنٹ کریں"
            >
              <IdCard className="w-4 h-4" />
              <span className="hidden sm:inline">شناختی کارڈ</span>
            </button>
            <button
              type="button"
              onClick={() => onEdit(student)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">ترمیم</span>
            </button>
            <button
              type="button"
              onClick={triggerPrint}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">پروفائل پرنٹ</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (No Print) */}
        <div className="flex overflow-x-auto bg-slate-100 border-b border-slate-200 px-6 no-print shrink-0 gap-1 py-1.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'basic' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            بنیادی معلومات
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('modern')}
            className={`px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'modern' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            عصری تعلیم (Modern Ed)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hifz_tajweed')}
            className={`px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'hifz_tajweed' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            حفظ / تجوید ریکارڈ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exams')}
            className={`px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'exams' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            امتحانات و DMC
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'attendance' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            حاضری تاریخ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fees')}
            className={`px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'fees' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            فیس ریکارڈ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'docs' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            دستاویزات
          </button>
        </div>

        {/* Modal Scrollable Content & Printable Area */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-900 printable-document">
          {/* Printable Document Header (Shows on print) */}
          <div className="hidden print:block mb-6">
            <PrintHeader
              settings={settings}
              documentTitle="طالب علم جامع پروفائل (STUDENT PROFILE)"
              subTitle={`${student.name} ولدیت ${student.fatherName}`}
            />
          </div>

          {/* Quick Header Banner */}
          <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white rounded-2xl p-6 shadow-md mb-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-28 rounded-xl bg-white/10 border-2 border-amber-400 overflow-hidden flex items-center justify-center shrink-0">
              {student.photo ? (
                <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-slate-400" />
              )}
            </div>

            <div className="flex-1 text-right space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{student.name}</h1>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    student.status === 'فعال'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {student.status}
                </span>
              </div>
              <p className="text-slate-300 text-sm">
                ولدیت: <span className="font-semibold text-white">{student.fatherName}</span>
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-amber-200/90 pt-1">
                <span>رول نمبر: <strong>{student.rollNo}</strong></span>
                <span>داخلہ نمبر: <strong>{student.admissionNo}</strong></span>
                <span>طالب علم ID: <strong>{student.studentId}</strong></span>
                <span>شعبہ: <strong>{student.branch}</strong></span>
                <span>درجہ: <strong>{student.darja || '---'}</strong></span>
                <span>سیکشن: <strong>{student.section || 'الف'}</strong></span>
              </div>
            </div>
          </div>

          {/* TAB 1: BASIC INFORMATION */}
          {(activeTab === 'basic' || true) && (
            <div className={`space-y-6 ${activeTab === 'basic' ? 'block' : 'hidden print:block'}`}>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-blue-950 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-700" />
                  ذاتی و فیملی کوائف
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-1">تاریخ پیدائش:</span>
                    <span className="text-slate-900 font-bold">{student.dob || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">بے فارم / شناختی کارڈ:</span>
                    <span className="text-slate-900 font-bold">{student.cnicOrBForm || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">موبائل نمبر:</span>
                    <span className="text-slate-900 font-bold">{student.mobile || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">WhatsApp نمبر:</span>
                    <span className="text-emerald-700 font-bold">{student.whatsapp || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">متبادل فون نمبر:</span>
                    <span className="text-slate-900 font-medium">{student.alternatePhone || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">داخلہ تاریخ:</span>
                    <span className="text-slate-900 font-medium">{student.admissionDate || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">سرپرست کا نام:</span>
                    <span className="text-slate-900 font-bold">{student.guardianName || student.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">سرپرست سے رشتہ:</span>
                    <span className="text-slate-900 font-medium">{student.guardianRelation || 'والد'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">سرپرست کا رابطہ نمبر:</span>
                    <span className="text-slate-900 font-bold">{student.guardianPhone || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">سرپرست کا پیشہ:</span>
                    <span className="text-slate-900 font-medium">{student.guardianOccupation || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">گاؤں / محلہ:</span>
                    <span className="text-slate-900 font-medium">{student.village || '---'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">ضلع و صوبہ:</span>
                    <span className="text-slate-900 font-medium">
                      {student.district} {student.province ? `، ${student.province}` : ''}
                    </span>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <span className="text-slate-500 block mb-1">مکمل پتہ:</span>
                    <span className="text-slate-900 font-semibold">{student.address || '---'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: عصری تعلیم (MODERN EDUCATION) */}
          {(activeTab === 'modern' || true) && (
            <div className={`mt-6 space-y-6 ${activeTab === 'modern' ? 'block' : 'hidden print:block'}`}>
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-amber-950 border-b border-amber-200 pb-2 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-700" />
                  عصری تعلیم کی تفصیلات (Modern School / College Education)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-1">عصری تعلیم کی حیثیت:</span>
                    <span className="inline-block bg-blue-100 text-blue-900 font-bold px-2.5 py-0.5 rounded">
                      {student.modernEducation?.status || 'نہیں پڑھ رہا'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">موجودہ تعلیمی سطح / کلاس:</span>
                    <span className="text-slate-950 font-extrabold text-sm">
                      {student.modernEducation?.level || '---'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">اسکول / کالج / ادارے کا نام:</span>
                    <span className="text-slate-900 font-bold">
                      {student.modernEducation?.institutionName || '---'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">بورڈ / یونیورسٹی:</span>
                    <span className="text-slate-900 font-medium">
                      {student.modernEducation?.boardOrUniversity || '---'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">رول نمبر:</span>
                    <span className="text-slate-900 font-bold">
                      {student.modernEducation?.rollNumber || '---'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">تعلیمی سال:</span>
                    <span className="text-slate-900 font-medium">
                      {student.modernEducation?.academicYear || '---'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">آخری مکمل کی گئی کلاس:</span>
                    <span className="text-slate-900 font-medium">
                      {student.modernEducation?.lastCompletedClass || '---'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">آخری امتحان کا نتیجہ / فیصد:</span>
                    <span className="text-emerald-700 font-bold">
                      {student.modernEducation?.lastExamResult || '---'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">اسکول / کالج کا شہر:</span>
                    <span className="text-slate-900 font-medium">
                      {student.modernEducation?.city || '---'}
                    </span>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <span className="text-slate-500 block mb-1">عصری مضامین:</span>
                    <span className="text-slate-800 font-medium">
                      {student.modernEducation?.subjects || '---'}
                    </span>
                  </div>
                  {student.modernEducation?.extraInfo && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <span className="text-slate-500 block mb-1">اضافی تعلیمی معلومات:</span>
                      <span className="text-slate-800 font-normal">
                        {student.modernEducation?.extraInfo}
                      </span>
                    </div>
                  )}
                </div>

                {/* Uploaded Certificate Preview */}
                {student.modernEducation?.certificateDoc && (
                  <div className="mt-5 pt-4 border-t border-amber-200">
                    <span className="text-slate-700 font-bold text-xs block mb-2">
                      منسلک تعلیمی سند / سرٹیفکیٹ:
                    </span>
                    <div className="max-w-md max-h-64 border rounded-xl overflow-hidden bg-white shadow-xs p-1">
                      <img
                        src={student.modernEducation.certificateDoc}
                        alt="تعلیمی سند"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: HIFZ & TAJWEED */}
          {(activeTab === 'hifz_tajweed' || true) && (
            <div className={`mt-6 space-y-6 ${activeTab === 'hifz_tajweed' ? 'block' : 'hidden print:block'}`}>
              {student.branch === 'حفظ القرآن' && (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-emerald-950 border-b border-emerald-200 pb-2 mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    حفظ القرآن الکریم پیش رفت
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">موجودہ پارہ:</span>
                      <span className="text-lg font-black text-emerald-900">
                        پارہ {student.hifzInfo?.currentPara || '1'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">مکمل شدہ پارے:</span>
                      <span className="text-lg font-black text-emerald-900">
                        {student.hifzInfo?.completedParas || '0'} پارے
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">سبق:</span>
                      <span className="text-slate-900 font-bold">{student.hifzInfo?.sabaq || '---'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">سبقی:</span>
                      <span className="text-slate-900 font-bold">{student.hifzInfo?.sabqi || '---'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">منزل:</span>
                      <span className="text-slate-900 font-bold">{student.hifzInfo?.manzil || '---'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">حفظ آغاز تاریخ:</span>
                      <span className="text-slate-900 font-medium">
                        {student.hifzInfo?.startDate || '---'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">تجوید کارکردگی:</span>
                      <span className="text-slate-900 font-bold">
                        {student.hifzInfo?.tajweedPerformance || 'بہتر'}
                      </span>
                    </div>
                  </div>
                  {student.hifzInfo?.teacherComments && (
                    <div className="mt-3 pt-3 border-t border-emerald-200 text-xs text-slate-700">
                      <strong>استاد کے تاثرات: </strong>
                      {student.hifzInfo.teacherComments}
                    </div>
                  )}
                </div>
              )}

              {student.branch === 'تجوید للحفاظ' && (
                <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-sky-950 border-b border-sky-200 pb-2 mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-700" />
                    تجوید للحفاظ پیش رفت
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">تجوید لیول:</span>
                      <span className="text-slate-900 font-bold">{student.tajweedInfo?.tajweedLevel || 'ابتدائی'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">موجودہ پارہ:</span>
                      <span className="text-slate-900 font-bold">{student.tajweedInfo?.currentPara || '1'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">ماہانہ جائزہ:</span>
                      <span className="font-bold text-sky-800">{student.tajweedInfo?.monthlyAssessment || 'تسلی بخش'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">سالانہ جائزہ:</span>
                      <span className="font-bold text-sky-800">{student.tajweedInfo?.annualAssessment || 'تسلی بخش'}</span>
                    </div>
                  </div>
                  {student.tajweedInfo?.tajweedMistakes && (
                    <div className="mt-3 pt-2 text-xs text-slate-700">
                      <strong>تجوید کی اصلاح طلب غلطیاں: </strong>
                      {student.tajweedInfo.tajweedMistakes}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EXAMS & RESULTS */}
          {(activeTab === 'exams' || true) && (
            <div className={`mt-6 space-y-6 ${activeTab === 'exams' ? 'block' : 'hidden print:block'}`}>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-blue-950 border-b border-slate-200 pb-2 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    امتحانات، نتائج اور کشف الدرجات (DMC)
                  </span>
                </h3>

                {exams.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-4">کوئی امتحان درج نہیں ہے۔</p>
                ) : (
                  <div className="space-y-4">
                    {exams.map((exam) => {
                      const exMarks = marks.filter(
                        (m) => m.examId === exam.id && m.studentId === student.id
                      );
                      const totalMax = exMarks.reduce(
                        (sum, m) => sum + (Number(m.totalMarks) || 0),
                        0
                      );
                      const totalObt = exMarks.reduce(
                        (sum, m) => sum + (Number(m.obtainedMarks) || 0),
                        0
                      );
                      const pct =
                        totalMax > 0 ? Math.round((totalObt / totalMax) * 100) : 0;

                      return (
                        <div
                          key={exam.id}
                          className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4"
                        >
                          <div className="text-right">
                            <h4 className="font-bold text-slate-900 text-sm">{exam.name}</h4>
                            <p className="text-xs text-slate-500">
                              تعلیمی سال: {exam.academicYear} • تاریخ: {exam.startDate}
                            </p>
                            <div className="flex gap-4 mt-2 text-xs">
                              <span>حاصل کردہ نمبر: <strong>{totalObt} / {totalMax}</strong></span>
                              <span>فیصد: <strong>{pct}%</strong></span>
                            </div>
                          </div>

                          <div className="no-print">
                            <button
                              type="button"
                              onClick={() => onOpenDmc(student, exam)}
                              className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                            >
                              <Printer className="w-4 h-4" />
                              DMC تیار اور پرنٹ کریں
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ATTENDANCE HISTORY */}
          {(activeTab === 'attendance' || true) && (
            <div className={`mt-6 space-y-6 ${activeTab === 'attendance' ? 'block' : 'hidden print:block'}`}>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3 mb-4">
                  <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-700" />
                    حاضری کا ریکارڈ اور فیصد
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-emerald-700">حاضر: {presentDays}</span>
                    <span className="text-rose-700">غیر حاضر: {absentDays}</span>
                    <span className="text-amber-700">رخصت: {leaveDays}</span>
                    <span className="text-purple-700">تاخیر: {lateDays}</span>
                    <span className="bg-blue-950 text-white px-2 py-0.5 rounded">
                      مجموعی فیصد: {attendancePct}%
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold">
                        <th className="py-2 px-3">تاریخ</th>
                        <th className="py-2 px-3">شعبہ و درجہ</th>
                        <th className="py-2 px-3 text-center">حیثیت</th>
                        <th className="py-2 px-3 no-print text-center">WhatsApp اطلاع</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentAttendance.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-slate-400">
                            کوئی حاضری ریکارڈ دستیاب نہیں ہے۔
                          </td>
                        </tr>
                      ) : (
                        studentAttendance.map((rec) => (
                          <tr key={rec.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-semibold text-slate-800">{rec.date}</td>
                            <td className="py-2 px-3 text-slate-600">{rec.branch} - {rec.darja}</td>
                            <td className="py-2 px-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  rec.status === 'حاضر'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : rec.status === 'غیر حاضر'
                                    ? 'bg-rose-100 text-rose-800'
                                    : rec.status === 'رخصت'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {rec.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center no-print">
                              {rec.status === 'غیر حاضر' && (
                                <button
                                  type="button"
                                  onClick={() => handleSendAbsenceNotice(rec.date)}
                                  className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 mx-auto text-[11px] cursor-pointer"
                                  title="اس غیر حاضری کا WhatsApp والدین کو بھیجیں"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  اطلاع بھیجیں
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FEE RECORDS */}
          {(activeTab === 'fees' || true) && (
            <div className={`mt-6 space-y-6 ${activeTab === 'fees' ? 'block' : 'hidden print:block'}`}>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-blue-950 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  فیس کی ادائیگیاں اور بقایاجات
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold">
                        <th className="py-2 px-3">رسید #</th>
                        <th className="py-2 px-3">ماہ / فیس کی قسم</th>
                        <th className="py-2 px-3 text-center">کل رقم</th>
                        <th className="py-2 px-3 text-center">وصول شدہ</th>
                        <th className="py-2 px-3 text-center">بقایا</th>
                        <th className="py-2 px-3 text-center">حیثیت</th>
                        <th className="py-2 px-3 text-center">تاریخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentFees.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-4 text-center text-slate-400">
                            کوئی فیس ریکارڈ موجود نہیں ہے۔
                          </td>
                        </tr>
                      ) : (
                        studentFees.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-bold text-slate-800">{f.receiptNo}</td>
                            <td className="py-2 px-3 text-slate-700">
                              {f.month} ({f.feeType})
                            </td>
                            <td className="py-2 px-3 text-center font-semibold text-slate-900">
                              {f.totalAmount.toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-emerald-700">
                              {f.paidAmount.toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-rose-700">
                              {f.remainingAmount.toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  f.status === 'ادا شدہ'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : f.status === 'جزوی'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {f.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center text-slate-500">{f.paymentDate}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DOCUMENTS */}
          {(activeTab === 'docs' || true) && (
            <div className={`mt-6 space-y-6 ${activeTab === 'docs' ? 'block' : 'hidden print:block'}`}>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-blue-950 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-700" />
                  محفوظ شدہ تصاویر اور دستاویزات
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {student.photo && (
                    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-center">
                      <p className="text-xs font-bold text-slate-700 mb-2">طالب علم کی تصویر</p>
                      <div className="max-h-56 overflow-hidden flex items-center justify-center rounded-lg bg-white p-1">
                        <img src={student.photo} alt={student.name} className="max-h-52 object-contain" />
                      </div>
                    </div>
                  )}

                  {student.modernEducation?.certificateDoc && (
                    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-center">
                      <p className="text-xs font-bold text-slate-700 mb-2">عصری تعلیمی سند / سرٹیفکیٹ</p>
                      <div className="max-h-56 overflow-hidden flex items-center justify-center rounded-lg bg-white p-1">
                        <img
                          src={student.modernEducation.certificateDoc}
                          alt="عصری تعلیمی سند"
                          className="max-h-52 object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {!student.photo && !student.modernEducation?.certificateDoc && (
                    <p className="text-slate-400 text-xs col-span-2 text-center py-4">
                      کوئی دستاویز یا تصویر منسلک نہیں ہے۔
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center no-print shrink-0 text-xs text-slate-500">
          <span>سوفٹ ویئر برائے: {settings.madrasaName}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            بند کریں
          </button>
        </div>
      </div>
    </div>
  );
};
