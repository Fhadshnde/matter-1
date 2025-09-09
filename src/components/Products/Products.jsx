import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaStore, FaChartBar, FaUser, FaBox, FaTruck } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { BsEye } from 'react-icons/bs';
import { IoChevronUpOutline, IoChevronDownOutline, IoSearchOutline, IoAdd, IoEllipsisHorizontal, IoEyeOutline, IoPencilOutline, IoTrashOutline } from 'react-icons/io5';
import axios from 'axios';

const StatCard = ({ title, value, icon, onClick }) => {
  const icons = {
    'totalProducts': <div className="bg-gray-100 p-3 rounded-xl"><FaBox className="text-red-500 text-2xl" /></div>,
    'lowInventory': <div className="bg-gray-100 p-3 rounded-xl"><FaChartBar className="text-red-500 text-2xl" /></div>,
    'outOfStock': <div className="bg-gray-100 p-3 rounded-xl"><RiCloseFill className="text-red-500 text-2xl" /></div>,
    'abandoned': <div className="bg-gray-100 p-3 rounded-xl"><FaBox className="text-red-500 text-2xl" /></div>,
  };

  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between text-right cursor-pointer hover:shadow-lg transition-shadow">
      <div className="flex flex-col">
        <span className="text-gray-400 text-xs mb-1">{title}</span>
        <p className="text-xl font-bold mb-1 text-gray-800">{value}</p>
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

const Dashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cardsData, setCardsData] = useState({});
    const [pagination, setPagination] = useState({});
    const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
    const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false);
    const [isMoreActionsDropdownOpen, setIsMoreActionsDropdownOpen] = useState(null);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [stockToUpdate, setStockToUpdate] = useState('');
    const [priceToUpdate, setPriceToUpdate] = useState('');
    const [wholesalePriceToUpdate, setWholesalePriceToUpdate] = useState('');

    const baseUrl = 'https://products-api.cbc-apps.net';
    const token = localStorage.getItem('userToken');

    const fetchProducts = async (page = 1, limit = 10) => {
        try {
            const response = await fetch(`${baseUrl}/admin/dashboard/products?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data.products);
            setCardsData(data.cards);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchProductDetails = async (productId) => {
        try {
            const response = await fetch(`${baseUrl}/admin/dashboard/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            const data = await response.json();
            setSelectedProduct(data);
            setIsProductDetailsModalOpen(true);
            setIsMoreActionsDropdownOpen(false);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'متوفر':
                return 'bg-green-100 text-green-700';
            case 'غير متوفر':
                return 'bg-red-100 text-red-700';
            case 'مخزون منخفض':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleOpenProductDetails = (product) => {
        fetchProductDetails(product.productId);
    };

    const handleOpenEditProduct = (product) => {
        console.log(`Navigating to /edit-product/${product.productId}`);
        navigate(`/edit-product/${product.productId}`);
    };

    const handleOpenEditStock = (product) => {
        setSelectedProduct(product);
        setStockToUpdate(product.quantity);
        setIsEditStockModalOpen(true);
        setIsMoreActionsDropdownOpen(false);
    };

    const handleOpenEditPrice = (product) => {
        setSelectedProduct(product);
        setPriceToUpdate(product.sellingPrice);
        setWholesalePriceToUpdate(product.wholesalePrice);
        setIsEditPriceModalOpen(true);
        setIsMoreActionsDropdownOpen(false);
    };

    const handleOpenDeleteModal = (product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
        setIsMoreActionsDropdownOpen(false);
    };

    const handleUpdateStock = async () => {
        try {
            const response = await fetch(`${baseUrl}/admin/dashboard/products/${selectedProduct.productId}/stock`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ stock: parseInt(stockToUpdate), reason: "تحديث المخزون" })
            });
            if (!response.ok) {
                throw new Error('Failed to update stock');
            }
            setIsEditStockModalOpen(false);
            fetchProducts(currentPage, itemsPerPage);
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const handleUpdatePrice = async () => {
        try {
            const response = await fetch(`${baseUrl}/admin/dashboard/products/${selectedProduct.productId}/price`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ price: parseInt(priceToUpdate), reason: "تحديث السعر" })
            });
            if (!response.ok) {
                throw new Error('Failed to update price');
            }
            setIsEditPriceModalOpen(false);
            fetchProducts(currentPage, itemsPerPage);
        } catch (error) {
            console.error('Error updating price:', error);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const response = await fetch(`${baseUrl}/admin/dashboard/products/${selectedProduct.productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            setIsDeleteModalOpen(false);
            fetchProducts(currentPage, itemsPerPage);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const Modal = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    {children}
                </div>
            </div>
        );
    };

    const productDetailsModal = () => {
        if (!isProductDetailsModalOpen || !selectedProduct) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">تفاصيل المنتج</h2>
                            <button
                                onClick={() => setIsProductDetailsModalOpen(false)}
                                className="text-gray-400 text-2xl font-bold hover:text-gray-600"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="space-y-4 text-gray-700">
                            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                <span className="w-1/3 text-gray-500 text-right pr-4">الاسم</span>
                                <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.productName}</span>
                            </div>
                            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                <span className="w-1/3 text-gray-500 text-right pr-4">صورة المنتج</span>
                                <span className="w-2/3 text-left pl-4">
                                    <img src={selectedProduct.imageUrl} alt="product" className="w-16 h-16 rounded-lg object-cover" />
                                </span>
                            </div>
                            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                <span className="w-1/3 text-gray-500 text-right pr-4">سعر البيع</span>
                                <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.sellingPrice} د.ع</span>
                            </div>
                            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                <span className="w-1/3 text-gray-500 text-right pr-4">سعر الجملة</span>
                                <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.wholesalePrice} د.ع</span>
                            </div>
                            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                <span className="w-1/3 text-gray-500 text-right pr-4">الحالة</span>
                                <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.status}</span>
                            </div>
                            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                <span className="w-1/3 text-gray-500 text-right pr-4">المخزون</span>
                                <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.stock}</span>
                            </div>
                            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                <span className="w-1/3 text-gray-500 text-right pr-4">القسم</span>
                                <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.categoryName || selectedProduct.mainCategory}</span>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <span className="block text-gray-500 text-right pr-4 mb-1">وصف المنتج</span>
                                <span className="block text-right pr-4 text-gray-900">{selectedProduct.description || 'لا يوجد وصف.'}</span>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsProductDetailsModalOpen(false);
                                    handleOpenEditProduct(selectedProduct);
                                }}
                                className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                            >
                                تعديل
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8 text-right font-['Tajawal']">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="إجمالي المنتجات"
                    value={cardsData.totalProducts || '...'}
                    icon="totalProducts"
                    onClick={() => console.log('Total Products clicked')}
                />
                <StatCard
                    title="منتجات منخفضة المخزون"
                    value={cardsData.lowInventoryProducts || '...'}
                    icon="lowInventory"
                    onClick={() => console.log('Low Inventory Products clicked')}
                />
                <StatCard
                    title="منتجات غير متوفرة"
                    value={cardsData.outOfStockProducts || '...'}
                    icon="outOfStock"
                    onClick={() => console.log('Out of Stock Products clicked')}
                />
                <StatCard
                    title="منتجات مهجورة"
                    value={cardsData.abandonedProducts || '...'}
                    icon="abandoned"
                    onClick={() => console.log('Abandoned Products clicked')}
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center"
                            onClick={() => navigate('/add-product')}
                        >
                            <IoAdd className="w-5 h-5 ml-2" />
                            إضافة منتج
                        </button>
                        <div className="relative">
                            <button
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            >
                                <span className="text-sm">الكل</span>
                                <IoChevronDownOutline className="w-4 h-4 mr-2 text-gray-500" />
                            </button>
                            {isFilterDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">متوفر</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">غير متوفر</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">كمية منخفضة</a>
                                </div>
                            )}
                        </div>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="ابحث باسم المنتج / الحالة"
                                className="bg-gray-100 text-gray-700 px-4 py-2 pr-10 rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                            />
                            <IoSearchOutline className="absolute right-3 text-gray-400" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">إدارة المنتجات</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-right bg-white">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">صورة المنتج</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">اسم المنتج</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">سعر الجملة</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">سعر البيع</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">الكمية</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">الحالة</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">القسم</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.productId} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4">
                                        <img src={product.imageUrl || 'https://placehold.co/40x40/e0e0e0/ffffff?text=P'} alt="product" className="w-10 h-10 rounded-md object-cover" />
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{product.productName}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{product.wholesalePrice} د.ع</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{product.sellingPrice} د.ع</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{product.quantity || product.stock}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClass(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{product.categoryName}</td>
                                    <td className="py-3 px-4 relative">
                                        <button
                                            className="text-gray-500 hover:text-gray-900"
                                            onClick={() => setIsMoreActionsDropdownOpen(isMoreActionsDropdownOpen === product.productId ? null : product.productId)}
                                        >
                                            <IoEllipsisHorizontal className="w-5 h-5" />
                                        </button>
                                        {isMoreActionsDropdownOpen === product.productId && (
                                            <div className="absolute right-5 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 text-sm text-gray-700">
                                                <button className="flex items-center w-full text-right px-4 py-2 hover:bg-gray-100" onClick={() => handleOpenProductDetails(product)}>
                                                    <IoEyeOutline className="w-5 h-5 ml-2 text-gray-500" />
                                                    عرض التفاصيل
                                                </button>
                                                <button className="flex items-center w-full text-right px-4 py-2 hover:bg-gray-100" onClick={() => handleOpenEditProduct(product)}>
                                                    <IoPencilOutline className="w-5 h-5 ml-2 text-gray-500" />
                                                    تعديل المنتج
                                                </button>
                                                <button className="flex items-center w-full text-right px-4 py-2 hover:bg-gray-100" onClick={() => handleOpenEditStock(product)}>
                                                    <IoPencilOutline className="w-5 h-5 ml-2 text-gray-500" />
                                                    تعديل المخزون
                                                </button>
                                                <button className="flex items-center w-full text-right px-4 py-2 hover:bg-gray-100" onClick={() => handleOpenEditPrice(product)}>
                                                    <IoPencilOutline className="w-5 h-5 ml-2 text-gray-500" />
                                                    تعديل السعر
                                                </button>
                                                <button className="flex items-center w-full text-right px-4 py-2 text-red-600 hover:bg-red-50" onClick={() => handleOpenDeleteModal(product)}>
                                                    <IoTrashOutline className="w-5 h-5 ml-2 text-red-600" />
                                                    حذف المنتج
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
                    <p>إجمالي المنتجات: {pagination.total || '...'}</p>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                            className={`bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <IoChevronDownOutline className="w-4 h-4 rotate-90" />
                        </button>
                        {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).slice(
                            Math.max(0, currentPage - 3),
                            Math.min(pagination.totalPages, currentPage + 2)
                        ).map(page => (
                            <button
                                key={page}
                                className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className={`bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors ${currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                        >
                            <IoChevronUpOutline className="w-4 h-4 rotate-90" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm">عرض في الصفحة</span>
                        <select
                            className="bg-gray-100 text-gray-900 rounded-md px-2 py-1 border border-gray-300"
                            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                            value={itemsPerPage}
                        >
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                    </div>
                </div>
            </div>

            <Modal isOpen={isEditStockModalOpen} onClose={() => setIsEditStockModalOpen(false)}>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">تعديل المخزون</h2>
                    <div className="mb-4">
                        <input
                            type="number"
                            placeholder="الكمية في المخزون"
                            className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                            value={stockToUpdate}
                            onChange={(e) => setStockToUpdate(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                        <button
                            onClick={() => setIsEditStockModalOpen(false)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleUpdateStock}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            تعديل
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isEditPriceModalOpen} onClose={() => setIsEditPriceModalOpen(false)}>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">تعديل السعر</h2>
                    <div className="space-y-4">
                        <input
                            type="number"
                            placeholder="سعر البيع"
                            className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                            value={priceToUpdate}
                            onChange={(e) => setPriceToUpdate(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="سعر الجملة"
                            className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                            value={wholesalePriceToUpdate}
                            onChange={(e) => setWholesalePriceToUpdate(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center mt-6 space-x-4 rtl:space-x-reverse">
                        <button
                            onClick={() => setIsEditPriceModalOpen(false)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleUpdatePrice}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            تعديل
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
                        <IoTrashOutline className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold mt-2 text-gray-800">هل أنت متأكد أنك تريد حذف المنتج؟</h3>
                    <p className="text-sm text-gray-500 mt-2">سوف يتم حذف هذا المنتج نهائيًا من قائمة المنتجات لديك</p>
                    <p className="text-sm text-gray-500 mt-1">هل أنت متأكد أنك تريد الحذف؟</p>
                    <div className="flex justify-center space-x-4 rtl:space-x-reverse mt-6 w-full">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleDeleteProduct}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            حذف المنتج
                        </button>
                    </div>
                </div>
            </Modal>

            {productDetailsModal()}
        </div>
    );
};

export default Dashboard;