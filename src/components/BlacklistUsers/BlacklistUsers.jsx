import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

const BlacklistUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, limit: 20 });
  const [threshold, setThreshold] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlacklist = async (page = 1, currentThreshold = threshold) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `https://products-api.cbc-apps.net/admin/dashboard/users/blacklist?page=${page}&threshold=${currentThreshold}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(res.data.users || []);
      setPagination(res.data.pagination || { page: 1, pages: 1, limit: 20 });
    } catch (err) {
      setError("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklist(1, threshold);
  }, [threshold]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchBlacklist(newPage, threshold);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <motion.h2
        className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FaExclamationTriangle className="text-red-500" />
        قائمة المستخدمين المحظورين
      </motion.h2>

      <div className="flex items-center gap-4 mb-6">
        <label className="text-gray-700 font-medium">حد الإلغاء الأدنى:</label>
        <input
          type="number"
          min="1"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-gray-600 focus:outline-none"
        />
        <button
          onClick={() => fetchBlacklist(1, threshold)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
        >
          تحديث
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center font-medium">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-500">لا توجد بيانات</div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto bg-white shadow-md rounded-2xl">
          <table className="w-full text-sm text-gray-700 border-collapse">
            <thead className="bg-gray-100 text-gray-800 text-left">
              <tr>
                <th className="px-6 py-3 border-b">#</th>
                <th className="px-6 py-3 border-b">الاسم</th>
                <th className="px-6 py-3 border-b">رقم الهاتف</th>
                <th className="px-6 py-3 border-b">عدد الطلبات الكلي</th>
                <th className="px-6 py-3 border-b">الطلبات الملغاة</th>
                <th className="px-6 py-3 border-b">إجمالي الإلغاء (د.ع)</th>
                <th className="px-6 py-3 border-b">نسبة الإلغاء</th>
                <th className="px-6 py-3 border-b">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => (
                <tr
                  key={item.user.id}
                  className="hover:bg-gray-50 transition-all duration-150 border-b"
                >
                  <td className="px-6 py-3">{index + 1 + (pagination.page - 1) * pagination.limit}</td>
                  <td className="px-6 py-3 font-medium">{item.user.name}</td>
                  <td className="px-6 py-3">{item.user.phone}</td>
                  <td className="px-6 py-3">{item.totalOrdersCount}</td>
                  <td className="px-6 py-3 text-red-600 font-semibold">{item.cancelledOrdersCount}</td>
                  <td className="px-6 py-3 text-red-500 font-semibold">{item.totalCancelledAmount.toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.cancellationRate >= 50 ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}>
                      {item.cancellationRate}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{new Date(item.user.createdAt).toLocaleDateString("ar-EG")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`px-4 py-2 rounded-lg ${pagination.page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-800 text-white hover:bg-gray-700"}`}
          >
            السابق
          </button>

          <span className="text-gray-700 font-medium">الصفحة {pagination.page} من {pagination.pages}</span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className={`px-4 py-2 rounded-lg ${pagination.page === pagination.pages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-800 text-white hover:bg-gray-700"}`}
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
};

export default BlacklistUsers;
