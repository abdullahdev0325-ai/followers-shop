const HOSTNAME = "http://localhost:3000/api";
// const HOSTNAME = "http://followora-shop.netlify.app/api";

/* ===============================
   CORE API CALLS
================================ */

export const callPrivateApi = async (endpoint, method, payload, token) => {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  let body = null;

  if (payload instanceof FormData) {
    body = payload;
  } else if (payload) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(payload);
  }

  const response = await fetch(`${HOSTNAME}${endpoint}`, {
    method,
    headers,
    body: method !== "GET" ? body : undefined,
  });

  const data = await response.json();
  if (!response.ok) throw data;
  return data;
};

export const callPublicApi = async (endpoint, method, payload) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const response = await fetch(`${HOSTNAME}${endpoint}`, {
    method,
    headers,
    body: payload && method !== "GET" ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json();
  if (!response.ok) throw data;
  return data;
};

/* ===============================
   AUTH
================================ */

export const registerUser = (payload) => {
  return callPublicApi("/auth/register", "POST", payload);
};

export const loginUser = (payload) => {
  return callPublicApi("/auth/login", "POST", payload);
};

/* ===============================
   PROFILE
================================ */

export const getProfile = (token) => {
  return callPrivateApi("/profile", "GET", null, token);
};

export const updateProfile = (payload, token) => {
  return callPrivateApi("/profile", "PUT", payload, token);
};

/* ===============================
   PRODUCTS
================================ */

// GET ALL
export const getProducts = (query = "") => {
  return callPublicApi(`/products${query}`, "GET");
};

// GET SINGLE (id or slug)
export const getSingleProduct = (idOrSlug) => {
  return callPublicApi(`/products/${idOrSlug}`, "GET");
};

// CREATE
export const createProduct = (payload, token) => {
  return callPrivateApi("/products", "POST", payload, token);
};

// UPDATE
export const updateProduct = (id, payload, token) => {
  return callPrivateApi(`/products/${id}`, "PUT", payload, token);
};

// DELETE
export const deleteProduct = (id, token) => {
  return callPrivateApi(`/products/${id}`, "DELETE", null, token);
};

/* ===============================
   TESTIMONIALS
================================ */

export const getTestimonials = () => {
  return callPublicApi("/testimonials", "GET");
};

export const createTestimonial = (payload, token) => {
  return callPrivateApi("/testimonials", "POST", payload, token);
};

export const deleteTestimonial = (id, token) => {
  return callPrivateApi(`/testimonials/${id}`, "DELETE", null, token);
};

/* ===============================
   BLOGS
================================ */

export const getBlogs = (query = "") => {
  return callPublicApi(`/blogs${query}`, "GET");
};

export const getSingleBlog = (slug) => {
  return callPublicApi(`/blogs/${slug}`, "GET");
};

export const createBlog = (payload, token) => {
  return callPrivateApi("/blogs", "POST", payload, token);
};

export const updateBlog = (id, payload, token) => {
  return callPrivateApi(`/blogs/${id}`, "PUT", payload, token);
};


export const deleteBlog = (id, token) => {
  return callPrivateApi(`/blogs/${id}`, "DELETE", null, token);
};

/* ===============================
   CATEGORIES
================================ */

export const getCategories = (query = "") => {
  return callPublicApi(`/categories${query}`, "GET");
};
