"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import ProductForm from "./AdminprodutForm";
import Image from "next/image";
import { callPrivateApi } from "@/services/callApis";
import { useAuth } from "@/hooks/authContext";
import Pagination from "../ui/Pagination";
import DashboardLoading from "@/app/admin/loading";

const PAGE_SIZE = 6;

export default function AdminProductPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page = 1, searchTerm = search) => {
    try {
      setLoading(true);
      const query = `?page=${page}&limit=${PAGE_SIZE}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`;
      const res = await callPrivateApi(`/products${query}`, "GET", null, token);

      setProducts(res.data || []);
      setCurrentPage(res.pagination?.page || page);
      setTotal(res.pagination?.total ?? (res.data || []).length);
      setTotalPages(res.pagination?.totalPages || Math.ceil((res.pagination?.total || (res.data || []).length) / PAGE_SIZE));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When search changes, fetch from page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(1, search);
    }, 300); // small debounce
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await callPrivateApi(`/products/${id}`, "DELETE", null, token);
      toast.success(res.message || "Deleted successfully");
      // After delete, refetch current page (if current page becomes empty, server will handle pagination)
      fetchProducts(currentPage);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditProduct(null);
    fetchProducts(currentPage);
  };

  // Pagination logic: server returns the page data, so use products as-is
  const paginatedProducts = products;

  return (
    <div className="p-4 relative">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>

        <button
          onClick={() => {
            setEditProduct(null);
            setShowForm(true);
          }}
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Add New Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded shadow">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-pink-300">
            <tr>
              <th className="border px-2 py-1">Image</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Gender</th>
              <th className="border px-2 py-1">Color</th>
              <th className="border px-2 py-1">Size</th>
              <th className="border px-2 py-1">Delivery</th>
              <th className="border px-2 py-1">Occasions</th>
              <th className="border px-2 py-1">Premium</th>
              <th className="border px-2 py-1">Badge</th>
              <th className="border px-2 py-1">Slug</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <DashboardLoading/>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center py-4">
                  No products found
                </td>
              </tr>
            ) : (paginatedProducts &&
              paginatedProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">
                    {p.image ? (
                      <Image src={p.image} alt={p.name} width={50} height={50} className="object-cover rounded" />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="border px-2 py-1">{p.name}</td>
                  <td className="border px-2 py-1">${p.price}</td>
                  <td className="border px-2 py-1">{p.category}</td>
                  <td className="border px-2 py-1">{p.gender}</td>
                  <td className="border px-2 py-1">{p.colour}</td>
                  <td className="border px-2 py-1">{p.size}</td>
                  <td className="border px-2 py-1">{p.delivery}</td>
                  <td className="border px-2 py-1">{p.occasions}</td>
                  <td className="border px-2 py-1">{p.premium ? "Yes" : "No"}</td>
                  <td className="border px-2 py-1">{p.badge || "-"}</td>
                  <td className="border px-2 py-1">{p.slug}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm">{`Showing ${paginatedProducts.length} of ${total} products`}</span>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); fetchProducts(p); }} />
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 mt-5">
          <div className="bg-white w-full max-w-5xl rounded shadow-lg p-4 relative mt-5 overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              ✖
            </button>
            <ProductForm product={editProduct} onSuccess={handleFormSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}
