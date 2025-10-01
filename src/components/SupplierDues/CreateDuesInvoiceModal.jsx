import React, { useState } from 'react';
import { X, DollarSign, Calendar, FileText, AlertTriangle } from 'lucide-react';

const API_BASE_URL = 'https://products-api.cbc-apps.net';

const CreateDuesInvoiceModal = ({ isOpen, onClose, supplier, availableDues, onInvoiceCreated }) => {
  const [formData, setFormData] = useState({
    totalAmount: '',
    dueDate: '',
    description: 'صرف مستحقات الطلبات المكتملة',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.totalAmount || !formData.dueDate || !formData.description) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const amount = parseFloat(formData.totalAmount);
    if (amount <= 0) {
      setError('يرجى إدخال مبلغ صالح');
      return;
    }

    if (amount > availableDues.pendingDues) {
      setError(`المبلغ لا يمكن أن يتجاوز المستحقات المتاحة (${formatCurrency(availableDues.pendingDues)})`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/invoices/supplier/dues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplierId: supplier.id,
          totalAmount: amount,
          dueDate: formData.dueDate,
          description: formData.description,
          notes: formData.notes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'حدث خطأ أثناء إنشاء الفاتورة');
      }

      const result = await response.json();
      
      // عرض رسالة نجاح
      alert(`تم إنشاء فاتورة صرف المستحقات بنجاح!\nرقم الفاتورة: ${result.invoiceNumber}\nالمبلغ: ${formatCurrency(result.totalAmount)}\nالمستحقات المتبقية: ${formatCurrency(result.remainingDues)}`);
      
      onInvoiceCreated();
      
    } catch (error) {
      console.error('Error creating dues invoice:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // السماح بالأرقام والفواصل العشرية فقط
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, totalAmount: value }));
    }
  };

  const setQuickAmount = (percentage) => {
    const amount = (availableDues.pendingDues * percentage / 100).toFixed(0);
    setFormData(prev => ({ ...prev, totalAmount: amount }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
         onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
           onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">إنشاء فاتورة صرف مستحقات</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* معلومات المورد */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">معلومات المورد</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">الاسم:</span> {supplier.name}</p>
              <p><span className="font-medium">الهاتف:</span> {supplier.phone}</p>
              <p><span className="font-medium">النوع:</span> {supplier.hasWholesalePrice ? 'جملة ومفرد' : 'مفرد فقط'}</p>
            </div>
          </div>

          {/* معلومات المستحقات */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">ملخص المستحقات</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">إجمالي المكتسب:</span> {formatCurrency(availableDues.totalEarned)}</p>
              <p><span className="font-medium">المدفوع سابقاً:</span> {formatCurrency(availableDues.totalPaid)}</p>
              <p><span className="font-medium text-orange-600">المستحقات المتاحة:</span> {formatCurrency(availableDues.pendingDues)}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* المبلغ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المبلغ (بالدينار العراقي) *
              </label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.totalAmount}
                  onChange={handleAmountChange}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل المبلغ..."
                  required
                />
              </div>
              
              {/* أزرار المبالغ السريعة */}
              <div className="mt-2 flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setQuickAmount(25)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAmount(50)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAmount(75)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  75%
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAmount(100)}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  المبلغ كاملاً
                </button>
              </div>
            </div>

            {/* تاريخ الاستحقاق */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ الاستحقاق *
              </label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* الوصف */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وصف الفاتورة *
              </label>
              <div className="relative">
                <FileText className="absolute right-3 top-3 text-gray-400" size={20} />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="وصف سبب صرف المستحقات..."
                  required
                />
              </div>
            </div>

            {/* ملاحظات إضافية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ملاحظات إضافية
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ملاحظات اختيارية..."
              />
            </div>

            {/* الأزرار */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {loading ? 'جاري الإنشاء...' : 'إنشاء الفاتورة'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDuesInvoiceModal;
