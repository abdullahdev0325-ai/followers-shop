"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import BlogForm from "./AdminBlogForm";
import Image from "next/image";
import { callPrivateApi, callPublicApi } from "@/services/callApis";
import { useAuth } from "@/hooks/authContext";
import DashboardLoading from "@/app/admin/loading";
export default function AdminBlogPage() {
  const {token}=useAuth()
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editBlog, setEditBlog] = useState(null);

  const fetchBlogs = async () => {

    try {
      console.log("[AdminBlogPage] Fetching blogs...");
      setLoading(true);

      const res = await callPublicApi(
        "/blogs",
        "GET",
        null,
      );

      console.log("[AdminBlogPage] Blogs response:", res);
              if(res.success){

      setBlogs(res.blogs || []);
              }
    } catch (err) {
      console.error("[AdminBlogPage] Fetch error:", err);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      console.log("[AdminBlogPage] Deleting blog:", id);

      const res = await callPrivateApi(
        `/blogs/${id}`,
        "DELETE",
        null,
        token
      )

      console.log("[AdminBlogPage] Delete response:", res);
              if(res.success){

      toast.success(res.message || "Blog deleted successfully");
      fetchBlogs();
              }
    } catch (err) {
      console.error("[AdminBlogPage] Delete error:", err);
      toast.error("Failed to delete blog");
    }
  };

  const handleEdit = (blog) => {
    console.log("[AdminBlogPage] Edit blog:", blog);
    setEditBlog(blog);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    console.log("[AdminBlogPage] Form success");
    setShowForm(false);
    setEditBlog(null);
    fetchBlogs();
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-pink-600">
          Blog Management
        </h1>

        <button
          onClick={() => {
            setEditBlog(null);
            setShowForm(true);
          }}
          className="bg-pink-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-pink-600 transition"
        >
          + Add New Blog
        </button>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowForm(false)}
            >
              ✖
            </button>

            <BlogForm
              blog={editBlog}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-pink-100 text-pink-700">
            <tr>
              <th className="border px-3 py-2">Image</th>
              <th className="border px-3 py-2">Title</th>
              <th className="border px-3 py-2">Slug</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Author</th>
              <th className="border px-3 py-2">Created</th>
              <th className="border px-3 py-2">Updated</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
               <DashboardLoading/>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  No blogs found
                </td>
              </tr>
            ) : (
              blogs.map((b) => (
                <tr key={b._id} className="hover:bg-pink-50">
                  <td className="border px-3 py-2">
                    {b.image ? (
                      <Image
                        src={b?.image}
                        alt={b?.title}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>

                  <td className="border px-3 py-2">{b.title}</td>
                  <td className="border px-3 py-2">{b.slug}</td>
                  <td className="border px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        b.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="border px-3 py-2">
                    {b.author || "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(b.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(b)}
                      className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
    </div>
  );
}
