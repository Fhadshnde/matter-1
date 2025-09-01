import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUserTimes, FaUsers, FaSearch, FaEllipsisH, FaAngleUp, FaEye, FaEdit, FaStore, FaRegComment, FaTrashAlt, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';

const employeesData = [
  {
    id: 1,
    name: 'سامي يوسف',
    email: 'sami123@gmail.com',
    phone: '966555102030',
    merchant: 'يوسكو',
    role: 'مدير متجر',
    status: 'نشط',
    rating: 4,
    ordersHandled: 4500,
    notes: 'الموظف متفاني في عمله',
  },
  {
    id: 2,
    name: 'سامي يوسف',
    email: 'sami123@gmail.com',
    phone: '966555102030',
    merchant: 'يوسكو',
    role: 'مدير متجر',
    status: 'نشط',
    rating: 4,
    ordersHandled: 4500,
    notes: 'الموظف متفاني في عمله',
  },
  {
    id: 3,
    name: 'سامي يوسف',
    email: 'sami123@gmail.com',
    phone: '966555102030',
    merchant: 'يوسكو',
    role: 'مدير متجر',
    status: 'نشط',
    rating: 4,
    ordersHandled: 4500,
    notes: 'الموظف متفاني في عمله',
  },
  {
    id: 4,
    name: 'سامي يوسف',
    email: 'sami123@gmail.com',
    phone: '966555102030',
    merchant: 'يوسكو',
    role: 'مدير متجر',
    status: 'نشط',
    rating: 4,
    ordersHandled: 4500,
    notes: 'الموظف متفاني في عمله',
  },
  {
    id: 5,
    name: 'سامي يوسف',
    email: 'sami123@gmail.com',
    phone: '966555102030',
    merchant: 'يوسكو',
    role: 'مدير متجر',
    status: 'نشط',
    rating: 4,
    ordersHandled: 4500,
    notes: 'الموظف متفاني في عمله',
  },
  {
    id: 6,
    name: 'سامي يوسف',
    email: 'sami123@gmail.com',
    phone: '966555102030',
    merchant: 'يوسكو',
    role: 'مدير متجر',
    status: 'نشط',
    rating: 4,
    ordersHandled: 4500,
    notes: 'الموظف متفاني في عمله',
  },
  {
    id: 7,
    name: 'سامي يوسف',
    email: 'sami123@gmail.com',
    phone: '966555102030',
    merchant: 'يوسكو',
    role: 'مدير متجر',
    status: 'نشط',
    rating: 4,
    ordersHandled: 4500,
    notes: 'الموظف متفاني في عمله',
  },
  {
    id: 8,
    name: 'سامي يوسف',
    email: 'sami123@gmail.com',
    phone: '966555102030',
    merchant: 'يوسكو',
    role: 'مدير متجر',
    status: 'نشط',
    rating: 4,
    ordersHandled: 4500,
    notes: 'الموظف متفاني في عمله',
  },
];

const Th = ({ children, className = '' }) => (
  <th className={`p-3 font-semibold text-gray-500 ${className}`}>{children}</th>
);

const Td = ({ children, className = '' }) => (
  <td className={`p-3 text-xs text-gray-700 ${className}`}>{children}</td>
);

const StatusBadge = ({ status }) => {
  const colorMap = {
    'نشط': 'bg-green-100 text-green-700',
    'موقوف': 'bg-red-100 text-red-700',
    'معلق': 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[status]}`}>
      {status}
    </span>
  );
};

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    );
  }
  return <div className="flex items-center justify-center space-x-0.5 rtl:space-x-reverse">{stars}</div>;
};

// Modal Components
const EmployeeDetailsModal = ({ employee, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">تفاصيل الموظف</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">الاسم</label>
            <input type="text" value={employee.name} readOnly className="px-4 py-2 bg-gray-100 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">الجوال</label>
            <input type="text" value={employee.phone} readOnly className="px-4 py-2 bg-gray-100 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">البريد</label>
            <input type="text" value={employee.email} readOnly className="px-4 py-2 bg-gray-100 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">التاجر التابع له</label>
            <input type="text" value={employee.merchant} readOnly className="px-4 py-2 bg-gray-100 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">الصلاحية</label>
            <input type="text" value={employee.role} readOnly className="px-4 py-2 bg-gray-100 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">الحالة</label>
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm flex items-center">
              <StatusBadge status={employee.status} />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">التقييم</label>
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm flex items-center justify-center">
              <StarRating rating={employee.rating} />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">الطلبات التي تعامل معها</label>
            <input type="text" value={employee.ordersHandled} readOnly className="px-4 py-2 bg-gray-100 rounded-lg text-sm" />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">ملاحظات إدارية</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
            rows="4"
            value={employee.notes}
            readOnly
          ></textarea>
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

const EditEmployeeModal = ({ employee, onClose }) => {
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">تعديل البيانات</h2>
          <button onClick={onClose}>
            <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">الاسم</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">البريد</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">رقم الجوال</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
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
};

const EditPermissionsModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">تعديل الصلاحيات</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">الدور الاداري للموظف</label>
        <div className="relative">
          <select className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none pr-10">
            <option>مدير متجر</option>
            <option>مسؤول مخزون</option>
            <option>مسؤول مبيعات</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
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

const ToggleStatusModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">تعليق أو تفعيل</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">برجاء إختيار حالة الموظف</label>
        <div className="relative">
          <select className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none pr-10">
            <option>نشط</option>
            <option>موقوف</option>
            <option>معلق</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
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

const CloseAccountModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-sm text-center">
      <div className="p-4 flex justify-end">
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex justify-center text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold">هل أنت متأكد أنك تريد إغلاق هذا الحساب؟</h2>
        <p className="text-gray-500 text-sm font-bold">
          هل أنت متأكد أنك تريد الإغلاق؟
        </p>
      </div>
      <div className="p-4 border-t flex justify-center gap-3">
        <button onClick={onClose} className="px-6 py-2 text-gray-700 font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium">
          إغلاق
        </button>
      </div>
    </div>
  </div>
);

const EmployeeManagement = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [activeModal, setActiveModal] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleDropdownToggle = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setActiveDropdown(null); 
  };
  
  const handleOpenModal = (modalName, employee = null) => {
    setSelectedEmployee(employee);
    setActiveModal(modalName);
    setActiveDropdown(null);
  };
  
  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedEmployee(null);
  };

  const filteredEmployees = statusFilter === 'الكل'
    ? employeesData
    : employeesData.filter(emp => emp.status === statusFilter);

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">إدارة موظفو التاجر</h1>
        <div className="flex border-b border-gray-200">
          <Link
            to="/merchants"
            className="py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            ملفات التجار
          </Link>
          <Link
            to="/employees"
            className="py-2 px-4 text-sm font-medium border-b-2 border-red-500 text-red-500"
          >
            موظفو التاجر
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <FaUserTimes className="text-red-500 text-3xl ml-3" />
          <div>
            <p className="text-sm text-gray-500">موظفين تم تعليقهم</p>
            <p className="text-xl font-bold">12 موظفًا</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <FaUsers className="text-orange-500 text-3xl ml-3" />
          <div>
            <p className="text-sm text-gray-500">صلاحيات محدودة</p>
            <p className="text-xl font-bold">50 موظفًا</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <FaUsers className="text-green-500 text-3xl ml-3" />
          <div>
            <p className="text-sm text-gray-500">نشطين حالياً</p>
            <p className="text-xl font-bold">150 موظفًا</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <FaUsers className="text-blue-500 text-3xl ml-3" />
          <div>
            <p className="text-sm text-gray-500">اجمالي الموظفين</p>
            <p className="text-xl font-bold">450 موظفًا</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 rtl:space-x-reverse">
        <div className="relative w-full md:w-auto flex-grow">
          <input
            type="text"
            placeholder="ابحث عن اسم الموظف, الحالة"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative w-full md:w-48">
          <button
            className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 text-sm flex justify-between items-center"
            onClick={() => setActiveDropdown(activeDropdown === 'statusFilter' ? null : 'statusFilter')}
          >
            {statusFilter}
            <FaAngleUp className={`transform transition-transform ${activeDropdown === 'statusFilter' ? 'rotate-0' : 'rotate-180'}`} />
          </button>
          {activeDropdown === 'statusFilter' && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleStatusFilterChange('الكل')}
              >
                الكل
              </button>
              <button
                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleStatusFilterChange('نشط')}
              >
                نشط
              </button>
              <button
                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleStatusFilterChange('موقوف')}
              >
                موقوف
              </button>
              <button
                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleStatusFilterChange('معلق')}
              >
                معلق
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-right">
              <tr>
                <Th>الاسم</Th>
                <Th>البريد</Th>
                <Th>رقم الجوال</Th>
                <Th>الصلاحية</Th>
                <Th>التاجر التابع</Th>
                <Th>الحالة</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <Td>{employee.name}</Td>
                  <Td>{employee.email}</Td>
                  <Td>{employee.phone}</Td>
                  <Td>{employee.role}</Td>
                  <Td>{employee.merchant}</Td>
                  <Td><StatusBadge status={employee.status} /></Td>
                  <Td className="relative">
                    <button
                      className="text-gray-500 hover:text-gray-800"
                      onClick={() => handleDropdownToggle(employee.id)}
                    >
                      <FaEllipsisH />
                    </button>
                    {activeDropdown === employee.id && (
                      <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button onClick={() => handleOpenModal('details', employee)} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaEye className="ml-2" /> عرض التفاصيل
                        </button>
                        <button onClick={() => handleOpenModal('edit', employee)} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaEdit className="ml-2" /> تعديل البيانات
                        </button>
                        <button onClick={() => handleOpenModal('permissions')} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaEdit className="ml-2" /> تعديل الصلاحيات
                        </button>
                        <button onClick={() => handleOpenModal('toggleStatus')} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaStore className="ml-2" /> تعليق أو تفعيل
                        </button>
                        <button onClick={() => handleOpenModal('addNote')} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <FaRegComment className="ml-2" /> إضافة ملاحظة إدارية
                        </button>
                        <button onClick={() => handleOpenModal('closeAccount')} className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          <FaTrashAlt className="ml-2" /> إغلاق
                        </button>
                      </div>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-gray-500 text-sm flex items-center">
            أعرض في الصفحة
            <select className="mx-2 border border-gray-300 rounded-md py-1 px-2">
              <option>10</option>
              <option>20</option>
            </select>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-gray-500">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-red-500">&gt;</button>
            <span className="px-3 py-1 border border-gray-300 rounded-md text-red-500 font-bold">1</span>
            <span className="px-3 py-1 border border-gray-300 rounded-md">2</span>
            <span className="px-3 py-1 border border-gray-300 rounded-md">3</span>
            <span className="px-3 py-1 border border-gray-300 rounded-md">4</span>
            <span className="px-3 py-1 border border-gray-300 rounded-md">5</span>
            <button className="px-3 py-1 border border-gray-300 rounded-md">&lt;</button>
          </div>
        </div>
      </div>
      
      {activeModal === 'details' && selectedEmployee && <EmployeeDetailsModal employee={selectedEmployee} onClose={handleCloseModal} />}
      {activeModal === 'edit' && selectedEmployee && <EditEmployeeModal employee={selectedEmployee} onClose={handleCloseModal} />}
      {activeModal === 'permissions' && <EditPermissionsModal onClose={handleCloseModal} />}
      {activeModal === 'toggleStatus' && <ToggleStatusModal onClose={handleCloseModal} />}
      {activeModal === 'addNote' && <AddNoteModal onClose={handleCloseModal} />}
      {activeModal === 'closeAccount' && <CloseAccountModal onClose={handleCloseModal} />}
    </div>
  );
};

export default EmployeeManagement;