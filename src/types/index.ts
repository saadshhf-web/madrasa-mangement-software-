export type UserRole = 'admin' | 'teacher' | 'viewer';

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  displayName: string;
}

// عصری تعلیم کی معلومات
export interface ModernEducationInfo {
  status: 'زیرِ تعلیم' | 'مکمل' | 'نہیں پڑھ رہا' | '';
  level: string; // نرسری، کے جی، جماعت اول تا دہم، ایف اے، وغیرہ
  institutionName: string; // اسکول / کالج / ادارے کا نام
  boardOrUniversity: string; // بورڈ / یونیورسٹی
  rollNumber: string; // رول نمبر
  academicYear: string; // تعلیمی سال
  lastCompletedClass: string; // آخری حاصل کردہ کلاس
  lastExamResult: string; // آخری امتحان کا نتیجہ / فیصد
  subjects: string; // مضامین
  extraInfo: string; // اضافی تعلیمی معلومات
  city: string; // شہر
  certificateDoc?: string; // تعلیمی سند یا سرٹیفکیٹ کی تصویر (Base64)
}

// حفظ القرآن کی مخصوص معلومات
export interface HifzInfo {
  startDate: string; // حفظ شروع کرنے کی تاریخ
  currentPara: number; // موجودہ پارہ (1-30)
  completedParas: number; // مکمل شدہ پارے
  manzil: string; // منزل
  sabaq: string; // سبق
  sabqi: string; // سبقی
  tajweedPerformance: string; // تجوید کارکردگی
  teacherComments: string; // استاد کے تاثرات
}

// تجوید للحفاظ کی معلومات
export interface TajweedInfo {
  currentPara: number;
  completedParas: number;
  tajweedLevel: string;
  sabaq: string;
  sabqi: string;
  manzil: string;
  tajweedMistakes: string;
  teacherComments: string;
  monthlyAssessment: 'ممتاز' | 'بہت اچھا' | 'اچھا' | 'تسلی بخش' | 'مزید محنت درکار' | '';
  annualAssessment: 'ممتاز' | 'بہت اچھا' | 'اچھا' | 'تسلی بخش' | 'مزید محنت درکار' | '';
}

// طالب علم کا ریکارڈ
export interface Student {
  id: string; // یونیک ID مثلاً STU-1001
  studentId: string; // طالب علم ID
  admissionNo: string; // داخلہ نمبر
  rollNo: string; // رول نمبر
  name: string; // طالب علم کا نام
  fatherName: string; // والد کا نام
  dob: string; // تاریخ پیدائش
  cnicOrBForm: string; // CNIC / B-Form
  mobile: string; // موبائل نمبر
  whatsapp: string; // WhatsApp نمبر
  alternatePhone?: string; // متبادل نمبر
  address: string; // مکمل پتہ
  village: string; // گاؤں
  district: string; // ضلع
  province: string; // صوبہ
  guardianName: string; // سرپرست کا نام
  guardianRelation: string; // سرپرست سے رشتہ
  guardianPhone: string; // سرپرست کا فون
  guardianAddress?: string; // سرپرست کا پتہ
  guardianOccupation?: string; // سرپرست کا پیشہ
  photo?: string; // تصویر Base64
  admissionDate: string; // داخلہ تاریخ
  branch: 'حفظ القرآن' | 'تجوید للحفاظ' | 'درس نظامی' | 'دیگر'; // شعبہ
  darja: string; // درجہ / کلاس
  section: string; // سیکشن
  academicYear: string; // تعلیمی سال
  status: 'فعال' | 'فارغ التحصیل' | 'خارج شدہ' | 'رخصت پر'; // حیثیت
  
  // خصوصی تعلیمی شعبے
  hifzInfo?: HifzInfo;
  tajweedInfo?: TajweedInfo;
  modernEducation: ModernEducationInfo; // عصری تعلیم

  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// استاد کا ریکارڈ (بنیادی ڈیٹا میں CNIC شامل)
export interface Teacher {
  id: string;
  teacherId: string; // استاد ID
  name: string; // نام
  fatherName: string; // والد کا نام
  cnic: string; // شناختی کارڈ نمبر (13 ہندسے: 17301-1234567-1)
  mobile: string; // موبائل نمبر
  whatsapp: string; // WhatsApp نمبر
  dob: string; // تاریخ پیدائش
  address: string; // پتہ
  qualification: string; // تعلیمی قابلیت
  designation: string; // عہدہ
  joiningDate: string; // تاریخ شمولیت
  branch: string; // شعبہ
  assignedClass: string; // مختص کلاس
  salaryType: 'ماہانہ' | 'گھنٹہ وار' | 'روزانہ'; // تنخواہ کی قسم
  basicSalary: number; // بنیادی تنخواہ
  bankInfo: string; // بینک اکاؤنٹ کی معلومات
  easypaisa?: string; // ایزی پیسہ نمبر
  jazzcash?: string; // جاز کیش نمبر
  status: 'فعال' | 'رخصت پر' | 'سابقہ'; // حیثیت
  notes?: string; // نوٹس
  photo?: string; // تصویر Base64
  createdAt: string;
  updatedAt: string;
}

// حاضری کی قسم
export type AttendanceStatus = 'حاضر' | 'غیر حاضر' | 'رخصت' | 'تاخیر سے حاضر';

// طالب علم کی حاضری کا ریکارڈ
export interface AttendanceRecord {
  id: string;
  studentId: string; // طالب علم کا ID
  date: string; // YYYY-MM-DD
  branch: string;
  darja: string;
  section: string;
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
}

// فیس کا ریکارڈ
export interface FeeRecord {
  id: string;
  receiptNo: string; // رسید نمبر
  studentId: string;
  month: string; // مثلاً رجب / فروری 2026
  feeType: 'ماہانہ فیس' | 'داخلہ فیس' | 'امتحانی فیس' | 'ہاسٹل فیس' | 'دیگر فیس';
  totalAmount: number; // کل رقم
  paidAmount: number; // وصول شدہ
  remainingAmount: number; // بقایا
  paymentDate: string; // تاریخ
  paymentMethod: 'نقد' | 'بینک' | 'Easypaisa' | 'JazzCash' | 'دیگر';
  status: 'ادا شدہ' | 'جزوی' | 'بقایا';
  notes?: string;
  createdAt: string;
}

// مالیاتی ٹرانزیکشن (آمدن و اخراجات)
export interface FinanceTransaction {
  id: string;
  receiptNo: string;
  type: 'income' | 'expense'; // آمدن یا خرچ
  category: string; // کیٹیگری (عطیہ، زکوٰۃ، راشن، بجلی، وغیرہ)
  amount: number;
  date: string;
  payerOrPayee: string; // ادا کنندہ یا وصول کنندہ
  paymentMethod: 'نقد' | 'بینک' | 'Easypaisa' | 'JazzCash' | 'دیگر';
  description: string;
  createdAt: string;
}

// استاد کی تنخواہ کا ریکارڈ
export interface SalaryPayment {
  id: string;
  receiptNo: string;
  teacherId: string;
  month: string;
  year: string;
  basicSalary: number; // بنیادی تنخواہ
  allowance: number; // الاؤنس
  extraAmount: number; // اضافی رقم
  deduction: number; // عمومی کٹوتی
  absenceDeduction: number; // غیر حاضری کٹوتی
  advance: number; // ایڈوانس
  otherDeduction: number; // دیگر کٹوتی
  netSalary: number; // خالص تنخواہ
  paidAmount: number; // ادا شدہ رقم
  remainingAmount: number; // بقایا
  paymentDate: string;
  paymentMethod: 'نقد' | 'بینک' | 'Easypaisa' | 'JazzCash' | 'دیگر';
  notes?: string;
  createdAt: string;
}

// مضامین
export interface Subject {
  id: string;
  name: string;
  branch: string;
  darja: string;
  totalMarks: number;
  passMarks: number;
}

// امتحان
export interface Exam {
  id: string;
  name: string; // امتحان نام (مثلاً سالانہ امتحان 1447ھ)
  type: 'ماہانہ امتحان' | 'ششماہی امتحان' | 'سالانہ امتحان' | 'دیگر';
  academicYear: string;
  branch: string;
  darja: string;
  startDate: string;
  endDate?: string;
}

// امتحانی نمبرات
export interface ExamMark {
  id: string;
  examId: string;
  studentId: string;
  subjectId: string;
  totalMarks: number;
  obtainedMarks: number;
  remarks?: string;
}

// سسٹم سیٹنگز
export interface MadrasaSettings {
  madrasaName: string;
  arabicName: string;
  tagline: string;
  logoUrl: string; // Persistent Logo
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
  principalName: string;
  educationDirectorName: string;
  academicYear: string;
  
  // WhatsApp پیغام ٹیمپلیٹس
  whatsappTemplates: {
    absence: string;
    feeReminder: string;
    feeReceipt: string;
    general: string;
  };
}

export interface BackupData {
  version: string;
  exportedAt: string;
  madrasaName: string;
  settings: MadrasaSettings;
  students: Student[];
  teachers: Teacher[];
  attendance: AttendanceRecord[];
  fees: FeeRecord[];
  finances: FinanceTransaction[];
  salaries: SalaryPayment[];
  subjects: Subject[];
  exams: Exam[];
  marks: ExamMark[];
}
