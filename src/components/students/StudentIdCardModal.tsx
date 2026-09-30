import React from 'react';
import { Student, MadrasaSettings } from '../../types';
import { PrintModal } from '../common/PrintModal';
import { User, Phone, MapPin, Award } from 'lucide-react';

interface StudentIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  settings: MadrasaSettings;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  isOpen,
  onClose,
  student,
  settings,
}) => {
  if (!student) return null;

  return (
    <PrintModal
      isOpen={isOpen}
      onClose={onClose}
      title={`طالب علم شناختی کارڈ (ID Card) - ${student.name}`}
      orientation="portrait"
    >
      <div className="flex flex-col items-center justify-center p-4">
        {/* Printable Card Container */}
        <div className="w-[340px] sm:w-[380px] bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 text-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-400/80 p-1 relative">
          {/* Islamic Decorative Border Accent */}
          <div className="border border-amber-300/40 rounded-xl p-4 bg-slate-950/40 backdrop-blur-xs flex flex-col items-center">
            {/* Top Madrasa Header */}
            <div className="flex items-center gap-3 w-full border-b border-amber-400/30 pb-3 mb-3">
              <img
                src={settings.logoUrl}
                alt={settings.madrasaName}
                className="w-12 h-12 object-contain bg-white/10 rounded-full p-1 border border-amber-300/50"
              />
              <div className="text-right flex-1">
                <h3 className="text-sm font-bold text-amber-300 font-nastaliq leading-relaxed">
                  مدرسہ عربیہ مدینۃ العلوم
                </h3>
                <p className="text-[10px] text-slate-300 font-sans tracking-wide">
                  {settings.madrasaName}
                </p>
                <div className="text-[9px] text-amber-200/80">طالب علم شناختی کارڈ (Student ID)</div>
              </div>
            </div>

            {/* Student Photo and Core Details */}
            <div className="flex gap-4 w-full items-center my-2">
              <div className="w-24 h-28 rounded-xl bg-slate-800 border-2 border-amber-400/80 overflow-hidden shadow-inner flex items-center justify-center shrink-0">
                {student.photo ? (
                  <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-500" />
                )}
              </div>

              <div className="flex-1 space-y-1 text-right text-xs">
                <div>
                  <span className="text-amber-300 font-medium text-[11px]">نام: </span>
                  <span className="text-white font-bold text-sm">{student.name}</span>
                </div>
                <div>
                  <span className="text-amber-300 font-medium text-[11px]">ولدیت: </span>
                  <span className="text-slate-200 font-semibold">{student.fatherName}</span>
                </div>
                <div>
                  <span className="text-amber-300 font-medium text-[11px]">رول نمبر: </span>
                  <span className="text-amber-200 font-bold bg-amber-500/20 px-2 py-0.5 rounded text-[11px] inline-block">
                    {student.rollNo}
                  </span>
                </div>
                <div>
                  <span className="text-amber-300 font-medium text-[11px]">داخلہ نمبر: </span>
                  <span className="text-slate-300 font-medium">{student.admissionNo}</span>
                </div>
                <div>
                  <span className="text-amber-300 font-medium text-[11px]">طالب علم ID: </span>
                  <span className="text-slate-300 text-[10px]">{student.studentId}</span>
                </div>
              </div>
            </div>

            {/* Academic Info Grid */}
            <div className="w-full bg-blue-950/80 border border-amber-400/20 rounded-lg p-2.5 my-2 grid grid-cols-2 gap-2 text-[11px] text-right">
              <div>
                <span className="text-slate-400">شعبہ: </span>
                <span className="text-white font-bold">{student.branch}</span>
              </div>
              <div>
                <span className="text-slate-400">درجہ: </span>
                <span className="text-white font-bold">{student.darja || '---'}</span>
              </div>
              <div>
                <span className="text-slate-400">سیکشن: </span>
                <span className="text-white">{student.section || 'الف'}</span>
              </div>
              <div>
                <span className="text-slate-400">تعلیمی سال: </span>
                <span className="text-amber-300 font-bold">{student.academicYear}</span>
              </div>
            </div>

            {/* Emergency Contact & Address */}
            <div className="w-full border-t border-amber-400/20 pt-2 text-[10px] text-slate-300 space-y-1 text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span>{student.guardianPhone || student.mobile || '---'}</span>
                <Phone className="w-3 h-3 text-amber-400" />
                <span className="text-slate-400">:ایمرجنسی رابطہ</span>
              </div>
              {student.address && (
                <div className="flex items-center gap-1.5 justify-end truncate">
                  <span className="truncate">{student.address}</span>
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                </div>
              )}
            </div>

            {/* Signature & Stamp */}
            <div className="w-full flex justify-between items-end mt-4 pt-3 border-t border-slate-700 text-[10px]">
              <div className="text-center">
                <div className="w-20 border-b border-dotted border-slate-400 mb-1"></div>
                <span className="text-slate-400">دستخط ناظم</span>
              </div>
              <div className="w-12 h-12 rounded-full border border-dashed border-amber-400/60 flex items-center justify-center text-[9px] text-amber-300/80">
                مہر مدرسہ
              </div>
              <div className="text-center">
                <div className="w-20 border-b border-dotted border-slate-400 mb-1"></div>
                <span className="text-slate-400">دستخط مہتمم</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-4 no-print text-center">
          کارڈ سائز standard شناختی کارڈ فارمیٹ میں بنایا گیا ہے۔ "پرنٹ کریں" بٹن پر کلک کر کے پرنٹ کریں۔
        </p>
      </div>
    </PrintModal>
  );
};
