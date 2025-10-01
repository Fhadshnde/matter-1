import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiEye, 
  FiDownload, 
  FiFilter, 
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';
import { MdPrint, MdPictureAsPdf } from 'react-icons/md';
import axios from 'axios';
import StatCard from '../Shared/StatCard';
import Pagination from '../Shared/Pagination';
import CreateInvoiceModal from './CreateInvoiceModal';
import InvoiceDetailsModal from './InvoiceDetailsModal';

const API_BASE_URL = 'https://products-api.cbc-apps.net';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    invoicesByStatus: {
      paid: 0,
      pending: 0,
      overdue: 0
    }
  });
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    supplierId: '',
    search: '',
    timePeriod: 'month',
    startDate: '',
    endDate: ''
  });

  const getAuthToken = () => localStorage.getItem('token');

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
  });

  // Fetch invoices statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/invoices/stats`, {
        headers: getAuthHeaders()
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
    }
  };

  // Fetch suppliers for filter dropdown
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/suppliers`, {
        headers: getAuthHeaders()
      });
      setSuppliers(response.data.suppliers || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  // Fetch invoices with filters
  const fetchInvoices = async (page = 1) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await axios.get(`${API_BASE_URL}/invoices?${queryParams}`, {
        headers: getAuthHeaders()
      });

      setInvoices(response.data.invoices || []);
      setCurrentPage(page);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchSuppliers(),
        fetchInvoices(1)
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    fetchInvoices(1);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateInvoice = () => {
    setIsCreateModalOpen(true);
  };

  const handleInvoiceCreated = () => {
    fetchStats();
    fetchInvoices(currentPage);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsModalOpen(true);
  };

  const handleStatusUpdate = async (invoiceId, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/invoices/${invoiceId}/status`, {
        status: newStatus,
        notes: `Status updated to ${newStatus}`,
        ...(newStatus === 'PAID' && { paidDate: new Date().toISOString() })
      }, {
        headers: getAuthHeaders()
      });
      
      fetchStats();
      fetchInvoices(currentPage);
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const handlePrintInvoice = async (invoice) => {
    try {
      // Create PDF content
      const printWindow = window.open('', '_blank');
      printWindow.document.write(generateInvoicePDF(invoice));
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error('Error printing invoice:', error);
    }
  };

  const generateInvoicePDF = (invoice) => {
    return `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>فاتورة رقم ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .invoice-details { margin: 20px 0; }
          .table { width: 100%; border-collapse: collapse; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          .total { font-weight: bold; font-size: 18px; }
          .status { padding: 4px 8px; border-radius: 4px; }
          .status.pending { background: #fff3cd; color: #856404; }
          .status.paid { background: #d1edff; color: #0c5460; }
          .status.overdue { background: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>فاتورة دفع للمورد</h1>
          <h2>رقم الفاتورة: ${invoice.invoiceNumber}</h2>
        </div>
        
        <div class="invoice-details">
          <h3>تفاصيل المورد:</h3>
          <p><strong>اسم المورد:</strong> ${invoice.supplier?.name || 'غير محدد'}</p>
          <p><strong>معلومات الاتصال:</strong> ${invoice.supplier?.contactInfo || invoice.supplier?.phone || 'غير محدد'}</p>
          
          <h3>تفاصيل الفاتورة:</h3>
          <p><strong>تاريخ الإنشاء:</strong> ${new Date(invoice.createdAt).toLocaleDateString('ar-SA')}</p>
          <p><strong>تاريخ الاستحقاق:</strong> ${new Date(invoice.dueDate).toLocaleDateString('ar-SA')}</p>
          <p><strong>الوصف:</strong> ${invoice.description || invoice.notes || 'دفعة للمورد'}</p>
          <p><strong>الحالة:</strong> <span class="status ${invoice.status.toLowerCase()}">${getStatusText(invoice.status)}</span></p>
        </div>
        
        <table class="table">
          <tr>
            <th>البند</th>
            <th>المبلغ</th>
          </tr>
          <tr>
            <td>${invoice.description || 'دفعة للمورد'}</td>
            <td>${invoice.totalAmount.toLocaleString()} د.ع</td>
          </tr>
          <tr class="total">
            <td>المجموع الكلي</td>
            <td>${invoice.totalAmount.toLocaleString()} د.ع</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px;">
          <p><strong>ملاحظات:</strong> ${invoice.notes || 'لا توجد ملاحظات'}</p>
        </div>
        
        <div style="margin-top: 50px; text-align: center;">
          <p>تم إنشاء هذه الفاتورة بواسطة نظام إدارة المتجر</p>
          <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
      </body>
      </html>
    `;
  };

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
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الفواتير</h1>
        <p className="text-gray-600">عرض وإدارة فواتير الموردين</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <StatCard
          title="إجمالي الفواتير"
          value={stats.totalInvoices}
          icon={<FiDollarSign className="w-6 h-6" />}
          color="bg-blue-500"
        />
        <StatCard
          title="إجمالي المبلغ"
          value={`${stats.totalAmount.toLocaleString()} د.ع`}
          icon={<FiTrendingUp className="w-6 h-6" />}
          color="bg-green-500"
        />
        <StatCard
          title="المدفوعة"
          value={`${stats.paidAmount.toLocaleString()} د.ع`}
          icon={<FiDollarSign className="w-6 h-6" />}
          color="bg-emerald-500"
        />
        <StatCard
          title="قيد الانتظار"
          value={`${stats.pendingAmount.toLocaleString()} د.ع`}
          icon={<FiClock className="w-6 h-6" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="متأخرة"
          value={`${stats.overdueAmount.toLocaleString()} د.ع`}
          icon={<FiAlertCircle className="w-6 h-6" />}
          color="bg-red-500"
        />
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث برقم الفاتورة أو اسم المورد..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">كل الحالات</option>
            <option value="PENDING">قيد الانتظار</option>
            <option value="PAID">مدفوعة</option>
            <option value="OVERDUE">متأخرة</option>
          </select>

          {/* Supplier Filter */}
          <select
            value={filters.supplierId}
            onChange={(e) => handleFilterChange('supplierId', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">كل الموردين</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>

          {/* Time Period Filter */}
          <select
            value={filters.timePeriod}
            onChange={(e) => handleFilterChange('timePeriod', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="3months">آخر 3 أشهر</option>
            <option value="6months">آخر 6 أشهر</option>
            <option value="year">هذا العام</option>
          </select>

          {/* Create Invoice Button */}
          <button
            onClick={handleCreateInvoice}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            إنشاء فاتورة جديدة
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الفاتورة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المورد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الاستحقاق
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(invoice.createdAt).toLocaleDateString('ar-SA')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.supplier?.name || 'غير محدد'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.supplier?.contactInfo || invoice.supplier?.phone || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.totalAmount.toLocaleString()} د.ع
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900"
                        title="عرض التفاصيل"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePrintInvoice(invoice)}
                        className="text-green-600 hover:text-green-900"
                        title="طباعة"
                      >
                        <MdPrint className="w-4 h-4" />
                      </button>
                      {invoice.status === 'PENDING' && (
                        <button
                          onClick={() => handleStatusUpdate(invoice.id, 'PAID')}
                          className="text-emerald-600 hover:text-emerald-900"
                          title="تحديد كمدفوعة"
                        >
                          <FiDollarSign className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={fetchInvoices}
            />
          </div>
        )}

        {invoices.length === 0 && (
          <div className="text-center py-12">
            <FiDollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد فواتير</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateInvoiceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          suppliers={suppliers}
          onInvoiceCreated={handleInvoiceCreated}
        />
      )}

      {isDetailsModalOpen && selectedInvoice && (
        <InvoiceDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          invoice={selectedInvoice}
          onStatusUpdate={handleStatusUpdate}
          onPrint={handlePrintInvoice}
        />
      )}
    </div>
  );
};

export default Invoices;
