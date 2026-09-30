import React from 'react';
import { Printer, X, Download } from 'lucide-react';
import { triggerPrint } from '../../utils/print';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  orientation?: 'portrait' | 'landscape';
  children: React.ReactNode;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  title,
  orientation = 'portrait',
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-xs overflow-y-auto print:static print:bg-white print:p-0">
      {/* Top Action Bar (Hidden during printing) */}
      <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex items-center justify-between shadow-xl no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-xs text-slate-400">
              پرنٹ پیج سائز: A4 ({orientation === 'landscape' ? 'افقی / Landscape' : 'عمودی / Portrait'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={triggerPrint}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            پرنٹ کریں (Print)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="بند کریں"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Paper Canvas */}
      <div className="flex-1 flex justify-center p-4 sm:p-8 print:p-0 print:m-0">
        <div
          className={`printable-document bg-white text-slate-900 shadow-2xl rounded-sm print:shadow-none print:rounded-none p-8 sm:p-12 border border-slate-300 print:border-none ${
            orientation === 'landscape' ? 'a4-landscape max-w-5xl w-full' : 'a4-portrait max-w-4xl w-full'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
