import React from 'react';
import { Student, Exam, ExamMark, Subject, MadrasaSettings } from '../../types';
import { PrintModal } from '../common/PrintModal';
import { PrintHeader } from '../common/PrintHeader';
import { User, Award, CheckCircle2, XCircle } from 'lucide-react';

interface DmcModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  exam: Exam | null;
  marks: ExamMark[];
  subjects: Subject[];
  settings: MadrasaSettings;
  position?: number | string;
}

export const DmcModal: React.FC<DmcModalProps> = ({
  isOpen,
  onClose,
  student,
  exam,
  marks,
  subjects,
  settings,
  position = '---',
}) => {
  if (!student || !exam) return null;

  // Filter marks for this specific exam and student
  const studentMarks = marks.filter(
    (m) => m.examId === exam.id && m.studentId === student.id
  );

  // Calculate totals
  const totalPossible = studentMarks.reduce((sum, m) => sum + (Number(m.totalMarks) || 0), 0);
  const totalObtained = studentMarks.reduce((sum, m) => sum + (Number(m.obtainedMarks) || 0), 0);
  const percentage = totalPossible > 0 ? Math.min(100, Math.round((totalObtained / totalPossible) * 1000) / 10) : 0;

  // Grade calculation
  let overallGrade = 'F';
  if (percentage >= 90) overallGrade = 'A+';
  else if (percentage >= 80) overallGrade = 'A';
  else if (percentage >= 70) overallGrade = 'B';
  else if (percentage >= 60) overallGrade = 'C';
  else if (percentage >= 50) overallGrade = 'D';

  const isPassed = overallGrade !== 'F';

  return (
    <PrintModal
      isOpen={isOpen}
      onClose={onClose}
      title={`کشف الدرجات (DMC) - ${student.name} - ${exam.name}`}
      orientation="portrait"
    >
      <div className="p-2 sm:p-4 text-slate-900 border-4 border-double border-blue-950 p-6 rounded-xl bg-gradient-to-b from-amber-50/20 via-white to-amber-50/20 relative">
        {/* Print Header */}
        <PrintHeader
          settings={settings}
          documentTitle="کشف الدرجات (DMC)"
          subTitle={exam.name}
        />

        {/* Student Information Card */}
        <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/60 my-4 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-28 rounded-xl bg-white border-2 border-slate-300 overflow-hidden shadow-xs flex items-center justify-center shrink-0">
            {student.photo ? (
              <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-slate-400" />
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2.5 flex-1 text-xs text-right w-full">
            <div>
              <span className="text-slate-500 font-medium">طالب علم کا نام: </span>
              <span className="text-slate-900 font-bold text-sm">{student.name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">والد کا نام: </span>
              <span className="text-slate-900 font-bold">{student.fatherName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">رول نمبر: </span>
              <span className="text-blue-900 font-bold bg-blue-100 px-2 py-0.5 rounded">
                {student.rollNo}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">داخلہ نمبر: </span>
              <span className="text-slate-900 font-semibold">{student.admissionNo}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">شعبہ: </span>
              <span className="text-slate-900 font-bold">{student.branch}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">درجہ / کلاس: </span>
              <span className="text-slate-900 font-bold">{student.darja || '---'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">سیکشن: </span>
              <span className="text-slate-900">{student.section || 'الف'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">تعلیمی سال: </span>
              <span className="text-slate-900 font-semibold">{student.academicYear}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">عصری تعلیم کی سطح: </span>
              <span className="text-slate-800 font-medium">
                {student.modernEducation?.level || '---'}
              </span>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="my-5 overflow-hidden rounded-xl border border-slate-300">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-blue-950 text-white font-bold">
                <th className="py-2.5 px-3 border-l border-blue-900 w-12 text-center">شمار</th>
                <th className="py-2.5 px-4 border-l border-blue-900">مضمون / کتاب</th>
                <th className="py-2.5 px-3 border-l border-blue-900 text-center w-24">کل نمبر</th>
                <th className="py-2.5 px-3 border-l border-blue-900 text-center w-28">حاصل کردہ نمبر</th>
                <th className="py-2.5 px-3 border-l border-blue-900 text-center w-20">فیصد</th>
                <th className="py-2.5 px-3 border-l border-blue-900 text-center w-20">گریڈ</th>
                <th className="py-2.5 px-4 text-center">کیفیت / تاثرات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {studentMarks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    اس طالب علم کے لیے اس امتحان میں کوئی نمبر درج نہیں ہیں۔
                  </td>
                </tr>
              ) : (
                studentMarks.map((mark, idx) => {
                  const subject = subjects.find((s) => s.id === mark.subjectId);
                  const subPct =
                    mark.totalMarks > 0
                      ? Math.round((mark.obtainedMarks / mark.totalMarks) * 100)
                      : 0;
                  let subGrade = 'F';
                  if (subPct >= 90) subGrade = 'A+';
                  else if (subPct >= 80) subGrade = 'A';
                  else if (subPct >= 70) subGrade = 'B';
                  else if (subPct >= 60) subGrade = 'C';
                  else if (subPct >= 50) subGrade = 'D';

                  return (
                    <tr key={mark.id || idx} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 border-l border-slate-200 text-center font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4 border-l border-slate-200 font-bold text-slate-800">
                        {subject?.name || mark.subjectId}
                      </td>
                      <td className="py-2.5 px-3 border-l border-slate-200 text-center font-semibold">
                        {mark.totalMarks}
                      </td>
                      <td className="py-2.5 px-3 border-l border-slate-200 text-center font-bold text-blue-900">
                        {mark.obtainedMarks}
                      </td>
                      <td className="py-2.5 px-3 border-l border-slate-200 text-center font-medium">
                        {subPct}%
                      </td>
                      <td className="py-2.5 px-3 border-l border-slate-200 text-center font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            subGrade === 'F'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {subGrade}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-600">
                        {mark.remarks || (subGrade === 'F' ? 'مزید محنت درکار' : 'تسلی بخش')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Grand Total Row */}
            {studentMarks.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                  <td colSpan={2} className="py-3 px-4 border-l border-slate-300 text-center text-sm">
                    مجموعی حاصل کردہ نمبر (Grand Total)
                  </td>
                  <td className="py-3 px-3 border-l border-slate-300 text-center text-sm font-extrabold text-slate-900">
                    {totalPossible}
                  </td>
                  <td className="py-3 px-3 border-l border-slate-300 text-center text-base font-extrabold text-blue-950">
                    {totalObtained}
                  </td>
                  <td className="py-3 px-3 border-l border-slate-300 text-center text-sm text-blue-900 font-bold">
                    {percentage}%
                  </td>
                  <td className="py-3 px-3 border-l border-slate-300 text-center text-base font-black text-blue-950">
                    {overallGrade}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {isPassed ? 'کامیاب (PASSED)' : 'ناکام (FAILED)'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Result Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 bg-amber-50/80 border border-amber-300 rounded-xl text-xs text-center">
          <div>
            <div className="text-slate-500 font-medium">مجموعی فیصد</div>
            <div className="text-lg font-black text-blue-950">{percentage}%</div>
          </div>
          <div>
            <div className="text-slate-500 font-medium">گریڈ (Grade)</div>
            <div className="text-lg font-black text-amber-700">{overallGrade}</div>
          </div>
          <div>
            <div className="text-slate-500 font-medium">پوزیشن (Position)</div>
            <div className="text-lg font-black text-blue-950">
              {position !== '---' ? `پوزیشن: ${position}` : '---'}
            </div>
          </div>
          <div>
            <div className="text-slate-500 font-medium">نتیجہ (Status)</div>
            <div
              className={`text-base font-bold ${
                isPassed ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isPassed ? 'کامیاب' : 'ناکام'}
            </div>
          </div>
        </div>

        {/* Grading Scale Legend */}
        <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-wrap justify-between items-center my-3">
          <span className="font-bold text-slate-700">پیمانہ گریڈنگ:</span>
          <span>90%–100% = A+ (ممتاز)</span>
          <span>80%–89% = A (بہت اچھا)</span>
          <span>70%–79% = B (اچھا)</span>
          <span>60%–69% = C (تسلی بخش)</span>
          <span>50%–59% = D (پاس)</span>
          <span>50% سے کم = F (ناکام)</span>
        </div>

        {/* Signatures & Stamp */}
        <div className="flex justify-between items-end mt-12 pt-6 border-t-2 border-slate-300 text-xs">
          <div className="text-center">
            <div className="w-32 border-b-2 border-dotted border-slate-700 mb-2"></div>
            <span className="font-bold text-slate-800">دستخط ناظم امتحانات</span>
          </div>

          <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-600 flex flex-col items-center justify-center text-[10px] text-amber-800 font-bold p-1">
            <span>مہر مدرسہ</span>
            <span className="text-[8px] font-normal text-slate-500">Official Stamp</span>
          </div>

          <div className="text-center">
            <div className="w-32 border-b-2 border-dotted border-slate-700 mb-2"></div>
            <span className="font-bold text-slate-800">دستخط مہتمم مدرسہ</span>
          </div>
        </div>
      </div>
    </PrintModal>
  );
};
