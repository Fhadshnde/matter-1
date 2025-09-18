import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_CONFIG, apiCall } from '../../config/api';
import { IoArrowBack, IoSave, IoImage } from 'react-icons/io5';

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
        mainImageUrl: '',
        notes: ''
    });

    // Debug: Log product state changes
    useEffect(() => {
        console.log('Product state updated:', product);
    }, [product]);

    const [categories, setCategories] = useState([]);
    const [sections, setSections] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    // Debug: Log state changes
    useEffect(() => {
        console.log('Suppliers state updated:', suppliers);
    }, [suppliers]);

    useEffect(() => {
        console.log('Categories state updated:', categories);
    }, [categories]);

    useEffect(() => {
        console.log('Sections state updated:', sections);
    }, [sections]);

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
            console.log('Product details:', data);
            
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
                mainImageUrl: data.imageUrl || '',
                notes: data.notes || ''
            });
            
            console.log('Product state set:', {
                name: data.name || '',
                description: data.description || '',
                price: data.sellingPrice || '',
                originalPrice: data.originalPrice || '',
                wholesalePrice: data.wholesalePrice || '',
                stock: data.stock || '',
                categoryId: data.categoryId || '',
                sectionId: data.sectionId || '',
                supplierId: data.supplierId || '',
                mainImageUrl: data.imageUrl || '',
                notes: data.notes || ''
            });
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
            console.log('Categories data:', data);
            console.log('Categories array:', data.categories);
            setCategories(data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSections = async () => {
        try {
            const data = await apiCall(API_CONFIG.ADMIN.SECTIONS);
            console.log('Sections data:', data);
            setSections(data.sections || []);
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const data = await apiCall(API_CONFIG.ADMIN.SUPPLIERS);
            console.log('Suppliers data:', data);
            console.log('Suppliers array:', data.suppliers);
            setSuppliers(data.suppliers || []);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log('Input change:', name, value);
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            
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
                mainImageUrl: product.mainImageUrl,
                notes: product.notes
            };

            console.log('Updating product with data:', updateData);
            
            // Retry logic for network issues
            let result;
            let retryCount = 0;
            const maxRetries = 3;
            
            while (retryCount < maxRetries) {
                try {
                    result = await apiCall(API_CONFIG.ADMIN.PRODUCT_UPDATE(id), {
                        method: 'PUT',
                        body: updateData
                    });
                    break; // Success, exit retry loop
                } catch (error) {
                    retryCount++;
                    console.log(`Update attempt ${retryCount} failed:`, error.message);
                    
                    if (retryCount < maxRetries) {
                        // Wait before retrying (exponential backoff)
                        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                        console.log(`Retrying update (attempt ${retryCount + 1}/${maxRetries})...`);
                    } else {
                        throw error; // Re-throw error if all retries failed
                    }
                }
            }

            if (result && result.id) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/products');
                }, 2000);
            } else {
                setError(result?.message || 'حدث خطأ أثناء تحديث المنتج');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            if (error.message.includes('Failed to fetch') || error.message.includes('Load failed')) {
                setError('خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
            } else {
                setError('حدث خطأ أثناء تحديث المنتج');
            }
        } finally {
            setSaving(false);
        }
    };

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

    console.log('Rendering EditProduct with:', {
        product,
        categories: categories.length,
        sections: sections.length,
        suppliers: suppliers.length
    });

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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    السعر الأصلي *
                                </label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={product.originalPrice}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    سعر الجملة
                                </label>
                                <input
                                    type="number"
                                    name="wholesalePrice"
                                    value={product.wholesalePrice}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الفئة * ({categories.length} فئة)
                                </label>
                                <select
                                    name="categoryId"
                                    value={product.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">اختر الفئة</option>
                                    {categories.map(category => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    القسم * ({sections.length} قسم)
                                </label>
                                <select
                                    name="sectionId"
                                    value={product.sectionId}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">اختر القسم</option>
                                    {sections.map(section => (
                                        <option key={section.sectionId} value={section.sectionId}>
                                            {section.sectionName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    المورد * ({suppliers.length} مورد)
                                </label>
                                <select
                                    name="supplierId"
                                    value={product.supplierId}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">اختر المورد</option>
                                    {suppliers.map(supplier => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                وصف المنتج
                            </label>
                            <textarea
                                name="description"
                                value={product.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                رابط الصورة الرئيسية
                            </label>
                            <input
                                type="url"
                                name="mainImageUrl"
                                value={product.mainImageUrl}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
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
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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