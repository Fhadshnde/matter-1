import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login'
import Offers from './pages/Offers'
import SubSections from './pages/SubSections'
import Suppliers from './pages/Suppliers'
import Discounts from './pages/Discounts'

const App = () => {
  return (
    <div>
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/login' element={<Login />} />
        <Route path='/offers' element={<Offers />} />
        <Route path='/discounts' element={<Discounts />} />

        <Route path='/subsections' element={<SubSections />} />
        <Route path='/suppliers' element={<Suppliers />} />
        
        {/* Catch-all route for undefined paths */}
        <Route path='*' element={<h1>mwdwdjwedjwd</h1>} />

      </Routes>
    </div>
  )
}

export default App
