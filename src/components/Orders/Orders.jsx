import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaStore, FaChartBar, FaUser, FaBox, FaTruck, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { BsEye } from 'react-icons/bs';
import axios from 'axios';
import API_CONFIG, { apiCall } from '../../config/api';
import * as XLSX from 'xlsx';

const getStatusClass = (status) => {
  switch (status) {
    case 'مدفوع':
    case 'مكتمل':
    case 'تم التوصيل':
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    
    // الحالات الصفراء (PROCESSING / DELIVERING / SHIPPED)
    case 'PROCESSING':
    case 'DELIVERING': 
    case 'SHIPPED':
    case 'قيد المعالجة':
    case 'جاهز للشحن': // القيمة العربية الجديدة لـ DELIVERING
    case 'شُحنت': // القيمة العربية الجديدة لـ SHIPPED
      return 'bg-yellow-100 text-yellow-800';
      
    case 'ملغي':
    case 'مسترد':
    case 'CANCELLED':
    case 'RETURNED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const StatCard = ({ title, value, icon, onClick }) => {
  const icons = {
    'orders': <div className="bg-gray-100 p-3 rounded-xl"><FaChartBar className="text-red-500 text-2xl" /></div>,
    'sales': <div className="bg-gray-100 p-3 rounded-xl"><FaChartBar className="text-red-500 text-2xl" /></div>,
    'received': <div className="bg-gray-100 p-3 rounded-xl"><FaBox className="text-red-500 text-2xl" /></div>,
    'rejected': <div className="bg-gray-100 p-3 rounded-xl"><RiCloseFill className="text-red-500 text-2xl" /></div>,
  };

  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between text-right cursor-pointer hover:shadow-lg transition-shadow">
      <div className="flex flex-col">
        <span className="text-gray-400 text-xs mb-1">{title}</span>
        <p className="text-xl font-bold mb-1 text-gray-800">{value}</p>
        <span className="text-xs text-green-500 flex items-center">
          <FaChevronDown className="transform rotate-180 text-green-500 ml-1" />
          8%
          <span className="text-gray-400 mr-1">عن الفترة السابقة</span>
        </span>
      </div>
      {icons[icon]}
    </div>
  );
};

const Th = ({ children, className = '' }) => (
  <th className={`p-3 font-semibold text-gray-500 ${className}`}>{children}</th>
);

const Td = ({ children }) => (
  <td className="p-3 text-sm text-gray-700">{children}</td>
);

const Dropdown = ({ options, selected, onSelect, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownOptions = options.includes('الكل') ? options : ['الكل', ...options];

  return (
    <div className={`relative ${className}`} dir="rtl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-lg flex items-center justify-between transition ${isOpen ? 'border-red-500' : 'border-gray-300'}`}
      >
        <span>{selected || placeholder}</span>
        <FaChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
          {dropdownOptions.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`w-full text-right px-4 py-2 text-sm ${option === selected ? 'bg-red-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const orderTimeline = order.orderTimeline.map(item => ({
    status: item.status,
    desc: item.status,
    completed: true,
  }));

  const timelineSteps = [
    { status: 'قيد المعالجة', desc: 'الطلب قيد المراجعة من قبل التاجر وفريق الدعم.' },
    { status: 'جاهز للشحن', desc: 'الطلب تم تجهيزه وتأكيد الفاتورة.' }, // مطابق لحالة DELIVERING
    { status: 'شُحنت', desc: 'الطلب تم تسليمه لشركة الشحن، وهو قيد التوصيل مع إمكانية عرض رقم التتبع.' }, // مطابق لحالة SHIPPED
    { status: 'تم التوصيل', desc: 'الطلب وصل إلى العميل بنجاح.' },
    { status: 'ملغي', desc: 'تم إلغاء الطلب بناء على طلب العميل.' }
  ];

  const fullTimeline = timelineSteps.map(step => {
    const fetchedStep = orderTimeline.find(item => item.status === step.status);
    return {
      ...step,
      completed: !!fetchedStep,
    };
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-auto text-right mt-20" dir="rtl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            تفاصيل الطلب #{order.orderId}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <RiCloseFill size={24} />
          </button>
        </div>

        <div className="space-y-6 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-gray-500 flex items-center">
                <FaStore className="ml-2" />
                التاجر
              </span>
              <p className="font-bold text-gray-800">{order.merchantName}</p>
              <p className="text-gray-500">{order.customerPhone}</p>
            </div>
            <div>
              <span className="text-gray-500 flex items-center">
                <FaUser className="ml-2" />
                العميل
              </span>
              <p className="font-bold text-gray-800">{order.customerName}</p>
              <p className="text-gray-500">{order.shippingAddress || 'لا يوجد عنوان'}</p>
            </div>
          </div>

          <hr />

          <div>
            <span className="text-gray-500 flex items-center">
                <FaBox className="ml-2" />
                المنتجات
            </span>
            <ul className="list-none mt-2 space-y-2 max-h-48 overflow-y-auto pr-2">
              {order.products.map((product, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-gray-200 rounded-md flex-shrink-0 ml-2"></div>
                  <span>{product.productName} ×{product.quantity}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr />

          <div>
            <span className="text-gray-500 flex items-center">
                <FaTruck className="ml-2" />
                شركة الشحن
            </span>
            <p className="font-bold text-gray-800 mt-2">{order.shippingCompany || 'لم يتم التحديد'}</p>
          </div>

          <hr />

          <div className="space-y-4 ml-10">
            <h4 className="text-base font-bold text-gray-800 mb-2">خط سير الطلب</h4>
            <div className="relative border-r-2 border-gray-200 pr-4 space-y-4 max-h-64 overflow-y-auto">
              {fullTimeline.map((step, index) => (
                <div key={index} className="relative">
                  <span
                    className={`absolute top-0 right-[-25px] h-4 w-4 rounded-full ${
                      step.completed ? "bg-red-500" : "bg-gray-300"
                    } border-2 border-white`}
                  ></span>
                  <p className="font-semibold text-gray-800">{step.status}</p>
                  <p className="text-xs text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="text-gray-500">ملاحظات</label>
              <p className="font-bold text-gray-800">{order.notes || 'لا يوجد ملاحظات'}</p>
            </div>
            <div>
              <label className="text-gray-500">الدفع</label>
              <p className="font-bold text-gray-800">{order.paymentMethod}</p>
            </div>
            <div>
              <label className="text-gray-500">الحالة</label>
              <p className="font-bold text-gray-800">{order.status}</p>
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-500">تاريخ الطلب</label>
              <p className="font-bold text-gray-800">{new Date(order.orderDate).toLocaleDateString('en-US')}</p>
            </div>
            {order.deliveryDate && (
              <div>
                <label className="text-gray-500">تاريخ الاستلام</label>
                <p className="font-bold text-gray-800">{new Date(order.deliveryDate).toLocaleDateString('en-US')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GenericModal = ({ isOpen, onClose, title, data, hasProducts = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-auto text-right mt-20" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <RiCloseFill size={24} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 t  ext-right">
              <tr>
                <Th>رقم الطلب</Th>
                <Th>العميل</Th>
                {hasProducts && <Th>المنتجات</Th>}
                <Th>الإجمالي</Th>
                <Th>التاريخ</Th>
                <Th>الحالة</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {data.map((item, index) => (
                <tr key={index}>
                  <Td>#{item.orderId}</Td>
                  <Td>{item.customerName}</Td>
                  {hasProducts && (
                    <Td>
                      <ul className="list-none space-y-1">
                        <li className="flex items-center">
                          <div className="w-4 h-4 bg-gray-200 rounded-md flex-shrink-0 ml-1"></div>
                          <span className="text-gray-700">{item.productsSummary}</span>
                        </li>
                      </ul>
                    </Td>
                  )}
                  <Td>{item.totalAmount} د.ع</Td>
                  <Td>{new Date(item.orderDate).toLocaleDateString('en-US')}</Td>
                  <Td>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, order, onConfirm }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-4 text-right" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            تأكيد حذف الطلب
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <RiCloseFill size={24} />
          </button>
        </div>
        
        <p className="text-gray-700 mb-6">
          هل أنت متأكد من حذف الطلب رقم <span className="font-bold">#{order.orderId}</span> الخاص بالعميل <span className="font-bold">{order.customerName}</span>؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        
        <div className="flex justify-end space-x-4 rtl:space-x-reverse">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={() => onConfirm(order.orderId)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            حذف الطلب
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusUpdateModal = ({ isOpen, onClose, orderToUpdate, newStatus, setNewStatus, handleStatusUpdate, statusOptions }) => {
  if (!isOpen || !orderToUpdate) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 text-right" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            تحديث حالة الطلب #{orderToUpdate.orderId}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <RiCloseFill size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحالة الحالية: <span className="font-bold">{orderToUpdate.status}</span>
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              dir="rtl"
            >
              <option value="">اختر الحالة الجديدة</option>
              {statusOptions.filter(opt => opt.value !== 'ALL').map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-4 rtl:space-x-reverse">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={!newStatus}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              تحديث الحالة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const OrdersPage = () => {
  const [statsCards, setStatsCards] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPayment, setSelectedPayment] = useState('الكل');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const statusOptions = [
    { value: 'ALL', label: 'الكل' },
    { value: 'PROCESSING', label: 'قيد المعالجة' },
    { value: 'DELIVERING', label: 'جاهز للشحن' }, // DELIVERING = جاهز للشحن
    { value: 'SHIPPED', label: 'شُحنت' }, // SHIPPED = شُحنت
    { value: 'DELIVERED', label: 'تم التوصيل' },
    { value: 'CANCELLED', label: 'ملغي' },
    { value: 'RETURNED', label: 'مسترد' }
  ];
  
  // خريطة للحالات العربية القديمة أو غير المرغوب فيها لإجبارها على القيمة الجديدة
  const legacyArabicStatusMap = {
    'قيد التوصيل': 'جاهز للشحن', // تصحيح إلزامي: أي قيمة 'قيد التوصيل' ستصبح 'جاهز للشحن'
  };

  // دالة مساعدة لترجمة قيمة الحالة الإنجليزية/العربية القديمة إلى العربية الجديدة للعرض في الجدول
  const getArabicStatusLabel = (statusValue) => {
    // 1. محاولة مطابقة القيمة الإنجليزية (مثل DELIVERING) وإرجاع الترجمة الجديدة (جاهز للشحن)
    const translatedStatus = statusOptions.find(opt => opt.value === statusValue)?.label;
    if (translatedStatus) return translatedStatus;
    
    // 2. إذا كانت القيمة عربية قديمة وغير مرغوب فيها، يتم فرض الترجمة الجديدة
    if (legacyArabicStatusMap[statusValue]) return legacyArabicStatusMap[statusValue];

    // 3. إذا لم يتم العثور على ترجمة (قد تكون القيمة عربية صحيحة أو حالة جديدة غير معروفة)، يتم إرجاعها كما هي
    return statusValue;
  };
  
  const paymentOptions = ['الكل', 'دفع عند الاستلام', 'مدفوع'];

  const token = localStorage.getItem('token') || 'test-token';
  
  const getDeleteOrderUrl = (orderId) => {
    return `/orders/admin/${orderId}`; 
  };
  
  const getUpdateOrderStatusUrl = (orderId) => {
    return `/admin/dashboard/orders/${orderId}/status`; 
  };

  const getUpdateOrderVisibilityUrl = (orderId) => {
    return `/orders/admin/${orderId}/visibility`;
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      
      const url = `${API_CONFIG.ADMIN.ORDERS}?${params.toString()}`;
      
      const data = await apiCall(url);
      const { orders, cards, pagination } = data;

      const formattedCards = [
        { title: 'إجمالي الطلبات', value: cards.totalOrders?.toLocaleString() || '0', icon: 'orders' },
        { title: 'إجمالي المبيعات', value: `${cards.totalSales?.toLocaleString() || '0'} د.ع`, icon: 'sales' },
        { title: 'طلبات مستلمة', value: cards.deliveredOrders?.toLocaleString() || '0', icon: 'received' },
        { title: 'طلبات مرفوضة', value: cards.cancelledOrders?.toLocaleString() || '0', icon: 'rejected' },
      ];

      setStatsCards(formattedCards);
      setOrdersData(orders || []);
      setPagination(pagination || {});
    } catch (error) {
      setStatsCards([]);
      setOrdersData([]);
      setPagination({});
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const data = await apiCall(API_CONFIG.ADMIN.ORDER_DETAILS(orderId));
      setSelectedOrder(data);
      setIsModalOpen(true);
    } catch (error) {
    }
  };

  const openStatModal = (cardIcon) => {
    let title = '';
    let data = [];
    switch (cardIcon) {
      case 'orders':
        title = 'إجمالي الطلبات';
        data = ordersData;
        break;
      case 'sales':
        title = 'إجمالي المبيعات';
        data = ordersData;
        break;
      case 'received':
        title = 'طلبات مستلمة';
        data = ordersData.filter(order => order.status === 'مكتمل');
        break;
      case 'rejected':
        title = 'طلبات مرفوضة';
        data = ordersData.filter(order => order.status === 'ملغي');
        break;
      default:
        return;
    }
    setModalTitle(title);
    setModalData(data);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentPage, selectedStatus, dateFrom, dateTo]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setModalData([]);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const openDeleteModal = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOrder = async (orderId) => {
    setIsLoading(true);
    closeDeleteModal();
    try {
      await apiCall(getDeleteOrderUrl(orderId), { method: 'DELETE' });

      alert(`تم حذف الطلب رقم ${orderId} بنجاح.`);
      fetchDashboardData();
    } catch (error) {
      alert('حدث خطأ أثناء محاولة حذف الطلب.');
      setIsLoading(false);
    }
  };
  
  const closeStatusUpdateModal = () => {
    setIsStatusUpdateModalOpen(false);
    setOrderToUpdate(null);
    setNewStatus('');
  }

  const handleStatusUpdate = async () => {
    if (!orderToUpdate || !newStatus) return;
    
    closeStatusUpdateModal();
    setIsLoading(true);
    
    try {
      const url = getUpdateOrderStatusUrl(orderToUpdate.orderId);
      const payload = { status: newStatus }; 
      
      await apiCall(url, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      alert('تم تحديث حالة الطلب بنجاح');
      
      if (selectedStatus !== 'ALL' && selectedStatus !== newStatus) {
        setSelectedStatus('ALL');
        setCurrentPage(1);
      } else {
        fetchDashboardData();
      }
    } catch (error) {
      alert('حدث خطأ في تحديث حالة الطلب');
      setIsLoading(false);
    }
  };

  const openStatusUpdateModal = (order) => {
    setOrderToUpdate(order);
    // عند فتح المودال، نستخدم القيمة الإنجليزية الفعلية للحالة لوضعها كـ newStatus
    const currentStatusValue = statusOptions.find(opt => opt.label === order.status || opt.value === order.status)?.value || '';
    setNewStatus(currentStatusValue); 
    setIsStatusUpdateModalOpen(true);
  };

  const handleVisibilityToggle = async (orderId, currentVisibility) => {
    const newVisibility = !currentVisibility;
    setIsLoading(true);
    
    try {
      const url = getUpdateOrderVisibilityUrl(orderId);
      const payload = { isVisibleToSupplier: newVisibility }; 
      
      await apiCall(url, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      alert(`تم ${newVisibility ? 'إظهار' : 'إخفاء'} الطلب رقم ${orderId} للتاجر بنجاح.`);
      fetchDashboardData();
    } catch (error) {
      alert('حدث خطأ في تحديث رؤية الطلب.');
      setIsLoading(false);
    }
  };


  const filteredOrders = ordersData.filter(order => {
    const paymentMatch = selectedPayment === 'الكل' || (selectedPayment === 'مدفوع' ? order.paymentMethod !== 'دفع عند الاستلام' : order.paymentMethod === selectedPayment);
    const searchMatch = searchText === '' || 
      order.orderId?.toString().includes(searchText) ||
      order.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
      (order.productsSummary && order.productsSummary.toLowerCase().includes(searchText.toLowerCase()));
    
    return paymentMatch && searchMatch;
  });

  const getModalComponent = () => {
    if (selectedOrder) {
      return <OrderDetailsModal isOpen={isModalOpen} onClose={closeModal} order={selectedOrder} />;
    }
    if (modalData.length > 0) {
      // NOTE: We rely on the API to return translated status for modalData, or the Statuses would be English values. 
      // For now, we rely on the implementation of getStatusClass to handle English values for color coding.
      return <GenericModal isOpen={isModalOpen} onClose={closeModal} title={modalTitle} data={modalData} hasProducts={modalTitle !== 'إجمالي الطلبات حسب التاجر'} />;
    }
    return null;
  };

  const exportToExcel = () => {
    if (ordersData.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

    const exportData = ordersData.map(order => ({
      'رقم الطلب': order.orderId,
      'العميل': order.customerName,
      'هاتف العميل': order.customerPhone || 'لا يوجد',
      'التاجر': order.merchantName,
      'ملخص المنتجات': order.productsSummary || 'لا يوجد',
      'الإجمالي (د.ع)': order.totalAmount?.toLocaleString() || '0',
      'حالة الطلب': getArabicStatusLabel(order.status), // تطبيق الترجمة هنا أيضاً
      'طريقة الدفع': order.paymentMethod,
      'تاريخ الطلب': order.orderDate ? new Date(order.orderDate).toLocaleDateString('ar-EG') : 'غير محدد',
      'مرئي للتاجر': order.isVisibleToSupplier ? 'نعم' : 'لا',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    worksheet['!cols'] = [
      { wch: 15 }, 
      { wch: 25 }, 
      { wch: 20 }, 
      { wch: 25 }, 
      { wch: 40 }, 
      { wch: 20 }, 
      { wch: 15 }, 
      { wch: 15 }, 
      { wch: 20 }, 
      { wch: 15 }, 
    ];
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'الطلبات');

    XLSX.writeFile(workbook, 'Orders_Report.xlsx');
  };
  
  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-right">إدارة الطلبات</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((card, index) => (
          <StatCard key={index} {...card} onClick={() => openStatModal(card.icon)} />
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 rtl:space-x-reverse flex-wrap">
            <h3 className="text-lg font-bold ml-4">إدارة الطلبات</h3>
            <Dropdown
              options={statusOptions.map(opt => opt.label)}
              selected={statusOptions.find(opt => opt.value === selectedStatus)?.label || 'الكل'}
              onSelect={(label) => {
                const option = statusOptions.find(opt => opt.label === label);
                setSelectedStatus(option ? option.value : 'ALL');
                setCurrentPage(1);
              }}
              placeholder="الكل"
            />
            <Dropdown
              options={paymentOptions}
              selected={selectedPayment}
              onSelect={(value) => {
                setSelectedPayment(value);
                setCurrentPage(1);
              }}
              placeholder="الكل"
            />
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="date"
                placeholder="من تاريخ"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <input
                type="date"
                placeholder="إلى تاريخ"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              disabled={isLoading || ordersData.length === 0}
            >
              <FaBox className="ml-2" />
              تصدير إلى الإكسل
            </button>
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="ابحث برقم الطلب / العميل / المنتج"
                className="w-full md:w-80 px-4 py-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-800 placeholder-gray-400"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            <span className="mr-4 text-gray-600">جاري التحميل...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>لا توجد طلبات</p>
            <p className="text-sm mt-2">تحقق من الفلاتر أو جرب البحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-right">
                <tr>
                  <Th>رقم الطلب</Th>
                  <Th>العميل</Th>
                  <Th>التاجر</Th>
                  <Th>المنتجات</Th>
                  <Th>الإجمالي</Th>
                  <Th>الحالة</Th>
                  <Th>الدفع</Th>
                  <Th>تاريخ الطلب</Th>
                  <Th>رؤية التاجر</Th>
                  <Th>الإجراءات</Th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-right">
                {filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <Td>#{order.orderId}</Td>
                      <Td>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-xs text-gray-500">{order.customerPhone}</div>
                        </div>
                      </Td>
                      <Td>{order.merchantName}</Td>
                      <Td>
                        <ul className="list-none space-y-1">
                          <li className="flex items-center">
                            <div className="w-4 h-4 bg-gray-200 rounded-md flex-shrink-0 ml-1"></div>
                            <span className="text-gray-700">{order.productsSummary || 'لا توجد تفاصيل'}</span>
                          </li>
                        </ul>
                      </Td>
                      <Td>{order.totalAmount?.toLocaleString() || '0'} د.ع</Td>
                      <Td>
                        {/* استخدام الدالة المساعدة لعرض الترجمة العربية الجديدة مع التصحيح الإلزامي */}
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(getArabicStatusLabel(order.status))}`}>
                          {getArabicStatusLabel(order.status)} 
                        </span>
                      </Td>
                      <Td>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.paymentMethod)}`}>
                          {order.paymentMethod}
                        </span>
                      </Td>
                      <Td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString('ar-EG') : 'غير محدد'}</Td>
                      <Td>
                          <button
                              onClick={() => handleVisibilityToggle(order.orderId, order.isVisibleToSupplier)}
                              className={`p-1 rounded-full transition-colors ${order.isVisibleToSupplier ? 'text-green-600 hover:bg-green-100' : 'text-red-600 hover:bg-red-100'}`}
                              title={order.isVisibleToSupplier ? 'إخفاء عن التاجر' : 'إظهار للتاجر'}
                          >
                              {order.isVisibleToSupplier ? <FaEye className="text-lg" /> : <FaEyeSlash className="text-lg" />}
                          </button>
                      </Td>
                      <Td>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <button 
                            onClick={() => fetchOrderDetails(order.orderId)} 
                            className="text-gray-500 hover:text-gray-700 p-1"
                            title="عرض التفاصيل"
                          >
                            <BsEye className="text-lg" />
                          </button>
                          <button 
                            onClick={() => openStatusUpdateModal(order)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                            title="تحديث الحالة"
                          >
                            <FaEdit className="text-lg" /> 
                          </button>
                          <button 
                            onClick={() => openDeleteModal(order)} 
                            className="text-red-500 hover:text-red-700 p-1"
                            title="حذف الطلب"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-gray-700">إجمالي الطلبات: {pagination.total}</span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md transition-colors ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              السابق
            </button>
            <span className="px-3 py-1 text-sm bg-gray-200 rounded-md">
              الصفحة {currentPage} من {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className={`px-4 py-2 rounded-md transition-colors ${currentPage === pagination.totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              التالي
            </button>
          </div>
        </div>
      </div>
      {getModalComponent()}
      
      <StatusUpdateModal 
        isOpen={isStatusUpdateModalOpen}
        onClose={closeStatusUpdateModal}
        orderToUpdate={orderToUpdate}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        handleStatusUpdate={handleStatusUpdate}
        statusOptions={statusOptions}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        order={orderToDelete}
        onConfirm={handleDeleteOrder}
      />
    </div>
  );
};

export default OrdersPage;