import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import API_CONFIG, { apiCall } from '../../config/api';
import StatCard from '../Shared/StatCard';
import Dropdown from '../Shared/Dropdown';
import Pagination from '../Shared/Pagination';
import Modal from '../Shared/Modal';
import { FaDownload, FaFilter, FaCalendarAlt, FaChartLine, FaChartBar, FaChartPie, FaEye, FaEdit } from 'react-icons/fa';

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
  const yAxisTickFormatter = (value) => {
    return value.toLocaleString();
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-80 text-gray-500">
          <p>لا توجد بيانات متاحة</p>
        </div>
      );
    }

    switch (chartType) {
      case 'sharedProfit':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" reversed={true} axisLine={false} tickLine={false} style={{ direction: 'rtl', fontFamily: 'Cairo' }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={yAxisTickFormatter}
                tick={{ fill: '#6B7280' }}
              />
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
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'profitGrowth':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" reversed={true} axisLine={false} tickLine={false} style={{ direction: 'rtl', fontFamily: 'Cairo' }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={yAxisTickFormatter}
                tick={{ fill: '#6B7280' }}
              />
              <defs>
                <linearGradient id="colorAppProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="appProfit" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorAppProfit)" dot={false} />
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
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" reversed={true} axisLine={false} tickLine={false} style={{ direction: 'rtl', fontFamily: 'Cairo' }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={yAxisTickFormatter}
                tick={{ fill: '#6B7280' }}
              />
              <Bar dataKey="appShare" fill="#22C55E" />
              <Bar dataKey="merchantShare" fill="#EF4444" />
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
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-80 text-gray-500">
            <p>نوع الرسم البياني غير مدعوم</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('area')}
            className={`p-2 rounded ${chartType === 'area' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
            title="رسم بياني خطي"
          >
            <FaChartLine className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded ${chartType === 'bar' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
            title="رسم بياني عمودي"
          >
            <FaChartBar className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-grow h-80" style={{ direction: 'ltr' }}>
        {renderChart()}
      </div>
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
        {/* <li className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={onDownloadReport}>
          <span className="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875V15.75c0 1.036.84 1.875 1.875 1.875h4.5a.75.75 0 010 1.5h-4.5A3.375 3.375 0 012.25 15.75V3.375C2.25 2.339 3.09 1.5 4.125 1.5H9a.75.75 0 010 1.5zM15 1.5h3.375c1.036 0 1.875.84 1.875 1.875v12.375c0 1.036-.84 1.875-1.875 1.875h-4.5a.75.75 0 010-1.5h4.5c.276 0 .5-.224.5-.5V3.375a.5.5 0 00-.5-.5h-3.375a.75.75 0 010-1.5zM12 21a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
          </span>
          تحميل التقرير
        </li> */}
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
  const [reportType, setReportType] = useState('pdf');
  const [reportPeriod, setReportPeriod] = useState('all');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);

  const handleExport = async () => {
    try {
      console.log('Exporting report:', {
        type: reportType,
        period: reportPeriod,
        includeCharts,
        includeDetails
      });

      // Create export data
      const exportData = {
        title: 'تقرير الأرباح',
        period: reportPeriod,
        generatedAt: new Date().toLocaleString('ar-EG'),
        data: {
          cards: data?.cards || {},
          products: includeDetails ? data?.productsProfit || [] : [],
          charts: includeCharts ? {
            profitComparison: data?.profitComparison || [],
            appProfitEvolution: data?.appProfitEvolution || []
          } : null
        }
      };

      if (reportType === 'pdf') {
        // For PDF, we'll create a simple text-based report
        const reportText = generateTextReport(exportData);
        downloadTextFile(reportText, `profits-report-${Date.now()}.txt`);
      } else if (reportType === 'excel') {
        // For Excel, we'll create a CSV file
        const csvContent = generateCSVReport(exportData);
        downloadCSVFile(csvContent, `profits-report-${Date.now()}.csv`);
      } else if (reportType === 'csv') {
        const csvContent = generateCSVReport(exportData);
        downloadCSVFile(csvContent, `profits-report-${Date.now()}.csv`);
      }
      
      alert(`تم تصدير التقرير بنجاح كملف ${reportType.toUpperCase()}`);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      alert('حدث خطأ أثناء تصدير التقرير');
    }
  };

  const generateTextReport = (data) => {
    let report = `تقرير الأرباح\n`;
    report += `تاريخ الإنشاء: ${data.generatedAt}\n`;
    report += `الفترة: ${data.period}\n\n`;
    
    report += `الإحصائيات:\n`;
    report += `- متوسط حاصل الأرباح: ${data.data.cards.averageProfitMargin || 0}%\n`;
    report += `- حصة التطبيق: ${(data.data.cards.appShare || 0).toLocaleString()} د.ع\n`;
    report += `- حصة التاجر: ${(data.data.cards.merchantShare || 0).toLocaleString()} د.ع\n`;
    report += `- إجمالي المبيعات: ${(data.data.cards.totalSales || 0).toLocaleString()} د.ع\n\n`;
    
    if (data.data.products && data.data.products.length > 0) {
      report += `تفاصيل المنتجات:\n`;
      data.data.products.forEach((product, index) => {
        report += `${index + 1}. ${product.productName}\n`;
        report += `   - التاجر: ${product.merchantName}\n`;
        report += `   - سعر الجملة: ${product.wholesalePrice || 0} د.ع\n`;
        report += `   - سعر البيع: ${product.sellingPrice || 0} د.ع\n`;
        report += `   - حصة التطبيق: ${product.appShare || 0} د.ع\n`;
        report += `   - حصة التاجر: ${product.merchantShare || 0} د.ع\n\n`;
      });
    }
    
    return report;
  };

  const generateCSVReport = (data) => {
    let csv = 'نوع البيانات,القيمة,الوحدة\n';
    
    // Add cards data
    csv += `متوسط حاصل الأرباح,${data.data.cards.averageProfitMargin || 0},%\n`;
    csv += `حصة التطبيق,${data.data.cards.appShare || 0},د.ع\n`;
    csv += `حصة التاجر,${data.data.cards.merchantShare || 0},د.ع\n`;
    csv += `إجمالي المبيعات,${data.data.cards.totalSales || 0},د.ع\n`;
    
    if (data.data.products && data.data.products.length > 0) {
      csv += '\nالمنتج,التاجر,سعر الجملة,سعر البيع,حصة التطبيق,حصة التاجر\n';
      data.data.products.forEach(product => {
        csv += `"${product.productName}","${product.merchantName}",${product.wholesalePrice || 0},${product.sellingPrice || 0},${product.appShare || 0},${product.merchantShare || 0}\n`;
      });
    }
    
    return csv;
  };

  const downloadTextFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCSVFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal title="تصدير تقرير الأرباح" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع التقرير
          </label>
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الفترة الزمنية
          </label>
          <select 
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">جميع الفترات</option>
            <option value="monthly">شهري</option>
            <option value="yearly">سنوي</option>
            <option value="custom">فترة مخصصة</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
              className="ml-2 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">تضمين الرسوم البيانية</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeDetails}
              onChange={(e) => setIncludeDetails(e.target.checked)}
              className="ml-2 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">تضمين تفاصيل المنتجات</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          إلغاء
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          تصدير التقرير
        </button>
      </div>
    </Modal>
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
const Profits = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [showMerchantsModal, setShowMerchantsModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [merchantsData, setMerchantsData] = useState([]);
  const [chartType, setChartType] = useState('area');

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = API_CONFIG.ADMIN.PROFITS;
      
      // Add query parameters based on selected period
      const params = new URLSearchParams();
      if (selectedPeriod === 'monthly') {
        params.append('year', selectedYear.toString());
        params.append('month', selectedMonth.toString());
        params.append('period', 'monthly');
      } else if (selectedPeriod === 'yearly') {
        params.append('year', selectedYear.toString());
        params.append('period', 'yearly');
      } else {
        params.append('period', 'all');
      }
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      console.log('Fetching profits data from:', endpoint);
      const result = await apiCall(endpoint);
      console.log('Profits data received:', result);
      setData(result);
      
      // Aggregate merchants data
      const aggregatedMerchants = {};
      if (result.productsProfit) {
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
          aggregatedMerchants[product.merchantName].totalOrders += product.timesSold || 0;
          aggregatedMerchants[product.merchantName].netProfit += product.merchantShare || 0;
        });
      }
      setMerchantsData(Object.values(aggregatedMerchants));
    } catch (error) {
      console.error("Error fetching profits data:", error);
      // Set default data structure to prevent crashes
      setData({
        cards: {
          averageProfitMargin: 0,
          appShare: 0,
          merchantShare: 0,
          totalSales: 0
        },
        profitComparison: [],
        appProfitEvolution: [],
        productsProfit: []
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedPeriod, selectedYear, selectedMonth]);

  const handleTotalSalesClick = () => {
    setShowMerchantsModal(true);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleExportReport = () => {
    setShowExportModal(true);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setCurrentPage(1);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  const filteredProducts = data?.productsProfit?.filter(product => 
    product.productName?.toLowerCase().includes(searchText.toLowerCase()) ||
    product.merchantName?.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  if (loading) {
    return (
      <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <span className="mr-4 text-gray-600">جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
        <div className="text-center py-12 text-gray-500">
          <p>خطأ في تحميل البيانات</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const statsCards = [
    { 
      title: 'متوسط حاصل الأرباح', 
      value: `${data.cards?.averageProfitMargin || 0}%`, 
      icon: 'chart',
      trend: 'up',
      percentage: 8
    },
    { 
      title: 'حصة التطبيق', 
      value: `${(data.cards?.appShare || 0).toLocaleString()} د.ع`, 
      icon: 'wallet',
      trend: 'up',
      percentage: 12
    },
    { 
      title: 'حصة التاجر', 
      value: `${(data.cards?.merchantShare || 0).toLocaleString()} د.ع`, 
      icon: 'store',
      trend: 'up',
      percentage: 15
    },
    { 
      title: 'إجمالي المبيعات', 
      value: `${(data.cards?.totalSales || 0).toLocaleString()} د.ع`, 
      icon: 'orders',
      trend: 'up',
      percentage: 10,
      onClick: handleTotalSalesClick
    },
  ];

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الأرباح</h1>
        <div className="flex gap-4">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <FaDownload className="w-4 h-4" />
            تصدير التقرير
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            percentage={card.percentage}
            onClick={card.onClick}
          />
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 w-full md:w-auto">
            <Dropdown
              options={[
                { value: 'all', label: 'جميع الفترات' },
                { value: 'monthly', label: 'شهري' },
                { value: 'yearly', label: 'سنوي' }
              ]}
              value={selectedPeriod}
              onChange={handlePeriodChange}
              placeholder="اختر الفترة"
            />
            
            {selectedPeriod === 'monthly' && (
              <Dropdown
                options={[
                  { value: 1, label: 'يناير' },
                  { value: 2, label: 'فبراير' },
                  { value: 3, label: 'مارس' },
                  { value: 4, label: 'أبريل' },
                  { value: 5, label: 'مايو' },
                  { value: 6, label: 'يونيو' },
                  { value: 7, label: 'يوليو' },
                  { value: 8, label: 'أغسطس' },
                  { value: 9, label: 'سبتمبر' },
                  { value: 10, label: 'أكتوبر' },
                  { value: 11, label: 'نوفمبر' },
                  { value: 12, label: 'ديسمبر' }
                ]}
                value={selectedMonth}
                onChange={handleMonthChange}
                placeholder="اختر الشهر"
              />
            )}
            
            <Dropdown
              options={[
                { value: 2024, label: '2024' },
                { value: 2023, label: '2023' },
                { value: 2022, label: '2022' }
              ]}
              value={selectedYear}
              onChange={handleYearChange}
              placeholder="اختر السنة"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 w-full md:w-auto">
              <input
                type="text"
                placeholder="ابحث عن منتج أو تاجر..."
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartContainer 
          title="مقارنة حصة التطبيق والتاجر" 
          data={data.profitComparison || []} 
          chartType="sharedProfit" 
        />
        <ChartContainer 
          title="تطور أرباح التطبيق" 
          data={data.appProfitEvolution || []} 
          chartType="profitGrowth" 
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">تفاصيل أرباح المنتجات</h3>
        </div>
        
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>لا توجد منتجات</p>
            <p className="text-sm mt-2">تحقق من الفلاتر أو جرب البحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنتج
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاجر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سعر الجملة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سعر البيع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الفرق
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    حصة التطبيق
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    حصة التاجر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-right">
                {paginatedProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.merchantName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.wholesalePrice ? `${product.wholesalePrice.toLocaleString()} د.ع` : '0 د.ع'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.sellingPrice ? `${product.sellingPrice.toLocaleString()} د.ع` : '0 د.ع'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.priceDifference ? `${product.priceDifference.toLocaleString()} د.ع` : '0 د.ع'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.appShare ? `${product.appShare.toLocaleString()} د.ع` : '0 د.ع'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.merchantShare ? `${product.merchantShare.toLocaleString()} د.ع` : '0 د.ع'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleProductClick(product)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-gray-100"
                          title="عرض التفاصيل"
                        >
                          <FaEye className="w-4 h-4" />
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
        {filteredProducts.length > 10 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredProducts.length / 10)}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showMerchantsModal && (
        <MerchantsModal 
          merchants={merchantsData} 
          onClose={() => setShowMerchantsModal(false)} 
        />
      )}

      {showProductModal && selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => {
            setShowProductModal(false);
            setSelectedProduct(null);
          }} 
        />
      )}

      {showExportModal && (
        <ExportReportModal 
          onClose={() => setShowExportModal(false)} 
        />
      )}
    </div>
  );
};
export default Profits;