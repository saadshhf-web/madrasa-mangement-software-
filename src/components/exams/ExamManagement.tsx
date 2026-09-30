import React, { useState, useMemo } from 'react';
import { Exam, ExamMark, Student, Subject, MadrasaSettings } from '../../types';
import { DmcModal } from './DmcModal';
import { ResultGazetteModal } from './ResultGazetteModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import {
  Award,
  Plus,
  BookOpen,
  Printer,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  User,
} from 'lucide-react';

interface ExamManagementProps {
  exams: Exam[];
  marks: ExamMark[];
  students: Student[];
  subjects: Subject[];
  settings: MadrasaSettings;
  onSaveExam: (exam: Exam) => { success: boolean; error?: string };
  onDeleteExam: (id: string) => { success: boolean; error?: string };
  onSaveMarksBatch: (marks: ExamMark[]) => { success: boolean; error?: string };
}

export const ExamManagement: React.FC<ExamManagementProps> = ({
  exams,
  marks,
  students,
  subjects,
  settings,
  onSaveExam,
  onDeleteExam,
  onSaveMarksBatch,
}) => {
  // Modal states
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [isDeleteExamOpen, setIsDeleteExamOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  const [isDmcOpen, setIsDmcOpen] = useState(false);
  const [selectedStudentForDmc, setSelectedStudentForDmc] = useState<Student | null>(null);
  const [selectedExamForDmc, setSelectedExamForDmc] = useState<Exam | null>(null);

  const [isGazetteOpen, setIsGazetteOpen] = useState(false);
  const [selectedExamForGazette, setSelectedExamForGazette] = useState<Exam | null>(null);

  // New Exam Form state
  const [examName, setExamName] = useState('');
  const [examType, setExamType] = useState<'ماہانہ امتحان' | 'ششماہی امتحان' | 'سالانہ امتحان' | 'دیگر'>('سالانہ امتحان');
  const [academicYear, setAcademicYear] = useState('1447-1448ھ / 2026-2027');
  const [examBranch, setExamBranch] = useState('درس نظامی');
  const [examDarja, setExamDarja] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Marks Entry Selection
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [marksInputs, setMarksInputs] = useState<Record<string, { obt: number; total: number; remarks: string }>>({});
  const [marksFeedback, setMarksFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Initial selection
  const currentExam = useMemo(() => {
    return exams.find((e) => e.id === selectedExamId) || exams[0] || null;
  }, [exams, selectedExamId]);

  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.id === selectedSubjectId) || subjects[0] || null;
  }, [subjects, selectedSubjectId]);

  // Filter students eligible for this exam/class
  const eligibleStudents = useMemo(() => {
    if (!currentExam) return [];
    return students.filter((st) => {
      if (st.status !== 'فعال') return false;
      const matchBranch = !currentExam.branch || st.branch === currentExam.branch;
      const matchDarja = !currentExam.darja || st.darja === currentExam.darja;
      return matchBranch && matchDarja;
    });
  }, [students, currentExam]);

  // Load existing marks into marksInputs
  React.useEffect(() => {
    if (currentExam && currentSubject) {
      const existing = marks.filter(
        (m) => m.examId === currentExam.id && m.subjectId === currentSubject.id
      );
      const newMap: Record<string, { obt: number; total: number; remarks: string }> = {};

      eligibleStudents.forEach((st) => {
        const found = existing.find((m) => m.studentId === st.id);
        if (found) {
          newMap[st.id] = {
            obt: found.obtainedMarks,
            total: found.totalMarks,
            remarks: found.remarks || '',
          };
        } else {
          newMap[st.id] = {
            obt: 0,
            total: currentSubject.totalMarks || 100,
            remarks: '',
          };
        }
      });
      setMarksInputs(newMap);
    }
  }, [currentExam, currentSubject, eligibleStudents, marks]);

  // Handle Save Exam
  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) return;

    const newEx: Exam = {
      id: `EXAM-${Date.now()}`,
      name: examName.trim(),
      type: examType,
      academicYear,
      branch: examBranch,
      darja: examDarja,
      startDate,
    };

    const res = onSaveExam(newEx);
    if (res.success) {
      setSelectedExamId(newEx.id);
      setIsAddExamOpen(false);
      setExamName('');
    } else {
      alert(res.error || 'امتحان محفوظ نہیں ہو سکا۔');
    }
  };

  // Handle Save Marks Batch
  const handleSaveMarks = () => {
    if (!currentExam || !currentSubject) {
      setMarksFeedback({ text: 'براہ کرم امتحان اور مضمون کا انتخاب کریں۔', type: 'error' });
      return;
    }

    const marksToSave: ExamMark[] = [];
    let hasValidationError = false;
    let valErrorMsg = '';

    for (const st of eligibleStudents) {
      const data = marksInputs[st.id] || { obt: 0, total: 100, remarks: '' };
      const obt = Number(data.obt) || 0;
      const tot = Number(data.total) || 100;

      if (obt < 0) {
        hasValidationError = true;
        valErrorMsg = `طالب علم ${st.name} کے حاصل کردہ نمبر منفی نہیں ہو سکتے۔`;
        break;
      }
      if (obt > tot) {
        hasValidationError = true;
        valErrorMsg = `طالب علم ${st.name} کے حاصل کردہ نمبر کل نمبر (${tot}) سے زیادہ نہیں ہو سکتے۔`;
        break;
      }

      marksToSave.push({
        id: `MRK-${currentExam.id}-${st.id}-${currentSubject.id}`,
        examId: currentExam.id,
        studentId: st.id,
        subjectId: currentSubject.id,
        totalMarks: tot,
        obtainedMarks: obt,
        remarks: data.remarks,
      });
    }

    if (hasValidationError) {
      setMarksFeedback({ text: valErrorMsg, type: 'error' });
      return;
    }

    const res = onSaveMarksBatch(marksToSave);
    if (res.success) {
      setMarksFeedback({ text: 'نمبرات کامیابی کے ساتھ محفوظ ہو گئے ہیں۔', type: 'success' });
      setTimeout(() => setMarksFeedback(null), 4000);
    } else {
      setMarksFeedback({ text: res.error || 'نمبرات محفوظ نہیں ہو سکے۔', type: 'error' });
    }
  };

  const handleOpenDmcForStudent = (student: Student, exam: Exam) => {
    setSelectedStudentForDmc(student);
    setSelectedExamForDmc(exam);
    setIsDmcOpen(true);
  };

  const handleOpenGazetteForExam = (exam: Exam) => {
    setSelectedExamForGazette(exam);
    setIsGazetteOpen(true);
  };

  const handleRequestDeleteExam = (exam: Exam) => {
    setExamToDelete(exam);
    setIsDeleteExamOpen(true);
  };

  const handleConfirmDeleteExam = () => {
    if (examToDelete) {
      const res = onDeleteExam(examToDelete.id);
      if (!res.success) {
        alert(res.error || 'امتحان حذف نہیں ہو سکا۔');
      }
      setIsDeleteExamOpen(false);
      setExamToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 font-nastaliq leading-relaxed">
            نظامتِ امتحانات و نتائج (Exams & DMC)
          </h1>
          <p className="text-xs text-slate-500">
            امتحانات کا انعقاد، نمبرات کا اندراج، کشف الدرجات (DMC) اور رزلٹ گزٹ کی تیاری
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAddExamOpen(true)}
            className="px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            نیا امتحان (Create Exam)
          </button>

          {currentExam && (
            <button
              type="button"
              onClick={() => handleOpenGazetteForExam(currentExam)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              رزلٹ گزٹ پرنٹ کریں (Gazette)
            </button>
          )}
        </div>
      </div>

      {/* Available Exams Cards Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">امتحانات کی فہرست:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {exams.length === 0 ? (
            <div className="col-span-4 bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              کوئی امتحان درج نہیں ہے۔ نیا امتحان بنانے کے لیے "نیا امتحان" بٹن دبائیں۔
            </div>
          ) : (
            exams.map((ex) => {
              const isSelected = currentExam?.id === ex.id;
              return (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExamId(ex.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-950 text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm font-nastaliq leading-relaxed">{ex.name}</h4>
                      <p className={`text-[11px] ${isSelected ? 'text-amber-200' : 'text-slate-500'}`}>
                        {ex.type} • {ex.branch}
                      </p>
                      <p className={`text-[10px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        تاریخ: {ex.startDate}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestDeleteExam(ex);
                      }}
                      className={`p-1 rounded-lg ${
                        isSelected
                          ? 'text-rose-300 hover:text-white hover:bg-rose-900/50'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                      }`}
                      title="امتحان حذف کریں"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Marks Entry Section */}
      {currentExam && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
            <div>
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                نمبرات کا اندراج: {currentExam.name}
              </h3>
              <p className="text-xs text-slate-500">
                مضمون منتخب کریں اور طلبہ کے حاصل کردہ نمبر درج کریں۔
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">مضمون / کتاب:</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 bg-white font-bold"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} (کل نمبر: {sub.totalMarks})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleSaveMarks}
                className="px-4 py-1.5 bg-blue-950 hover:bg-blue-900 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                نمبرات محفوظ کریں
              </button>
            </div>
          </div>

          {marksFeedback && (
            <div
              className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                marksFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {marksFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{marksFeedback.text}</span>
            </div>
          )}

          {/* Marks Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="py-2.5 px-3 text-center w-12">شمار</th>
                  <th className="py-2.5 px-3 text-center w-16">رول نمبر</th>
                  <th className="py-2.5 px-4">طالب علم کا نام</th>
                  <th className="py-2.5 px-4">والد کا نام</th>
                  <th className="py-2.5 px-3 text-center w-24">کل نمبر</th>
                  <th className="py-2.5 px-3 text-center w-28">حاصل کردہ نمبر</th>
                  <th className="py-2.5 px-3 text-center w-20">فیصد</th>
                  <th className="py-2.5 px-3 text-center w-16">گریڈ</th>
                  <th className="py-2.5 px-4">تاثرات / ریمارکس</th>
                  <th className="py-2.5 px-3 text-center w-24">DMC سرٹیفکیٹ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {eligibleStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">
                      اس کلاس یا شعبہ کے لیے کوئی طالب علم موجود نہیں ہے۔
                    </td>
                  </tr>
                ) : (
                  eligibleStudents.map((st, idx) => {
                    const currentData = marksInputs[st.id] || {
                      obt: 0,
                      total: currentSubject?.totalMarks || 100,
                      remarks: '',
                    };
                    const pct =
                      currentData.total > 0
                        ? Math.min(
                            100,
                            Math.round((currentData.obt / currentData.total) * 100)
                          )
                        : 0;

                    let gr = 'F';
                    if (pct >= 90) gr = 'A+';
                    else if (pct >= 80) gr = 'A';
                    else if (pct >= 70) gr = 'B';
                    else if (pct >= 60) gr = 'C';
                    else if (pct >= 50) gr = 'D';

                    return (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3 text-center font-semibold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-blue-900 font-mono">
                          {st.rollNo}
                        </td>
                        <td className="py-2 px-4 font-bold text-slate-900">{st.name}</td>
                        <td className="py-2 px-4 text-slate-700">{st.fatherName}</td>

                        <td className="py-2 px-3 text-center font-bold text-slate-700">
                          {currentData.total}
                        </td>

                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={currentData.total}
                            value={currentData.obt}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value) || 0);
                              setMarksInputs((prev) => ({
                                ...prev,
                                [st.id]: {
                                  ...prev[st.id],
                                  obt: val,
                                },
                              }));
                            }}
                            className={`w-20 border rounded-lg px-2 py-1 text-center font-bold font-mono ${
                              currentData.obt > currentData.total
                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                : 'border-slate-300 text-blue-950 focus:ring-1 focus:ring-blue-900'
                            }`}
                          />
                        </td>

                        <td className="py-2 px-3 text-center font-bold">{pct}%</td>

                        <td className="py-2 px-3 text-center font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              gr === 'F' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {gr}
                          </span>
                        </td>

                        <td className="py-2 px-4">
                          <input
                            type="text"
                            value={currentData.remarks}
                            onChange={(e) =>
                              setMarksInputs((prev) => ({
                                ...prev,
                                [st.id]: {
                                  ...prev[st.id],
                                  remarks: e.target.value,
                                },
                              }))
                            }
                            placeholder="ریمارکس..."
                            className="w-full border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                          />
                        </td>

                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenDmcForStudent(st, currentExam)}
                            className="px-2 py-1 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold rounded text-[11px] inline-flex items-center gap-1 cursor-pointer shadow-xs"
                            title="طالب علم کا DMC پرنٹ کریں"
                          >
                            <Printer className="w-3 h-3" />
                            DMC
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {isAddExamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">نیا امتحان بنائیں</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExamOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 space-y-4 text-xs text-slate-800">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  امتحان کا نام <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="مثلاً سالانہ امتحان 1447ھ"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">قسم امتحان</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white font-semibold"
                >
                  <option value="سالانہ امتحان">سالانہ امتحان</option>
                  <option value="ششماہی امتحان">ششماہی امتحان</option>
                  <option value="ماہانہ امتحان">ماہانہ امتحان</option>
                  <option value="دیگر">دیگر</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">شعبہ</label>
                <select
                  value={examBranch}
                  onChange={(e) => setExamBranch(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
                >
                  <option value="درس نظامی">درس نظامی</option>
                  <option value="حفظ القرآن">حفظ القرآن</option>
                  <option value="تجوید للحفاظ">تجوید للحفاظ</option>
                  <option value="دیگر">دیگر</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">درجہ / کلاس</label>
                <input
                  type="text"
                  value={examDarja}
                  onChange={(e) => setExamDarja(e.target.value)}
                  placeholder="تمام یا مخصوص درجہ جیسے اولیٰ، ثانیہ..."
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
                <label className="block font-bold text-slate-700 mb-1">تاریخ آغاز</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddExamOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Exam Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteExamOpen}
        title="امتحان حذف کریں"
        message="کیا آپ واقعی اس امتحان کو تمام حاصل کردہ نمبرات سمیت حذف کرنا چاہتے ہیں؟"
        itemName={examToDelete?.name}
        onConfirm={handleConfirmDeleteExam}
        onCancel={() => {
          setIsDeleteExamOpen(false);
          setExamToDelete(null);
        }}
      />

      {/* DMC Modal */}
      <DmcModal
        isOpen={isDmcOpen}
        onClose={() => setIsDmcOpen(false)}
        student={selectedStudentForDmc}
        exam={selectedExamForDmc}
        marks={marks}
        subjects={subjects}
        settings={settings}
      />

      {/* Result Gazette Modal */}
      <ResultGazetteModal
        isOpen={isGazetteOpen}
        onClose={() => setIsGazetteOpen(false)}
        exam={selectedExamForGazette}
        students={students}
        marks={marks}
        settings={settings}
      />
    </div>
  );
};
