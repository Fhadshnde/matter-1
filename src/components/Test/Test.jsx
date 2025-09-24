import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_CONFIG, { apiCall } from '../../config/api';


const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchInvoices();
    fetchSuppliers();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://your-api.com/invoices');
      setInvoices(res.data || []);
    } catch (err) {
      setError('فشل تحميل الفواتير');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
        // إذا الـ API يدعم limit=all أو page size كبير
        const data = await apiCall(`${API_CONFIG.ADMIN.SUPPLIERS}?limit=10000`);
        
        const transformedSuppliers = (data.suppliers || []).map((supplier, index) => ({
            supplierId: supplier.id,
            supplierName: supplier.name || 'مورد بدون اسم',
            contactInfo: supplier.contactInfo,
            phone: supplier.phone,
            key: supplier.id || index
        }));
        setSuppliers(transformedSuppliers);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        setSuppliers([]);
    }
};

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!selectedSupplier || !amount) {
      alert('الرجاء اختيار المورد وكتابة المبلغ');
      return;
    }

    try {
      const res = await axios.post('https://your-api.com/invoices', {
        supplierId: selectedSupplier,
        amount: amount,
      });
      setInvoices([...invoices, res.data]);
      setOpenModal(false);
      setSelectedSupplier('');
      setAmount('');
    } catch (err) {
      alert('فشل إنشاء الفاتورة');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📄 الفواتير</h2>
        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + إنشاء فاتورة
        </button>
      </div>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : invoices.length === 0 ? (
        <p>لا توجد فواتير حالياً</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">المورد</th>
              <th className="p-3 border">المبلغ</th>
              <th className="p-3 border">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, index) => (
              <tr key={inv.id || index} className="hover:bg-gray-50">
                <td className="p-3 border">{index + 1}</td>
                <td className="p-3 border">{inv.supplierName || '---'}</td>
                <td className="p-3 border">{inv.amount}</td>
                <td className="p-3 border">
                  {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '---'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">إنشاء فاتورة جديدة</h3>
            <form onSubmit={handleCreateInvoice}>
              <div className="mb-4">
                <label className="block mb-1">اختر المورد</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">-- اختر المورد --</option>
                  {suppliers.map((s) => (
  <option key={s.key} value={s.supplierId}>
    {s.supplierName}
  </option>
))}

                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1">المبلغ</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="اكتب المبلغ"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
