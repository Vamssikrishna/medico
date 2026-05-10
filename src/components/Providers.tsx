"use client";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ProfileProvider } from "@/context/ProfileContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <CartProvider>{children}</CartProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
