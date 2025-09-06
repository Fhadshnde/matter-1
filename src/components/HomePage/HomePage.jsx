import React, { useState } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  X,
  CheckCircle,
  Inbox,
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";

const barChartData = [
  { name: 'الأسبوع الرابع', value: 8322, color: '#000000', details: 'تم الشحن' },
  { name: 'الأسبوع الثالث', value: 7432, color: '#00C853', details: 'قيد المتابعة' },
  { name: 'الأسبوع الثاني', value: 6754, color: '#FFD600', details: 'تم التوصيل' },
  { name: 'الأسبوع الأول', value: 743, color: '#E53935', details: 'ملغي' },
];

const areaChartData = [
  { name: 'يناير', value: 50000 },
  { name: 'فبراير', value: 65000 },
  { name: 'مارس', value: 80000 },
  { name: 'أبريل', value: 68000 },
  { name: 'مايو', value: 100000 },
  { name: 'يونيو', value: 90000 },
  { name: 'يوليو', value: 110000 },
  { name: 'أغسطس', value: 150000 },
  { name: 'سبتمبر', value: 120000 },
  { name: 'أكتوبر', value: 170000 },
  { name: 'نوفمبر', value: 190000 },
  { name: 'ديسمبر', value: 250000 },
];

const performanceProductsData = [
  { merchant: 'أتلانتا', stock: 45, sales: '1,70', conversion: '8.6%', addition: '2,45', visits: '12,56', product: 'هاتف ذكي A15 128GB' },
  { merchant: 'أتلانتا', stock: 45, sales: '1,70', conversion: '8.6%', addition: '2,45', visits: '12,56', product: 'هاتف ذكي A15 128GB' },
  { merchant: 'أتلانتا', stock: 45, sales: '1,70', conversion: '8.6%', addition: '2,45', visits: '12,56', product: 'هاتف ذكي A15 128GB' },
  { merchant: 'أتلانتا', stock: 45, sales: '1,70', conversion: '8.6%', addition: '2,45', visits: '12,56', product: 'هاتف ذكي A15 128GB' },
  { merchant: 'أتلانتا', stock: 45, sales: '1,70', conversion: '8.6%', addition: '2,45', visits: '12,56', product: 'هاتف ذكي A15 128GB' },
];

const visitedProductsData = [
  {
    name: "هاتف ذكي A15 128GB",
    image: "https://placehold.co/60x60/d1d5db/4b5563?text=A15",
    visits: "١٣,٤٥٠",
    cartAdds: "٢,١٤٠",
    conversion: "8.6%",
    sales: "١,٠٧٠",
  },
  {
    name: "لابتوب Z-Series",
    image: "https://placehold.co/60x60/d1d5db/4b5563?text=Z-S",
    visits: "١٠,٥٠٠",
    cartAdds: "١,٥٠٠",
    conversion: "7.2%",
    sales: "٧٥٠",
  },
  {
    name: "سماعات بلوتوث X9",
    image: "https://placehold.co/60x60/d1d5db/4b5563?text=X9",
    visits: "١٥,٢٠٠",
    cartAdds: "٢,٥٠٠",
    conversion: "9.1%",
    sales: "١,٢٠٠",
  },
  {
    name: "ساعة ذكية S3",
    image: "https://placehold.co/60x60/d1d5db/4b5563?text=S3",
    visits: "٨,٧٠٠",
    cartAdds: "٨٥٠",
    conversion: "5.5%",
    sales: "٤٠٠",
  },
  {
    name: "شاحن لاسلكي 5W",
    image: "https://placehold.co/60x60/d1d5db/4b5563?text=5W",
    visits: "٦,١٠٠",
    cartAdds: "٥٢٠",
    conversion: "4.8%",
    sales: "٢٨٠",
  },
];

const abandonedProductsData = [
  {
    name: "لابتوب Z-Series",
    image: "https://placehold.co/60x60/d1d5db/4b5563?text=Z-S",
    cartAdds: "٨٠٠",
    lastVisit: "منذ 2 يوم",
    conversion: "0.0%",
    status: "مهجور"
  },
  {
    name: "ساعة ذكية S3",
    image: "https://placehold.co/60x60/d1d5db/4b5563?text=S3",
    cartAdds: "٧٠٠",
    lastVisit: "منذ 5 ساعات",
    conversion: "0.0%",
    status: "مهجور"
  },
  {
    name: "هاتف ذكي A15 128GB",
    image: "https://placehold.co/60x60/d1d5db/4b5563?text=A15",
    cartAdds: "٤٥٠",
    lastVisit: "منذ 1 يوم",
    conversion: "0.0%",
    status: "مهجور"
  },
  {
    name: "سماعات بلوتوث X9",
    image: "https://placehold.co/60x60/d1d5db/4b5563?text=X9",
    cartAdds: "٣٢٠",
    lastVisit: "منذ 3 أيام",
    conversion: "0.0%",
    status: "مهجور"
  },
  {
    name: "شاحن لاسلكي 5W",
    image: "https://placehold.co/60x60/d1d5db/4b5563?text=5W",
    cartAdds: "٢١٠",
    lastVisit: "منذ 8 ساعات",
    conversion: "0.0%",
    status: "مهجور"
  },
];

const ordersNeedingAttention = [
  { id: '#A-10254', status: 'متأخر عن ETA', customer: 'محمد الفاضلي', store: 'متجر النور', rating: 5 },
  { id: '#A-10254', status: 'متأخر عن ETA', customer: 'محمد الفاضلي', store: 'متجر النور', rating: 5 },
  { id: '#A-10254', status: 'متأخر عن ETA', customer: 'محمد الفاضلي', store: 'متجر النور', rating: 5 },
  { id: '#A-10254', status: 'متأخر عن ETA', customer: 'محمد الفاضلي', store: 'متجر النور', rating: 5 },
];

const merchantDetailsData = [
  { merchant: 'متجر مهند', totalSales: 'د.ك 500,000', orders: 1500, profit: 'د.ك 150,000' },
  { merchant: 'متجر حازم عبود', totalSales: 'د.ك 350,000', orders: 900, profit: 'د.ك 100,000' },
  { merchant: 'متجر بيداء', totalSales: 'د.ك 250,000', orders: 750, profit: 'د.ك 75,000' },
  { merchant: 'متجر محمد', totalSales: 'د.ك 150,000', orders: 500, profit: 'د.ك 40,000' },
];

const notifications = [
    {
      id: 1,
      title: "انخفاض مخزون منتج جهاز iPhone 15",
      time: "منذ 10 دقائق",
      isUnread: true,
      category: "منتج",
    },
    {
      id: 2,
      title: "إصدار حديث: Apple Watch Series 9",
      time: "منذ 20 دقيقة",
      isUnread: true,
      category: "منتج",
    },
    {
      id: 3,
      title: "تحقيق أرباح قياسية: ربع سنوي",
      time: "منذ 15 دقيقة",
      isUnread: true,
      category: "أرباح",
    },
    {
      id: 4,
      title: "تخفيض أسعار: MacBook Air",
      time: "منذ 25 دقيقة",
      isUnread: false,
      category: "منتج",
    },
    {
      id: 5,
      title: "مشاكل في التوصيل: Apple TV 4K",
      time: "منذ 30 دقيقة",
      isUnread: false,
      category: "توصيل",
    },
    {
      id: 6,
      title: "إطلاق خدمة جديدة: +Apple Fitness",
      time: "منذ 35 دقيقة",
      isUnread: false,
      category: "خدمات",
    },
    {
      id: 7,
      title: "استعراض المنتج: iPad Pro 2023",
      time: "منذ 40 دقيقة",
      isUnread: false,
      category: "منتج",
    },
    {
      id: 8,
      title: "مراجعة تطبيق: Apple Music",
      time: "منذ 45 دقيقة",
      isUnread: false,
      category: "تطبيق",
    },
    {
      id: 9,
      title: "تحقيق أرباح قياسية: ربع سنوي",
      time: "منذ 50 دقيقة",
      isUnread: false,
      category: "أرباح",
    },
    {
      id: 10,
      title: "التحديثات الأمنية: iCloud",
      time: "منذ 55 دقيقة",
      isUnread: false,
      category: "نظام",
    },
    {
      id: 11,
      title: "استطلاع رأي العملاء: تجربة المستخدم",
      time: "منذ ساعة",
      isUnread: false,
      category: "استطلاع",
    },
    {
      id: 12,
      title: "زيادة مبيعات منتج: سماعة AirPods Pro",
      time: "منذ 10 دقائق",
      isUnread: false,
      category: "مبيعات",
    },
];

const MerchantDetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 p-6" dir="rtl">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-semibold text-gray-900">تفاصيل إجمالي المبيعات</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-sm font-medium text-gray-500">التاجر</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">إجمالي المبيعات</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">الطلبات</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">صافي الأرباح</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.merchant}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{item.totalSales}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{item.orders}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{item.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

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
        {performanceProductsData.map((item, index) => (
          <tr key={index} className="border-b border-gray-100">
            <td className="py-4 text-sm font-medium text-gray-900">{item.product}</td>
            <td className="py-4 text-sm text-gray-900">{item.visits}</td>
            <td className="py-4 text-sm text-gray-900">{item.addition}</td>
            <td className="py-4 text-sm text-gray-900">{item.conversion}</td>
            <td className="py-4 text-sm text-gray-900">{item.sales}</td>
            <td className="py-4 text-sm text-gray-900">{item.stock}</td>
            <td className="py-4 text-sm text-gray-900">{item.merchant}</td>
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
        {visitedProductsData.map((product, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.sales}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.conversion}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.cartAdds}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.visits}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
              <div className="flex items-center justify-end">
                <span>{product.name}</span>
                <img className="h-8 w-8 mr-2 rounded-lg" src={product.image} alt={product.name} />
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
        {abandonedProductsData.map((product, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 text-right font-bold">{product.status}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.lastVisit}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{product.cartAdds}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
              <div className="flex items-center justify-end">
                <span>{product.name}</span>
                <img className="h-8 w-8 mr-2 rounded-lg" src={product.image} alt={product.name} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTable, setActiveTable] = useState('performance');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

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
                    لديك {notifications.filter(n => n.isUnread).length} إشعارات غير مقروءة
                  </span>
                  <button className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>تحديد الكل كمقروء</span>
                  </button>
                </div>
                <div className="py-2 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      to={`/notifications-page`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-b border-gray-100"
                      onClick={toggleNotifications}
                    >
                      {notification.isUnread && (
                        <span className="block w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {notification.time}
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
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">أرباح التطبيق</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">د.ك 245,000,00</h3>
                <div className="flex items-center text-green-500 text-sm">
                  <span className="mr-1">↗</span>
                  <span>+5% عن الفترة السابقة</span>
                </div>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">التجار المسجلون</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">37</h3>
                <div className="flex items-center text-green-500 text-sm">
                  <span className="mr-1">↗</span>
                  <span>+2% عن الفترة السابقة</span>
                </div>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm cursor-pointer hover:bg-gray-100 transition-colors" onClick={openModal}>
            <div className="flex items-start justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">إجمالي المبيعات</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">د.ك 1,500,00</h3>
                <div className="flex items-center text-green-500 text-sm">
                  <span className="mr-1">↗</span>
                  <span>+8% عن الفترة السابقة</span>
                </div>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V4m0 16v-4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">معدل الإرجاع</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">2.4%</h3>
                <div className="flex items-center text-green-500 text-sm">
                  <span className="mr-1">↗</span>
                  <span>+4% عن الفترة السابقة</span>
                </div>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">الطلبات</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">970</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>قيد الشحن 150</span>
                  <span>مكتمل 1567</span>
                  <span>ملغي 532</span>
                </div>
              </div>
              <div className="bg-gray-900 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">زمن التجهيز (متوسط)</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">11:30 ساعة</h3>
                <div className="flex items-center text-red-500 text-sm">
                  <span className="mr-1">↘</span>
                  <span>-6% عن الفترة السابقة</span>
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
                {barChartData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.details}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
              <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-4">
                <span>5m</span>
                <span>1m</span>
                <span>800k</span>
                <span>650k</span>
                <span>250k</span>
                <span>100k</span>
                <span>50k</span>
              </div>
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
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                القيمة 680k
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
              </div>
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
            <div className="text-sm text-gray-500">إجمالي المنتجات: 8764</div>
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
                    <span className="text-sm text-red-600 font-medium">{order.status}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{order.id}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < order.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">تغليف ممتاز والتسليم سريع</div>
                    <div className="text-xs text-gray-500 mt-1">{order.store}، هدى أحمد، هاتف A15، اليوم</div>
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
              {ordersNeedingAttention.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-red-600 font-medium">{order.status}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{order.id}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < order.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">تغليف ممتاز والتسليم سريع</div>
                    <div className="text-xs text-gray-500 mt-1">{order.store}، هدى أحمد، هاتف A15، اليوم</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <MerchantDetailsModal isOpen={isModalOpen} onClose={closeModal} data={merchantDetailsData} />
      </div>
    </div>
  );
};

export default App;