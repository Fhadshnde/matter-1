import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminShippingConfig() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [config, setConfig] = useState({
    isFree: false,
    fixedAmount: 0,
    costMode: "per_supplier",
    suppliersPerGroup: 1,
    lastUpdated: null
  });

  useEffect(() => {
    async function fetchConfig() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://products-api.cbc-apps.net/orders/admin/shipping-config`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res && res.data) {
          setConfig(prev => ({ ...prev, ...res.data }));
        }
      } catch {
        setError("فشل جلب الإعدادات");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setConfig(prev => ({ ...prev, [name]: checked }));
    } else if (name === "fixedAmount" || name === "suppliersPerGroup") {
      setConfig(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setConfig(prev => ({ ...prev, [name]: value }));
    }
  }

  async function save() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const payload = { costMode: config.costMode };

      if (config.costMode === "per_supplier_group") {
        payload.fixedAmount = config.fixedAmount;
        payload.suppliersPerGroup = config.suppliersPerGroup;
      }

      if (config.costMode === "per_order") {
        payload.isFree = config.isFree;
        if (!config.isFree) {
          payload.fixedAmount = config.fixedAmount;
        }
      }

      if (config.costMode === "per_supplier") {
        payload.fixedAmount = config.fixedAmount;
      }

      const res = await axios.patch(
        `https://products-api.cbc-apps.net/orders/admin/shipping-config`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res && res.data) {
        setConfig(prev => ({ ...prev, ...res.data }));
      }

      setSuccess("تم الحفظ بنجاح");
    } catch (e) {
      const message = e?.response?.data?.message || "فشل الحفظ";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-600">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold mb-4">إعدادات التوصيل</h2>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      <div className="bg-white shadow rounded p-6 space-y-4">
        <label className="flex items-center space-x-2 rtl:space-x-reverse">
          <input
            type="radio"
            name="costMode"
            value="per_supplier"
            checked={config.costMode === "per_supplier"}
            onChange={onChange}
            className="w-4 h-4"
          />
          <span>تكلفة لكل مورد (per_supplier)</span>
        </label>

        <label className="flex items-center space-x-2 rtl:space-x-reverse">
          <input
            type="radio"
            name="costMode"
            value="per_supplier_group"
            checked={config.costMode === "per_supplier_group"}
            onChange={onChange}
            className="w-4 h-4"
          />
          <span>تكلفة لكل مجموعة موردين (per_supplier_group)</span>
        </label>

        {config.costMode === "per_supplier_group" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="mb-1">المبلغ الثابت لكل مجموعة</span>
              <input
                type="number"
                name="fixedAmount"
                value={config.fixedAmount}
                onChange={onChange}
                className="border rounded p-2"
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1">عدد الموردين في كل مجموعة</span>
              <input
                type="number"
                name="suppliersPerGroup"
                min={1}
                value={config.suppliersPerGroup}
                onChange={onChange}
                className="border rounded p-2"
              />
            </label>
          </div>
        )}

        <label className="flex items-center space-x-2 rtl:space-x-reverse">
          <input
            type="radio"
            name="costMode"
            value="per_order"
            checked={config.costMode === "per_order"}
            onChange={onChange}
            className="w-4 h-4"
          />
          <span>تكلفة واحدة للطلب (per_order)</span>
        </label>

        {config.costMode === "per_order" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <label className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="checkbox"
                name="isFree"
                checked={!!config.isFree}
                onChange={onChange}
              />
              <span>تفعيل التوصيل المجاني</span>
            </label>

            {!config.isFree && (
              <label className="flex flex-col">
                <span className="mb-1">المبلغ الثابت للطلب</span>
                <input
                  type="number"
                  name="fixedAmount"
                  value={config.fixedAmount}
                  onChange={onChange}
                  className="border rounded p-2"
                />
              </label>
            )}
          </div>
        )}

        <div className="pt-4 border-t flex items-center justify-between">
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : "حفظ"}
          </button>

          <div className="text-sm text-gray-500">
            الوضع الحالي: <span className="font-medium">{config.costMode}</span>
          </div>
        </div>
      </div>

      {config.lastUpdated && (
        <div className="text-sm text-gray-500">
          آخر تحديث: {new Date(config.lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
}
