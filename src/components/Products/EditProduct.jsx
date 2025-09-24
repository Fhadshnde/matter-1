import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_CONFIG, apiCall } from '../../config/api';
import axios from 'axios';
import { IoArrowBack, IoSave, IoImage } from 'react-icons/io5';
import { ArrowLeft, Upload, X, Star } from 'lucide-react';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        wholesalePrice: '',
        stock: '',
        categoryId: '',
        sectionId: '',
        supplierId: '',
        notes: ''
    });

    const [categories, setCategories] = useState([]);
    const [sections, setSections] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [isCompressing, setIsCompressing] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProductDetails();
            fetchCategories();
            fetchSections();
            fetchSuppliers();
        }
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const data = await apiCall(API_CONFIG.ADMIN.PRODUCT_DETAILS(id));
            
            // Set initial product data from the API response
            setProduct({
                name: data.name || '',
                description: data.description || '',
                price: data.sellingPrice || '',
                originalPrice: data.originalPrice || '',
                wholesalePrice: data.wholesalePrice || '',
                stock: data.stock || '',
                categoryId: data.categoryId || '',
                sectionId: data.sectionId || '',
                supplierId: data.supplierId || '',
                notes: data.notes || ''
            });
            
            // Set initial images from API
            if (data.media && data.media.length > 0) {
                const initialPreviews = data.media.map(item => item.url);
                setImagePreviews(initialPreviews);
                const mainIndex = data.media.findIndex(item => item.isMain);
                setMainImageIndex(mainIndex !== -1 ? mainIndex : 0);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('حدث خطأ أثناء جلب تفاصيل المنتج');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await apiCall(API_CONFIG.ADMIN.CATEGORIES);
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
            const data = await apiCall(API_CONFIG.ADMIN.SECTIONS);
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
            const data = await apiCall(API_CONFIG.ADMIN.SUPPLIERS);
            const transformedSuppliers = (data.suppliers || []).map(supplier => ({
                supplierId: supplier.id,
                supplierName: supplier.name || 'مورد بدون اسم',
            }));
            setSuppliers(transformedSuppliers);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            setSuppliers([]);
        }
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
        const newImages = [...selectedImages];
        const newPreviews = [...imagePreviews];
        
        if (index < selectedImages.length) {
            newImages.splice(index, 1);
        }
        newPreviews.splice(index, 1);
        
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
        
        if (mainImageIndex === index) {
            setMainImageIndex(0);
        } else if (mainImageIndex > index) {
            setMainImageIndex(mainImageIndex - 1);
        }
    };

    const setAsMainImage = (index) => {
        setMainImageIndex(index);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'categoryId' && { sectionId: '' })
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            let uploadedImageUrls = [];
            // Step 1: Upload new images if any were selected
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
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );
                    uploadedImageUrls.push(uploadRes.data.url);
                }
            }

            // Combine new uploaded images with existing ones and find the main image URL
            const allImageUrls = [...imagePreviews.filter(url => !url.startsWith('data:')), ...uploadedImageUrls];
            const mainImageUrl = allImageUrls[mainImageIndex] || '';

            // Step 2: Prepare the product data for the API call
            const updateData = {
                name: product.name,
                description: product.description,
                originalPrice: parseFloat(product.originalPrice),
                price: parseFloat(product.price),
                wholesalePrice: parseFloat(product.wholesalePrice),
                stock: parseInt(product.stock),
                categoryId: parseInt(product.categoryId),
                sectionId: parseInt(product.sectionId),
                supplierId: parseInt(product.supplierId),
                mainImageUrl,
                notes: product.notes
            };
            
            // Step 3: Send the update request with the correct data structure
            const result = await apiCall(API_CONFIG.ADMIN.PRODUCT_UPDATE(id), {
                method: 'PUT',
                body: updateData
            });

            if (result.id) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/products');
                }, 2000);
            } else {
                setError(result?.message || 'حدث خطأ أثناء تحديث المنتج');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            setError('حدث خطأ أثناء تحديث المنتج');
        } finally {
            setSaving(false);
        }
    };

    const filteredSections = sections.filter(section => 
        section.categoryId === parseInt(product.categoryId)
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">جاري تحميل تفاصيل المنتج...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate('/products')}
                            className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <IoArrowBack className="w-5 h-5 ml-2" />
                            العودة للمنتجات
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">تعديل المنتج</h1>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                            تم تحديث المنتج بنجاح! سيتم توجيهك لصفحة المنتجات...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اسم المنتج *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                    placeholder="أدخل اسم المنتج"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    سعر البيع *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    سعر الجملة *
                                </label>
                                <input
                                    type="number"
                                    name="wholesalePrice"
                                    value={product.wholesalePrice}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الكمية في المخزن *
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={product.stock}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الفئة *
                                </label>
                                <select
                                    name="categoryId"
                                    value={product.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                    required
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
                                    value={product.supplierId}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                    required
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
                                    value={product.sectionId}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                                    disabled={!product.categoryId}
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
                                value={product.description}
                                onChange={handleInputChange}
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ملاحظات
                            </label>
                            <textarea
                                name="notes"
                                value={product.notes}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-right"
                            />
                        </div>

                        <div className="flex justify-end space-x-4 rtl:space-x-reverse">
                            <button
                                type="button"
                                onClick={() => navigate('/products')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                                        جاري الحفظ...
                                    </>
                                ) : (
                                    <>
                                        <IoSave className="w-4 h-4 ml-2" />
                                        حفظ التغييرات
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;