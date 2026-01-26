'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { callPublicApi, callPrivateApi } from '@/services/callApis';
// 👆 yahan tumhara axios wrapper

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFetchedUser, setHasFetchedUser] = useState(false);

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  /* ======================================================
     LOAD USER ONCE (page refresh)
  ====================================================== */
  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken && !hasFetchedUser) {
      setToken(storedToken);
      fetchCurrentUser(storedToken).finally(() => {
        setHasFetchedUser(true);
      });
    } else {
      setLoading(false);
    }
  }, [hasFetchedUser]);

  /* ======================================================
     SIGNUP
  ====================================================== */
  const signup = async (userData) => {
    try {
      const res = await callPublicApi('/auth/signup', 'POST', userData);
  console.log("res in register",res);
  
      if (res.data?.token && res.data?.user) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        toast.success('Account created and logged in!');
      } else {
        toast.success('Account created successfully');
      }

      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  /* ======================================================
     LOGIN3
  ====================================================== */
  const login = async (credentials) => {
    try {
      const res = await callPublicApi('/auth/login', 'POST', credentials);
      console.log("res", res);

      const { token, user } = res;

      // console.log("token saved",token,user);
      localStorage.setItem('token', token);

      setToken(token);
      setUser(user);
      //  console.log("token user");

      toast.success('Login successful');

      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
      return false;
    }
  };

  /* ======================================================
     GET CURRENT USER
  ====================================================== */
  const fetchCurrentUser = async (tokenParam) => {
    try {
      const res = await callPrivateApi(
        '/auth/me',
        'GET',
        undefined,
        tokenParam
      );
      console.log("res me", res);

      setUser(res.data.user);
    } catch (err) {
      console.error('Auth failed');
      logout();
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     LOGOUT
  ====================================================== */
  const logout = async () => {
    try {
      await callPrivateApi('/auth/logout', 'POST');
    } catch (err) {
      console.log('Logout error ignored');
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      setHasFetchedUser(false);
      router.push('/login');
      toast.success('Logged out');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,

        signup,
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
};

/* ======================================================
   HOOK
====================================================== */
export const useAuth = () => useContext(AuthContext);
