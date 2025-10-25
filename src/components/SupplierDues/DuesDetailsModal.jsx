import React, { useState, useEffect } from 'react';
import { X, TrendingUp, DollarSign, ShoppingBag, Percent, Calendar, FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'https://products-api.cbc-apps.net';

const DuesDetailsModal = ({ isOpen, onClose, supplier, dues }) => {
  const [invoices, setInvoices] = useState([]);
  const [supplierStats, setSupplierStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && supplier) {
      fetchInvoices();
      fetchStatistics();
    }
  }, [isOpen, supplier]);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/invoices/supplier/${supplier.id}/invoices?type=SUPPLIER_DUES`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/suppliers/${supplier.id}/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSupplierStats(data);
      }
    } catch (error) {
      console.error('Error fetching supplier statistics:', error);
    }
  };

  const formatCurrency = (amount) => {
    // Handle cases where amount is not a number
    if (isNaN(parseFloat(amount))) {
      return 'ليس رقمًا';
    }
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"><CheckCircle size={12} className="ml-1" />تم الدفع</span>;
      case 'PENDING':
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800"><AlertCircle size={12} className="ml-1" />قيد الانتظار</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">غير معروف</span>;
    }
  };

  if (!isOpen) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center">
          <svg className="animate-spin h-8 w-8 text-gray-800 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-700">جاري تحميل التفاصيل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-6 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
        {/* رأس المودال */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">تفاصيل مستحقات المورد</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* محتوى المودال */}
        <div className="overflow-y-auto flex-grow px-2">
          {/* بيانات المورد */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <h3 className="font-semibold text-gray-900 ml-2">بيانات المورد:</h3>
              <p className="text-gray-700 font-bold">{supplier?.name}</p>
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">إجمالي المستحقات:</span>
                <span className="mr-2 text-gray-900 font-bold">{formatCurrency(parseFloat(dues))}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">عدد الفواتير:</span>
                <span className="mr-2 text-gray-900 font-bold">{invoices.length}</span>
              </div>
            </div> */}
          </div>

          {/* إحصائيات إضافية */}
          {supplierStats && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">الاحصائيات </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <TrendingUp size={16} className="text-indigo-500 ml-2" />
                  <div>
                    <span className="font-medium">إجمالي المبلغ:</span>
                    <span className="mr-2 text-gray-700">{formatCurrency(parseFloat(supplierStats.totalAmount))}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <ShoppingBag size={16} className="text-orange-500 ml-2" />
                  <div>
                    <span className="font-medium">إجمالي التسليمات:</span>
                    <span className="mr-2 text-gray-700">{formatCurrency(parseFloat(supplierStats.totalDelivery))}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Percent size={16} className="text-purple-500 ml-2" />
                  <div>
                    <span className="font-medium">صافي المنصة:</span>
                    <span className="mr-2 text-gray-700">{formatCurrency(parseFloat(supplierStats.platformNet))}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign size={16} className="text-green-500 ml-2" />
                  <div>
                    <span className="font-medium">صافي المورد:</span>
                    <span className="mr-2 text-gray-700">{formatCurrency(parseFloat(supplierStats.supplierNet))}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FileText size={16} className="text-red-500 ml-2" />
                  <div>
                    <span className="font-medium">إجمالي المرتجعات:</span>
                    <span className="mr-2 text-gray-700">{formatCurrency(parseFloat(supplierStats.totalReturns))}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="text-blue-500 ml-2" />
                  <div>
                    <span className="font-medium">آخر تحديث:</span>
                    <span className="mr-2 text-gray-700">{formatDate(supplierStats.lastUpdated)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* جدول الفواتير */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">تفاصيل الفواتير</h3>
            {invoices.length === 0 ? (
              <p className="text-gray-500 text-center">لا توجد فواتير لعرضها.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        رقم الفاتورة
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المبلغ
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الإنشاء
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الاستحقاق
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الوصف
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(invoice.totalAmount)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(invoice.createdAt)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 max-w-xs">
                          <div className="truncate" title={invoice.description}>
                            {invoice.description}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* أزرار الإغلاق */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuesDetailsModal;