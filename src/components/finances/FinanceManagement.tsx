import React, { useState, useMemo } from 'react';
import { FinanceTransaction, MadrasaSettings } from '../../types';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { PrintModal } from '../common/PrintModal';
import { PrintHeader } from '../common/PrintHeader';
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Plus,
  Search,
  RotateCcw,
  Printer,
  Trash2,
  Filter,
  DollarSign,
  X,
  Save,
} from 'lucide-react';

interface FinanceManagementProps {
  finances: FinanceTransaction[];
  settings: MadrasaSettings;
  onSaveFinance: (item: FinanceTransaction) => { success: boolean; error?: string };
  onDeleteFinance: (id: string) => { success: boolean; error?: string };
}

export const INCOME_CATEGORIES = ['فیس', 'عطیہ', 'زکوٰۃ', 'صدقہ', 'تعاون', 'دیگر'];

export const EXPENSE_CATEGORIES = [
  'راشن',
  'بجلی',
  'گیس',
  'پانی',
  'تنخواہیں',
  'کتابیں',
  'تعمیرات',
  'مرمت',
  'طلبہ اخراجات',
  'ہاسٹل',
  'دیگر',
];

export const FinanceManagement: React.FC<FinanceManagementProps> = ({
  finances,
  settings,
  onSaveFinance,
  onDeleteFinance,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<FinanceTransaction | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form state
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('عطیہ');
  const [amount, setAmount] = useState<number>(5000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [payerOrPayee, setPayerOrPayee] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'نقد' | 'بینک' | 'Easypaisa' | 'JazzCash' | 'دیگر'>('نقد');
  const [receiptNo, setReceiptNo] = useState('');
  const [description, setDescription] = useState('');

  const handleOpenAdd = (defaultType: 'income' | 'expense') => {
    setType(defaultType);
    setCategory(defaultType === 'income' ? 'عطیہ' : 'راشن');
    setReceiptNo(`FIN-${Date.now().toString().slice(-6)}`);
    setAmount(1000);
    setPayerOrPayee('');
    setDescription('');
    setIsAddModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('رقم صفر سے زیادہ ہونی چاہیے۔');
      return;
    }

    const tx: FinanceTransaction = {
      id: `FIN-${Date.now()}`,
      receiptNo: receiptNo.trim() || `FIN-${Date.now().toString().slice(-5)}`,
      type,
      category,
      amount: Number(amount),
      date,
      payerOrPayee: payerOrPayee.trim() || (type === 'income' ? 'محسنِ جامعہ' : 'دکان / ادارہ'),
      paymentMethod,
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };

    const res = onSaveFinance(tx);
    if (res.success) {
      setIsAddModalOpen(false);
    } else {
      alert(res.error || 'ٹرانزیکشن محفوظ نہیں ہو سکی۔');
    }
  };

  const handleRequestDelete = (item: FinanceTransaction) => {
    setTxToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (txToDelete) {
      const res = onDeleteFinance(txToDelete.id);
      if (!res.success) {
        alert(res.error || 'ٹرانزیکشن حذف نہیں ہو سکی۔');
      }
      setIsDeleteModalOpen(false);
      setTxToDelete(null);
    }
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return finances.filter((item) => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.receiptNo.toLowerCase().includes(q) ||
        item.payerOrPayee.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchesType && matchesCategory && matchesSearch;
    });
  }, [finances, typeFilter, categoryFilter, searchTerm]);

  // Totals
  const totalIncome = finances
    .filter((f) => f.type === 'income')
    .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

  const totalExpense = finances
    .filter((f) => f.type === 'expense')
    .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

  const currentBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 font-nastaliq leading-relaxed">
            آمدن و اخراجات (Madrasa Finances)
          </h1>
          <p className="text-xs text-slate-500">
            جامعہ کی تمام مالیاتی آمدن، فیسیں، عطیات، اخراجات اور روزنامچہ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleOpenAdd('income')}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <TrendingUp className="w-4 h-4" />
            نئی آمدن (Add Income)
          </button>

          <button
            type="button"
            onClick={() => handleOpenAdd('expense')}
            className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <TrendingDown className="w-4 h-4" />
            نیا خرچ (Add Expense)
          </button>

          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            مالی رپورٹ پرنٹ
          </button>
        </div>
      </div>

      {/* Top 3 Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-emerald-700 text-xs font-bold block">کل آمدن (Total Income)</span>
            <span className="text-2xl font-black text-emerald-800 mt-1 block font-sans">
              {totalIncome.toLocaleString()} روپے
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-rose-700 text-xs font-bold block">کل اخراجات (Total Expenses)</span>
            <span className="text-2xl font-black text-rose-700 mt-1 block font-sans">
              {totalExpense.toLocaleString()} روپے
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-blue-900 text-xs font-bold block">موجودہ بیلنس (Current Balance)</span>
            <span
              className={`text-2xl font-black mt-1 block font-sans ${
                currentBalance >= 0 ? 'text-blue-950' : 'text-rose-600'
              }`}
            >
              {currentBalance.toLocaleString()} روپے
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-950 border-b border-slate-100 pb-2">
          <Filter className="w-4 h-4 text-amber-600" />
          تلاش و فلٹرز (Search Transactions)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">
              تلاش (رسید نمبر، ادا کنندہ/وصول کنندہ، تفصیل):
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="تلاش کریں..."
                className="w-full border border-slate-300 rounded-xl px-3 py-2 pr-9 text-slate-900 focus:ring-2 focus:ring-blue-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">قسم ٹرانزیکشن:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white"
            >
              <option value="all">تمام (آمدن و اخراجات)</option>
              <option value="income">صرف آمدن (Income)</option>
              <option value="expense">صرف اخراجات (Expense)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">کیٹیگری:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 bg-white"
            >
              <option value="">تمام کیٹیگریز</option>
              {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].map((cat, i) => (
                <option key={`${cat}-${i}`} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            کل ٹرانزیکشنز: <strong className="text-blue-950">{filteredList.length}</strong>
          </span>

          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
              setCategoryFilter('');
            }}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            صاف کریں
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-3 px-4">رسید نمبر</th>
                <th className="py-3 px-3 text-center">نوعیت</th>
                <th className="py-3 px-3">کیٹیگری</th>
                <th className="py-3 px-4">ادا کنندہ / وصول کنندہ</th>
                <th className="py-3 px-4">تفصیل</th>
                <th className="py-3 px-3 text-center">طریقہ</th>
                <th className="py-3 px-3 text-center">تاریخ</th>
                <th className="py-3 px-4 text-center">رقم (روپے)</th>
                <th className="py-3 px-3 text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Scale className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-sm">کوئی مالی ٹرانزیکشن موجود نہیں ہے۔</p>
                    <p className="text-xs text-slate-400 mt-1">
                      آمدن یا خرچ کا اندراج کرنے کے لیے اوپر دیے گئے بٹنوں کا استعمال کریں۔
                    </p>
                  </td>
                </tr>
              ) : (
                filteredList.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-blue-900">{tx.receiptNo}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.type === 'income'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tx.type === 'income' ? 'آمدن' : 'خرچ'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{tx.category}</td>
                    <td className="py-2.5 px-4 font-medium text-slate-900">{tx.payerOrPayee}</td>
                    <td className="py-2.5 px-4 text-slate-600 truncate max-w-[200px]">
                      {tx.description || '---'}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{tx.paymentMethod}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{tx.date}</td>
                    <td
                      className={`py-2.5 px-4 text-center font-bold text-sm ${
                        tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'} {tx.amount.toLocaleString()} روپے
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRequestDelete(tx)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors cursor-pointer"
                        title="حذف کریں"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div
              className={`px-6 py-4 flex items-center justify-between text-white ${
                type === 'income' ? 'bg-emerald-900' : 'bg-rose-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  {type === 'income' ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {type === 'income' ? 'آمدن کا اندراج (Record Income)' : 'خرچ کا اندراج (Record Expense)'}
                  </h3>
                  <p className="text-xs text-slate-200">
                    رسید اور کیٹیگری کا انتخاب کر کے محفوظ کریں
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="p-6 space-y-4 text-xs text-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوعیت:</label>
                  <select
                    value={type}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      setType(t);
                      setCategory(t === 'income' ? 'عطیہ' : 'راشن');
                    }}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white font-bold"
                  >
                    <option value="income">آمدن (Income)</option>
                    <option value="expense">خرچ (Expense)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">کیٹیگری:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 bg-white font-bold"
                  >
                    {(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => (
                      <option key={c} value={c}>
                        {c}
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
                  <label className="block font-bold text-slate-700 mb-1">
                    رقم (روپے) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {type === 'income' ? 'ادا کنندہ کا نام' : 'وصول کنندہ / دکان'}
                  </label>
                  <input
                    type="text"
                    value={payerOrPayee}
                    onChange={(e) => setPayerOrPayee(e.target.value)}
                    placeholder={type === 'income' ? 'مثلاً حاجی محمد رفیق' : 'مثلاً المدینہ جنرل سٹور'}
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
                  <label className="block font-bold text-slate-700 mb-1">تاریخ</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">تفصیل / ریمارکس</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="تفصیل لکھیں..."
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-xl text-white font-bold flex items-center gap-1.5 shadow-md ${
                    type === 'income' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-700 hover:bg-rose-800'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="مالی ٹرانزیکشن حذف کریں"
        message="کیا آپ واقعی اس ٹرانزیکشن کو حذف کرنا چاہتے ہیں؟"
        itemName={
          txToDelete
            ? `${txToDelete.receiptNo} (${txToDelete.category} - ${txToDelete.amount.toLocaleString()} روپے)`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTxToDelete(null);
        }}
      />

      {/* Print Financial Statement Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="مالی گوشوارہ پرنٹ (Financial Statement)"
        orientation="landscape"
      >
        <div className="p-4 bg-white text-slate-900 border border-slate-400 rounded-xl">
          <PrintHeader
            settings={settings}
            documentTitle="آمدن و اخراجات مالیاتی گوشوارہ (FINANCIAL STATEMENT)"
            subTitle={`تعلیمی سال: ${settings.academicYear} • تاریخ پرنٹ: ${new Date().toLocaleDateString('ur-PK')}`}
            metaInfo={[
              { label: 'کل آمدن', value: `${totalIncome.toLocaleString()} روپے` },
              { label: 'کل اخراجات', value: `${totalExpense.toLocaleString()} روپے` },
              { label: 'موجودہ بیلنس', value: `${currentBalance.toLocaleString()} روپے` },
            ]}
          />

          <table className="w-full text-xs text-right border-collapse border border-slate-300 mt-4">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-2 px-2 text-center w-10">شمار</th>
                <th className="py-2 px-2 text-center w-20">رسید #</th>
                <th className="py-2 px-2 text-center">نوعیت</th>
                <th className="py-2 px-3">کیٹیگری</th>
                <th className="py-2 px-3">شخص / ادارہ</th>
                <th className="py-2 px-4">تفصیل</th>
                <th className="py-2 px-3 text-center">طریقہ</th>
                <th className="py-2 px-3 text-center">تاریخ</th>
                <th className="py-2 px-3 text-center">رقم (روپے)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.map((tx, idx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="py-2 px-2 text-center font-semibold">{idx + 1}</td>
                  <td className="py-2 px-2 text-center font-mono font-bold text-blue-900">{tx.receiptNo}</td>
                  <td className="py-2 px-2 text-center font-bold">
                    {tx.type === 'income' ? 'آمدن' : 'خرچ'}
                  </td>
                  <td className="py-2 px-3 font-bold text-slate-900">{tx.category}</td>
                  <td className="py-2 px-3 text-slate-700">{tx.payerOrPayee}</td>
                  <td className="py-2 px-4 text-slate-600 truncate max-w-[200px]">{tx.description || '---'}</td>
                  <td className="py-2 px-3 text-center text-slate-600">{tx.paymentMethod}</td>
                  <td className="py-2 px-3 text-center text-slate-600">{tx.date}</td>
                  <td
                    className={`py-2 px-3 text-center font-bold ${
                      tx.type === 'income' ? 'text-emerald-900' : 'text-rose-900'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} {tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                <td colSpan={7} className="py-2 px-3 text-left">مجموعی بیلنس (آمدن منہا اخراجات):</td>
                <td colSpan={2} className="py-2 px-3 text-center text-base font-black text-blue-950">
                  {currentBalance.toLocaleString()} روپے
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-between items-end mt-12 pt-4 border-t border-slate-300 text-xs">
            <div className="text-center">
              <div className="w-32 border-b border-dotted border-slate-700 mb-1"></div>
              <span>دستخط خزانچی / محاسب</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-dotted border-slate-700 mb-1"></div>
              <span>دستخط و مہر مہتمم مدرسہ</span>
            </div>
          </div>
        </div>
      </PrintModal>
    </div>
  );
};
