// src/pages/CommissionManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const baseUrl = "https://products-api.cbc-apps.net";

const CommissionManager = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [manualProductId, setManualProductId] = useState("");
  const [manualCategoryId, setManualCategoryId] = useState("");
  const [percentage, setPercentage] = useState(10);
  const [priority, setPriority] = useState(50);
  const [fixedFee, setFixedFee] = useState(5000);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [useCommissionRules, setUseCommissionRules] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/admin/dashboard/suppliers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(res.data.suppliers || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("فشل تحميل الموردين");
    }
  };

  const fetchCategories = async (supplierId) => {
    try {
      let allCategories = [];
      let page = 1;
      let totalPages = 1;
      do {
        const res = await axios.get(
          `${baseUrl}/admin/dashboard/categories?supplierId=${supplierId}&page=${page}&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        allCategories = [...allCategories, ...res.data.categories];
        totalPages = res.data.pagination?.totalPages || 1;
        page++;
      } while (page <= totalPages);
      setCategories(allCategories);
    } catch (error) {
      alert("فشل تحميل الفئات");
    }
  };

  const fetchProducts = async (supplierId, pageNumber = 1) => {
    try {
      setLoadingProducts(true);
      const res = await axios.get(
        `${baseUrl}/admin/dashboard/products?supplierId=${supplierId}&page=${pageNumber}&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newProducts = res.data.products || [];
      if (pageNumber === 1) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }
      const totalPages = res.data.pagination?.totalPages || 1;
      setHasMore(pageNumber < totalPages);
      setLoadingProducts(false);
    } catch (error) {
      setLoadingProducts(false);
      alert("فشل تحميل المنتجات");
    }
  };

  const loadMoreProducts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(selectedSupplier, nextPage);
  };

  const handleSupplierChange = (e) => {
    const supplierId = Number(e.target.value);
    setSelectedSupplier(supplierId);
    setSelectedProducts([]);
    setSelectedCategories([]);
    setProducts([]);
    setCategories([]);
    setPage(1);
    fetchCategories(supplierId);
    fetchProducts(supplierId, 1);
  };

  const toggleProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const applyCommissionToProducts = async () => {
    if (!selectedSupplier) return alert("اختر مورد أولاً");
    let targetProducts = [...selectedProducts];
    if (manualProductId) targetProducts.push(Number(manualProductId));
    if (targetProducts.length === 0)
      return alert("اختر منتجات أو أدخل ID المنتج لتطبيق العمولة");
    try {
      await axios.post(
        `${baseUrl}/suppliers/${selectedSupplier}/commission/rules/product-list`,
        {
          productIds: targetProducts,
          percentage,
          fixedFee,
          priority,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ تم تطبيق العمولة على ${targetProducts.length} منتج بنجاح!`);
      setSelectedProducts([]);
      setManualProductId("");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("❌ فشل تطبيق العمولة على المنتجات");
    }
  };

  const applyCommissionToCategories = async () => {
    if (!selectedSupplier) return alert("اختر مورد أولاً");
    let targetCategories = [...selectedCategories];
    if (manualCategoryId) targetCategories.push(Number(manualCategoryId));
    if (targetCategories.length === 0)
      return alert("اختر فئات أو أدخل ID الفئة لتطبيق العمولة");
    try {
      for (let catId of targetCategories) {
        await axios.post(
          `${baseUrl}/suppliers/${selectedSupplier}/commission/rules`,
          { scopeType: "CATEGORY", scopeId: catId, percentage, priority },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      alert(`✅ تم تطبيق العمولة على ${targetCategories.length} فئة بنجاح!`);
      setSelectedCategories([]);
      setManualCategoryId("");
    } catch (error) {
      alert("❌ فشل تطبيق العمولة على الفئات");
    }
  };

  const toggleUseCommissionRules = async (supplierId, value) => {
    try {
      await axios.patch(
        `${baseUrl}/suppliers/${supplierId}/commission/use-rules`,
        { useCommissionRules: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUseCommissionRules(value);
      alert(
        `تم ${value ? "تفعيل" : "تعطيل"} القواعد الجديدة لاحتساب العمولة لهذا المورد بنجاح`
      );
    } catch (error) {
      alert("فشل تحديث حالة القواعد الجديدة للمورد");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-gray-200"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center items-center">
          <h1 className="text-2xl font-bold">إدارة عمولة المورد</h1>
        </div>
      </div>
      <div className="pt-28 max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-center">
          <select
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedSupplier || ""}
            onChange={handleSupplierChange}
          >
            <option value="" disabled>
              اختر المورد
            </option>
            {suppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name} ({sup.productsCount} منتجات)
              </option>
            ))}
          </select>
        </div>

        {selectedSupplier && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => toggleUseCommissionRules(selectedSupplier, true)}
              className={`px-6 py-2 rounded text-white transition ${
                useCommissionRules ? "bg-green-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              ✅ تفعيل القواعد الجديدة
            </button>
            <button
              onClick={() => toggleUseCommissionRules(selectedSupplier, false)}
              className={`px-6 py-2 rounded text-white transition ${
                !useCommissionRules ? "bg-gray-700" : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              ❌ تعطيل القواعد الجديدة
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-6 justify-center items-center">
          <div className="flex items-center space-x-2">
            <label className="font-semibold text-lg">نسبة العمولة %:</label>
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="border rounded px-3 py-1 w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="font-semibold text-lg">الأولوية:</label>
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="border rounded px-3 py-1 w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="font-semibold text-lg">العمولة الثابتة:</label>
            <input
              type="number"
              value={fixedFee}
              onChange={(e) => setFixedFee(Number(e.target.value))}
              className="border rounded px-3 py-1 w-24 text-center focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={manualProductId}
              onChange={(e) => setManualProductId(e.target.value)}
              placeholder="ID المنتج"
              className="border rounded px-3 py-1 w-40 text-center focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={applyCommissionToProducts}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              تطبيق عمولة منتج
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={manualCategoryId}
              onChange={(e) => setManualCategoryId(e.target.value)}
              placeholder="ID الفئة"
              className="border rounded px-3 py-1 w-40 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={applyCommissionToCategories}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              تطبيق عمولة فئة
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">الفئات</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.categoryId}
                onClick={() => toggleCategory(cat.categoryId)}
                className={`border rounded p-3 cursor-pointer transition-transform hover:scale-105 ${
                  selectedCategories.includes(cat.categoryId)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={cat.image || "https://via.placeholder.com/150"}
                  alt={cat.categoryName}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <div className="font-semibold text-center">{cat.categoryName}</div>
                <div className="text-sm text-gray-500 mt-1 text-center">
                  المنتجات: {cat.productsCount}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">المنتجات</h2>
          {loadingProducts && page === 1 ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-gray-200"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((prod) => (
                  <div
                    key={prod.productId}
                    onClick={() => toggleProduct(prod.productId)}
                    className={`border rounded p-3 cursor-pointer transition-transform hover:scale-105 ${
                      selectedProducts.includes(prod.productId)
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={prod.imageUrl || "https://via.placeholder.com/150"}
                      alt={prod.productName}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <div className="font-semibold text-center">{prod.productName}</div>
                    <div className="text-sm text-gray-500 mt-1 text-center">
                      السعر: {prod.sellingPrice} | الكمية: {prod.quantity}
                    </div>
                  </div>
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMoreProducts}
                    disabled={loadingProducts}
                    className="bg-green-600 text-white px-8 py-2 rounded hover:bg-green-700 transition disabled:opacity-60"
                  >
                    {loadingProducts ? "جاري التحميل..." : "تحميل المزيد"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommissionManager;
