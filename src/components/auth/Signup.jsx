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
    name: '',
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

      // ✅ Save email for OTP verification
      localStorage.setItem('otp_email', formData.email);

      // ✅ Redirect to OTP page
      router.push('/auth/otp');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 py-8 sm:py-10 bg-gradient-to-br from-pink-50 via-white to-pink-100 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-zinc-900/70 border border-white/20 shadow-[0_10px_40px_rgba(236,72,153,0.15)] sm:shadow-[0_20px_80px_rgba(236,72,153,0.25)] animate-fadeIn">

        <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10">
          {/* HEADER */}
          <LoginHeading text="Create Account" />
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
            Sign up to get started
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-4 sm:mb-5 md:mb-6 p-2 sm:p-3 md:p-4 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/30 animate-shake text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
            {/* FIRST NAME */}
            <div className="relative group">
              <FiUser className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition text-base sm:text-lg" />
              <input
                type="text"
                name="name"
                placeholder="First Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl md:rounded-xl bg-white/70 dark:bg-zinc-800/70 text-xs sm:text-sm md:text-base text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
              />
            </div>

           
            {/* EMAIL */}
            <div className="relative group">
              <FiMail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition text-base sm:text-lg" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl md:rounded-xl bg-white/70 dark:bg-zinc-800/70 text-xs sm:text-sm md:text-base text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative group">
              <FiLock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition text-base sm:text-lg" />
              <input
                type="password"
                name="password"
                placeholder="Password (min 6 chars)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl md:rounded-xl bg-white/70 dark:bg-zinc-800/70 text-xs sm:text-sm md:text-base text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl md:rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-500 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-pink-500/40 flex items-center justify-center disabled:opacity-60 text-xs sm:text-sm md:text-base gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin text-base sm:text-lg" />
                  <span>Creating account...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 text-center">
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
