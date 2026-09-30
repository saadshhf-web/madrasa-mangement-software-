import React from 'react';
import { Student, Exam, ExamMark, MadrasaSettings } from '../../types';
import { PrintModal } from '../common/PrintModal';
import { PrintHeader } from '../common/PrintHeader';

interface ResultGazetteModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
  students: Student[];
  marks: ExamMark[];
  settings: MadrasaSettings;
}

export const ResultGazetteModal: React.FC<ResultGazetteModalProps> = ({
  isOpen,
  onClose,
  exam,
  students,
  marks,
  settings,
}) => {
  if (!exam) return null;

  // Filter students belonging to this exam's branch and class
  const classStudents = students.filter(
    (s) =>
      (!exam.branch || s.branch === exam.branch) &&
      (!exam.darja || s.darja === exam.darja)
  );

  // Compute stats for each student
  const studentResults = classStudents.map((st) => {
    const sMarks = marks.filter((m) => m.examId === exam.id && m.studentId === st.id);
    const totalMax = sMarks.reduce((sum, m) => sum + (Number(m.totalMarks) || 0), 0);
    const totalObt = sMarks.reduce((sum, m) => sum + (Number(m.obtainedMarks) || 0), 0);
    const pct = totalMax > 0 ? Math.min(100, Math.round((totalObt / totalMax) * 1000) / 10) : 0;

    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B';
    else if (pct >= 60) grade = 'C';
    else if (pct >= 50) grade = 'D';

    return {
      student: st,
      totalMax,
      totalObt,
      percentage: pct,
      grade,
      isPassed: grade !== 'F' && totalObt > 0,
    };
  });

  // Sort by obtained marks descending to calculate positions
  studentResults.sort((a, b) => b.totalObt - a.totalObt);

  // Assign position with ties handled
  let currentRank = 1;
  const rankedResults = studentResults.map((r, idx, arr) => {
    if (idx > 0 && r.totalObt < arr[idx - 1].totalObt) {
      currentRank = idx + 1;
    }
    return {
      ...r,
      position: r.totalObt > 0 ? currentRank : '---',
    };
  });

  return (
    <PrintModal
      isOpen={isOpen}
      onClose={onClose}
      title={`رزلٹ گزٹ (Result Gazette) - ${exam.name}`}
      orientation="landscape"
    >
      <div className="p-4 text-slate-900 border-2 border-slate-800 rounded-xl bg-white min-w-[700px]">
        {/* Header */}
        <PrintHeader
          settings={settings}
          documentTitle="رزلٹ گزٹ (Result Gazette)"
          subTitle={`${exam.name} • شعبہ: ${exam.branch || 'عمومی'} • درجہ: ${exam.darja || 'تمام'}`}
          metaInfo={[
            { label: 'امتحان', value: exam.name },
            { label: 'شعبہ', value: exam.branch || 'کل' },
            { label: 'درجہ / کلاس', value: exam.darja || 'کل' },
            { label: 'کل امیدوار', value: String(classStudents.length) },
          ]}
        />

        {/* Gazette Table */}
        <div className="overflow-x-auto my-4 border border-slate-300 rounded-lg">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-2.5 px-3 border-l border-slate-700 text-center w-14">پوزیشن</th>
                <th className="py-2.5 px-3 border-l border-slate-700 text-center w-20">رول نمبر</th>
                <th className="py-2.5 px-4 border-l border-slate-700">طالب علم کا نام</th>
                <th className="py-2.5 px-4 border-l border-slate-700">والد کا نام</th>
                <th className="py-2.5 px-3 border-l border-slate-700 text-center">شعبہ / درجہ</th>
                <th className="py-2.5 px-3 border-l border-slate-700 text-center w-20">کل نمبر</th>
                <th className="py-2.5 px-3 border-l border-slate-700 text-center w-24">حاصل کردہ</th>
                <th className="py-2.5 px-3 border-l border-slate-700 text-center w-20">فیصد</th>
                <th className="py-2.5 px-3 border-l border-slate-700 text-center w-16">گریڈ</th>
                <th className="py-2.5 px-3 text-center w-24">کیفیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rankedResults.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 text-sm">
                    اس امتحان اور کلاس کے تحت کوئی طلبہ یا نمبرات درج نہیں ہیں۔
                  </td>
                </tr>
              ) : (
                rankedResults.map((res, index) => (
                  <tr
                    key={res.student.id}
                    className={`hover:bg-slate-50 ${
                      index < 3 && res.totalObt > 0 ? 'bg-amber-50/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2 px-3 border-l border-slate-200 text-center font-bold">
                      {res.position === 1 ? (
                        <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[11px] font-black">
                          اول (1st)
                        </span>
                      ) : res.position === 2 ? (
                        <span className="bg-slate-300 text-slate-900 px-2 py-0.5 rounded-full text-[11px] font-black">
                          دوم (2nd)
                        </span>
                      ) : res.position === 3 ? (
                        <span className="bg-amber-700 text-white px-2 py-0.5 rounded-full text-[11px] font-black">
                          سوم (3rd)
                        </span>
                      ) : (
                        res.position
                      )}
                    </td>
                    <td className="py-2 px-3 border-l border-slate-200 text-center font-bold text-blue-900">
                      {res.student.rollNo}
                    </td>
                    <td className="py-2 px-4 border-l border-slate-200 font-bold text-slate-900">
                      {res.student.name}
                    </td>
                    <td className="py-2 px-4 border-l border-slate-200 text-slate-700">
                      {res.student.fatherName}
                    </td>
                    <td className="py-2 px-3 border-l border-slate-200 text-center text-slate-600">
                      {res.student.darja || res.student.branch}
                    </td>
                    <td className="py-2 px-3 border-l border-slate-200 text-center font-semibold">
                      {res.totalMax}
                    </td>
                    <td className="py-2 px-3 border-l border-slate-200 text-center font-bold text-blue-950">
                      {res.totalObt}
                    </td>
                    <td className="py-2 px-3 border-l border-slate-200 text-center font-semibold">
                      {res.percentage}%
                    </td>
                    <td className="py-2 px-3 border-l border-slate-200 text-center font-bold">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          res.grade === 'F'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {res.grade}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`text-xs font-bold ${
                          res.isPassed ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {res.isPassed ? 'کامیاب' : 'ناکام'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Signatures */}
        <div className="flex justify-between items-end mt-8 pt-4 border-t border-slate-300 text-xs">
          <div className="text-center">
            <div className="w-36 border-b border-dotted border-slate-700 mb-1"></div>
            <span className="font-semibold text-slate-700">دستخط ناظم امتحانات</span>
          </div>
          <div className="text-center text-slate-500 text-[11px]">
            تاریخ اجراء گزٹ: {new Date().toLocaleDateString('ur-PK')}
          </div>
          <div className="text-center">
            <div className="w-36 border-b border-dotted border-slate-700 mb-1"></div>
            <span className="font-semibold text-slate-700">دستخط و مہر مہتمم مدرسہ</span>
          </div>
        </div>
      </div>
    </PrintModal>
  );
};
