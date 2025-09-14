import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';

const AddProduct = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        originalPrice: '',
        wholesalePrice: '',
        mainImageUrl: '',
        categoryId: '',
        sectionId: '',
        supplierId: '',
        notes: ''
    });
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const baseUrl = 'https://products-api.cbc-apps.net';
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch(`${baseUrl}/admin/dashboard/suppliers?page=1&limit=20`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('فشل في جلب قائمة الموردين');
                }
                const data = await response.json();
                setSuppliers(data.suppliers);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                setError('فشل في تحميل الموردين. يرجى المحاولة مرة أخرى.');
            }
        };

        if (token) {
            fetchSuppliers();
        } else {
            setError('خطأ: لم يتم العثور على توكن المصادقة. يرجى تسجيل الدخول.');
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const body = {
                name: productData.name,
                description: productData.description,
                originalPrice: parseInt(productData.originalPrice),
                wholesalePrice: parseInt(productData.wholesalePrice),
                mainImageUrl: productData.mainImageUrl,
                categoryId: parseInt(productData.categoryId),
                sectionId: parseInt(productData.sectionId),
                supplierId: parseInt(productData.supplierId),
                notes: productData.notes
            };
            
            const response = await fetch(`${baseUrl}/admin/dashboard/products-management`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'فشل في إضافة المنتج. يرجى التحقق من البيانات.');
            }

            setSuccessMessage('تمت إضافة المنتج بنجاح!');
            setTimeout(() => {
                navigate('/products-dashboard');
            }, 2000);
        } catch (err) {
            console.error('Error adding product:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8 text-right font-['Tajawal']">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center"
                >
                    <IoArrowBackOutline className="w-5 h-5 ml-2" />
                    العودة
                </button>
                <h1 className="text-2xl font-bold text-gray-800">إضافة منتج جديد</h1>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</div>}
                {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">{successMessage}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="relative">
                            <label className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">اسم المنتج</label>
                            <input
                                type="text"
                                name="name"
                                value={productData.name}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="relative">
                            <label className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">الوصف</label>
                            <textarea
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                rows="1"
                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                            ></textarea>
                        </div>
                        <div className="relative">
                            <label className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">سعر البيع الأصلي</label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={productData.originalPrice}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="relative">
                            <label className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">سعر الجملة</label>
                            <input
                                type="number"
                                name="wholesalePrice"
                                value={productData.wholesalePrice}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="relative">
                            <label className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">رابط صورة المنتج</label>
                            <input
                                type="url"
                                name="mainImageUrl"
                                value={productData.mainImageUrl}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="relative">
                            <label className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">معرف القسم</label>
                            <input
                                type="number"
                                name="categoryId"
                                value={productData.categoryId}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="relative">
                            <label className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">معرف القسم الفرعي</label>
                            <input
                                type="number"
                                name="sectionId"
                                value={productData.sectionId}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="relative">
                            <label className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">المورد</label>
                            <select
                                name="supplierId"
                                value={productData.supplierId}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                            >
                                <option value="">اختر موردًا</option>
                                {suppliers.map(supplier => (
                                    <option key={supplier.supplierId} value={supplier.supplierId}>
                                        {supplier.supplierName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <label className="absolute -top-2 right-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">ملاحظات (JSON)</label>
                            <textarea
                                name="notes"
                                value={productData.notes}
                                onChange={handleChange}
                                rows="1"
                                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                            ></textarea>
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'جاري الإضافة...' : 'إضافة المنتج'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;