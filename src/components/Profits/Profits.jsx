import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
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
const ChartContainer = ({ title, data, chartType, setChartType }) => {
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
        {/* <div className="mt-4">
          <button className="w-full bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition">تعديل</button>
        </div> */}
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
      console.log('Exporting report...', { type: reportType, period: reportPeriod, includeCharts, includeDetails });
      const exportData = { title: 'تقرير الأرباح', period: reportPeriod, generatedAt: new Date().toLocaleString('ar-EG'), data: { cards: data?.cards || {}, products: includeDetails ? data?.productsProfit || [] : [], charts: includeCharts ? { profitComparison: data?.profitComparison || [], appProfitEvolution: data?.appProfitEvolution || [] } : null } };
      if (reportType === 'pdf') {
        const reportText = generateTextReport(exportData);
        downloadTextFile(reportText, `profits-report-${Date.now()}.txt`);
      } else if (reportType === 'excel') {
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
        report += ` - التاجر: ${product.merchantName}\n`;
        report += ` - سعر الجملة: ${product.wholesalePrice || 0} د.ع\n`;
        report += ` - سعر البيع: ${product.sellingPrice || 0} د.ع\n`;
        report += ` - حصة التطبيق: ${product.appShare || 0} د.ع\n`;
        report += ` - حصة التاجر: ${product.merchantShare || 0} د.ع\n`;
        report += ` - مرات البيع: ${product.timesSold || 0}\n`;
        report += ` - التقييم: ${product.customerRating || 0}\n`;
        report += `\n`;
      });
    }
    if (data.data.charts && data.data.charts.profitComparison) {
      report += `مقارنة الأرباح:\n`;
      data.data.charts.profitComparison.forEach(item => {
        report += ` - ${item.month}: حصة التاجر: ${(item.merchantShare || 0).toLocaleString()}, حصة التطبيق: ${(item.appShare || 0).toLocaleString()}\n`;
      });
    }
    return report;
  };
  const generateCSVReport = (data) => {
    let csv = "تقرير الأرباح\n";
    csv += "المعلومات العامة\n";
    csv += "المتوسط الربحي,حصة التطبيق,حصة التاجر,إجمالي المبيعات\n";
    csv += `${data.data.cards.averageProfitMargin},${data.data.cards.appShare},${data.data.cards.merchantShare},${data.data.cards.totalSales}\n\n`;
    csv += "تفاصيل المنتجات\n";
    csv += "اسم المنتج,التصنيف,التاجر,مرات البيع,سعر الجملة,سعر البيع,حصة التطبيق,حصة التاجر\n";
    data.data.products.forEach(product => {
      csv += `"${product.productName}",${product.categoryName},"${product.merchantName}",${product.timesSold},${product.wholesalePrice},${product.sellingPrice},${product.appShare},${product.merchantShare}\n`;
    });
    return csv;
  };
  const downloadTextFile = (content, fileName) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const downloadCSVFile = (content, fileName) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  return (
    <Modal onClose={onClose}>
      <div className="p-4 rounded-lg shadow-xl" dir="rtl">
        <h2 className="text-xl font-bold mb-4">تصدير التقرير</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">نوع التقرير</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="radio" name="reportType" value="pdf" checked={reportType === 'pdf'} onChange={() => setReportType('pdf')} className="form-radio text-red-600" />
                <span className="mr-2">PDF</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="reportType" value="excel" checked={reportType === 'excel'} onChange={() => setReportType('excel')} className="form-radio text-red-600" />
                <span className="mr-2">Excel</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="reportType" value="csv" checked={reportType === 'csv'} onChange={() => setReportType('csv')} className="form-radio text-red-600" />
                <span className="mr-2">CSV</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">الفترة</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="radio" name="reportPeriod" value="all" checked={reportPeriod === 'all'} onChange={() => setReportPeriod('all')} className="form-radio text-red-600" />
                <span className="mr-2">كامل الفترة</span>
              </label>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center text-gray-700 font-semibold">
              <input type="checkbox" checked={includeCharts} onChange={(e) => setIncludeCharts(e.target.checked)} className="form-checkbox text-red-600" />
              <span className="mr-2">تضمين الرسوم البيانية</span>
            </label>
            <label className="flex items-center text-gray-700 font-semibold">
              <input type="checkbox" checked={includeDetails} onChange={(e) => setIncludeDetails(e.target.checked)} className="form-checkbox text-red-600" />
              <span className="mr-2">تضمين تفاصيل المنتجات</span>
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition">إلغاء</button>
          <button onClick={handleExport} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">تصدير</button>
        </div>
      </div>
    </Modal>
  );
};
const Profits = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMerchantsModal, setShowMerchantsModal] = useState(false);
  const [merchantsData, setMerchantsData] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [sharedProfitChartType, setSharedProfitChartType] = useState('sharedProfit');
  const [appProfitChartType, setAppProfitChartType] = useState('profitGrowth');
  const [productCategory, setProductCategory] = useState('all');
  const [productRating, setProductRating] = useState('all');
  const token = localStorage.getItem('userToken');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://products-api.cbc-apps.net/admin/dashboard/profits', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Replace YOUR_AUTH_TOKEN_HERE with your actual token
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  const filteredProducts = data?.productsProfit?.filter(product => {
    const matchesSearchTerm = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) || product.merchantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = productCategory === 'all' || product.categoryName === productCategory;
    const matchesRating = productRating === 'all' || (product.customerRating >= parseFloat(productRating) && product.customerRating < parseFloat(productRating) + 1);
    return matchesSearchTerm && matchesCategory && matchesRating;
  }) || [];
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortConfig.key !== null) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });
  const uniqueCategories = [...new Set(data?.productsProfit?.map(p => p.categoryName))] || [];
  const totalPages = Math.ceil(sortedProducts.length / 10);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * 10, currentPage * 10);
  const profitComparisonData = data?.profitComparison || [];
  const appProfitEvolutionData = data?.appProfitEvolution || [];
  const totalSalesPieData = [
    { name: 'حصة التطبيق', value: data?.cards?.appShare || 0 },
    { name: 'حصة التاجر', value: data?.cards?.merchantShare || 0 },
  ];
  const COLORS = ['#22C55E', '#EF4444'];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <p className="text-xl font-bold">حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6 font-cairo" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">الأرباح</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowExportModal(true)} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition flex items-center gap-2">
            <FaDownload />
            تصدير تقرير
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="متوسط حاصل الأرباح" value={`${data?.cards?.averageProfitMargin || 0}%`} icon="profit" color="green" />
        <StatCard title="إجمالي المبيعات" value={`${(data?.cards?.totalSales || 0).toLocaleString()} د.ع`} icon="sales" color="blue" />
        <StatCard title="حصة التطبيق" value={`${(data?.cards?.appShare || 0).toLocaleString()} د.ع`} icon="appShare" color="red" />
        <StatCard title="حصة التاجر" value={`${(data?.cards?.merchantShare || 0).toLocaleString()} د.ع`} icon="merchantShare" color="orange" />
      </div>
      <div className="grid  gap-6 mb-8">
        {/* <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4">توزيع إجمالي المبيعات</h3>
          <div className="w-full h-80 flex-grow" style={{ direction: 'ltr' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={totalSalesPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {totalSalesPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div> */}
        <ChartContainer title="مقارنة الأرباح" data={profitComparisonData} chartType={sharedProfitChartType} setChartType={setSharedProfitChartType} />
      </div>
      <div className="grid grid-cols-1 gap-6 mb-8">
        <ChartContainer title="تطور أرباح التطبيق" data={appProfitEvolutionData} chartType={appProfitChartType} setChartType={setAppProfitChartType} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">أرباح المنتجات</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {/* <Dropdown
              options={[{ value: 'all', label: 'جميع التصنيفات' }, ...uniqueCategories.map(cat => ({ value: cat, label: cat }))]}
              selectedValue={productCategory}
              onSelect={setProductCategory}
              label="التصنيف"
            />
            <Dropdown
              options={[
                { value: 'all', label: 'جميع التقييمات' },
                { value: '5', label: '5 نجوم' },
                { value: '4', label: '4 نجوم' },
                { value: '3', label: '3 نجوم' },
                { value: '2', label: '2 نجوم' },
                { value: '1', label: '1 نجمة' },
                { value: '0', label: '0 نجوم' },
              ]}
              selectedValue={productRating}
              onSelect={setProductRating}
              label="التقييم"
            /> */}
          </div>
        </div>
        {paginatedProducts.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-500">
            <p>لا توجد منتجات مطابقة لعملية البحث.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-right">
                <tr>
                  <Th>اسم المنتج</Th>
                  <Th className="cursor-pointer" onClick={() => handleSort('wholesalePrice')}>
                    سعر الجملة <span className="text-xs text-gray-400">{sortConfig.key === 'wholesalePrice' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</span>
                  </Th>
                  <Th className="cursor-pointer" onClick={() => handleSort('sellingPrice')}>
                    سعر البيع <span className="text-xs text-gray-400">{sortConfig.key === 'sellingPrice' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</span>
                  </Th>
                  <Th className="cursor-pointer" onClick={() => handleSort('priceDifference')}>
                    الفرق <span className="text-xs text-gray-400">{sortConfig.key === 'priceDifference' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</span>
                  </Th>
                  <Th className="cursor-pointer" onClick={() => handleSort('appShare')}>
                    حصة التطبيق <span className="text-xs text-gray-400">{sortConfig.key === 'appShare' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</span>
                  </Th>
                  <Th className="cursor-pointer" onClick={() => handleSort('merchantShare')}>
                    حصة التاجر <span className="text-xs text-gray-400">{sortConfig.key === 'merchantShare' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</span>
                  </Th>
                  <Th className="cursor-pointer" onClick={() => handleSort('timesSold')}>
                    عدد مرات البيع <span className="text-xs text-gray-400">{sortConfig.key === 'timesSold' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}</span>
                  </Th>
                  <Th>الخيارات</Th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-right">
                {paginatedProducts.map((product) => (
                  <tr key={product.productId}>
                    <Td>{product.productName}</Td>
                    <Td>{product.wholesalePrice}</Td>
                    <Td>{product.sellingPrice}</Td>
                    <Td>{product.priceDifference}</Td>
                    <Td>{product.appShare}</Td>
                    <Td>{product.merchantShare}</Td>
                    <Td>{product.timesSold}</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleProductClick(product)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-gray-100"
                          title="عرض التفاصيل"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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