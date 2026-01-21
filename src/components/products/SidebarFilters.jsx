"use client";

import { useProduct } from "@/hooks/ProductContext";
import FilterSection from './FilterSection';

export default function SidebarFilters() {
  const { filters, setFilters, facets } = useProduct();

  // Helper to toggle array-based filters
  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const current = prev[key] || [];
      const isSelected = current.includes(value);
      return {
        ...prev,
        [key]: isSelected
          ? current.filter(item => item !== value)
          : [...current, value]
      };
    });
  };

  const handlePriceChange = (e, index) => {
    const newVal = Number(e.target.value) || 0;
    setFilters(prev => {
      const newPrice = [...prev.price];
      newPrice[index] = newVal;
      // Ensure min <= max
      if (index === 0 && newVal > newPrice[1]) return prev;
      if (index === 1 && newVal < newPrice[0]) return prev;
      return { ...prev, price: newPrice };
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.occasion.length > 0 ||
    filters.color.length > 0 ||
    filters.size.length > 0 ||
    filters.price[0] !== 0 ||
    filters.price[1] !== 1000;

  return (
    <aside className="w-full bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={() => setFilters(prev => ({
              ...prev,
              categories: [],
              occasion: [],
              color: [],
              size: [],
              price: [0, 1000],
              search: ""
            }))}
            className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Categories */}
        {Object.keys(facets.categories).length > 0 && (
          <FilterSection title="Collection">
            {Object.entries(facets.categories).map(([name, count]) => (
              <FilterCheckbox
                key={name}
                label={name}
                count={count}
                checked={filters.categories.includes(name)}
                onChange={() => toggleFilter('categories', name)}
              />
            ))}
          </FilterSection>
        )}

        {/* Occasions */}
        {Object.keys(facets.occasions).length > 0 && (
          <FilterSection title="Occasion">
            {Object.entries(facets.occasions).map(([name, count]) => (
              <FilterCheckbox
                key={name}
                label={name}
                count={count}
                checked={filters.occasion.includes(name)}
                onChange={() => toggleFilter('occasion', name)}
              />
            ))}
          </FilterSection>
        )}

        {/* Colors */}
        {Object.keys(facets.colors).length > 0 && (
          <FilterSection title="Color">
            {Object.entries(facets.colors).map(([name, count]) => (
              <FilterCheckbox
                key={name}
                label={name}
                count={count}
                checked={filters.color.includes(name)}
                onChange={() => toggleFilter('color', name)}
              />
            ))}
          </FilterSection>
        )}

        {/* Sizes */}
        {Object.keys(facets.sizes).length > 0 && (
          <FilterSection title="Size">
            {Object.entries(facets.sizes).map(([name, count]) => (
              <FilterCheckbox
                key={name}
                label={name}
                count={count}
                checked={filters.size.includes(name)}
                onChange={() => toggleFilter('size', name)}
              />
            ))}
          </FilterSection>
        )}

        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="flex gap-3 flex-col">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Min Price: AED {filters.price[0]}</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.price[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Max Price: AED {filters.price[1]}</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.price[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}

/* 🔹 Reusable Checkbox */
function FilterCheckbox({ label, count, checked, onChange }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer group">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
          {label}
        </span>
      </div>
      <span className="text-xs text-gray-400">({count})</span>
    </label>
  );
}
