'use client';

import ReduxProvider from "@/lib/ReduxProvider";
import TokenHandler from "@/components/auth/TokenHandler";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/hooks/CartContext";
import { WishlistProvider } from "@/hooks/WishlistContext";
import { AuthProvider } from "@/hooks/authContext";
import ProgressBarProviders from "@/components/ui/ProgressBar";
import { ProductProvider } from "@/hooks/ProductContext";
import ThemeProvider from "@/components/layout/ThemeProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

export default function ClientLayout({ children }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <TokenHandler />
        <ProgressBarProviders>
          <AuthProvider>
            <ProductProvider>
              <CartProvider>
                <WishlistProvider>
                  <ConditionalLayout>
                    {children}
                    <Toaster position="top-right" />
                  </ConditionalLayout>
                </WishlistProvider>
              </CartProvider>
            </ProductProvider>
          </AuthProvider>
        </ProgressBarProviders>
      </ThemeProvider>
    </ReduxProvider>
  );
}
