"use client";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { ProfileProvider } from "@/context/ProfileContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <InventoryProvider>
          <CartProvider>{children}</CartProvider>
        </InventoryProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
