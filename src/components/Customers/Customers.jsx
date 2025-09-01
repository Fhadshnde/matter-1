import React, { useState } from 'react';
import { BsThreeDots, BsPerson } from 'react-icons/bs';
import { BiBlock } from 'react-icons/bi';
import { PiNotePencil } from 'react-icons/pi';
import { FaMagnifyingGlass, FaRegClock, FaRegCalendarDays } from 'react-icons/fa6';
import UserDetailsPage from './UserDetailsPage';

const dummyUser = {
  name: 'أحمد عبد الله',
  mobile: '+964770000000',
  email: 'ahmad@nike.com',
  city: 'بغداد',
  registrationDate: '2024-11-10',
  status: 'نشط',
  profilePicture: 'http://googleusercontent.com/file_content/0',
};

const mainTableUsers = Array(10).fill({
  name: 'أحمد عبد الله',
  mobile: '+966550001234',
  email: 'Ahmed12@gmail.com',
  orders: 15,
  lastOrderDate: '2025-08-01',
  status: 'نشط',
});

const dashboardCards = [
  { title: 'إجمالي الزبائن', value: '3,420 زبون', icon: <BsPerson />, percentage: '8% ▲', change: 1 },
  { title: 'زبائن عندهم طلبات', value: '1,850 زبون', icon: <FaRegCalendarDays />, percentage: '2% ▲', change: 1 },
  { title: 'زبائن لم يحظرهم', value: '120 زبون', icon: <BiBlock />, percentage: '8% ▲', change: 1 },
  { title: 'نسبة تراجع الشراء', value: '27%', icon: <FaRegClock />, percentage: '6% ▲', change: 1 },
];

const StatusBadge = ({ status }) => {
  const colorMap = {
    'نشط': 'bg-green-100 text-green-700',
    'بانتظار الشحن': 'bg-yellow-100 text-yellow-700',
    'مدفوع': 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${colorMap[status]}`}>
      {status}
    </span>
  );
};

const Th = ({ children, className = '' }) => (
  <th className={`p-3 font-semibold text-gray-500 ${className}`}>{children}</th>
);

const Td = ({ children }) => (
  <td className="p-3 text-xs text-gray-700">{children}</td>
);

const MoreOptionsDashboard = ({ onClose, onMoreDetails, onAddNote }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg py-1.5 w-40 text-right absolute mt-1.5 left-0 border border-gray-200 z-10">
      <button
        onClick={() => {
          onMoreDetails();
          onClose();
        }}
        className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
      >
        <FaMagnifyingGlass className="text-base text-gray-400" />
        عرض التفاصيل
      </button>
      <div className="border-t border-gray-200 my-1.5"></div>
      <button
        onClick={() => {
          onAddNote();
          onClose();
        }}
        className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
      >
        <PiNotePencil className="text-base text-gray-400" />
        اضافه ملاحظه
      </button>
    </div>
  );
};

const Card = ({ title, value, icon, percentage, change }) => (
  <div className="bg-white rounded-lg p-4 flex items-center justify-between text-right shadow-sm">
    <div className="flex flex-col">
      <div className="flex items-center space-x-1.5 rtl:space-x-reverse mb-1">
        <span className="text-gray-400 text-xs">{title}</span>
        <BsThreeDots className="text-gray-400 text-base" />
      </div>
      <p className="text-xl font-semibold mb-1">{value}</p>
      <span className={`text-xs ${change < 0 ? 'text-red-500' : 'text-green-500'}`}>
        {percentage}
        <span className="mr-1">{change < 0 ? '▼' : '▲'}</span>
        <span className="text-gray-400 mr-1">عن الفترة السابقة</span>
      </span>
    </div>
    <div className="bg-gray-100 p-2.5 rounded-full text-xl text-red-500">
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(dummyUser);
  const [showMoreOptions, setShowMoreOptions] = useState(null);

  if (showUserDetails) {
    return <UserDetailsPage user={selectedUser} onClose={() => setShowUserDetails(false)} />;
  }

  return (
    <div dir="rtl" className="bg-gray-100 min-h-screen p-7 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        {dashboardCards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-5 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">إدارة الزبائن</h2>
          <BsThreeDots className="text-gray-400 text-xl" />
        </div>
        <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-3.5">
          <div className="relative w-full md:w-auto flex-grow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="ابحث باسم الزبون، حالة الطلبات"
              className="w-full pl-9 pr-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <select className="px-3.5 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 appearance-none bg-white">
              <option>الكل</option>
              <option>نشط</option>
              <option>غير نشط</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-[#F5F6FA] text-gray-600">
              <tr>
                <Th className="rounded-tr-lg">الاسم</Th>
                <Th>الجوال</Th>
                <Th>البريد</Th>
                <Th>عدد الطلبات</Th>
                <Th>آخر طلب</Th>
                <Th>الحالة</Th>
                <Th className="rounded-tl-lg">الإجراءات</Th>
              </tr>
            </thead>
            <tbody>
              {mainTableUsers.map((user, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <Td>
                    <button
                      onClick={() => {
                        setSelectedUser({ ...dummyUser, name: user.name, mobile: user.mobile, email: user.email });
                        setShowUserDetails(true);
                      }}
                      className="text-gray-700 font-semibold hover:underline focus:outline-none"
                    >
                      {user.name}
                    </button>
                  </Td>
                  <Td>{user.mobile}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.orders}</Td>
                  <Td>{user.lastOrderDate}</Td>
                  <Td>
                    <StatusBadge status={user.status} />
                  </Td>
                  <Td>
                    <div className="relative inline-block">
                      <button
                        onClick={() => setShowMoreOptions(showMoreOptions === idx ? null : idx)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <BsThreeDots className="text-base" />
                      </button>
                      {showMoreOptions === idx && (
                        <MoreOptionsDashboard
                          onClose={() => setShowMoreOptions(null)}
                          onMoreDetails={() => {
                            setSelectedUser({ ...dummyUser, name: user.name, mobile: user.mobile, email: user.email });
                            setShowUserDetails(true);
                          }}
                          onAddNote={() => alert('Add note functionality')}
                        />
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">اعرض في الصفحة</span>
            <select className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-700">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">اجمالي الزبائن: 8764</span>
            <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
              &lt;
            </button>
            <button className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full">
              1
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
              2
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
              3
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
              4
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
              5
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;