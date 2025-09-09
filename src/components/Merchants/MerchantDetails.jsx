import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RiCloseFill } from 'react-icons/ri';
import { FaRegComment, FaRegUser, FaBell, FaCalendarAlt, FaStar, FaStore, FaChartBar } from 'react-icons/fa';
import { BiDollar } from 'react-icons/bi';
import { BiBlock } from 'react-icons/bi';

const StatusBadge = ({ status }) => {
  const colorMap = {
    'نشط': 'bg-green-100 text-green-700',
    'مكتمل': 'bg-green-100 text-green-700',
    'متوفر': 'bg-green-100 text-green-700',
    'غير متوفر': 'bg-red-100 text-red-700',
    'قيد المعالجة': 'bg-yellow-100 text-yellow-700',
    'ملغي': 'bg-red-100 text-red-700',
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

const Td = ({ children, className = '' }) => (
  <td className={`p-3 text-xs text-gray-700 ${className}`}>{children}</td>
);

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar
        key={i}
        className={`w-3 h-3 ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    );
  }
  return <div className="flex items-center space-x-0.5 rtl:space-x-reverse">{stars}</div>;
};

const AddNoteModal = ({ merchantId, onClose }) => {
  const [noteText, setNoteText] = useState("");
  const [priority, setPriority] = useState("medium");
  const baseUrl = 'https://products-api.cbc-apps.net';

  const handleSave = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch(`${baseUrl}/admin/dashboard/merchants/${merchantId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          note: noteText,
          priority: priority
        })
      });

      if (!response.ok) {
        throw new Error('فشل في إرسال الملاحظة');
      }

      const data = await response.json();
      console.log("تمت إضافة الملاحظة:", data);
      alert("تمت إضافة الملاحظة بنجاح.");
      onClose();
    } catch (error) {
      console.error("Error adding note:", error);
      alert("فشل في إضافة الملاحظة.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">إضافة ملاحظة</h2>
        <textarea
          className="w-full border p-2 rounded-md mb-3"
          rows="4"
          placeholder="أدخل الملاحظة هنا"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <label className="block mb-2">الأولوية:</label>
        <select
          className="w-full border p-2 rounded-md mb-4"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">منخفضة</option>
          <option value="medium">متوسطة</option>
          <option value="high">مرتفعة</option>
        </select>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md"
            onClick={onClose}
          >
            إلغاء
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={handleSave}
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
};

const SendNotificationModal = ({ onClose }) => {
  const [channels, setChannels] = useState({
    email: true,
    sms: true,
    inApp: true,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setChannels(prevChannels => ({
      ...prevChannels,
      [name]: checked,
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">إرسال إشعار</h2>
          <button onClick={onClose}>
            <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <input
              type="checkbox"
              name="email"
              checked={channels.email}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4 w-4 text-red-600 rounded"
            />
            <label className="text-gray-700 font-semibold">البريد الالكتروني</label>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <input
              type="checkbox"
              name="sms"
              checked={channels.sms}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4 w-4 text-red-600 rounded"
            />
            <label className="text-gray-700 font-semibold">رسالة نصية SMS</label>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <input
              type="checkbox"
              name="inApp"
              checked={channels.inApp}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4 w-4 text-red-600 rounded"
            />
            <label className="text-gray-700 font-semibold">اشعار داخل التطبيق</label>
          </div>
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
};

const BlockMerchantModal = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  const handleAction = () => {
    if (!reason) {
      alert("يرجى كتابة سبب الحظر");
      return;
    }
    onConfirm(true, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-sm text-center">
        <div className="p-4 flex justify-end">
          <button onClick={onClose}>
            <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="text-4xl flex justify-center mx-auto w-14 h-14 rounded-full bg-red-100 text-red-500 items-center mb-3">
            <BiBlock className="text-3xl" />
          </div>
          <h2 className="text-lg font-bold">حظر التاجر</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد أنك تريد حظر هذا التاجر؟
          </p>
          <textarea
            className="w-full border p-2 rounded-md"
            rows={3}
            placeholder="أدخل سبب الحظر هنا"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="p-4 border-t flex justify-center gap-3">
          <button onClick={onClose} className="px-6 py-2 text-gray-700 font-medium">
            إلغاء
          </button>
          <button
            onClick={handleAction}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium"
          >
            حظر التاجر
          </button>
        </div>
      </div>
    </div>
  );
};

const UnblockMerchantModal = ({ onClose, onConfirm }) => {
  const handleAction = () => {
    onConfirm(false, "");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-sm text-center">
        <div className="p-4 flex justify-end">
          <button onClick={onClose}>
            <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="text-4xl flex justify-center mx-auto w-14 h-14 rounded-full bg-green-100 text-green-500 items-center mb-3">
            <BiBlock className="text-3xl" />
          </div>
          <h2 className="text-lg font-bold">إلغاء حظر التاجر</h2>
          <p className="text-gray-500 text-sm">
            هل أنت متأكد أنك تريد إلغاء حظر هذا التاجر؟
          </p>
        </div>
        <div className="p-4 border-t flex justify-center gap-3">
          <button onClick={onClose} className="px-6 py-2 text-gray-700 font-medium">
            إلغاء
          </button>
          <button
            onClick={handleAction}
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium"
          >
            إلغاء الحظر
          </button>
        </div>
      </div>
    </div>
  );
};

const MerchantDetails = () => {
  const [activeModal, setActiveModal] = useState(null);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = 'https://products-api.cbc-apps.net';

  const fetchMerchantDetails = async () => {
    setLoading(true);
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch(`${baseUrl}/admin/dashboard/merchants/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch merchant data.');
      }

      const apiData = await response.json();

      const formattedData = {
        personalData: {
          name: apiData.personalData.merchantName,
          phone: apiData.personalData.phone,
          email: apiData.personalData.email,
          registrationDate: new Date(apiData.personalData.registrationDate).toLocaleDateString('ar-SA'),
          status: apiData.personalData.status
        },
        storeData: {
          storeName: apiData.storeData.storeName,
          activity: apiData.storeData.businessType,
          city: apiData.storeData.province
        },
        statsCards: [
          { title: 'الطلبات المكتملة', value: `${apiData.statsCards.completedOrdersRate}%`, icon: <FaChartBar /> },
          { title: 'عدد الشكاوي', value: `${apiData.statsCards.complaintsCount} شكاوي`, icon: <FaRegComment /> },
          { title: 'عدد الطلبات', value: `${apiData.statsCards.totalOrders} طلب`, icon: <FaChartBar /> },
          { title: 'عدد المنتجات', value: `${apiData.statsCards.totalProducts} منتج`, icon: <FaChartBar /> },
        ],
        productsData: apiData.products.map(p => ({
          name: p.productName,
          price: `${p.price} د.ع`,
          orders: p.ordersCount,
          rating: p.rating,
          status: p.status
        })),
        ordersData: apiData.orders.map(o => ({
          id: `#${o.orderId}`,
          date: new Date(o.orderDate).toLocaleDateString('ar-SA'),
          customer: o.customerName,
          amount: `${o.amount} د.ع`,
          status: o.status
        })),
        ratingsData: apiData.reviews.map(r => ({
          date: new Date(r.reviewDate).toLocaleDateString('ar-SA'),
          user: r.customerName,
          rating: r.rating,
          comment: r.comment
        })),
      };

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching merchant data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUnbanMerchant = async (banned, reason) => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await fetch(`${baseUrl}/admin/dashboard/merchants/${id}/ban`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ banned, reason })
      });
      if (!response.ok) {
        throw new Error(banned ? "فشل حظر التاجر" : "فشل إلغاء الحظر");
      }
      const updatedData = await response.json();
      setData(prevData => ({
        ...prevData,
        personalData: {
          ...prevData.personalData,
          status: updatedData.status
        }
      }));
      alert(`تم ${banned ? 'حظر' : 'إلغاء حظر'} التاجر بنجاح.`);
    } catch (error) {
      console.error("خطأ في تحديث حالة التاجر:", error);
      alert(`فشل في ${banned ? 'حظر' : 'إلغاء حظر'} التاجر.`);
    } finally {
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (id) {
      fetchMerchantDetails();
    }
  }, [id]);

  const handleOpenModal = (modalName) => {
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  if (loading) {
    return (
      <div dir="rtl" className="p-6 text-center text-gray-500">
        <h1 className="text-2xl font-bold">جارٍ تحميل بيانات التاجر...</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div dir="rtl" className="p-6 text-center text-gray-500">
        <h1 className="text-2xl font-bold">لم يتم العثور على بيانات التاجر.</h1>
      </div>
    );
  }

  const renderTable = (type) => {
    let tableData, columns, total;

    switch (type) {
      case 'products':
        tableData = data.productsData;
        columns = [
          { key: 'name', header: 'اسم المنتج' },
          { key: 'price', header: 'السعر' },
          { key: 'orders', header: 'عدد الطلبات' },
          { key: 'rating', header: 'التقييم', isRating: true },
          { key: 'status', header: 'الحالة', isStatus: true },
        ];
        total = data.productsData.length;
        break;
      case 'orders':
        tableData = data.ordersData;
        columns = [
          { key: 'id', header: 'رقم الطلب' },
          { key: 'date', header: 'التاريخ' },
          { key: 'customer', header: 'الزبون' },
          { key: 'amount', header: 'المبلغ' },
          { key: 'status', header: 'الحالة', isStatus: true },
        ];
        total = data.ordersData.length;
        break;
      case 'ratings':
        tableData = data.ratingsData;
        columns = [
          { key: 'user', header: 'الزبون' },
          { key: 'date', header: 'التاريخ' },
          { key: 'comment', header: 'التعليق' },
          { key: 'rating', header: 'التقييم', isRating: true },
        ];
        total = data.ratingsData.length;
        break;
      default:
        return null;
    }

    return (
      <div className="bg-white rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-right">
              <tr>
                {columns.map((col, index) => (
                  <Th key={index}>{col.header}</Th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {tableData.map((item, index) => (
                <tr key={index}>
                  {columns.map((col, colIndex) => (
                    <Td key={colIndex}>
                      {col.isStatus ? (
                        <StatusBadge status={item[col.key]} />
                      ) : col.isRating ? (
                        <StarRating rating={item[col.key]} />
                      ) : (
                        item[col.key]
                      )}
                    </Td>
                  ))}
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
    );
  };

  return (
    <div dir="rtl" className="p-3 bg-gray-50 min-h-screen font-sans flex flex-col lg:flex-row gap-4">
      <div className="lg:w-1/3 space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <img src="https://via.placeholder.com/80" alt="User Profile" className="w-20 h-20 rounded-full" />
            <div className="text-right">
              <h2 className="text-lg font-bold">{data.personalData.name}</h2>
              <p className="text-sm text-gray-500">{data.personalData.phone}</p>
              <p className="text-sm text-gray-500">{data.personalData.email}</p>
              <p className="text-sm text-gray-500">تاريخ التسجيل: {data.personalData.registrationDate}</p>
              <StatusBadge status={data.personalData.status} />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => handleOpenModal('block')} className="bg-red-500 text-white py-2 px-4 rounded-lg flex-1 mx-1 flex items-center justify-center">
              <BiBlock className="ml-2" /> حظر التاجر
            </button>
            <button onClick={() => handleOpenModal('unblock')} className="bg-green-500 text-white py-2 px-4 rounded-lg flex-1 mx-1 flex items-center justify-center">
              <BiBlock className="ml-2" /> إلغاء الحظر
            </button>
          </div>
          <button onClick={() => handleOpenModal('addNote')} className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg mt-2 flex items-center justify-center">
            <FaRegComment className="ml-2" /> اضافه ملاحظه
          </button>
          <button onClick={() => handleOpenModal('sendNotification')} className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg mt-2 flex items-center justify-center">
            <FaBell className="ml-2" /> إرسال إشعار
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">بيانات المتجر</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between items-center">
              <span>اسم المتجر</span>
              <span className="font-medium">{data.storeData.storeName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>نوع النشاط</span>
              <span className="font-medium">{data.storeData.activity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>المحافظة</span>
              <span className="font-medium">{data.storeData.city}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-2/3 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.statsCards.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="flex justify-center mb-2 text-xl text-gray-500">{section.icon}</div>
              <p className="text-sm text-gray-500 mb-1">{section.title}</p>
              <p className="text-lg font-bold">{section.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <h3 className="p-4 text-lg font-bold border-b">المنتجات التابعة له</h3>
          {renderTable('products')}
          <div className="p-4 text-right text-sm text-gray-500">
            إجمالي المنتجات: {data.productsData.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <h3 className="p-4 text-lg font-bold border-b">الطلبات الخاصة به</h3>
          {renderTable('orders')}
          <div className="p-4 text-right text-sm text-gray-500">
            إجمالي الطلبات: {data.ordersData.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <h3 className="p-4 text-lg font-bold border-b">التقييمات</h3>
          {renderTable('ratings')}
          <div className="p-4 text-right text-sm text-gray-500">
            إجمالي التقييمات: {data.ratingsData.length}
          </div>
        </div>
      </div>
      {activeModal === 'addNote' && (
        <AddNoteModal
          merchantId={id}
          onClose={handleCloseModal}
        />
      )}
      {activeModal === 'sendNotification' && <SendNotificationModal onClose={handleCloseModal} />}
      {activeModal === 'block' && <BlockMerchantModal onClose={handleCloseModal} onConfirm={handleBanUnbanMerchant} />}
      {activeModal === 'unblock' && <UnblockMerchantModal onClose={handleCloseModal} onConfirm={handleBanUnbanMerchant} />}
    </div>
  );
};

export default MerchantDetails;