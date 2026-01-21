import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper functions for localStorage
const CART_STORAGE_KEY = 'guest_cart';

const saveCartToLocalStorage = (items) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }
};

const loadCartFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
  }
  return [];
};

const clearCartFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CART_STORAGE_KEY);
  }
};

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
};

// Async thunk to fetch cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    console.log('[cartSlice] fetchCart start - token present:', !!token);
    if (!token) {
      return rejectWithValue('Not authenticated');
    }

    const response = await fetch('/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('[cartSlice] fetchCart response status:', response.status);
    const data = await response.json();
    if (!response.ok) {
      console.error('[cartSlice] fetchCart failed:', data);
      return rejectWithValue(data.message || 'Failed to fetch cart');
    }
    console.log('[cartSlice] fetchCart success - items:', (data.data && data.data.items) ? data.data.items.length : 'n/a');
    return data.data;
  } catch (error) {
    console.error('[cartSlice] fetchCart error:', error);
    return rejectWithValue(error.message || 'Failed to fetch cart');
  }
});

// Async thunk to sync guest cart with server
export const syncGuestCart = createAsyncThunk('cart/syncGuestCart', async (_, { rejectWithValue, dispatch }) => {
  try {
    const token = getAuthToken();
    console.log('[cartSlice] syncGuestCart start - token:', !!token);
    if (!token) {
      return rejectWithValue('Not authenticated');
    }

    // Get guest cart from localStorage
    const guestCart = loadCartFromLocalStorage();
    console.log('[cartSlice] guestCart length:', guestCart.length);
    if (guestCart.length === 0) {
      // No guest cart, just fetch server cart
      dispatch(fetchCart());
      return { synced: true };
    }

    // Fetch server cart
    const response = await fetch('/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('[cartSlice] syncGuestCart fetch server cart status:', response.status);
    const serverData = await response.json();
    const serverItems = serverData.data?.items || [];

    // Merge guest cart with server cart
    // For each guest item, add to server (API will handle duplicates)
    for (const guestItem of guestCart) {
      try {
        console.log('[cartSlice] syncing guest item to server:', guestItem.id, 'qty:', guestItem.quantity);
        await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: guestItem.id,
            quantity: guestItem.quantity || 1,
          }),
        });
      } catch (error) {
        console.error('[cartSlice] Error syncing cart item:', error);
      }
    }

    // Clear localStorage
    clearCartFromLocalStorage();

    // Fetch updated cart
    dispatch(fetchCart());
    return { synced: true };
  } catch (error) {
    console.error('[cartSlice] syncGuestCart error:', error);
    return rejectWithValue(error.message || 'Failed to sync cart');
  }
});

// Async thunk to add to cart
export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity = 1, product }, { rejectWithValue, dispatch, getState }) => {
  try {
    const token = getAuthToken();
    const state = getState();
    const isAuthenticated = state.auth.isAuthenticated;

    // If not authenticated, use localStorage
    if (!isAuthenticated || !token) {
      const guestCart = loadCartFromLocalStorage();
      const existingItem = guestCart.find((item) => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        // Need product data for guest cart
        if (!product) {
          return rejectWithValue('Product data required for guest cart');
        }
        guestCart.push({
          ...product,
          quantity,
        });
      }

      saveCartToLocalStorage(guestCart);
      const total = calculateTotal(guestCart);
      
      // Update Redux state
      return {
        items: guestCart,
        total,
        isGuest: true,
      };
    }

    // Authenticated user - use API
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to add to cart');
    }
    // Refetch cart to get updated data
    dispatch(fetchCart());
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to add to cart');
  }
});

// Async thunk to update cart item quantity
export const updateCartQuantity = createAsyncThunk('cart/updateQuantity', async ({ cartItemId, productId, quantity }, { rejectWithValue, dispatch, getState }) => {
  try {
    const token = getAuthToken();
    const state = getState();
    const isAuthenticated = state.auth.isAuthenticated;

    // If not authenticated, use localStorage
    if (!isAuthenticated || !token) {
      const guestCart = loadCartFromLocalStorage();
      const itemId = cartItemId || productId;
      const item = guestCart.find((item) => item.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          // Remove item
          const filtered = guestCart.filter((item) => item.id !== itemId);
          saveCartToLocalStorage(filtered);
          return {
            items: filtered,
            total: calculateTotal(filtered),
            isGuest: true,
          };
        } else {
          item.quantity = quantity;
          saveCartToLocalStorage(guestCart);
          return {
            items: guestCart,
            total: calculateTotal(guestCart),
            isGuest: true,
          };
        }
      }
      return rejectWithValue('Item not found');
    }

    // Authenticated user - use API
    const response = await fetch('/api/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ cartItemId, quantity }),
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to update cart');
    }
    // Refetch cart to get updated data
    dispatch(fetchCart());
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to update cart');
  }
});

// Async thunk to remove from cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ cartItemId, productId }, { rejectWithValue, dispatch, getState }) => {
  try {
    const token = getAuthToken();
    const state = getState();
    const isAuthenticated = state.auth.isAuthenticated;

    // If not authenticated, use localStorage
    if (!isAuthenticated || !token) {
      const guestCart = loadCartFromLocalStorage();
      const itemId = cartItemId || productId;
      const filtered = guestCart.filter((item) => item.id !== itemId);
      saveCartToLocalStorage(filtered);
      return {
        items: filtered,
        total: calculateTotal(filtered),
        isGuest: true,
      };
    }

    // Authenticated user - use API
    const params = new URLSearchParams();
    if (cartItemId) params.append('cartItemId', cartItemId);
    if (productId) params.append('productId', productId);

    const response = await fetch(`/api/cart?${params.toString()}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to remove from cart');
    }
    // Refetch cart to get updated data
    dispatch(fetchCart());
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to remove from cart');
  }
});

// Action to load guest cart from localStorage
export const loadGuestCart = createAsyncThunk('cart/loadGuestCart', async (_, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    // Only load from localStorage if not authenticated
    if (token) {
      return rejectWithValue('User is authenticated');
    }

    const guestCart = loadCartFromLocalStorage();
    return {
      items: guestCart,
      total: calculateTotal(guestCart),
    };
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to load guest cart');
  }
});

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      // Also clear localStorage if guest
      clearCartFromLocalStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Don't clear cart on error, keep existing data
      });

    // Sync guest cart
    builder
      .addCase(syncGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncGuestCart.fulfilled, (state) => {
        state.loading = false;
        // Cart will be refetched
      })
      .addCase(syncGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Load guest cart
    builder
      .addCase(loadGuestCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      });

    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isGuest) {
          // Guest cart - update directly
          state.items = action.payload.items;
          state.total = action.payload.total;
        }
        // For authenticated users, cart will be refetched
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update quantity
    builder
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isGuest) {
          // Guest cart - update directly
          state.items = action.payload.items;
          state.total = action.payload.total;
        }
        // For authenticated users, cart will be refetched
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isGuest) {
          // Guest cart - update directly
          state.items = action.payload.items;
          state.total = action.payload.total;
        }
        // For authenticated users, cart will be refetched
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;
