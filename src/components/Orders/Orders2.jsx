import React, { useState } from "react";
import axios from "axios";

const ImportProductsWithImages = () => {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_EXCEL = "https://products-api.cbc-apps.net/admin/dashboard/products/import-excel";
  const API_IMAGES = "https://products-api.cbc-apps.net/admin/dashboard/products/upload-images-from-excel";
  const token = localStorage.getItem("userToken"); // توكن الأدمن

  // ثوابت
  const supplierId = 186;
  const categoryId = 238;
  const sectionId = 325;
  const stock = 1000;

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleImagesChange = (e) => setImages([...e.target.files]);

  const handleUpload = async () => {
    // ✅ تحقق من صحة البيانات قبل الرفع
    if (!file) {
      setMessage("يرجى اختيار ملف الإكسل أولاً");
      return;
    }
    if (!sectionId || !categoryId || !supplierId) {
      setMessage("القيم sectionId و categoryId و supplierId مطلوبة وصحيحة");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 1️⃣ رفع ملف الإكسل
      const formDataExcel = new FormData();
      formDataExcel.append("file", file);
      formDataExcel.append("sectionId", sectionId);
      formDataExcel.append("categoryId", categoryId);
      formDataExcel.append("supplierId", supplierId);
      formDataExcel.append("stock", stock);

      const resExcel = await axios.post(API_EXCEL, formDataExcel, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Excel Upload Response:", resExcel.data);

      const importSessionId = resExcel.data.importSessionId;
      if (!importSessionId) throw new Error("لم يتم استرجاع importSessionId من الإكسل");

      // 2️⃣ رفع الصور تلقائياً بعد رفع الإكسل
      if (images.length > 0) {
        const formDataImages = new FormData();
        images.forEach((img) => formDataImages.append("images", img));
        formDataImages.append("importSessionId", importSessionId);

        const resImages = await axios.post(API_IMAGES, formDataImages, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Images Upload Response:", resImages.data);
      }

      setMessage("✅ تم رفع المنتجات والصور بنجاح");
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      if (err.response?.status === 400) {
        setMessage("❌ خطأ في البيانات المرسلة: تحقق من ملف الإكسل والقيم المدخلة");
      } else {
        setMessage("❌ فشل رفع الملف أو الصور");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-lg mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">رفع منتجات + صور مع التحقق</h2>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="mb-4" />
      <input type="file" multiple onChange={handleImagesChange} className="mb-4" />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "جاري الرفع..." : "رفع الملف والصور"}
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ImportProductsWithImages;
