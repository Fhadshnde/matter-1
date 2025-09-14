import React, { useState, useEffect } from 'react';
import { BsThreeDots, BsPerson } from 'react-icons/bs';
import { BiBlock } from 'react-icons/bi';
import { PiNotePencil } from 'react-icons/pi';
import { FaMagnifyingGlass, FaRegCalendarDays, FaRegNoteSticky } from 'react-icons/fa6';
import { RiCloseFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

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

const Card = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg p-4 flex items-center justify-between text-right shadow-sm">
    <div className="flex flex-col">
      <span className="text-gray-400 text-xs mb-1">{title}</span>
      <p className="text-xl font-semibold mb-1">{value}</p>
    </div>
    <div className="bg-gray-100 p-2.5 rounded-full text-xl text-red-500">
      {icon}
    </div>
  </div>
);

const Th = ({ children, className = '' }) => (
  <th className={`p-3 font-semibold text-gray-500 ${className}`}>{children}</th>
);

const Td = ({ children }) => (
  <td className="p-3 text-xs text-gray-700">{children}</td>
);

const ActionModal = ({ customer, actionType, onClose, onConfirm }) => {
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState('low');

  if (!customer) return null;

  let title, confirmButtonText, confirmButtonColor, content;

  const handleConfirm = () => {
    if (actionType === 'addNote') {
      onConfirm(customer.customerId, actionType, { note, priority });
    } else {
      onConfirm(customer.customerId, actionType);
    }
  };

  if (actionType === 'edit') {
    title = 'تعديل الزبون';
    confirmButtonText = 'تعديل';
    confirmButtonColor = 'bg-blue-500 hover:bg-blue-600';
    content = <p className="text-gray-700 mb-6">هل أنت متأكد من تعديل بيانات {customer.customerName}؟</p>;
  } else if (actionType === 'ban') {
    title = 'حظر الزبون';
    confirmButtonText = 'حظر';
    confirmButtonColor = 'bg-red-500 hover:bg-red-600';
    content = <p className="text-gray-700 mb-6">هل أنت متأكد من حظر {customer.customerName}؟</p>;
  } else if (actionType === 'addNote') {
    title = 'إضافة ملاحظة';
    confirmButtonText = 'إضافة';
    confirmButtonColor = 'bg-green-500 hover:bg-green-600';
    content = (
      <div className="flex flex-col space-y-4 text-right">
        <label htmlFor="note" className="text-sm font-medium text-gray-700">الملاحظة:</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="4"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="اكتب ملاحظة جديدة..."
        />
        <label htmlFor="priority" className="text-sm font-medium text-gray-700">الأولوية:</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="low">منخفضة</option>
          <option value="medium">متوسطة</option>
          <option value="high">مرتفعة</option>
        </select>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full text-center shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <RiCloseFill size={24} />
          </button>
        </div>
        {content}
        <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${confirmButtonColor}`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

const Customers = () => {
  const [customersData, setCustomersData] = useState([]);
  const [dashboardCards, setDashboardCards] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, customer: null, actionType: null });

  const baseUrl = 'https://products-api.cbc-apps.net';
  const token = localStorage.getItem('userToken');

  const fetchCustomersData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/admin/dashboard/customers?page=1&limit=20`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers data.');
      }

      const apiData = await response.json();
      const cards = [
        { title: 'إجمالي الزبائن', value: `${apiData.cards.totalCustomers} زبون`, icon: <BsPerson /> },
        { title: 'زبائن عندهم طلبات', value: `${apiData.cards.customersWithOrders} زبون`, icon: <FaRegCalendarDays /> },
        { title: 'زبائن محظورين', value: `${apiData.cards.bannedCustomers} زبون`, icon: <BiBlock /> },
        { title: 'معدل فشل الشراء', value: `${apiData.cards.purchaseDeclineRate}%`, icon: <PiNotePencil /> },
      ];

      setCustomersData(apiData.customers);
      setDashboardCards(cards);
      setTotalCustomers(apiData.pagination.total);
    } catch (error) {
      console.error("Error fetching customers data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersData();
  }, []);

  const handleDropdownToggle = (customerId) => {
    setOpenDropdownId(openDropdownId === customerId ? null : customerId);
  };

  const openModal = (customer, actionType) => {
    setModalState({ isOpen: true, customer, actionType });
    setOpenDropdownId(null);
  };

  const closeModal = () => {
    setModalState({ isOpen: false, customer: null, actionType: null });
  };
  
  const handleConfirmAction = async (customerId, actionType, data = {}) => {
    if (actionType === 'edit') {
      console.log(`Action: Edit customer ID: ${customerId}`);
    } else if (actionType === 'ban') {
      console.log(`Action: Ban customer ID: ${customerId}`);
    } else if (actionType === 'addNote') {
      try {
        const response = await fetch(`${baseUrl}/admin/dashboard/customers/${customerId}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('Failed to add note.');
        }
        console.log('Note added successfully!');
        await fetchCustomersData(); // ✅ هنا الحل
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
    closeModal();
  };

  if (loading) {
    return <div className="p-6 text-center">جاري تحميل البيانات...</div>;
  }

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">إدارة الزبائن</h1>
        <div className="flex border-b border-gray-200">
          <a href="#" className="py-2 px-4 text-sm font-medium border-b-2 border-red-500 text-red-500">
            ملفات الزبائن
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="ابحث عن اسم الزبون، رقم الهاتف"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            />
            <FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-right">
              <tr>
                <Th>الزبون</Th>
                <Th>رقم الهاتف</Th>
                <Th>عدد الطلبات</Th>
                <Th>إجمالي المصروفات</Th>
                <Th>الحالة</Th>
                <Th>تاريخ التسجيل</Th>
                <Th>الملاحظات</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {customersData.map((customer) => (
                <tr key={customer.customerId}>
                  <Td>
                    <Link to={`/customers/${customer.customerId}`} className="text-blue-600 hover:underline">
                      {customer.customerName}
                    </Link>
                  </Td>
                  <Td>{customer.phone}</Td>
                  <Td>{customer.ordersCount}</Td>
                  <Td>{customer.totalSpent} دينار</Td>
                  <Td><StatusBadge status={customer.status} /></Td>
                  <Td>{new Date(customer.registrationDate).toLocaleDateString('ar-EG')}</Td>
                  <Td>{customer.notes || 'لا توجد ملاحظات'}</Td>
                  <Td>
                    <div className="relative inline-block text-right">
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => handleDropdownToggle(customer.customerId)}
                      >
                        <BsThreeDots className="text-xl" />
                      </button>
                      
                      {openDropdownId === customer.customerId && (
                        <div className="absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <div className="py-1">
                            <button
                              onClick={() => openModal(customer, 'edit')}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-right"
                            >
                              <PiNotePencil className="ml-2" /> تعديل
                            </button>
                            <button
                              onClick={() => openModal(customer, 'addNote')}
                              className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-gray-100 w-full text-right"
                            >
                              <FaRegNoteSticky className="ml-2" /> إضافة ملاحظة
                            </button>
                          </div>
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
          <span className="text-sm text-gray-700">إجمالي الزبائن {totalCustomers}</span>
        </div>
      </div>
      
      <ActionModal
        customer={modalState.customer}
        actionType={modalState.actionType}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default Customers;
