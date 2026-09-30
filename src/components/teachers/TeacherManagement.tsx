import React, { useState, useMemo } from 'react';
import { Teacher, MadrasaSettings } from '../../types';
import { TeacherFormModal } from './TeacherFormModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { PrintModal } from '../common/PrintModal';
import { PrintHeader } from '../common/PrintHeader';
import {
  UserCheck,
  UserPlus,
  Search,
  RotateCcw,
  Printer,
  Edit,
  Trash2,
  Eye,
  Phone,
  DollarSign,
  Filter,
} from 'lucide-react';

interface TeacherManagementProps {
  teachers: Teacher[];
  settings: MadrasaSettings;
  onSaveTeacher: (teacher: Teacher) => { success: boolean; error?: string };
  onUpdateTeacher: (teacher: Teacher) => { success: boolean; error?: string };
  onDeleteTeacher: (id: string) => { success: boolean; error?: string };
}

export const TeacherManagement: React.FC<TeacherManagementProps> = ({
  teachers,
  settings,
  onSaveTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState<Teacher | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const [isPrintListOpen, setIsPrintListOpen] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.fatherName.toLowerCase().includes(q) ||
        t.teacherId.toLowerCase().includes(q) ||
        t.cnic.toLowerCase().includes(q) ||
        t.mobile.toLowerCase().includes(q) ||
        (t.whatsapp && t.whatsapp.toLowerCase().includes(q));

      const matchesBranch = !selectedBranch || t.branch === selectedBranch;
      const matchesStatus = !selectedStatus || t.status === selectedStatus;

      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [teachers, searchTerm, selectedBranch, selectedStatus]);

  const handleOpenAdd = () => {
    setSelectedTeacherForEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setSelectedTeacherForEdit(teacher);
    setIsFormOpen(true);
  };

  const handleRequestDelete = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (teacherToDelete) {
      const res = onDeleteTeacher(teacherToDelete.id);
      if (!res.success) {
        alert(res.error || 'استاد کا ریکارڈ حذف نہیں ہو سکا۔');
      }
      setIsDeleteModalOpen(false);
      setTeacherToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 font-nastaliq leading-relaxed">
            نظامتِ اساتذہ و عملہ (Teacher Management)
          </h1>
          <p className="text-xs text-slate-500">
            اساتذہ کرام کا مکمل ریکارڈ، قومی شناختی کارڈ (CNIC)، قابلیت اور تنخواہ کی معلومات
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            نیا استاد (Add Teacher)
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

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-950 border-b border-slate-100 pb-2">
          <Filter className="w-4 h-4 text-amber-600" />
          تلاش و فلٹرز (Search Teachers)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-slate-600 font-medium mb-1">
              تلاش (نام، والد، استاد ID، شناختی کارڈ، موبائل):
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="استاد کا نام، CNIC یا موبائل درج کریں..."
                className="w-full border border-slate-300 rounded-xl px-3 py-2 pr-9 text-slate-900 focus:ring-2 focus:ring-blue-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

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
              <option value="انتظامیہ">انتظامیہ</option>
              <option value="دیگر">دیگر</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">حیثیت:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white"
            >
              <option value="">تمام حیثیتیں</option>
              <option value="فعال">فعال</option>
              <option value="رخصت پر">رخصت پر</option>
              <option value="سابقہ">سابقہ</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            کل اساتذہ: <strong className="text-blue-950">{filteredTeachers.length}</strong> از{' '}
            {teachers.length}
          </span>

          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedBranch('');
              setSelectedStatus('');
            }}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            فلٹرز صاف کریں
          </button>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-3 px-3 text-center w-12">تصویر</th>
                <th className="py-3 px-4">استاد کا نام</th>
                <th className="py-3 px-4">والد کا نام</th>
                <th className="py-3 px-3 text-center">استاد ID</th>
                <th className="py-3 px-4">شناختی کارڈ نمبر (CNIC)</th>
                <th className="py-3 px-3">عہدہ و شعبہ</th>
                <th className="py-3 px-3">موبائل نمبر</th>
                <th className="py-3 px-3 text-center">بنیادی تنخواہ</th>
                <th className="py-3 px-3 text-center">حیثیت</th>
                <th className="py-3 px-4 text-center">اعمال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <UserCheck className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-sm">کوئی استاد درج نہیں ہے۔</p>
                    <p className="text-xs text-slate-400 mt-1">
                      نئے استاد کا اندراج کرنے کے لیے "نیا استاد" بٹن پر کلک کریں۔
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-center">
                      <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 overflow-hidden mx-auto flex items-center justify-center">
                        {t.photo ? (
                          <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserCheck className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-4 font-bold text-slate-900">{t.name}</td>
                    <td className="py-2.5 px-4 text-slate-700 font-medium">{t.fatherName}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-blue-900 font-mono">
                      {t.teacherId}
                    </td>

                    {/* CNIC DISPLAY MANDATORY */}
                    <td className="py-2.5 px-4 font-mono font-bold text-blue-950">
                      <span className="bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                        {t.cnic}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-slate-800">
                      <div className="font-semibold">{t.designation}</div>
                      <div className="text-[10px] text-slate-500">{t.branch}</div>
                    </td>

                    <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px]">{t.mobile}</td>

                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                      {t.basicSalary ? `${t.basicSalary.toLocaleString()} روپے` : '---'}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'فعال'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                          title="ترمیم کریں"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(t)}
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

      {/* Form Modal */}
      <TeacherFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={(data) => {
          if (selectedTeacherForEdit) {
            return onUpdateTeacher(data);
          } else {
            return onSaveTeacher(data);
          }
        }}
        initialData={selectedTeacherForEdit}
        existingTeachers={teachers}
      />

      {/* Real Confirmation Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="استاد کا ریکارڈ حذف کریں"
        message="کیا آپ واقعی اس استاد کا ریکارڈ ڈیٹا بیس سے مستقل طور پر حذف کرنا چاہتے ہیں؟"
        itemName={teacherToDelete ? `${teacherToDelete.name} (CNIC: ${teacherToDelete.cnic})` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTeacherToDelete(null);
        }}
      />

      {/* Print Teachers List Modal */}
      <PrintModal
        isOpen={isPrintListOpen}
        onClose={() => setIsPrintListOpen(false)}
        title="اساتذہ کرام کی فہرست پرنٹ"
        orientation="landscape"
      >
        <div className="p-4 bg-white text-slate-900 border border-slate-400 rounded-xl">
          <PrintHeader
            settings={settings}
            documentTitle="اساتذہ و عملہ کی فہرست (TEACHER ROSTER)"
            subTitle={`کل اساتذہ: ${filteredTeachers.length} • تعلیمی سال: ${settings.academicYear}`}
            metaInfo={[
              { label: 'شعبہ', value: selectedBranch || 'تمام شعبہ جات' },
              { label: 'تاریخ پرنٹ', value: new Date().toLocaleDateString('ur-PK') },
            ]}
          />

          <table className="w-full text-xs text-right border-collapse border border-slate-300 mt-4">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-2 px-2 text-center w-10">شمار</th>
                <th className="py-2 px-2 text-center w-16">استاد ID</th>
                <th className="py-2 px-3">استاد کا نام</th>
                <th className="py-2 px-3">والد کا نام</th>
                <th className="py-2 px-3 text-center">شناختی کارڈ (CNIC)</th>
                <th className="py-2 px-3">عہدہ و شعبہ</th>
                <th className="py-2 px-3">قابلیت</th>
                <th className="py-2 px-3">موبائل نمبر</th>
                <th className="py-2 px-3 text-center">بنیادی تنخواہ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTeachers.map((t, idx) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="py-2 px-2 text-center font-semibold">{idx + 1}</td>
                  <td className="py-2 px-2 text-center font-bold text-blue-900 font-mono">{t.teacherId}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{t.name}</td>
                  <td className="py-2 px-3 text-slate-700">{t.fatherName}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold text-blue-950">{t.cnic}</td>
                  <td className="py-2 px-3 text-slate-800">{t.designation} ({t.branch})</td>
                  <td className="py-2 px-3 text-slate-600">{t.qualification || '---'}</td>
                  <td className="py-2 px-3 font-mono text-[11px]">{t.mobile}</td>
                  <td className="py-2 px-3 text-center font-bold">{t.basicSalary?.toLocaleString()} روپے</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-end mt-12 pt-4 border-t border-slate-300 text-xs">
            <div className="text-center">
              <div className="w-32 border-b border-dotted border-slate-700 mb-1"></div>
              <span>دستخط ناظم دار الاقامہ / دفتر</span>
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
