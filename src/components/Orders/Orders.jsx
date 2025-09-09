import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaStore, FaChartBar, FaUser, FaBox, FaTruck } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { BsEye } from 'react-icons/bs';
import axios from 'axios';

const API_BASE_URL = 'https://products-api.cbc-apps.net';

const getStatusClass = (status) => {
  switch (status) {
    case 'مدفوع':
    case 'مكتمل':
      return 'bg-green-100 text-green-800';
    case 'بانتظار الشحن':
    case 'قيد المعالجة':
      return 'bg-yellow-100 text-yellow-800';
    case 'ملغي':
    case 'مسترد':
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
    { status: 'جاهز للشحن', desc: 'الطلب تم تجهيزه وتأكيد الفاتورة، في انتظار شركة الشحن.' },
    { status: 'قيد التوصيل', desc: 'الطلب تم تسليمه لشركة الشحن مع إمكانية عرض رقم التتبع.' },
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-auto text-right mt-20" dir="rtl">
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
            <thead className="bg-gray-50 text-right">
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

const OrdersPage = () => {
  const [statsCards, setStatsCards] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [selectedPayment, setSelectedPayment] = useState('الكل');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');

  const statusOptions = ['الكل', 'قيد المعالجة', 'مكتمل', 'ملغي', 'بانتظار الشحن'];
  const paymentOptions = ['الكل', 'دفع عند الاستلام', 'مدفوع'];

  const token = localStorage.getItem('userToken');

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: 20
        }
      });
      const { orders, cards, pagination } = response.data;

      const formattedCards = [
        { title: 'إجمالي الطلبات', value: cards.totalOrders.toLocaleString(), icon: 'orders' },
        { title: 'إجمالي المبيعات', value: `${cards.totalSales.toLocaleString()} د.ع`, icon: 'sales' },
        { title: 'طلبات مستلمة', value: cards.receivedOrders.toLocaleString(), icon: 'received' },
        { title: 'طلبات مرفوضة', value: cards.rejectedOrders.toLocaleString(), icon: 'rejected' },
      ];

      setStatsCards(formattedCards);
      setOrdersData(orders);
      setPagination(pagination);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrder(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
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
  }, [currentPage]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setModalData([]);
  };

  const filteredOrders = ordersData.filter(order => {
    const statusMatch = selectedStatus === 'الكل' || order.status === selectedStatus;
    const paymentMatch = selectedPayment === 'الكل' || (selectedPayment === 'مدفوع' ? order.paymentMethod !== 'دفع عند الاستلام' : order.paymentMethod === selectedPayment);
    const searchMatch = searchText === '' || 
      order.orderId.toString().includes(searchText) ||
      order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      (order.productsSummary && order.productsSummary.toLowerCase().includes(searchText.toLowerCase()));
    
    return statusMatch && paymentMatch && searchMatch;
  });

  const getModalComponent = () => {
    if (selectedOrder) {
      return <OrderDetailsModal isOpen={isModalOpen} onClose={closeModal} order={selectedOrder} />;
    }
    if (modalData.length > 0) {
      return <GenericModal isOpen={isModalOpen} onClose={closeModal} title={modalTitle} data={modalData} hasProducts={modalTitle !== 'إجمالي الطلبات حسب التاجر'} />;
    }
    return null;
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
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <h3 className="text-lg font-bold">إدارة الطلبات</h3>
            <Dropdown
              options={statusOptions}
              selected={selectedStatus}
              onSelect={setSelectedStatus}
              placeholder="الكل"
            />
            <Dropdown
              options={paymentOptions}
              selected={selectedPayment}
              onSelect={setSelectedPayment}
              placeholder="الكل"
            />
          </div>
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-right">
              <tr>
                <Th>رقم الطلب</Th>
                <Th>العميل</Th>
                <Th>المنتجات</Th>
                <Th>الإجمالي</Th>
                <Th>الحالة</Th>
                <Th>الدفع</Th>
                <Th>تاريخ الطلب</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <Td>#{order.orderId}</Td>
                  <Td>{order.customerName}</Td>
                  <Td>
                    <ul className="list-none space-y-1">
                      <li className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 rounded-md flex-shrink-0 ml-1"></div>
                        <span className="text-gray-700">{order.productsSummary}</span>
                      </li>
                    </ul>
                  </Td>
                  <Td>{order.totalAmount} د.ع</Td>
                  <Td>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </Td>
                  <Td>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.paymentMethod)}`}>
                      {order.paymentMethod}
                    </span>
                  </Td>
                  <Td>{new Date(order.orderDate).toLocaleDateString('en-US')}</Td>
                  <Td>
                    <button onClick={() => fetchOrderDetails(order.orderId)} className="text-gray-500 hover:text-gray-700">
                      <BsEye className="text-xl" />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-gray-700">إجمالي المنتجات: {pagination.total}</span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-gray-500">
              أعرض في الصفحة {pagination.limit}
            </span>
            <div className="flex space-x-1 rtl:space-x-reverse">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md text-sm ${page === currentPage ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {getModalComponent()}
    </div>
  );
};

export default OrdersPage;