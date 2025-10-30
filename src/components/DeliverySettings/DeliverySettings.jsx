import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliverySettings = () => {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nameArabic: "",
    nameEnglish: "",
    shippingCost: "",
    isActive: true,
  });
  const [deliveryNote, setDeliveryNote] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const token = localStorage.getItem("token");
  const api = "https://products-api.cbc-apps.net/cities";
  const noteApi = "https://products-api.cbc-apps.net/cities/admin/delivery-note";
  const messageApi = "https://products-api.cbc-apps.net/cities/admin/success-message";

  // Function to fetch the list of cities, the delivery note, and the success message
  const fetchCities = async () => {
    try {
      const res = await axios.get(api);
      const data = res.data;

      // FIX for "cities.map is not a function": The array is nested under the 'cities' key.
      if (data && Array.isArray(data.cities)) {
        setCities(data.cities);
      } else {
        setCities([]);
      }

      // FIX for delivery note: The note is nested under the 'deliveryNote' key.
      if (data && typeof data.deliveryNote === 'string') {
        setDeliveryNote(data.deliveryNote);
      }
      
      // NEW: Fetch success message. Assuming it's nested under the 'successMessage' key.
      if (data && typeof data.successMessage === 'string') {
        setSuccessMessage(data.successMessage);
      }
      
    } catch (err) {
      console.error("Error fetching cities, note, and message:", err);
      setCities([]);
    }
  };

  // Function to update the delivery note
  const updateDeliveryNote = async () => {
    if (!token) {
      alert("لم يتم العثور على التوكن في LocalStorage");
      return;
    }
    setNoteLoading(true);
    try {
      await axios.patch(
        noteApi,
        {
          note: deliveryNote,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("تم حفظ ملاحظة التوصيل بنجاح!");
    } catch (err) {
      console.error("Error updating delivery note:", err);
      alert("حدث خطأ أثناء حفظ ملاحظة التوصيل");
    } finally {
      setNoteLoading(false);
    }
  };

  // NEW: Function to update the success message
  const updateSuccessMessage = async () => {
    if (!token) {
      alert("لم يتم العثور على التوكن في LocalStorage");
      return;
    }
    setMessageLoading(true);
    try {
      await axios.patch(
        messageApi,
        {
          successMessage: successMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("تم حفظ رسالة النجاح بنجاح!");
    } catch (err) {
      console.error("Error updating success message:", err);
      alert("حدث خطأ أثناء حفظ رسالة النجاح");
    } finally {
      setMessageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNoteChange = (e) => {
    setDeliveryNote(e.target.value);
  };
  
  // NEW: Handle change for the success message
  const handleMessageChange = (e) => {
    setSuccessMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("لم يتم العثور على التوكن في LocalStorage");
      return;
    }
    setLoading(true);
    try {
      if (form.id) {
        await axios.put(
          `${api}/${form.id}`,
          {
            nameArabic: form.nameArabic,
            nameEnglish: form.nameEnglish,
            shippingCost: Number(form.shippingCost),
            isActive: form.isActive,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          api,
          {
            nameArabic: form.nameArabic,
            nameEnglish: form.nameEnglish,
            shippingCost: Number(form.shippingCost),
            isActive: form.isActive,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setForm({ id: null, nameArabic: "", nameEnglish: "", shippingCost: "", isActive: true });
      fetchCities();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (city) => {
    setForm({
      id: city.id,
      nameArabic: city.nameArabic.trim(),
      nameEnglish: city.nameEnglish.trim(),
      shippingCost: city.shippingCost,
      isActive: city.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!token) {
      alert("لم يتم العثور على التوكن في LocalStorage");
      return;
    }
    if (!window.confirm("هل أنت متأكد من حذف المحافظة؟")) return;
    try {
      await axios.delete(`${api}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCities();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Delivery Note Section */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="mb-6 text-right">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ملاحظة التوصيل العامة</h2>
            <p className="text-gray-600">يمكن استخدام هذه الملاحظة لعرض عروض التوصيل الخاصة.</p>
          </div>
          <div className="flex flex-col space-y-4">
            <textarea
              name="deliveryNote"
              value={deliveryNote}
              onChange={handleNoteChange}
              rows="3"
              className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
              placeholder="اكتب ملاحظة التوصيل هنا..."
            />
            <div className="text-left">
              <button
                onClick={updateDeliveryNote}
                disabled={noteLoading}
                className={`px-8 py-3 rounded-xl text-white font-semibold shadow-md ${
                  noteLoading
                    ? "bg-gray-400"
                    : "bg-green-600 hover:bg-green-700 transition-transform transform hover:scale-105"
                }`}
              >
                {noteLoading ? "جارٍ الحفظ..." : "حفظ الملاحظة"}
              </button>
            </div>
          </div>
        </div>
        {/* End Delivery Note Section */}

        {/* Success Message Section (NEW) */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="mb-6 text-right">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">رسالة نجاح الطلب</h2>
            <p className="text-gray-600">تظهر هذه الرسالة للعميل بعد إتمام عملية الشراء بنجاح.</p>
          </div>
          <div className="flex flex-col space-y-4">
            <textarea
              name="successMessage"
              value={successMessage}
              onChange={handleMessageChange}
              rows="3"
              className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
              placeholder="اكتب رسالة النجاح هنا..."
            />
            <div className="text-left">
              <button
                onClick={updateSuccessMessage}
                disabled={messageLoading}
                className={`px-8 py-3 rounded-xl text-white font-semibold shadow-md ${
                  messageLoading
                    ? "bg-gray-400"
                    : "bg-purple-600 hover:bg-purple-700 transition-transform transform hover:scale-105"
                }`}
              >
                {messageLoading ? "جارٍ الحفظ..." : "حفظ الرسالة"}
              </button>
            </div>
          </div>
        </div>
        {/* End Success Message Section */}

        {/* City Management Section */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="mb-8 text-right">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">إعدادات المحافظات</h1>
            <p className="text-gray-600">إدارة مناطق التوصيل وتكاليف الشحن.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">اسم المحافظة بالعربية</label>
              <input
                type="text"
                name="nameArabic"
                value={form.nameArabic}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                placeholder="مثلاً: بغداد"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">اسم المحافظة بالإنجليزية</label>
              <input
                type="text"
                name="nameEnglish"
                value={form.nameEnglish}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                placeholder="مثلاً: Baghdad"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">تكلفة التوصيل</label>
              <input
                type="number"
                name="shippingCost"
                value={form.shippingCost}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                placeholder="5000"
              />
            </div>

            <div className="flex items-center mt-8 space-x-3">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="w-5 h-5 rounded-md border-gray-300 focus:ring-indigo-500"
              />
              <label className="text-gray-700">نشط</label>
            </div>

            <div className="md:col-span-2 text-left">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-xl text-white font-semibold shadow-md ${
                  loading
                    ? "bg-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700 transition-transform transform hover:scale-105"
                }`}
              >
                {loading ? "جارٍ الحفظ..." : form.id ? "تحديث المحافظة" : "إضافة المحافظة"}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={() =>
                    setForm({ id: null, nameArabic: "", nameEnglish: "", shippingCost: "", isActive: true })
                  }
                  className="ml-3 px-6 py-3 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>
          </form>
        </div>
        {/* End City Management Section */}

        {/* Cities List Section */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">قائمة المحافظات</h2>
            <span className="text-gray-500 text-sm">
              عدد المحافظات: {cities.length}
            </span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="min-w-full text-right text-gray-800">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="py-3 px-4 border-b">#</th>
                  <th className="py-3 px-4 border-b">المحافظة</th>
                  <th className="py-3 px-4 border-b">الإنجليزية</th>
                  <th className="py-3 px-4 border-b">تكلفة التوصيل</th>
                  <th className="py-3 px-4 border-b">نشط</th>
                  <th className="py-3 px-4 border-b">تحكم</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {cities.map((city, index) => (
                  <tr
                    key={city.id}
                    className="hover:bg-gray-50 border-b transition"
                  >
                    <td className="py-3 px-4 border-b">{index + 1}</td>
                    <td className="py-3 px-4 border-b font-medium">{city.nameArabic}</td>
                    <td className="py-3 px-4 border-b">{city.nameEnglish}</td>
                    <td className="py-3 px-4 border-b">{city.shippingCost}</td>
                    <td className="py-3 px-4 border-b">
                      {city.isActive ? (
                        <span className="text-green-600 font-semibold">نشط</span>
                      ) : (
                        <span className="text-red-500 font-semibold">غير نشط</span>
                      )}
                    </td>
                    <td className="py-3 px-4 border-b flex space-x-2 justify-center">
                      <button
                        onClick={() => handleEdit(city)}
                        className="bg-blue-500 ml-3 hover:bg-blue-600 text-white px-4 py-1 rounded-lg transition"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(city.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg transition"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
                {cities.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center text-gray-500 py-6 text-base"
                    >
                      لا توجد محافظات حالياً
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* End Cities List Section */}
      </div>
    </div>
  );
};

export default DeliverySettings;