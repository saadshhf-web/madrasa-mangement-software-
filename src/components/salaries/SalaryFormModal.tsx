import React, { useState, useEffect } from 'react';
import { SalaryPayment, Teacher } from '../../types';
import { CreditCard, X, Save, AlertCircle } from 'lucide-react';

interface SalaryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (salary: SalaryPayment) => { success: boolean; error?: string };
  teachers: Teacher[];
}

export const SalaryFormModal: React.FC<SalaryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teachers,
}) => {
  const [teacherId, setTeacherId] = useState('');
  const [month, setMonth] = useState('شوال / فروری');
  const [year, setYear] = useState('2026');
  const [basicSalary, setBasicSalary] = useState<number>(0);
  const [allowance, setAllowance] = useState<number>(0);
  const [extraAmount, setExtraAmount] = useState<number>(0);
  const [deduction, setDeduction] = useState<number>(0);
  const [absenceDeduction, setAbsenceDeduction] = useState<number>(0);
  const [advance, setAdvance] = useState<number>(0);
  const [otherDeduction, setOtherDeduction] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'نقد' | 'بینک' | 'Easypaisa' | 'JazzCash' | 'دیگر'>('نقد');
  const [receiptNo, setReceiptNo] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReceiptNo(`SAL-${Date.now().toString().slice(-6)}`);
      if (teachers.length > 0 && !teacherId) {
        setTeacherId(teachers[0].id);
        setBasicSalary(teachers[0].basicSalary || 25000);
        setPaidAmount(teachers[0].basicSalary || 25000);
      }
      setErrorMsg('');
    }
  }, [isOpen, teachers]);

  const handleTeacherChange = (id: string) => {
    setTeacherId(id);
    const tch = teachers.find((t) => t.id === id);
    if (tch) {
      setBasicSalary(tch.basicSalary || 0);
      setPaidAmount(tch.basicSalary || 0);
    }
  };

  if (!isOpen) return null;

  const totalEarnings = (Number(basicSalary) || 0) + (Number(allowance) || 0) + (Number(extraAmount) || 0);
  const totalDeductions =
    (Number(deduction) || 0) +
    (Number(absenceDeduction) || 0) +
    (Number(advance) || 0) +
    (Number(otherDeduction) || 0);
  const netSalary = Math.max(0, totalEarnings - totalDeductions);
  const remainingAmount = Math.max(0, netSalary - (Number(paidAmount) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!teacherId) {
      setErrorMsg('استاد کا انتخاب لازمی ہے۔');
      return;
    }
    if (netSalary <= 0) {
      setErrorMsg('خالص تنخواہ صفر سے زیادہ ہونی چاہیے۔');
      return;
    }

    const salary: SalaryPayment = {
      id: `SAL-${Date.now()}`,
      receiptNo: receiptNo.trim() || `SAL-${Date.now().toString().slice(-5)}`,
      teacherId,
      month,
      year,
      basicSalary: Number(basicSalary),
      allowance: Number(allowance),
      extraAmount: Number(extraAmount),
      deduction: Number(deduction),
      absenceDeduction: Number(absenceDeduction),
      advance: Number(advance),
      otherDeduction: Number(otherDeduction),
      netSalary,
      paidAmount: Number(paidAmount),
      remainingAmount,
      paymentDate,
      paymentMethod,
      notes,
      createdAt: new Date().toISOString(),
    };

    const res = onSave(salary);
    if (!res.success) {
      setErrorMsg(res.error || 'تنخواہ کا ریکارڈ محفوظ نہیں ہو سکا۔');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-nastaliq leading-relaxed">
                تنخواہ کی ادائیگی کا اندراج (Teacher Salary)
              </h2>
              <p className="text-xs text-slate-300">
                تمام واجبات اور کٹوتیوں کا خودکار حساب
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center gap-2 text-rose-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">
                استاد محترم منتخب کریں <span className="text-rose-600">*</span>
              </label>
              <select
                required
                value={teacherId}
                onChange={(e) => handleTeacherChange(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white font-bold"
              >
                <option value="">استاد کا انتخاب کریں</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ولدیت {t.fatherName} (CNIC: {t.cnic}، {t.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">رسید نمبر</label>
              <input
                type="text"
                required
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ماہ</label>
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">سال</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          {/* Earnings & Deductions Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Earnings */}
            <div className="border border-emerald-200 rounded-xl p-3.5 bg-emerald-50/30 space-y-2.5">
              <span className="font-bold text-emerald-900 text-xs block border-b border-emerald-200 pb-1">
                ادائیگیاں و واجبات (Earnings)
              </span>

              <div>
                <label className="block text-slate-600 font-medium mb-1">بنیادی تنخواہ (روپے):</label>
                <input
                  type="number"
                  min={0}
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">الاؤنس:</label>
                <input
                  type="number"
                  min={0}
                  value={allowance}
                  onChange={(e) => setAllowance(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">اضافی رقم / بونس:</label>
                <input
                  type="number"
                  min={0}
                  value={extraAmount}
                  onChange={(e) => setExtraAmount(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                />
              </div>

              <div className="pt-2 text-emerald-950 font-bold text-xs flex justify-between border-t border-emerald-200">
                <span>کل واجب الادا:</span>
                <span>{totalEarnings.toLocaleString()} روپے</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-rose-200 rounded-xl p-3.5 bg-rose-50/30 space-y-2.5">
              <span className="font-bold text-rose-900 text-xs block border-b border-rose-200 pb-1">
                کٹوتیاں (Deductions)
              </span>

              <div>
                <label className="block text-slate-600 font-medium mb-1">غیر حاضری کٹوتی:</label>
                <input
                  type="number"
                  min={0}
                  value={absenceDeduction}
                  onChange={(e) => setAbsenceDeduction(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">پیشگی رقم (Advance):</label>
                <input
                  type="number"
                  min={0}
                  value={advance}
                  onChange={(e) => setAdvance(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">دیگر کٹوتیاں:</label>
                <input
                  type="number"
                  min={0}
                  value={deduction}
                  onChange={(e) => setDeduction(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900"
                />
              </div>

              <div className="pt-2 text-rose-950 font-bold text-xs flex justify-between border-t border-rose-200">
                <span>کل کٹوتی:</span>
                <span>{totalDeductions.toLocaleString()} روپے</span>
              </div>
            </div>
          </div>

          {/* Final Net and Paid */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">خالص تنخواہ (Net):</label>
              <div className="text-lg font-black text-blue-950">
                {netSalary.toLocaleString()} روپے
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">ادا شدہ رقم (Paid):</label>
              <input
                type="number"
                min={0}
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full border border-emerald-300 rounded-lg px-3 py-1.5 text-emerald-950 font-bold bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">بقایا رقم (Balance):</label>
              <div className="text-lg font-black text-rose-700">
                {remainingAmount.toLocaleString()} روپے
              </div>
            </div>
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">تاریخ ادائیگی</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">طریقہ ادائیگی</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
              >
                <option value="نقد">نقد (Cash)</option>
                <option value="بینک">بینک اکاؤنٹ (Bank)</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="JazzCash">JazzCash</option>
                <option value="دیگر">دیگر</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">نوٹس / ریمارکس</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="خصوصی تفصیل..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              منسوخ کریں
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              سلپ بنائیں اور محفوظ کریں
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
