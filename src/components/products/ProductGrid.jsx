"use client";

import { useSelector } from "react-redux";
import ProductCard from "../widgets/ProductCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import { useProduct } from "@/hooks/ProductContext";
import Pagination from "../ui/Pagination";

export default function ProductsGrid({ loading }) {
  const { filteredProducts } = useSelector((s) => s.products);
  const { filters, currentPage, setCurrentPage, itemsPerPage } = useProduct();

  if (loading) return <ProductSkeleton />;

  if (filteredProducts.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No products found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 if filters change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const gridColsClass = 
    filters.grid === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <>
      <div className={`grid gap-4 sm:gap-6 ${gridColsClass}`}>
        {paginatedProducts.map((p,i) => (
          <ProductCard key={p._id || i} product={p} />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
