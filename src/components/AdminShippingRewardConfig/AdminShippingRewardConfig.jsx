import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ShippingRewardConfig() {
  const token = localStorage.getItem("token");

  const [shipping, setShipping] = useState({ isFree: false, fixedAmount: 0 });
  const [reward, setReward] = useState({ percentage: 0, isEnabled: false });

  const [loadingShipping, setLoadingShipping] = useState(false);
  const [loadingReward, setLoadingReward] = useState(false);

  const [notCardHas, setNotCardHas] = useState("");

  const api = axios.create({
    baseURL: "https://products-api.cbc-apps.net",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const shipRes = await api.get("/orders/admin/shipping-config");
      const rewardRes = await api.get("/orders/admin/reward-config");
      setShipping(shipRes.data);
      setReward(rewardRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateShipping = async () => {
    try {
      setLoadingShipping(true);
      await api.patch("/orders/admin/shipping-config", shipping);
      setLoadingShipping(false);
    } catch (err) {
      setLoadingShipping(false);
      console.error(err);
    }
  };

  const updateReward = async () => {
    try {
      setLoadingReward(true);
      await api.patch("/orders/admin/reward-config", reward);
      setLoadingReward(false);
    } catch (err) {
      setLoadingReward(false);
      console.error(err);
    }
  };

  const sendNotCardHas = async () => {
    try {
      await api.patch("/cities/admin/not-card-has", {
        notCardHas: notCardHas,
      });
      alert("تم الإرسال بنجاح");
    } catch (err) {
      console.error(err);
      alert("حصل خطأ أثناء الإرسال");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col gap-8">

      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">إعدادات الشحن</h2>

        <div className="flex items-center gap-3 mb-4">
          <label className="font-semibold">الشحن مجاني؟</label>
          <input
            type="checkbox"
            checked={shipping.isFree}
            onChange={(e) => setShipping({ ...shipping, isFree: e.target.checked })}
          />
        </div>

        {!shipping.isFree && (
          <div className="mb-4">
            <label className="font-semibold">قيمة الشحن الثابتة</label>
            <input
              type="number"
              className="w-full mt-2 p-2 border rounded-lg"
              value={shipping.fixedAmount}
              onChange={(e) =>
                setShipping({ ...shipping, fixedAmount: Number(e.target.value) })
              }
            />
          </div>
        )}

        <button
          onClick={updateShipping}
          className="w-full mt-4 bg-blue-600 text-white p-3 rounded-xl text-lg hover:bg-blue-700"
        >
          {loadingShipping ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">notCardHas</h2>

        <label className="font-semibold">النص</label>
        <input
          type="text"
          className="w-full mt-2 p-2 border rounded-lg"
          value={notCardHas}
          onChange={(e) => setNotCardHas(e.target.value)}
        />

        <button
          onClick={sendNotCardHas}
          className="w-full mt-4 bg-purple-600 text-white p-3 rounded-xl text-lg hover:bg-purple-700"
        >
          إرسال
        </button>
      </div>

      {/* إعدادات المكافآت */}
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">إعدادات نقاط المكافأة</h2>

        <div className="flex items-center gap-3 mb-4">
          <label className="font-semibold">تفعيل المكافآت؟</label>
          <input
            type="checkbox"
            checked={reward.isEnabled}
            onChange={(e) => setReward({ ...reward, isEnabled: e.target.checked })}
          />
        </div>

        {reward.isEnabled && (
          <div className="mb-4">
            <label className="font-semibold">نسبة المكافأة (%)</label>
            <input
              type="number"
              className="w-full mt-2 p-2 border rounded-lg"
              value={reward.percentage}
              onChange={(e) =>
                setReward({ ...reward, percentage: Number(e.target.value) })
              }
            />
          </div>
        )}

        <button
          onClick={updateReward}
          className="w-full mt-4 bg-green-600 text-white p-3 rounded-xl text-lg hover:bg-green-700"
        >
          {loadingReward ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>
    </div>
  );
}
