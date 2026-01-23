import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callPublicApi } from "@/services/callApis";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (query = "") => {
    const res = await callPublicApi(`/products${query}`, "GET");
    console.log("res in product",res);
    return res.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    filteredProducts: [],
    loading: true,
    page: 1,
  },

  reducers: {
    setFilteredProducts(state, action) {
      state.filteredProducts = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.filteredProducts = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setFilteredProducts, setPage } = productSlice.actions;
export default productSlice.reducer;
