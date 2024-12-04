"use client";

import StoreProvider from "@/state/storeProvider";
import AuthProvider from "./authProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>{children}</StoreProvider>
    </AuthProvider>
  );
}
