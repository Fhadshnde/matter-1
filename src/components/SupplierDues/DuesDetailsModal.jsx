import React, { useState, useEffect } from 'react';
import { X, TrendingUp, DollarSign, ShoppingBag, Percent, Calendar, FileText, Download } from 'lucide-react';

const API_BASE_URL = 'http://localhost:4500';

const DuesDetailsModal = ({ isOpen, onClose, supplier, dues }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && supplier) {
      fetchInvoices();
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'قيد الانتظار' },
      'PAID': { bg: 'bg-green-100', text: 'text-green-800', label: 'مدفوعة' },
      'OVERDUE': { bg: 'bg-red-100', text: 'text-red-800', label: 'متأخرة' }
    };

    const config = statusConfig[status] || statusConfig['PENDING'];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">تفاصيل مستحقات المورد</h2>
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
            <div className="flex items-center gap-4 mb-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-lg font-medium text-blue-600">
                  {supplier.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">{supplier.name}</h3>
                <p className="text-blue-700 text-sm">{supplier.phone}</p>
                <p className="text-blue-700 text-sm">
                  نوع المورد: {supplier.hasWholesalePrice ? 'جملة ومفرد' : 'مفرد فقط'}
                </p>
              </div>
            </div>
          </div>

          {/* إحصائيات المستحقات */}
          {dues && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">إجمالي المكتسب</p>
                    <p className="text-lg font-bold text-green-900">{formatCurrency(dues.totalEarned)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">المدفوع سابقاً</p>
                    <p className="text-lg font-bold text-blue-900">{formatCurrency(dues.totalPaid)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FileText className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-orange-600 font-medium">المستحقات المعلقة</p>
                    <p className="text-lg font-bold text-orange-900">{formatCurrency(dues.pendingDues)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Percent className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">نسبة المورد</p>
                    <p className="text-lg font-bold text-purple-900">{dues.commissionRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* معلومات إضافية */}
          {dues && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">معلومات إضافية</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">إجمالي الإيرادات:</span>
                  <span className="mr-2">{formatCurrency(dues.totalRevenue)}</span>
                </div>
                <div>
                  <span className="font-medium">الطلبات المكتملة:</span>
                  <span className="mr-2">{dues.completedOrders}</span>
                </div>
                <div>
                  <span className="font-medium">متوسط الربح لكل طلب:</span>
                  <span className="mr-2">{formatCurrency(dues.avgProfitPerOrder)}</span>
                </div>
              </div>
            </div>
          )}

          {/* فواتير صرف المستحقات */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">فواتير صرف المستحقات</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">جاري تحميل الفواتير...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p>لا توجد فواتير صرف مستحقات لهذا المورد</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        رقم الفاتورة
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        المبلغ
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        الحالة
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        تاريخ الإنشاء
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        تاريخ الاستحقاق
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        الوصف
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
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
