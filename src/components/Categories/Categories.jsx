import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { MdOutlineCategory } from 'react-icons/md';
import { HiOutlineCube } from 'react-icons/hi';
import { TbCategory2 } from 'react-icons/tb';
import { API_CONFIG, apiCall } from '../../config/api';
import StatCard from '../Shared/StatCard';
import Modal from '../Shared/Modal';
import Pagination from '../Shared/Pagination';
import axios from 'axios';

const Categories = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [statsCards, setStatsCards] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // حالة جديدة لتخزين بيانات الموردين
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // تحديث حالة النموذج لإضافة حقلي minimumOrderAmount و supplierId
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    displayOrder: 0,
    minimumOrderAmount: '',
    supplierId: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isTogglingStatus, setIsTogglingStatus] = useState(null); 
  const [tempDisplayOrders, setTempDisplayOrders] = useState({});

  useEffect(() => {
    fetchCategoriesData();
    fetchSuppliers(); // جلب بيانات الموردين
  }, [currentPage]);

  const fetchCategoriesData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });
      
      const url = `${API_CONFIG.ADMIN.CATEGORIES}?${params.toString()}`;
      const data = await apiCall(url);
      
      setCategoriesData(data.categories || []);
      setStatsCards([
        {
          title: 'إجمالي الفئات',
          value: data.cards?.totalCategories?.toString() || '0',
          icon: 'category'
        },
        {
          title: 'فئات تحتوي على منتجات',
          value: data.cards?.categoriesWithProducts?.toString() || '0',
          icon: 'active-category'
        },
        {
          title: 'إجمالي المنتجات',
          value: data.cards?.totalProducts?.toString() || '0',
          icon: 'products'
        },
        {
          title: 'متوسط المنتجات لكل فئة',
          value: data.cards?.averageProductsPerCategory?.toString() || '0',
          icon: 'average'
        }
      ]);
      setTotalPages(data.pagination?.totalPages || 1);
      const initialDisplayOrders = {};
      (data.categories || []).forEach(cat => {
        initialDisplayOrders[cat.categoryId] = cat.displayOrder || 0;
      });
      setTempDisplayOrders(initialDisplayOrders);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // دالة جديدة لجلب بيانات الموردين
  const fetchSuppliers = async () => {
    try {
      // استخدام API_CONFIG.ADMIN.SUPPLIERS أو بناء URL مناسب لـ 'admin/dashboard/suppliers'
      const data = await apiCall(API_CONFIG.ADMIN.SUPPLIERS); // نفترض وجود هذا الثابت في API_CONFIG
      setSuppliers(data.suppliers || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      // في حالة عدم توفر الثابت، نستخدم المسار المباشر لضمان العمل
      try {
        const directUrl = 'https://products-api.cbc-apps.net/admin/dashboard/suppliers';
        const data = await apiCall(directUrl);
        setSuppliers(data.suppliers || []);
      } catch (e) {
        console.error('Error fetching suppliers from direct URL:', e);
      }
    }
  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredCategories = categoriesData.filter(category =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    // تحديث تهيئة النموذج عند الفتح
    setFormData({ 
      name: '', 
      description: '', 
      image: '', 
      displayOrder: 0,
      minimumOrderAmount: '',
      supplierId: '' 
    });
    setSelectedImage(null);
    setImagePreview(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    // تحديث تهيئة النموذج عند التعديل
    setFormData({
      name: category.categoryName,
      description: category.description,
      image: category.image,
      displayOrder: category.displayOrder || 0,
      minimumOrderAmount: category.minimumOrderAmount?.toString() || '',
      supplierId: category.supplierId?.toString() || ''
    });
    setImagePreview(category.image || null);
    setSelectedImage(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const openDetailsModal = (category) => {
    setSelectedCategory(category);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedCategory(null);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      // تحويل minimumOrderAmount إلى رقم صحيح
      [name]: type === 'checkbox' ? checked : (name === 'displayOrder' || name === 'minimumOrderAmount' || name === 'supplierId' ? (value === '' ? '' : parseInt(value)) : value)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      
      if (selectedImage) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedImage);
        
        const uploadResponse = await axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ADMIN_UPLOAD.UPLOAD_IMAGE}`,
          formDataUpload,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        imageUrl = uploadResponse.data.url;
      }
      
      const result = await apiCall(API_CONFIG.ADMIN.CATEGORIES, {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          image: imageUrl,
          active: true,
          displayOrder: parseInt(formData.displayOrder),
          minimumOrderAmount: parseInt(formData.minimumOrderAmount), // إرسال الحد الأدنى للطلب
          supplierId: parseInt(formData.supplierId) // إرسال معرّف المورد
        })
      });
      
      if (result.success) {
        alert(result.message || 'تم إنشاء الفئة بنجاح');
        fetchCategoriesData();
        closeAddModal();
        setFormData({ name: '', description: '', image: '', displayOrder: 0, minimumOrderAmount: '', supplierId: '' });
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        alert(result.message || 'حدث خطأ أثناء إنشاء الفئة');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('حدث خطأ أثناء إنشاء الفئة');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;
      
      if (selectedImage) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedImage);
        
        const uploadResponse = await axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ADMIN_UPLOAD.UPLOAD_IMAGE}`,
          formDataUpload,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        imageUrl = uploadResponse.data.url;
      }
      
      const updateData = {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        displayOrder: parseInt(formData.displayOrder),
        minimumOrderAmount: parseInt(formData.minimumOrderAmount), // إرسال الحد الأدنى للطلب
        supplierId: parseInt(formData.supplierId) // إرسال معرّف المورد
      };

     

      const result = await apiCall(API_CONFIG.ADMIN.CATEGORY_UPDATE(selectedCategory.categoryId), {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      if (result.success) {
        alert(result.message || 'تم تحديث الفئة بنجاح');
        fetchCategoriesData();
        closeEditModal();
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        alert(result.message || 'حدث خطأ أثناء تحديث الفئة');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('حدث خطأ أثناء تحديث الفئة');
    }
  };

  const handleToggleCategoryStatus = async (category) => {
    const newStatus = !category.active;
    const categoryId = category.categoryId;

    if (isTogglingStatus === categoryId) return;

    setIsTogglingStatus(categoryId);

    try {
      const updateData = {
        active: newStatus,
      };

      const result = await apiCall(API_CONFIG.ADMIN.CATEGORY_UPDATE(categoryId), {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      if (result.success) {
        alert(result.message || `تم ${newStatus ? 'تفعيل' : 'تعطيل'} الفئة بنجاح`);
        setCategoriesData(prevData => 
          prevData.map(c => 
            c.categoryId === categoryId ? { ...c, active: newStatus } : c
          )
        );
      } else {
        alert(result.message || `حدث خطأ أثناء ${newStatus ? 'تفعيل' : 'تعطيل'} الفئة`);
      }
    } catch (error) {
      console.error(`Error toggling category status:`, error);
      alert(`حدث خطأ أثناء ${newStatus ? 'تفعيل' : 'تعطيل'} الفئة`);
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const handleUpdateDisplayOrder = async (categoryId, newValue) => {
    const order = parseInt(newValue);
    if (isNaN(order) || order < 0) {
      alert('الرجاء إدخال رقم صحيح غير سالب للترتيب.');
      setTempDisplayOrders(prev => ({
        ...prev,
        [categoryId]: categoriesData.find(c => c.categoryId === categoryId)?.displayOrder || 0
      }));
      return;
    }
    
    setTempDisplayOrders(prev => ({ ...prev, [categoryId]: order }));

    try {
      const updateData = {
        displayOrder: order
      };

      const result = await apiCall(API_CONFIG.ADMIN.CATEGORY_UPDATE(categoryId), {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      if (result.success) {
        setCategoriesData(prevData => 
          prevData.map(c => 
            c.categoryId === categoryId ? { ...c, displayOrder: order } : c
          )
        );
        alert(result.message || 'تم تحديث ترتيب العرض بنجاح');
      } else {
        alert(result.message || 'حدث خطأ أثناء تحديث ترتيب العرض');
        setTempDisplayOrders(prev => ({
            ...prev,
            [categoryId]: categoriesData.find(c => c.categoryId === categoryId)?.displayOrder || 0
        }));
      }
    } catch (error) {
      console.error('Error updating display order:', error);
      alert('حدث خطأ أثناء تحديث ترتيب العرض');
      setTempDisplayOrders(prev => ({
          ...prev,
          [categoryId]: categoriesData.find(c => c.categoryId === categoryId)?.displayOrder || 0
      }));
    }
  };

  const handleDisplayOrderChange = (categoryId, value) => {
    setTempDisplayOrders(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await apiCall(API_CONFIG.ADMIN.CATEGORY_DELETE(selectedCategory.categoryId), {
        method: 'DELETE'
      });
      
      if (result.success) {
        alert(result.message || 'تم حذف الفئة بنجاح');
        fetchCategoriesData();
        closeDeleteModal();
      } else {
        alert(result.message || 'حدث خطأ أثناء حذف الفئة');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('حدث خطأ أثناء حذف الفئة');
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'category': return <BiCategory />;
      case 'active-category': return <MdOutlineCategory />;
      case 'products': return <HiOutlineCube />;
      case 'average': return <TbCategory2 />;
      default: return <BiCategory />;
    }
  };

  const ToggleSwitch = ({ category }) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          value="" 
          checked={category.active}
          onChange={() => handleToggleCategoryStatus(category)}
          className="sr-only peer" 
          disabled={isTogglingStatus === category.categoryId}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {isTogglingStatus === category.categoryId ? 'جارٍ التحديث...' : (category.active ? 'مفعلة' : 'معطلة')}
        </span>
      </label>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة الفئات</h1>
        <button
          onClick={openAddModal}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          إضافة فئة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between text-right shadow-sm">
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs mb-1">{card.title}</span>
              <p className="text-xl font-semibold mb-1">{card.value}</p>
            </div>
            <div className="bg-gray-100 p-2.5 rounded-full text-xl text-red-500">
              {getIcon(card.icon)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الفئات..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفئة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الترتيب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عدد الأقسام
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الوصف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عدد المنتجات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الإنشاء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.categoryId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {category.image ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover ml-3"
                          src={category.image}
                          alt={category.categoryName}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ml-3">
                          <BiCategory className="text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.categoryName}</div>
                        <div className="text-sm text-gray-500">ID: {category.categoryId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="number"
                      min="0"
                      value={tempDisplayOrders[category.categoryId] !== undefined ? tempDisplayOrders[category.categoryId] : category.displayOrder || 0}
                      onChange={(e) => handleDisplayOrderChange(category.categoryId, e.target.value)}
                      onBlur={(e) => handleUpdateDisplayOrder(category.categoryId, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.target.blur();
                        }
                      }}
                      className="w-20 text-center border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 p-1"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ToggleSwitch category={category} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.sectionsCount}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {category.description || 'لا يوجد وصف'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.productsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDetailsModal(category)}
                        className="text-blue-600 hover:text-blue-900"
                        title="عرض التفاصيل"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openEditModal(category)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="تعديل"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(category)}
                        className="text-red-600 hover:text-red-900"
                        title="حذف"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد فئات
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <Modal 
        isOpen={isAddModalOpen} 
        title="إضافة فئة جديدة" 
        onClose={closeAddModal}
      >
        <form onSubmit={handleAddCategory}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الفئة *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="أدخل اسم الفئة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="أدخل وصف الفئة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة الفئة
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="معاينة الصورة"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ترتيب العرض
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="أدخل رقم الترتيب"
              />
            </div>

            {/* حقل الحد الأدنى للطلب - جديد */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأدنى للطلب (بالدينار العراقي) *
              </label>
              <input
                type="number"
                name="minimumOrderAmount"
                value={formData.minimumOrderAmount}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="أدخل الحد الأدنى لقيمة الطلب"
              />
            </div>
            
            {/* حقل اختيار المورد - جديد */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المورد *
              </label>
              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">اختر المورد</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name} (ID: {supplier.id})
                  </option>
                ))}
              </select>
            </div>


          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={closeAddModal}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              إضافة
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isEditModalOpen && selectedCategory} 
        title={selectedCategory ? `تعديل الفئة: ${selectedCategory.categoryName}` : ''} 
        onClose={closeEditModal}
      >
        <form onSubmit={handleUpdateCategory}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الفئة *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="أدخل اسم الفئة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="أدخل وصف الفئة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة الفئة
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="معاينة الصورة"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ترتيب العرض
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="أدخل رقم الترتيب"
              />
            </div>

            {/* حقل الحد الأدنى للطلب - جديد */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأدنى للطلب (بالدينار العراقي) *
              </label>
              <input
                type="number"
                name="minimumOrderAmount"
                value={formData.minimumOrderAmount}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="أدخل الحد الأدنى لقيمة الطلب"
              />
            </div>
            
            {/* حقل اختيار المورد - جديد */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المورد *
              </label>
              <select
                name="supplierId"
                value={formData.supplierId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">اختر المورد</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name} (ID: {supplier.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              تحديث
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isDetailsModalOpen && selectedCategory} 
        title={selectedCategory ? `تفاصيل الفئة: ${selectedCategory.categoryName}` : ''} 
        onClose={closeDetailsModal}
      >
        {selectedCategory && (
          <div className="space-y-4 text-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>ID:</strong> {selectedCategory.categoryId || selectedCategory.id}</p>
                <p><strong>اسم الفئة:</strong> {selectedCategory.categoryName || selectedCategory.name}</p>
                <p><strong>الحالة:</strong> {selectedCategory.active ? 'مفعلة' : 'معطلة'}</p>
                <p><strong>ترتيب العرض:</strong> {selectedCategory.displayOrder || 0}</p>
              </div>
              <div>
                <p><strong>الحد الأدنى للطلب:</strong> {selectedCategory.minimumOrderAmount || 'غير محدد'}</p>
                <p><strong>معرّف المورد:</strong> {selectedCategory.supplierId || 'غير محدد'}</p>
                <p><strong>اسم المورد:</strong> {suppliers.find(s => s.id === selectedCategory.supplierId)?.name || 'غير محدد'}</p>
                <p><strong>عدد الأقسام:</strong> {selectedCategory.sectionsCount || 0}</p>
                <p><strong>عدد المنتجات:</strong> {selectedCategory.productsCount || 0}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>تاريخ الإنشاء:</strong> {new Date(selectedCategory.createdAt).toLocaleDateString('ar-EG')}</p>
              </div>
              <div>
                <p><strong>تاريخ التحديث:</strong> {new Date(selectedCategory.updatedAt).toLocaleDateString('ar-EG')}</p>
              </div>
            </div>
            <div>
              <p><strong>الوصف:</strong> {selectedCategory.description || 'لا يوجد وصف'}</p>
            </div>
            {selectedCategory.image && (
              <div>
                <p><strong>الصورة:</strong></p>
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.categoryName}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button
            onClick={closeDetailsModal}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            إغلاق
          </button>
        </div>
      </Modal>

      <Modal 
        isOpen={isDeleteModalOpen && selectedCategory} 
        title="تأكيد الحذف" 
        onClose={closeDeleteModal}
      >
        <p className="text-gray-700 mb-4">
          هل أنت متأكد أنك تريد حذف الفئة "{selectedCategory?.categoryName}"؟
          هذا الإجراء لا يمكن التراجع عنه.
        </p>
        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <button
            onClick={closeDeleteModal}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleDeleteCategory}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            حذف
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;