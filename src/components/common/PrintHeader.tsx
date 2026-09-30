import React from 'react';
import { MadrasaSettings } from '../../types';

interface PrintHeaderProps {
  settings: MadrasaSettings;
  documentTitle: string;
  subTitle?: string;
  metaInfo?: { label: string; value: string }[];
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({
  settings,
  documentTitle,
  subTitle,
  metaInfo,
}) => {
  return (
    <div className="border-b-2 border-slate-900 pb-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Logo */}
        <div className="w-24 h-24 shrink-0 flex items-center justify-center p-1 bg-slate-50 rounded-xl border border-slate-200">
          <img
            src={settings.logoUrl}
            alt={settings.madrasaName}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Center: Official Madrasa Name and Headers */}
        <div className="text-center flex-1">
          <div className="text-xs font-bold text-amber-700 tracking-wider mb-1 font-arabic">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <h1 className="text-2xl font-extrabold text-blue-950 font-nastaliq leading-relaxed">
            مدرسہ عربیہ مدینۃ العلوم
          </h1>
          <h2 className="text-sm font-bold text-slate-700 tracking-wide uppercase font-sans">
            {settings.madrasaName}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {settings.address} • رابطہ: {settings.phone} {settings.whatsapp ? `/ ${settings.whatsapp}` : ''}
          </p>
        </div>

        {/* Right Side: Document Badge & Academic Year */}
        <div className="text-left shrink-0">
          <div className="inline-block bg-blue-950 text-white font-bold px-4 py-1.5 rounded-lg text-sm mb-1 text-center shadow-xs">
            {documentTitle}
          </div>
          {subTitle && (
            <div className="text-xs text-slate-700 font-semibold text-center">{subTitle}</div>
          )}
          <div className="text-[11px] text-slate-500 text-center mt-1">
            تعلیمی سال: {settings.academicYear}
          </div>
        </div>
      </div>

      {/* Meta Info Strip (optional) */}
      {metaInfo && metaInfo.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs bg-slate-50 p-2.5 rounded-lg">
          {metaInfo.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">{item.label}:</span>
              <span className="text-slate-900 font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
