import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://products-api.cbc-apps.net/admin/dashboard';

const ExcelProductUploadForm = () => {
    const token = localStorage.getItem('token'); 

    const [formData, setFormData] = useState({
        file: null,
        active: 'true',
        sectionId: '',
        categoryId: '',
        supplierId: '',
    });

    const [sections, setSections] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // --- Fetch initial data for selects ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);
            
            if (!token) {
                setError('التوكين مفقود في localStorage. يرجى تسجيل الدخول.');
                setLoading(false);
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            };

            try {
                const [sectionsRes, categoriesRes, suppliersRes] = await Promise.all([
                    axios.get(`${BASE_URL}/sections?limit=100`, { headers }), 
                    axios.get(`${BASE_URL}/categories?limit=100`, { headers }),
                    axios.get(`${BASE_URL}/suppliers?limit=100`, { headers }),
                ]);

                setSections(sectionsRes.data.sections || []);
                setCategories(categoriesRes.data.categories || []);
                setSuppliers(suppliersRes.data.suppliers || []);

            } catch (err) {
                console.error('Error fetching initial data:', err.response || err);
                if (err.response && err.response.status === 401) {
                    setError('خطأ 401: يرجى تسجيل الدخول مجدداً، التوكين غير صالح أو منتهي الصلاحية.');
                } else {
                    setError('حدث خطأ أثناء تحميل البيانات الابتدائية.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [token]);

    // --- Handle input/select changes ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'sectionId' && value) {
            const selectedSection = sections.find(s => s.sectionId.toString() === value);
            if (selectedSection && selectedSection.categoryId.toString() !== formData.categoryId) {
                setFormData(prev => ({
                    ...prev,
                    categoryId: selectedSection.categoryId.toString()
                }));
            }
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            file: e.target.files[0]
        }));
    };

    // --- Submit handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError(null);

        if (!token) {
            setError('خطأ: توكين المصادقة مفقود. لا يمكن إرسال الطلب.');
            return;
        }

        if (!formData.file || !formData.sectionId || !formData.categoryId || !formData.supplierId) {
            setError('الرجاء إكمال جميع الحقول المطلوبة.');
            return;
        }

        setIsUploading(true);

        const dataToSend = new FormData();
        dataToSend.append('file', formData.file);
        dataToSend.append('active', formData.active === 'true');
        dataToSend.append('sectionId', formData.sectionId);
        dataToSend.append('categoryId', formData.categoryId);
        dataToSend.append('supplierId', formData.supplierId);

        try {
            const response = await axios.post(`${BASE_URL}/products/upload-excel`, dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', 
                }
            });

            setMessage(`✅ تم رفع المنتجات بنجاح. (HTTP ${response.status})`);
            setFormData(prev => ({ ...prev, file: null, sectionId: '', categoryId: '', supplierId: '' }));

        } catch (err) {
            console.error('Upload Error:', err.response || err);
            const apiError = err.response?.data?.message || err.message || 'فشل في رفع الملف.';
            if (err.response && err.response.status === 401) {
                setError('خطأ في المصادقة: توكين غير صالح أو منتهي الصلاحية.');
            } else {
                setError(`❌ فشل الرفع: ${apiError}`);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const filteredSections = sections.filter(
        section => section.categoryId.toString() === formData.categoryId
    );

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10 text-center" dir="rtl">
                <p className="text-xl text-indigo-600">جاري تحميل البيانات... 🔄</p>
            </div>
        );
    }

    if (error && !isUploading) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10 text-center" dir="rtl">
                <p className="text-xl text-red-600">🚫 {error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10" dir="rtl">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center border-b pb-3">
                رفع المنتجات عبر ملف إكسل 
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                    <label htmlFor="file" className="block text-lg font-medium text-gray-700 mb-2">
                        ملف إكسل للمنتجات (*.xlsx, *.xls) <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="file"
                        name="file"
                        type="file"
                        accept=".xlsx, .xls"
                        required
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                    />
                </div>

                <div>
                    <label htmlFor="categoryId" className="block text-lg font-medium text-gray-700 mb-2">
                        الـتصنيف (Category) <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg rounded-md border appearance-none bg-white"
                    >
                        <option value="" disabled>-- اختر التصنيف --</option>
                        {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName} ({category.categoryId})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="sectionId" className="block text-lg font-medium text-gray-700 mb-2">
                        الـقسم (Section) <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="sectionId"
                        name="sectionId"
                        value={formData.sectionId}
                        required
                        onChange={handleChange}
                        disabled={!formData.categoryId || filteredSections.length === 0}
                        className={`mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg rounded-md border appearance-none ${!formData.categoryId || filteredSections.length === 0 ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                    >
                        <option value="" disabled>
                            {formData.categoryId ? (filteredSections.length === 0 ? 'لا توجد أقسام لهذا التصنيف' : '-- اختر القسم --') : 'يرجى اختيار التصنيف أولاً'}
                        </option>
                        {filteredSections.map(section => (
                            <option key={section.sectionId} value={section.sectionId}>
                                {section.sectionName} ({section.sectionId})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="supplierId" className="block text-lg font-medium text-gray-700 mb-2">
                        المورد (Supplier) <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="supplierId"
                        name="supplierId"
                        value={formData.supplierId}
                        required
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg rounded-md border appearance-none bg-white"
                    >
                        <option value="" disabled>-- اختر المورد --</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name} ({supplier.id})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="active" className="block text-lg font-medium text-gray-700 mb-2">
                        حالة التفعيل (Active)
                    </label>
                    <select
                        id="active"
                        name="active"
                        value={formData.active}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg rounded-md border appearance-none bg-white"
                    >
                        <option value="true">مفعل (True)</option>
                        <option value="false">غير مفعل (False)</option>
                    </select>
                </div>

                {message && (
                    <div className="p-4 rounded-md bg-green-50 text-green-700 border border-green-200">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
                        {error}
                    </div>
                )}

                <div className="pt-5">
                    <button
                        type="submit"
                        disabled={isUploading || loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-xl font-medium text-white ${isUploading || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                    >
                        {isUploading ? (
                            <>
                                <span>جاري الرفع...</span>
                                <span className="animate-spin ml-2">🌀</span>
                            </>
                        ) : 'رفع ملف المنتجات'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExcelProductUploadForm;
