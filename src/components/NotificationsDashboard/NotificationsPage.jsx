import React from 'react';
import { FaStore } from 'react-icons/fa';

const NotificationCard = ({ storeName, timeAgo }) => {
  return (
    <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-6 rtl:space-x-reverse min-w-full">
      <div className="flex-shrink-0 w-4 h-4 bg-red-500 rounded-full"></div>
      <div className="flex-grow text-right">
        <h4 className="font-semibold text-base">{storeName}</h4>
        <p className="text-gray-500 text-sm mt-1">{timeAgo}</p>
      </div>
      <div className="flex-shrink-0">
        <FaStore size={24} className="text-gray-500" />
      </div>
    </div>
  );
};

const NotificationsPage = () => {
  const notifications = [
    { id: 1, store: 'متجر ديجيتال', time: 'منذ 5 دقائق' },
    { id: 2, store: 'متجر ديجيتال', time: 'منذ 5 دقائق' },
    { id: 3, store: 'متجر ديجيتال', time: 'منذ 5 دقائق' },
    { id: 4, store: 'متجر ديجيتال', time: 'منذ 5 دقائق' },
    { id: 5, store: 'متجر ديجيتال', time: 'منذ 5 دقائق' },
    { id: 6, store: 'متجر ديجيتال', time: 'منذ 5 دقائق' },
    { id: 7, store: 'متجر ديجيتال', time: 'منذ 5 دقائق' },
    { id: 8, store: 'متجر ديجيتال', time: 'منذ 5 دقائق' },
    { id: 9, store: 'متجر ديجيتال', time: 'منذ 5 دقائق' },
    { id: 10, store: 'متجر ديجيتال', time: 'منذ 5 دقائق' },
    { id: 11, store: 'متجر ديجيتال', time: 'منذ 5 دقائق' },
    { id: 12, store: 'متجر ديجيتال', time: 'منذ 5 دقائق' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen w-full flex flex-col items-center p-8" dir="rtl">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-8">
        <div className="text-right">
            <h2 className="text-gray-800 text-xl font-bold">الإشعارات</h2>
            <p className="text-red-500 text-sm mt-1">لديك 3 إشعارات غير مقروءة</p>
          </div>
          <button className="bg-white text-gray-500 py-2 px-4 rounded-lg text-sm border border-gray-300">تحديد الكل كـ مقروء</button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              storeName={`${notification.store} قد انضم للنظام`}
              timeAgo={notification.time}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;