import {
  Student,
  Teacher,
  AttendanceRecord,
  FeeRecord,
  FinanceTransaction,
  SalaryPayment,
  Subject,
  Exam,
  ExamMark,
  MadrasaSettings,
  BackupData,
  AuthUser,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'madrasa_settings_v2',
  STUDENTS: 'madrasa_students_v2',
  TEACHERS: 'madrasa_teachers_v2',
  ATTENDANCE: 'madrasa_attendance_v2',
  FEES: 'madrasa_fees_v2',
  FINANCES: 'madrasa_finances_v2',
  SALARIES: 'madrasa_salaries_v2',
  SUBJECTS: 'madrasa_subjects_v2',
  EXAMS: 'madrasa_exams_v2',
  MARKS: 'madrasa_marks_v2',
  AUTH_USER: 'madrasa_auth_user_v2',
  REMEMBER_USER: 'madrasa_remember_user_v2',
};

// Default high-resolution SVG Islamic Crest logo
export const DEFAULT_MADRASA_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23d4af37"/>
      <stop offset="50%" stop-color="%23f7e07a"/>
      <stop offset="100%" stop-color="%23aa820a"/>
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%230f2b5c"/>
      <stop offset="100%" stop-color="%231e40af"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="94" fill="url(%23blueGrad)" stroke="url(%23goldGrad)" stroke-width="4"/>
  <circle cx="100" cy="100" r="86" fill="none" stroke="url(%23goldGrad)" stroke-width="1.5" stroke-dasharray="3,3"/>
  <!-- Crescent & Star -->
  <path d="M100 35 A 15 15 0 0 0 115 50 A 12 12 0 1 1 100 35 Z" fill="url(%23goldGrad)"/>
  <!-- Dome -->
  <path d="M70 115 C70 85, 100 70, 100 70 C100 70, 130 85, 130 115 Z" fill="%23ffffff" opacity="0.95"/>
  <path d="M100 60 L100 70" stroke="url(%23goldGrad)" stroke-width="3" stroke-linecap="round"/>
  <!-- Open Quran Book -->
  <path d="M55 142 C75 130, 95 133, 98 147 C101 133, 125 130, 145 142 L145 152 C125 140, 101 143, 98 157 C95 143, 75 140, 55 152 Z" fill="url(%23goldGrad)"/>
  <path d="M98 135 L98 157" stroke="%230f2b5c" stroke-width="2"/>
  <!-- Minarets -->
  <rect x="52" y="92" width="10" height="35" fill="%23ffffff" rx="2" opacity="0.9"/>
  <polygon points="57,75 50,92 64,92" fill="url(%23goldGrad)"/>
  <rect x="138" y="92" width="10" height="35" fill="%23ffffff" rx="2" opacity="0.9"/>
  <polygon points="143,75 136,92 150,92" fill="url(%23goldGrad)"/>
</svg>`;

export const DEFAULT_SETTINGS: MadrasaSettings = {
  madrasaName: 'Madrasa Arabia Madina Tul Uloom',
  arabicName: 'مدرسة عربية مدينة العلوم',
  tagline: 'جامعہ اسلامیہ برائے تعلیم القرآن و علوم الشریعۃ',
  logoUrl: DEFAULT_MADRASA_LOGO,
  phone: '0300-1234567',
  whatsapp: '0300-1234567',
  address: 'مین جی ٹی روڈ، پاکستان',
  email: 'info@madinatululoom.edu.pk',
  principalName: 'حضرت مولانا مفتی محمد عبداللہ صاحب مدظلہ',
  educationDirectorName: 'مولانا قاری محمد اسماعیل صاحب',
  academicYear: '1447-1448ھ / 2026-2027',
  whatsappTemplates: {
    absence: `السلام علیکم!

آپ کو اطلاع دی جاتی ہے کہ آپ کا بچہ:

طالب علم: {StudentName}
والد کا نام: {FatherName}
کلاس: {Class}
تاریخ: {Date}

آج مدرسہ میں غیر حاضر رہا۔

براہ کرم طالب علم کی حاضری کے بارے میں آگاہ رہیں۔

Madrasa Arabia Madina Tul Uloom

شکریہ۔`,

    feeReminder: `السلام علیکم!

Madrasa Arabia Madina Tul Uloom

طالب علم: {StudentName}
والد کا نام: {FatherName}
کلاس: {Class}
مہینہ: {Month}

کل فیس: {TotalFee} روپے
ادا شدہ: {Paid} روپے
باقی رقم: {Remaining} روپے

براہ کرم بقایا فیس بر وقت جمع کرانے کا اہتمام فرمائیں۔

شکریہ۔`,

    feeReceipt: `السلام علیکم!

Madrasa Arabia Madina Tul Uloom
فیس ادائیگی کی رسید

طالب علم: {StudentName}
والد کا نام: {FatherName}
کلاس: {Class}
مہینہ: {Month}
رسید نمبر: {ReceiptNo}
کل فیس: {TotalFee} روپے
ادا شدہ: {Paid} روپے
باقی رقم: {Remaining} روپے
تاریخ: {Date}

آپ کی فیس بحفاظت وصول پا چکی ہے۔ جزاکم اللہ خیراً!`,

    general: `السلام علیکم!

Madrasa Arabia Madina Tul Uloom کی جانب سے آپ سے آپ کے بچے کے متعلق رابطہ کیا جا رہا ہے۔

طالب علم: {StudentName}
والد کا نام: {FatherName}
کلاس: {Class}

شکریہ۔`,
  },
};

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'SUB-01', name: 'حفظ القرآن الکریم', branch: 'حفظ القرآن', darja: 'تمام درجات', totalMarks: 100, passMarks: 50 },
  { id: 'SUB-02', name: 'تجوید و قراءت', branch: 'تجوید للحفاظ', darja: 'تمام درجات', totalMarks: 100, passMarks: 50 },
  { id: 'SUB-03', name: 'ترجمہ و تفسیر قرآن', branch: 'درس نظامی', darja: 'سابعہ', totalMarks: 100, passMarks: 50 },
  { id: 'SUB-04', name: 'حدیث شریف (مشکوٰۃ / صحاح ستہ)', branch: 'درس نظامی', darja: 'ثامنہ', totalMarks: 100, passMarks: 50 },
  { id: 'SUB-05', name: 'فقہ اسلامی (قدوری / ہدایہ)', branch: 'درس نظامی', darja: 'ثالثہ', totalMarks: 100, passMarks: 50 },
  { id: 'SUB-06', name: 'علم النحو و الصرف', branch: 'درس نظامی', darja: 'اولیٰ', totalMarks: 100, passMarks: 50 },
  { id: 'SUB-07', name: 'عربی ادب و بلاغت', branch: 'درس نظامی', darja: 'ثانیہ', totalMarks: 100, passMarks: 50 },
  { id: 'SUB-08', name: 'عقائد و کلام', branch: 'درس نظامی', darja: 'رابعہ', totalMarks: 100, passMarks: 50 },
  { id: 'SUB-09', name: 'اردو زبان و ادب', branch: 'درس نظامی', darja: 'اولیٰ', totalMarks: 100, passMarks: 40 },
  { id: 'SUB-10', name: 'انگریزی (عصری تعلیم)', branch: 'درس نظامی', darja: 'اولیٰ', totalMarks: 100, passMarks: 40 },
  { id: 'SUB-11', name: 'ریاضی و حسابیات', branch: 'درس نظامی', darja: 'اولیٰ', totalMarks: 100, passMarks: 40 },
  { id: 'SUB-12', name: 'کمپیوٹر سائنس و ٹیکنالوجی', branch: 'درس نظامی', darja: 'ثانیہ', totalMarks: 100, passMarks: 40 },
];

class StorageService {
  // --- SETTINGS ---
  getSettings(): MadrasaSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error('Error loading settings', e);
    }
    return DEFAULT_SETTINGS;
  }

  saveSettings(settings: MadrasaSettings): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('Error saving settings', e);
      return false;
    }
  }

  saveLogo(logoBase64: string): boolean {
    try {
      const settings = this.getSettings();
      settings.logoUrl = logoBase64;
      return this.saveSettings(settings);
    } catch (e) {
      console.error('Error saving logo', e);
      return false;
    }
  }

  deleteLogo(): boolean {
    try {
      const settings = this.getSettings();
      settings.logoUrl = DEFAULT_MADRASA_LOGO;
      return this.saveSettings(settings);
    } catch (e) {
      console.error('Error deleting logo', e);
      return false;
    }
  }

  // --- AUTHENTICATION ---
  getCurrentUser(): AuthUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: AuthUser | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }

  getRememberedUser(): { username: string; role: string } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMEMBER_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  setRememberedUser(info: { username: string; role: string } | null): void {
    if (info) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_USER, JSON.stringify(info));
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_USER);
    }
  }

  // --- STUDENTS ---
  getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading students', e);
      return [];
    }
  }

  saveStudent(student: Student): { success: boolean; error?: string } {
    try {
      const list = this.getStudents();
      // Check duplicate ID or Admission No
      if (list.some((s) => s.id === student.id || s.studentId === student.studentId)) {
        return { success: false, error: 'اس ID کا طالب علم پہلے سے موجود ہے!' };
      }
      if (student.admissionNo && list.some((s) => s.admissionNo === student.admissionNo)) {
        return { success: false, error: 'یہ داخلہ نمبر پہلے سے موجود ہے!' };
      }
      list.unshift(student);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));
      return { success: true };
    } catch (e) {
      console.error('Error saving student', e);
      return { success: false, error: 'طالب علم محفوظ نہیں ہو سکا۔ دوبارہ کوشش کریں۔' };
    }
  }

  updateStudent(student: Student): { success: boolean; error?: string } {
    try {
      const list = this.getStudents();
      const index = list.findIndex((s) => s.id === student.id);
      if (index === -1) {
        return { success: false, error: 'طالب علم کا ریکارڈ نہیں ملا!' };
      }
      list[index] = { ...student, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));
      return { success: true };
    } catch (e) {
      console.error('Error updating student', e);
      return { success: false, error: 'طالب علم کی معلومات اپ ڈیٹ نہیں ہو سکیں۔' };
    }
  }

  deleteStudent(id: string): { success: boolean; error?: string } {
    try {
      const list = this.getStudents();
      const filtered = list.filter((s) => s.id !== id);
      if (filtered.length === list.length) {
        return { success: false, error: 'ریکارڈ حذف نہیں ہو سکا۔' };
      }
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));

      // Also clean associated marks, attendance, and fees for this student ID
      this.cleanupStudentCascade(id);
      return { success: true };
    } catch (e) {
      console.error('Error deleting student', e);
      return { success: false, error: 'ریکارڈ حذف نہیں ہو سکا۔' };
    }
  }

  private cleanupStudentCascade(studentId: string): void {
    try {
      // Remove attendance
      const att = this.getAttendance().filter((a) => a.studentId !== studentId);
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(att));
      // Remove fees
      const fees = this.getFees().filter((f) => f.studentId !== studentId);
      localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(fees));
      // Remove marks
      const marks = this.getMarks().filter((m) => m.studentId !== studentId);
      localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(marks));
    } catch (e) {
      console.error('Cascade error', e);
    }
  }

  // --- TEACHERS ---
  getTeachers(): Teacher[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error getting teachers', e);
      return [];
    }
  }

  saveTeacher(teacher: Teacher): { success: boolean; error?: string } {
    try {
      const list = this.getTeachers();
      if (list.some((t) => t.id === teacher.id || t.teacherId === teacher.teacherId)) {
        return { success: false, error: 'اس ID کے استاد پہلے سے موجود ہیں!' };
      }
      list.unshift(teacher);
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(list));
      return { success: true };
    } catch (e) {
      console.error('Error saving teacher', e);
      return { success: false, error: 'ریکارڈ محفوظ نہیں ہو سکا۔ دوبارہ کوشش کریں۔' };
    }
  }

  updateTeacher(teacher: Teacher): { success: boolean; error?: string } {
    try {
      const list = this.getTeachers();
      const index = list.findIndex((t) => t.id === teacher.id);
      if (index === -1) {
        return { success: false, error: 'استاد کا ریکارڈ نہیں ملا!' };
      }
      list[index] = { ...teacher, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(list));
      return { success: true };
    } catch (e) {
      console.error('Error updating teacher', e);
      return { success: false, error: 'ریکارڈ اپ ڈیٹ نہیں ہو سکا۔' };
    }
  }

  deleteTeacher(id: string): { success: boolean; error?: string } {
    try {
      const list = this.getTeachers();
      const filtered = list.filter((t) => t.id !== id);
      if (filtered.length === list.length) {
        return { success: false, error: 'ریکارڈ حذف نہیں ہو سکا۔' };
      }
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(filtered));
      return { success: true };
    } catch (e) {
      console.error('Error deleting teacher', e);
      return { success: false, error: 'ریکارڈ حذف نہیں ہو سکا۔' };
    }
  }

  // --- ATTENDANCE ---
  getAttendance(): AttendanceRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveAttendanceBatch(records: AttendanceRecord[]): { success: boolean; error?: string } {
    try {
      const existing = this.getAttendance();
      // Replace or update attendance for same studentId and date
      const updatedMap = new Map<string, AttendanceRecord>();
      existing.forEach((r) => updatedMap.set(`${r.studentId}_${r.date}`, r));
      records.forEach((r) => updatedMap.set(`${r.studentId}_${r.date}`, r));

      const finalRecords = Array.from(updatedMap.values());
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(finalRecords));
      return { success: true };
    } catch (e) {
      console.error('Error saving attendance', e);
      return { success: false, error: 'حاضری محفوظ نہیں ہو سکی۔' };
    }
  }

  deleteAttendance(id: string): { success: boolean; error?: string } {
    try {
      const list = this.getAttendance();
      const filtered = list.filter((a) => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(filtered));
      return { success: true };
    } catch {
      return { success: false, error: 'ریکارڈ حذف نہیں ہو سکا۔' };
    }
  }

  // --- FEES ---
  getFees(): FeeRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveFee(fee: FeeRecord): { success: boolean; error?: string } {
    try {
      const list = this.getFees();
      list.unshift(fee);
      localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(list));

      // Also automatically record as income in finances!
      if (fee.paidAmount > 0) {
        this.saveFinance({
          id: `FIN-INC-${Date.now()}`,
          receiptNo: fee.receiptNo,
          type: 'income',
          category: 'فیس',
          amount: fee.paidAmount,
          date: fee.paymentDate,
          payerOrPayee: `طالب علم ID: ${fee.studentId}`,
          paymentMethod: fee.paymentMethod,
          description: `ماہانہ فیس وصولی (${fee.month}) - رسید: ${fee.receiptNo}`,
          createdAt: new Date().toISOString(),
        });
      }

      return { success: true };
    } catch (e) {
      console.error('Error saving fee', e);
      return { success: false, error: 'فیس کا ریکارڈ محفوظ نہیں ہو سکا۔' };
    }
  }

  deleteFee(id: string): { success: boolean; error?: string } {
    try {
      const list = this.getFees();
      const filtered = list.filter((f) => f.id !== id);
      localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(filtered));
      return { success: true };
    } catch {
      return { success: false, error: 'فیس کا ریکارڈ حذف نہیں ہو سکا۔' };
    }
  }

  // --- FINANCES (آمدن و اخراجات) ---
  getFinances(): FinanceTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FINANCES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveFinance(item: FinanceTransaction): { success: boolean; error?: string } {
    try {
      const list = this.getFinances();
      list.unshift(item);
      localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(list));
      return { success: true };
    } catch (e) {
      console.error('Error saving finance item', e);
      return { success: false, error: 'ٹرانزیکشن محفوظ نہیں ہو سکی۔' };
    }
  }

  deleteFinance(id: string): { success: boolean; error?: string } {
    try {
      const list = this.getFinances();
      const filtered = list.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(filtered));
      return { success: true };
    } catch {
      return { success: false, error: 'ریکارڈ حذف نہیں ہو سکا۔' };
    }
  }

  // --- SALARIES (اساتذہ کی تنخواہیں) ---
  getSalaries(): SalaryPayment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SALARIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveSalary(salary: SalaryPayment): { success: boolean; error?: string } {
    try {
      const list = this.getSalaries();
      list.unshift(salary);
      localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(list));

      // Record as expense in finances automatically
      if (salary.paidAmount > 0) {
        this.saveFinance({
          id: `FIN-EXP-${Date.now()}`,
          receiptNo: salary.receiptNo,
          type: 'expense',
          category: 'تنخواہیں',
          amount: salary.paidAmount,
          date: salary.paymentDate,
          payerOrPayee: `استاد ID: ${salary.teacherId}`,
          paymentMethod: salary.paymentMethod,
          description: `تنخواہ ادائیگی برائے ${salary.month} ${salary.year} - رسید نمبر: ${salary.receiptNo}`,
          createdAt: new Date().toISOString(),
        });
      }

      return { success: true };
    } catch (e) {
      console.error('Error saving salary', e);
      return { success: false, error: 'تنخواہ کا ریکارڈ محفوظ نہیں ہو سکا۔' };
    }
  }

  deleteSalary(id: string): { success: boolean; error?: string } {
    try {
      const list = this.getSalaries();
      const filtered = list.filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(filtered));
      return { success: true };
    } catch {
      return { success: false, error: 'تنخواہ کا ریکارڈ حذف نہیں ہو سکا۔' };
    }
  }

  // --- SUBJECTS ---
  getSubjects(): Subject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (data) return JSON.parse(data);
      // Pre-seed default subjects list if empty
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
      return INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  }

  saveSubject(subject: Subject): { success: boolean; error?: string } {
    try {
      const list = this.getSubjects();
      list.push(subject);
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(list));
      return { success: true };
    } catch {
      return { success: false, error: 'مضمون محفوظ نہیں ہو سکا۔' };
    }
  }

  deleteSubject(id: string): { success: boolean; error?: string } {
    try {
      const list = this.getSubjects();
      const filtered = list.filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(filtered));
      return { success: true };
    } catch {
      return { success: false, error: 'مضمون حذف نہیں ہو سکا۔' };
    }
  }

  // --- EXAMS ---
  getExams(): Exam[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveExam(exam: Exam): { success: boolean; error?: string } {
    try {
      const list = this.getExams();
      list.unshift(exam);
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(list));
      return { success: true };
    } catch {
      return { success: false, error: 'امتحان محفوظ نہیں ہو سکا۔' };
    }
  }

  deleteExam(id: string): { success: boolean; error?: string } {
    try {
      const list = this.getExams();
      const filtered = list.filter((e) => e.id !== id);
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(filtered));

      // Cascade delete marks for this exam
      const marks = this.getMarks().filter((m) => m.examId !== id);
      localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(marks));
      return { success: true };
    } catch {
      return { success: false, error: 'امتحان کا ریکارڈ حذف نہیں ہو سکا۔' };
    }
  }

  // --- MARKS ---
  getMarks(): ExamMark[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveMarksBatch(marks: ExamMark[]): { success: boolean; error?: string } {
    try {
      const existing = this.getMarks();
      const marksMap = new Map<string, ExamMark>();
      existing.forEach((m) => marksMap.set(`${m.examId}_${m.studentId}_${m.subjectId}`, m));
      marks.forEach((m) => marksMap.set(`${m.examId}_${m.studentId}_${m.subjectId}`, m));

      const finalMarks = Array.from(marksMap.values());
      localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(finalMarks));
      return { success: true };
    } catch (e) {
      console.error('Error saving marks', e);
      return { success: false, error: 'نمبرات محفوظ نہیں ہو سکے۔' };
    }
  }

  deleteMark(id: string): { success: boolean; error?: string } {
    try {
      const list = this.getMarks();
      const filtered = list.filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(filtered));
      return { success: true };
    } catch {
      return { success: false, error: 'نمبر حذف نہیں ہو سکے۔' };
    }
  }

  // --- BACKUP & RESTORE ---
  exportBackup(): string {
    const backup: BackupData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      madrasaName: 'Madrasa Arabia Madina Tul Uloom',
      settings: this.getSettings(),
      students: this.getStudents(),
      teachers: this.getTeachers(),
      attendance: this.getAttendance(),
      fees: this.getFees(),
      finances: this.getFinances(),
      salaries: this.getSalaries(),
      subjects: this.getSubjects(),
      exams: this.getExams(),
      marks: this.getMarks(),
    };
    return JSON.stringify(backup, null, 2);
  }

  importBackup(jsonString: string): { success: boolean; error?: string; count?: Record<string, number> } {
    try {
      const parsed: BackupData = JSON.parse(jsonString);

      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'غلط بیک اپ فائل: فارمیٹ درست نہیں ہے!' };
      }

      if (parsed.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
      }
      if (Array.isArray(parsed.students)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(parsed.students));
      }
      if (Array.isArray(parsed.teachers)) {
        localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(parsed.teachers));
      }
      if (Array.isArray(parsed.attendance)) {
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(parsed.attendance));
      }
      if (Array.isArray(parsed.fees)) {
        localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(parsed.fees));
      }
      if (Array.isArray(parsed.finances)) {
        localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(parsed.finances));
      }
      if (Array.isArray(parsed.salaries)) {
        localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(parsed.salaries));
      }
      if (Array.isArray(parsed.subjects)) {
        localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(parsed.subjects));
      }
      if (Array.isArray(parsed.exams)) {
        localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(parsed.exams));
      }
      if (Array.isArray(parsed.marks)) {
        localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(parsed.marks));
      }

      return {
        success: true,
        count: {
          students: parsed.students?.length || 0,
          teachers: parsed.teachers?.length || 0,
          attendance: parsed.attendance?.length || 0,
          fees: parsed.fees?.length || 0,
          finances: parsed.finances?.length || 0,
          salaries: parsed.salaries?.length || 0,
          exams: parsed.exams?.length || 0,
          marks: parsed.marks?.length || 0,
        },
      };
    } catch (e) {
      console.error('Import error', e);
      return { success: false, error: 'بیک اپ فائل کھولنے میں خرابی پیش آئی۔ براہ کرم درست JSON فائل کا انتخاب کریں۔' };
    }
  }

  // --- MASTER CLEANUP (Keep structure, empty all user records) ---
  clearAllRecords(): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify([]));
      return true;
    } catch (e) {
      console.error('Error clearing data', e);
      return false;
    }
  }
}

export const storage = new StorageService();
