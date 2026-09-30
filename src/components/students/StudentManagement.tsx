import React, { useState, useMemo } from 'react';
import {
  Student,
  MadrasaSettings,
  AttendanceRecord,
  FeeRecord,
  Exam,
  ExamMark,
  Subject,
} from '../../types';
import { StudentFormModal, MODERN_EDUCATION_LEVELS } from './StudentFormModal';
import { StudentProfileModal } from './StudentProfileModal';
import { StudentIdCardModal } from './StudentIdCardModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { PrintModal } from '../common/PrintModal';
import { PrintHeader } from '../common/PrintHeader';
import { triggerPrint } from '../../utils/print';
import {
  UserPlus,
  Search,
  RotateCcw,
  Printer,
  Edit,
  Trash2,
  Eye,
  IdCard,
  User,
  Filter,
  GraduationCap,
  Download,
} from 'lucide-react';

interface StudentManagementProps {
  students: Student[];
  settings: MadrasaSettings;
  attendance: AttendanceRecord[];
  fees: FeeRecord[];
  exams: Exam[];
  marks: ExamMark[];
  subjects: Subject[];
  onSaveStudent: (student: Student) => { success: boolean; error?: string };
  onUpdateStudent: (student: Student) => { success: boolean; error?: string };
  onDeleteStudent: (id: string) => { success: boolean; error?: string };
  onOpenDmc: (student: Student, exam: Exam) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  settings,
  attendance,
  fees,
  exams,
  marks,
  subjects,
  onSaveStudent,
  onUpdateStudent,
  onDeleteStudent,
  onOpenDmc,
}) => {
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);

  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<Student | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const [isPrintListOpen, setIsPrintListOpen] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedModernLevel, setSelectedModernLevel] = useState('');
  const [selectedModernSchool, setSelectedModernSchool] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Filter students based on all search criteria
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // General text query
      const query = searchTerm.trim().toLowerCase();
      const matchesQuery =
        !query ||
        s.name.toLowerCase().includes(query) ||
        s.fatherName.toLowerCase().includes(query) ||
        s.rollNo.toLowerCase().includes(query) ||
        s.admissionNo.toLowerCase().includes(query) ||
        s.studentId.toLowerCase().includes(query) ||
        (s.mobile && s.mobile.includes(query)) ||
        (s.whatsapp && s.whatsapp.includes(query)) ||
        (s.cnicOrBForm && s.cnicOrBForm.includes(query));

      // Branch filter
      const matchesBranch = !selectedBranch || s.branch === selectedBranch;

      // Class filter
      const matchesClass = !selectedClass || s.darja === selectedClass;

      // Status filter
      const matchesStatus = !selectedStatus || s.status === selectedStatus;

      // Modern Education class filter
      const matchesModernLevel =
        !selectedModernLevel || s.modernEducation?.level === selectedModernLevel;

      // Modern Education school/college filter
      const matchesModernSchool =
        !selectedModernSchool.trim() ||
        (s.modernEducation?.institutionName &&
          s.modernEducation.institutionName
            .toLowerCase()
            .includes(selectedModernSchool.trim().toLowerCase()));

      return (
        matchesQuery &&
        matchesBranch &&
        matchesClass &&
        matchesStatus &&
        matchesModernLevel &&
        matchesModernSchool
      );
    });
  }, [
    students,
    searchTerm,
    selectedBranch,
    selectedClass,
    selectedStatus,
    selectedModernLevel,
    selectedModernSchool,
  ]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBranch('');
    setSelectedClass('');
    setSelectedModernLevel('');
    setSelectedModernSchool('');
    setSelectedStatus('');
  };

  const handleOpenAddForm = () => {
    setSelectedStudentForEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (student: Student) => {
    setSelectedStudentForEdit(student);
    setIsFormOpen(true);
  };

  const handleOpenProfile = (student: Student) => {
    setSelectedStudentForProfile(student);
    setIsProfileOpen(true);
  };

  const handleOpenIdCard = (student: Student) => {
    setSelectedStudentForIdCard(student);
    setIsIdCardOpen(true);
  };

  const handleRequestDelete = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      const res = onDeleteStudent(studentToDelete.id);
      if (!res.success) {
        alert(res.error || 'طالب علم حذف نہیں ہو سکا۔');
      }
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header / Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 font-nastaliq leading-relaxed">
            نظامتِ طلبہ (Student Management)
          </h1>
          <p className="text-xs text-slate-500">
            طلبہ کے نئے داخلے، تفصیلی کوائف، عصری تعلیم، شناختی کارڈز اور پروفائلز
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenAddForm}
            className="px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            نیا طالب علم (Add Student)
          </button>

          <button
            type="button"
            onClick={() => setIsPrintListOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            فہرست پرنٹ کریں
          </button>
        </div>
      </div>

      {/* Advanced Search & Filter Box */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-950 border-b border-slate-100 pb-2">
          <Filter className="w-4 h-4 text-amber-600" />
          تلاش و فلٹرز (Search & Filters)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Main search text */}
          <div className="lg:col-span-2">
            <label className="block text-slate-600 font-medium mb-1">
              تلاش (نام، والد، رول نمبر، ID، موبائل، داخلہ نمبر):
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="تلاش کریں..."
                className="w-full border border-slate-300 rounded-xl px-3 py-2 pr-9 text-slate-900 focus:ring-2 focus:ring-blue-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">شعبہ:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white"
            >
              <option value="">تمام شعبہ جات</option>
              <option value="حفظ القرآن">حفظ القرآن</option>
              <option value="تجوید للحفاظ">تجوید للحفاظ</option>
              <option value="درس نظامی">درس نظامی</option>
              <option value="دیگر">دیگر</option>
            </select>
          </div>

          {/* Modern Education Level Filter */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">عصری تعلیم کی کلاس:</label>
            <select
              value={selectedModernLevel}
              onChange={(e) => setSelectedModernLevel(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white"
            >
              <option value="">تمام عصری کلاسیں</option>
              {MODERN_EDUCATION_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Modern Education School/College */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">اسکول / ادارہ:</label>
            <input
              type="text"
              value={selectedModernSchool}
              onChange={(e) => setSelectedModernSchool(e.target.value)}
              placeholder="اسکول کا نام..."
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
            />
          </div>

          {/* Status Filter & Reset */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">حیثیت:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white"
            >
              <option value="">تمام حیثیتیں</option>
              <option value="فعال">فعال</option>
              <option value="فارغ التحصیل">فارغ التحصیل</option>
              <option value="خارج شدہ">خارج شدہ</option>
              <option value="رخصت پر">رخصت پر</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            کل نتائج: <strong className="text-blue-950">{filteredStudents.length}</strong> از{' '}
            {students.length} طلبہ
          </span>

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            فلٹرز صاف کریں (Reset)
          </button>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-3 px-4 w-12 text-center">تصویر</th>
                <th className="py-3 px-4">طالب علم کا نام</th>
                <th className="py-3 px-4">والد کا نام</th>
                <th className="py-3 px-3 text-center">رول نمبر</th>
                <th className="py-3 px-3">داخلہ نمبر</th>
                <th className="py-3 px-4">شعبہ و درجہ</th>
                <th className="py-3 px-4">عصری تعلیم</th>
                <th className="py-3 px-3">موبائل / WhatsApp</th>
                <th className="py-3 px-3 text-center">حیثیت</th>
                <th className="py-3 px-4 text-center">اعمال (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <User className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-sm">کوئی طالب علم موجود نہیں ہے۔</p>
                    <p className="text-xs text-slate-400 mt-1">
                      نئے طالب علم کا اندراج کرنے کے لیے اوپر "نیا طالب علم" بٹن پر کلک کریں۔
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    {/* Photo thumbnail */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 overflow-hidden mx-auto flex items-center justify-center">
                        {s.photo ? (
                          <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      <button
                        type="button"
                        onClick={() => handleOpenProfile(s)}
                        className="hover:text-blue-900 text-right cursor-pointer"
                      >
                        {s.name}
                      </button>
                      <div className="text-[10px] text-slate-400 font-normal">{s.studentId}</div>
                    </td>

                    {/* Father Name */}
                    <td className="py-2.5 px-4 text-slate-700 font-medium">{s.fatherName}</td>

                    {/* Roll No */}
                    <td className="py-2.5 px-3 text-center font-bold text-blue-900">
                      <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {s.rollNo}
                      </span>
                    </td>

                    {/* Admission No */}
                    <td className="py-2.5 px-3 text-slate-600 font-medium">{s.admissionNo}</td>

                    {/* Branch & Class */}
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-slate-800">{s.branch}</div>
                      <div className="text-[10px] text-slate-500">{s.darja || '---'}</div>
                    </td>

                    {/* Modern Education */}
                    <td className="py-2.5 px-4">
                      {s.modernEducation?.level ? (
                        <div>
                          <span className="font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[11px]">
                            {s.modernEducation.level}
                          </span>
                          {s.modernEducation.institutionName && (
                            <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                              {s.modernEducation.institutionName}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">---</span>
                      )}
                    </td>

                    {/* Mobile / WhatsApp */}
                    <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px]">
                      <div>{s.whatsapp || s.mobile || '---'}</div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'فعال'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenProfile(s)}
                          className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors cursor-pointer"
                          title="پروفائل دیکھیں"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenIdCard(s)}
                          className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 hover:text-amber-900 transition-colors cursor-pointer"
                          title="شناختی کارڈ بنائیں"
                        >
                          <IdCard className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditForm(s)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                          title="ترمیم کریں"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(s)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors cursor-pointer"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal for Add/Edit */}
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={(data) => {
          if (selectedStudentForEdit) {
            return onUpdateStudent(data);
          } else {
            return onSaveStudent(data);
          }
        }}
        initialData={selectedStudentForEdit}
        existingStudents={students}
      />

      {/* Profile Modal */}
      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        student={selectedStudentForProfile}
        settings={settings}
        attendance={attendance}
        fees={fees}
        exams={exams}
        marks={marks}
        subjects={subjects}
        onEdit={(st) => {
          setIsProfileOpen(false);
          handleOpenEditForm(st);
        }}
        onOpenIdCard={(st) => {
          setIsProfileOpen(false);
          handleOpenIdCard(st);
        }}
        onOpenDmc={(st, ex) => {
          setIsProfileOpen(false);
          onOpenDmc(st, ex);
        }}
      />

      {/* ID Card Modal */}
      <StudentIdCardModal
        isOpen={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
        student={selectedStudentForIdCard}
        settings={settings}
      />

      {/* Real Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="طالب علم کا ریکارڈ حذف کریں"
        message="کیا آپ واقعی اس طالب علم کا تمام ریکارڈ مستقل طور پر حذف کرنا چاہتے ہیں؟"
        itemName={
          studentToDelete
            ? `${studentToDelete.name} (رول نمبر: ${studentToDelete.rollNo}، ID: ${studentToDelete.studentId})`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
      />

      {/* Print Full Students List Modal */}
      <PrintModal
        isOpen={isPrintListOpen}
        onClose={() => setIsPrintListOpen(false)}
        title="طلبہ کی مکمل فہرست پرنٹ"
        orientation="landscape"
      >
        <div className="p-4 bg-white text-slate-900 border border-slate-400 rounded-xl">
          <PrintHeader
            settings={settings}
            documentTitle="طلبہ کی تصدیق شدہ فہرست (STUDENT DIRECTORY)"
            subTitle={`کل طلبہ: ${filteredStudents.length} • تعلیمی سال: ${settings.academicYear}`}
            metaInfo={[
              { label: 'شعبہ', value: selectedBranch || 'تمام شعبہ جات' },
              { label: 'کلاس', value: selectedClass || 'تمام' },
              { label: 'تاریخ پرنٹ', value: new Date().toLocaleDateString('ur-PK') },
            ]}
          />

          <table className="w-full text-xs text-right border-collapse border border-slate-300 mt-4">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-2 px-2 text-center w-10">شمار</th>
                <th className="py-2 px-2 text-center w-16">رول نمبر</th>
                <th className="py-2 px-3">طالب علم کا نام</th>
                <th className="py-2 px-3">والد کا نام</th>
                <th className="py-2 px-2 text-center">داخلہ نمبر</th>
                <th className="py-2 px-3">شعبہ و درجہ</th>
                <th className="py-2 px-3">عصری تعلیم</th>
                <th className="py-2 px-3">رابطہ / فون</th>
                <th className="py-2 px-3">پتہ / علاقہ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((st, idx) => (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="py-1.5 px-2 text-center font-semibold">{idx + 1}</td>
                  <td className="py-1.5 px-2 text-center font-bold text-blue-900">{st.rollNo}</td>
                  <td className="py-1.5 px-3 font-bold text-slate-900">{st.name}</td>
                  <td className="py-1.5 px-3 text-slate-700">{st.fatherName}</td>
                  <td className="py-1.5 px-2 text-center text-slate-600">{st.admissionNo}</td>
                  <td className="py-1.5 px-3 text-slate-800">
                    {st.branch} {st.darja ? `(${st.darja})` : ''}
                  </td>
                  <td className="py-1.5 px-3 text-amber-900 font-medium">
                    {st.modernEducation?.level || '---'}
                  </td>
                  <td className="py-1.5 px-3 font-mono text-[11px]">
                    {st.guardianPhone || st.mobile || '---'}
                  </td>
                  <td className="py-1.5 px-3 text-slate-600 truncate max-w-[150px]">
                    {st.address || st.village || '---'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-end mt-12 pt-4 border-t border-slate-300 text-xs">
            <div className="text-center">
              <div className="w-32 border-b border-dotted border-slate-700 mb-1"></div>
              <span>دستخط ناظم داخلہ</span>
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
