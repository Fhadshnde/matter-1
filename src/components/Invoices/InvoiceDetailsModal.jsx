import React, { useState } from 'react';
import { 
  FiX, 
  FiUser, 
  FiDollarSign, 
  FiCalendar, 
  FiFileText,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiEdit3
} from 'react-icons/fi';
import { MdPrint, MdPictureAsPdf } from 'react-icons/md';
import axios from 'axios';

const API_BASE_URL = 'https://products-api.cbc-apps.net';

const InvoiceDetailsModal = ({ isOpen, onClose, invoice, onStatusUpdate, onPrint }) => {
  const [updating, setUpdating] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  const getAuthToken = () => localStorage.getItem('token');
  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
  });

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'قيد الانتظار';
      case 'PAID': return 'مدفوعة';
      case 'OVERDUE': return 'متأخرة';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PAID': return 'bg-green-100 text-green-800 border-green-200';
      case 'OVERDUE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <FiClock className="w-4 h-4" />;
      case 'PAID': return <FiCheck className="w-4 h-4" />;
      case 'OVERDUE': return <FiAlertCircle className="w-4 h-4" />;
      default: return <FiFileText className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    setUpdating(true);
    try {
      await onStatusUpdate(invoice.id, newStatus);
      setShowStatusUpdate(false);
      setNewStatus('');
      setStatusNotes('');
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('حدث خطأ أثناء تحديث الحالة');
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    onPrint(invoice);
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} د.ع`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysUntilDue = () => {
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!isOpen || !invoice) return null;

  const daysUntilDue = calculateDaysUntilDue();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">تفاصيل الفاتورة</h2>
            <p className="text-sm text-gray-500 mt-1">رقم الفاتورة: {invoice.invoiceNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <MdPrint className="w-4 h-4" />
              طباعة
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Key Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Card */}
            <div className={`p-4 rounded-lg border ${getStatusColor(invoice.status)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(invoice.status)}
                <span className="font-medium">حالة الفاتورة</span>
              </div>
              <p className="text-lg font-semibold">{getStatusText(invoice.status)}</p>
              {invoice.status === 'PENDING' && (
                <button
                  onClick={() => setShowStatusUpdate(true)}
                  className="mt-2 flex items-center gap-1 text-sm hover:underline"
                >
                  <FiEdit3 className="w-3 h-3" />
                  تغيير الحالة
                </button>
              )}
            </div>

            {/* Amount Card */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">إجمالي المبلغ</span>
              </div>
              <p className="text-xl font-bold text-blue-900">{formatCurrency(invoice.totalAmount)}</p>
            </div>

            {/* Due Date Card */}
            <div className={`p-4 rounded-lg border ${
              daysUntilDue < 0 ? 'bg-red-50 border-red-200' : 
              daysUntilDue <= 7 ? 'bg-yellow-50 border-yellow-200' : 
              'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className={`w-4 h-4 ${
                  daysUntilDue < 0 ? 'text-red-600' : 
                  daysUntilDue <= 7 ? 'text-yellow-600' : 
                  'text-gray-600'
                }`} />
                <span className="font-medium">تاريخ الاستحقاق</span>
              </div>
              <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
              <p className={`text-sm mt-1 ${
                daysUntilDue < 0 ? 'text-red-600' : 
                daysUntilDue <= 7 ? 'text-yellow-600' : 
                'text-gray-600'
              }`}>
                {daysUntilDue < 0 ? `متأخرة بـ ${Math.abs(daysUntilDue)} يوم` :
                 daysUntilDue === 0 ? 'تستحق اليوم' :
                 `${daysUntilDue} يوم متبقي`}
              </p>
            </div>
          </div>

          {/* Supplier Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiUser className="w-4 h-4" />
              معلومات المورد
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">اسم المورد</label>
                <p className="text-gray-900">{invoice.supplier?.name || 'غير محدد'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">معلومات الاتصال</label>
                <p className="text-gray-900">
                  {invoice.supplier?.contactInfo || invoice.supplier?.phone || 'غير متوفرة'}
                </p>
              </div>
              {invoice.supplier?.email && (
                <div>
                  <label className="text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                  <p className="text-gray-900">{invoice.supplier.email}</p>
                </div>
              )}
              {invoice.supplier?.address && (
                <div>
                  <label className="text-sm font-medium text-gray-600">العنوان</label>
                  <p className="text-gray-900">{invoice.supplier.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiFileText className="w-4 h-4" />
              تفاصيل الفاتورة
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">وصف الفاتورة</label>
                <p className="text-gray-900">{invoice.description || invoice.notes || 'لا يوجد وصف'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">تاريخ الإنشاء</label>
                  <p className="text-gray-900">{formatDate(invoice.createdAt)}</p>
                </div>
                {invoice.paidDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">تاريخ الدفع</label>
                    <p className="text-gray-900">{formatDate(invoice.paidDate)}</p>
                  </div>
                )}
              </div>

              {invoice.notes && invoice.description !== invoice.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">ملاحظات إضافية</label>
                  <p className="text-gray-900">{invoice.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Information (if exists) */}
          {invoice.order && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">معلومات الطلب المرتبط</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">رقم الطلب</label>
                  <p className="text-gray-900">#{invoice.order.id}</p>
                </div>
                {invoice.order.user && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">العميل</label>
                    <p className="text-gray-900">{invoice.order.user.name} - {invoice.order.user.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status History */}
          {invoice.statusHistory && invoice.statusHistory.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">تاريخ التحديثات</h3>
              <div className="space-y-2">
                {invoice.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(history.status).split(' ')[0]}`}></div>
                    <span className="font-medium">{getStatusText(history.status)}</span>
                    <span className="text-gray-500">-</span>
                    <span className="text-gray-600">{formatDate(history.createdAt)}</span>
                    {history.notes && (
                      <>
                        <span className="text-gray-500">-</span>
                        <span className="text-gray-600">{history.notes}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        {showStatusUpdate && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">تحديث حالة الفاتورة</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحالة الجديدة</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر الحالة</option>
                    <option value="PAID">مدفوعة</option>
                    <option value="OVERDUE">متأخرة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                  <textarea
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    rows="3"
                    placeholder="إضافة ملاحظة حول التحديث..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowStatusUpdate(false)}
                    disabled={updating}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={!newStatus || updating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {updating ? 'جاري التحديث...' : 'تحديث الحالة'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;
