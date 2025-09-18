import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  X,
  CheckCircle,
  Inbox,
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";
import API_CONFIG, { apiCall } from '../../config/api';

const DetailsModal = ({ isOpen, onClose, title, data }) => {
  const modalRef = useRef();

  // دالة لإغلاق الموديل عند النقر خارج حدوده
  const handleClickOutside = useCallback((event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  if (!isOpen) return null;

  const headerMap = {
    "status": "الحالة",
    "count": "العدد",
    "percentage": "النسبة %",
    "totalAmount": "المبلغ الإجمالي",
    "averageOrderValue": "متوسط قيمة الطلب",
    "merchant": "التاجر",
    "totalSales": "إجمالي المبيعات",
    "orders": "الطلبات",
    "profit": "صافي الأرباح",
    "productName": "اسم المنتج",
    "sales": "المبيعات",
    "conversionRate": "معدل التحويل",
    "visits": "الزيارات",
    "addToCart": "أضيف إلى السلة",
    "stock": "المخزون",
    "merchantName": "اسم التاجر",
    "lastVisit": "آخر زيارة",
    "customerName": "اسم العميل",
    "reviewDate": "تاريخ المراجعة",
    "comment": "التعليق",
    "rating": "التقييم",
    "orderId": "رقم الطلب",
    "attentionReason": "سبب الانتباه",
    "daysSinceCreation": "عدد الأيام",
    "merchantId": "معرف التاجر",
    "storeName": "اسم المتجر",
    "registrationDate": "تاريخ التسجيل",
    "productsCount": "عدد المنتجات",
    "ordersCount": "عدد الطلبات",
  };

  const headers = data && data.length > 0
    ? Object.keys(data[0]).map(key => headerMap[key] || key)
    : [];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 h-full w-full flex justify-center items-center z-50">
      <div ref={modalRef} className="relative bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 p-6 max-h-[80vh] overflow-y-scroll" dir="rtl">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center pb-3 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-4">
          {data && Array.isArray(data) && data.length > 0 ? (
            <table className="w-full text-right table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  {headers.map((header, index) => (
                    <th key={index} className="px-4 py-2 text-sm font-medium text-gray-500">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    {Object.keys(item).map((key, idx) => {
                      let value = item[key];
                      if (key === "conversionRate") {
                        value = `${value.toFixed(2)}%`;
                      } else if (key === "reviewDate" || key === "lastVisit" || key === "registrationDate") {
                        value = new Date(value).toLocaleDateString();
                      } else if (key === "totalAmount" || key === "totalSales" || key === "profit") {
                        value = `${value.toLocaleString()} د.ع`;
                      }
                      return <td key={idx} className="px-4 py-4 text-sm font-medium text-gray-900">{value}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center p-4 text-sm text-gray-500">لا توجد تفاصيل لعرضها.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 text-right" dir="rtl">
        <p className="text-sm font-bold text-gray-900">{`الأسبوع: ${data.weekLabel}`}</p>
        <p className="text-sm text-gray-700 mt-2">
          <span className="font-semibold text-green-600">تم التوصيل:</span> {data.delivered}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-yellow-600">قيد المعالجة:</span> {data.processing}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-blue-600">قيد التوصيل:</span> {data.delivering}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-red-600">ملغي:</span> {data.cancelled}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-600">مرتجع:</span> {data.returned}
        </p>
      </div>
    );
  }

  return null;
};

const HomePage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTable, setActiveTable] = useState('performance');

  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const toggleNotifications = useCallback(() => setIsNotificationsOpen(prev => !prev), []);

  const openDetailsModal = useCallback(async (cardType) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('userToken');

    if (!token) {
      setError('خطأ: لم يتم العثور على توكن المصادقة. يرجى تسجيل الدخول.');
      setIsLoading(false);
      return;
    }

    const endpointMap = {
      'total-sales': 'total-sales',
      'app-revenue': 'app-revenue',
      'registered-merchants': 'merchants',
      'return-rate': 'return-rate',
      'total-orders': 'total-orders',
      'avg-processing-time': 'processing-time'
    };

    const endpoint = endpointMap[cardType];
    if (!endpoint) {
      setError('نوع البطاقة غير صالح.');
      setIsLoading(false);
      return;
    }

    try {
      const rawData = await apiCall(API_CONFIG.ADMIN.OVERVIEW_DETAILS(endpoint));
      const detailsData = rawData.details || rawData;

      const titleMap = {
        'total-sales': "تفاصيل إجمالي المبيعات",
        'app-revenue': "تفاصيل أرباح التطبيق",
        'merchants': "تفاصيل التجار المسجلين",
        'return-rate': "تفاصيل معدل الإرجاع",
        'total-orders': "تفاصيل إجمالي الطلبات",
        'processing-time': "تفاصيل متوسط وقت المعالجة",
      };
      
      setModalData(detailsData);
      setModalTitle(titleMap[endpoint]);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setError('خطأ: لم يتم العثور على توكن المصادقة. يرجى تسجيل الدخول.');
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiCall(API_CONFIG.ADMIN.OVERVIEW);
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-red-600">خطأ: {error}</p>
      </div>
    );
  }

  const {
    cards,
    monthlyOrderStatus,
    salesTimeline,
    topPerformingProducts,
    mostVisitedProducts,
    abandonedProducts,
    ordersNeedingAttention,
    customerReviews,
    totalProducts,
  } = dashboardData;

  const barChartData = monthlyOrderStatus.map(item => ({
    name: item.weekLabel,
    processing: item.processing,
    delivering: item.delivering,
    delivered: item.delivered,
    cancelled: item.cancelled,
    returned: item.returned
  }));

  const areaChartData = salesTimeline.map(item => ({
    name: item.month,
    value: item.sales
  }));

  const ProductsPerformanceTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-right">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="pb-3 text-sm font-medium text-gray-500">المنتج</th>
            <th className="pb-3 text-sm font-medium text-gray-500">الزيارات</th>
            <th className="pb-3 text-sm font-medium text-gray-500">الإضافة للسلة</th>
            <th className="pb-3 text-sm font-medium text-gray-500">التحويل %</th>
            <th className="pb-3 text-sm font-medium text-gray-500">المبيعات</th>
            <th className="pb-3 text-sm font-medium text-gray-500">المخزون</th>
            <th className="pb-3 text-sm font-medium text-gray-500">التاجر</th>
          </tr>
        </thead>
        <tbody>
          {topPerformingProducts.map((item, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-4 text-sm font-medium text-gray-900">{item.productName}</td>
              <td className="py-4 text-sm text-gray-900">{item.visits}</td>
              <td className="py-4 text-sm text-gray-900">{item.addToCart}</td>
              <td className="py-4 text-sm text-gray-900">{item.conversionRate.toFixed(2)}%</td>
              <td className="py-4 text-sm text-gray-900">{item.sales.toLocaleString()}</td>
              <td className="py-4 text-sm text-gray-900">{item.stock}</td>
              <td className="py-4 text-sm text-gray-900">{item.merchantName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ProductsVisitedTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-right divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              المبيعات
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              التحويل %
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإضافة للسلة
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              الزيارات
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              المنتج
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mostVisitedProducts.map((product, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.sales.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.conversionRate.toFixed(2)}%</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.addToCart}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.visits.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                <div className="flex items-center justify-end">
                  <span>{product.productName}</span>
                  {product.imageUrl && (
                    <img className="h-8 w-8 mr-2 rounded-lg" src={product.imageUrl} alt={product.productName} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const AbandonedProductsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-right divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              الحالة
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              آخر زيارة
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإضافة للسلة
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              المنتج
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {abandonedProducts.map((product, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 text-right font-bold">{product.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{new Date(product.lastVisit).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.addToCart}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                <div className="flex items-center justify-end">
                  <span>{product.productName}</span>
                  {product.imageUrl && (
                    <img className="h-8 w-8 mr-2 rounded-lg" src={product.imageUrl} alt={product.productName} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-6 relative">
          <div className="relative">
            <button onClick={toggleNotifications} className="relative">
              <Inbox className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              <span className="absolute -top-1 -right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {isNotificationsOpen && (
              <div className="absolute left-0 mt-2 w-full max-w-sm sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">
                    الإشعارات
                  </h3>
                  <button onClick={toggleNotifications}>
                    <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <span className="text-sm text-gray-500">
                    لديك {ordersNeedingAttention.filter(n => n.attentionReason).length} إشعارات غير مقروءة
                  </span>
                  <button className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>تحديد الكل كمقروء</span>
                  </button>
                </div>
                <div className="py-2 max-h-96 overflow-y-auto">
                  {ordersNeedingAttention.map((notification) => (
                    <Link
                      key={notification.orderId}
                      to={`/orders/${notification.orderId}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-b border-gray-100"
                      onClick={toggleNotifications}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          طلب جديد #{notification.orderId}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {notification.attentionReason}
                        </p>
                      </div>
                      <div className="relative flex-shrink-0">
                        <Bell className="w-4 h-4 text-gray-400" />
                        <span className="absolute -top-1 -right-1 block w-2 h-2 bg-yellow-400 rounded-full"></span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all duration-300 active:overflow-hidden" onClick={() => openDetailsModal('app-revenue')}>
            <div className="flex items-start justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">أرباح التطبيق</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{cards.appRevenue.toLocaleString()} د.ع</h3>
                <div className="flex items-center text-green-500 text-sm">
                  <span className="mr-1">↗</span>
                  <span>+0% عن الفترة السابقة</span>
                </div>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all duration-300 active:overflow-hidden" onClick={() => openDetailsModal('registered-merchants')}>
            <div className="flex items-start justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">التجار المسجلون</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{cards.details}</h3>
                <div className="flex items-center text-green-500 text-sm">
                  <span className="mr-1">↗</span>
                  <span>+0% عن الفترة السابقة</span>
                </div>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all duration-300 active:overflow-hidden" onClick={() => openDetailsModal('total-sales')}>
            <div className="flex items-start justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">إجمالي المبيعات</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{cards.totalSales.toLocaleString()} د.ع</h3>
                <div className="flex items-center text-green-500 text-sm">
                  <span className="mr-1">↗</span>
                  <span>+0% عن الفترة السابقة</span>
                </div>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V4m0 16v-4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all duration-300 active:overflow-hidden" onClick={() => openDetailsModal('return-rate')}>
            <div className="flex items-start justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">معدل الإرجاع</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{cards.returnRate}%</h3>
                <div className="flex items-center text-green-500 text-sm">
                  <span className="mr-1">↗</span>
                  <span>+0% عن الفترة السابقة</span>
                </div>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all duration-300 active:overflow-hidden" onClick={() => openDetailsModal('total-orders')}>
            <div className="flex items-start justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">الطلبات</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{cards.totalOrders}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>قيد الشحن {monthlyOrderStatus.find(o => o.weekLabel === 'الأسبوع الأول')?.delivering || 0}</span>
                  <span>مكتمل {monthlyOrderStatus.find(o => o.weekLabel === 'الأسبوع الرابع')?.delivered || 0}</span>
                  <span>ملغي {monthlyOrderStatus.find(o => o.weekLabel === 'الأسبوع الأول')?.cancelled || 0}</span>
                </div>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all duration-300 active:overflow-hidden" onClick={() => openDetailsModal('avg-processing-time')}>
            <div className="flex items-start justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">زمن التجهيز (متوسط)</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{cards.avgProcessingTime} دقيقة</h3>
                <div className="flex items-center text-red-500 text-sm">
                  <span className="mr-1">↘</span>
                  <span>-0% عن الفترة السابقة</span>
                </div>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">من</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <span className="text-sm text-gray-500">إلى</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">حالة طلبات هذا الشهر</h2>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2 text-sm">
                {monthlyOrderStatus.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#1e40af' }}></div>
                    <span className="text-gray-600">{item.weekLabel}</span>
                    <span className="font-medium">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} content={<CustomTooltip />} />
                <Bar dataKey="delivered" name="تم التوصيل" radius={[4, 4, 0, 0]} barSize={40}>
                    {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#10b981" />
                    ))}
                </Bar>
                <Bar dataKey="processing" name="قيد المعالجة" radius={[4, 4, 0, 0]} barSize={40}>
                    {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#fcd34d" />
                    ))}
                </Bar>
                <Bar dataKey="delivering" name="قيد التوصيل" radius={[4, 4, 0, 0]} barSize={40}>
                    {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#3b82f6" />
                    ))}
                </Bar>
                <Bar dataKey="cancelled" name="ملغي" radius={[4, 4, 0, 0]} barSize={40}>
                    {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#ef4444" />
                    ))}
                </Bar>
                <Bar dataKey="returned" name="مرتجع" radius={[4, 4, 0, 0]} barSize={40}>
                    {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#d1d5db" />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">من</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <span className="text-sm text-gray-500">إلى</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">المبيعات حسب الوقت</h2>
            </div>
            <div className="relative">
              <ResponsiveContainer width="100%" height={375}>
                <AreaChart data={areaChartData} margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(value) => [`القيمة ${Math.round(value / 1000)}k`, '']}
                    labelFormatter={(label) => `الشهر: ${label}`}
                    position={{ x: 150, y: 80 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#EF4444"
                    strokeWidth={3}
                    fill="url(#colorValue1)"
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">من</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <span className="text-sm text-gray-500">إلى</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTable('performance')}
                className={`py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  activeTable === 'performance' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                المنتجات الأكثر أداءً
              </button>
              <button
                onClick={() => setActiveTable('visited')}
                className={`py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  activeTable === 'visited' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                المنتجات الأكثر زيارة
              </button>
              <button
                onClick={() => setActiveTable('abandoned')}
                className={`py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  activeTable === 'abandoned' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                المنتجات المهجورة
              </button>
            </div>
          </div>

          {activeTable === 'performance' && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">المنتجات الأكثر أداءً</h2>
              <ProductsPerformanceTable />
            </>
          )}

          {activeTable === 'visited' && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">المنتجات الأكثر زيارة (والتحويل)</h2>
              <ProductsVisitedTable />
            </>
          )}

          {activeTable === 'abandoned' && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">المنتجات المهجورة</h2>
              <AbandonedProductsTable />
            </>
          )}

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">إجمالي المنتجات: {totalProducts}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">اعرض في الصفحة</span>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option>5</option>
                <option>10</option>
                <option>25</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">من</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <span className="text-sm text-gray-500">إلى</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">طلبات تحتاج انتباه</h2>
            </div>
            <div className="space-y-4">
              {ordersNeedingAttention.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-red-600 font-medium">{order.attentionReason}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{order.orderId}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">العميل: {order.customerName}</div>
                    <div className="text-xs text-gray-500 mt-1">منذ {order.daysSinceCreation} يوم</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">من</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <span className="text-sm text-gray-500">إلى</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">آراء الزبائن</h2>
            </div>
            <div className="space-y-4">
              {customerReviews.length > 0 ? (
                customerReviews.map((review, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-red-600 font-medium">{review.status}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{review.customerName}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{review.comment}</div>
                      <div className="text-xs text-gray-500 mt-1">{review.productName}، {new Date(review.reviewDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-sm text-gray-500">
                  لا توجد مراجعات حاليًا.
                </div>
              )}
            </div>
          </div>
        </div>
        <DetailsModal isOpen={isModalOpen} onClose={closeModal} title={modalTitle} data={modalData} />
      </div>
    </div>
  );
};

export default HomePage;