import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FaChevronDown, FaStore, FaChartBar, FaFilePdf } from 'react-icons/fa';
import { MdInfoOutline } from 'react-icons/md';
import { RiCloseFill } from 'react-icons/ri';
import { BsThreeDots } from 'react-icons/bs';

const statsCards = [
  { title: 'متوسط حاصل الأرباح', value: '20%', icon: 'bag' },
  { title: 'حصة التطبيق', value: '70,000 د.ك', icon: 'mobile' },
  { title: 'حصة التاجر', value: '280,000 د.ك', icon: 'store' },
  { title: 'إجمالي المبيعات', value: '350,000 د.ك', icon: 'package' },
];

const productsData = [
  { name: 'تيشيرت رجالي', wholesalePrice: '2.500 د.ك', retailPrice: '4.000 د.ك', discount: '0.000 د.ك', difference: '1.500 د.ك', appShare: '0.600 د.ك', merchantShare: '3.400 د.ك', ratio: '15%', category: 'الملابس', seller: 'متجر فيت ستور', referenceBarcode: 'PRD-4589', salesCount: 47, rating: 3.5, netProfit: '159.800 د.ك' },
  { name: 'بنطال رياضي', wholesalePrice: '4,000 د.ك', retailPrice: '6,500 د.ك', discount: '0.500 د.ك', difference: '2,000 د.ك', appShare: '1,300 د.ك', merchantShare: '5,200 د.ك', ratio: '20%', category: 'الملابس', seller: 'متجر جديد', referenceBarcode: 'PRD-4590', salesCount: 12, rating: 4.0, netProfit: '120.000 د.ك' },
  { name: 'جاكيت شتوي', wholesalePrice: '12,000 د.ك', retailPrice: '18,000 د.ك', discount: '1,000 د.ك', difference: '5,000 د.ك', appShare: '1,000 د.ك', merchantShare: '4,000 د.ك', ratio: '20%', category: 'ملابس شتوية', seller: 'محل الدفء', referenceBarcode: 'PRD-4591', salesCount: 8, rating: 5.0, netProfit: '150.000 د.ك' },
  { name: 'حذاء رياضي', wholesalePrice: '25,000 د.ك', retailPrice: '40,000 د.ك', discount: '5,000 د.ك', difference: '10,000 د.ك', appShare: '2,000 د.ك', merchantShare: '8,000 د.ك', ratio: '20%', category: 'أحذية', seller: 'متجر الأحذية', referenceBarcode: 'PRD-4592', salesCount: 25, rating: 4.5, netProfit: '200.000 د.ك' },
  { name: 'بنطال رياضي', wholesalePrice: '4,000 د.ك', retailPrice: '6,500 د.ك', discount: '0.500 د.ك', difference: '2,000 د.ك', appShare: '1,300 د.ك', merchantShare: '5,200 د.ك', ratio: '20%', category: 'الملابس', seller: 'متجر رياضي', referenceBarcode: 'PRD-4593', salesCount: 30, rating: 4.0, netProfit: '180.000 د.ك' },
  { name: 'بنطال رياضي', wholesalePrice: '4,000 د.ك', retailPrice: '6,500 د.ك', discount: '0.500 د.ك', difference: '2,000 د.ك', appShare: '1,300 د.ك', merchantShare: '5,200 د.ك', ratio: '20%', category: 'الملابس', seller: 'متجر كلاسيك', referenceBarcode: 'PRD-4594', salesCount: 50, rating: 3.0, netProfit: '220.000 د.ك' },
  { name: 'بنطال رياضي', wholesalePrice: '4,000 د.ك', retailPrice: '6,500 د.ك', discount: '0.500 د.ك', difference: '2,000 د.ك', appShare: '1,300 د.ك', merchantShare: '5,200 د.ك', ratio: '20%', category: 'الملابس', seller: 'متجر فاشون', referenceBarcode: 'PRD-4595', salesCount: 65, rating: 4.5, netProfit: '250.000 د.ك' },
  { name: 'بنطال رياضي', wholesalePrice: '4,000 د.ك', retailPrice: '6,500 د.ك', discount: '0.500 د.ك', difference: '2,000 د.ك', appShare: '1,300 د.ك', merchantShare: '5,200 د.ك', ratio: '20%', category: 'الملابس', seller: 'متجر الموضة', referenceBarcode: 'PRD-4596', salesCount: 72, rating: 4.0, netProfit: '300.000 د.ك' },
];

const sharedProfitChartData = [
  { name: 'يناير', appShare: 7500, merchantShare: 14000 },
  { name: 'فبراير', appShare: 6000, merchantShare: 10000 },
  { name: 'مارس', appShare: 8500, merchantShare: 13000 },
  { name: 'أبريل', appShare: 9200, merchantShare: 12500 },
  { name: 'مايو', appShare: 9200, merchantShare: 15000 },
  { name: 'يونيو', appShare: 8000, merchantShare: 12000 },
  { name: 'يوليو', appShare: 9000, merchantShare: 18000 },
  { name: 'اغسطس', appShare: 10000, merchantShare: 15000 },
];

const profitGrowthChartData = [
  { name: 'يناير', appProfit: 1050, merchantProfit: 1750 },
  { name: 'فبراير', appProfit: 1100, merchantProfit: 1800 },
  { name: 'مارس', appProfit: 950, merchantProfit: 1500 },
  { name: 'أبريل', appProfit: 800, merchantProfit: 1200 },
  { name: 'مايو', appProfit: 700, merchantProfit: 1050 },
  { name: 'يونيو', appProfit: 650, merchantProfit: 900 },
  { name: 'يوليو', appProfit: 750, merchantProfit: 1000 },
  { name: 'أغسطس', appProfit: 800, merchantProfit: 1300 },
  { name: 'سبتمبر', appProfit: 920, merchantProfit: 1400 },
  { name: 'أكتوبر', appProfit: 850, merchantProfit: 1100 },
  { name: 'نوفمبر', appProfit: 900, merchantProfit: 1200 },
  { name: 'ديسمبر', appProfit: 1000, merchantProfit: 1500 },
];

const CustomSharedTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const merchantValue = payload.find(p => p.dataKey === 'merchantShare').value;
    const appValue = payload.find(p => p.dataKey === 'appShare').value;

    return (
      <div className="bg-gray-800 text-white p-3 rounded-md text-right border border-white font-sans">
        <p className="font-bold text-sm">{label}</p>
        <p className="text-sm">
          <span style={{ color: '#EF4444' }}>●</span> {`التاجر: ${merchantValue.toLocaleString()} د.ك +1.8% مقارنة قياس`}
        </p>
        <p className="text-sm">
          <span style={{ color: '#22C55E' }}>●</span> {`التطبيق: ${appValue.toLocaleString()} د.ك +2.2% مقارنة قياس`}
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
        <p className="font-bold text-sm">{`القيمة: ${payload[0].value.toLocaleString()}K`}</p>
      </div>
    );
  }
  return null;
};

const ChartContainer = ({ title, data, chartType }) => {
  const [timeframe, setTimeframe] = useState('شهر');

  const getProfitYAxisTicks = () => {
    return [50, 100, 250, 650, 800, 1000, 5000];
  };

  const getSharedYAxisTicks = () => {
    return [0, 5000, 10000, 15000, 20000];
  };

  const yAxisTickFormatter = (value) => {
    if (chartType === 'sharedProfit') {
      return value.toLocaleString();
    }

    if (value >= 1000) {
      return `${(value / 1000)}m`;
    }
    return `${value}k`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button className={`px-3 py-1 text-sm rounded-full ${timeframe === 'يوم' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setTimeframe('يوم')}>يوم</button>
          <button className={`px-3 py-1 text-sm rounded-full ${timeframe === 'أسبوع' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setTimeframe('أسبوع')}>أسبوع</button>
          <button className={`px-3 py-1 text-sm rounded-full ${timeframe === 'شهر' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setTimeframe('شهر')}>شهر</button>
        </div>
      </div>
      <div className="flex-grow h-80" style={{ direction: 'ltr' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" reversed={true} axisLine={false} tickLine={false} style={{ direction: 'rtl', fontFamily: 'Cairo' }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              ticks={chartType === 'sharedProfit' ? getSharedYAxisTicks() : getProfitYAxisTicks()}
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
                  <linearGradient id="colorMerchant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="appProfit" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorApp)" dot={false} />
                <Area type="monotone" dataKey="merchantProfit" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#colorMerchant)" dot={false} />
                <Tooltip content={<CustomProfitTooltip />} />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  const icons = {
    'bag': <div className="bg-gray-100 p-3 rounded-xl"><FaChartBar className="text-red-500 text-2xl" /></div>,
    'mobile': <div className="bg-gray-100 p-3 rounded-xl"><FaStore className="text-red-500 text-2xl" /></div>,
    'store': <div className="bg-gray-100 p-3 rounded-xl"><FaChartBar className="text-red-500 text-2xl" /></div>,
    'package': <div className="bg-gray-100 p-3 rounded-xl"><FaStore className="text-red-500 text-2xl" /></div>,
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between text-right">
      <div className="flex flex-col">
        <span className="text-gray-400 text-xs mb-1">{title}</span>
        <p className="text-xl font-bold mb-1">{value}</p>
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
  <td className="p-3 text-xs text-gray-700">{children}</td>
);

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;
  const ratingStars = product.rating ? Math.floor(product.rating) : 0;
  const hasHalfStar = product.rating ? product.rating % 1 !== 0 : false;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-4 rounded-lg shadow-xl max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">تفاصيل المنتج</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <RiCloseFill size={24} />
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">اسم المنتج</span>
            <span className="font-medium text-gray-800">{product.name}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">التصنيف</span>
            <span className="font-medium text-gray-800">{product.category}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">التاجر</span>
            <span className="font-medium text-gray-800">{product.seller}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">الكود المرجعي</span>
            <span className="font-medium text-gray-800">{product.referenceBarcode}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">عدد المرات المباعة</span>
            <span className="font-medium text-gray-800">{product.salesCount} عملية</span>
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
            <span className="font-medium text-gray-800">{product.wholesalePrice}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">سعر البيع المفرد</span>
            <span className="font-medium text-gray-800">{product.retailPrice}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">الخصم</span>
            <span className="font-medium text-gray-800">{product.discount}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">الفرق</span>
            <span className="font-medium text-gray-800">{product.difference}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">نسبة حصة التطبيق</span>
            <span className="font-medium text-gray-800">{product.ratio}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">حصة التطبيق</span>
            <span className="font-medium text-gray-800">{product.appShare}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">حصة التاجر</span>
            <span className="font-medium text-gray-800">{product.merchantShare}</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="font-semibold text-gray-500">صافي ربح التاجر</span>
            <span className="font-medium text-gray-800">{product.netProfit}</span>
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
          <span className="ml-2"><MdInfoOutline size={18} /></span>
          عرض التفاصيل
        </li>
        <li className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={onDownloadReport}>
          <span className="ml-2"><FaFilePdf size={18} /></span>
          تحميل التقرير
        </li>
        <li className="flex items-center p-2 text-red-500 hover:bg-gray-100 rounded-md cursor-pointer" onClick={onClose}>
          <span className="ml-2"><RiCloseFill size={18} /></span>
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
            <RiCloseFill size={24} />
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

const ProductTable = () => {
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
              <Th>الخصم</Th>
              <Th>الفرق</Th>
              <Th>حصة التطبيق</Th>
              <Th>حصة التاجر</Th>
              <Th>النسبة للتجار</Th>
              <Th>الإجراءات</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-right">
            {productsData.map((product, index) => (
              <tr key={index}>
                <Td>{product.name}</Td>
                <Td>{product.wholesalePrice}</Td>
                <Td>{product.retailPrice}</Td>
                <Td>{product.discount}</Td>
                <Td>{product.difference}</Td>
                <Td>{product.appShare}</Td>
                <Td>{product.merchantShare}</Td>
                <Td>{product.ratio}</Td>
                <Td>
                  <div className="relative">
                    <button className="text-gray-500 hover:text-gray-700" onClick={() => handleMoreClick(product, index)}>
                      <BsThreeDots className="text-xl" />
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
        <span className="text-gray-700">إجمالي المنتجات: 8764</span>
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
  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="مقارنة حصة التطبيق والتاجر" data={sharedProfitChartData} chartType="sharedProfit" />
        <ChartContainer title="تطور أرباح التطبيق" data={profitGrowthChartData} chartType="profitGrowth" />
      </div>
      <ProductTable />
    </div>
  );
};

export default Dashboard;