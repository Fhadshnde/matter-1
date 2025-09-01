import React, { useState } from 'react';
import { FaChevronDown, FaStore, FaChartBar, FaUserTie, FaUsers, FaUserPlus, FaKey, FaTrash } from 'react-icons/fa';
import { BsThreeDots, BsEyeSlash, BsEye } from 'react-icons/bs';
import { RiCloseFill } from 'react-icons/ri';

const statsCards = [
  { title: 'عدد الموظفين', value: '350,000', icon: 'users' },
  { title: 'الأدوار المختلفة', value: '24 دور', icon: 'user-tie' },
  { title: 'الحسابات المحظورة', value: '70,000 حساب', icon: 'locked' },
  { title: 'نسبة التطبيق', value: '2.5%', icon: 'percent' },
];

const employeesData = [
  { id: 1, name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'نشط' },
  { id: 2, name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'نشط' },
  { id: 3, name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'نشط' },
  { id: 4, name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'نشط' },
  { id: 5, name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'نشط' },
  { id: 6, name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'نشط' },
  { id: 7, name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'نشط' },
  { id: 8, name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'نشط' },
];

const StatCard = ({ title, value, icon }) => {
  const icons = {
    'users': <div className="bg-gray-100 p-3 rounded-xl"><FaUsers className="text-red-500 text-2xl" /></div>,
    'user-tie': <div className="bg-gray-100 p-3 rounded-xl"><FaUserTie className="text-red-500 text-2xl" /></div>,
    'locked': <div className="bg-gray-100 p-3 rounded-xl"><FaChartBar className="text-red-500 text-2xl" /></div>,
    'percent': <div className="bg-gray-100 p-3 rounded-xl"><FaStore className="text-red-500 text-2xl" /></div>,
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

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <RiCloseFill size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const AddEmployeeModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة موظف">
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">الاسم الكامل</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="محمد أحمد صالح" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">البريد الإلكتروني</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="msaleh@info.com" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">رقم الجوال</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="tel" placeholder="+964 55543456" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">الدور</label>
          <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option>مالي</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">كلمة المرور</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="********" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">إعادة كلمة المرور</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="********" />
        </div>
        <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            الغاء
          </button>
          <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            إضافة
          </button>
        </div>
      </form>
    </Modal>
  );
};

const ChangePasswordModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تغيير كلمة المرور">
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">كلمة المرور الجديدة</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="********" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">إعادة كلمة المرور</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="********" />
        </div>
        <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            الغاء
          </button>
          <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            حفظ
          </button>
        </div>
      </form>
    </Modal>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="حذف الحساب">
      <div className="text-center mb-6">
        <div className="bg-red-100 rounded-full p-4 inline-block mb-4">
          <RiCloseFill className="text-red-500" size={48} />
        </div>
        <p className="text-gray-700 text-lg font-bold">هل أنت متأكد أنك تريد حذف الحساب؟</p>
        <p className="text-gray-500 text-sm mt-2">
          سوف يتم حذف الحساب من قائمة المستخدمين لديك هل انت متاكد؟
        </p>
      </div>
      <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          الغاء
        </button>
        <button type="button" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          حذف
        </button>
      </div>
    </Modal>
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
        <a href="/settings" className={`${linkClass} ${activePage === 'employees' ? activeClass : inactiveClass}`}>
          إعدادات الموظفين
        </a>
        <a href="/powers" className={`${linkClass} ${activePage === 'general' ? activeClass : inactiveClass}`}>
          إعدادات عامة
        </a>
      </div>
    </div>
  );
};

const EmployeesPage = () => {
  const [showDropdown, setShowDropdown] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDropdownToggle = (id) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openPasswordModal = () => {
    setShowDropdown(null);
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const openDeleteModal = () => {
    setShowDropdown(null);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">لوحة التحكم</h1>
      
      {/* New navigation added here */}
      <SettingsNav activePage="employees" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">الموظفين</h3>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button onClick={openAddModal} className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded flex items-center">
              <FaUserPlus className="ml-2" />
              إضافة موظف
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-right">
              <tr>
                <Th className="text-right">الاسم</Th>
                <Th>البريد</Th>
                <Th>الجوال</Th>
                <Th>الدور</Th>
                <Th>آخر دخول</Th>
                <Th>الحالة</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {employeesData.map((employee) => (
                <tr key={employee.id}>
                  <Td>{employee.name}</Td>
                  <Td>{employee.email}</Td>
                  <Td>{employee.phone}</Td>
                  <Td>{employee.role}</Td>
                  <Td>{employee.lastLogin}</Td>
                  <Td>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'نشط' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {employee.status}
                    </span>
                  </Td>
                  <Td>
                    <div className="relative inline-block">
                      <button onClick={() => handleDropdownToggle(employee.id)} className="text-gray-500 hover:text-gray-700">
                        <BsThreeDots className="text-xl" />
                      </button>
                      {showDropdown === employee.id && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 text-right">
                          <button onClick={openPasswordModal} className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end">
                            <span>تغيير كلمة المرور</span>
                            <FaKey className="ml-2" />
                          </button>
                          <button onClick={openDeleteModal} className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center justify-end">
                            <span>حذف</span>
                            <FaTrash className="ml-2" />
                          </button>
                        </div>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-gray-700">إجمالي الموظفين: 24</span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-gray-500">أعرض في الصفحة 10</span>
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

      <AddEmployeeModal isOpen={isAddModalOpen} onClose={closeAddModal} />
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={closePasswordModal} />
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} />
    </div>
  );
};

export default EmployeesPage;