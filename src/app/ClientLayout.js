
import ReduxProvider from "@/lib/ReduxProvider";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/hooks/CartContext";
import { WishlistProvider } from "@/hooks/WishlistContext";
import { AuthProvider } from "@/hooks/authContext";
import ProgressBarProviders from "@/components/ui/ProgressBar";
import { ProductProvider } from "@/hooks/ProductContext";
import ThemeProvider from "@/components/layout/ThemeProvider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { CategoriesProvider } from "@/hooks/CategoriesContext";

export default function ClientLayout({ children }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <ProgressBarProviders>
          <AuthProvider>
            <CategoriesProvider>
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
            </CategoriesProvider>
          </AuthProvider>
        </ProgressBarProviders>
      </ThemeProvider>
    </ReduxProvider>
  );
}
