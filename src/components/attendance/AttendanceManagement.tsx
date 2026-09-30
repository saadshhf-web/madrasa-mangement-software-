import React, { useState, useEffect, useMemo } from 'react';
import { Student, AttendanceRecord, MadrasaSettings, AttendanceStatus } from '../../types';
import { openWhatsAppChat, formatMessageTemplate } from '../../utils/whatsapp';
import { PrintModal } from '../common/PrintModal';
import { PrintHeader } from '../common/PrintHeader';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Users,
  Printer,
  Save,
  Send,
  AlertTriangle,
  X,
} from 'lucide-react';

interface AttendanceManagementProps {
  students: Student[];
  attendance: AttendanceRecord[];
  settings: MadrasaSettings;
  onSaveAttendanceBatch: (records: AttendanceRecord[]) => { success: boolean; error?: string };
}

export const AttendanceManagement: React.FC<AttendanceManagementProps> = ({
  students,
  attendance,
  settings,
  onSaveAttendanceBatch,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedBranch, setSelectedBranch] = useState<string>('حفظ القرآن');
  const [selectedDarja, setSelectedDarja] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');

  // Daily attendance state mapping studentId -> status
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(
    null
  );

  // Absent notification modal state
  const [isAbsentModalOpen, setIsAbsentModalOpen] = useState(false);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);

  // Active enrolled students for the selected class/branch
  const classStudents = useMemo(() => {
    return students.filter((s) => {
      if (s.status !== 'فعال') return false;
      const matchesBranch = !selectedBranch || s.branch === selectedBranch;
      const matchesDarja = !selectedDarja || s.darja === selectedDarja;
      const matchesSection = !selectedSection || s.section === selectedSection;
      return matchesBranch && matchesDarja && matchesSection;
    });
  }, [students, selectedBranch, selectedDarja, selectedSection]);

  // Load existing attendance for this date and students
  useEffect(() => {
    const existingForDate = attendance.filter((a) => a.date === selectedDate);
    const newStatusMap: Record<string, AttendanceStatus> = {};
    const newNotesMap: Record<string, string> = {};

    classStudents.forEach((st) => {
      const rec = existingForDate.find((a) => a.studentId === st.id);
      if (rec) {
        newStatusMap[st.id] = rec.status;
        newNotesMap[st.id] = rec.notes || '';
      } else {
        // Default to حاضر if not marked yet
        newStatusMap[st.id] = 'حاضر';
        newNotesMap[st.id] = '';
      }
    });

    setStatusMap(newStatusMap);
    setNotesMap(newNotesMap);
  }, [selectedDate, classStudents, attendance]);

  // Mark all present
  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    classStudents.forEach((st) => {
      updated[st.id] = 'حاضر';
    });
    setStatusMap(updated);
  };

  // Save Attendance
  const handleSaveAttendance = () => {
    if (classStudents.length === 0) {
      setFeedbackMsg({ text: 'حاضری درج کرنے کے لیے کوئی طالب علم موجود نہیں ہے۔', type: 'error' });
      return;
    }

    const records: AttendanceRecord[] = classStudents.map((st) => ({
      id: `ATT-${st.id}-${selectedDate}`,
      studentId: st.id,
      date: selectedDate,
      branch: st.branch,
      darja: st.darja || '',
      section: st.section || 'الف',
      status: statusMap[st.id] || 'حاضر',
      notes: notesMap[st.id] || '',
      createdAt: new Date().toISOString(),
    }));

    const res = onSaveAttendanceBatch(records);
    if (res.success) {
      setFeedbackMsg({ text: 'حاضری کامیابی کے ساتھ محفوظ کر لی گئی ہے۔', type: 'success' });
      setTimeout(() => setFeedbackMsg(null), 4000);
    } else {
      setFeedbackMsg({ text: res.error || 'حاضری محفوظ نہیں ہو سکی۔', type: 'error' });
    }
  };

  // Send single WhatsApp notification for absent student
  const handleSendSingleAbsenceWhatsApp = (student: Student) => {
    const phone = student.whatsapp || student.guardianPhone || student.mobile;
    if (!phone) {
      alert('اس طالب علم یا سرپرست کا WhatsApp نمبر موجود نہیں ہے۔');
      return;
    }

    const message = formatMessageTemplate(settings.whatsappTemplates.absence, {
      StudentName: student.name,
      FatherName: student.fatherName,
      Class: student.darja || student.branch,
      Branch: student.branch,
      Date: selectedDate,
    });

    const res = openWhatsAppChat(phone, message);
    if (!res.success) {
      alert(res.error || 'WhatsApp کھولنے میں دشواری پیش آئی۔');
    }
  };

  // Get list of currently absent students
  const absentStudents = useMemo(() => {
    return classStudents.filter((st) => statusMap[st.id] === 'غیر حاضر');
  }, [classStudents, statusMap]);

  // Overall counts
  const presentCount = classStudents.filter((s) => statusMap[s.id] === 'حاضر').length;
  const absentCount = classStudents.filter((s) => statusMap[s.id] === 'غیر حاضر').length;
  const leaveCount = classStudents.filter((s) => statusMap[s.id] === 'رخصت').length;
  const lateCount = classStudents.filter((s) => statusMap[s.id] === 'تاخیر سے حاضر').length;
  const pct =
    classStudents.length > 0 ? Math.round((presentCount / classStudents.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 font-nastaliq leading-relaxed">
            نظامتِ حاضری و WhatsApp الرٹس (Attendance & Notifications)
          </h1>
          <p className="text-xs text-slate-500">
            روزانہ حاضری کا اندراج، غیر حاضر طلبہ کی نشاندہی اور والدین کو WhatsApp اطلاع
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {absentStudents.length > 0 && (
            <button
              type="button"
              onClick={() => setIsAbsentModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              تمام غیر حاضر طلبہ کو اطلاع دیں ({absentStudents.length})
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsPrintReportOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            حاضری رپورٹ پرنٹ
          </button>
        </div>
      </div>

      {/* Selector & Controls */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">تاریخ حاضری:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">شعبہ:</label>
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setSelectedDarja('');
              }}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold bg-white"
            >
              <option value="">تمام شعبہ جات</option>
              <option value="حفظ القرآن">حفظ القرآن</option>
              <option value="تجوید للحفاظ">تجوید للحفاظ</option>
              <option value="درس نظامی">درس نظامی</option>
              <option value="دیگر">دیگر</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">درجہ / کلاس:</label>
            <input
              type="text"
              value={selectedDarja}
              onChange={(e) => setSelectedDarja(e.target.value)}
              placeholder="درجہ یا کلاس درج کریں..."
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">سیکشن:</label>
            <input
              type="text"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              placeholder="تمام یا الف، ب..."
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white"
            />
          </div>
        </div>

        {/* Quick Summary Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700">کل طلبہ: {classStudents.length}</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              حاضر: {presentCount}
            </span>
            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
              غیر حاضر: {absentCount}
            </span>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
              رخصت: {leaveCount}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
              تاخیر: {lateCount}
            </span>
            <span className="bg-blue-950 text-white px-2 py-0.5 rounded font-bold">
              فیصد: {pct}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 rounded-lg font-bold cursor-pointer transition-colors"
            >
              سب حاضر کریں (Mark All Present)
            </button>

            <button
              type="button"
              onClick={handleSaveAttendance}
              className="px-5 py-1.5 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              حاضری محفوظ کریں
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-3 px-3 text-center w-12">شمار</th>
                <th className="py-3 px-3 text-center w-16">رول نمبر</th>
                <th className="py-3 px-4">طالب علم کا نام</th>
                <th className="py-3 px-4">والد کا نام</th>
                <th className="py-3 px-3">شعبہ و درجہ</th>
                <th className="py-3 px-4 text-center">حیثیتِ حاضری (Attendance Status)</th>
                <th className="py-3 px-4">موبائل / WhatsApp</th>
                <th className="py-3 px-4 text-center">WhatsApp اطلاع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-sm">اس کلاس یا شعبہ میں کوئی طالب علم نہیں ملا۔</p>
                    <p className="text-xs text-slate-400 mt-1">
                      براہ کرم اوپر فلٹرز تبدیل کریں یا طالب علم مینیجمنٹ میں نیا داخلہ کریں۔
                    </p>
                  </td>
                </tr>
              ) : (
                classStudents.map((st, idx) => {
                  const currentStatus = statusMap[st.id] || 'حاضر';
                  const guardianNumber = st.whatsapp || st.guardianPhone || st.mobile;

                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        currentStatus === 'غیر حاضر' ? 'bg-rose-50/40' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center font-semibold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-900 font-mono">
                        {st.rollNo}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{st.name}</td>
                      <td className="py-2.5 px-4 text-slate-700">{st.fatherName}</td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {st.branch} {st.darja ? `- ${st.darja}` : ''}
                      </td>

                      {/* Status Selection Buttons */}
                      <td className="py-2.5 px-4 text-center">
                        <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1 border border-slate-200">
                          <button
                            type="button"
                            onClick={() =>
                              setStatusMap((prev) => ({ ...prev, [st.id]: 'حاضر' }))
                            }
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'حاضر'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            حاضر
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setStatusMap((prev) => ({ ...prev, [st.id]: 'غیر حاضر' }))
                            }
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'غیر حاضر'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            غیر حاضر
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setStatusMap((prev) => ({ ...prev, [st.id]: 'رخصت' }))
                            }
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'رخصت'
                                ? 'bg-amber-500 text-slate-950 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            رخصت
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setStatusMap((prev) => ({ ...prev, [st.id]: 'تاخیر سے حاضر' }))
                            }
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'تاخیر سے حاضر'
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            تاخیر
                          </button>
                        </div>
                      </td>

                      {/* Phone / WhatsApp */}
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600">
                        {guardianNumber ? (
                          <span className="text-slate-800">{guardianNumber}</span>
                        ) : (
                          <span className="text-rose-500 text-[10px]">نمبر درج نہیں</span>
                        )}
                      </td>

                      {/* WhatsApp Absent Action Button */}
                      <td className="py-2.5 px-4 text-center">
                        {currentStatus === 'غیر حاضر' ? (
                          guardianNumber ? (
                            <button
                              type="button"
                              onClick={() => handleSendSingleAbsenceWhatsApp(st)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 mx-auto shadow-xs cursor-pointer active:scale-95 transition-all"
                              title="والدین کو WhatsApp اطلاع بھیجیں"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              والدین کو اطلاع دیں
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">
                              WhatsApp نمبر موجود نہیں
                            </span>
                          )
                        ) : (
                          <span className="text-slate-300 text-[10px]">---</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Absent Students Bulk Notification Modal */}
      {isAbsentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden">
            <div className="bg-rose-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    غیر حاضر طلبہ کی فہرست برائے WhatsApp اطلاع
                  </h3>
                  <p className="text-xs text-rose-200">
                    تاریخ: {selectedDate} • کل غیر حاضر: {absentStudents.length} طلبہ
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAbsentModalOpen(false)}
                className="text-rose-200 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                ہر طالب علم کے سامنے "WhatsApp بھیجیں" بٹن دبانے سے WhatsApp Web یا ایپ میں پہلے سے تیار
                شدہ پیغام کھل جائے گا۔ آپ وہاں سے آسانی سے Send کر سکتے ہیں۔
              </p>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold">
                      <th className="py-2.5 px-3">طالب علم</th>
                      <th className="py-2.5 px-3">والد کا نام</th>
                      <th className="py-2.5 px-3">کلاس</th>
                      <th className="py-2.5 px-3">موبائل / WhatsApp</th>
                      <th className="py-2.5 px-3 text-center">عمل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {absentStudents.map((st) => {
                      const phone = st.whatsapp || st.guardianPhone || st.mobile;
                      return (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{st.name}</td>
                          <td className="py-2.5 px-3 text-slate-700">{st.fatherName}</td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {st.branch} {st.darja ? `(${st.darja})` : ''}
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            {phone || <span className="text-rose-500">موجود نہیں</span>}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {phone ? (
                              <button
                                type="button"
                                onClick={() => handleSendSingleAbsenceWhatsApp(st)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 mx-auto cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                                WhatsApp بھیجیں
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[10px]">نمبر نہیں ہے</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAbsentModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                بند کریں
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Attendance Report Modal */}
      <PrintModal
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
        title="حاضری رپورٹ پرنٹ"
        orientation="landscape"
      >
        <div className="p-4 bg-white text-slate-900 border border-slate-400 rounded-xl">
          <PrintHeader
            settings={settings}
            documentTitle="روزانہ حاضری رپورٹ (DAILY ATTENDANCE SHEET)"
            subTitle={`تاریخ: ${selectedDate} • شعبہ: ${selectedBranch || 'تمام'} • درجہ: ${selectedDarja || 'تمام'}`}
            metaInfo={[
              { label: 'تاریخ', value: selectedDate },
              { label: 'کل طلبہ', value: String(classStudents.length) },
              { label: 'حاضر', value: String(presentCount) },
              { label: 'غیر حاضر', value: String(absentCount) },
            ]}
          />

          <table className="w-full text-xs text-right border-collapse border border-slate-300 mt-4">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-2 px-2 text-center w-10">شمار</th>
                <th className="py-2 px-2 text-center w-16">رول نمبر</th>
                <th className="py-2 px-3">طالب علم کا نام</th>
                <th className="py-2 px-3">والد کا نام</th>
                <th className="py-2 px-3">شعبہ و درجہ</th>
                <th className="py-2 px-3 text-center">حیثیت حاضری</th>
                <th className="py-2 px-3">رابطہ نمبر</th>
                <th className="py-2 px-4">دستخط / تاثرات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {classStudents.map((st, idx) => {
                const cur = statusMap[st.id] || 'حاضر';
                return (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-2 px-2 text-center font-semibold">{idx + 1}</td>
                    <td className="py-2 px-2 text-center font-bold text-blue-900">{st.rollNo}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{st.name}</td>
                    <td className="py-2 px-3 text-slate-700">{st.fatherName}</td>
                    <td className="py-2 px-3 text-slate-800">
                      {st.branch} {st.darja ? `(${st.darja})` : ''}
                    </td>
                    <td className="py-2 px-3 text-center font-bold">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          cur === 'حاضر'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cur === 'غیر حاضر'
                            ? 'bg-rose-100 text-rose-800 font-black'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {cur}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px]">
                      {st.guardianPhone || st.mobile || '---'}
                    </td>
                    <td className="py-2 px-4 border-b border-dotted border-slate-300"></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-between items-end mt-12 pt-4 border-t border-slate-300 text-xs">
            <div className="text-center">
              <div className="w-32 border-b border-dotted border-slate-700 mb-1"></div>
              <span>دستخط استاد / ناظم حاضری</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-dotted border-slate-700 mb-1"></div>
              <span>دستخط و مہر مہتمم مدرسہ</span>
            </div>
          </div>
        </div>
      </PrintModal>
    </div>
  );
};
