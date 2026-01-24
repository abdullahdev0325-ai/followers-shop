'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null); // user object
  const [token, setToken] = useState(null); // JWT token
  const [loading, setLoading] = useState(true); // loading state
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken); // ✅ fetch user from /auth/me
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const res = await axios.post('/api/auth/login', credentials, {
        withCredentials: true, // cookies
      });

      const { token: jwtToken, user: userData } = res.data;

      if (jwtToken) {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setUser(userData);
        toast.success('Login successful!');
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      router.push('/login');
      toast.success('Logged out');
    }
  };

  // Fetch current user from /auth/me
  const fetchCurrentUser = async (tokenParam) => {
    try {
       const res=await callPrivateApi("/auth/me","GET",undefined,tokenParam)
    console.log("res in me",res);
    

      setUser(res.data.user);
    } catch (error) {
      console.error('Fetch current user error:', error);
      logout(); // token invalid
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        fetchCurrentUser,
        isSidebarOpen,
        toggleSidebar,
        setSidebarOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
