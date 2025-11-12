import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const BestUsersTable = () => {
  const [bestUsers, setBestUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBestUsers = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`https://products-api.cbc-apps.net/admin/dashboard/users/best?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBestUsers(res.data.users || []);
      setPagination(res.data.pagination || null);
    } catch (error) {
      setError('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestUsers(currentPage);
  }, [currentPage]);

  const goToNextPage = () => {
    if (pagination && currentPage < pagination.pages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <motion.h2 
        className="text-3xl font-bold text-center mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        أفضل المستخدمين
      </motion.h2>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-red-500 text-white">
            <tr>
              <th className="py-3 px-4 text-center font-semibold">#</th>
              <th className="py-3 px-4 text-center font-semibold">الاسم</th>
              <th className="py-3 px-4 text-center font-semibold">رقم الهاتف</th>
              <th className="py-3 px-4 text-center font-semibold">عدد الطلبات</th>
              <th className="py-3 px-4 text-center font-semibold">إجمالي الإنفاق</th>
              <th className="py-3 px-4 text-center font-semibold">متوسط الطلب</th>
              <th className="py-3 px-4 text-center font-semibold">تاريخ التسجيل</th>
              <th className="py-3 px-4 text-center font-semibold">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {bestUsers.map((item, index) => (
              <motion.tr 
                key={item.user.id || index}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="py-4 px-4 text-center text-gray-700">
                  <div className="flex flex-col items-center">
                    <span className="text-base font-semibold">{index + 1 + (currentPage - 1) * (pagination?.limit || 0)}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-gray-800">{item.user.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  <div className="flex flex-col items-center">
                    <span>{item.user.phone}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  <div className="flex flex-col items-center">
                    <span>{item.completedOrdersCount}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  <div className="flex flex-col items-center">
                    <span>{item.totalSpent.toLocaleString()} د.ع</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  <div className="flex flex-col items-center">
                    <span>{item.averageOrderValue.toLocaleString()} د.ع</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  <div className="flex flex-col items-center">
                    <span>{new Date(item.user.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.user.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            <FaChevronLeft /> السابق
          </button>
          <span className="text-gray-700 font-medium">
            الصفحة {pagination.page} من {pagination.pages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pagination && currentPage === pagination.pages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${pagination && currentPage === pagination.pages ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            التالي <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default BestUsersTable;
