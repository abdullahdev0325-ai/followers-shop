"use client";

import { useEffect, useState } from "react";
import FilterSidebar from "./SidebarFilters";
import TopBar from "./ProductHeader";
import ProductsGrid from "./ProductGrid";
import { callPublicApi } from "@/services/callApis";
import { useProduct } from "@/hooks/ProductContext";
import Pagination from "../ui/Pagination";

function ProductPageContent() {
  const { setProducts, setFilteredProducts, setCurrentPage } = useProduct();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await callPublicApi("/products?limit=1000", "GET");
        console.log("res",res);
        
        if (res.success && res.data) {
          setProducts(res.data);
          setFilteredProducts(res.data);
          setCurrentPage(1); // Reset to page 1 on new data
        } else {
          setError("Failed to load products");
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error loading products");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [setProducts, setFilteredProducts, setCurrentPage]);

  if (error && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold">{error}</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 sm:gap-6 lg:gap-8 my-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:block w-80 shrink-0">
        <FilterSidebar />
      </div>
      
      {/* Main content */}
      <section className="flex-1 min-w-0">
        <TopBar />
        <ProductsGrid loading={loading} />
        <Pagination />
      </section>
    </div>
  );
}


export default ProductPageContent