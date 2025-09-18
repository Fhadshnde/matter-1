import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import { RiCloseFill } from 'react-icons/ri';
import { FaRegUser, FaStore, FaChartBar, FaUserLock, FaRegComment, FaCalendarAlt, FaChevronDown, FaRegPauseCircle } from 'react-icons/fa';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { MdInfoOutline } from 'react-icons/md';
import axios from 'axios';
import API_CONFIG, { apiCall } from '../../config/api';

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

const addNote = async (id, noteText, priority = "medium", onClose) => {
  const token = localStorage.getItem("userToken");
  const baseUrl = "https://products-api.cbc-apps.net";

  try {
    const response = await axios.post(
      `${baseUrl}/admin/dashboard/merchants/${id}/notes`,
      {
        note: noteText,
        priority: priority
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    console.log("تمت إضافة الملاحظة:", response.data);

    if (onClose) onClose();

    return response.data;

  } catch (error) {
    console.error("Error adding note:", error);
    return null;
  }
};

const banMerchant = async (merchantId, banned, reason) => {
  const token = localStorage.getItem("userToken");
  const baseUrl = "https://products-api.cbc-apps.net";

  try {
    const response = await fetch(`${baseUrl}/admin/dashboard/merchants/${merchantId}/ban`, {
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

    const data = await response.json();
    console.log(banned ? "تم حظر التاجر:" : "تم إلغاء الحظر:", data);
    return data;
  } catch (error) {
    console.error("خطأ في تحديث حالة التاجر:", error);
  }
};

// Modal components
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

const BanMerchantModal = ({ onClose, merchantId, banMerchant }) => {
  const [reason, setReason] = useState("");

  const handleBan = async () => {
    if (!reason) {
      alert("يرجى كتابة سبب الحظر");
      return;
    }
    await banMerchant(merchantId, true, reason);
    onClose();
  };

  const handleUnban = async () => {
    await banMerchant(merchantId, false, "تم رفع الحظر");
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
          <h2 className="text-lg font-bold">إدارة حالة التاجر</h2>
          <p className="text-gray-500 text-sm">
            يمكنك حظر التاجر أو إلغاء الحظر.
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
            الغاء
          </button>
          <button
            onClick={handleBan}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium"
          >
            حظر التاجر
          </button>
          <button
            onClick={handleUnban}
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium"
          >
            إلغاء الحظر
          </button>
        </div>
      </div>
    </div>
  );
};

const AddNoteModal = ({ merchantId, onClose }) => {
  const [noteText, setNoteText] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleSave = async () => {
    await addNote(merchantId.toString(), noteText, priority);
    onClose();
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

// New Supplier Modal
const AddSupplierModal = ({ onClose }) => {
  const [supplierData, setSupplierData] = useState({
    name: "",
    contactInfo: "",
    address: "",
    phone: "",
    password: "",
    platformPercentage: 0,
    hasWholesalePrice: false,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSupplierData({
      ...supplierData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  

  const addSupplier = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    const baseUrl = "https://products-api.cbc-apps.net";
    setMessage("");
    setError("");
  
    const payload = {
      ...supplierData,
      platformPercentage: parseFloat(supplierData.platformPercentage), 
      hasWholesalePrice: Boolean(supplierData.hasWholesalePrice),     
    };
  
    try {
      const response = await fetch(`${baseUrl}/admin/dashboard/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "فشل في إضافة المورد");
      }
  
      const data = await response.json();
      console.log("Supplier added successfully:", data);
      setMessage("تمت إضافة المورد بنجاح.");
      setSupplierData({
        name: "",
        contactInfo: "",
        address: "",
        phone: "",
        password: "",
        platformPercentage: 0,
        hasWholesalePrice: false,
      });
      if (onClose) onClose();
      window.location.reload();
    } catch (err) {
      console.error("Error adding supplier:", err);
      setError("فشل في إضافة المورد. يرجى التأكد من البيانات.");
    }
  };
  
  

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">إضافة مورد جديد</h2>
          <button onClick={onClose}>
            <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
          </button>
        </div>
        <form onSubmit={addSupplier} className="p-5 space-y-4">
  {message && (
    <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">
      {message}
    </div>
  )}
  {error && (
    <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
      {error}
    </div>
  )}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      اسم المورد
    </label>
    <input
      type="text"
      name="name"
      value={supplierData.name}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
      required
    />
  </div>
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      معلومات الاتصال
    </label>
    <input
      type="text"
      name="contactInfo"
      value={supplierData.contactInfo}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
      required
    />
  </div>
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      العنوان الكامل
    </label>
    <input
      type="text"
      name="address"
      value={supplierData.address}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
      required
    />
  </div>
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      رقم الهاتف
    </label>
    <input
      type="tel"
      name="phone"
      value={supplierData.phone}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
      required
    />
  </div>
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      كلمة المرور
    </label>
    <input
      type="password"
      name="password"
      value={supplierData.password}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
      required
    />
  </div>
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      نسبة المنصة
    </label>
    <input
      type="number"
      name="platformPercentage"
      step="0.01"
      value={supplierData.platformPercentage}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
      required
    />
  </div>
  <div className="flex items-center">
    <input
      type="checkbox"
      id="hasWholesalePrice"
      name="hasWholesalePrice"
      checked={supplierData.hasWholesalePrice}
      onChange={handleInputChange}
      className="ml-2"
    />
    <label
      htmlFor="hasWholesalePrice"
      className="text-sm font-semibold text-gray-700"
    >
      لديه سعر جملة
    </label>
  </div>
  <div className="p-4 border-t flex justify-end gap-3">
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-1.5 text-gray-700 text-sm font-medium"
    >
      إلغاء
    </button>
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
    >
      إضافة المورد
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

const OfferDetailsModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-lg">
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
  const [merchantsData, setMerchantsData] = useState([]);
  const [merchantCards, setMerchantCards] = useState([]);
  const [totalMerchants, setTotalMerchants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMerchantId, setSelectedMerchantId] = useState(null);


  // Function to fetch data from the merchants dashboard API
  const fetchMerchantsData = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '20'
      });
      const apiData = await apiCall(`${API_CONFIG.ADMIN.MERCHANTS}?${params.toString()}`);

      // Map API card data to the component's card format
      const cards = [
        { title: 'تجار لديهم تقييم', value: `${apiData.cards.merchantsWithRatings} تاجر`, icon: <FaRegComment /> },
        { title: 'تجار محظورين', value: `${apiData.cards.bannedMerchants} تجار`, icon: <FaUserLock /> },
        { title: 'تجار موقوفين', value: `${apiData.cards.suspendedMerchants} تاجر`, icon: <FaRegPauseCircle /> },
        { title: 'التجار النشطين', value: `${apiData.cards.activeMerchants} تاجر`, icon: <FaRegUser /> },
      ];

      setMerchantsData(apiData.merchants);
      setMerchantCards(cards);
      setTotalMerchants(apiData.pagination.total);

    } catch (error) {
      console.error("Error fetching merchants data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantsData();
  }, []);

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
          {/* New Supplier Button */}
          <button
            onClick={() => handleOpenModal('addSupplier')}
            className="py-2 px-4 text-sm font-medium text-blue-500 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-500 transition-colors duration-200"
          >
            إضافة مورد جديد
          </button>
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
                <Th>ملاحظات</Th>
                <Th>الحالة</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {merchantsData.map((merchant, index) => (
                <tr key={index}>
                  <Td>
                    <Link to={`/merchants/${merchant.merchantId}`} className="text-blue-600 hover:underline">
                      {merchant.merchantName}
                    </Link>
                  </Td>
                  <Td>{merchant.storeName}</Td>
                  <Td>{merchant.businessType}</Td>
                  <Td>{merchant.productsCount}</Td>
                  <Td>{merchant.ordersCount}</Td>
                  <Td>{merchant.averageRating}</Td>
                  <Td>{merchant.notes}</Td>

                  <Td><StatusBadge status={merchant.status} /></Td>

                  <Td>
                    <div className="relative inline-block text-right">
                      <button onClick={() => handleOpenModal(`actions-${index}`)} className="text-gray-500 hover:text-gray-700">
                        <BsThreeDots className="text-xl" />
                      </button>
                      {activeModal === `actions-${index}` && (
                        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          {/* <a href="#" onClick={() => handleOpenModal('changeStatus')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <FaRegUser className="ml-2" /> تغيير حالة التاجر
                          </a> */}
                          <a
                            href="#"
                            onClick={() => handleOpenModal(`addNote-${merchant.merchantId}`)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <FaRegComment className="ml-2" /> اضافه ملاحظه
                          </a>
                          <a
                            href="#"
                            onClick={() => {
                              setSelectedMerchantId(merchant.merchantId);
                              handleOpenModal('banMerchant');
                            }}
                            className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 flex items-center"
                          >
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
          <span className="text-sm text-gray-700">إجمالي التجار {totalMerchants}</span>
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
      {activeModal === 'banMerchant' && (
        <BanMerchantModal
          onClose={handleCloseModal}
          merchantId={selectedMerchantId}
          banMerchant={banMerchant}
        />
      )}
      {activeModal?.startsWith('addNote-') && (
        <AddNoteModal
          merchantId={activeModal.split('-')[1]}
          onClose={handleCloseModal}
        />
      )}
      {activeModal === 'offerDetails' && <OfferDetailsModal onClose={handleCloseModal} />}
      {activeModal === 'addSupplier' && <AddSupplierModal onClose={handleCloseModal} />}
    </div>
  );
};

export default MerchantsDashboard;