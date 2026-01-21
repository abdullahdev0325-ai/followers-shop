'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { signup, clearError } from '@/lib/slices/authSlice';
import { FiMail, FiLock, FiUser, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import { LoginHeading } from '../ui/Heading';

export default function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    dispatch(clearError());
    try {
      await dispatch(signup(formData)).unwrap();
      router.push('/');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-pink-50 via-white to-pink-100 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <div className="w-full max-w-md rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-zinc-900/70 border border-white/20 shadow-[0_20px_80px_rgba(236,72,153,0.25)] animate-fadeIn">

        <div className="p-8 sm:p-10">
          {/* HEADER */}
          <LoginHeading text="Create Account" />
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sign up to get started
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/30 animate-shake">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* FIRST NAME */}
            <div className="relative group">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-zinc-800/70 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
              />
            </div>

            {/* LAST NAME */}
            <div className="relative group">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-zinc-800/70 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
              />
            </div>

            {/* EMAIL */}
            <div className="relative group">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-zinc-800/70 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-zinc-800/70 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-500 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-pink-500/40 flex items-center justify-center disabled:opacity-60"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-8 text-sm text-gray-600 dark:text-gray-400 text-center">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-pink-600 hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
