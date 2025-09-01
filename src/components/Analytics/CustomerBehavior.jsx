import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, AreaChart, Area,
} from 'recharts';
import { ChartBarIcon, UsersIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

const dataBar = [
  { name: 'اسم المحافظة', value: 25000 },
  { name: 'اسم المحافظة', value: 12000 },
  { name: 'اسم المحافظة', value: 45000 },
  { name: 'اسم المحافظة', value: 15000 },
];

const dataLine = [
  { month: 'ديسمبر', visits: 180000, cart: 150000, purchases: 100000 },
  { month: 'نوفمبر', visits: 100000, cart: 80000, purchases: 60000 },
  { month: 'اكتوبر', visits: 200000, cart: 180000, purchases: 150000 },
  { month: 'سبتمبر', visits: 350000, cart: 300000, purchases: 250000 },
  { month: 'أغسطس', visits: 250000, cart: 220000, purchases: 200000 },
  { month: 'يوليو', visits: 180000, cart: 160000, purchases: 140000 },
  { month: 'يونيو', visits: 200000, cart: 180000, purchases: 160000 },
  { month: 'مايو', visits: 280000, cart: 250000, purchases: 220000 },
  { month: 'أبريل', visits: 8322, cart: 7432, purchases: 6754 },
  { month: 'مارس', visits: 100000, cart: 90000, purchases: 80000 },
  { month: 'فبراير', visits: 80000, cart: 75000, purchases: 70000 },
  { month: 'يناير', visits: 90000, cart: 85000, purchases: 80000 },
];

const products = [
  {
    name: "هاتف ذكي A15 128GB",
    image: "http://googleusercontent.com/file_content/0",
    visits: "١٣,٤٥٠",
    cartAdds: "٢,١٤٠",
    conversion: "8.6%",
    sales: "١,٠٧٠",
  },
  {
    name: "هاتف ذكي A15 128GB",
    image: "http://googleusercontent.com/file_content/0",
    visits: "١٣,٤٥٠",
    cartAdds: "٢,١٤٠",
    conversion: "8.6%",
    sales: "١,٠٧٠",
  },
  {
    name: "هاتف ذكي A15 128GB",
    image: "http://googleusercontent.com/file_content/0",
    visits: "١٣,٤٥٠",
    cartAdds: "٢,١٤٠",
    conversion: "8.6%",
    sales: "١,٠٧٠",
  },
  {
    name: "هاتف ذكي A15 128GB",
    image: "http://googleusercontent.com/file_content/0",
    visits: "١٣,٤٥٠",
    cartAdds: "٢,١٤٠",
    conversion: "8.6%",
    sales: "١,٠٧٠",
  },
  {
    name: "هاتف ذكي A15 128GB",
    image: "http://googleusercontent.com/file_content/0",
    visits: "١٣,٤٥٠",
    cartAdds: "٢,١٤٠",
    conversion: "8.6%",
    sales: "١,٠٧٠",
  },
];

const funnelData = [
  { name: 'زيارات المنتج', value: 250000, color: '#3B82F6', fadedColor: '#BFDBFE' },
  { name: 'الإضافة للسلة', value: 8200, color: '#EF4444', fadedColor: '#FEE2E2' },
  { name: 'بدء الدفع', value: 2500, color: '#F59E0B', fadedColor: '#FEF3C7' },
  { name: 'شراء', value: 9540, color: '#22C55E', fadedColor: '#DCFCE7' },
];

const KPICard = ({ icon: Icon, title, value, unit, change, trend }) => {
  return (
    <div className="flex items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="bg-gray-100 rounded-lg p-3">
        <Icon className="h-8 w-8 text-gray-700" />
      </div>
      <div className="flex-grow text-right pr-4">
        <p className="text-gray-500 text-sm">{title}</p>
        <div className="font-bold text-2xl mt-1">
          {value} {unit}
        </div>
        <p className={`mt-1 text-xs font-semibold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? '▲' : '▼'} {change}% عن الفترة السابقة
        </p>
      </div>
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-2 rounded-lg text-sm">
        <p className="font-bold">{label}</p>
        <p>القيمة: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-right">
        <div className="mb-2">
          <p className="text-gray-500 text-sm">{label}</p>
        </div>
        {payload.map((item, index) => (
          <p key={index} className="text-sm my-1">
            <span style={{ color: item.stroke }}>●</span>
            &nbsp;
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomizedBar = (props) => {
  const { x, y, width, height, value } = props;
  if (value === 45000) {
    return (
      <>
        <rect x={x} y={y} width={width} height={height} rx={10} ry={10} fill="#EBCB61" />
        <text
          x={x + width / 2}
          y={y - 10}
          fill="#333"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-bold"
        >
          القيمة: {value}
        </text>
        <line
          x1={x + width / 2}
          y1={y - 5}
          x2={x + width / 2}
          y2={y + height + 5}
          stroke="#EBCB61"
          strokeDasharray="3 3"
        />
      </>
    );
  }
  return <rect x={x} y={y} width={width} height={height} rx={10} ry={10} fill="#374151" />;
};

const BarChartComponent = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 w-full">
      <h2 className="text-right text-lg font-bold mb-4">نشاط الزبائن حسب المحافظات</h2>
      <BarChart width={500} height={300} data={dataBar}>
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} orientation="right" scale="log" domain={[500, 50000]} />
        <Tooltip content={<CustomBarTooltip />} />
        <Bar dataKey="value" shape={<CustomizedBar />} fill="#374151" />
      </BarChart>
    </div>
  );
};

const LineChartComponent = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 w-full">
      <h2 className="text-right text-lg font-bold mb-4">اتجاه التفاعل عبر الزمن</h2>
      <AreaChart width={700} height={300} data={dataLine} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="month" axisLine={false} tickLine={false} reversed={true} />
        <YAxis axisLine={false} tickLine={false} orientation="right" scale="log" domain={[15000, 450000]} />
        <Tooltip content={<CustomLineTooltip />} />
        <Area type="monotone" dataKey="visits" stroke="#ef4444" fill="url(#colorVisits)" />
        <defs>
          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Line type="monotone" dataKey="visits" stroke="#ef4444" strokeWidth={2} dot={false} />
      </AreaChart>
    </div>
  );
};

const ProductsTable = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2 text-sm text-gray-500">
          <div className="py-1 px-3 rounded-lg bg-gray-100">يوم</div>
          <div className="py-1 px-3 rounded-lg bg-gray-100">اسبوع</div>
          <div className="py-1 px-3 rounded-lg bg-red-500 text-white">شهر</div>
        </div>
        <h2 className="text-right text-lg font-bold">المنتجات الأكثر زيارة (والتحويل)</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-right divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span className="ml-1">المبيعات</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span className="ml-1">التحويل %</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span className="ml-1">الإضافة للسلة</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end">
                  <span className="ml-1">الزيارات</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                المنتج
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product, index) => (
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

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 ml-2">عرض في الصفحة</span>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
              <option>5</option>
              <option>10</option>
              <option>25</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pr-2 text-gray-700">
              <ChevronDownIcon className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <div className="flex space-x-1">
            <span className="py-1 px-3 rounded-md text-sm text-gray-700">5</span>
            <span className="py-1 px-3 rounded-md text-sm text-gray-700">4</span>
            <span className="py-1 px-3 rounded-md text-sm text-gray-700">3</span>
            <span className="py-1 px-3 rounded-md text-sm text-gray-700">2</span>
            <span className="py-1 px-3 rounded-md text-sm bg-red-500 text-white">1</span>
          </div>
          <button className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="text-sm text-gray-700">
          إجمالي المنتجات: 8764
        </div>
      </div>
    </div>
  );
};

const FunnelChartComponent = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-6 w-full">
      <h2 className="text-right text-lg font-bold mb-8">قمع التحويل (فتح المنتج {'->'} شراء)</h2>
      <div className="space-y-8">
        {funnelData.map((data, index) => (
          <div key={index} className="flex items-center justify-end">
            <div className="flex-grow h-4 rounded-full" style={{ backgroundColor: data.fadedColor, direction: 'ltr' }}>
              <div
                className="h-4 rounded-full"
                style={{
                  width: `${(data.value / funnelData[0].value) * 100}%`,
                  backgroundColor: data.color
                }}
              ></div>
            </div>
            <div className="text-sm font-bold w-20 text-center pr-4">
              {data.value.toLocaleString('en-US')}
            </div>
            <div className="text-sm text-gray-700 w-32 text-right">
              {data.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-start items-center p-4 bg-white shadow-md mb-6">
        <nav>
          <ul className="flex space-x-4">
            <li>
              <div className="text-red-500 font-bold">المبيعات</div>
            </li>
            <li>
              <div className="text-gray-600">سلوك الزبائن</div>
            </li>
          </ul>
        </nav>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <KPICard
          icon={ChartBarIcon}
          title="معدل التحويل"
          value="7.8"
          unit="%"
          change="9"
          trend="up"
        />
        <KPICard
          icon={UsersIcon}
          title="الزوار المتفردون"
          value="1,500"
          unit="زائر"
          change="8"
          trend="up"
        />
        <KPICard
          icon={ShoppingBagIcon}
          title="المنتجات المجهزة"
          value="320"
          unit="سلة"
          change="2"
          trend="down"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <BarChartComponent />
        <LineChartComponent />
      </div>

      <ProductsTable />

      <FunnelChartComponent />
    </div>
  );
};

export default App;
