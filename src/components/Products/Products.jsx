import React, { useState } from 'react';

// Main App component that manages the page state
const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(null);

  const navigateTo = (page, product = null) => {
    setCurrentPage(page);
    setEditingProduct(product);
  };

  const dummyProducts = [
    {
      id: 1,
      image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P1',
      name: 'هاتف 1 A15 128GB، سماعات بلوتوت 1x',
      price: '154.90 د.ك',
      quantity: 15,
      status: 'متوفر',
      category: 'هاتف محمول',
    },
    {
      id: 2,
      image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P2',
      name: 'هاتف 2 Pro...',
      price: '299.00 د.ك',
      quantity: 5,
      status: 'كمية منخفضة',
      category: 'هاتف محمول',
    },
    {
      id: 3,
      image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P3',
      name: 'سماعة بلوتوث',
      price: '75.50 د.ك',
      quantity: 0,
      status: 'غير متوفر',
      category: 'ملحقات',
    },
    {
      id: 4,
      image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P4',
      name: 'شاحن سريع',
      price: '20.00 د.ك',
      quantity: 20,
      status: 'متوفر',
      category: 'ملحقات',
    },
    {
      id: 5,
      image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P5',
      name: 'هاتف 1 A15...',
      price: '154.90 د.ك',
      quantity: 15,
      status: 'متوفر',
      category: 'هاتف محمول',
    },
    {
      id: 6,
      image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P6',
      name: 'هاتف 1 A15...',
      price: '154.90 د.ك',
      quantity: 15,
      status: 'متوفر',
      category: 'هاتف محمول',
    },
    {
      id: 7,
      image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P7',
      name: 'هاتف 1 A15...',
      price: '154.90 د.ك',
      quantity: 15,
      status: 'متوفر',
      category: 'هاتف محمول',
    },
    {
      id: 8,
      image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P8',
      name: 'هاتف 1 A15...',
      price: '154.90 د.ك',
      quantity: 15,
      status: 'متوفر',
      category: 'هاتف محمول',
    },
    {
      id: 9,
      image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P9',
      name: 'هاتف 1 A15...',
      price: '154.90 د.ك',
      quantity: 15,
      status: 'متوفر',
      category: 'هاتف محمول',
    },
    {
      id: 10,
      image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P10',
      name: 'هاتف 1 A15...',
      price: '154.90 د.ك',
      quantity: 15,
      status: 'متوفر',
      category: 'هاتف محمول',
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard navigateTo={navigateTo} dummyProducts={dummyProducts} />;
      case 'addProduct':
        return <AddProduct navigateTo={navigateTo} />;
      case 'editProduct':
        return <EditProduct navigateTo={navigateTo} product={editingProduct} />;
      default:
        return <Dashboard navigateTo={navigateTo} dummyProducts={dummyProducts} />;
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 p-8 min-h-screen font-sans">
      <script src="https://cdn.tailwindcss.com"></script>
      {renderPage()}
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ navigateTo, dummyProducts }) => {
  const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false);
  const [isMoreActionsDropdownOpen, setIsMoreActionsDropdownOpen] = useState(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case 'متوفر':
        return 'bg-green-100 text-green-700';
      case 'غير متوفر':
        return 'bg-red-100 text-red-700';
      case 'كمية منخفضة':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm">إجمالي المنتجات</h3>
            <p className="text-2xl font-bold">820</p>
          </div>
          <span className="text-sm text-green-500">↑ 8%</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm">منتجات منخفضة المخزون</h3>
            <p className="text-2xl font-bold">18</p>
          </div>
          <span className="text-sm text-red-500">↓ 2%</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm">منتجات غير متوفرة</h3>
            <p className="text-2xl font-bold">32</p>
          </div>
          <span className="text-sm text-red-500">↓ 2%</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm">تعديلات تلقائية منقطعة</h3>
            <p className="text-2xl font-bold">14</p>
          </div>
          <span className="text-sm text-red-500">↑ 8%</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
              onClick={() => navigateTo('addProduct')}
            >
              + إضافة منتج
            </button>
            <div className="relative">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-300 transition-colors"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              >
                الكل <span className="ml-2 rtl:mr-2">^</span>
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
                className="bg-gray-100 text-gray-700 px-4 py-2 pr-10 rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">إدارة المنتجات</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-right bg-white">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-3 px-4 font-normal text-sm">الإجراءات</th>
                <th className="py-3 px-4 font-normal text-sm">القسم</th>
                <th className="py-3 px-4 font-normal text-sm">الحالة</th>
                <th className="py-3 px-4 font-normal text-sm">الكمية</th>
                <th className="py-3 px-4 font-normal text-sm">السعر</th>
                <th className="py-3 px-4 font-normal text-sm">اسم المنتج</th>
                <th className="py-3 px-4 font-normal text-sm">صورة المنتج</th>
              </tr>
            </thead>
            <tbody>
              {dummyProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 relative">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setIsMoreActionsDropdownOpen(isMoreActionsDropdownOpen === product.id ? null : product.id)}
                    >
                      ...
                    </button>
                    {isMoreActionsDropdownOpen === product.id && (
                      <div className="absolute left-5 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 text-sm text-gray-700">
                        <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100" onClick={() => { setIsProductDetailsModalOpen(true); setIsMoreActionsDropdownOpen(false); }}>
                          عرض التفاصيل
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100" onClick={() => navigateTo('editProduct', product)}>
                          تعديل المنتج
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100" onClick={() => { setIsEditStockModalOpen(true); setIsMoreActionsDropdownOpen(false); }}>
                          تعديل المخزون
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100" onClick={() => { setIsEditPriceModalOpen(true); setIsMoreActionsDropdownOpen(false); }}>
                          تعديل السعر
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 hover:bg-red-50 text-red-600 border-t border-gray-200 mt-2 pt-2" onClick={() => { setIsDeleteModalOpen(true); setIsMoreActionsDropdownOpen(false); }}>
                          حذف المنتج
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">{product.category}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusClass(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{product.quantity}</td>
                  <td className="py-3 px-4 text-sm">{product.price}</td>
                  <td className="py-3 px-4 text-sm">{product.name}</td>
                  <td className="py-3 px-4">
                    <img src={product.image} alt="product" className="w-10 h-10 rounded-md object-cover" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 text-gray-600">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm">اعرض في الصفحة</span>
            <select className="bg-gray-100 p-1 rounded-md text-sm">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">&lt;</button>
            <span className="bg-red-600 text-white px-3 py-1 rounded-md">1</span>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">2</button>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">3</button>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">4</button>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">5</button>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">&gt;</button>
          </div>
          <div className="text-sm">إجمالي المنتجات: 8764</div>
        </div>
      </div>

      {isEditStockModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">تعديل المخزون</h2>
              <button onClick={() => setIsEditStockModalOpen(false)} className="text-gray-400 text-2xl font-bold hover:text-gray-600">&times;</button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">الكمية في المخزون</label>
              <input type="number" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" defaultValue="15" />
            </div>
            <div className="flex justify-end space-x-4 rtl:space-x-reverse">
              <button onClick={() => setIsEditStockModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">إلغاء</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">تعديل</button>
            </div>
          </div>
        </div>
      )}

      {isEditPriceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">تعديل السعر</h2>
              <button onClick={() => setIsEditPriceModalOpen(false)} className="text-gray-400 text-2xl font-bold hover:text-gray-600">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">السعر الأساسي</label>
                <input type="text" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" defaultValue="150 د.ك" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">السعر بعد الخصم</label>
                <input type="text" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" defaultValue="140 د.ك" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">نسبة الخصم</label>
                <input type="text" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" defaultValue="10%" />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
              <button onClick={() => setIsEditPriceModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">إلغاء</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">تعديل</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md text-center p-6">
            <div className="mb-4">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 text-red-600 p-4 rounded-full">
                  <span className="text-3xl font-bold">❌</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mt-2 text-gray-800">هل أنت متأكد أنك تريد حذف المنتج؟</h3>
              <p className="text-sm text-gray-500 mt-2">سوف يتم حذف هذا المنتج نهائيًا من قائمة المنتجات لديك</p>
              <p className="text-sm text-gray-500 mt-1">هل أنت متأكد أنك تريد الحذف؟</p>
            </div>
            <div className="flex justify-center space-x-4 rtl:space-x-reverse mt-6">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">إلغاء</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">حذف المنتج</button>
            </div>
          </div>
        </div>
      )}

      {isProductDetailsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">تفاصيل المنتج</h2>
                <button
                  onClick={() => {
                    setIsProductDetailsModalOpen(false);
                  }}
                  className="text-gray-400 text-2xl font-bold hover:text-gray-600"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <span className="w-1/3 text-gray-500">الاسم</span>
                  <span className="w-2/3">هاتف 1 A15 128GB، سماعات بلوتوت 1x</span>
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <span className="w-1/3 text-gray-500">صورة المنتج</span>
                  <img src="https://placehold.co/60x60/e0e0e0/ffffff?text=P1" alt="product" className="w-16 h-16 rounded-lg object-cover" />
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <span className="w-1/3 text-gray-500">السعر</span>
                  <span className="w-2/3">154.90 د.ك</span>
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <span className="w-1/3 text-gray-500">الحالة</span>
                  <span className="w-2/3">متوفر</span>
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <span className="w-1/3 text-gray-500">المخزون</span>
                  <span className="w-2/3">15</span>
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <span className="w-1/3 text-gray-500">القسم</span>
                  <span className="w-2/3">اجهزة محموله</span>
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <span className="w-1/3 text-gray-500">تحديث تلقائي</span>
                  <span className="w-2/3">نشط</span>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <span className="block text-gray-500 mb-1">وصف المنتج</span>
                  <span className="block">جهاز محمول حديث من سامسونج</span>
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setIsProductDetailsModalOpen(false);
                    navigateTo('editProduct', dummyProducts[0]);
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  تعديل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Add Product Page Component
const AddProduct = ({ navigateTo }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">إضافة منتج جديد</h2>
        <button
          onClick={() => navigateTo('dashboard')}
          className="text-gray-400 text-2xl font-bold hover:text-gray-600"
        >
          &times;
        </button>
      </div>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">معلومات المنتج الأساسية</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">اسم المنتج</label>
                <input type="text" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" placeholder="ادخل الاسم" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">كود المنتج</label>
                <input type="text" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" placeholder="ادخل الكود" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">التصنيف الرئيسي</label>
                <select className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800">
                  <option>الهواتف المحمولة</option>
                  <option>ملحقات</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">وصف مختصر</label>
                <textarea className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" rows="3" placeholder="ادخل الوصف هنا ...."></textarea>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">صور المنتج</h3>
              <div className="mt-4 space-y-2">
                <button type="button" className="flex items-center text-red-600 hover:text-red-700 mt-2">
                  <span className="text-lg mr-2">+</span>
                  إضافة ملفات أخرى
                </button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">السعر والمخزون</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">السعر الأساسي</label>
                <input type="text" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" placeholder="ادخل السعر" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">السعر بعد الخصم</label>
                <input type="text" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" placeholder="ادخل السعر" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">تفعيل خصم</label>
                <select className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800">
                  <option>نعم</option>
                  <option>لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">الكمية</label>
                <input type="number" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" placeholder="ادخل الكمية" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">حالة التوفر</label>
                <select className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800">
                  <option>متوفر</option>
                  <option>كمية منخفضة</option>
                  <option>غير متوفر</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
          <button type="button" onClick={() => navigateTo('dashboard')} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">إلغاء</button>
          <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">حفظ</button>
        </div>
      </form>
    </div>
  );
};

// Edit Product Page Component
const EditProduct = ({ navigateTo, product }) => {
  if (!product) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold">لم يتم تحديد منتج للتعديل.</h2>
        <button onClick={() => navigateTo('dashboard')} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg">العودة إلى لوحة التحكم</button>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">تعديل المنتج: {product.name}</h2>
        <button
          onClick={() => navigateTo('dashboard')}
          className="text-gray-400 text-2xl font-bold hover:text-gray-600"
        >
          &times;
        </button>
      </div>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">معلومات المنتج الأساسية</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">اسم المنتج</label>
                <input type="text" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" placeholder="ادخل الاسم" defaultValue={product.name} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">كود المنتج</label>
                <input type="text" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" placeholder="ادخل الكود" defaultValue={product.id} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">التصنيف الرئيسي</label>
                <select className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" defaultValue={product.category}>
                  <option>الهواتف المحمولة</option>
                  <option>ملحقات</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">وصف مختصر</label>
                <textarea className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" rows="3" placeholder="ادخل الوصف هنا ....">جهاز محمول حديث من سامسونج</textarea>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">صور المنتج</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center bg-gray-100 p-3 rounded-lg border border-gray-200">
                  <button type="button" className="text-red-500 ml-2 hover:text-red-700">🗑️</button>
                  <span>اسم الصورة 1</span>
                  <span className="text-gray-500 text-sm mr-auto">145 KB</span>
                </div>
                <button type="button" className="flex items-center text-red-600 hover:text-red-700 mt-2">
                  <span className="text-lg mr-2">+</span>
                  إضافة ملفات أخرى
                </button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">السعر والمخزون</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">السعر الأساسي</label>
                <input type="text" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" placeholder="ادخل السعر" defaultValue="154.90" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">السعر بعد الخصم</label>
                <input type="text" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" placeholder="ادخل السعر" defaultValue="130.90" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">تفعيل خصم</label>
                <select className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800">
                  <option>نعم</option>
                  <option>لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">الكمية</label>
                <input type="number" className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" placeholder="ادخل الكمية" defaultValue={product.quantity} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">حالة التوفر</label>
                <select className="bg-gray-100 w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800" defaultValue={product.status}>
                  <option>متوفر</option>
                  <option>كمية منخفضة</option>
                  <option>غير متوفر</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
          <button type="button" onClick={() => navigateTo('dashboard')} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">إلغاء</button>
          <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">حفظ</button>
        </div>
      </form>
    </div>
  );
};

export default App;
