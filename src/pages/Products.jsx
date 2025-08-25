import React, { useState, useEffect, useMemo } from 'react';
import AddProductModal from '../components/addModals/product';
import EditProductModal from '../components/editModals/product';
import DeleteProductModal from '../components/deleteModal/deleteProduct';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchProduct, setSearchProduct] = useState("");
  const productsPerPage = 10;

  const fetchProducts = async () => {
    try {
      const response = await fetch(`https://products-api.cbc-apps.net/products?page=1&limit=1000&search=${searchProduct}`);
      const data = await response.json();
      if (data && data.products) {
        setProducts(data.products);
        setCurrentPage(1); // Reset page on new search
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchProduct]);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    return products.slice(start, end);
  }, [currentPage, products]);

  const visiblePages = useMemo(() => {
    const pages = [];
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 2) pages.push(1, 2, 3, '...', totalPages);
    else if (currentPage >= totalPages - 1) pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    else pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    return pages;
  }, [totalPages, currentPage]);

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`https://products-api.cbc-apps.net/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditSuccess = () => fetchProducts();

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="bg-[#1A1A1A]/80 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Products Management</h1>
          <AddProductModal />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pt-3">
        <input
          type="text"
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-[#94A3B8] focus:border-[#5E54F2] focus:outline-none"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map(product => (
          <div key={product.id} className="product-card relative bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden hover:border-[#5E54F2]/50 transition-all duration-300 ease-in-out">
            <div className="absolute right-4 top-4 w-6 h-6 cursor-pointer">
              <DeleteProductModal id={product.id} onDelete={() => handleDeleteProduct(product.id)} />
            </div>
            <div className="absolute left-4 top-4 w-6 h-6 cursor-pointer">
              <EditProductModal productId={product.id} onEditSuccess={handleEditSuccess} />
            </div>
            <div className="aspect-w-1 aspect-h-1 bg-gradient-to-br from-[#5E54F2]/20 to-[#7C3AED]/20 p-1">
              <img className="w-full object-cover h-60 rounded-md" src={product.mainImageUrl} alt={product.name} />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white mb-1">{product.name}</h3>
              <p className="text-sm text-[#94A3B8] mb-3">{product.category?.name}</p>
              <div className="flex flex-col gap-1 mb-3 my-3">
                <div>
                  <span className="text-3xl text-white">{product.displayPrice?.toLocaleString() || "N/A"} IQD</span>
                  {product.hasDiscount && (
                    <span className="text-xl line-through text-red-500 ml-2">{product.previousPrice?.toLocaleString()} IQD</span>
                  )}
                </div>
                {product.wholesalePrice && (
                  <div>
                    <span className="text-lg text-[#94A3B8]">سعر الجملة: {product.wholesalePrice.toLocaleString()} IQD</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-[#10B981] animate-pulse' : 'bg-red-500'}`}></div>
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-[#10B981]' : 'text-red-500'}`}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </div>
                <span className="text-xs text-[#94A3B8]"><span className="font-bold">{product.stock}</span> منتجات متبقية</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="px-3 py-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        {visiblePages.map((page, i) =>
          page === '...' ? (
            <span key={i} className="px-3 py-2 text-[#94A3B8] cursor-default">...</span>
          ) : (
            <button
              key={i}
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? "px-3 py-2 bg-[#5E54F2] text-white rounded-lg" : "px-3 py-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg"}
            >
              {page}
            </button>
          )
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className="px-3 py-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsManagement;
