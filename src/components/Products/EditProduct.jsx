import React,{useState,useEffect} from 'react'
import axios from 'axios'
const Products = () => {
    const [product,setProduct]=useState([])
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    const [cardsData,setCardsData]=useState([])
    const [pagination,setPagination]=useState({page:1,limit:10,total:0})
    const baseUrl = 'https://products-api.cbc-apps.net';
    const token = localStorage.getItem('userToken');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    useEffect(() => {
        const fetchProduct = async (page = 1, limit = 10) => {
            setLoading(true);
            try {
                const res = await axios.get(`${baseUrl}/products?page=${page}&limit=${limit}`, { headers });
                const data = await res.json();
                setProduct(data.products);
                setCardsData(data.cards);
                setPagination(data.pagination);
                setLoading(false);
                console.log(res);

                
            } catch (error) {
                setError(error.message);
            }
        }

    })
  return (
    <div className='bg-white rounded-lg shadow-lg p-5 mt-5'>
        <div children='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold'>Products</h2>
            <div className='bg-white'>
                <div className='bg-white shadow-lg p-4 rounded-md'>
                    <h3 className='text-lg font-semibold mb-2'>Total Products</h3>
                    <p>{cardsData.abandonedProducts}</p>
                </div>
                <div className='bg-white shadow-lg p-4 rounded-md mt-4'>
                    <h3 className='text-lg font-semibold mb-2'>Active Products</h3>
                    <p>{cardsData.outOfStockProducts}</p>
                </div>
                <div className='bg-white shadow-lg p-4 rounded-md mt-4'>
                    <h3 className='text-lg font-semibold mb-2'>Draft Products</h3>
                    <p>{cardsData.lowInventoryProducts}</p>
                </div>
                <div className='bg-white shadow-lg p-4 rounded-md mt-4'>
                    <h3 className='text-lg font-semibold mb-2'>Draft Products</h3>
                    <p>{cardsData.totalProducts}</p>
                </div>

            </div>

        </div>
    </div>
  )
}

export default Products