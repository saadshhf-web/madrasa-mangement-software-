import React, { useState, useEffect } from 'react';
import { FeeRecord, Student } from '../../types';
import { DollarSign, X, Save, AlertCircle } from 'lucide-react';

interface FeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fee: FeeRecord) => { success: boolean; error?: string };
  students: Student[];
}

export const FeeFormModal: React.FC<FeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  students,
}) => {
  const [studentId, setStudentId] = useState('');
  const [month, setMonth] = useState('شوال 1447ھ / فروری 2026');
  const [feeType, setFeeType] = useState<'ماہانہ فیس' | 'داخلہ فیس' | 'امتحانی فیس' | 'ہاسٹل فیس' | 'دیگر فیس'>('ماہانہ فیس');
  const [totalAmount, setTotalAmount] = useState<number>(3000);
  const [paidAmount, setPaidAmount] = useState<number>(3000);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'نقد' | 'بینک' | 'Easypaisa' | 'JazzCash' | 'دیگر'>('نقد');
  const [receiptNo, setReceiptNo] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReceiptNo(`REC-${Date.now().toString().slice(-6)}`);
      if (students.length > 0 && !studentId) {
        setStudentId(students[0].id);
      }
      setErrorMsg('');
    }
  }, [isOpen, students]);

  if (!isOpen) return null;

  const remainingAmount = Math.max(0, (Number(totalAmount) || 0) - (Number(paidAmount) || 0));
  let status: 'ادا شدہ' | 'جزوی' | 'بقایا' = 'ادا شدہ';
  if (paidAmount <= 0) {
    status = 'بقایا';
  } else if (remainingAmount > 0) {
    status = 'جزوی';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!studentId) {
      setErrorMsg('طالب علم کا انتخاب لازمی ہے۔');
      return;
    }
    if (totalAmount <= 0) {
      setErrorMsg('کل رقم صفر سے زیادہ ہونی چاہیے۔');
      return;
    }
    if (paidAmount < 0) {
      setErrorMsg('وصول شدہ رقم منفی نہیں ہو سکتی۔');
      return;
    }

    const fee: FeeRecord = {
      id: `FEE-${Date.now()}`,
      receiptNo: receiptNo.trim() || `REC-${Date.now().toString().slice(-5)}`,
      studentId,
      month,
      feeType,
      totalAmount: Number(totalAmount),
      paidAmount: Number(paidAmount),
      remainingAmount,
      paymentDate,
      paymentMethod,
      status,
      notes,
      createdAt: new Date().toISOString(),
    };

    const res = onSave(fee);
    if (!res.success) {
      setErrorMsg(res.error || 'فیس کا اندراج محفوظ نہیں ہو سکا۔');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-nastaliq leading-relaxed">
                فیس وصولی کا اندراج (Fee Collection)
              </h2>
              <p className="text-xs text-slate-300">رسید نمبر خودکار طریقے سے بنتی ہے</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                طالب علم منتخب کریں <span className="text-rose-600">*</span>
              </label>
              <select
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white font-bold"
              >
                <option value="">طالب علم کا انتخاب کریں</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ولدیت {st.fatherName} (رول نمبر: {st.rollNo}، {st.branch})
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
              <label className="block font-bold text-slate-700 mb-1">ماہانہ مدت / مہینہ</label>
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="مثلاً فروری 2026"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">فیس کی قسم</label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white"
              >
                <option value="ماہانہ فیس">ماہانہ فیس</option>
                <option value="داخلہ فیس">داخلہ فیس</option>
                <option value="امتحانی فیس">امتحانی فیس</option>
                <option value="ہاسٹل فیس">ہاسٹل فیس</option>
                <option value="دیگر فیس">دیگر فیس</option>
              </select>
            </div>

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
              <label className="block font-bold text-slate-700 mb-1">
                کل واجب الادا فیس (روپے) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                min={0}
                required
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                وصول شدہ رقم (روپے) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                min={0}
                required
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full border border-emerald-300 rounded-lg px-3 py-2 text-emerald-950 font-bold bg-emerald-50/20"
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
                <option value="بینک">بینک ٹرانسفر (Bank)</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="JazzCash">JazzCash</option>
                <option value="دیگر">دیگر</option>
              </select>
            </div>

            {/* Remaining Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-medium block">بقایا رقم:</span>
                <span className="text-sm font-extrabold text-rose-700">
                  {remainingAmount.toLocaleString()} روپے
                </span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  status === 'ادا شدہ'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'جزوی'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {status}
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">نوٹس / اضافی تفصیل</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="خصوصی ریمارکس..."
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
              رسید بنائیں اور محفوظ کریں
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
