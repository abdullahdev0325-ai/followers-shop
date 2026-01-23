'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, clearError } from '@/lib/slices/authSlice';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import { LoginHeading } from '../ui/Heading';

export default function Login({ onClose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🔓 [CLIENT FORM] Login button clicked');
    console.log(`📧 Email: ${formData.email}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      const userRole = result.payload.user.role;
      console.log('\n═══════════════════════════════════════════════════════════');
      console.log('✅ [CLIENT FORM] Login Successful!');
      console.log(`👤 User: ${result.payload.user.email}`);
      console.log(`🎯 Role: ${userRole.toUpperCase()}`);
      
      if (userRole === 'admin') {
        console.log('🚪 [CLIENT FORM] Admin detected! Checking admin route access...');
      }
      
      console.log('═══════════════════════════════════════════════════════════\n');
      
      if (onClose) onClose();
      else {
        console.log(`🔀 [CLIENT FORM] Navigating to: /`);
        router.push('/');
      }
    } else {
      console.log('\n═══════════════════════════════════════════════════════════');
      console.log('❌ [CLIENT FORM] Login Failed!');
      console.log('═══════════════════════════════════════════════════════════\n');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 py-8 sm:py-10 bg-gradient-to-br from-zinc-100 via-white to-zinc-200 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-zinc-900/70 border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.15)] sm:shadow-[0_20px_80px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(255,255,255,0.05)] md:shadow-[0_20px_80px_rgba(255,255,255,0.05)] animate-fadeIn">

        <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10">
          {/* HEADER */}
          <LoginHeading text="Welcome Back" />
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
            Login to continue your journey
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-4 sm:mb-5 md:mb-6 p-2 sm:p-3 md:p-4 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 animate-shake text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            {/* EMAIL */}
            <div>
              <label className="block text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300 font-medium">
                Email
              </label>
              <div className="relative group">
                <FiMail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition text-base sm:text-lg" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl md:rounded-xl bg-white/70 dark:bg-zinc-800/70 text-xs sm:text-sm md:text-base text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300 font-medium">
                Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition text-base sm:text-lg" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl md:rounded-xl bg-white/70 dark:bg-zinc-800/70 text-xs sm:text-sm md:text-base text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl md:rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-pink-600 hover:to-red-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-pink-500/40 flex items-center justify-center disabled:opacity-60 text-xs sm:text-sm md:text-base gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin text-base sm:text-lg" />
                  <span>Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* SIGNUP LINK */}
          <p className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 text-center">
            Don’t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-pink-600 hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
