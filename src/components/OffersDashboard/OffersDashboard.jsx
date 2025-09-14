import React, { useState, useEffect } from 'react';
import { BsThreeDots, BsDisplay } from 'react-icons/bs';
import { FaMagnifyingGlass, FaRegClock, FaRegCalendarDays, FaArrowRight, FaToggleOn, FaToggleOff, FaPlus } from 'react-icons/fa6';
import { FaRegTrashAlt, FaPen, FaInfoCircle } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { MdOutlineDateRange } from 'react-icons/md';
import { AiOutlineBarChart } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, className }) => (
  <div className={`bg-white rounded-xl shadow-md p-4 flex items-center justify-between text-right cursor-pointer ${className}`}>
    <div className="flex flex-col">
      <span className="text-gray-400 text-xs mb-1">{title}</span>
      <p className="text-xl font-bold mb-1">{value}</p>
    </div>
    <div className="bg-gray-100 p-3 rounded-xl text-red-500">
      {icon}
    </div>
  </div>
);

const Th = ({ children, className = '' }) => (
  <th className={`p-3 font-semibold text-gray-500 text-sm ${className}`}>{children}</th>
);

const Td = ({ children, className = '' }) => (
  <td className={`p-3 text-sm text-gray-700 ${className}`}>{children}</td>
);

const AddOfferModal = ({ onClose, onOfferAdded }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState('');
  const [scope, setScope] = useState('all_products');
  const [categoryId, setCategoryId] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('userToken');
      try {
        const response = await fetch('https://products-api.cbc-apps.net/admin/dashboard/products?limit=1000', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('فشل جلب قائمة المنتجات.');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    setSelectedProductIds(prevIds => {
      if (isChecked) {
        return [...prevIds, productId];
      } else {
        return prevIds.filter(id => id !== productId);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('userToken');
  
    const payload = {
      title: name,
      description: "عرض تم إنشاؤه من قبل الأدمن",
      discountPercentage: parseFloat(value),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      isActive: true,
    };
  
    if (scope === 'specific_products') {
      payload.productIds = selectedProductIds;
    }
  
    try {
      const response = await fetch('https://products-api.cbc-apps.net/admin/dashboard/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('فشل إضافة العرض.');
      }
      onOfferAdded();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-4">
          <h2 className="text-lg font-bold">إضافة عرض جديد</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <RiCloseFill size={24} />
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">اسم العرض</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">نوع العرض</label>
            <select value={type} onChange={(e) => setType(e.target.value)} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="percentage">نسبة مئوية</option>
              <option value="fixed_amount">مبلغ ثابت</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">قيمة الخصم</label>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">نطاق العرض</label>
            <select value={scope} onChange={(e) => setScope(e.target.value)} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="all_products">جميع المنتجات</option>
              <option value="category">فئة محددة</option>
              <option value="specific_products">منتجات محددة</option>
            </select>
          </div>
          {scope === 'category' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">معرف الفئة (ID)</label>
              <input type="number" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          )}
          {scope === 'specific_products' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">اختر المنتجات (يمكن اختيار أكثر من منتج)</label>
              <div className="w-full px-3 py-2 border rounded-lg h-32 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-red-500">
                {products.map(product => (
                  <div key={product.productId} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`product-${product.productId}`}
                      name="selectedProducts"
                      value={product.productId}
                      checked={selectedProductIds.includes(product.productId)}
                      onChange={handleProductChange}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor={`product-${product.productId}`} className="ml-2 text-gray-700">
                      {product.productName} (ID: {product.productId})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">تاريخ البدء</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">تاريخ الانتهاء</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div className="flex justify-end space-x-2 rtl:space-x-reverse sticky bottom-0 bg-white pt-4">
            <button type="button" onClick={onClose}
              className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
              إلغاء
            </button>
            <button type="submit" disabled={loading}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">
              {loading ? 'جاري الإضافة...' : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditOfferModal = ({ onClose, offer, onOfferUpdated }) => {
  const [name, setName] = useState(offer.offerName);
  const [type, setType] = useState(offer.offerType);
  const [value, setValue] = useState(offer.value);
  const [scope, setScope] = useState(offer.scope);
  const [categoryId, setCategoryId] = useState(offer.categoryId || '');
  const [selectedProductIds, setSelectedProductIds] = useState(offer.productIds || []);
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState(offer.startDate.split('T')[0]);
  const [endDate, setEndDate] = useState(offer.endDate.split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('userToken');
      try {
        const response = await fetch('https://products-api.cbc-apps.net/admin/dashboard/products?limit=1000', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('فشل جلب قائمة المنتجات.');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    const isChecked = e.target.checked;
    setSelectedProductIds(prevIds => {
      if (isChecked) {
        return [...prevIds, productId];
      } else {
        return prevIds.filter(id => id !== productId);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('userToken');

    const payload = {
      title: name,
      description: offer.description,
      discountPercentage: parseFloat(value),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      isActive: offer.isActive,
      categoryId: categoryId || undefined,
      productIds: scope === 'specific_products' ? selectedProductIds : undefined,
    };

    try {
      const response = await fetch(`https://products-api.cbc-apps.net/admin/dashboard/offers/${offer.offerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('فشل تحديث العرض.');
      }
      onOfferUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-4">
          <h2 className="text-lg font-bold">تعديل عرض</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <RiCloseFill size={24} />
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">اسم العرض</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">نوع العرض</label>
            <select value={type} onChange={(e) => setType(e.target.value)} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="percentage">نسبة مئوية</option>
              <option value="fixed_amount">مبلغ ثابت</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">قيمة الخصم</label>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">نطاق العرض</label>
            <select value={scope} onChange={(e) => setScope(e.target.value)} required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="all_products">جميع المنتجات</option>
              <option value="category">فئة محددة</option>
              <option value="specific_products">منتجات محددة</option>
            </select>
          </div>
          {scope === 'category' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">معرف الفئة (ID)</label>
              <input type="number" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          )}
          {scope === 'specific_products' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">اختر المنتجات (يمكن اختيار أكثر من منتج)</label>
              <div className="w-full px-3 py-2 border rounded-lg h-32 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-red-500">
                {products.map(product => (
                  <div key={product.productId} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`product-${product.productId}`}
                      name="selectedProducts"
                      value={product.productId}
                      checked={selectedProductIds.includes(product.productId)}
                      onChange={handleProductChange}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor={`product-${product.productId}`} className="ml-2 text-gray-700">
                      {product.productName} (ID: {product.productId})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">تاريخ البدء</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">تاريخ الانتهاء</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div className="flex justify-end space-x-2 rtl:space-x-reverse sticky bottom-0 bg-white pt-4">
            <button type="button" onClick={onClose}
              className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
              إلغاء
            </button>
            <button type="submit" disabled={loading}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">
              {loading ? 'جاري التعديل...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteOfferModal = ({ onClose, offerId, onOfferDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch(`https://products-api.cbc-apps.net/admin/dashboard/offers/${offerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('فشل حذف العرض.');
      }
      onOfferDeleted();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">حذف العرض</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><RiCloseFill size={24} /></button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <p className="mb-6">هل أنت متأكد أنك تريد حذف هذا العرض؟</p>
        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <button type="button" onClick={onClose}
            className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
            إلغاء
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">
            {loading ? 'جاري الحذف...' : 'حذف'}
          </button>
        </div>
      </div>
    </div>
  );
};

const OfferDetailsModal = ({ onClose, offer }) => (
  <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" dir="rtl">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">تفاصيل العرض</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><RiCloseFill size={24} /></button>
      </div>
      <div className="space-y-4 text-sm text-gray-700">
        <p><strong>اسم العرض:</strong> {offer.offerName}</p>
        <p><strong>نوع العرض:</strong> {offer.offerType}</p>
        <p><strong>قيمة الخصم:</strong> {offer.value}</p>
        <p><strong>نطاق العرض:</strong> {offer.scope}</p>
        <p><strong>مدة العرض:</strong> {offer.duration}</p>
        <p><strong>الحالة:</strong> {offer.status}</p>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">إغلاق</button>
      </div>
    </div>
  </div>
);

const OffersDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch(`https://products-api.cbc-apps.net/admin/dashboard/offers?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('فشل جلب بيانات العروض.');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleDropdownToggle = (offerId) => {
    setShowDropdown(showDropdown === offerId ? null : offerId);
  };

  const handleToggleStatus = async (offerId, currentStatus) => {
    const token = localStorage.getItem('userToken');
    try {
      await fetch(`https://products-api.cbc-apps.net/admin/dashboard/offers/${offerId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: currentStatus === 'غير نشط' })
      });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = (modalName, offer = null) => {
    setSelectedOffer(offer);
    setShowModal(modalName);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div dir="rtl" className="p-6 text-center text-gray-500">جاري تحميل البيانات...</div>;
  }

  if (error) {
    return <div dir="rtl" className="p-6 text-center text-red-500">حدث خطأ: {error}</div>;
  }

  const { cards, offers, pagination } = data;
  const statCards = [
    { title: 'العروض النشطة', value: cards.activeOffers, icon: <BsDisplay /> },
    { title: 'المنتجات المخفضة', value: cards.discountedProducts, icon: <FaRegClock /> },
    { title: 'العروض التي قاربت على الانتهاء', value: cards.expiringSoon, icon: <FaRegCalendarDays /> },
    { title: 'العروض ضعيفة التأثير', value: cards.lowImpactOffers, icon: <AiOutlineBarChart /> },
  ];

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">إدارة العروض</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">كل العروض</h3>
          <button
            onClick={() => openModal('add')}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition flex items-center"
          >
            <FaPlus className="ml-2" />
            أضف عرض جديد
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-right">
              <tr>
                <Th>اسم العرض</Th>
                <Th>نوع العرض</Th>
                <Th>قيمة الخصم</Th>
                <Th>نطاق العرض</Th>
                <Th>الحالة</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {offers.map((offer) => (
                <tr key={offer.offerId}>
                  <Td className="flex items-center">
                    <span className="font-bold">{offer.offerName}</span>
                  </Td>
                  <Td>{offer.offerType}</Td>
                  <Td>{offer.value}</Td>
                  <Td>{offer.scope}</Td>
                  <Td>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.status === 'نشط' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {offer.status}
                    </span>
                  </Td>
                  <Td>
                    <div className="relative">
                      <button onClick={() => handleDropdownToggle(offer.offerId)}>
                        <BsThreeDots className="text-gray-500 hover:text-gray-700" />
                      </button>
                      {showDropdown === offer.offerId && (
                        <div className="absolute top-8 left-0 z-10 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 text-right">
                          <div className="py-1">
                            <button
                              onClick={() => openModal('viewDetails', offer)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaInfoCircle className="ml-2 text-blue-500" />
                              عرض التفاصيل
                            </button>
                            <button
                              onClick={() => openModal('edit', offer)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaPen className="ml-2 text-yellow-500" />
                              تعديل
                            </button>
                            <button
                              onClick={() => handleToggleStatus(offer.offerId, offer.status)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {offer.status === 'نشط' ? <><FaToggleOff className="ml-2 text-red-500" /> إيقاف</> : <><FaToggleOn className="ml-2 text-green-500" /> تفعيل</>}
                            </button>
                            <button
                              onClick={() => openModal('delete', offer)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                            >
                              <FaRegTrashAlt className="ml-2" />
                              حذف
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

        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-gray-700">إجمالي العروض: {pagination.total}</span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-gray-500">أعرض في الصفحة {pagination.limit}</span>
            <div className="flex space-x-1 rtl:space-x-reverse">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md text-sm ${page === currentPage ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal === 'add' && <AddOfferModal onClose={() => setShowModal(null)} onOfferAdded={fetchData} />}
      {showModal === 'edit' && <EditOfferModal onClose={() => setShowModal(null)} offer={selectedOffer} onOfferUpdated={fetchData} />}
      {showModal === 'delete' && <DeleteOfferModal onClose={() => setShowModal(null)} offerId={selectedOffer.offerId} onOfferDeleted={fetchData} />}
      {showModal === 'viewDetails' && <OfferDetailsModal onClose={() => setShowModal(null)} offer={selectedOffer} />}
    </div>
  );
};

export default OffersDashboard;