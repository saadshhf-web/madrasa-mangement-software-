import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title = 'حذف کرنے کی تصدیق',
  message = 'کیا آپ واقعی یہ ریکارڈ حذف کرنا چاہتے ہیں؟',
  itemName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden transform transition-all animate-in fade-in duration-150">
        {/* Header */}
        <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-900">{title}</h3>
              <p className="text-xs text-rose-600">یہ عمل ناقابلِ واپسی ہے</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-right">
          <p className="text-slate-700 font-medium text-base mb-2">{message}</p>
          {itemName && (
            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 text-slate-800 font-bold text-sm my-3 break-all">
              {itemName}
            </div>
          )}
          <p className="text-xs text-slate-500">
            حذف کرنے کی صورت میں یہ ریکارڈ مستقل طور پر ڈیٹا بیس سے مٹ جائے گا۔
          </p>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors font-medium text-sm cursor-pointer"
          >
            منسوخ کریں
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            حذف کریں
          </button>
        </div>
      </div>
    </div>
  );
};
