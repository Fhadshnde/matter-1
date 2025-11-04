import React,{useEffect, useState} from 'react'
import axios from 'axios'
const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  
  return (
    <div>Orders</div>
  )
}

export default Orders