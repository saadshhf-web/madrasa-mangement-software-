import React, { useState, useMemo } from 'react';
import { FeeRecord, Student, MadrasaSettings } from '../../types';
import { FeeFormModal } from './FeeFormModal';
import { FeeReceiptModal } from './FeeReceiptModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { PrintModal } from '../common/PrintModal';
import { PrintHeader } from '../common/PrintHeader';
import { openWhatsAppChat, formatMessageTemplate } from '../../utils/whatsapp';
import {
  DollarSign,
  Plus,
  Search,
  RotateCcw,
  Printer,
  Trash2,
  Eye,
  MessageSquare,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface FeeManagementProps {
  fees: FeeRecord[];
  students: Student[];
  settings: MadrasaSettings;
  onSaveFee: (fee: FeeRecord) => { success: boolean; error?: string };
  onDeleteFee: (id: string) => { success: boolean; error?: string };
}

export const FeeManagement: React.FC<FeeManagementProps> = ({
  fees,
  students,
  settings,
  onSaveFee,
  onDeleteFee,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [selectedFeeForReceipt, setSelectedFeeForReceipt] = useState<FeeRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState<FeeRecord | null>(null);

  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredFees = useMemo(() => {
    return fees.filter((f) => {
      const student = students.find((s) => s.id === f.studentId);
      const q = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !q ||
        f.receiptNo.toLowerCase().includes(q) ||
        f.month.toLowerCase().includes(q) ||
        (student &&
          (student.name.toLowerCase().includes(q) ||
            student.fatherName.toLowerCase().includes(q) ||
            student.rollNo.includes(q) ||
            student.studentId.toLowerCase().includes(q)));

      const matchesMonth = !selectedMonth || f.month.includes(selectedMonth);
      const matchesStatus = !selectedStatus || f.status === selectedStatus;

      return matchesSearch && matchesMonth && matchesStatus;
    });
  }, [fees, students, searchTerm, selectedMonth, selectedStatus]);

  // Overall financial summary
  const totalExpected = filteredFees.reduce((sum, f) => sum + (Number(f.totalAmount) || 0), 0);
  const totalCollected = filteredFees.reduce((sum, f) => sum + (Number(f.paidAmount) || 0), 0);
  const totalPending = filteredFees.reduce((sum, f) => sum + (Number(f.remainingAmount) || 0), 0);

  // Open receipt modal
  const handleOpenReceipt = (fee: FeeRecord) => {
    setSelectedFeeForReceipt(fee);
    setIsReceiptOpen(true);
  };

  // WhatsApp reminder for pending fee
  const handleSendFeeReminderWhatsApp = (fee: FeeRecord) => {
    const student = students.find((s) => s.id === fee.studentId);
    if (!student) return;

    const phone = student.whatsapp || student.guardianPhone || student.mobile;
    if (!phone) {
      alert('اس طالب علم یا سرپرست کا WhatsApp نمبر موجود نہیں ہے۔');
      return;
    }

    const message = formatMessageTemplate(settings.whatsappTemplates.feeReminder, {
      StudentName: student.name,
      FatherName: student.fatherName,
      Class: student.darja || student.branch,
      Month: fee.month,
      TotalFee: fee.totalAmount,
      Paid: fee.paidAmount,
      Remaining: fee.remainingAmount,
    });

    const res = openWhatsAppChat(phone, message);
    if (!res.success) {
      alert(res.error || 'WhatsApp کھولنے میں دشواری پیش آئی۔');
    }
  };

  // WhatsApp receipt confirmation
  const handleSendReceiptWhatsApp = (fee: FeeRecord) => {
    const student = students.find((s) => s.id === fee.studentId);
    if (!student) return;

    const phone = student.whatsapp || student.guardianPhone || student.mobile;
    if (!phone) {
      alert('اس طالب علم یا سرپرست کا WhatsApp نمبر موجود نہیں ہے۔');
      return;
    }

    const message = formatMessageTemplate(settings.whatsappTemplates.feeReceipt, {
      StudentName: student.name,
      FatherName: student.fatherName,
      Class: student.darja || student.branch,
      Month: fee.month,
      ReceiptNo: fee.receiptNo,
      TotalFee: fee.totalAmount,
      Paid: fee.paidAmount,
      Remaining: fee.remainingAmount,
      Date: fee.paymentDate,
    });

    const res = openWhatsAppChat(phone, message);
    if (!res.success) {
      alert(res.error || 'WhatsApp کھولنے میں دشواری پیش آئی۔');
    }
  };

  const handleRequestDelete = (fee: FeeRecord) => {
    setFeeToDelete(fee);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (feeToDelete) {
      const res = onDeleteFee(feeToDelete.id);
      if (!res.success) {
        alert(res.error || 'فیس کا ریکارڈ حذف نہیں ہو سکا۔');
      }
      setIsDeleteModalOpen(false);
      setFeeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 font-nastaliq leading-relaxed">
            نظامتِ فیس (Fee Management & Receipts)
          </h1>
          <p className="text-xs text-slate-500">
            فیس وصولی، بقایا جات کا ریکارڈ، پرنٹ ایبل رسیدات اور WhatsApp الرٹس
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            فیس وصولی کا اندراج (New Fee Receipt)
          </button>

          <button
            type="button"
            onClick={() => setIsPrintReportOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            فیس رپورٹ پرنٹ
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-xs font-medium block">کل متوقع فیس</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">
              {totalExpected.toLocaleString()} روپے
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-emerald-700 text-xs font-bold block">وصول شدہ فیس (Collected)</span>
            <span className="text-xl font-black text-emerald-800 mt-1 block">
              {totalCollected.toLocaleString()} روپے
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-rose-700 text-xs font-bold block">زیر التواء / بقایا فیس (Pending)</span>
            <span className="text-xl font-black text-rose-700 mt-1 block">
              {totalPending.toLocaleString()} روپے
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
          تلاش و فلٹرز (Search Fee Records)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">
              تلاش (رسید نمبر، طالب علم کا نام یا رول نمبر):
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
              placeholder="مثلاً فروری یا 1447"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">حیثیت رسید:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white"
            >
              <option value="">تمام حیثیتیں</option>
              <option value="ادا شدہ">ادا شدہ (Paid)</option>
              <option value="جزوی">جزوی (Partial)</option>
              <option value="بقایا">بقایا (Pending)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            کل ریکارڈز: <strong className="text-blue-950">{filteredFees.length}</strong>
          </span>

          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedMonth('');
              setSelectedStatus('');
            }}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            فلٹرز صاف کریں
          </button>
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-3 px-4">رسید نمبر</th>
                <th className="py-3 px-4">طالب علم کا نام</th>
                <th className="py-3 px-3">رول نمبر</th>
                <th className="py-3 px-4">ماہ / فیس کی قسم</th>
                <th className="py-3 px-3 text-center">کل رقم</th>
                <th className="py-3 px-3 text-center">وصول شدہ</th>
                <th className="py-3 px-3 text-center">بقایا رقم</th>
                <th className="py-3 px-3 text-center">تاریخ ادائیگی</th>
                <th className="py-3 px-3 text-center">حیثیت</th>
                <th className="py-3 px-4 text-center">WhatsApp / رسید / پرنٹ</th>
                <th className="py-3 px-3 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <DollarSign className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-sm">کوئی فیس ریکارڈ موجود نہیں ہے۔</p>
                    <p className="text-xs text-slate-400 mt-1">
                      نئی رسید بنانے کے لیے "فیس وصولی کا اندراج" پر کلک کریں۔
                    </p>
                  </td>
                </tr>
              ) : (
                filteredFees.map((f) => {
                  const student = students.find((s) => s.id === f.studentId);
                  return (
                    <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 font-bold font-mono text-blue-900">{f.receiptNo}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        {student ? student.name : 'نامعلوم'}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {student?.fatherName}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 font-bold">{student?.rollNo || '---'}</td>
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-slate-800">{f.month}</span>
                        <div className="text-[10px] text-slate-500">{f.feeType}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                        {f.totalAmount.toLocaleString()} روپے
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                        {f.paidAmount.toLocaleString()} روپے
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-rose-700">
                        {f.remainingAmount > 0 ? `${f.remainingAmount.toLocaleString()} روپے` : '0'}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600">{f.paymentDate}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            f.status === 'ادا شدہ'
                              ? 'bg-emerald-100 text-emerald-800'
                              : f.status === 'جزوی'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>

                      {/* WhatsApp and Print Action Buttons */}
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenReceipt(f)}
                            className="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 text-amber-400 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                            title="رسید دیکھیں اور پرنٹ کریں"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            رسید
                          </button>

                          {f.remainingAmount > 0 ? (
                            <button
                              type="button"
                              onClick={() => handleSendFeeReminderWhatsApp(f)}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[11px] font-bold cursor-pointer"
                              title="بقایا فیس کا WhatsApp میسج بھیجیں"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSendReceiptWhatsApp(f)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-bold cursor-pointer"
                              title="فیس رسید WhatsApp کریں"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Real Delete */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(f)}
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

      {/* Fee Entry Form Modal */}
      <FeeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={onSaveFee}
        students={students}
      />

      {/* Fee Receipt Modal with real print & WhatsApp buttons */}
      <FeeReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        fee={selectedFeeForReceipt}
        student={
          selectedFeeForReceipt
            ? students.find((s) => s.id === selectedFeeForReceipt.studentId) || null
            : null
        }
        settings={settings}
      />

      {/* Real Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="فیس کا ریکارڈ حذف کریں"
        message="کیا آپ واقعی اس فیس رسید کا ریکارڈ مستقل طور پر حذف کرنا چاہتے ہیں؟"
        itemName={feeToDelete ? `رسید نمبر: ${feeToDelete.receiptNo} (${feeToDelete.month})` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setFeeToDelete(null);
        }}
      />

      {/* Print Fee Collection Report */}
      <PrintModal
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
        title="فیس وصولی رپورٹ پرنٹ"
        orientation="landscape"
      >
        <div className="p-4 bg-white text-slate-900 border border-slate-400 rounded-xl">
          <PrintHeader
            settings={settings}
            documentTitle="فیس وصولی و بقایاجات گوشوارہ (FEE COLLECTION REPORT)"
            subTitle={`تعلیمی سال: ${settings.academicYear} • تاریخ پرنٹ: ${new Date().toLocaleDateString('ur-PK')}`}
            metaInfo={[
              { label: 'کل متوقع رقم', value: `${totalExpected.toLocaleString()} روپے` },
              { label: 'کل وصول شدہ', value: `${totalCollected.toLocaleString()} روپے` },
              { label: 'کل بقایا رقم', value: `${totalPending.toLocaleString()} روپے` },
              { label: 'کل رسیدات', value: String(filteredFees.length) },
            ]}
          />

          <table className="w-full text-xs text-right border-collapse border border-slate-300 mt-4">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-2 px-2 text-center w-10">شمار</th>
                <th className="py-2 px-2 text-center w-20">رسید #</th>
                <th className="py-2 px-3">طالب علم کا نام</th>
                <th className="py-2 px-3">والد کا نام</th>
                <th className="py-2 px-2 text-center">رول #</th>
                <th className="py-2 px-3">ماہ و قسم</th>
                <th className="py-2 px-3 text-center">کل فیس</th>
                <th className="py-2 px-3 text-center">وصول شدہ</th>
                <th className="py-2 px-3 text-center">بقایا</th>
                <th className="py-2 px-3 text-center">تاریخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredFees.map((f, idx) => {
                const st = students.find((s) => s.id === f.studentId);
                return (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="py-2 px-2 text-center font-semibold">{idx + 1}</td>
                    <td className="py-2 px-2 text-center font-mono font-bold text-blue-900">{f.receiptNo}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{st?.name || '---'}</td>
                    <td className="py-2 px-3 text-slate-700">{st?.fatherName || '---'}</td>
                    <td className="py-2 px-2 text-center font-bold">{st?.rollNo || '---'}</td>
                    <td className="py-2 px-3 text-slate-800">{f.month}</td>
                    <td className="py-2 px-3 text-center font-semibold">{f.totalAmount.toLocaleString()}</td>
                    <td className="py-2 px-3 text-center font-bold text-emerald-800">{f.paidAmount.toLocaleString()}</td>
                    <td className="py-2 px-3 text-center font-bold text-rose-800">{f.remainingAmount.toLocaleString()}</td>
                    <td className="py-2 px-3 text-center text-slate-600">{f.paymentDate}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                <td colSpan={6} className="py-2 px-3 text-left">مجموعی ٹوٹل:</td>
                <td className="py-2 px-3 text-center font-black">{totalExpected.toLocaleString()} روپے</td>
                <td className="py-2 px-3 text-center font-black text-emerald-900">{totalCollected.toLocaleString()} روپے</td>
                <td className="py-2 px-3 text-center font-black text-rose-900">{totalPending.toLocaleString()} روپے</td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-between items-end mt-12 pt-4 border-t border-slate-300 text-xs">
            <div className="text-center">
              <div className="w-32 border-b border-dotted border-slate-700 mb-1"></div>
              <span>دستخط خزانچی / فیس کلرک</span>
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
