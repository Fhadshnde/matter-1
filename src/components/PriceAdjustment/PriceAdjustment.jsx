import React,{useState,useEffect} from 'react'
import axios from 'axios';

const PriceAdjustment = () => {
    const [priceAdjustments, setPriceAdjustments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, limit: 60 });
    
    const fetchPriceAdjustments = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
          const res = await axios.get(
            `https://products-api.cbc-apps.net/admin/dashboard/categories/price-adjustment?page=${page}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setPriceAdjustments(res.data.categories || []);
          setPagination(res.data.pagination || { page: 1, pages: 1, limit: 20 });
        } catch (err) {
          setError("حدث خطأ أثناء تحميل البيانات");
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
        fetchPriceAdjustments();
    }, []);

    return (
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <h1>PriceAdjustment</h1>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="w-full border-collapse">
            
            {/* ------ THEAD ------ */}
            <thead className="bg-red-500 text-white">
              <tr>
                <th className="py-3 px-4 text-center font-semibold">Category Name</th>
                <th className="py-3 px-4 text-center font-semibold">Price Adjustment %</th>
              </tr>
            </thead>

            {/* ------ TBODY ------ */}
            <tbody>
              {priceAdjustments.map((adjustment) => (
                <tr key={adjustment.categoryId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-center">{adjustment.categoryName}</td>
                  <td className="py-3 px-4 text-center">{adjustment.priceAdjustmentPercentage}%</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    );
}

export default PriceAdjustment;
