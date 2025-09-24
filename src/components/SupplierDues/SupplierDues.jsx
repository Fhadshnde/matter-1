import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Download, TrendingUp, DollarSign, Users, ShoppingBag, AlertCircle, CheckCircle } from 'lucide-react';
import CreateDuesInvoiceModal from './CreateDuesInvoiceModal';
import DuesDetailsModal from './DuesDetailsModal';

const API_BASE_URL = 'https://products-api.cbc-apps.net';

const SupplierDues = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersDues, setSuppliersDues] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    totalPendingDues: 0,
    totalPaidDues: 0,
    avgDuesPerSupplier: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // جلب قائمة الموردين
      const suppliersResponse = await fetch(`${API_BASE_URL}/admin/dashboard/suppliers`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!suppliersResponse.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      
      const suppliersData = await suppliersResponse.json();
      setSuppliers(suppliersData.suppliers || []);
      
      // جلب مستحقات كل مورد
      const duesPromises = (suppliersData.suppliers || []).map(async (supplier) => {
        try {
          const duesResponse = await fetch(`${API_BASE_URL}/invoices/supplier/${supplier.id}/dues`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (duesResponse.ok) {
            const duesData = await duesResponse.json();
            return { supplierId: supplier.id, dues: duesData };
          }
        } catch (error) {
          console.error(`Error fetching dues for supplier ${supplier.id}:`, error);
        }
        return { supplierId: supplier.id, dues: null };
      });

      const duesResults = await Promise.all(duesPromises);
      const duesMap = {};
      let totalPending = 0;
      let totalPaid = 0;
      let suppliersWithDues = 0;

      duesResults.forEach(result => {
        if (result.dues) {
          duesMap[result.supplierId] = result.dues;
          totalPending += result.dues.pendingDues || 0;
          totalPaid += result.dues.totalPaid || 0;
          if (result.dues.pendingDues > 0) suppliersWithDues++;
        }
      });

      setSuppliersDues(duesMap);
      
      setStats({
        totalSuppliers: suppliersData.suppliers?.length || 0,
        totalPendingDues: totalPending,
        totalPaidDues: totalPaid,
        avgDuesPerSupplier: suppliersWithDues > 0 ? totalPending / suppliersWithDues : 0
      });
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDuesInvoice = (supplier) => {
    setSelectedSupplier(supplier);
    setShowCreateModal(true);
  };

  const handleViewDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setShowDetailsModal(true);
  };

  const handleInvoiceCreated = () => {
    fetchData(); // إعادة تحميل البيانات بعد إنشاء فاتورة
    setShowCreateModal(false);
    setSelectedSupplier(null);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm)
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">جاري تحميل مستحقات الموردين...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* العنوان الرئيسي */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة مستحقات الموردين</h1>
        <p className="text-gray-600">إدارة ومراقبة مستحقات الموردين وإنشاء فواتير الصرف</p>
      </div>

      {/* إحصائيات المستحقات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">إجمالي الموردين</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <AlertCircle size={24} />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">المستحقات المعلقة</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.totalPendingDues)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle size={24} />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">المدفوع إجمالاً</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalPaidDues)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <TrendingUp size={24} />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">متوسط المستحقات</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.avgDuesPerSupplier)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* البحث والفلاتر */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث بالاسم أو رقم الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              تحديث البيانات
            </button>
          </div>
        </div>
      </div>

      {/* جدول الموردين ومستحقاتهم */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المورد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  النوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجمالي المكتسب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المدفوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المستحقات المعلقة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نسبة المورد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.map((supplier) => {
                const dues = suppliersDues[supplier.id];
                return (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {supplier.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                          <div className="text-sm text-gray-500">{supplier.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        supplier.hasWholesalePrice 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {supplier.hasWholesalePrice ? 'جملة ومفرد' : 'مفرد فقط'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dues ? formatCurrency(dues.totalEarned) : 'جاري التحميل...'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {dues ? formatCurrency(dues.totalPaid) : 'جاري التحميل...'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {dues ? (
                        <span className={`text-sm font-semibold ${
                          dues.pendingDues > 0 ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          {formatCurrency(dues.pendingDues)}
                        </span>
                      ) : (
                        'جاري التحميل...'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dues ? `${dues.commissionRate}%` : 'جاري التحميل...'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(supplier)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-100"
                          title="عرض التفاصيل"
                        >
                          <Eye size={16} />
                        </button>
                        {dues && dues.pendingDues > 0 && (
                          <button
                            onClick={() => handleCreateDuesInvoice(supplier)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-100"
                            title="إنشاء فاتورة صرف"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* المودال لإنشاء فاتورة صرف مستحقات */}
      {showCreateModal && selectedSupplier && (
        <CreateDuesInvoiceModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedSupplier(null);
          }}
          supplier={selectedSupplier}
          availableDues={suppliersDues[selectedSupplier.id]}
          onInvoiceCreated={handleInvoiceCreated}
        />
      )}

      {/* المودال لعرض تفاصيل المستحقات */}
      {showDetailsModal && selectedSupplier && (
        <DuesDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedSupplier(null);
          }}
          supplier={selectedSupplier}
          dues={suppliersDues[selectedSupplier.id]}
        />
      )}
    </div>
  );
};

export default SupplierDues;
