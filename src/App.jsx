import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/HomePage/HomePage';
import Analytics from './components/Analytics/Analytics';
import CustomerBehavior from './components/Analytics/CustomerBehavior';
import Sales from './components/Analytics/Sales';
import Products from './pages/Products';
import AddProduct from './components/Products/AddProduct';
import EditProduct from './components/Products/EditProduct';
import Customers from './components/Customers/Customers';
import OffersDashboard from './components/OffersDashboard/OffersDashboard';
import NotificationsDashboard from './components/NotificationsDashboard/NotificationsDashboard';
import MerchantDetails from './components/Merchants/MerchantDetails';
import MerchantsDashboard from './components/Merchants/MerchantsDashboard';
import EmployeeManagement from './components/Merchants/EmployeeManagement';
import Profits from './components/Profits/Profits';
import Settings from './components/Settings/Settings';
import Powers from './components/Settings/Powers';
import Orders from './components/Orders/Orders';
import NotificationsPage from './components/NotificationsDashboard/NotificationsPage';
import ProfileSettingsPage from './components/Settings/ProfileSettingsPage';
import Login from './components/Login/Login';
import Register from './components/Login/Register';

const App = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleSelectMerchant = (id) => navigate(`/merchants/${id}`);
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Routes>
        {!isAuthenticated && (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {isAuthenticated && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/customer-behavior" element={<CustomerBehavior />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/products" element={<Products />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/notifications" element={<NotificationsDashboard />} />
            <Route path="/notifications-page" element={<NotificationsPage />} />
            <Route path="/offers-dashboard" element={<OffersDashboard />} />
            <Route path="/merchants" element={<MerchantsDashboard onSelectMerchant={handleSelectMerchant} />} />
            <Route path="/merchants/:id" element={<MerchantDetails />} />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="/profits" element={<Profits />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile-settings" element={<ProfileSettingsPage />} />
            <Route path="/powers" element={<Powers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
