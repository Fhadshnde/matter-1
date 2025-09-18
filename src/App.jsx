import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/HomePage/HomePage';
import Analytics from './components/Analytics/Analytics';
import CustomerBehavior from './components/Analytics/CustomerBehavior';
import UserDetailsPage from './components/Customers/UserDetailsPage';
import Sales from './components/Analytics/Sales';
import Products from './pages/Products';
import AddProduct from './components/Products/AddProduct';
import EditProduct from './components/Products/EditProduct';
import Customers from './components/Customers/Customers';
import NotificationsDashboard from './components/NotificationsDashboard/NotificationsDashboard';
import EmployeeManagement from './components/Merchants/EmployeeManagement';
import Profits from './components/Profits/Profits';
import Settings from './components/Settings/Settings';
import Powers from './components/Settings/Powers';
import Orders from './components/Orders/Orders';
import Suppliers from './components/Suppliers/Suppliers';
import Sections from './components/Sections/Sections';
import Categories from './components/Categories/Categories';
import NotificationsPage from './components/NotificationsDashboard/NotificationsPage';
import ProfileSettingsPage from './components/Settings/ProfileSettingsPage';
import Login from './components/Login/Login';
import Register from './components/Login/Register';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ إضافة حالة انتظار
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken'); 
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false); // ✅ بعد الفحص نوقف الانتظار
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken'); 
    setIsLoggedIn(false);
    navigate('/login');
  };


  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>; 
  }

  return (
    <div dir="rtl" className="App">
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        {!isLoggedIn && <Route path="/*" element={<Navigate to="/login" replace />} />}
        {isLoggedIn && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/customer-behavior" element={<CustomerBehavior />} />
            <Route path="/customers/:id" element={<UserDetailsPage />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/products" element={<Products />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/notifications" element={<NotificationsDashboard />} />
            <Route path="/notifications-page" element={<NotificationsPage />} />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="/profits" element={<Profits />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile-settings" element={<ProfileSettingsPage />} />
            <Route path="/powers" element={<Powers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/sections" element={<Sections />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
