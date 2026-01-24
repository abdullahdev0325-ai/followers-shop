'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiLogOut,
  FiSettings,
} from 'react-icons/fi';
import { useTheme } from './ThemeProvider';
import { logout } from '@/lib/slices/authSlice';
import { useAppCategories } from '@/hooks/CategoriesContext';
// import AuthModal from '@/components/auth/AuthModal';
import NavbarButtons from './NavbarButton';
import { useAuth } from '@/hooks/authContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  console.log("usr in navbar",user);
  
  const dispatch = useDispatch();
  const { categories, loading: categoriesLoading } = useAppCategories();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [localUser, setLocalUser] = useState(null);

  // Check localStorage for user on mount
  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');

  //   if (storedUser) {
  //     try {
  //       setLocalUser(JSON.parse(storedUser));
  //     } catch (err) {
  //       console.error('Error parsing user from localStorage:', err);
  //     }
  //   }
  // }, []);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Use localStorage user if Redux user not available
  const currentUser = user || localUser;

  const isAdmin =
    currentUser?.role === 'admin' || localUser?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleAuthClick = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleMenuToggle = () => {
    if (isMenuOpen) {
      // Start closing animation - rotate icon first
      setIsClosing(true);

      // Wait for rotation animation (300ms), then slide out menu
      setTimeout(() => {
        setIsMenuOpen(false);

        // Reset closing state after menu is fully closed
        setTimeout(() => {
          setIsClosing(false);
        }, 300);
      }, 300);
    } else {
      setIsMenuOpen(true);
      setIsClosing(false);
    }
  };

  const handleMenuLinkClick = () => {
    // Close menu when a link is clicked
    handleMenuToggle();
  };

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 hidden sm:block">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* top bar content commented */}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto py-2 md:py-0 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="text-lg border-">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-[200px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-6">
            <Link
              href="/"
              className="text-xs xl:text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium"
            >
              Home
            </Link>

            <Link
              href="/product"
              className="text-xs xl:text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium"
            >
              Products
            </Link>

            {/* Dynamic Categories from API */}
            {categories && categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-xs xl:text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium capitalize"
              >
                {category.name}
              </Link>
            ))}

            <Link
              href="/blog"
              className="text-xs xl:text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium"
            >
              Blog
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="text-xs xl:text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center gap-1 font-medium bg-pink-50 dark:bg-zinc-800 px-2 xl:px-3 py-1 rounded-lg"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {isAuthenticated || localUser ? (
              <>
                <div className="relative group hidden sm:block">
                  <button className="p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 flex items-center gap-1 transition-colors">
                    <FiUser size={16} />
                    <span className="hidden md:inline text-xs sm:text-sm font-medium truncate max-w-[100px]">
                      {currentUser?.firstName || 'Account'}
                    </span>
                  </button>

                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="py-2">
                      <div className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-zinc-700 truncate">
                        {currentUser?.email}
                      </div>

                      <Link
                        href="/account"
                        className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                      >
                        My Account
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center gap-2 transition-colors"
                      >
                        <FiLogOut size={14} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => handleAuthClick('login')}
                className="p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hidden sm:block transition-colors"
              >
                <FiUser size={16} />
              </button>
            )}

            <NavbarButtons />

            <button
              onClick={handleMenuToggle}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 relative z-50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX
                  size={24}
                  className="transition-transform duration-300"
                />
              ) : (
                <FiMenu
                  size={24}
                  className="transition-transform duration-300"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`lg:hidden bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 animate-in slide-in-from-top-2 duration-300 max-h-96 overflow-y-auto`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 space-y-2">
            <Link
              href="/"
              onClick={handleMenuLinkClick}
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-lg transition-colors font-medium"
            >
              Home
            </Link>

            <Link
              href="/product"
              onClick={handleMenuLinkClick}
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-lg transition-colors font-medium"
            >
              All Products
            </Link>

            {/* Dynamic Categories in Mobile Menu */}
            {categories && categories.length > 0 && (
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-2 mt-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    onClick={handleMenuLinkClick}
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-lg transition-colors font-medium capitalize"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/blog"
              onClick={handleMenuLinkClick}
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-lg transition-colors font-medium"
            >
              Blog
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={handleMenuLinkClick}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-lg transition-colors font-medium bg-pink-50 dark:bg-zinc-800"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
