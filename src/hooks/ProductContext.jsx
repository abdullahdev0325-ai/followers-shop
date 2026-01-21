"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [filters, setFilters] = useState({
        categories: [],
        occasion: [],
        color: [],
        size: [],
        price: [0, 1000],
        sort: "recommended",
        search: ""
    });

    // Derived state for sidebar counts (facets)
    const [facets, setFacets] = useState({
        categories: {},
        occasions: {},
        colors: {},
        sizes: {}
    });

    useEffect(() => {
        let result = [...products];

        // 1. Filter by Category
        if (filters.categories.length > 0) {
            result = result.filter(p => filters.categories.includes(p.category));
        }

        // 2. Filter by Occasion
        if (filters.occasion.length > 0) {
            result = result.filter(p => filters.occasion.includes(p.occasion));
        }

        // 3. Filter by Color
        if (filters.color.length > 0) {
            result = result.filter(p => filters.color.includes(p.color));
        }

        // 4. Filter by Size
        if (filters.size.length > 0) {
            result = result.filter(p => filters.size.includes(p.size));
        }

        // 5. Filter by Price
        result = result.filter(p => {
            const price = p.price || 0;
            return price >= filters.price[0] && price <= filters.price[1];
        });

        // 6. Search
        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(p => p.title?.toLowerCase().includes(q) || p.name?.toLowerCase().includes(q));
        }

        // 7. Sort
        if (filters.sort === "lowToHigh") {
            result.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (filters.sort === "highToLow") {
            result.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (filters.sort === "AtoZ") {
            result.sort((a, b) => (a.title || a.name || "").localeCompare(b.title || b.name || ""));
        } else if (filters.sort === "ZtoA") {
            result.sort((a, b) => (b.title || b.name || "").localeCompare(a.title || a.name || ""));
        }

        setFilteredProducts(result);
    }, [products, filters]);

    // Calculate Facets (counts) based on *original* products to show available options
    useEffect(() => {
        const newFacets = {
            categories: {},
            occasions: {},
            colors: {},
            sizes: {}
        };

        products.forEach(p => {
            // Category
            if (p.category) newFacets.categories[p.category] = (newFacets.categories[p.category] || 0) + 1;
            // Occasion
            if (p.occasion) newFacets.occasions[p.occasion] = (newFacets.occasions[p.occasion] || 0) + 1;
            // Color
            if (p.color) newFacets.colors[p.color] = (newFacets.colors[p.color] || 0) + 1;
            // Size
            if (p.size) newFacets.sizes[p.size] = (newFacets.sizes[p.size] || 0) + 1;
        });

        setFacets(newFacets);
    }, [products]);

    return (
        <ProductContext.Provider
            value={{
                products,
                setProducts,
                filteredProducts,
                setFilteredProducts,
                filters,
                setFilters,
                facets,
                currentPage,
                setCurrentPage,
                itemsPerPage,
                setItemsPerPage
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
