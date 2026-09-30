import React from 'react';
import { SalaryPayment, Teacher, MadrasaSettings } from '../../types';
import { PrintModal } from '../common/PrintModal';
import { PrintHeader } from '../common/PrintHeader';

interface SalarySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  salary: SalaryPayment | null;
  teacher: Teacher | null;
  settings: MadrasaSettings;
}

export const SalarySlipModal: React.FC<SalarySlipModalProps> = ({
  isOpen,
  onClose,
  salary,
  teacher,
  settings,
}) => {
  if (!salary || !teacher) return null;

  return (
    <PrintModal
      isOpen={isOpen}
      onClose={onClose}
      title={`تنخواہ سلپ (Salary Slip) - ${teacher.name} - ${salary.month} ${salary.year}`}
      orientation="portrait"
    >
      <div className="p-4 border-2 border-slate-800 rounded-xl bg-white max-w-2xl mx-auto">
        <PrintHeader
          settings={settings}
          documentTitle="تنخواہ ادائیگی سلپ (SALARY SLIP)"
          subTitle={`رسید نمبر: ${salary.receiptNo}`}
          metaInfo={[
            { label: 'رسید نمبر', value: salary.receiptNo },
            { label: 'ماہ / سال', value: `${salary.month} ${salary.year}` },
            { label: 'ادائیگی تاریخ', value: salary.paymentDate },
            { label: 'طریقہ ادائیگی', value: salary.paymentMethod },
          ]}
        />

        {/* Teacher Details */}
        <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/70 my-4 grid grid-cols-2 gap-3 text-xs text-right">
          <div>
            <span className="text-slate-500 font-medium">استاد کا نام: </span>
            <span className="text-slate-900 font-bold">{teacher.name}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">والد کا نام: </span>
            <span className="text-slate-900 font-bold">{teacher.fatherName}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">استاد ID: </span>
            <span className="text-slate-900 font-semibold">{teacher.teacherId}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">شناختی کارڈ (CNIC): </span>
            <span className="text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded">
              {teacher.cnic || '---'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">عہدہ و شعبہ: </span>
            <span className="text-slate-900 font-medium">{teacher.designation} - {teacher.branch}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">موبائل نمبر: </span>
            <span className="text-slate-900">{teacher.mobile}</span>
          </div>
        </div>

        {/* Salary Breakdown Table */}
        <div className="grid grid-cols-2 gap-4 my-4">
          {/* Earnings */}
          <div className="border border-emerald-300 rounded-lg overflow-hidden">
            <div className="bg-emerald-800 text-white font-bold text-xs py-2 px-3 text-center">
              واجبات و ادائیگیاں (Earnings)
            </div>
            <table className="w-full text-xs text-right border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-600">بنیادی تنخواہ:</td>
                  <td className="py-2 px-3 font-bold text-slate-900 text-left">
                    {salary.basicSalary.toLocaleString()} روپے
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-600">الاؤنس (Allowance):</td>
                  <td className="py-2 px-3 font-semibold text-slate-800 text-left">
                    {salary.allowance.toLocaleString()} روپے
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-600">اضافی رقم (Bonus/Extra):</td>
                  <td className="py-2 px-3 font-semibold text-slate-800 text-left">
                    {salary.extraAmount.toLocaleString()} روپے
                  </td>
                </tr>
                <tr className="bg-emerald-50/80 font-bold border-t border-emerald-200">
                  <td className="py-2.5 px-3 text-emerald-950">کل آمدن:</td>
                  <td className="py-2.5 px-3 text-emerald-950 text-left">
                    {(salary.basicSalary + salary.allowance + salary.extraAmount).toLocaleString()} روپے
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div className="border border-rose-300 rounded-lg overflow-hidden">
            <div className="bg-rose-800 text-white font-bold text-xs py-2 px-3 text-center">
              کٹوتیاں (Deductions)
            </div>
            <table className="w-full text-xs text-right border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-600">غیر حاضری کٹوتی:</td>
                  <td className="py-2 px-3 font-semibold text-rose-700 text-left">
                    {salary.absenceDeduction.toLocaleString()} روپے
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-600">پیشگی رقم (Advance):</td>
                  <td className="py-2 px-3 font-semibold text-rose-700 text-left">
                    {salary.advance.toLocaleString()} روپے
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-600">دیگر کٹوتیاں:</td>
                  <td className="py-2 px-3 font-semibold text-rose-700 text-left">
                    {(salary.deduction + salary.otherDeduction).toLocaleString()} روپے
                  </td>
                </tr>
                <tr className="bg-rose-50/80 font-bold border-t border-rose-200">
                  <td className="py-2.5 px-3 text-rose-950">کل کٹوتی:</td>
                  <td className="py-2.5 px-3 text-rose-950 text-left">
                    {(
                      salary.absenceDeduction +
                      salary.advance +
                      salary.deduction +
                      salary.otherDeduction
                    ).toLocaleString()} روپے
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Payment Summary */}
        <div className="border-2 border-blue-950 rounded-xl p-3.5 bg-blue-50/50 my-4 grid grid-cols-3 gap-3 text-center text-xs">
          <div className="border-l border-blue-200 pl-2">
            <div className="text-slate-600 font-medium">خالص واجب الادا (Net Salary)</div>
            <div className="text-base font-extrabold text-blue-950 mt-1">
              {salary.netSalary.toLocaleString()} روپے
            </div>
          </div>
          <div className="border-l border-blue-200 px-2">
            <div className="text-emerald-700 font-medium">ادا شدہ رقم (Paid Amount)</div>
            <div className="text-base font-extrabold text-emerald-800 mt-1">
              {salary.paidAmount.toLocaleString()} روپے
            </div>
          </div>
          <div className="pr-2">
            <div className="text-rose-700 font-medium">بقایا رقم (Balance)</div>
            <div className="text-base font-extrabold text-rose-800 mt-1">
              {salary.remainingAmount.toLocaleString()} روپے
            </div>
          </div>
        </div>

        {salary.notes && (
          <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 my-2">
            <span className="font-semibold text-slate-700">نوٹ / تفصیل: </span>
            {salary.notes}
          </div>
        )}

        {/* Signatures */}
        <div className="flex justify-between items-end mt-12 pt-4 border-t border-slate-300 text-xs">
          <div className="text-center">
            <div className="w-32 border-b border-dotted border-slate-700 mb-1"></div>
            <span className="font-medium text-slate-700">دستخط اکاؤنٹنٹ / خزانچی</span>
          </div>

          <div className="w-16 h-16 rounded-full border border-dashed border-amber-600 flex items-center justify-center text-[9px] text-amber-800">
            مہر دفتر
          </div>

          <div className="text-center">
            <div className="w-32 border-b border-dotted border-slate-700 mb-1"></div>
            <span className="font-medium text-slate-700">دستخط استاد محترم</span>
          </div>
        </div>
      </div>
    </PrintModal>
  );
};
