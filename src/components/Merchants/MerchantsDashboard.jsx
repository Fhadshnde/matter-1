import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import { RiCloseFill } from 'react-icons/ri';
import { FaRegUser, FaStore, FaChartBar, FaUserLock, FaRegComment, FaCalendarAlt, FaChevronDown, FaRegPauseCircle } from 'react-icons/fa';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { MdInfoOutline } from 'react-icons/md';

const merchantCards = [
  { title: 'تجار لديهم تقييم', value: '22 تاجر', icon: <FaRegComment /> },
  { title: 'تجار محظورين', value: '6 تجار', icon: <FaUserLock /> },
  { title: 'تجار موقوفين', value: '15 تاجر', icon: <FaRegPauseCircle /> },
  { title: 'التجار النشطين', value: '180 تاجر', icon: <FaRegUser /> },
];

const merchantsData = [
  { id: 1, name: 'سارة خالد', store: 'متجر سارة', activity: 'ملابس نسائية', products: 120, orders: 450, rating: 4.5, status: 'نشط' },
  { id: 2, name: 'أحمد علي', store: 'متجر التكنولوجيا', activity: 'أجهزة إلكترونية', products: 50, orders: 200, rating: 4.8, status: 'نشط' },
  { id: 3, name: 'فاطمة سعد', store: 'حلويات فاطمة', activity: 'حلويات منزلية', products: 30, orders: 150, rating: 4.2, status: 'موقوف' },
  { id: 4, name: 'محمود سليمان', store: 'قطع غيار السيارات', activity: 'قطع غيار', products: 80, orders: 300, rating: 4.0, status: 'محظور' },
  { id: 5, name: 'نورا حسن', store: 'ديكورات نورا', activity: 'ديكورات منزلية', products: 95, orders: 500, rating: 4.7, status: 'نشط' },
  { id: 6, name: 'عمر جمال', store: 'كتب عمر', activity: 'كتب ومكتبة', products: 200, orders: 600, rating: 4.9, status: 'نشط' },
];

const StatusBadge = ({ status }) => {
  const colorMap = {
    'نشط': 'bg-green-100 text-green-700',
    'موقوف': 'bg-yellow-100 text-yellow-700',
    'محظور': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[status]}`}>
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

const Card = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg p-4 flex items-center justify-between text-right shadow-sm">
    <div className="flex flex-col">
      <span className="text-gray-400 text-xs mb-1">{title}</span>
      <p className="text-xl font-semibold mb-1">{value}</p>
      <div className="text-xs text-green-500 flex items-center">
        8% <span className="mr-1">▲</span>
        <span className="text-gray-400 mr-1">عن الفترة السابقة</span>
      </div>
    </div>
    <div className="bg-gray-100 p-2.5 rounded-full text-xl text-red-500">
      {icon}
    </div>
  </div>
);

const ChangeStatusModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">تغيير حالة التاجر</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">اختر حالة التاجر</label>
          <div className="relative">
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none pr-8">
              <option>نشط</option>
              <option>موقوف</option>
              <option>محظور</option>
            </select>
            <FaChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          تعديل
        </button>
      </div>
    </div>
  </div>
);

const BanMerchantModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xs text-center">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">حظر التاجر</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-red-500 text-4xl flex justify-center mx-auto w-14 h-14 rounded-full bg-red-100 items-center mb-3">
          <RiCloseFill className="text-red-500 text-3xl"/>
        </div>
        <h2 className="text-lg font-bold text-gray-800">هل أنت متأكد أنك تريد حظر هذا التاجر؟</h2>
        <p className="text-gray-500 text-xs">سوف يتم حظر هذا التاجر نهائياً من قائمة التجار. هل أنت متأكد انك تريد الحظر؟</p>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          حظر التاجر
        </button>
      </div>
    </div>
  </div>
);

const AddNoteModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">اضافه ملاحظه</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">اختار التاريخ</label>
          <div className="relative">
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm pl-10" value="1 / 8 / 2025" readOnly />
            <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">ادخل نص الملاحظه</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            rows="4"
            placeholder="ادخل ملاحظاتك..."
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

const OfferDetailsModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">تفاصيل العرض</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold">اسم العرض</div>
          <div className="text-sm">خصم 20% على الملابس</div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold">تاريخ بداية العرض</div>
          <div className="text-sm">1/1/2024</div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold">تاريخ نهاية العرض</div>
          <div className="text-sm">1/1/2025</div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold">حالة العرض</div>
          <div className="text-sm">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
              نشط
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold">الهدف من العرض</div>
          <div className="text-sm">زيادة المبيعات في قسم الملابس</div>
        </div>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          إلغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          تعديل
        </button>
      </div>
    </div>
  </div>
);

const MerchantsDashboard = ({ onSelectMerchant }) => {
  const [activeModal, setActiveModal] = useState(null);

  const handleOpenModal = (modalName) => {
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">إدارة التجار</h1>
        <div className="flex border-b border-gray-200">
          <Link
            to="/merchants"
            className="py-2 px-4 text-sm font-medium border-b-2 border-red-500 text-red-500"
          >
            ملفات التجار
          </Link>
          <Link
            to="/employees"
            className="py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            موظفو التاجر
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {merchantCards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4 md:mb-0 w-full md:w-auto">
            <div className="relative">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none pr-8">
                <option>الكل</option>
                <option>نشط</option>
                <option>موقوف</option>
                <option>محظور</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pr-3 pointer-events-none">
                <FaChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="ابحث عن اسم التاجر، المتجر، نوع النشاط"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
              />
              <FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-right">
              <tr>
                <Th>التاجر</Th>
                <Th>المتجر</Th>
                <Th>نوع النشاط</Th>
                <Th>المنتجات</Th>
                <Th>الطلبات</Th>
                <Th>التقييم</Th>
                <Th>الحالة</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {merchantsData.map((merchant, index) => (
                <tr key={index}>
                  <Td>
                    <a onClick={() => onSelectMerchant(merchant.id)} className="text-blue-600 hover:underline cursor-pointer">
                      {merchant.name}
                    </a>
                  </Td>
                  <Td>{merchant.store}</Td>
                  <Td>{merchant.activity}</Td>
                  <Td>{merchant.products}</Td>
                  <Td>{merchant.orders}</Td>
                  <Td>{merchant.rating}</Td>
                  <Td><StatusBadge status={merchant.status} /></Td>
                  <Td>
                    <div className="relative inline-block text-right">
                      <button onClick={() => handleOpenModal(`actions-${index}`)} className="text-gray-500 hover:text-gray-700">
                        <BsThreeDots className="text-xl" />
                      </button>
                      {activeModal === `actions-${index}` && (
                        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <a href="#" onClick={() => handleOpenModal('offerDetails')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <MdInfoOutline className="ml-2" /> تفاصيل العرض
                          </a>
                          <a href="#" onClick={() => handleOpenModal('changeStatus')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <FaRegUser className="ml-2" /> تغيير حالة التاجر
                          </a>
                          <a href="#" onClick={() => handleOpenModal('addNote')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <FaRegComment className="ml-2" /> اضافه ملاحظه
                          </a>
                          <a href="#" onClick={() => handleOpenModal('banMerchant')} className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 flex items-center">
                            <FaUserLock className="ml-2" /> حظر التاجر
                          </a>
                        </div>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-700">إجمالي التجار 8764</span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm text-gray-500">اعرض في الصفحة 10</span>
            <div className="flex space-x-1 rtl:space-x-reverse">
              {[1, 2, 3, 4, 5].map(page => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded-md text-sm ${page === 1 ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {activeModal === 'changeStatus' && <ChangeStatusModal onClose={handleCloseModal} />}
      {activeModal === 'banMerchant' && <BanMerchantModal onClose={handleCloseModal} />}
      {activeModal === 'addNote' && <AddNoteModal onClose={handleCloseModal} />}
      {activeModal === 'offerDetails' && <OfferDetailsModal onClose={handleCloseModal} />}

    </div>
  );
};

export default MerchantsDashboard;