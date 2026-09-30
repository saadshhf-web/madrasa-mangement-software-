import React from 'react';
import {
  Student,
  Teacher,
  AttendanceRecord,
  FeeRecord,
  FinanceTransaction,
  SalaryPayment,
  MadrasaSettings,
} from '../../types';
import {
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Scale,
  DollarSign,
  Clock,
  UserPlus,
  CreditCard,
  Printer,
  ChevronLeft,
} from 'lucide-react';

interface DashboardProps {
  students: Student[];
  teachers: Teacher[];
  attendance: AttendanceRecord[];
  fees: FeeRecord[];
  finances: FinanceTransaction[];
  salaries: SalaryPayment[];
  settings: MadrasaSettings;
  onNavigate: (tab: string) => void;
  onOpenAddStudent: () => void;
  onOpenAddFee: () => void;
  onOpenAddFinance: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  teachers,
  attendance,
  fees,
  finances,
  salaries,
  settings,
  onNavigate,
  onOpenAddStudent,
  onOpenAddFee,
  onOpenAddFinance,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Counts
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'فعال').length;
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter((t) => t.status === 'فعال').length;

  // Branch student counts
  const hifzStudents = students.filter((s) => s.branch === 'حفظ القرآن').length;
  const tajweedStudents = students.filter((s) => s.branch === 'تجوید للحفاظ').length;
  const darsNizamiStudents = students.filter((s) => s.branch === 'درس نظامی').length;

  // Today attendance
  const todayAttendance = attendance.filter((a) => a.date === todayStr);
  const presentToday = todayAttendance.filter((a) => a.status === 'حاضر').length;
  const absentToday = todayAttendance.filter((a) => a.status === 'غیر حاضر').length;
  const attendancePercentage =
    todayAttendance.length > 0 ? Math.round((presentToday / todayAttendance.length) * 100) : 0;

  // Finances
  const totalIncome = finances
    .filter((f) => f.type === 'income')
    .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

  const totalExpense = finances
    .filter((f) => f.type === 'expense')
    .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

  const currentBalance = totalIncome - totalExpense;

  // Fees
  const totalFeesCollected = fees.reduce((sum, f) => sum + (Number(f.paidAmount) || 0), 0);
  const totalFeesPending = fees.reduce((sum, f) => sum + (Number(f.remainingAmount) || 0), 0);

  // Salaries
  const totalSalariesPaid = salaries.reduce((sum, s) => sum + (Number(s.paidAmount) || 0), 0);

  // Recent 5 admissions
  const recentAdmissions = [...students]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Info Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute left-4 -bottom-6 w-56 h-56 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30 font-medium">
              <span>تعلیمی سال: {settings.academicYear}</span>
              <span>•</span>
              <span>تاریخ: {new Date().toLocaleDateString('ur-PK')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-nastaliq leading-relaxed">
              مدرسہ عربیہ مدینۃ العلوم
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {settings.tagline} • دفتر و انتظامی نظامتِ جامعہ
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenAddStudent}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              نیا داخلہ
            </button>
            <button
              type="button"
              onClick={() => onNavigate('attendance')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              آج کی حاضری
            </button>
            <button
              type="button"
              onClick={onOpenAddFee}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              فیس وصولی
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Key Statistics (12 Critical Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* 1. کل طلبہ */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">کل طلبہ</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-950 font-sans">{totalStudents}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">{activeStudents} فعال طلبہ</span>
        </div>

        {/* 2. کل اساتذہ */}
        <div
          onClick={() => onNavigate('teachers')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">کل اساتذہ</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-sans">{totalTeachers}</div>
          <span className="text-[11px] text-slate-500">{activeTeachers} تدریسی عملہ</span>
        </div>

        {/* 3. حفظ القرآن کے طلبہ */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">حفظ القرآن کے طلبہ</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-800 font-sans">{hifzStudents}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">شعبہ حفظ الکریم</span>
        </div>

        {/* 4. تجوید للحفاظ کے طلبہ */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">تجوید للحفاظ کے طلبہ</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-800 font-sans">{tajweedStudents}</div>
          <span className="text-[11px] text-sky-600 font-semibold">شعبہ قراءت و تجوید</span>
        </div>

        {/* 5. درس نظامی کے طلبہ */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">درس نظامی کے طلبہ</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-900 font-sans">{darsNizamiStudents}</div>
          <span className="text-[11px] text-purple-600 font-semibold">اولیٰ تا دورۂ حدیث</span>
        </div>

        {/* 6. آج کی حاضری */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">آج کی حاضری</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-900 font-sans">
            {todayAttendance.length > 0 ? `${attendancePercentage}%` : '---'}
          </div>
          <span className="text-[11px] text-slate-500">
            {todayAttendance.length > 0 ? `${presentToday} طلبہ حاضر` : 'حاضری درج نہیں'}
          </span>
        </div>

        {/* 7. غیر حاضر طلبہ */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs hover:border-rose-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-rose-700 text-xs font-semibold">غیر حاضر طلبہ</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 font-sans">{absentToday}</div>
          <span className="text-[11px] text-rose-600">WhatsApp اطلاع دستیاب</span>
        </div>

        {/* 8. آج کی آمدن */}
        <div
          onClick={() => onNavigate('finances')}
          className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs hover:border-emerald-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-700 text-xs font-semibold">کل آمدن</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-800 font-sans">
            {totalIncome.toLocaleString()} روپے
          </div>
          <span className="text-[11px] text-slate-500">فیس و عطیات</span>
        </div>

        {/* 9. آج کے اخراجات */}
        <div
          onClick={() => onNavigate('finances')}
          className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs hover:border-rose-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-rose-700 text-xs font-semibold">کل اخراجات</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black text-rose-700 font-sans">
            {totalExpense.toLocaleString()} روپے
          </div>
          <span className="text-[11px] text-slate-500">راشن، بجلی، بلز</span>
        </div>

        {/* 10. موجودہ بیلنس */}
        <div
          onClick={() => onNavigate('finances')}
          className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-900 text-xs font-semibold">موجودہ بیلنس</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div
            className={`text-xl font-black font-sans ${
              currentBalance >= 0 ? 'text-blue-950' : 'text-rose-600'
            }`}
          >
            {currentBalance.toLocaleString()} روپے
          </div>
          <span className="text-[11px] text-slate-500">آمدن منہا اخراجات</span>
        </div>

        {/* 11. اس ماہ کی فیس و زیر التواء فیس */}
        <div
          onClick={() => onNavigate('fees')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">فیس وصولی / بقایا</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 font-sans">
            {totalFeesCollected.toLocaleString()} روپے
          </div>
          <span className="text-[11px] text-rose-600 font-semibold">
            بقایا: {totalFeesPending.toLocaleString()} روپے
          </span>
        </div>

        {/* 12. اساتذہ کی تنخواہیں */}
        <div
          onClick={() => onNavigate('salaries')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-xs font-semibold">اساتذہ کی تنخواہیں</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-black text-purple-950 font-sans">
            {totalSalariesPaid.toLocaleString()} روپے
          </div>
          <span className="text-[11px] text-slate-500">کل ادا شدہ</span>
        </div>
      </div>

      {/* Two Column Layout: Recent Admissions & Financial Quick Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Admissions */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              حالیہ داخلہ شدہ طلبہ
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('students')}
              className="text-xs text-blue-800 hover:text-blue-950 font-bold flex items-center gap-1 cursor-pointer"
            >
              تمام طلبہ دیکھیں
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentAdmissions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">کوئی طالب علم موجود نہیں ہے۔</p>
            ) : (
              recentAdmissions.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {st.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{st.name}</div>
                      <div className="text-[11px] text-slate-500">
                        ولدیت: {st.fatherName} • رول نمبر: {st.rollNo}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-blue-950 bg-blue-100/60 px-2 py-0.5 rounded">
                      {st.branch}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{st.admissionDate}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Financial & Academic Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-700" />
              جامعہ کے عمومی شعبہ جاتی اعداد و شمار
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>شعبہ حفظ القرآن:</span>
                <span className="font-bold">{hifzStudents} طلبہ</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: `${totalStudents > 0 ? (hifzStudents / totalStudents) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>شعبہ تجوید للحفاظ:</span>
                <span className="font-bold">{tajweedStudents} طلبہ</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-600 h-2 rounded-full"
                  style={{ width: `${totalStudents > 0 ? (tajweedStudents / totalStudents) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>شعبہ درس نظامی:</span>
                <span className="font-bold">{darsNizamiStudents} طلبہ</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${totalStudents > 0 ? (darsNizamiStudents / totalStudents) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>سوفٹ ویئر برائے: {settings.madrasaName}</span>
            <span className="font-mono">ورژن 2.0 (Production Ready)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
