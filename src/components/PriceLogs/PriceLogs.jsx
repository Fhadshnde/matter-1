import React,{useEffect, useState} from 'react'
import axios from 'axios';
const PriceLogs = () => {
    const [priceLogs, setPriceLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, limit: 20 });

    const fetchPriceLogs = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
          const res = await axios.get(
            `https://products-api.cbc-apps.net/admin/dashboard/products/price-logs?page=${page}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setPriceLogs(res.data.logs || []);
          setPagination(res.data.pagination || { page: 1, pages: 1, limit: 20 });
        } catch (err) {
          setError("حدث خطأ أثناء تحميل البيانات");
        } finally {
          setLoading(false);
        }
      
    }

    useEffect(() => {
        fetchPriceLogs(1);
    }, []);
  return (
    <div className='min-h-screen bg-gray-100 p-6 font-cairo'>
        <h2 className='text-2xl font-bold mb-6 text-gray-800'>سجلات تغير الأسعار</h2>
        {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-lg">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className='bg-red-500'>
                <th className="py-2 px-4 border-b border-gray-600 text-right">معرف المنتج</th>
                <th className="py-2 px-4 border-b border-gray-600 text-right">اسم المنتج</th>
                <th className="py-2 px-4 border-b border-gray-600 text-right">اسم التاجر</th>
                <th className="py-2 px-4 border-b border-gray-600 text-right">السعر القديم</th>
                <th className="py-2 px-4 border-b border-gray-600 text-right">السعر الجديد</th>
                <th className="py-2 px-4 border-b border-gray-600 text-right">تاريخ التغيير</th>
              </tr>
            </thead>
            <tbody>
              {priceLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-2 px-4 border-b border-gray-300">{log.productId}</td>
                    <td className="py-2 px-4 border-b border-gray-300">{log.product.name}</td>
                    <td className="py-2 px-4 border-b border-gray-300">{log.supplier.name}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{log.oldOriginalPrice}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{log.newOriginalPrice}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{new Date(log.changedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => fetchPriceLogs(pagination.page - 1)}
          disabled={pagination.page <= 1 || loading}
          className={`px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all ${
            pagination.page <= 1 || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          السابق
        </button>
        <span>
          الصفحة {pagination.page} من {pagination.pages}
        </span>
        <button
          onClick={() => fetchPriceLogs(pagination.page + 1)}
          disabled={pagination.page >= pagination.pages || loading}
          className={`px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all ${
            pagination.page >= pagination.pages || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          التالي
        </button>
      </div>
    </div>
  )
}

export default PriceLogs