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
    console.log("res",data);
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
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.message || 'Login failed');
    }
    // Store token in localStorage
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
    }
    return data.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

// Async thunk to get current user
export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
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
    console.log("res in login",data);
    
    if (!response.ok) {
      // Token invalid, remove it
      localStorage.removeItem('token');
      return rejectWithValue(data.message || 'Authentication failed');
    }
    return data.data.user;
  } catch (error) {
    localStorage.removeItem('token');
    return rejectWithValue(error.message || 'Authentication failed');
  }
});

// Async thunk to set token (for token handler)
export const setToken = createAsyncThunk('auth/setToken', async (token, { dispatch }) => {
  if (token) {
    localStorage.setItem('token', token);
    // Fetch user data
    dispatch(getCurrentUser());
  } else {
    localStorage.removeItem('token');
  }
  return token;
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
      localStorage.removeItem('token');
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
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
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
        const token = localStorage.getItem('token');
        state.token = token;
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
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;


