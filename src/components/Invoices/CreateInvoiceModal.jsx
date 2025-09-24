import React, { useState } from 'react';
import { FiX, FiUser, FiDollarSign, FiCalendar, FiFileText, FiSave } from 'react-icons/fi';
import axios from 'axios';

const API_BASE_URL = 'https://products-api.cbc-apps.net';

const CreateInvoiceModal = ({ isOpen, onClose, suppliers, onInvoiceCreated }) => {
  const [formData, setFormData] = useState({
    supplierId: '',
    totalAmount: '',
    dueDate: '',
    description: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const getAuthToken = () => localStorage.getItem('token');
  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supplierId) {
      newErrors.supplierId = 'يجب اختيار المورد';
    }

    if (!formData.totalAmount) {
      newErrors.totalAmount = 'يجب إدخال المبلغ';
    } else if (parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = 'المبلغ يجب أن يكون أكبر من الصفر';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'يجب تحديد تاريخ الاستحقاق';
    } else if (new Date(formData.dueDate) <= new Date()) {
      newErrors.dueDate = 'تاريخ الاستحقاق يجب أن يكون في المستقبل';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'يجب إدخال وصف للفاتورة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        supplierId: parseInt(formData.supplierId),
        totalAmount: parseFloat(formData.totalAmount),
        dueDate: formData.dueDate,
        description: formData.description.trim(),
        notes: formData.notes.trim() || undefined
      };

      await axios.post(`${API_BASE_URL}/invoices/supplier`, payload, {
        headers: getAuthHeaders()
      });

      // Reset form
      setFormData({
        supplierId: '',
        totalAmount: '',
        dueDate: '',
        description: '',
        notes: ''
      });
      
      onInvoiceCreated();
      onClose();
      
      // Show success message
      alert('تم إنشاء الفاتورة بنجاح!');
    } catch (error) {
      console.error('Error creating invoice:', error);
      
      if (error.response?.data?.message) {
        alert(`خطأ: ${error.response.data.message}`);
      } else {
        alert('حدث خطأ أثناء إنشاء الفاتورة. حاول مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        supplierId: '',
        totalAmount: '',
        dueDate: '',
        description: '',
        notes: ''
      });
      setErrors({});
      onClose();
    }
  };

  // Set default due date to 30 days from now
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  React.useEffect(() => {
    if (isOpen && !formData.dueDate) {
      setFormData(prev => ({
        ...prev,
        dueDate: getDefaultDueDate()
      }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">إنشاء فاتورة جديدة للمورد</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Supplier Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiUser className="inline w-4 h-4 mr-2" />
              المورد *
            </label>
            <select
              name="supplierId"
              value={formData.supplierId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.supplierId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="">اختر المورد</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} - {supplier.contactInfo || supplier.phone || 'لا يوجد رقم'}
                </option>
              ))}
            </select>
            {errors.supplierId && (
              <p className="text-red-500 text-sm mt-1">{errors.supplierId}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiDollarSign className="inline w-4 h-4 mr-2" />
              المبلغ المستحق (د.ع) *
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleInputChange}
              min="0.01"
              step="0.01"
              placeholder="أدخل المبلغ بالدينار العراقي"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.totalAmount ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.totalAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiCalendar className="inline w-4 h-4 mr-2" />
              تاريخ الاستحقاق *
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFileText className="inline w-4 h-4 mr-2" />
              وصف الفاتورة *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="مثل: دفعة شهرية للمورد، مستحقات الطلبات المكتملة، إلخ"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFileText className="inline w-4 h-4 mr-2" />
              ملاحظات إضافية
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="أي ملاحظات أو تفاصيل إضافية..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Preview */}
          {formData.supplierId && formData.totalAmount && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">معاينة الفاتورة:</h3>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">المورد:</span> {suppliers.find(s => s.id == formData.supplierId)?.name}</p>
                <p><span className="font-medium">المبلغ:</span> {parseFloat(formData.totalAmount || 0).toLocaleString()} د.ع</p>
                <p><span className="font-medium">تاريخ الاستحقاق:</span> {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('ar-SA') : ''}</p>
                <p><span className="font-medium">الوصف:</span> {formData.description}</p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  إنشاء الفاتورة
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
