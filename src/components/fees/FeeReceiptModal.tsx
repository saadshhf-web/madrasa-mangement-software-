import React from 'react';
import { FeeRecord, Student, MadrasaSettings } from '../../types';
import { PrintModal } from '../common/PrintModal';
import { PrintHeader } from '../common/PrintHeader';
import { openWhatsAppChat, formatMessageTemplate } from '../../utils/whatsapp';
import { MessageSquare, CheckCircle } from 'lucide-react';

interface FeeReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: FeeRecord | null;
  student: Student | null;
  settings: MadrasaSettings;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  isOpen,
  onClose,
  fee,
  student,
  settings,
}) => {
  if (!fee || !student) return null;

  const handleSendWhatsAppReceipt = () => {
    const phone = student.whatsapp || student.guardianPhone || student.mobile;
    const msg = formatMessageTemplate(settings.whatsappTemplates.feeReceipt, {
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

    const res = openWhatsAppChat(phone, msg);
    if (!res.success) {
      alert(res.error || 'طالب علم یا سرپرست کا درست WhatsApp نمبر موجود نہیں ہے۔');
    }
  };

  return (
    <PrintModal
      isOpen={isOpen}
      onClose={onClose}
      title={`فیس وصولی رسید (Fee Receipt) - رسید #${fee.receiptNo}`}
      orientation="portrait"
    >
      <div className="p-4 border-2 border-slate-800 rounded-xl bg-white max-w-2xl mx-auto">
        <PrintHeader
          settings={settings}
          documentTitle="فیس وصولی رسید (FEE RECEIPT)"
          subTitle={`رسید نمبر: ${fee.receiptNo}`}
          metaInfo={[
            { label: 'رسید نمبر', value: fee.receiptNo },
            { label: 'ادائیگی تاریخ', value: fee.paymentDate },
            { label: 'طریقہ ادائیگی', value: fee.paymentMethod },
            { label: 'ماہ', value: fee.month },
          ]}
        />

        {/* Student Details Grid */}
        <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/70 my-4 grid grid-cols-2 gap-3 text-xs text-right">
          <div>
            <span className="text-slate-500">طالب علم کا نام: </span>
            <span className="text-slate-900 font-bold">{student.name}</span>
          </div>
          <div>
            <span className="text-slate-500">والد کا نام: </span>
            <span className="text-slate-900 font-bold">{student.fatherName}</span>
          </div>
          <div>
            <span className="text-slate-500">رول نمبر / ID: </span>
            <span className="text-slate-900 font-semibold">{student.rollNo} / {student.studentId}</span>
          </div>
          <div>
            <span className="text-slate-500">داخلہ نمبر: </span>
            <span className="text-slate-900">{student.admissionNo}</span>
          </div>
          <div>
            <span className="text-slate-500">شعبہ و درجہ: </span>
            <span className="text-slate-900 font-medium">{student.branch} - {student.darja || '---'}</span>
          </div>
          <div>
            <span className="text-slate-500">موبائل / رابطہ: </span>
            <span className="text-slate-900">{student.guardianPhone || student.mobile}</span>
          </div>
        </div>

        {/* Fee Breakdown Table */}
        <table className="w-full text-xs text-right border-collapse border border-slate-300 my-4">
          <thead>
            <tr className="bg-slate-900 text-white font-bold">
              <th className="py-2.5 px-3 border-l border-slate-700">شمار</th>
              <th className="py-2.5 px-4 border-l border-slate-700">تفصیل / فیس کی قسم</th>
              <th className="py-2.5 px-4 border-l border-slate-700 text-center">ماہانہ مدت</th>
              <th className="py-2.5 px-4 text-center">رقم (روپے)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="py-2.5 px-3 border-l border-slate-200 text-center">1</td>
              <td className="py-2.5 px-4 border-l border-slate-200 font-bold text-slate-800">
                {fee.feeType}
              </td>
              <td className="py-2.5 px-4 border-l border-slate-200 text-center font-medium">
                {fee.month}
              </td>
              <td className="py-2.5 px-4 text-center font-bold text-slate-900">
                {fee.totalAmount.toLocaleString()} روپے
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold border-t border-slate-300">
              <td colSpan={3} className="py-2.5 px-4 border-l border-slate-300 text-left">
                کل واجب الادا فیس:
              </td>
              <td className="py-2.5 px-4 text-center text-slate-900 font-extrabold">
                {fee.totalAmount.toLocaleString()} روپے
              </td>
            </tr>
            <tr className="bg-emerald-50 text-emerald-900 font-bold">
              <td colSpan={3} className="py-2.5 px-4 border-l border-emerald-200 text-left">
                وصول شدہ رقم (Paid Amount):
              </td>
              <td className="py-2.5 px-4 text-center text-base font-extrabold text-emerald-800">
                {fee.paidAmount.toLocaleString()} روپے
              </td>
            </tr>
            <tr className="bg-rose-50 text-rose-900 font-bold">
              <td colSpan={3} className="py-2.5 px-4 border-l border-rose-200 text-left">
                بقایا رقم (Remaining Balance):
              </td>
              <td className="py-2.5 px-4 text-center font-extrabold text-rose-700">
                {fee.remainingAmount.toLocaleString()} روپے
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Status Badge & Notes */}
        <div className="flex items-center justify-between my-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">حیثیت رسید:</span>
            <span
              className={`px-3 py-1 rounded-full font-bold ${
                fee.status === 'ادا شدہ'
                  ? 'bg-emerald-100 text-emerald-800'
                  : fee.status === 'جزوی'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {fee.status}
            </span>
          </div>

          {fee.notes && (
            <div className="text-slate-600 text-right">
              <span className="font-semibold text-slate-700">نوٹ: </span>
              <span>{fee.notes}</span>
            </div>
          )}
        </div>

        {/* WhatsApp Action Button in preview (hidden in print) */}
        <div className="my-4 no-print flex justify-end">
          <button
            type="button"
            onClick={handleSendWhatsAppReceipt}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            فیس رسید WhatsApp کریں
          </button>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-12 pt-4 border-t border-slate-300 text-xs">
          <div className="text-center">
            <div className="w-32 border-b border-dotted border-slate-700 mb-1"></div>
            <span className="font-medium text-slate-700">دستخط وصول کنندہ / خزانچی</span>
          </div>

          <div className="w-16 h-16 rounded-full border border-dashed border-amber-600 flex items-center justify-center text-[9px] text-amber-800">
            مہر دفتر
          </div>

          <div className="text-center">
            <div className="w-32 border-b border-dotted border-slate-700 mb-1"></div>
            <span className="font-medium text-slate-700">دستخط سرپرست / ادا کنندہ</span>
          </div>
        </div>
      </div>
    </PrintModal>
  );
};
