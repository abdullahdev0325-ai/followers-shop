import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to signup
export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log("res", data);
    if (!response.ok) {
      return rejectWithValue(data.message || 'Signup failed');
    }
    // Store token in localStorage
    // if (data.data.token) {
    //   localStorage.setItem('token', data.data.token);
    // }
    return data.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Signup failed');
  }
});

// Async thunk to login
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🔐 [CLIENT] Login Request Initiated');
    console.log(`📧 Email: ${credentials.email}`);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    console.log('✅ [CLIENT] Login Response Received:', data);

    if (!response.ok) {
      console.log(`❌ [CLIENT] Login Failed: ${data.message}`);
      console.log('═══════════════════════════════════════════════════════════\n');
      return rejectWithValue(data.message || 'Login failed');
    }

    // Store token in localStorage
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      console.log(`✅ [CLIENT] Token Stored in localStorage`);
      console.log(`👤 User Role: ${data.user?.role?.toUpperCase()}`);
      console.log(`📍 User ID: ${data.user?.id}`);
      console.log('═══════════════════════════════════════════════════════════\n');
    }
    return data;
  } catch (error) {
    console.error('🔴 [CLIENT] Login Error:', error);
    console.log('═══════════════════════════════════════════════════════════\n');
    return rejectWithValue(error.message || 'Login failed');
  }
});

// Async thunk to get current user
export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }
    if (!token) {
      return rejectWithValue('No token found');
    }

    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("res in login", data);

    if (!response.ok) {
      // Token invalid, remove it
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      return rejectWithValue(data.message || 'Authentication failed');
    }
  } catch (error) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    return rejectWithValue(error.message || 'Authentication failed');
  }
});

// Async thunk to set token (for token handler)
export const setToken = createAsyncThunk('auth/setToken', async (token, { dispatch }) => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('token', token);
      // Fetch user data
      dispatch(getCurrentUser());
    } else {
      localStorage.removeItem('token');
    }
  }
  return token;
});

// Async thunk to logout
export const logoutAsync = createAsyncThunk('auth/logoutAsync', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    console.log('Logout response:', data);

    if (!response.ok) {
      return rejectWithValue(data.message || 'Logout failed');
    }

    // Remove from localStorage on success
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove from localStorage even if API fails
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return rejectWithValue(error.message || 'Logout failed');
  }
});

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        console.log('⏳ [REDUX] Login Pending...');
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('✅ [REDUX] Login Successful!');
        console.log(`👤 User: ${action.payload.user.email}`);
        console.log(`🎯 Role: ${action.payload.user.role.toUpperCase()}`);
        console.log('═══════════════════════════════════════════════════════════\n');
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('❌ [REDUX] Login Failed!');
        console.log(`Error: ${action.payload}`);
        console.log('═══════════════════════════════════════════════════════════\n');
        state.loading = false;
        state.error = action.payload;
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          state.token = token;
        }
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // Set token
    builder
      .addCase(setToken.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = !!action.payload;
      });

    // Logout Async
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Still clear state on failure
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;


