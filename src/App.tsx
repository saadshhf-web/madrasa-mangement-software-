/**
 * Madrasa Arabia Madina Tul Uloom - Complete Management System
 * 100% Urdu RTL Interface • Production Ready • Real Persistent Data
 */

import React, { useState, useEffect } from 'react';
import {
  Student,
  Teacher,
  AttendanceRecord,
  FeeRecord,
  FinanceTransaction,
  SalaryPayment,
  Subject,
  Exam,
  ExamMark,
  MadrasaSettings,
  AuthUser,
} from './types';
import { storage } from './services/storage';

// Module Components
import { LoginScreen } from './components/auth/LoginScreen';
import { Dashboard } from './components/dashboard/Dashboard';
import { StudentManagement } from './components/students/StudentManagement';
import { TeacherManagement } from './components/teachers/TeacherManagement';
import { AttendanceManagement } from './components/attendance/AttendanceManagement';
import { FeeManagement } from './components/fees/FeeManagement';
import { FinanceManagement } from './components/finances/FinanceManagement';
import { SalaryManagement } from './components/salaries/SalaryManagement';
import { SubjectManagement } from './components/subjects/SubjectManagement';
import { ExamManagement } from './components/exams/ExamManagement';
import { SettingsManagement } from './components/settings/SettingsManagement';
import { DmcModal } from './components/exams/DmcModal';
import { StudentFormModal } from './components/students/StudentFormModal';
import { FeeFormModal } from './components/fees/FeeFormModal';

// Icons
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  BookOpen,
  Award,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Printer,
  ShieldCheck,
  Building,
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => storage.getCurrentUser());
  const [rememberedUser] = useState(() => storage.getRememberedUser());

  // Global Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  // Persistent System State
  const [settings, setSettings] = useState<MadrasaSettings>(() => storage.getSettings());
  const [students, setStudents] = useState<Student[]>(() => storage.getStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(() => storage.getTeachers());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => storage.getAttendance());
  const [fees, setFees] = useState<FeeRecord[]>(() => storage.getFees());
  const [finances, setFinances] = useState<FinanceTransaction[]>(() => storage.getFinances());
  const [salaries, setSalaries] = useState<SalaryPayment[]>(() => storage.getSalaries());
  const [subjects, setSubjects] = useState<Subject[]>(() => storage.getSubjects());
  const [exams, setExams] = useState<Exam[]>(() => storage.getExams());
  const [marks, setMarks] = useState<ExamMark[]>(() => storage.getMarks());

  // Global Modals State
  const [globalDmcStudent, setGlobalDmcStudent] = useState<Student | null>(null);
  const [globalDmcExam, setGlobalDmcExam] = useState<Exam | null>(null);
  const [isGlobalDmcOpen, setIsGlobalDmcOpen] = useState(false);

  const [isQuickStudentFormOpen, setIsQuickStudentFormOpen] = useState(false);
  const [isQuickFeeFormOpen, setIsQuickFeeFormOpen] = useState(false);

  // Auth Handler
  const handleLogin = (user: AuthUser, remember: boolean) => {
    setCurrentUser(user);
    storage.setCurrentUser(user);
    if (remember) {
      storage.setRememberedUser({ username: user.username, role: user.role });
    } else {
      storage.setRememberedUser(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storage.setCurrentUser(null);
  };

  // Reload all states from storage helper
  const reloadData = () => {
    setStudents(storage.getStudents());
    setTeachers(storage.getTeachers());
    setAttendance(storage.getAttendance());
    setFees(storage.getFees());
    setFinances(storage.getFinances());
    setSalaries(storage.getSalaries());
    setSubjects(storage.getSubjects());
    setExams(storage.getExams());
    setMarks(storage.getMarks());
    setSettings(storage.getSettings());
  };

  // --- STUDENT ACTIONS ---
  const handleSaveStudent = (newSt: Student) => {
    const res = storage.saveStudent(newSt);
    if (res.success) {
      setStudents(storage.getStudents());
    }
    return res;
  };

  const handleUpdateStudent = (updatedSt: Student) => {
    const res = storage.updateStudent(updatedSt);
    if (res.success) {
      setStudents(storage.getStudents());
    }
    return res;
  };

  const handleDeleteStudent = (id: string) => {
    const res = storage.deleteStudent(id);
    if (res.success) {
      reloadData();
    }
    return res;
  };

  // --- TEACHER ACTIONS ---
  const handleSaveTeacher = (newTch: Teacher) => {
    const res = storage.saveTeacher(newTch);
    if (res.success) {
      setTeachers(storage.getTeachers());
    }
    return res;
  };

  const handleUpdateTeacher = (updatedTch: Teacher) => {
    const res = storage.updateTeacher(updatedTch);
    if (res.success) {
      setTeachers(storage.getTeachers());
    }
    return res;
  };

  const handleDeleteTeacher = (id: string) => {
    const res = storage.deleteTeacher(id);
    if (res.success) {
      setTeachers(storage.getTeachers());
    }
    return res;
  };

  // --- ATTENDANCE ACTIONS ---
  const handleSaveAttendanceBatch = (records: AttendanceRecord[]) => {
    const res = storage.saveAttendanceBatch(records);
    if (res.success) {
      setAttendance(storage.getAttendance());
    }
    return res;
  };

  // --- FEE ACTIONS ---
  const handleSaveFee = (fee: FeeRecord) => {
    const res = storage.saveFee(fee);
    if (res.success) {
      setFees(storage.getFees());
      setFinances(storage.getFinances());
    }
    return res;
  };

  const handleDeleteFee = (id: string) => {
    const res = storage.deleteFee(id);
    if (res.success) {
      setFees(storage.getFees());
    }
    return res;
  };

  // --- FINANCE ACTIONS ---
  const handleSaveFinance = (tx: FinanceTransaction) => {
    const res = storage.saveFinance(tx);
    if (res.success) {
      setFinances(storage.getFinances());
    }
    return res;
  };

  const handleDeleteFinance = (id: string) => {
    const res = storage.deleteFinance(id);
    if (res.success) {
      setFinances(storage.getFinances());
    }
    return res;
  };

  // --- SALARY ACTIONS ---
  const handleSaveSalary = (sal: SalaryPayment) => {
    const res = storage.saveSalary(sal);
    if (res.success) {
      setSalaries(storage.getSalaries());
      setFinances(storage.getFinances());
    }
    return res;
  };

  const handleDeleteSalary = (id: string) => {
    const res = storage.deleteSalary(id);
    if (res.success) {
      setSalaries(storage.getSalaries());
    }
    return res;
  };

  // --- SUBJECT ACTIONS ---
  const handleSaveSubject = (sub: Subject) => {
    const res = storage.saveSubject(sub);
    if (res.success) {
      setSubjects(storage.getSubjects());
    }
    return res;
  };

  const handleDeleteSubject = (id: string) => {
    const res = storage.deleteSubject(id);
    if (res.success) {
      setSubjects(storage.getSubjects());
    }
    return res;
  };

  // --- EXAM & MARKS ACTIONS ---
  const handleSaveExam = (ex: Exam) => {
    const res = storage.saveExam(ex);
    if (res.success) {
      setExams(storage.getExams());
    }
    return res;
  };

  const handleDeleteExam = (id: string) => {
    const res = storage.deleteExam(id);
    if (res.success) {
      setExams(storage.getExams());
      setMarks(storage.getMarks());
    }
    return res;
  };

  const handleSaveMarksBatch = (newMarks: ExamMark[]) => {
    const res = storage.saveMarksBatch(newMarks);
    if (res.success) {
      setMarks(storage.getMarks());
    }
    return res;
  };

  // --- SETTINGS & LOGO ACTIONS ---
  const handleSaveSettings = (newSettings: MadrasaSettings) => {
    const ok = storage.saveSettings(newSettings);
    if (ok) setSettings(newSettings);
    return ok;
  };

  const handleSaveLogo = (logoBase64: string) => {
    const ok = storage.saveLogo(logoBase64);
    if (ok) {
      setSettings(storage.getSettings());
    }
    return ok;
  };

  const handleDeleteLogo = () => {
    const ok = storage.deleteLogo();
    if (ok) {
      setSettings(storage.getSettings());
    }
    return ok;
  };

  const handleExportBackup = () => {
    const jsonStr = storage.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Madrasa_Madina_Tul_Uloom_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (jsonStr: string) => {
    const res = storage.importBackup(jsonStr);
    if (res.success) {
      reloadData();
    }
    return res;
  };

  const handleClearAllData = () => {
    const ok = storage.clearAllRecords();
    if (ok) {
      reloadData();
    }
    return ok;
  };

  const handleTriggerDmc = (st: Student, ex: Exam) => {
    setGlobalDmcStudent(st);
    setGlobalDmcExam(ex);
    setIsGlobalDmcOpen(true);
  };

  // If not logged in, render the login screen
  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        settings={settings}
        rememberedUser={rememberedUser}
      />
    );
  }

  // Navigation Items according to roles
  const navItems = [
    { id: 'dashboard', label: 'ڈیش بورڈ (Dashboard)', icon: LayoutDashboard, role: 'all' },
    { id: 'students', label: 'طلبہ مینجمنٹ (Students)', icon: Users, role: 'all' },
    { id: 'teachers', label: 'اساتذہ مینجمنٹ (Teachers)', icon: UserCheck, role: 'admin' },
    { id: 'attendance', label: 'حاضری و WhatsApp الرٹس', icon: Calendar, role: 'all' },
    { id: 'fees', label: 'فیس مینجمنٹ و رسیدات', icon: DollarSign, role: 'admin' },
    { id: 'finances', label: 'آمدن و اخراجات (Finances)', icon: TrendingUp, role: 'admin' },
    { id: 'salaries', label: 'اساتذہ کی تنخواہیں (Salaries)', icon: CreditCard, role: 'admin' },
    { id: 'subjects', label: 'نصاب و کتب (Subjects)', icon: BookOpen, role: 'all' },
    { id: 'exams', label: 'امتحانات و DMC گزٹ', icon: Award, role: 'all' },
    { id: 'settings', label: 'ترتیبات و مدرسہ لوگو', icon: SettingsIcon, role: 'admin' },
  ].filter((item) => {
    if (item.role === 'all') return true;
    if (currentUser.role === 'admin') return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-white">
      {/* Top Navbar */}
      <header className="bg-blue-950 text-white border-b border-blue-900 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md no-print">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-blue-900 transition-colors"
          >
            {isSidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-amber-400">
              <img
                src={settings.logoUrl}
                alt={settings.madrasaName}
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-base sm:text-lg font-black font-nastaliq leading-relaxed text-amber-300">
                مدرسہ عربیہ مدینۃ العلوم
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-300 font-sans tracking-wide truncate max-w-[200px] sm:max-w-none">
                {settings.madrasaName}
              </p>
            </div>
          </div>
        </div>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-white">{currentUser.displayName}</span>
            <span className="text-[10px] text-amber-400 font-medium capitalize">
              رول: {currentUser.role === 'admin' ? 'ایڈمنسٹریٹر' : currentUser.role === 'teacher' ? 'استاد' : 'ناظر'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 bg-blue-900 hover:bg-rose-900/60 text-slate-200 hover:text-rose-200 border border-blue-800 hover:border-rose-700/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="لاگ آؤٹ کریں"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">لاگ آؤٹ</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 right-0 z-20 w-64 bg-slate-900 text-slate-200 flex flex-col pt-16 md:pt-0 border-l border-slate-800 transition-transform duration-200 ease-in-out md:static md:translate-x-0 no-print shrink-0 ${
            isSidebarOpenMobile ? 'translate-x-0 shadow-2xl' : 'translate-x-full md:translate-x-0'
          }`}
        >
          {/* Madrasa Crest in Sidebar */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 p-1 border border-amber-500/40 flex items-center justify-center shrink-0">
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-right flex-1 truncate">
              <span className="text-xs font-bold text-amber-400 block font-nastaliq leading-relaxed">
                مدینۃ العلوم
              </span>
              <span className="text-[10px] text-slate-400 block">نظامتِ دفتر</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all text-right cursor-pointer ${
                    isActive
                      ? 'bg-blue-950 text-amber-400 font-bold border border-amber-500/30 shadow-md shadow-blue-950/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer info */}
          <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
            <span className="font-semibold text-slate-300 block">
              Madrasa Arabia Madina Tul Uloom
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              100% آف لائن و خود مختار نظام
            </span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              students={students}
              teachers={teachers}
              attendance={attendance}
              fees={fees}
              finances={finances}
              salaries={salaries}
              settings={settings}
              onNavigate={setActiveTab}
              onOpenAddStudent={() => setIsQuickStudentFormOpen(true)}
              onOpenAddFee={() => setIsQuickFeeFormOpen(true)}
              onOpenAddFinance={() => setActiveTab('finances')}
            />
          )}

          {activeTab === 'students' && (
            <StudentManagement
              students={students}
              settings={settings}
              attendance={attendance}
              fees={fees}
              exams={exams}
              marks={marks}
              subjects={subjects}
              onSaveStudent={handleSaveStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onOpenDmc={handleTriggerDmc}
            />
          )}

          {activeTab === 'teachers' && (
            <TeacherManagement
              teachers={teachers}
              settings={settings}
              onSaveTeacher={handleSaveTeacher}
              onUpdateTeacher={handleUpdateTeacher}
              onDeleteTeacher={handleDeleteTeacher}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceManagement
              students={students}
              attendance={attendance}
              settings={settings}
              onSaveAttendanceBatch={handleSaveAttendanceBatch}
            />
          )}

          {activeTab === 'fees' && (
            <FeeManagement
              fees={fees}
              students={students}
              settings={settings}
              onSaveFee={handleSaveFee}
              onDeleteFee={handleDeleteFee}
            />
          )}

          {activeTab === 'finances' && (
            <FinanceManagement
              finances={finances}
              settings={settings}
              onSaveFinance={handleSaveFinance}
              onDeleteFinance={handleDeleteFinance}
            />
          )}

          {activeTab === 'salaries' && (
            <SalaryManagement
              salaries={salaries}
              teachers={teachers}
              settings={settings}
              onSaveSalary={handleSaveSalary}
              onDeleteSalary={handleDeleteSalary}
            />
          )}

          {activeTab === 'subjects' && (
            <SubjectManagement
              subjects={subjects}
              onSaveSubject={handleSaveSubject}
              onDeleteSubject={handleDeleteSubject}
            />
          )}

          {activeTab === 'exams' && (
            <ExamManagement
              exams={exams}
              marks={marks}
              students={students}
              subjects={subjects}
              settings={settings}
              onSaveExam={handleSaveExam}
              onDeleteExam={handleDeleteExam}
              onSaveMarksBatch={handleSaveMarksBatch}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsManagement
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onSaveLogo={handleSaveLogo}
              onDeleteLogo={handleDeleteLogo}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
              onClearAllData={handleClearAllData}
            />
          )}
        </main>
      </div>

      {/* Global DMC Print Modal */}
      <DmcModal
        isOpen={isGlobalDmcOpen}
        onClose={() => setIsGlobalDmcOpen(false)}
        student={globalDmcStudent}
        exam={globalDmcExam}
        marks={marks}
        subjects={subjects}
        settings={settings}
      />

      {/* Quick Add Student Form Modal */}
      <StudentFormModal
        isOpen={isQuickStudentFormOpen}
        onClose={() => setIsQuickStudentFormOpen(false)}
        onSave={handleSaveStudent}
        existingStudents={students}
      />

      {/* Quick Add Fee Modal */}
      <FeeFormModal
        isOpen={isQuickFeeFormOpen}
        onClose={() => setIsQuickFeeFormOpen(false)}
        onSave={handleSaveFee}
        students={students}
      />
    </div>
  );
}
