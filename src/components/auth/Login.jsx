'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login, clearError } from '@/lib/slices/authSlice';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import { LoginHeading } from '../ui/Heading';

export default function Login({ onSwitchToSignup, onClose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      if (onClose) onClose();
      else router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-zinc-100 via-white to-zinc-200 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <div className=" md:w-[70%] sm:w-[80%] w-[90%] max-w-[30%] rounded-2xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_80px_rgba(255,255,255,0.05)] backdrop-blur-xl bg-white/80 dark:bg-zinc-900/70 border border-white/20 animate-fadeIn">

        <div className="flex flex-col lg:flex-row">

          {/* LEFT – FORM */}
          <div className="w-full  p-8 sm:p-10">
            <LoginHeading text="Welcome Back" />
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Login to continue your journey
            </p>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* EMAIL */}
              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-zinc-800/70 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 dark:bg-zinc-800/70 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-pink-500 outline-none transition"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-pink-600 hover:to-red-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-pink-500/40 flex items-center justify-center disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* SIGNUP */}
              <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
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
    </div>
  );
}
