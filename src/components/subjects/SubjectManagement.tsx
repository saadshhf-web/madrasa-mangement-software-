import React, { useState } from 'react';
import { Subject } from '../../types';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { BookOpen, Plus, Trash2, Edit, Save, X, Layers } from 'lucide-react';

interface SubjectManagementProps {
  subjects: Subject[];
  onSaveSubject: (subject: Subject) => { success: boolean; error?: string };
  onDeleteSubject: (id: string) => { success: boolean; error?: string };
}

export const SubjectManagement: React.FC<SubjectManagementProps> = ({
  subjects,
  onSaveSubject,
  onDeleteSubject,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [name, setName] = useState('');
  const [branch, setBranch] = useState('درس نظامی');
  const [darja, setDarja] = useState('تمام درجات');
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [passMarks, setPassMarks] = useState<number>(50);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setName('');
    setBranch('درس نظامی');
    setDarja('تمام درجات');
    setTotalMarks(100);
    setPassMarks(50);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setName(sub.name);
    setBranch(sub.branch);
    setDarja(sub.darja);
    setTotalMarks(sub.totalMarks);
    setPassMarks(sub.passMarks);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const sub: Subject = {
      id: editingSubject?.id || `SUB-${Date.now()}`,
      name: name.trim(),
      branch,
      darja,
      totalMarks: Number(totalMarks) || 100,
      passMarks: Number(passMarks) || 50,
    };

    const res = onSaveSubject(sub);
    if (res.success) {
      setIsModalOpen(false);
    } else {
      alert(res.error || 'مضمون محفوظ نہیں ہو سکا۔');
    }
  };

  const handleRequestDelete = (sub: Subject) => {
    setSubjectToDelete(sub);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (subjectToDelete) {
      const res = onDeleteSubject(subjectToDelete.id);
      if (!res.success) {
        alert(res.error || 'مضمون حذف نہیں ہو سکا۔');
      }
      setIsDeleteModalOpen(false);
      setSubjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 font-nastaliq leading-relaxed">
            نظامتِ کتب و مضامین (Subject Management)
          </h1>
          <p className="text-xs text-slate-500">
            شعبہ جات اور درجات کے لیے نصابی کتب، مضامین اور امتحانی نمبرات کی ترتیب
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          نیا مضمون شامل کریں (Add Subject)
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-3 px-3 text-center w-12">شمار</th>
                <th className="py-3 px-4">مضمون / کتاب کا نام</th>
                <th className="py-3 px-4">مربوطہ شعبہ</th>
                <th className="py-3 px-4">مختص درجہ / کلاس</th>
                <th className="py-3 px-3 text-center">کل نمبر</th>
                <th className="py-3 px-3 text-center">پاسنگ مارکس</th>
                <th className="py-3 px-3 text-center">اعمال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-sm">کوئی مضمون درج نہیں ہے۔</p>
                  </td>
                </tr>
              ) : (
                subjects.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-semibold">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 text-sm">{sub.name}</td>
                    <td className="py-2.5 px-4 font-semibold text-blue-950">{sub.branch}</td>
                    <td className="py-2.5 px-4 text-slate-700">{sub.darja}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">{sub.totalMarks}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{sub.passMarks}</td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(sub)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                          title="ترمیم کریں"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(sub)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-800 cursor-pointer"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">
                  {editingSubject ? 'مضمون میں ترمیم' : 'نیا مضمون شامل کریں'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs text-slate-800">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  مضمون / کتاب کا نام <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً ترجمہ قرآن، ہدایہ، نحو، ریاضی..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">متعلقہ شعبہ</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white font-semibold"
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
                  value={darja}
                  onChange={(e) => setDarja(e.target.value)}
                  placeholder="مثلاً اولیٰ، ثانیہ، یا تمام درجات"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">کل نمبر (Total)</label>
                  <input
                    type="number"
                    min={1}
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">پاسنگ نمبر (Pass)</label>
                  <input
                    type="number"
                    min={1}
                    value={passMarks}
                    onChange={(e) => setPassMarks(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="مضمون حذف کریں"
        message="کیا آپ واقعی اس مضمون کو نصاب سے حذف کرنا چاہتے ہیں؟"
        itemName={subjectToDelete?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSubjectToDelete(null);
        }}
      />
    </div>
  );
};
