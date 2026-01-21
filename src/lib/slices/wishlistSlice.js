import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper functions for localStorage
const WISHLIST_STORAGE_KEY = 'guest_wishlist';

const saveWishlistToLocalStorage = (items) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }
};

const loadWishlistFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
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

const clearWishlistFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  }
};

// Async thunk to fetch wishlist
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    console.log('[wishlistSlice] fetchWishlist start - token present:', !!token);
    if (!token) {
      return rejectWithValue('Not authenticated');
    }

    const response = await fetch('/api/wishlist', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('[wishlistSlice] fetchWishlist response status:', response.status);
    const data = await response.json();
    if (!response.ok) {
      console.error('[wishlistSlice] fetchWishlist failed:', data);
      return rejectWithValue(data.message || 'Failed to fetch wishlist');
    }
    console.log('[wishlistSlice] fetchWishlist success - items:', (data.data && data.data.items) ? data.data.items.length : 'n/a');
    return data.data.items || [];
  } catch (error) {
    console.error('[wishlistSlice] fetchWishlist error:', error);
    return rejectWithValue(error.message || 'Failed to fetch wishlist');
  }
});

// Async thunk to sync guest wishlist with server
export const syncGuestWishlist = createAsyncThunk('wishlist/syncGuestWishlist', async (_, { rejectWithValue, dispatch }) => {
  try {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Not authenticated');
    }

    // Get guest wishlist from localStorage
    const guestWishlist = loadWishlistFromLocalStorage();
    if (guestWishlist.length === 0) {
      // No guest wishlist, just fetch server wishlist
      dispatch(fetchWishlist());
      return { synced: true };
    }

    // Fetch server wishlist
    const response = await fetch('/api/wishlist', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const serverData = await response.json();
    const serverItems = serverData.data?.items || [];
    const serverProductIds = new Set(serverItems.map((item) => item.id));

    // Merge guest wishlist with server wishlist
    // Add guest items that don't exist on server
    for (const guestItem of guestWishlist) {
      if (!serverProductIds.has(guestItem.id)) {
        try {
          await fetch('/api/wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: guestItem.id }),
          });
        } catch (error) {
          console.error('Error syncing wishlist item:', error);
        }
      }
    }

    // Clear localStorage
    clearWishlistFromLocalStorage();

    // Fetch updated wishlist
    dispatch(fetchWishlist());
    return { synced: true };
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to sync wishlist');
  }
});

// Async thunk to add to wishlist
export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (productIdOrProduct, { rejectWithValue, dispatch, getState }) => {
  try {
    const token = getAuthToken();
    const state = getState();
    const isAuthenticated = state.auth.isAuthenticated;

    // Handle both productId (number) and product object
    let productId;
    let product;
    if (typeof productIdOrProduct === 'number' || typeof productIdOrProduct === 'string') {
      productId = productIdOrProduct;
    } else {
      productId = productIdOrProduct.id;
      product = productIdOrProduct;
    }

    // If not authenticated, use localStorage
    if (!isAuthenticated || !token) {
      const guestWishlist = loadWishlistFromLocalStorage();
      
      // Check if already in wishlist
      if (guestWishlist.some((item) => item.id === productId)) {
        return { items: guestWishlist, isGuest: true };
      }

      // Need product data for guest wishlist
      if (!product) {
        // Try to get from products state
        const products = state.products?.products || [];
        product = products.find((p) => p.id === productId);
        if (!product) {
          return rejectWithValue('Product data required for guest wishlist');
        }
      }

      guestWishlist.push(product);
      saveWishlistToLocalStorage(guestWishlist);
      
      // Update Redux state
      return {
        items: guestWishlist,
        isGuest: true,
      };
    }

    // Authenticated user - use API
    const response = await fetch('/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to add to wishlist');
    }
    // Refetch wishlist to get updated data
    dispatch(fetchWishlist());
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to add to wishlist');
  }
});

// Async thunk to remove from wishlist
export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async ({ wishlistItemId, productId }, { rejectWithValue, dispatch, getState }) => {
  try {
    const token = getAuthToken();
    const state = getState();
    const isAuthenticated = state.auth.isAuthenticated;

    // If not authenticated, use localStorage
    if (!isAuthenticated || !token) {
      const guestWishlist = loadWishlistFromLocalStorage();
      const itemId = wishlistItemId || productId;
      const filtered = guestWishlist.filter((item) => item.id !== itemId);
      saveWishlistToLocalStorage(filtered);
      return {
        items: filtered,
        isGuest: true,
      };
    }

    // Authenticated user - use API
    const params = new URLSearchParams();
    if (wishlistItemId) params.append('wishlistItemId', wishlistItemId);
    if (productId) params.append('productId', productId);

    const response = await fetch(`/api/wishlist?${params.toString()}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to remove from wishlist');
    }
    // Refetch wishlist to get updated data
    dispatch(fetchWishlist());
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to remove from wishlist');
  }
});

// Action to load guest wishlist from localStorage
export const loadGuestWishlist = createAsyncThunk('wishlist/loadGuestWishlist', async (_, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    // Only load from localStorage if not authenticated
    if (token) {
      return rejectWithValue('User is authenticated');
    }

    const guestWishlist = loadWishlistFromLocalStorage();
    return {
      items: guestWishlist,
    };
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to load guest wishlist');
  }
});

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      // Also clear localStorage if guest
      clearWishlistFromLocalStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Don't clear wishlist on error, keep existing data
      });

    // Sync guest wishlist
    builder
      .addCase(syncGuestWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncGuestWishlist.fulfilled, (state) => {
        state.loading = false;
        // Wishlist will be refetched
      })
      .addCase(syncGuestWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Load guest wishlist
    builder
      .addCase(loadGuestWishlist.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      });

    // Add to wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isGuest) {
          // Guest wishlist - update directly
          state.items = action.payload.items;
        }
        // For authenticated users, wishlist will be refetched
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove from wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isGuest) {
          // Guest wishlist - update directly
          state.items = action.payload.items;
        }
        // For authenticated users, wishlist will be refetched
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlist, clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
