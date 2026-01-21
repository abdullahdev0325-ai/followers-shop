import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import filtersReducer from './slices/filtersSlice';
import wishlistReducer from './slices/wishlistSlice';
import cartReducer from './slices/cartSlice';
import blogsReducer from './slices/blogsSlice';
import authReducer from './slices/authSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    filters: filtersReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    blogs: blogsReducer,
    auth: authReducer,
    orders: ordersReducer,
  },
});

