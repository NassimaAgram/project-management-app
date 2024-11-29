"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { makeStore } from "@/app/redux"; 

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  const client = new QueryClient();
  const store = makeStore(); // Get the Redux store instance from your makeStore function.

  return (
    <Provider store={store}>  {/* Pass the actual store to Provider */}
      <QueryClientProvider client={client}>
        <ClerkProvider>{children}</ClerkProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default Providers;
