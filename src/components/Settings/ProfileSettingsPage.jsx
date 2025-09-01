import React, { useState } from 'react';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const inputStyle = "w-full bg-white border border-gray-300 rounded-full p-3 mt-1 text-gray-800";
  const buttonStyle = "bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg";
  const sectionContainerStyle = "bg-gray-100 w-full max-w-2xl rounded-3xl p-8 mb-8 shadow-lg";

  const tabs = [
    { id: 'personal', label: 'البيانات الشخصية' },
    { id: 'password', label: 'كلمة المرور' },
    { id: 'login', label: 'أجهزة وجلسات الدخول' },
    { id: 'notifications', label: 'الإشعارات' }
  ];

  return (
    <div className="bg-white min-h-screen p-8 flex flex-col items-center">

      {/* Tabs */}
      <div className="w-full max-w-2xl mb-8 flex justify-start border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold text-gray-700 ${activeTab === tab.id ? 'border-b-4 border-red-600 text-red-600' : 'text-gray-500'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && (
        <div className={sectionContainerStyle}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">البيانات الشخصية</h2>
            <p className="text-gray-500 text-sm">تظهر هذه المعلومات في النظام والتقارير</p>
          </div>
          <div className="flex items-center mb-8">
            <div className="relative">
              <img src="https://via.placeholder.com/80" alt="User Profile" className="rounded-full w-20 h-20 border-2 border-red-600" />
              <button className="absolute bottom-0 right-0 bg-red-600 rounded-full p-1 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-1.5-9L12 3.75 4.5 7.5m15 0-7.5 7.5" />
                </svg>
              </button>
            </div>
            <button className="text-red-600 mr-4">تغيير الصورة</button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm">الاسم الكامل</label>
            <input type="text" value="محمد صالح" className={inputStyle} readOnly />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm">البريد الإلكتروني</label>
            <input type="email" value="admin@cbr.sa" className={inputStyle} readOnly />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm">رقم الجوال</label>
            <div className="flex">
              <input type="tel" value="55543456" className="flex-1 bg-white border border-gray-300 rounded-r-full p-3 mt-1 text-gray-800" readOnly />
              <div className="flex items-center bg-gray-200 border border-gray-300 rounded-l-full p-3 mt-1">
                <span className="ml-2 text-gray-800">+٩٦٤</span>
                <img src="https://flagcdn.com/sa.svg" alt="Saudi Arabia Flag" className="w-6 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
        <div className={sectionContainerStyle}>
          <h2 className="text-xl font-bold mb-6 text-gray-800">كلمة المرور</h2>
          <p className="text-gray-500 text-sm mb-6">احرص على استخدام كلمة مرور قوية</p>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm">كلمة المرور الحالية</label>
            <div className="relative">
              <input type="password" placeholder="********" className={inputStyle} />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.577 3.01 9.964 7.822a.99.99 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.577-3.01-9.964-7.822z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm">كلمة المرور الجديدة</label>
            <div className="relative">
              <input type="password" placeholder="********" className={inputStyle} />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.577 3.01 9.964 7.822a.99.99 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.577-3.01-9.964-7.822z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 text-sm">تأكيد كلمة المرور</label>
            <div className="relative">
              <input type="password" placeholder="********" className={inputStyle} />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.577 3.01 9.964 7.822a.99.99 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.577-3.01-9.964-7.822z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'login' && (
        <div className={sectionContainerStyle}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">أجهزة وجلسات الدخول</h2>
            <p className="text-gray-500 text-sm">يمكنك إنهاء الجلسات النشطة على الأجهزة الأخرى</p>
          </div>
          {['Firefox - Mac', 'Chrome - Windows', 'Safari - iPhone'].map((device, index) => (
            <div key={index} className="flex justify-between items-center bg-white rounded-full p-4 mb-3 shadow-sm border border-gray-300">
              <div>
                <p className="text-gray-800">{device}</p>
                <p className="text-gray-500 text-sm">جدة السعودية، قبل ٥ ساعات</p>
              </div>
              <button className="text-red-600 flex items-center">
                <span className="ml-2">تسجيل خروج</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12a2.25 2.25 0 012.25 2.25v2.25" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className={sectionContainerStyle}>
          <h2 className="text-xl font-bold mb-6 text-gray-800">أنواع الإشعارات</h2>
          <p className="text-gray-500 text-sm mb-6">اختر ما ترغب باستلامه</p>
          <div className="space-y-4">
            {['إشعارات الطلبات', 'إشعارات التجار', 'تحديثات النظام', 'بريد إلكتروني', 'رسائل SMS', 'إشعارات Push'].map((type, index) => (
              <div key={index} className="flex justify-between items-center">
                <label htmlFor={`checkbox-${index}`} className="text-gray-800">{type}</label>
                <input type="checkbox" id={`checkbox-${index}`} defaultChecked={index < 2 || index > 4} className="form-checkbox h-6 w-6 text-red-600 bg-gray-300 rounded-full border-none focus:ring-red-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center w-full max-w-2xl mt-4 space-x-4">
        <button className={buttonStyle}>حفظ التغييرات</button>
        <button className="bg-gray-400 text-white font-bold py-3 px-8 rounded-full shadow-lg">إلغاء</button>
      </div>
    </div>
  );
};

export default ProfileSettings;
