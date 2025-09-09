import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MerchantsModal = ({ onClose, merchants }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">تفاصيل إجمالي المبيعات حسب التاجر</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-right">
              <tr>
                <th className="p-3 font-semibold text-gray-500">اسم التاجر</th>
                <th className="p-3 font-semibold text-gray-500">إجمالي المبيعات</th>
                <th className="p-3 font-semibold text-gray-500">عدد الطلبات</th>
                <th className="p-3 font-semibold text-gray-500">صافي الأرباح</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {merchants.map((merchant, index) => (
                <tr key={index}>
                  <td className="p-3 text-xs text-gray-700">{merchant.name}</td>
                  <td className="p-3 text-xs text-gray-700">{merchant.totalSales}</td>
                  <td className="p-3 text-xs text-gray-700">{merchant.totalOrders}</td>
                  <td className="p-3 text-xs text-gray-700">{merchant.netProfit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">إغلاق</button>
        </div>
      </div>
    </div>
  );
};
const CustomSharedTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const merchantValue = payload.find(p => p.dataKey === 'merchantShare').value;
    const appValue = payload.find(p => p.dataKey === 'appShare').value;
    return (
      <div className="bg-gray-800 text-white p-3 rounded-md text-right border border-white font-sans">
        <p className="font-bold text-sm">{label}</p>
        <p className="text-sm">
          <span style={{ color: '#EF4444' }}>●</span> {`التاجر: ${merchantValue.toLocaleString()} د.ع`}
        </p>
        <p className="text-sm">
          <span style={{ color: '#22C55E' }}>●</span> {`التطبيق: ${appValue.toLocaleString()} د.ع`}
        </p>
      </div>
    );
  }
  return null;
};
const CustomProfitTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-3 rounded-md text-center border border-white font-sans">
        <p className="font-bold text-sm">{`القيمة: ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};
const ChartContainer = ({ title, data, chartType }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const yAxisTickFormatter = (value) => {
    return value.toLocaleString();
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      <div className='flex items-center justify-between mb-4 space-x-4 rtl:space-x-reverse'>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        <div className="flex items-center mb-4 space-x-4 rtl:space-x-reverse">
          <div className="relative">
            <label htmlFor="start-date" className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">من تاريخ</label>
            <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6" />
          </div>
          <div className="relative">
            <label htmlFor="end-date" className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">إلى تاريخ</label>
            <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6" />
          </div>
        </div>
      </div>
      <div className="flex-grow h-80" style={{ direction: 'ltr' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="month" reversed={true} axisLine={false} tickLine={false} style={{ direction: 'rtl', fontFamily: 'Cairo' }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={yAxisTickFormatter}
              tick={{ fill: '#6B7280' }}
            />
            {chartType === 'sharedProfit' ? (
              <>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMerchant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="appShare" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorApp)" dot={false} />
                <Area type="monotone" dataKey="merchantShare" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorMerchant)" dot={false} />
                <Tooltip content={<CustomSharedTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ direction: 'rtl', marginTop: '20px' }}
                  payload={[
                    { value: 'حصة التطبيق', type: 'circle', id: 'appShare', color: '#22C55E' },
                    { value: 'حصة التاجر', type: 'circle', id: 'merchantShare', color: '#EF4444' }
                  ]}
                />
              </>
            ) : (
              <>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="appProfit" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorApp)" dot={false} />
                <Tooltip content={<CustomProfitTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ direction: 'rtl', marginTop: '20px' }}
                  payload={[
                    { value: 'أرباح التطبيق', type: 'circle', id: 'appProfit', color: '#EF4444' }
                  ]}
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
const StatCard = ({ title, value, icon, onClick }) => {
  const icons = {
    'bag': <div className="bg-gray-100 p-3 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
        <path d="M11 5.111v2.5a.75.75 0 001.5 0v-2.5a.75.75 0 00-1.5 0zM12 2a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5A.75.75 0 0012 2zM12 18.25a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75zM12 21a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75zM8.75 5.111v2.5a.75.75 0 001.5 0v-2.5a.75.75 0 00-1.5 0zM8.75 2a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75zM8.75 18.25a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75zM8.75 21a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75zM15.25 5.111v2.5a.75.75 0 001.5 0v-2.5a.75.75 0 00-1.5 0zM15.25 2a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75zM15.25 18.25a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75zM15.25 21a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75z" />
      </svg>
    </div>,
    'mobile': <div className="bg-gray-100 p-3 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
        <path fillRule="evenodd" d="M18.75 2.25H5.25A2.25 2.25 0 003 4.5v15a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 19.5v-15a2.25 2.25 0 00-2.25-2.25zM18.75 4.5v15H5.25a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75h13.5zM12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
    </div>,
    'store': <div className="bg-gray-100 p-3 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
        <path fillRule="evenodd" d="M3.75 4.5a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v15a.75.75 0 01-1.5 0V6.25a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v13.25a.75.75 0 01-1.5 0V6.25a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v13.25a.75.75 0 01-1.5 0V6.25a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v13.25a.75.75 0 01-1.5 0V4.5z" clipRule="evenodd" />
      </svg>
    </div>,
    'package': <div className="bg-gray-100 p-3 rounded-xl">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6 5.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM6 8.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM6 11.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM6 14.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM6 17.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM6 20.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
      </svg>
    </div>,
  };
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between text-right cursor-pointer" onClick={onClick}>
      <div className="flex flex-col">
        <span className="text-gray-400 text-xs mb-1">{title}</span>
        <p className="text-xl font-bold mb-1">{value}</p>
        <span className="text-xs text-green-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transform rotate-180 text-green-500 ml-1">
            <path fillRule="evenodd" d="M10 3.75a.75.75 0 01.75.75v12.5a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75zM6.75 7a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5a.75.75 0 01.75-.75zM13.25 7a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
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
  <td className="p-3 text-xs text-gray-700">{children}</td>
);
const ProductModal = ({ product, onClose }) => {
  if (!product) return null;
  const ratingStars = product.customerRating ? Math.floor(product.customerRating) : 0;
  const hasHalfStar = product.customerRating ? product.customerRating % 1 !== 0 : false;
  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-4 rounded-lg shadow-xl max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">تفاصيل المنتج</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">اسم المنتج</span>
            <span className="font-medium text-gray-800">{product.productName}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">التصنيف</span>
            <span className="font-medium text-gray-800">{product.categoryName}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">التاجر</span>
            <span className="font-medium text-gray-800">{product.merchantName}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">الكود المرجعي</span>
            <span className="font-medium text-gray-800">{product.productId}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">عدد المرات المباعة</span>
            <span className="font-medium text-gray-800">{product.timesSold} عملية</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">تقييم الزبائن</span>
            <span className="font-medium text-yellow-500 flex">
              {[...Array(ratingStars)].map((_, i) => <span key={`star-${i}`} className="text-lg">&#9733;</span>)}
              {hasHalfStar && <span className="text-lg">&#9734;</span>}
            </span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">سعر الجملة</span>
            <span className="font-medium text-gray-800">{product.wholesalePrice} د.ع</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">سعر البيع المفرد</span>
            <span className="font-medium text-gray-800">{product.sellingPrice} د.ع</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">الفرق</span>
            <span className="font-medium text-gray-800">{product.priceDifference} د.ع</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">نسبة حصة التطبيق</span>
            <span className="font-medium text-gray-800">15%</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">حصة التطبيق</span>
            <span className="font-medium text-gray-800">{product.appShare} د.ع</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">حصة التاجر</span>
            <span className="font-medium text-gray-800">{product.merchantShare} د.ع</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">صافي ربح التاجر</span>
            <span className="font-medium text-gray-800">{product.merchantShare} د.ع</span>
          </div>
        </div>
        <div className="mt-4">
          <button className="w-full bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition">تعديل</button>
        </div>
      </div>
    </div>
  );
};
const MoreOptionsModal = ({ onClose, onShowDetails, onDownloadReport }) => {
  return (
    <div className="absolute top-8 right-0 bg-white p-2 rounded-lg shadow-lg border border-gray-200 z-10" dir="rtl">
      <ul className="text-sm text-gray-700">
        <li className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={onShowDetails}>
          <span className="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v5.25a.75.75 0 001.5 0V9zM12 16.5a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd" />
            </svg>
          </span>
          عرض التفاصيل
        </li>
        <li className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={onDownloadReport}>
          <span className="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875V15.75c0 1.036.84 1.875 1.875 1.875h4.5a.75.75 0 010 1.5h-4.5A3.375 3.375 0 012.25 15.75V3.375C2.25 2.339 3.09 1.5 4.125 1.5H9a.75.75 0 010 1.5zM15 1.5h3.375c1.036 0 1.875.84 1.875 1.875v12.375c0 1.036-.84 1.875-1.875 1.875h-4.5a.75.75 0 010-1.5h4.5c.276 0 .5-.224.5-.5V3.375a.5.5 0 00-.5-.5h-3.375a.75.75 0 010-1.5zM12 21a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          </span>
          تحميل التقرير
        </li>
        <li className="flex items-center p-2 text-red-500 hover:bg-gray-100 rounded-md cursor-pointer" onClick={onClose}>
          <span className="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </span>
          اغلاق
        </li>
      </ul>
    </div>
  );
};
const ExportReportModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-4 rounded-lg shadow-xl max-w-xs w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">تصدير التقرير</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-500 mb-2">نوع التقرير</label>
          <div className="relative">
            <select className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500">
              <option>pdf</option>
              <option>excel</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">الغاء</button>
          <button className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">تصدير التقرير</button>
        </div>
      </div>
    </div>
  );
};
const ProductTable = ({ products, totalCount }) => {
  const [activeProduct, setActiveProduct] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const handleMoreClick = (product, index) => {
    setActiveProduct(product);
    setShowMoreMenu(showMoreMenu === index ? null : index);
  };
  const handleShowDetails = () => {
    setShowMoreMenu(null);
  };
  const handleDownloadReport = () => {
    setShowMoreMenu(null);
    setShowExportModal(true);
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-4">كل المنتجات</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-right">
            <tr>
              <Th>المنتج</Th>
              <Th>سعر الجملة</Th>
              <Th>سعر المفرد</Th>
              <Th>الفرق</Th>
              <Th>حصة التطبيق</Th>
              <Th>حصة التاجر</Th>
              <Th>النسبة للتجار</Th>
              <Th>الإجراءات</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-right">
            {products.map((product, index) => (
              <tr key={index}>
                <Td>{product.productName}</Td>
                <Td>{product.wholesalePrice} د.ع</Td>
                <Td>{product.sellingPrice} د.ع</Td>
                <Td>{product.priceDifference} د.ع</Td>
                <Td>{product.appShare} د.ع</Td>
                <Td>{product.merchantShare} د.ع</Td>
                <Td>{product.merchantPercentage}%</Td>
                <Td>
                  <div className="relative">
                    <button className="text-gray-500 hover:text-gray-700" onClick={() => handleMoreClick(product, index)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM10.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {showMoreMenu === index && (
                      <MoreOptionsModal
                        onClose={() => setShowMoreMenu(null)}
                        onShowDetails={handleShowDetails}
                        onDownloadReport={handleDownloadReport}
                      />
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center text-sm">
        <span className="text-gray-700">إجمالي المنتجات: {totalCount}</span>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-gray-500">أعرض في الصفحة 5</span>
          <div className="flex space-x-1 rtl:space-x-reverse">
            {[1, 2, 3, 4, 5].map(page => (
              <button
                key={page}
                className={`px-3 py-1 rounded-md text-sm ${page === 1 ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border'}`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
      {activeProduct && !showMoreMenu && (
        <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      )}
      {showExportModal && <ExportReportModal onClose={() => setShowExportModal(false)} />}
    </div>
  );
};
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMerchantsModal, setShowMerchantsModal] = useState(false);
  const [merchantsData, setMerchantsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      try {
        const response = await fetch('https://products-api.cbc-apps.net/admin/dashboard/profits?page=1&limit=20', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        setData(result);
        const aggregatedMerchants = {};
        result.productsProfit.forEach(product => {
          if (!aggregatedMerchants[product.merchantName]) {
            aggregatedMerchants[product.merchantName] = {
              name: product.merchantName,
              totalSales: 0,
              totalOrders: 0,
              netProfit: 0,
            };
          }
          aggregatedMerchants[product.merchantName].totalSales += product.sellingPrice || 0;
          aggregatedMerchants[product.merchantName].totalOrders += product.timesSold;
          aggregatedMerchants[product.merchantName].netProfit += product.merchantShare;
        });
        setMerchantsData(Object.values(aggregatedMerchants));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  const handleTotalSalesClick = () => {
    setShowMerchantsModal(true);
  };
  if (loading || !data) {
    return <div dir="rtl" className="p-6 text-center text-gray-500">جاري تحميل البيانات...</div>;
  }
  const statsCards = [
    { title: 'متوسط حاصل الأرباح', value: `${data.cards.averageProfitMargin}%`, icon: 'bag' },
    { title: 'حصة التطبيق', value: `${data.cards.appShare} د.ع`, icon: 'mobile' },
    { title: 'حصة التاجر', value: `${data.cards.merchantShare} د.ع`, icon: 'store' },
    { title: 'إجمالي المبيعات', value: `${data.cards.totalSales} د.ع`, icon: 'package' },
  ];
  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((card, index) => (
          <StatCard key={index} {...card} onClick={card.title === 'إجمالي المبيعات' ? handleTotalSalesClick : null} />
        ))}
      </div>
      <div className="grid grid-cols-1 justify-between lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="مقارنة حصة التطبيق والتاجر" data={data.profitComparison} chartType="sharedProfit" />
        <ChartContainer title="تطور أرباح التطبيق" data={data.appProfitEvolution} chartType="profitGrowth" />
      </div>
      <ProductTable products={data.productsProfit} totalCount={data.productsProfit.length} />
      {showMerchantsModal && <MerchantsModal merchants={merchantsData} onClose={() => setShowMerchantsModal(false)} />}
    </div>
  );
};
export default Dashboard;