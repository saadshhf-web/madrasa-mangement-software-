import React, { useState, useMemo } from 'react';
import { SalaryPayment, Teacher, MadrasaSettings } from '../../types';
import { SalaryFormModal } from './SalaryFormModal';
import { SalarySlipModal } from '../teachers/SalarySlipModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { PrintModal } from '../common/PrintModal';
import { PrintHeader } from '../common/PrintHeader';
import {
  CreditCard,
  Plus,
  Search,
  RotateCcw,
  Printer,
  Trash2,
  Eye,
  Filter,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface SalaryManagementProps {
  salaries: SalaryPayment[];
  teachers: Teacher[];
  settings: MadrasaSettings;
  onSaveSalary: (salary: SalaryPayment) => { success: boolean; error?: string };
  onDeleteSalary: (id: string) => { success: boolean; error?: string };
}

export const SalaryManagement: React.FC<SalaryManagementProps> = ({
  salaries,
  teachers,
  settings,
  onSaveSalary,
  onDeleteSalary,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [selectedSalaryForSlip, setSelectedSalaryForSlip] = useState<SalaryPayment | null>(null);
  const [isSlipOpen, setIsSlipOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState<SalaryPayment | null>(null);

  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const filteredSalaries = useMemo(() => {
    return salaries.filter((s) => {
      const teacher = teachers.find((t) => t.id === s.teacherId);
      const q = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !q ||
        s.receiptNo.toLowerCase().includes(q) ||
        s.month.toLowerCase().includes(q) ||
        (teacher &&
          (teacher.name.toLowerCase().includes(q) ||
            teacher.cnic.toLowerCase().includes(q) ||
            teacher.teacherId.toLowerCase().includes(q)));

      const matchesMonth = !selectedMonth || s.month.includes(selectedMonth);

      return matchesSearch && matchesMonth;
    });
  }, [salaries, teachers, searchTerm, selectedMonth]);

  const totalPaid = filteredSalaries.reduce((sum, s) => sum + (Number(s.paidAmount) || 0), 0);
  const totalRemaining = filteredSalaries.reduce(
    (sum, s) => sum + (Number(s.remainingAmount) || 0),
    0
  );

  const handleOpenSlip = (salary: SalaryPayment) => {
    setSelectedSalaryForSlip(salary);
    setIsSlipOpen(true);
  };

  const handleRequestDelete = (salary: SalaryPayment) => {
    setSalaryToDelete(salary);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (salaryToDelete) {
      const res = onDeleteSalary(salaryToDelete.id);
      if (!res.success) {
        alert(res.error || 'تنخواہ کا ریکارڈ حذف نہیں ہو سکا۔');
      }
      setIsDeleteModalOpen(false);
      setSalaryToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 font-nastaliq leading-relaxed">
            اساتذہ کی تنخواہیں (Teacher Salaries & Slips)
          </h1>
          <p className="text-xs text-slate-500">
            ماہانہ تنخواہوں کی ادائیگی، سلپس کی تیاری، کٹوتیوں اور بقایاجات کا انتظام
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            تنخواہ کی ادائیگی کا اندراج (Pay Salary)
          </button>

          <button
            type="button"
            onClick={() => setIsPrintReportOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            تنخواہ گوشوارہ پرنٹ
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-medium block">کل ادا شدہ تنخواہیں (Total Paid)</span>
            <span className="text-2xl font-black text-blue-950 mt-1 block">
              {totalPaid.toLocaleString()} روپے
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-rose-700 text-xs font-bold block">کل واجب الادا بقایا (Remaining Balance)</span>
            <span className="text-2xl font-black text-rose-700 mt-1 block">
              {totalRemaining.toLocaleString()} روپے
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-950 border-b border-slate-100 pb-2">
          <Filter className="w-4 h-4 text-amber-600" />
          تلاش و فلٹرز (Search Salaries)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">
              تلاش (رسید نمبر، استاد کا نام یا CNIC):
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

          <div>
            <label className="block text-slate-600 font-medium mb-1">ماہانہ مدت:</label>
            <input
              type="text"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              placeholder="مثلاً فروری، شوال، وغیرہ"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            کل ریکارڈز: <strong className="text-blue-950">{filteredSalaries.length}</strong>
          </span>

          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedMonth('');
            }}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            صاف کریں
          </button>
        </div>
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-3 px-4">رسید نمبر</th>
                <th className="py-3 px-4">استاد کا نام</th>
                <th className="py-3 px-4">شناختی کارڈ (CNIC)</th>
                <th className="py-3 px-3">ماہ / سال</th>
                <th className="py-3 px-3 text-center">بنیادی تنخواہ</th>
                <th className="py-3 px-3 text-center">خالص تنخواہ</th>
                <th className="py-3 px-3 text-center">ادا شدہ رقم</th>
                <th className="py-3 px-3 text-center">بقایا رقم</th>
                <th className="py-3 px-3 text-center">تاریخ ادائیگی</th>
                <th className="py-3 px-4 text-center">سلپ دیکھیں و پرنٹ</th>
                <th className="py-3 px-3 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSalaries.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <CreditCard className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-sm">کوئی تنخواہ کا ریکارڈ موجود نہیں ہے۔</p>
                    <p className="text-xs text-slate-400 mt-1">
                      نئی ادائیگی کا اندراج کرنے کے لیے "تنخواہ کی ادائیگی کا اندراج" پر کلک کریں۔
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSalaries.map((s) => {
                  const teacher = teachers.find((t) => t.id === s.teacherId);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-900">{s.receiptNo}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        {teacher?.name || 'نامعلوم'}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {teacher?.designation}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-950">
                        {teacher?.cnic || '---'}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {s.month} {s.year}
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium text-slate-700">
                        {s.basicSalary.toLocaleString()} روپے
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-950">
                        {s.netSalary.toLocaleString()} روپے
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-800">
                        {s.paidAmount.toLocaleString()} روپے
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-rose-700">
                        {s.remainingAmount > 0 ? `${s.remainingAmount.toLocaleString()} روپے` : '0'}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600">{s.paymentDate}</td>

                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenSlip(s)}
                          className="px-3 py-1 bg-blue-950 hover:bg-blue-900 text-amber-400 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          تنخواہ سلپ
                        </button>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(s)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors cursor-pointer"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Salary Form Modal */}
      <SalaryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={onSaveSalary}
        teachers={teachers}
      />

      {/* Salary Slip Print Modal */}
      <SalarySlipModal
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
        salary={selectedSalaryForSlip}
        teacher={
          selectedSalaryForSlip
            ? teachers.find((t) => t.id === selectedSalaryForSlip.teacherId) || null
            : null
        }
        settings={settings}
      />

      {/* Real Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="تنخواہ کا ریکارڈ حذف کریں"
        message="کیا آپ واقعی اس تنخواہ ادائیگی کا ریکارڈ مستقل طور پر حذف کرنا چاہتے ہیں؟"
        itemName={salaryToDelete ? `رسید نمبر: ${salaryToDelete.receiptNo}` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSalaryToDelete(null);
        }}
      />

      {/* Print Salary Report Modal */}
      <PrintModal
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
        title="اساتذہ تنخواہ گوشوارہ پرنٹ"
        orientation="landscape"
      >
        <div className="p-4 bg-white text-slate-900 border border-slate-400 rounded-xl">
          <PrintHeader
            settings={settings}
            documentTitle="اساتذہ و عملہ تنخواہ گوشوارہ (SALARY DISBURSEMENT SHEET)"
            subTitle={`تعلیمی سال: ${settings.academicYear} • تاریخ پرنٹ: ${new Date().toLocaleDateString('ur-PK')}`}
            metaInfo={[
              { label: 'کل ادا شدہ رقم', value: `${totalPaid.toLocaleString()} روپے` },
              { label: 'کل بقایا رقم', value: `${totalRemaining.toLocaleString()} روپے` },
              { label: 'کل ادائیگیاں', value: String(filteredSalaries.length) },
            ]}
          />

          <table className="w-full text-xs text-right border-collapse border border-slate-300 mt-4">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-2 px-2 text-center w-10">شمار</th>
                <th className="py-2 px-2 text-center w-20">رسید #</th>
                <th className="py-2 px-3">استاد کا نام</th>
                <th className="py-2 px-3 text-center">شناختی کارڈ (CNIC)</th>
                <th className="py-2 px-3">ماہ / سال</th>
                <th className="py-2 px-3 text-center">بنیادی تنخواہ</th>
                <th className="py-2 px-3 text-center">خالص تنخواہ</th>
                <th className="py-2 px-3 text-center">ادا شدہ رقم</th>
                <th className="py-2 px-3 text-center">بقایا</th>
                <th className="py-2 px-3">دستخط وصولی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSalaries.map((s, idx) => {
                const t = teachers.find((tch) => tch.id === s.teacherId);
                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2 px-2 text-center font-semibold">{idx + 1}</td>
                    <td className="py-2 px-2 text-center font-mono font-bold text-blue-900">{s.receiptNo}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{t?.name || '---'}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold">{t?.cnic || '---'}</td>
                    <td className="py-2 px-3 text-slate-800">{s.month} {s.year}</td>
                    <td className="py-2 px-3 text-center font-semibold">{s.basicSalary.toLocaleString()}</td>
                    <td className="py-2 px-3 text-center font-bold text-blue-950">{s.netSalary.toLocaleString()}</td>
                    <td className="py-2 px-3 text-center font-bold text-emerald-800">{s.paidAmount.toLocaleString()}</td>
                    <td className="py-2 px-3 text-center font-bold text-rose-800">{s.remainingAmount.toLocaleString()}</td>
                    <td className="py-2 px-3 border-b border-dotted border-slate-300"></td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                <td colSpan={7} className="py-2.5 px-3 text-left">مجموعی ٹوٹل:</td>
                <td className="py-2.5 px-3 text-center font-black text-emerald-950">{totalPaid.toLocaleString()} روپے</td>
                <td className="py-2.5 px-3 text-center font-black text-rose-950">{totalRemaining.toLocaleString()} روپے</td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-between items-end mt-12 pt-4 border-t border-slate-300 text-xs">
            <div className="text-center">
              <div className="w-32 border-b border-dotted border-slate-700 mb-1"></div>
              <span>دستخط اکاؤنٹنٹ</span>
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
