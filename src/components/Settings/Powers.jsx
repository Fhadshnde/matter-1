import React, { useState, useEffect } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { BsCheckSquareFill } from 'react-icons/bs';
import { FaFilePdf, FaCog, FaPercent, FaWrench } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG, { apiCall } from '../../config/api';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    companyName: 'ماتجر - منصة التجارة الإلكترونية',
    officialEmail: 'admin@matjer.iq',
    phoneNumber: '+964 780 000 0000',
    address: 'بغداد - شارع الرشيد - مجمع الأعمال',
    currency: 'دينار عراقي (IQD)',
    timezone: 'Asia/Baghdad (GMT+3)'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const data = await apiCall(API_CONFIG.ADMIN.GENERAL_SETTINGS);
      setSettings(data.companyInfo);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiCall(API_CONFIG.ADMIN.GENERAL_SETTINGS, {
        method: 'PUT',
        body: JSON.stringify({ companyInfo: settings })
      });
      alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    }
    setSaving(false);
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <span className="mr-4 text-gray-600">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">الإعدادات العامة</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-2">اسم الشركة</label>
          <input 
            type="text" 
            value={settings.companyName} 
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-2">البريد الرسمي</label>
          <input 
            type="email" 
            value={settings.officialEmail} 
            onChange={(e) => handleChange('officialEmail', e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-2">رقم الجوال</label>
          <input 
            type="text" 
            value={settings.phoneNumber} 
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-2">العملة الافتراضية</label>
          <input 
            type="text" 
            value={settings.currency} 
            onChange={(e) => handleChange('currency', e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-2">المنطقة الرئيسية</label>
          <input 
            type="text" 
            value={settings.timezone} 
            onChange={(e) => handleChange('timezone', e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-2">العنوان</label>
          <input 
            type="text" 
            value={settings.address} 
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500" 
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-2 rtl:space-x-reverse">
        <button 
          onClick={() => fetchSettings()}
          className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition"
        >
          إلغاء
        </button>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </div>
  );
};

const SystemOptions = ({ openModal }) => {
  const [systemOptions, setSystemOptions] = useState({
    appRatio: 15,
    notifications: {
      email: true,
      sms: true,
      inApp: true
    },
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);

  const fetchSystemOptions = async () => {
    try {
      const data = await apiCall(API_CONFIG.ADMIN.GENERAL_SETTINGS);
      setSystemOptions(data.systemOptions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching system options:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemOptions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <span className="mr-4 text-gray-600">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">خيارات النظام</h3>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-right space-y-4 md:space-y-0">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">نسبة التطبيق</span>
          <span className="text-sm text-gray-500 mt-1">{systemOptions.appRatio}% تطبيقًا تلقائيًا على المتاجر الجديدة إن لم توجد نسبة</span>
        </div>
        <button onClick={() => openModal('appRatio')} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition">تعديل</button>
      </div>
      <hr className="my-6" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-right space-y-4 md:space-y-0">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">الإشعارات</span>
          <span className="text-sm text-gray-500 mt-1">الوسائل التي يستخدمها النظام لإرسال التنبيهات</span>
          <div className="flex items-center space-x-4 rtl:space-x-reverse mt-2">
            <span className={`flex items-center ${systemOptions.notifications.email ? 'text-red-500' : 'text-gray-400'}`}>
              <BsCheckSquareFill className="ml-1" />
              البريد الالكتروني
            </span>
            <span className={`flex items-center ${systemOptions.notifications.sms ? 'text-red-500' : 'text-gray-400'}`}>
              <BsCheckSquareFill className="ml-1" />
              رسالة نصية SMS
            </span>
            <span className={`flex items-center ${systemOptions.notifications.inApp ? 'text-red-500' : 'text-gray-400'}`}>
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
          <span className={`text-sm mt-1 font-bold ${systemOptions.maintenanceMode ? 'text-red-500' : 'text-green-500'}`}>
            {systemOptions.maintenanceMode ? 'وضع الصيانة مفعل' : 'وضع الصيانة معطل'}
          </span>
        </div>
        <button onClick={() => openModal('maintenance')} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition">تعديل</button>
      </div>
    </div>
  );
};


const SystemLog = () => {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      console.log('Fetching system logs from:', API_CONFIG.ADMIN.SYSTEM_LOGS);
      const data = await apiCall(`${API_CONFIG.ADMIN.SYSTEM_LOGS}?page=1&limit=20`);
      console.log('System logs data received:', data);
      setLog(data.logs || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching system logs:', error);
      setLog([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">السجل العام</h3>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <span className="mr-4 text-gray-600">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-right">السجل العام</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 font-semibold text-gray-500">الإجراء</th>
              <th className="p-3 font-semibold text-gray-500">الوصف</th>
              <th className="p-3 font-semibold text-gray-500">المستوى</th>
              <th className="p-3 font-semibold text-gray-500">المستخدم</th>
              <th className="p-3 font-semibold text-gray-500">IP</th>
              <th className="p-3 font-semibold text-gray-500">التاريخ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {log.length > 0 ? (
              log.map((item, index) => (
                <tr key={index}>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{item.action}</td>
                  <td className="p-3 text-sm text-gray-700">{item.description}</td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.level === 'error' ? 'bg-red-100 text-red-800' :
                      item.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      item.level === 'success' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.level}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {item.user ? `${item.user.name} (${item.user.phone})` : 'نظام'}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">{item.ipAddress || '-'}</td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleString('ar-EG')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 p-8">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-lg font-semibold text-gray-600 mb-2">لا يمكن تحميل السجل العام</p>
                    <p className="text-sm text-gray-500 mb-4">يبدو أن هناك مشكلة في الاتصال بالخادم أو أنك غير مخول للوصول لهذه البيانات</p>
                    <button 
                      onClick={fetchLogs}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const AppRatioModal = ({ onClose }) => {
  const [ratio, setRatio] = useState(25);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiCall(API_CONFIG.ADMIN.GENERAL_SETTINGS, {
        method: 'PUT',
        body: JSON.stringify({
          systemOptions: {
            appRatio: ratio
          }
        })
      });
      alert('تم تحديث نسبة التطبيق بنجاح');
      onClose();
    } catch (error) {
      console.error('Error saving app ratio:', error);
      alert('حدث خطأ أثناء حفظ النسبة');
    }
    setSaving(false);
  };

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
            <input 
              type="number" 
              value={ratio} 
              onChange={(e) => setRatio(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-right" 
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">الغاء</button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationsModal = ({ onClose }) => {
  const [emailChecked, setEmailChecked] = useState(true);
  const [smsChecked, setSmsChecked] = useState(true);
  const [inAppChecked, setInAppChecked] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiCall(API_CONFIG.ADMIN.GENERAL_SETTINGS, {
        method: 'PUT',
        body: JSON.stringify({
          systemOptions: {
            notifications: {
              email: emailChecked,
              sms: smsChecked,
              inApp: inAppChecked
            }
          }
        })
      });
      alert('تم تحديث إعدادات الإشعارات بنجاح');
      onClose();
    } catch (error) {
      console.error('Error saving notifications:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    }
    setSaving(false);
  };

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
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ...' : 'تعديل'}
          </button>
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
      <SettingsNav activePage="general" />
      <GeneralSettings />
      {/* <SystemOptions openModal={openModal} /> */}
      <SystemLog />
      {modal === 'appRatio' && <AppRatioModal onClose={closeModal} />}
      {modal === 'notifications' && <NotificationsModal onClose={closeModal} />}
      {modal === 'maintenance' && <MaintenanceModal onClose={closeModal} />}
    </div>
  );
};

export default SystemSettingsPage;