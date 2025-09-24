import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaStore, FaChartBar, FaUser, FaBox, FaTruck, FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { apiCall } from '../../config/api';
import API_CONFIG from '../../config/api';

const SuppliersPage = () => {
  // State for data
  const [suppliersData, setSuppliersData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for filters and search
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // State for forms
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    address: '',
    phone: '',
    password: '',
    platformPercentage: 0.15,
    hasWholesalePrice: false
  });

  // State for supplier details
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [supplierProfits, setSupplierProfits] = useState(null);

  // Fetch suppliers data
  const fetchSuppliersData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      if (searchText) params.append('search', searchText);

      const url = `${API_CONFIG.ADMIN.SUPPLIERS}?${params.toString()}`;
      console.log('Fetching suppliers from:', url);
      
      const data = await apiCall(url);
      console.log('Suppliers data received:', data);
      
      setSuppliersData(data.suppliers || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError('فشل في تحميل بيانات الموردين');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch supplier details and profits
  const fetchSupplierDetails = async (supplierId) => {
    try {
      const url = API_CONFIG.ADMIN.SUPPLIER_DETAILS(supplierId);
      const detailsData = await apiCall(url);
      setSupplierDetails(detailsData);
      
      // Fetch profits data
      const profitsUrl = API_CONFIG.ADMIN.SUPPLIER_PROFITS(supplierId);
      const profitsData = await apiCall(profitsUrl);
      setSupplierProfits(profitsData);
    } catch (error) {
      console.error('Error fetching supplier details or profits:', error);
      setError('فشل في تحميل تفاصيل المورد أو أرباحه');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  // Handle add supplier
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiCall(API_CONFIG.ADMIN.SUPPLIER_CREATE, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        contactInfo: '',
        address: '',
        phone: '',
        password: '',
        platformPercentage: 0.15,
        hasWholesalePrice: false
      });
      fetchSuppliersData();
    } catch (error) {
      console.error('Error adding supplier:', error);
      setError('فشل في إضافة المورد');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit supplier
  const handleEditSupplier = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = API_CONFIG.ADMIN.SUPPLIER_UPDATE(selectedSupplier.id);
      await apiCall(url, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      setIsEditModalOpen(false);
      setSelectedSupplier(null);
      fetchSuppliersData();
    } catch (error) {
      console.error('Error editing supplier:', error);
      setError('فشل في تعديل المورد');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete supplier
  const handleDeleteSupplier = async () => {
    setIsLoading(true);
    try {
      const url = API_CONFIG.ADMIN.SUPPLIER_DELETE(selectedSupplier.id);
      await apiCall(url, {
        method: 'DELETE'
      });
      setIsDeleteModalOpen(false);
      setSelectedSupplier(null);
      fetchSuppliersData();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setError('فشل في حذف المورد');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view details
  const handleViewDetails = (supplier) => {
    setSelectedSupplier(supplier);
    fetchSupplierDetails(supplier.id);
    setIsDetailsModalOpen(true);
  };

  // Handle edit
  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactInfo: supplier.contactInfo,
      address: supplier.address || '',
      phone: supplier.phone,
      password: '',
      platformPercentage: supplier.platformPercentage || 0.15,
      hasWholesalePrice: supplier.hasWholesalePrice || false
    });
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Effects
  useEffect(() => {
    fetchSuppliersData();
  }, [currentPage, itemsPerPage, searchText]);

  // Calculate statistics
  const totalSuppliers = pagination.totalItems || 0;
  const activeSuppliers = suppliersData.filter(s => s.productsCount > 0).length;
  const totalProducts = suppliersData.reduce((sum, s) => sum + (s.productsCount || 0), 0);
  const totalValue = suppliersData.reduce((sum, s) => sum + (s.totalProductsValue || 0), 0);

  const statsCards = [
    {
      title: 'إجمالي الموردين',
      value: totalSuppliers.toLocaleString(),
      icon: 'suppliers',
      color: 'bg-blue-500'
    },
    {
      title: 'الموردين النشطين',
      value: activeSuppliers.toLocaleString(),
      icon: 'active',
      color: 'bg-green-500'
    },
    {
      title: 'إجمالي المنتجات',
      value: totalProducts.toLocaleString(),
      icon: 'products',
      color: 'bg-purple-500'
    },
    {
      title: 'إجمالي القيمة',
      value: `${totalValue.toLocaleString()} د.ع`,
      icon: 'value',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-right">إدارة الموردين</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} rounded-full p-3`}>
                {card.icon === 'suppliers' && <FaStore className="text-white text-xl" />}
                {card.icon === 'active' && <FaUser className="text-white text-xl" />}
                {card.icon === 'products' && <FaBox className="text-white text-xl" />}
                {card.icon === 'value' && <FaChartBar className="text-white text-xl" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col lg:flex-row gap-4 items-center flex-1">
            <div className="flex gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10 لكل صفحة</option>
                <option value={20}>20 لكل صفحة</option>
                <option value={50}>50 لكل صفحة</option>
                <option value={100}>100 لكل صفحة</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus />
            إضافة مورد جديد
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Suppliers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="mr-4 text-gray-600">جاري التحميل...</span>
          </div>
        ) : suppliersData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>لا توجد موردين</p>
            <p className="text-sm mt-2">جرب البحث أو أضف مورد جديد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المورد
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    معلومات الاتصال
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنتجات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نوع المورد
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الإنشاء
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {suppliersData.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {supplier.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {supplier.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {supplier.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{supplier.contactInfo}</div>
                      <div className="text-sm text-gray-500">{supplier.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {supplier.productsCount || 0} منتج
                      </div>
                      <div className="text-sm text-gray-500">
                        {supplier.activeProductsCount || 0} نشط
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        supplier.hasWholesalePrice 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {supplier.hasWholesalePrice ? 'جملة ومفرد' : 'مفرد فقط'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(supplier.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(supplier)}
                          className="text-blue-600 hover:text-blue-900"
                          title="عرض التفاصيل"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="تعديل"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier)}
                          className="text-red-600 hover:text-red-900"
                          title="حذف"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  عرض <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> إلى{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, pagination.totalItems)}
                  </span>{' '}
                  من <span className="font-medium">{pagination.totalItems}</span> نتيجة
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    السابق
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">إضافة مورد جديد</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المورد *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  معلومات الاتصال *
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  كلمة المرور *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نسبة المنصة
                </label>
                <input
                  type="number"
                  name="platformPercentage"
                  value={formData.platformPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasWholesalePrice"
                  checked={formData.hasWholesalePrice}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="mr-2 block text-sm text-gray-900">
                  لديه سعر جملة
                </label>
              </div>

              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'جاري الإضافة...' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {isEditModalOpen && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">تعديل المورد</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSupplier} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المورد *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المتجر
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  معلومات الاتصال *
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  العنوان
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نسبة المنصة
                </label>
                <input
                  type="number"
                  name="platformPercentage"
                  value={formData.platformPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasWholesalePrice"
                  checked={formData.hasWholesalePrice}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="mr-2 block text-sm text-gray-900">
                  لديه سعر جملة
                </label>
              </div>

              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'جاري التعديل...' : 'تعديل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Details Modal */}
      {isDetailsModalOpen && selectedSupplier && supplierDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">تفاصيل المورد</h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supplier Info */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-800">معلومات المورد</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">الاسم:</label>
                      <p className="text-sm text-gray-900">{supplierDetails.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">الهاتف:</label>
                      <p className="text-sm text-gray-900">{supplierDetails.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">معلومات الاتصال:</label>
                      <p className="text-sm text-gray-900">{supplierDetails.contactInfo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">نوع المورد:</label>
                      <p className="text-sm text-gray-900">
                        {supplierDetails.hasWholesalePrice ? 'جملة ومفرد' : 'مفرد فقط'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">نسبة المنصة:</label>
                      <p className="text-sm text-gray-900">
                        {(supplierDetails.platformPercentage * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">تاريخ الإنشاء:</label>
                      <p className="text-sm text-gray-900">
                        {new Date(supplierDetails.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-800">الإحصائيات</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">إجمالي المنتجات:</label>
                      <p className="text-sm text-gray-900">{supplierDetails.productsCount || 0}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">المنتجات النشطة:</label>
                      <p className="text-sm text-gray-900">{supplierDetails.activeProductsCount || 0}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">إجمالي الإيرادات:</label>
                      <p className="text-sm text-gray-900">
                        {(supplierDetails.totalRevenue || 0).toLocaleString()} د.ع
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">إجمالي الطلبات:</label>
                      <p className="text-sm text-gray-900">{supplierDetails.totalOrderItems || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profits Information */}
            {supplierProfits && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-4">معلومات الأرباح</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">إجمالي أرباح المنصة:</label>
                      <p className="text-sm text-gray-900">
                        {(supplierProfits.profitSummary?.totalPlatformProfit || 0).toLocaleString()} د.ع
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">إجمالي أرباح المورد:</label>
                      <p className="text-sm text-gray-900">
                        {(supplierProfits.profitSummary?.totalSupplierProfit || 0).toLocaleString()} د.ع
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">نسبة المنصة:</label>
                      <p className="text-sm text-gray-900">
                        {((supplierProfits.profitSummary?.platformPercentage || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">نوع المورد:</label>
                      <p className="text-sm text-gray-900">
                        {supplierProfits.profitSummary?.supplierType || 'غير محدد'}
                      </p>
                    </div>
                  </div>
                </div>

                {supplierProfits.profitBreakdown && supplierProfits.profitBreakdown.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">تفاصيل أرباح المنتجات:</h5>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              معرف المنتج
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              إجمالي المبيعات
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              عمولة المنصة
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              صافي أرباح المورد
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {supplierProfits.profitBreakdown.map((productProfit) => (
                            <tr key={productProfit.productId}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {productProfit.productId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {productProfit.totalSales.toLocaleString()} د.ع
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {productProfit.platformCommission.toLocaleString()} د.ع
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {productProfit.supplierNetProfit.toLocaleString()} د.ع
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">تأكيد الحذف</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف المورد "{selectedSupplier.name}"؟ 
              {selectedSupplier.productsCount > 0 && (
                <span className="block mt-2 text-red-600 text-sm">
                  تحذير: هذا المورد لديه {selectedSupplier.productsCount} منتج. 
                  يجب حذف أو إعادة تعيين المنتجات أولاً.
                </span>
              )}
            </p>

            <div className="flex justify-end space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteSupplier}
                disabled={isLoading || selectedSupplier.productsCount > 0}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  isLoading || selectedSupplier.productsCount > 0
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isLoading ? 'جاري الحذف...' : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage;