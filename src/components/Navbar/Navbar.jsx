import React, { useState } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  LayoutDashboard,
  BarChart2,
  Package,
  ShoppingCart,
  Store,
  Wallet,
  Tag,
  Truck,
  History,
  ClipboardList,
  Inbox,
  Plus,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const menuItems = [
    { path: "/", icon: <LayoutDashboard className="w-4 h-4" />, text: "نظرة عامة" },
    { path: "/analytics", icon: <BarChart2 className="w-4 h-4" />, text: "التحليلات" },
    { path: "/products", icon: <Package className="w-4 h-4" />, text: "المنتجات" },
    { path: "/orders", icon: <ShoppingCart className="w-4 h-4" />, text: "الطلبات" },
    { path: "/merchants", icon: <Store className="w-4 h-4" />, text: "التجار" },
    { path: "/customers", icon: <Globe className="w-4 h-4" />, text: "الزبائن" },
    { path: "/profits", icon: <Wallet className="w-4 h-4" />, text: "الارباح" },
    { path: "/offers-dashboard", icon: <Tag className="w-4 h-4" />, text: "العروض والخصومات" },
    { path: "/notifications", icon: <Bell className="w-4 h-4" />, text: "التنبيهات" },
    // { path: "/shipping", icon: <Truck className="w-4 h-4" />, text: "الشحن والتوصيل" },
    // { path: "/history", icon: <History className="w-4 h-4" />, text: "تاريخ" },
    { path: "/settings", icon: <Tag className="w-4 h-4" />, text: "الإعدادات" },
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200" dir="rtl">
      {/* الصف العلوي */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* الجانب الأيمن - الشعار */}
        <div>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold text-lg tracking-wider">
            CBC
          </div>
        </div>

        {/* الوسط - البحث وزر الإنشاء */}
        <div className="flex items-center gap-4 flex-1 max-w-2xl mx-8">
          <button className="flex items-center gap-2 bg-red-500 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm hover:bg-red-600 transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" />
            <span>إنشاء سريع</span>
          </button>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="إبحث عن طلبات، منتجات، تجار، زبائن..."
              className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* الجانب الأيسر - معلومات المستخدم + الجرس + اللغة */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center gap-2 focus:outline-none"
            >
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileMenuOpen ? "rotate-180" : "rotate-0"}`} />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">محمد صالح</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-yellow-500">👋</span>
                  <span className="text-xs text-gray-500">أهلاً</span>
                </div>
              </div>
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User Avatar"
                />
                <span className="absolute -bottom-0.5 -left-0.5 block w-3.5 h-3.5 bg-green-400 rounded-full ring-2 ring-white"></span>
              </div>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg">الملف الشخصي</Link>
                <Link to="/profile-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">إعدادات الحساب</Link>
                <hr className="my-1" />
                <Link to="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg">تسجيل الخروج</Link>
              </div>
            )}
          </div>

          <Link to="/notifications-page">
            <div className="relative">
              <Inbox className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              <span className="absolute -top-1 -right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          </Link>

          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">EN</span>
          </div>
        </div>
      </div>

      {/* الصف السفلي - قائمة التنقل */}
      <div className="flex items-center gap-1 px-6 py-2 overflow-x-auto scrollbar-hide bg-gray-50/50">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center gap-2 py-2 px-3 text-gray-600 hover:text-red-500 hover:bg-white rounded-lg transition-all duration-200 whitespace-nowrap text-sm font-medium"
          >
            {item.icon}
            <span>{item.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
