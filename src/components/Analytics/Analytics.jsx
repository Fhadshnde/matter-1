import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Cell
} from 'recharts';
const salesOverTimeData = [
  { name: 'يناير', value: 400000, prevValue: 500000 },
  { name: 'فبراير', value: 650000, prevValue: 700000 },
  { name: 'مارس', value: 800000, prevValue: 600000 },
  { name: 'أبريل', value: 680000, prevValue: 750000 },
  { name: 'مايو', value: 950000, prevValue: 850000 },
  { name: 'يونيو', value: 850000, prevValue: 900000 },
  { name: 'يوليو', value: 720000, prevValue: 780000 },
  { name: 'أغسطس', value: 880000, prevValue: 820000 },
  { name: 'سبتمبر', value: 920000, prevValue: 950000 },
  { name: 'أكتوبر', value: 800000, prevValue: 880000 },
  { name: 'نوفمبر', value: 780000, prevValue: 700000 },
  { name: 'ديسمبر', value: 990000, prevValue: 920000 },
];
const citySalesData = [
  { name: 'اسم المحافظة', sales: 42000, color: '#2C2B2B' },
  { name: 'اسم المحافظة', sales: 25000, color: '#FFB6C1' },
  { name: 'اسم المحافظة', sales: 33000, color: '#4CAF50' },
  { name: 'اسم المحافظة', sales: 38000, color: '#DAA520' },
  { name: 'بغداد', sales: 27000, color: '#FFB6C1', label: 'بغداد 680K', striped: true },
  { name: 'اسم المحافظة', sales: 40000, color: '#4CAF50' },
  { name: 'اسم المحافظة', sales: 20000, color: '#E9C46A' },
  { name: 'اسم المحافظة', sales: 35000, color: '#DAA520' },
  { name: 'اسم المحافظة', sales: 45000, color: '#4285F4' },
  { name: 'اسم المحافظة', sales: 29000, color: '#C0C0C0' },
];
const departmentData = [
  { name: 'ملابس', sales: 264000, percentage: 70 },
  { name: 'ملابس', sales: 264000, percentage: 50 },
  { name: 'ملابس', sales: 264000, percentage: 85 },
  { name: 'ملابس', sales: 264000, percentage: 60 },
  { name: 'ملابس', sales: 264000, percentage: 40 },
];
const StatCardModal = ({ title, details, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full text-right">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-200">
              <th className="py-3 px-2 font-bold text-gray-700">التاجر</th>
              <th className="py-3 px-2 font-bold text-gray-700">إجمالي المبيعات</th>
              <th className="py-3 px-2 font-bold text-gray-700">الطلبات</th>
              <th className="py-3 px-2 font-bold text-gray-700">صافي الأرباح</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="py-3 px-2 text-gray-800">{item.trader}</td>
                <td className="py-3 px-2 text-gray-800">{item.totalSales}</td>
                <td className="py-3 px-2 text-gray-800">{item.orders}</td>
                <td className="py-3 px-2 text-gray-800">{item.netProfit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} className="mt-6 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">إغلاق</button>
      </div>
    </div>
  );
};
const StatCard = ({ title, value, percentage, icon, onClick }) => (
  <div onClick={onClick} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-start justify-between min-h-[140px] cursor-pointer">
    <div className="flex items-center justify-between w-full mb-2">
      <span className="text-gray-500 text-sm">{title}</span>
      {icon}
    </div>
    <div className="text-3xl font-bold">{value}</div>
    <div className="flex items-center mt-2">
      <span className="text-green-500 text-xs font-semibold">{percentage}</span>
      <span className="text-gray-400 text-xs mr-1">عن الفترة السابقة</span>
    </div>
  </div>
);
const StripedBar = ({ fill, striped, ...props }) => {
  if (striped) {
    const patternId = 'pattern-stripe';
    return (
      <g>
        <defs>
          <pattern id={patternId} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect x="0" y="0" width="2" height="10" fill="#FFFFFF" opacity="0.4" />
          </pattern>
        </defs>
        <rect {...props} fill={`url(#${patternId})`} />
      </g>
    );
  }
  return <rect {...props} fill={fill} />;
};
const SalesDashboard = () => {
  const [modalData, setModalData] = useState(null);
  const [salesOverTimeStartDate, setSalesOverTimeStartDate] = useState('');
  const [salesOverTimeEndDate, setSalesOverTimeEndDate] = useState('');
  const [cityStartDate, setCityStartDate] = useState('');
  const [cityEndDate, setCityEndDate] = useState('');
  const [departmentStartDate, setDepartmentStartDate] = useState('');
  const [departmentEndDate, setDepartmentEndDate] = useState('');
  const statCards = [
    {
      title: 'معدل النمو', value: '8.5%', percentage: '+9%', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8L13 15M3 21v-8a2 2 0 012-2h10a2 2 0 012 2v8"></path> </svg>,
      details: [
        { trader: 'متجر مهند', totalSales: '500,000 د.ك', orders: '1500', netProfit: '150,000 د.ك' },
        { trader: 'متجر حازم عبود', totalSales: '350,000 د.ك', orders: '900', netProfit: '100,000 د.ك' },
        { trader: 'متجر بيداء', totalSales: '250,000 د.ك', orders: '750', netProfit: '75,000 د.ك' },
        { trader: 'متجر محمد', totalSales: '150,000 د.ك', orders: '500', netProfit: '40,000 د.ك' },
      ]
    },
    {
      title: 'مبيعات السنة', value: '1,850,000 د.ك', percentage: '+9%', icon: <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"> <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path> <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0A8 8 0 012 10z" clipRule="evenodd"></path> </svg>,
      details: [
        { trader: 'متجر أ', totalSales: '800,000 د.ك', orders: '8000', netProfit: '400,000 د.ك' },
        { trader: 'متجر ب', totalSales: '500,000 د.ك', orders: '5000', netProfit: '250,000 د.ك' },
        { trader: 'متجر ج', totalSales: '350,000 د.ك', orders: '3500', netProfit: '175,000 د.ك' },
        { trader: 'متجر د', totalSales: '200,000 د.ك', orders: '2000', netProfit: '100,000 د.ك' },
      ]
    },
    {
      title: 'مبيعات الشهر', value: '320,000 د.ك', percentage: '+9%', icon: <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"> <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path> <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0A8 8 0 012 10z" clipRule="evenodd"></path> </svg>,
      details: [
        { trader: 'متجر أ', totalSales: '150,000 د.ك', orders: '1500', netProfit: '75,000 د.ك' },
        { trader: 'متجر ب', totalSales: '100,000 د.ك', orders: '1000', netProfit: '50,000 د.ك' },
        { trader: 'متجر ج', totalSales: '70,000 د.ك', orders: '700', netProfit: '35,000 د.ك' },
      ]
    },
    {
      title: 'مبيعات اليوم', value: '45,200 د.ك', percentage: '+9%', icon: <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"> <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path> <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0A8 8 0 012 10z" clipRule="evenodd"></path> </svg>,
      details: [
        { trader: 'متجر أ', totalSales: '25,000 د.ك', orders: '250', netProfit: '12,500 د.ك' },
        { trader: 'متجر ب', totalSales: '15,000 د.ك', orders: '150', netProfit: '7,500 د.ك' },
        { trader: 'متجر ج', totalSales: '5,200 د.ك', orders: '50', netProfit: '2,600 د.ك' },
      ]
    },
  ];
  return (
    <div className="bg-gray-100 min-h-screen p-8 text-right font-sans" dir="rtl">
      <div className="flex justify-start items-center p-4 bg-white shadow-md mb-6">
        <h1 className="text-xl font-bold text-gray-800">تحليلات المبيعات</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            {...card}
            onClick={() => setModalData(card)}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">المبيعات حسب الوقت</h3>
          </div>
          <div className="flex space-x-4 space-x-reverse text-sm mb-4">
            <div className="relative">
              <label htmlFor="sales-start-date" className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">من تاريخ</label>
              <input type="date" id="sales-start-date" value={salesOverTimeStartDate} onChange={(e) => setSalesOverTimeStartDate(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6" />
            </div>
            <div className="relative">
              <label htmlFor="sales-end-date" className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">إلى تاريخ</label>
              <input type="date" id="sales-end-date" value={salesOverTimeEndDate} onChange={(e) => setSalesOverTimeEndDate(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesOverTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => `${value / 1000}K`} tickLine={false} axisLine={false} orientation="right" dx={15} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#E95252" fill="#E95252" fillOpacity={0.6} />
              <Area type="monotone" dataKey="prevValue" stroke="#C3A6A6" fill="#C3A6A6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">المبيعات حسب القسم</h3>
          </div>
          <div className="flex space-x-4 space-x-reverse text-sm mb-4">
            <div className="relative">
              <label htmlFor="department-start-date" className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">من تاريخ</label>
              <input type="date" id="department-start-date" value={departmentStartDate} onChange={(e) => setDepartmentStartDate(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6" />
            </div>
            <div className="relative">
              <label htmlFor="department-end-date" className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">إلى تاريخ</label>
              <input type="date" id="department-end-date" value={departmentEndDate} onChange={(e) => setDepartmentEndDate(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6" />
            </div>
          </div>
          <div className="space-y-4 pt-4">
            {departmentData.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="w-24 text-sm text-gray-600 ml-4">{item.name}</span>
                <div className="relative w-full bg-gray-200 h-2.5 rounded-full mr-2">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
                <span className="text-sm font-semibold text-gray-800">{item.sales.toLocaleString()} د.ك</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
        <div className="flex space-x-4 space-x-reverse text-sm mb-4">
            <div className="relative">
              <label htmlFor="city-start-date" className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">من تاريخ</label>
              <input type="date" id="city-start-date" value={cityStartDate} onChange={(e) => setCityStartDate(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6" />
            </div>
            <div className="relative">
              <label htmlFor="city-end-date" className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">إلى تاريخ</label>
              <input type="date" id="city-end-date" value={cityEndDate} onChange={(e) => setCityEndDate(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6" />
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={citySalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => `${value}`} tickLine={false} axisLine={false} orientation="right" />
            <Tooltip />
            <Bar dataKey="sales" barSize={35} radius={[10, 10, 0, 0]}>
              {citySalesData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  component={(props) => <StripedBar {...props} striped={entry.striped} />}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {modalData && (
        <StatCardModal
          title={modalData.title}
          details={modalData.details}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
};
export default SalesDashboard;