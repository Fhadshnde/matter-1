import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { MdOutlineCategory } from 'react-icons/md';
import { HiOutlineCube } from 'react-icons/hi';
import { TbCategory2 } from 'react-icons/tb';
import API_CONFIG, { apiCall } from '../../config/api';
import StatCard from '../Shared/StatCard';
import Modal from '../Shared/Modal';
import Pagination from '../Shared/Pagination';

const Categories = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [statsCards, setStatsCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });

  // Image upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCategoriesData();
  }, [currentPage, searchTerm]);

  const fetchCategoriesData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
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
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Modal handlers
  const openAddModal = () => {
    setFormData({ name: '', description: '', image: '' });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.categoryName,
      description: category.description,
      image: category.image
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

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      
      // رفع الصورة إذا تم اختيارها
      if (selectedImage) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedImage);
        
        const uploadResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ADMIN_UPLOAD.UPLOAD_IMAGE}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          },
          body: formDataUpload
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.url;
        }
      }
      
      const result = await apiCall(API_CONFIG.ADMIN.CATEGORIES, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          image: imageUrl
        })
      });
      
      if (result.success) {
        alert(result.message || 'تم إنشاء الفئة بنجاح');
        fetchCategoriesData();
        closeAddModal();
        setFormData({ name: '', description: '', image: '' });
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
      
      // رفع الصورة الجديدة إذا تم اختيارها
      if (selectedImage) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedImage);
        
        const uploadResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ADMIN_UPLOAD.UPLOAD_IMAGE}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          },
          body: formDataUpload
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.url;
        }
      }
      
      const result = await apiCall(API_CONFIG.ADMIN.CATEGORY_UPDATE(selectedCategory.categoryId), {
        method: 'PUT',
        body: JSON.stringify({
          ...formData,
          image: imageUrl
        })
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

      {/* Stats Cards */}
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

      {/* Search and Filters */}
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

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفئة
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
              {categoriesData.map((category) => (
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

        {categoriesData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد فئات
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Add Category Modal */}
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

      {/* Edit Category Modal */}
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

      {/* Category Details Modal */}
      <Modal 
        isOpen={isDetailsModalOpen && selectedCategory} 
        title={selectedCategory ? `تفاصيل الفئة: ${selectedCategory.categoryName}` : ''} 
        onClose={closeDetailsModal}
      >
        {selectedCategory && (
          <div className="space-y-4 text-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>ID:</strong> {selectedCategory.categoryId}</p>
                <p><strong>اسم الفئة:</strong> {selectedCategory.categoryName}</p>
                <p><strong>عدد الأقسام:</strong> {selectedCategory.sectionsCount}</p>
                <p><strong>الوصف:</strong> {selectedCategory.description || 'لا يوجد وصف'}</p>
              </div>
              <div>
                <p><strong>عدد المنتجات:</strong> {selectedCategory.productsCount}</p>
                <p><strong>تاريخ الإنشاء:</strong> {new Date(selectedCategory.createdAt).toLocaleDateString('ar-EG')}</p>
                <p><strong>تاريخ التحديث:</strong> {new Date(selectedCategory.updatedAt).toLocaleDateString('ar-EG')}</p>
              </div>
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

      {/* Delete Confirmation Modal */}
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
