import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaStore, FaChartBar, FaUser, FaBox, FaTruck, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { BsEye } from 'react-icons/bs';
import { IoChevronUpOutline, IoChevronDownOutline, IoSearchOutline, IoAdd, IoEllipsisHorizontal, IoEyeOutline, IoPencilOutline, IoTrashOutline, IoCloseOutline } from 'react-icons/io5';
import axios from 'axios';
import API_CONFIG, { apiCall } from '../../config/api';

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

const EditStockModal = ({ isOpen, onClose, product, fetchProducts }) => {
    const [stockToUpdate, setStockToUpdate] = useState('');
  
    useEffect(() => {
      if (product) {
        setStockToUpdate(product.stock || '');
      }
    }, [product]);
  
    const handleUpdateStock = async () => {
      try {
        await apiCall(API_CONFIG.ADMIN.PRODUCT_STOCK(product.id), {
          method: 'PUT',
          body: JSON.stringify({ stock: parseInt(stockToUpdate), reason: "تحديث المخزون" })
        });
        onClose();
        fetchProducts();
        alert('تم تحديث المخزون بنجاح');
      } catch (error) {
        console.error('Error updating stock:', error);
        alert('حدث خطأ في تحديث المخزون: ' + (error.message || 'خطأ غير معروف'));
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
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
              onClick={onClose}
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
    );
};

const EditPriceModal = ({ isOpen, onClose, product, fetchProducts }) => {
    const [priceToUpdate, setPriceToUpdate] = useState('');
    const [wholesalePriceToUpdate, setWholesalePriceToUpdate] = useState('');
  
    useEffect(() => {
      if (product) {
        setPriceToUpdate(product.price || '');
        setWholesalePriceToUpdate(product.wholesalePrice || '');
      }
    }, [product]);
  
    const handleUpdatePrice = async () => {
      try {
        await apiCall(API_CONFIG.ADMIN.PRODUCT_PRICE(product.id), {
          method: 'PUT',
          body: JSON.stringify({ price: parseInt(priceToUpdate), wholesalePrice: parseInt(wholesalePriceToUpdate) })
        });
        onClose();
        fetchProducts();
        alert('تم تحديث السعر بنجاح');
      } catch (error) {
        console.error('Error updating price:', error);
        alert('حدث خطأ في تحديث السعر: ' + (error.message || 'خطأ غير معروف'));
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
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
              onClick={onClose}
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
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [pagination, setPagination] = useState({});
    const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
    const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false);
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
    const [isMoreActionsDropdownOpen, setIsMoreActionsDropdownOpen] = useState(null);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [categories, setCategories] = useState([]);
    const [sections, setSections] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchProducts = async (page = 1, limit = 10, search = '', status = 'all') => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });
            if (search) {
                params.append('search', search);
            }
            if (status !== 'all') {
                params.append('status', status);
            }
            
            const data = await apiCall(API_CONFIG.ADMIN.PRODUCTS + `?${params.toString()}`);
            console.log('Raw backend data:', data);
            
            // Map backend data to frontend format
            const mappedProducts = (data.products || []).map(product => {
                console.log('Individual product:', product);
                return {
                    id: product.id,
                    name: product.name,
                    price: product.originalPrice || product.price,
                    stock: product.stock || 0,
                    mainImageUrl: product.mainImageUrl,
                    categoryName: product.category,
                    status: product.stock === 0 ? 'غير متوفر' : product.stock < 10 ? 'مخزون منخفض' : 'متوفر',
                    updatedAt: product.updatedAt
                };
            });
            
            setProducts(mappedProducts);
            setStats(data.cards || {});
            setPagination(data.pagination || {});
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await apiCall(API_CONFIG.ADMIN.CATEGORIES);
            const transformedCategories = data.categories.map((category, index) => ({
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                key: category.categoryId || index
            }));
            setCategories(transformedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    const fetchSections = async () => {
        try {
            const data = await apiCall(API_CONFIG.ADMIN.SECTIONS);
            const transformedSections = data.sections.map((section, index) => ({
                sectionId: section.sectionId,
                sectionName: section.sectionName,
                categoryId: section.categoryId,
                key: section.sectionId || index
            }));
            setSections(transformedSections);
        } catch (error) {
            console.error('Error fetching sections:', error);
            setSections([]);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const data = await apiCall(API_CONFIG.ADMIN.SUPPLIERS);
            const transformedSuppliers = (data.suppliers || []).map((supplier, index) => ({
                supplierId: supplier.id,
                supplierName: supplier.name || 'مورد بدون اسم',
                contactInfo: supplier.contactInfo,
                phone: supplier.phone,
                key: supplier.id || index
            }));
            setSuppliers(transformedSuppliers);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            setSuppliers([]);
        }
    };

    const fetchProductDetails = async (productId) => {
        try {
            console.log('Fetching product details for ID:', productId);
            console.log('API endpoint:', API_CONFIG.ADMIN.PRODUCT_DETAILS(productId));
            const data = await apiCall(API_CONFIG.ADMIN.PRODUCT_DETAILS(productId));
            setSelectedProduct(data);
            setIsProductDetailsModalOpen(true);
        } catch (error) {
            console.error('Error fetching product details:', error);
            alert('حدث خطأ أثناء جلب تفاصيل المنتج');
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const result = await apiCall(API_CONFIG.ADMIN.PRODUCT_DELETE(selectedProduct.id), {
                method: 'DELETE'
            });
            if (result.success) {
                alert('تم حذف المنتج بنجاح');
                fetchProducts(currentPage, itemsPerPage, searchTerm, filterStatus);
                setIsDeleteModalOpen(false);
                setSelectedProduct(null);
            } else {
                alert(result.message || 'حدث خطأ أثناء حذف المنتج');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('حدث خطأ أثناء حذف المنتج');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        fetchProducts(1, itemsPerPage, e.target.value, filterStatus);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchProducts(page, itemsPerPage, searchTerm, filterStatus);
    };

    const handleItemsPerPageChange = (itemsPerPage) => {
        setItemsPerPage(itemsPerPage);
        setCurrentPage(1);
        fetchProducts(1, itemsPerPage, searchTerm, filterStatus);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        fetchProducts(1, itemsPerPage, searchTerm, status);
        setCurrentPage(1);
    };

    const handleAddProduct = () => {
        navigate('/add-product');
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsEditProductModalOpen(true);
        setIsMoreActionsDropdownOpen(false);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'low_stock':
                return 'bg-yellow-100 text-yellow-800';
            case 'out_of_stock':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'نشط';
            case 'inactive':
                return 'غير نشط';
            case 'low_stock':
                return 'مخزون منخفض';
            case 'out_of_stock':
                return 'نفد المخزون';
            default:
                return status;
        }
    };

    useEffect(() => {
        fetchProducts(currentPage, itemsPerPage, searchTerm, filterStatus);
        fetchCategories();
        fetchSections();
        fetchSuppliers();
    }, [currentPage, itemsPerPage]);

    // Initial load
    useEffect(() => {
        fetchProducts(1, 10, '', 'all');
        fetchCategories();
        fetchSections();
        fetchSuppliers();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMoreActionsDropdownOpen && !event.target.closest('.relative')) {
                setIsMoreActionsDropdownOpen(null);
            }
            if (isFilterDropdownOpen && !event.target.closest('.relative')) {
                setIsFilterDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMoreActionsDropdownOpen, isFilterDropdownOpen]);

    const productDetailsModal = () => {
        if (!selectedProduct) return null;
        
        return (
            <Modal isOpen={isProductDetailsModalOpen} onClose={() => setIsProductDetailsModalOpen(false)}>
                <div className="w-full max-w-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">تفاصيل المنتج</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">اسم المنتج</label>
                                <p className="text-gray-900">{selectedProduct.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">سعر البيع</label>
                                <p className="text-gray-900">{selectedProduct.sellingPrice} د.ع</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">سعر الجملة</label>
                                <p className="text-gray-900">{selectedProduct.wholesalePrice} د.ع</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">الكمية في المخزن</label>
                                <p className="text-gray-900">{selectedProduct.stock}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                                <p className="text-gray-900">{selectedProduct.mainCategory}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">القسم</label>
                                <p className="text-gray-900">{selectedProduct.subCategory}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">المورد</label>
                                <p className="text-gray-900">{selectedProduct.merchantName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(selectedProduct.status)}`}>
                                    {getStatusText(selectedProduct.status)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">وصف المنتج</label>
                            <p className="text-gray-900">{selectedProduct.description || 'لا يوجد وصف'}</p>
                        </div>
                        {selectedProduct.mainImageUrl && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">الصورة الرئيسية</label>
                                <img
                                    src={selectedProduct.mainImageUrl}
                                    alt={selectedProduct.name}
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => setIsProductDetailsModalOpen(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </Modal>
        );
    };

    if (isLoading) {
        return <div className="text-center py-8">جاري تحميل المنتجات...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">إدارة المنتجات</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="إجمالي المنتجات"
                    value={stats.totalProducts || 0}
                    icon="totalProducts"
                />
                <StatCard
                    title="مخزون منخفض"
                    value={stats.lowInventoryProducts || 0}
                    icon="lowInventory"
                />
                <StatCard
                    title="نفد المخزون"
                    value={stats.outOfStockProducts || 0}
                    icon="outOfStock"
                />
                <StatCard
                    title="منتجات مهجورة"
                    value={stats.abandonedProducts || 0}
                    icon="abandoned"
                />
            </div>

            {/* Search and Filter */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="البحث عن منتج..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 pr-10"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <IoSearchOutline className="absolute right-3 text-gray-400" />
                    </div>
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="all">جميع المنتجات</option>
                            <option value="available">متوفر</option>
                            <option value="low_stock">مخزون منخفض</option>
                            <option value="out_of_stock">نفد المخزون</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <button
                        onClick={handleAddProduct}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600 transition-colors"
                    >
                        <FaPlus className="w-4 h-4 ml-2" />
                        إضافة منتج
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                المنتج
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                السعر
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                المخزون
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الحالة
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الإجراءات
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    لا توجد منتجات لعرضها.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {product.mainImageUrl && (
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={product.mainImageUrl} alt={product.name} />
                                                </div>
                                            )}
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">ID: {product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.price} د.ع
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(product.status)}`}>
                                            {getStatusText(product.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <button
                                                onClick={() => fetchProductDetails(product.id)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                title="عرض التفاصيل"
                                            >
                                                <IoEyeOutline className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    console.log('Edit product ID:', product.id);
                                                    console.log('Product object:', product);
                                                    navigate(`/edit-product/${product.id}`);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                                title="تعديل"
                                            >
                                                <IoPencilOutline className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                title="حذف"
                                            >
                                                <IoTrashOutline className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm text-gray-700">عدد العناصر في الصفحة:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            السابق
                        </button>
                        <span className="px-3 py-1 text-sm text-gray-700">
                            صفحة {currentPage} من {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            التالي
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <EditStockModal
                isOpen={isEditStockModalOpen}
                onClose={() => setIsEditStockModalOpen(false)}
                product={selectedProduct}
                fetchProducts={() => fetchProducts(currentPage, itemsPerPage, searchTerm, filterStatus)}
            />

            <EditPriceModal
                isOpen={isEditPriceModalOpen}
                onClose={() => setIsEditPriceModalOpen(false)}
                product={selectedProduct}
                fetchProducts={() => fetchProducts(currentPage, itemsPerPage, searchTerm, filterStatus)}
            />

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">تأكيد الحذف</h2>
                    <p className="text-gray-600 mb-6">
                        هل أنت متأكد أنك تريد حذف المنتج "{selectedProduct?.name}"؟
                        لا يمكن التراجع عن هذا الإجراء.
                    </p>
                    <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleDeleteProduct}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            حذف
                        </button>
                    </div>
                </div>
            </Modal>

            {productDetailsModal()}

            {/* Edit Product Modal */}
            <Modal isOpen={isEditProductModalOpen} onClose={() => setIsEditProductModalOpen(false)}>
                <div className="w-full max-w-2xl">
                    <div className="bg-white rounded-lg shadow-xl">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">تعديل المنتج</h3>
                        </div>
                        <div className="px-6 py-4">
                            <p className="text-gray-600 mb-4">
                                تم فتح صفحة التعديل في تبويب جديد. يمكنك إغلاق هذا النافذة.
                            </p>
                            <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                                <button
                                    onClick={() => setIsEditProductModalOpen(false)}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    إغلاق
                                </button>
                                <button
                                    onClick={() => {
                                        if (selectedProduct) {
                                            window.open(`/edit-product/${selectedProduct.id}`, '_blank');
                                        }
                                        setIsEditProductModalOpen(false);
                                    }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                                >
                                    فتح صفحة التعديل
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
