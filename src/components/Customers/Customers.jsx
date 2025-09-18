import React, { useState, useEffect } from 'react';
import { BsThreeDots, BsPerson } from 'react-icons/bs';
import { BiBlock } from 'react-icons/bi';
import { PiNotePencil } from 'react-icons/pi';
import { FaMagnifyingGlass, FaRegCalendarDays, FaRegNoteSticky, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import API_CONFIG, { apiCall } from '../../config/api';
import StatCard from '../Shared/StatCard';
import Dropdown from '../Shared/Dropdown';
import Pagination from '../Shared/Pagination';
import Modal from '../Shared/Modal';

const StatusBadge = ({ status }) => {
  const colorMap = {
    'نشط': 'bg-green-100 text-green-700',
    'موقوف': 'bg-yellow-100 text-yellow-700',
    'محظور': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[status]}`}>
      {status}
    </span>
  );
};

const Card = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg p-4 flex items-center justify-between text-right shadow-sm">
    <div className="flex flex-col">
      <span className="text-gray-400 text-xs mb-1">{title}</span>
      <p className="text-xl font-semibold mb-1">{value}</p>
    </div>
    <div className="bg-gray-100 p-2.5 rounded-full text-xl text-red-500">
      {icon}
    </div>
  </div>
);

const Th = ({ children, className = '' }) => (
  <th className={`p-3 font-semibold text-gray-500 ${className}`}>{children}</th>
);

const Td = ({ children }) => (
  <td className="p-3 text-xs text-gray-700">{children}</td>
);

const ActionModal = ({ customer, actionType, onClose, onConfirm }) => {
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState('low');

  if (!customer) return null;

  let title, confirmButtonText, confirmButtonColor, content;

  const handleConfirm = () => {
    if (actionType === 'addNote') {
      onConfirm(customer.customerId, actionType, { note, priority });
    } else {
      onConfirm(customer.customerId, actionType);
    }
  };

  if (actionType === 'edit') {
    title = 'تعديل الزبون';
    confirmButtonText = 'تعديل';
    confirmButtonColor = 'bg-blue-500 hover:bg-blue-600';
    content = <p className="text-gray-700 mb-6">هل أنت متأكد من تعديل بيانات {customer.customerName}؟</p>;
  } else if (actionType === 'ban') {
    title = 'حظر الزبون';
    confirmButtonText = 'حظر';
    confirmButtonColor = 'bg-red-500 hover:bg-red-600';
    content = <p className="text-gray-700 mb-6">هل أنت متأكد من حظر {customer.customerName}؟</p>;
  } else if (actionType === 'addNote') {
    title = 'إضافة ملاحظة';
    confirmButtonText = 'إضافة';
    confirmButtonColor = 'bg-green-500 hover:bg-green-600';
    content = (
      <div className="flex flex-col space-y-4 text-right">
        <label htmlFor="note" className="text-sm font-medium text-gray-700">الملاحظة:</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="4"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="اكتب ملاحظة جديدة..."
        />
        <label htmlFor="priority" className="text-sm font-medium text-gray-700">الأولوية:</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="low">منخفضة</option>
          <option value="medium">متوسطة</option>
          <option value="high">مرتفعة</option>
        </select>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full text-center shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <RiCloseFill size={24} />
          </button>
        </div>
        {content}
        <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${confirmButtonColor}`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

const Customers = () => {
  const [customersData, setCustomersData] = useState([]);
  const [statsCards, setStatsCards] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });

  const fetchCustomersData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      if (searchText) params.append('search', searchText);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const url = `${API_CONFIG.ADMIN.CUSTOMERS}?${params.toString()}`;
      const data = await apiCall(url);
      
      const formattedCards = [
        { title: 'إجمالي الزبائن', value: data.cards?.totalCustomers?.toLocaleString() || '0', icon: 'user' },
        { title: 'زبائن نشطين', value: data.cards?.activeCustomers?.toLocaleString() || '0', icon: 'user' },
        { title: 'زبائن محظورين', value: data.cards?.bannedCustomers?.toLocaleString() || '0', icon: 'block' },
        { title: 'زبائن مع طلبات', value: data.cards?.customersWithOrders?.toLocaleString() || '0', icon: 'orders' },
      ];

      setStatsCards(formattedCards);
      setCustomersData(data.customers || []);
      setPagination(data.pagination || {});

    } catch (error) {
      console.error('Error fetching customers data:', error);
      setStatsCards([]);
      setCustomersData([]);
      setPagination({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersData();
  }, [currentPage, searchText, selectedStatus]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };


  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.customerName || '',
      phone: customer.phone || '',
      email: '',
      password: ''
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedCustomer(null);
    setIsEditModalOpen(false);
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedCustomer(null);
    setIsDeleteModalOpen(false);
  };


  const openDetailsModal = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedCustomer(null);
    setIsDetailsModalOpen(false);
  };


  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone
      };
      
      const result = await apiCall(API_CONFIG.ADMIN.CUSTOMER_UPDATE(selectedCustomer?.customerId), {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      if (result.success) {
        alert(result.message || 'تم تحديث بيانات العميل بنجاح');
        fetchCustomersData();
        closeEditModal();
      } else {
        alert(result.message || 'حدث خطأ أثناء تحديث العميل');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('حدث خطأ أثناء تحديث العميل');
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      const result = await apiCall(API_CONFIG.ADMIN.CUSTOMER_DELETE(selectedCustomer?.customerId), {
        method: 'DELETE'
      });
      
      if (result.success) {
        alert(result.message || 'تم حذف العميل بنجاح');
        fetchCustomersData();
        closeDeleteModal();
      } else {
        alert(result.message || 'حدث خطأ أثناء حذف العميل');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('حدث خطأ أثناء حذف العميل');
    }
  };


  const handleBanCustomer = async (customer, banned) => {
    try {
      const result = await apiCall(API_CONFIG.ADMIN.CUSTOMER_BAN(customer.customerId), {
        method: 'PUT',
        body: JSON.stringify({ banned, reason: banned ? 'حظر من قبل الإدارة' : 'إلغاء حظر' })
      });
      
      if (result.success) {
        alert(result.message || (banned ? 'تم حظر العميل بنجاح' : 'تم إلغاء حظر العميل بنجاح'));
        fetchCustomersData();
      } else {
        alert(result.message || 'حدث خطأ أثناء تحديث حالة العميل');
      }
    } catch (error) {
      console.error('Error banning/unbanning customer:', error);
      alert('حدث خطأ أثناء تحديث حالة العميل');
    }
  };

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-right">إدارة المستخدمين</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 w-full md:w-auto">
            <input
              type="text"
              placeholder="ابحث عن مستخدم (الاسم، الهاتف، البريد الإلكتروني)"
              className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={searchText}
              onChange={handleSearchChange}
            />
            <FaMagnifyingGlass className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Dropdown
              options={[
                { value: 'all', label: 'جميع المستخدمين' },
                { value: 'active', label: 'نشط' },
                { value: 'banned', label: 'محظور' }
              ]}
              value={selectedStatus}
              onChange={handleStatusChange}
              placeholder="فلترة حسب الحالة"
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            <span className="mr-4 text-gray-600">جاري التحميل...</span>
          </div>
        ) : customersData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>لا توجد مستخدمين</p>
            <p className="text-sm mt-2">تحقق من الفلاتر أو جرب البحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الهاتف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عدد الطلبات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجمالي المصروفات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ التسجيل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-right">
                {customersData.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.customerId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.email || 'غير محدد'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.ordersCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.totalSpent ? `${customer.totalSpent.toLocaleString()} د.ع` : '0 د.ع'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <StatusBadge status={customer.status || 'نشط'} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.registrationDate ? new Date(customer.registrationDate).toLocaleDateString('ar-EG') : 'غير محدد'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetailsModal(customer)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-gray-100"
                          title="عرض التفاصيل"
                        >
                          <FaEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openEditModal(customer)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-gray-100"
                          title="تعديل"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleBanCustomer(customer, customer.status === 'محظور' ? false : true)}
                          className={`p-2 rounded-full hover:bg-gray-100 ${
                            customer.status === 'محظور' 
                              ? 'text-green-600 hover:text-green-900' 
                              : 'text-red-600 hover:text-red-900'
                          }`}
                          title={customer.status === 'محظور' ? 'إلغاء الحظر' : 'حظر'}
                        >
                          {customer.status === 'محظور' ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => openDeleteModal(customer)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-gray-100"
                          title="حذف"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}


      {/* Edit Customer Modal */}
      <Modal 
        isOpen={isEditModalOpen && selectedCustomer} 
        title={selectedCustomer ? `تعديل المستخدم: ${selectedCustomer.customerName || 'غير محدد'}` : ''} 
        onClose={closeEditModal}
      >
          <form onSubmit={handleUpdateCustomer}>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل:
                </label>
                <input
                  type="text"
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف:
                </label>
                <input
                  type="tel"
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-6">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                تحديث
              </button>
            </div>
          </form>
      </Modal>

      {/* Delete Customer Modal */}
      <Modal 
        isOpen={isDeleteModalOpen && selectedCustomer} 
        title="تأكيد الحذف" 
        onClose={closeDeleteModal}
      >
          <p className="text-gray-700 mb-4">
            هل أنت متأكد أنك تريد حذف المستخدم "{selectedCustomer?.customerName || 'غير محدد'}"؟
            هذا الإجراء لا يمكن التراجع عنه.
          </p>
          <div className="flex justify-end space-x-2 rtl:space-x-reverse">
            <button
              type="button"
              onClick={closeDeleteModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleDeleteCustomer}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              حذف
            </button>
          </div>
      </Modal>


      {/* Customer Details Modal */}
      <Modal 
        isOpen={isDetailsModalOpen && selectedCustomer} 
        title={selectedCustomer ? `تفاصيل المستخدم: ${selectedCustomer.customerName || 'غير محدد'}` : ''} 
        onClose={closeDetailsModal}
      >
          <div className="space-y-4 text-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>ID:</strong> {selectedCustomer?.customerId || 'غير محدد'}</p>
                <p><strong>الاسم:</strong> {selectedCustomer?.customerName || 'غير محدد'}</p>
                <p><strong>الهاتف:</strong> {selectedCustomer?.phone || 'غير محدد'}</p>
                <p><strong>البريد الإلكتروني:</strong> غير محدد</p>
              </div>
              <div>
                <p><strong>عدد الطلبات:</strong> {selectedCustomer?.ordersCount || 0}</p>
                <p><strong>إجمالي المصروفات:</strong> {selectedCustomer?.totalSpent ? `${selectedCustomer.totalSpent.toLocaleString()} د.ع` : '0 د.ع'}</p>
                <p><strong>الحالة:</strong> <StatusBadge status={selectedCustomer?.status || 'نشط'} /></p>
                <p><strong>تاريخ التسجيل:</strong> {selectedCustomer?.registrationDate ? new Date(selectedCustomer.registrationDate).toLocaleDateString('ar-EG') : 'غير محدد'}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={closeDetailsModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              إغلاق
            </button>
          </div>
      </Modal>
    </div>
  );
};

export default Customers;
