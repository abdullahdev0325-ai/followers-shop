'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiUser, 
  FiShoppingCart,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';
import { useTheme } from './ThemeProvider';
import { logout } from '@/lib/slices/authSlice';
// import AuthModal from '@/components/auth/AuthModal';

import NavbarButtons from './NavbarButton';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

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
      <div className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex gap-4">
              <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Blog
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <select className="bg-transparent text-gray-600 dark:text-gray-400 border-none text-sm">
                <option>AED</option>
              </select>
              <select className="bg-transparent text-gray-600 dark:text-gray-400 border-none text-sm">
                <option>English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            Aroma Flowers
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              Home
            </Link>
            <Link href="/product" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              Products
            </Link>
            <Link href="/flowers" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              Flowers
            </Link>
            <Link href="/cakes" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              Cakes
            </Link>
            <Link href="/gifts" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              Gifts
            </Link>
            <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
              Blog
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center gap-1">
                <FiSettings size={16} />
                Admin
              </Link>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            {isAuthenticated ? (
              <>
                <div className="relative group">
                  <button className="p-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 flex items-center gap-1">
                    <FiUser size={20} />
                    <span className="hidden md:inline text-sm">{user?.firstName || 'Account'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-zinc-700">
                        {user?.email}
                      </div>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
                        My Account
                      </Link>
                      {user?.role === 'admin' && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700">
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center gap-2"
                      >
                        <FiLogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => handleAuthClick('login')}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400"
              >
                <FiUser size={20} />
              </button>
            )}
          <NavbarButtons/>
            <button
              onClick={handleMenuToggle}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 relative z-50"
              aria-label="Toggle menu"
            >
              <FiMenu 
                size={24} 
                className={`absolute top-2 left-2 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <FiX 
                size={24} 
                className={`absolute top-2 left-2 transition-all duration-300 ${
                  isMenuOpen 
                    ? (isClosing ? 'rotate-180 opacity-100 scale-100' : 'rotate-0 opacity-100 scale-100')
                    : 'rotate-0 opacity-0 scale-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slide from Right */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMenuOpen && !isClosing ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={handleMenuToggle}
        />
        
        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white dark:bg-zinc-900 shadow-xl overflow-y-auto transition-transform duration-300 ${
            isMenuOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button
              onClick={handleMenuToggle}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              aria-label="Close menu"
            >
              <FiX 
                size={24} 
                className={`transition-transform duration-300 ease-in-out ${
                  isClosing ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
          </div>
          <div className="px-4 py-4 space-y-1">
            <Link 
              href="/" 
              onClick={handleMenuLinkClick}
              className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/product" 
              className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Products
            </Link>
            <Link 
              href="/flowers" 
              onClick={handleMenuLinkClick}
              className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Flowers
            </Link>
            <Link 
              href="/cakes" 
              onClick={handleMenuLinkClick}
              className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cakes
            </Link>
            <Link 
              href="/gifts" 
              onClick={handleMenuLinkClick}
              className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Gifts
            </Link>
            <Link 
              href="/blog" 
              onClick={handleMenuLinkClick}
              className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Blog
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                href="/admin" 
                onClick={handleMenuLinkClick}
                className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
              >
                <FiSettings size={18} />
                Admin Panel
              </Link>
            )}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-zinc-800">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <span>Theme</span>
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      /> */}
    </nav>
  );
}

