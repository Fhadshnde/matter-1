import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Home from './components/HomePage/HomePage'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Analytics from './components/Analytics/Analytics'
import CustomerBehavior from './components/Analytics/CustomerBehavior'
import Sales from './components/Analytics/Sales'
import Products from './components/Products/Products'
import Customers from './components/Customers/Customers'
import OffersDashboard from './components/OffersDashboard/OffersDashboard'
import NotificationsDashboard from './components/NotificationsDashboard/NotificationsDashboard'
import MerchantDetails from './components/Merchants/MerchantDetails'
import MerchantsDashboard from './components/Merchants/MerchantsDashboard'
import EmployeeManagement from './components/Merchants/EmployeeManagement'
import Profits from './components/Profits/Profits'
import Settings from './components/Settings/Settings'
import Powers from './components/Settings/Powers'
import Orders from './components/Orders/Orders'
import NotificationsPage from './components/NotificationsDashboard/NotificationsPage'
import ProfileSettingsPage from './components/Settings/ProfileSettingsPage'
const App = () => {
  const navigate = useNavigate();

  const handleSelectMerchant = (id) => {
    navigate(`/merchants/${id}`);
  };

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path='/customer-behavior' element={<CustomerBehavior />} />
        <Route path='/sales' element={<Sales />} />
        <Route path='/products' element={<Products />} />
        <Route path='/customers' element={<Customers />} />
        <Route path='/notifications' element={<NotificationsDashboard />} />
        <Route path='/notifications-page' element={<NotificationsPage />} />
        <Route path='/offers-dashboard' element={<OffersDashboard />} />
        <Route path='/merchants' element={<MerchantsDashboard onSelectMerchant={handleSelectMerchant} />} />
        <Route path='/merchants/:id' element={<MerchantDetails />} />
        <Route path='/employees' element={<EmployeeManagement />} />
        <Route path='/profits' element={<Profits />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/profile-settings' element={<ProfileSettingsPage />} />
        <Route path='/powers' element={<Powers />} />
        <Route path='/orders' element={<Orders />} />
      </Routes>
    </div>
  )
}

export default App;