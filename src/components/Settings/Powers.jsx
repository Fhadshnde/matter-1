import React, { useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { BsCheckSquareFill } from 'react-icons/bs';
import { FaFilePdf, FaCog, FaPercent, FaWrench } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const GeneralSettings = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">الإعدادات العامة</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-2">اسم الشركة</label>
          <input type="text" value="CBC" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-2">البريد الرسمي</label>
          <input type="email" value="admin@cbc.sa" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-2">رقم الجوال</label>
          <input type="text" value="+966 55543456" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-2">العملة الافتراضية</label>
          <input type="text" value="دينار عراق (IQD)" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-2">المنطقة الرئيسية</label>
          <input type="text" value="Asia/Baghdad (GMT+3)" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-2">العنوان</label>
          <input type="text" value="بغداد - الشارع 62 - مجمع الأعمال" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-2 rtl:space-x-reverse">
        <button className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition">إلغاء</button>
        <button className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition">حفظ التغييرات</button>
      </div>
    </div>
  );
};

const SystemOptions = ({ openModal }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">خيارات النظام</h3>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-right space-y-4 md:space-y-0">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">نسبة التطبيق</span>
          <span className="text-sm text-gray-500 mt-1">25% تطبيقًا تلقائيًا على المتاجر الجديدة إن لم توجد نسبة</span>
        </div>
        <button onClick={() => openModal('appRatio')} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition">تعديل</button>
      </div>
      <hr className="my-6" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-right space-y-4 md:space-y-0">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">الإشعارات</span>
          <span className="text-sm text-gray-500 mt-1">الوسائل التي يستخدمها النظام لإرسال التنبيهات</span>
          <div className="flex items-center space-x-4 rtl:space-x-reverse mt-2">
            <span className="flex items-center text-red-500">
              <BsCheckSquareFill className="ml-1" />
              البريد الالكتروني
            </span>
            <span className="flex items-center text-red-500">
              <BsCheckSquareFill className="ml-1" />
              رسالة نصية SMS
            </span>
            <span className="flex items-center text-red-500">
              <BsCheckSquareFill className="ml-1" />
              اشعار داخل التطبيق
            </span>
          </div>
        </div>
        <button onClick={() => openModal('notifications')} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition">تعديل</button>
      </div>
      <hr className="my-6" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-right space-y-4 md:space-y-0">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">تفعيل وضع الصيانة</span>
          <span className="text-sm text-gray-500 mt-1">عند تفعيل وضع الصيانة، سيتم إيقاف جميع تفاعلات المستخدمين مؤقتًا، ولن يتمكنوا من الوصول إلى المنصة أو إجراء أي عمليات حتى يتم إلغاء التفعيل.</span>
        </div>
        <button onClick={() => openModal('maintenance')} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition">تعديل</button>
      </div>
    </div>
  );
};

const SystemLog = () => {
  const logs = [
    { date: '28-08-2025 09:45م', employee: 'علي حسين', action: 'تعديل نسبة التطبيق', ip: '192.168.10.45', changes: 'قبل/بعد: +25% +22%' },
    { date: '28-08-2025 09:45م', employee: 'سارة جاسم', action: 'إضافة موظف', ip: '10.0.2.16', changes: '- / + موظف جديد' },
    { date: '28-08-2025 09:45م', employee: 'علي حسين', action: 'تعديل نسبة التطبيق', ip: '192.168.10.45', changes: '25% +22%' },
    { date: '28-08-2025 09:45م', employee: 'علي حسين', action: 'تعديل نسبة التطبيق', ip: '192.168.10.45', changes: '25% +22%' },
    { date: '28-08-2025 09:45م', employee: 'علي حسين', action: 'تعديل نسبة التطبيق', ip: '192.168.10.45', changes: '25% +22%' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">السجل العام</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 font-semibold text-gray-500">التاريخ/الوقت</th>
              <th className="p-3 font-semibold text-gray-500">الموظف</th>
              <th className="p-3 font-semibold text-gray-500">الإجراء</th>
              <th className="p-3 font-semibold text-gray-500">البيان</th>
              <th className="p-3 font-semibold text-gray-500">قبل/بعد</th>
              <th className="p-3 font-semibold text-gray-500">IP</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{log.date}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{log.employee}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{log.action}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{log.changes}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{log.changes}</td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center text-sm">
        <span className="text-gray-700">إجمالي السجلات: 133</span>
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
    </div>
  );
};

const AppRatioModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">نسبة التطبيق</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <RiCloseFill size={24} />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-500 mb-2">النسبة</label>
          <div className="relative">
            <input type="text" value="25%" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-right" />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">الغاء</button>
          <button className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">حفظ</button>
        </div>
      </div>
    </div>
  );
};

const NotificationsModal = ({ onClose }) => {
  const [emailChecked, setEmailChecked] = useState(true);
  const [smsChecked, setSmsChecked] = useState(true);
  const [inAppChecked, setInAppChecked] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">تعديل اشعارات النظام</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <RiCloseFill size={24} />
          </button>
        </div>
        <div className="space-y-4 text-right">
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" checked={emailChecked} onChange={() => setEmailChecked(!emailChecked)} className="form-checkbox h-5 w-5 text-red-500 rounded border-gray-300 focus:ring-red-500 ml-2" />
            <span className="text-gray-700 font-semibold">البريد الالكتروني</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" checked={smsChecked} onChange={() => setSmsChecked(!smsChecked)} className="form-checkbox h-5 w-5 text-red-500 rounded border-gray-300 focus:ring-red-500 ml-2" />
            <span className="text-gray-700 font-semibold">رسالة نصية SMS</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" checked={inAppChecked} onChange={() => setInAppChecked(!inAppChecked)} className="form-checkbox h-5 w-5 text-red-500 rounded border-gray-300 focus:ring-red-500 ml-2" />
            <span className="text-gray-700 font-semibold">اشعار داخل التطبيق</span>
          </label>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <button onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">الغاء</button>
          <button className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">تعديل</button>
        </div>
      </div>
    </div>
  );
};

const MaintenanceModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <RiCloseFill size={24} />
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <FaWrench className="text-red-500 text-3xl" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">تفعيل وضع الصيانة</h2>
        <p className="text-sm text-gray-600 mb-6">
          عند تفعيل وضع الصيانة، سيتم إيقاف جميع تفاعلات المستخدمين مؤقتًا، ولن يتمكنوا من الوصول إلى المنصة أو إجراء أي عمليات حتى يتم إلغاء التفعيل.
        </p>
        <div className="flex justify-between items-center">
          <button onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">الغاء</button>
          <button className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">تفعيل</button>
        </div>
      </div>
    </div>
  );
};

// New Settings Navigation Component
const SettingsNav = ({ activePage }) => {
  const linkClass = "px-4 py-2 rounded-lg font-bold transition";
  const activeClass = "bg-red-500 text-white";
  const inactiveClass = "bg-white text-gray-700 hover:bg-gray-100";

  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6" dir="rtl">
      <div className="bg-white p-2 rounded-xl shadow-md flex items-center space-x-2 rtl:space-x-reverse">
        {/* استبدال a بـ Link */}
        <Link to="/settings" className={`${linkClass} ${activePage === 'employees' ? activeClass : inactiveClass}`}>
          إعدادات الموظفين
        </Link>
        <Link to="/powers" className={`${linkClass} ${activePage === 'general' ? activeClass : inactiveClass}`}>
          إعدادات عامة
        </Link>
      </div>
    </div>
  );
};

const SystemSettingsPage = () => {
  const [modal, setModal] = useState(null);

  const openModal = (modalName) => {
    setModal(modalName);
  };

  const closeModal = () => {
    setModal(null);
  };

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-right">إعدادات النظام</h1>
      
      {/* New navigation added here */}
      <SettingsNav activePage="general" />

      <GeneralSettings />
      <SystemOptions openModal={openModal} />
      <SystemLog />

      {modal === 'appRatio' && <AppRatioModal onClose={closeModal} />}
      {modal === 'notifications' && <NotificationsModal onClose={closeModal} />}
      {modal === 'maintenance' && <MaintenanceModal onClose={closeModal} />}
    </div>
  );
};

export default SystemSettingsPage;