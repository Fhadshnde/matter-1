import React, { useState, useEffect } from 'react';
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
import {
  X
} from "lucide-react";
import API_CONFIG, { apiCall } from '../../config/api';

const AnalyticsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 lg:w-1/2 p-6" dir="rtl">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-semibold text-gray-900">تفاصيل المبيعات</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-sm font-medium text-gray-500">الاسم</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">المبيعات</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">الطلبات</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{item.sales}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{item.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
const StatCardModal = ({ selectedCardType, detailsData, onClose }) => {
    if (!detailsData) return null;

    let title, dataToRender;
    const isDaily = selectedCardType === 'daily';
    const isMonthly = selectedCardType === 'monthly';
    const isYearly = selectedCardType === 'yearly';
    const isGrowth = selectedCardType === 'growth';

    if (isDaily) {
        title = 'تفاصيل مبيعات اليوم';
        dataToRender = detailsData.hourlyBreakdown.map(item => ({
            name: item.timeRange,
            sales: item.sales.toLocaleString(),
            orders: item.ordersCount,
            avg: item.averageOrderValue.toLocaleString()
        }));
    } else if (isMonthly) {
        title = 'تفاصيل مبيعات الشهر';
        dataToRender = detailsData.dailyBreakdown.map(item => ({
            name: item.date,
            sales: item.sales.toLocaleString(),
            orders: item.ordersCount,
            avg: item.averageOrderValue.toLocaleString()
        }));
    } else if (isYearly) {
        title = 'تفاصيل مبيعات السنة';
        dataToRender = detailsData.monthlyBreakdown.map(item => ({
            name: item.month,
            sales: item.sales.toLocaleString(),
            orders: item.ordersCount,
            avg: item.averageOrderValue.toLocaleString()
        }));
    } else if (isGrowth) {
        title = 'تفاصيل معدل النمو';
        dataToRender = detailsData.monthlyData.map(item => ({
            name: item.month,
            sales: item.currentSales.toLocaleString(),
            previousSales: item.previousSales.toLocaleString(),
            growth: `${item.growthRate}%`
        }));
    }

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full text-right max-h-screen overflow-y-auto">
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
                            {isGrowth ? (
                                <>
                                    <th className="py-3 px-2 font-bold text-gray-700">الشهر</th>
                                    <th className="py-3 px-2 font-bold text-gray-700">المبيعات الحالية</th>
                                    <th className="py-3 px-2 font-bold text-gray-700">المبيعات السابقة</th>
                                    <th className="py-3 px-2 font-bold text-gray-700">معدل النمو</th>
                                </>
                            ) : (
                                <>
                                    <th className="py-3 px-2 font-bold text-gray-700">الاسم</th>
                                    <th className="py-3 px-2 font-bold text-gray-700">المبيعات</th>
                                    <th className="py-3 px-2 font-bold text-gray-700">الطلبات</th>
                                    <th className="py-3 px-2 font-bold text-gray-700">متوسط قيمة الطلب</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {dataToRender.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                <td className="py-3 px-2 text-gray-800">{item.name}</td>
                                <td className="py-3 px-2 text-gray-800">{item.sales}</td>
                                {isGrowth ? (
                                    <>
                                        <td className="py-3 px-2 text-gray-800">{item.previousSales}</td>
                                        <td className="py-3 px-2 text-gray-800">{item.growth}</td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-3 px-2 text-gray-800">{item.orders}</td>
                                        <td className="py-3 px-2 text-gray-800">{item.avg}</td>
                                    </>
                                )}
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
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCardType, setSelectedCardType] = useState(null);
  const [detailsData, setDetailsData] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [salesOverTimeStartDate, setSalesOverTimeStartDate] = useState('');
  const [salesOverTimeEndDate, setSalesOverTimeEndDate] = useState('');
  const [cityStartDate, setCityStartDate] = useState('');
  const [cityEndDate, setCityEndDate] = useState('');
  const [departmentStartDate, setDepartmentStartDate] = useState('');
  const [departmentEndDate, setDepartmentEndDate] = useState('');
  
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const token = localStorage.getItem('userToken');

      if (!token) {
        setError('خطأ: لم يتم العثور على توكن المصادقة. يرجى تسجيل الدخول.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiCall(API_CONFIG.ADMIN.ANALYTICS);
        setAnalyticsData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);
    const fetchCardDetails = async (cardType) => {
        setIsDetailsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('Authentication token not found.');
            }

            let endpoint = '';
            if (cardType === 'growth') {
                endpoint = 'growth-rate/details';
            } else if (cardType === 'yearly') {
                endpoint = 'year-sales/details';
            } else if (cardType === 'monthly') {
                endpoint = 'month-sales/details';
            } else if (cardType === 'daily') {
                endpoint = 'daily-sales/details';
            }
            const params = new URLSearchParams({
                page: '1',
                limit: '20'
            });
            const data = await apiCall(`${API_CONFIG.ADMIN.ANALYTICS_DETAILS(endpoint)}?${params.toString()}`);
            setDetailsData(data);
            setSelectedCardType(cardType);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsDetailsLoading(false);
        }
    };


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

  const { cards, salesByTime, topCategorySales, provincesSales } = analyticsData;

  const salesOverTimeData = salesByTime.map(item => ({
    name: item.month,
    value: item.sales,
    prevValue: item.sales
  }));
  const citySalesData = provincesSales.map(item => ({
    name: item.provinceName,
    sales: item.salesAmount,
    color: '#E95252',
    striped: false
  }));
  const departmentData = topCategorySales.map(item => ({
    name: item.categoryName,
    sales: item.salesAmount,
    percentage: item.percentage
  }));

  const statCards = [
    {
      title: 'معدل النمو', value: `${cards.growthRate}%`, percentage: `${cards.growthRate}%`, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8L13 15M3 21v-8a2 2 0 012-2h10a2 2 0 012 2v8"></path> </svg>,
      cardType: 'growth'
    },
    {
      title: 'مبيعات السنة', value: `${cards.yearSales.toLocaleString()} د.ع`, percentage: `${cards.growthRate}%`, icon: <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"> <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path> <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0A8 8 0 012 10z" clipRule="evenodd"></path> </svg>,
      cardType: 'yearly'
    },
    {
      title: 'مبيعات الشهر', value: `${cards.monthSales.toLocaleString()} د.ع`, percentage: `${((cards.monthSales / cards.previousMonthSales - 1) * 100).toFixed(2)}%`, icon: <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"> <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path> <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0A8 8 0 012 10z" clipRule="evenodd"></path> </svg>,
      cardType: 'monthly'
    },
    {
      title: 'مبيعات اليوم', value: `${cards.dailySales.toLocaleString()} د.ع`, percentage: `${((cards.dailySales / cards.previousDaySales - 1) * 100).toFixed(2)}%`, icon: <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"> <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path> <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0A8 8 0 012 10z" clipRule="evenodd"></path> </svg>,
      cardType: 'daily'
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
            onClick={() => fetchCardDetails(card.cardType)}
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
                <span className="text-sm font-semibold text-gray-800">{item.sales.toLocaleString()} د.ع</span>
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
      {selectedCardType && detailsData && (
        <StatCardModal
          selectedCardType={selectedCardType}
          detailsData={detailsData}
          onClose={() => {
            setSelectedCardType(null);
            setDetailsData(null);
          }}
        />
      )}
    </div>
  );
};
export default SalesDashboard;