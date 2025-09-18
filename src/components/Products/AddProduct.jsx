import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Star } from 'lucide-react';
import { API_CONFIG, apiCall } from '../../config/api';
import axios from 'axios';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        sellingPrice: '',
        wholesalePrice: '',
        stock: '',
        categoryId: '',
        sectionId: '',
        supplierId: '',
        imageUrl: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [isCompressing, setIsCompressing] = useState(false);
    const [categories, setCategories] = useState([]);
    const [sections, setSections] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchSections();
        fetchSuppliers();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await apiCall(API_CONFIG.ADMIN.CATEGORIES, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIwNzgwMDAwMDAwMCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1ODE1Nzk4MSwiZXhwIjoxNzU4MjQ0MzgxfQ.3uQ7thMK-vElcE4gTwVLTC1A4TZE7aZLSEHvGa3FACg'}`
                }
            });
            const transformedCategories = data.categories.map(category => ({
                categoryId: category.categoryId,
                categoryName: category.categoryName
            }));
            setCategories(transformedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    const fetchSections = async () => {
        try {
            const data = await apiCall(API_CONFIG.ADMIN.SECTIONS, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIwNzgwMDAwMDAwMCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1ODE1Nzk4MSwiZXhwIjoxNzU4MjQ0MzgxfQ.3uQ7thMK-vElcE4gTwVLTC1A4TZE7aZLSEHvGa3FACg'}`
                }
            });
            const transformedSections = data.sections.map(section => ({
                sectionId: section.sectionId,
                sectionName: section.sectionName,
                categoryId: section.categoryId
            }));
            setSections(transformedSections);
        } catch (error) {
            console.error('Error fetching sections:', error);
            setSections([]);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const data = await apiCall(API_CONFIG.ADMIN.SUPPLIERS, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIwNzgwMDAwMDAwMCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1ODE1Nzk4MSwiZXhwIjoxNzU4MjQ0MzgxfQ.3uQ7thMK-vElcE4gTwVLTC1A4TZE7aZLSEHvGa3FACg'}`
                }
            });
            const transformedSuppliers = (data.suppliers || []).map(supplier => ({
                supplierId: supplier.id,
                supplierName: supplier.name || 'مورد بدون اسم',
                contactInfo: supplier.contactInfo,
                phone: supplier.phone
            }));
            setSuppliers(transformedSuppliers);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            setSuppliers([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // إعادة تعيين القسم عند تغيير الفئة
            ...(name === 'categoryId' && { sectionId: '' })
        }));
    };

    const compressImage = (file, maxWidth = 800, quality = 0.8) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsCompressing(true);
        try {
            const compressedFiles = [];
            const previews = [];

            for (const file of files) {
                if (file.type.startsWith('image/')) {
                    const compressed = await compressImage(file);
                    compressedFiles.push(compressed);
                    
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        previews.push(e.target.result);
                        if (previews.length === files.length) {
                            setImagePreviews([...imagePreviews, ...previews]);
                        }
                    };
                    reader.readAsDataURL(compressed);
                }
            }

            setSelectedImages([...selectedImages, ...compressedFiles]);
        } catch (error) {
            console.error('Error compressing images:', error);
            alert('حدث خطأ في ضغط الصور');
        } finally {
            setIsCompressing(false);
        }
    };

    const removeImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
        
        if (mainImageIndex >= newImages.length) {
            setMainImageIndex(Math.max(0, newImages.length - 1));
        }
    };

    const setAsMainImage = (index) => {
        setMainImageIndex(index);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // 1. رفع الصور أولاً إلى الباك-إند
            let uploadedImageUrls = [];
            if (selectedImages.length > 0) {
                for (let i = 0; i < selectedImages.length; i++) {
                    const file = selectedImages[i];
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    const uploadRes = await axios.post(
                        `${API_CONFIG.BASE_URL}${API_CONFIG.ADMIN_UPLOAD.UPLOAD_IMAGE}`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${localStorage.getItem('userToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIwNzgwMDAwMDAwMCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1ODE1ODEyOSwiZXhwIjoxNzU4MjQ0NTI5fQ.j55YUdRdTRW8qq4pd4sZELJXmau-5P4rApKMlOB0Zyc'}`
                            }
                        }
                    );
                    uploadedImageUrls.push(uploadRes.data.url);
                }
            }
            
            // 2. تجهيز media/mainImageUrl
            let mainImageUrl = '';
            const media = [];
            if (uploadedImageUrls.length > 0) {
                uploadedImageUrls.forEach((url, i) => {
                    media.push({ url, type: 'image', isMain: i === mainImageIndex });
                    if (i === mainImageIndex) {
                        mainImageUrl = url;
                    }
                });
            }
            
            // 3. إنشاء المنتج
            const productData = {
                name: formData.productName,
                description: formData.description,
                price: parseFloat(formData.sellingPrice),
                originalPrice: parseFloat(formData.sellingPrice) * 1.2, // 20% markup
                wholesalePrice: parseFloat(formData.wholesalePrice),
                stock: parseInt(formData.stock),
                categoryId: parseInt(formData.categoryId),
                sectionId: parseInt(formData.sectionId),
                supplierId: parseInt(formData.supplierId),
                mainImageUrl,
                media
            };

            const result = await apiCall(API_CONFIG.ADMIN.PRODUCT_CREATE, {
                method: 'POST',
                body: JSON.stringify(productData),
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIwNzgwMDAwMDAwMCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1ODE1Nzk4MSwiZXhwIjoxNzU4MjQ0MzgxfQ.3uQ7thMK-vElcE4gTwVLTC1A4TZE7aZLSEHvGa3FACg'}`
                }
            });

            if (result.success) {
                alert('تم إنشاء المنتج بنجاح');
                navigate('/products');
            } else {
                alert(result.message || 'تم إنشاء المنتج بنجاح');
                navigate('/products');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('حدث خطأ أثناء إنشاء المنتج');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredSections = sections.filter(section => 
        section.categoryId === parseInt(formData.categoryId)
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/products')}
                            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
                        >
                            <ArrowLeft className="w-5 h-5 ml-2" />
                            العودة للمنتجات
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">إضافة منتج جديد</h1>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اسم المنتج *
                                </label>
                                <input
                                    type="text"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                    placeholder="أدخل اسم المنتج"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    سعر البيع *
                                </label>
                                <input
                                    type="number"
                                    name="sellingPrice"
                                    value={formData.sellingPrice}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    سعر الجملة *
                                </label>
                                <input
                                    type="number"
                                    name="wholesalePrice"
                                    value={formData.wholesalePrice}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الكمية في المخزن *
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الفئة *
                                </label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                >
                                    <option value="">اختر الفئة</option>
                                    {categories.map((category) => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    المورد *
                                </label>
                                <select
                                    name="supplierId"
                                    value={formData.supplierId}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                >
                                    <option value="">اختر المورد</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.supplierId} value={supplier.supplierId}>
                                            {supplier.supplierName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    القسم
                                </label>
                                <select
                                    name="sectionId"
                                    value={formData.sectionId}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                    disabled={!formData.categoryId}
                                >
                                    <option value="">اختر القسم</option>
                                    {filteredSections.map((section) => (
                                        <option key={section.sectionId} value={section.sectionId}>
                                            {section.sectionName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                وصف المنتج
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                placeholder="أدخل وصف المنتج"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                صور المنتج
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                    <p className="text-gray-600 mb-2">
                                        {isCompressing ? 'جاري ضغط الصور...' : 'اضغط لرفع الصور'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        يمكنك رفع عدة صور في نفس الوقت
                                    </p>
                                </label>
                            </div>

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-700 mb-4">معاينة الصور</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`معاينة ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border"
                                                />
                                                {mainImageIndex === index && (
                                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full">
                                                        <Star className="w-4 h-4" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setAsMainImage(index)}
                                                            className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600"
                                                            title="تعيين كصورة رئيسية"
                                                        >
                                                            <Star className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                                            title="حذف الصورة"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => navigate('/products')}
                                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'جاري الحفظ...' : 'حفظ المنتج'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;