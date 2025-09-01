import React, { useState } from 'react';
import { BsThreeDots, BsDisplay } from 'react-icons/bs';
import { FaMagnifyingGlass, FaRegClock, FaRegCalendarDays, FaArrowRight } from 'react-icons/fa6';
import { FaRegTrashAlt } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { MdOutlineDateRange } from 'react-icons/md';
import { AiOutlineBarChart } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";

const offersData = [
  { name: 'خصم الصيف %15', type: 'عرض عام', coverage: 'كل المنتجات', value: '15%', period: '1/8 أغسطس - 10/8 أغسطس', status: 'نشط', notes: 'العرض ممتاز ولاقى استحسان من الزبائن.' },
  { name: 'خصم الشتاء %20', type: 'عرض خاص', coverage: 'الإلكترونيات', value: '20%', period: '1/12 ديسمبر - 15/12 ديسمبر', status: 'منتهي', notes: 'لم يحقق الأهداف المطلوبة.' },
  { name: 'عرض رمضان', type: 'عرض عام', coverage: 'كل المنتجات', value: '10%', period: '1/3 مارس - 30/3 مارس', status: 'مجدول', notes: 'عرض خاص بمناسبة شهر رمضان.' },
];

const dashboardCards = [
  { title: 'العروض النشطة', value: '12 عرض', icon: <BsDisplay />, percentage: '8% ▲', change: 1 },
  { title: 'العروض الفائتة بالبداية', value: '5 عروض', icon: <FaRegClock />, percentage: '8% ▲', change: 1 },
  { title: 'عروض ستنتهي قريباً', value: '3 خلال 48 ساعة', icon: <FaRegCalendarDays />, percentage: '8% ▲', change: 1 },
  { title: 'المنتجات المخفضة', value: '264 عرض', icon: <BsDisplay />, percentage: '8% ▲', change: 1 },
];

// Reusable Components
const StatusBadge = ({ status }) => {
  const colorMap = {
    'نشط': 'bg-green-100 text-green-700',
    'منتهي': 'bg-red-100 text-red-700',
    'مجدول': 'bg-yellow-100 text-yellow-700',
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

// Modals
const PauseOfferModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xs text-center">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">إيقاف العرض مؤقتًا</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-red-500 text-4xl flex justify-center mx-auto w-14 h-14 rounded-full bg-red-100 items-center mb-3">
          <RiCloseFill className="text-red-500 text-3xl"/>
        </div>
        <h2 className="text-lg font-bold text-gray-800">هل أنت متأكد أنك تريد إيقاف العرض مؤقتًا؟</h2>
        <p className="text-gray-500 text-xs">سوف يتم إيقاف العرض مؤقتًا من قائمة العروض حتى تقوم بتفعيله مره اخره هل انت متأكد انك تريد إيقاف العرض مؤقتًا؟</p>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          إيقاف العرض مؤقتًا
        </button>
      </div>
    </div>
  </div>
);

const DeleteOfferModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xs text-center">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">حذف العرض نهائياً</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-red-500 text-4xl flex justify-center mx-auto w-14 h-14 rounded-full bg-red-100 items-center mb-3">
          <FaRegTrashAlt className="text-red-500 text-2xl"/>
        </div>
        <h2 className="text-lg font-bold text-gray-800">هل أنت متأكد أنك تريد حذف العرض نهائياً؟</h2>
        <p className="text-gray-500 text-xs">سوف يتم حذف العرض نهائياً من قائمة العروض لديك هل انت متأكد انك تريد الحذف؟</p>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          حذف العرض
        </button>
      </div>
    </div>
  </div>
);

const AddNoteModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xs">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">اضافة ملاحظه</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-700">اختار التاريخ</label>
          <div className="relative">
            <input
              type="text"
              value="1 / 8 / 2025"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 focus:outline-none"
            />
            <MdOutlineDateRange className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-700">ادخل نص الملاحظة</label>
          <textarea
            placeholder="ادخل ملاحظاتك..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 focus:outline-none resize-none"
          ></textarea>
        </div>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          حفظ
        </button>
      </div>
    </div>
  </div>
);

const EditOfferModal = ({ onClose, offer }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">تعديل العرض</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">النسبة</label>
          <input type="text" defaultValue={offer.value} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">الفترة</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input type="text" defaultValue="1/8/2025" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 focus:outline-none" />
              <MdOutlineDateRange className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <span>إلى</span>
            <div className="relative flex-1">
              <input type="text" defaultValue="10/8/2025" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 focus:outline-none" />
              <MdOutlineDateRange className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">نوع العرض</label>
          <select defaultValue={offer.type} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 focus:outline-none">
            <option>عرض عام</option>
            <option>عرض خاص</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">العرض يشمل</label>
          <select defaultValue={offer.coverage} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 focus:outline-none">
            <option>كل المنتجات</option>
            <option>منتجات محددة</option>
          </select>
        </div>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          حفظ
        </button>
      </div>
    </div>
  </div>
);

const ViewPerformanceModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">تتبع حالة العرض</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 text-center">
        <h3 className="text-lg font-bold mb-5">تتبع حالة العرض هذا الشهر</h3>
        <div className="flex justify-around items-end h-64">
          <div className="relative">
            <div className="bg-black w-14 h-48 rounded-t-lg"></div>
            <span className="mt-2 text-xs text-gray-600 block">الأسبوع الرابع</span>
          </div>
          <div className="relative">
            <div className="bg-green-500 w-14 h-40 rounded-t-lg"></div>
            <span className="mt-2 text-xs text-gray-600 block">الأسبوع الثالث</span>
          </div>
          <div className="relative group">
            <div className="bg-yellow-500 w-14 h-56 rounded-t-lg"></div>
            <span className="mt-2 text-xs text-gray-600 block">الأسبوع الثاني</span>
            <div className="absolute bottom-full mb-2 -right-12 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p>زيارات: 8322</p>
              <p>تحويلات: 7432</p>
              <p>طلبات: 6754</p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-red-500 w-14 h-44 rounded-t-lg"></div>
            <span className="mt-2 text-xs text-gray-600 block">الأسبوع الأول</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ViewOfferDetailsModal = ({ onClose, offer }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">تفاصيل العرض</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500">الاسم</label>
          <p className="font-bold text-gray-800">{offer.name}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500">النوع</label>
          <p className="font-bold text-gray-800">{offer.type}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500">النسبة</label>
          <p className="font-bold text-gray-800">{offer.value}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500">العرض يشمل</label>
          <p className="font-bold text-gray-800">{offer.coverage}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500">التاريخ</label>
          <p className="font-bold text-gray-800">{offer.period}</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500">الحالة</label>
          <StatusBadge status={offer.status} />
        </div>
        <div className="pt-4">
          <label className="block text-xs font-semibold text-gray-500">ملاحظات إدارية</label>
          <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700">
            {offer.notes}
          </div>
        </div>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          تعديل
        </button>
      </div>
    </div>
  </div>
);

const BlockUserModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xs text-center">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">حظر الزبون</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-red-500 text-4xl flex justify-center mx-auto w-14 h-14 rounded-full bg-red-100 items-center mb-3">
          <RiCloseFill className="text-red-500 text-3xl"/>
        </div>
        <h2 className="text-lg font-bold text-gray-800">هل أنت متأكد أنك تريد حظر الزبون؟</h2>
        <p className="text-gray-500 text-xs">سوف يتم حظر الزبون نهائياً من قائمة الزبائن لديك هل انت متأكد انك تريد الحظر؟</p>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          حظر الزبون
        </button>
      </div>
    </div>
  </div>
);

const SendNotificationModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xs">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">إرسال إشعار</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <label className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-semibold text-gray-700">
          <input type="checkbox" className="form-checkbox text-red-500" defaultChecked />
          <span>البريد الالكتروني</span>
        </label>
        <label className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-semibold text-gray-700">
          <input type="checkbox" className="form-checkbox text-red-500" defaultChecked />
          <span>رسالة نصية SMS</span>
        </label>
        <label className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-semibold text-gray-700">
          <input type="checkbox" className="form-checkbox text-red-500" defaultChecked />
          <span>إشعار داخل التطبيق</span>
        </label>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          إرسال
        </button>
      </div>
    </div>
  </div>
);

const PrintInvoiceModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xs text-center">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">طباعه الايصال</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-red-500 text-4xl flex justify-center mx-auto w-14 h-14 rounded-full bg-red-100 items-center mb-3">
          <MdInfoOutline className="text-red-500 text-3xl"/>
        </div>
        <h2 className="text-lg font-bold text-gray-800">هل انت متأكد انك تريد طباعه الايصال؟</h2>
        <p className="text-gray-500 text-xs">سف يتم طباعه الايصال الان؟</p>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          طباعه
        </button>
      </div>
    </div>
  </div>
);


const OffersDashboard = () => {
  const [showModal, setShowModal] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleOpenModal = (modalName, offer = null) => {
    setSelectedOffer(offer);
    setShowModal(modalName);
  };
  const [showMoreOptions, setShowMoreOptions] = useState(null);

  const MoreOfferOptions = ({ onClose, offer }) => {
    return (
      <div className="bg-white rounded-lg shadow-lg py-1.5 w-48 text-right absolute mt-1.5 left-0 border border-gray-200 z-10">
        <button onClick={() => { handleOpenModal('viewDetails', offer); onClose(); }} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
          <FaMagnifyingGlass className="text-base text-gray-400" />
          عرض التفاصيل
        </button>
        <button onClick={() => { handleOpenModal('edit', offer); onClose(); }} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
          <FiEdit2 className="text-base text-gray-400" />
          تعديل العرض
        </button>
        <button onClick={() => { handleOpenModal('pause', offer); onClose(); }} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
          <FaRegClock className="text-base text-gray-400" />
          إيقاف العرض مؤقتاً
        </button>
        <button onClick={() => { handleOpenModal('performance', offer); onClose(); }} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
          <AiOutlineBarChart className="text-base text-gray-400" />
          مشاهدة الأداء
        </button>
        <div className="border-t border-gray-200 my-1.5"></div>
        <button onClick={() => { handleOpenModal('delete', offer); onClose(); }} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-red-500 hover:bg-red-50">
          <FaRegTrashAlt className="text-base" />
          حذف العرض نهائياً
        </button>
      </div>
    );
  };
  
  return (
    <div dir="rtl" className="bg-gray-100 min-h-screen p-7 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
        {dashboardCards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-5 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">إدارة العروض والخصومات</h2>
          <BsThreeDots className="text-gray-400 text-xl" />
        </div>
        <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-3.5">
          <div className="relative w-full md:w-auto flex-grow">
            <FaMagnifyingGlass
              className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="ابحث عن اسم العرض، نوع العرض"
              className="w-full pl-9 pr-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <select className="px-3.5 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 appearance-none bg-white">
              <option>الكل</option>
              <option>نشط</option>
              <option>منتهي</option>
              <option>مجدول</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-[#F5F6FA] text-gray-600">
              <tr>
                <Th className="rounded-tr-lg">اسم العرض</Th>
                <Th>النوع</Th>
                <Th>النطاق</Th>
                <Th>القيمة</Th>
                <Th>الفترة</Th>
                <Th>الحالة</Th>
                <Th className="rounded-tl-lg">الإجراءات</Th>
              </tr>
            </thead>
            <tbody>
              {offersData.map((offer, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <Td>
                    <button onClick={() => handleOpenModal('viewDetails', offer)} className="font-semibold text-gray-700 hover:underline">
                      {offer.name}
                    </button>
                  </Td>
                  <Td>{offer.type}</Td>
                  <Td>{offer.coverage}</Td>
                  <Td>{offer.value}</Td>
                  <Td>{offer.period}</Td>
                  <Td>
                    <StatusBadge status={offer.status} />
                  </Td>
                  <Td>
                    <div className="relative inline-block">
                      <button onClick={() => setShowMoreOptions(showMoreOptions === idx ? null : idx)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                        <BsThreeDots className="text-base" />
                      </button>
                      {showMoreOptions === idx && (
                        <MoreOfferOptions onClose={() => setShowMoreOptions(null)} offer={offer} />
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
            <span className="text-xs text-gray-400">اجمالي العروض: {offersData.length}</span>
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

      {showModal === 'pause' && <PauseOfferModal onClose={() => setShowModal(null)} />}
      {showModal === 'delete' && <DeleteOfferModal onClose={() => setShowModal(null)} />}
      {showModal === 'addNote' && <AddNoteModal onClose={() => setShowModal(null)} />}
      {showModal === 'edit' && <EditOfferModal onClose={() => setShowModal(null)} offer={selectedOffer} />}
      {showModal === 'performance' && <ViewPerformanceModal onClose={() => setShowModal(null)} />}
      {showModal === 'viewDetails' && <ViewOfferDetailsModal onClose={() => setShowModal(null)} offer={selectedOffer} />}
      {showModal === 'blockUser' && <BlockUserModal onClose={() => setShowModal(null)} />}
      {showModal === 'sendNotification' && <SendNotificationModal onClose={() => setShowModal(null)} />}
      {showModal === 'printInvoice' && <PrintInvoiceModal onClose={() => setShowModal(null)} />}
    </div>
  );
};

export default OffersDashboard;