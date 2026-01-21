'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, getCurrentUser } from '@/lib/slices/authSlice';
import { fetchCart, syncGuestCart, loadGuestCart } from '@/lib/slices/cartSlice';
import { fetchWishlist, syncGuestWishlist, loadGuestWishlist } from '@/lib/slices/wishlistSlice';

/**
 * TokenHandler Component
 * Handles token on app load:
 * - Reads token from localStorage
 * - Dispatches token to Redux
 * - Fetches user data
 * - Loads guest cart/wishlist if not authenticated
 * - Syncs guest cart/wishlist with backend on login
 * - Fetches cart & wishlist after token is available
 */
export default function TokenHandler() {
  const dispatch = useDispatch();
  const { token, isAuthenticated, user } = useSelector((state) => state.auth);
  const hasSyncedRef = useRef(false); // Track if sync has happened

  useEffect(() => {
    // On app load, read token from localStorage
    const storedToken = localStorage.getItem('token');
    console.log('[TokenHandler] init, storedToken:', storedToken);
    if (storedToken) {
      dispatch(setToken(storedToken));
    } else {
      // No token - load guest cart/wishlist from localStorage
      console.log('[TokenHandler] No token found - loading guest cart & wishlist from localStorage');
      dispatch(loadGuestCart());
      dispatch(loadGuestWishlist());
    }
  }, [dispatch]);

  useEffect(() => {
    // When token is set and user is not authenticated, fetch user data
    console.log('[TokenHandler] token/isAuthenticated changed:', { token: !!token, isAuthenticated });
    if (token && !isAuthenticated) {
      console.log('[TokenHandler] fetching current user');
      dispatch(getCurrentUser()).catch((err) => console.error('[TokenHandler] getCurrentUser failed:', err));
    }
  }, [token, isAuthenticated, dispatch]);

  useEffect(() => {
    // IMPORTANT: Sync guest cart/wishlist with backend on login
    // This runs once when user becomes authenticated
    if (isAuthenticated && token && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      console.log('[TokenHandler] User authenticated - syncing guest cart & wishlist to server');

      // Sync guest cart and wishlist with backend
      dispatch(syncGuestCart()).catch((err) => console.error('[TokenHandler] syncGuestCart failed:', err));
      dispatch(syncGuestWishlist()).catch((err) => console.error('[TokenHandler] syncGuestWishlist failed:', err));
    }
  }, [isAuthenticated, token, dispatch]);

  useEffect(() => {
    // Fetch cart & wishlist only after user is authenticated and sync is complete
    // Wait a bit for sync to complete
    if (isAuthenticated && token && hasSyncedRef.current) {
      console.log('[TokenHandler] Fetching cart & wishlist after sync');
      const timer = setTimeout(() => {
        dispatch(fetchCart()).catch((err) => console.error('[TokenHandler] fetchCart failed:', err));
        dispatch(fetchWishlist()).catch((err) => console.error('[TokenHandler] fetchWishlist failed:', err));
      }, 1000); // Give sync time to complete

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, token, dispatch]);

  // Reset sync flag when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      hasSyncedRef.current = false;
      // Load guest cart/wishlist when logged out
      dispatch(loadGuestCart());
      dispatch(loadGuestWishlist());
    }
  }, [isAuthenticated, dispatch]);

  // This component doesn't render anything
  return null;
}
