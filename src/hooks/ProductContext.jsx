"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [facets, setFacets] = useState({
    categories: {},
    occasions: {},
    colors: {},
    sizes: {},
  });

  const [filters, setFilters] = useState({
    category: "",
    occasion: "",
    color: "",
    size: "",
    search: "",
    price: [0, 1000],
    sort: "recommended",
    page: 1,
    limit: 24,
  });

  const fetchProducts = async () => {
    setLoading(true);

    const params = new URLSearchParams({
      category: filters.category,
      occasion: filters.occasion,
      color: filters.color,
      size: filters.size,
      search: filters.search,
      minPrice: filters.price[0],
      maxPrice: filters.price[1],
      sort: filters.sort,
      page: filters.page,
      limit: filters.limit,
    });

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    if (data.success) {
      setProducts(data.data);
      if (data.facets) {
        setFacets(data.facets);
      }
    }

    setLoading(false);
  };

  // 🔥 filters change → backend call
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        filters,
        setFilters,
        facets,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
