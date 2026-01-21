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
      fetchProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      toast.success('Logged in successfully');
      router.push('/'); // redirect to home
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast('Logged out', { icon: '👋' });
    router.push('/auth/login');
  };

  // Fetch profile
  const fetchProfile = async (tokenParam) => {
    try {
      const res = await axios.get('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${tokenParam || token}`,
        },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error('Fetch profile error:', error);
      logout(); // if token invalid
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, fetchProfile,isSidebarOpen,toggleSidebar,setSidebarOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
