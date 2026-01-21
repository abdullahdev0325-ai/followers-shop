"use client";

import { useState } from "react";
import { useCart } from "@/hooks/CartContext";

import WishlistSidebar from "./WishlistSidebar";
import CartSidebar from "./SidebarCart";
export default function NavbarButtons() {
  const { cartItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 relative">
      <button
        className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200"
        onClick={() => setCartOpen(true)}
      >
        🛒
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {cartItems ?
            cartItems.length : "0"}
          </span>
        )}
      </button>

      <button
        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
        onClick={() => setWishlistOpen(true)}
      >
        ❤️
      </button>

      <CartSidebar open={cartOpen} setOpen={setCartOpen} />
      <WishlistSidebar open={wishlistOpen} setOpen={setWishlistOpen} />
    </div>
  );
}
