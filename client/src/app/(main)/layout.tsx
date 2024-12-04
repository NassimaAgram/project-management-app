"use client";

import React, { useEffect } from "react";
import "@/styles/mainStyle.css";
import StoreProvider from "@/state/storeProvider";
import { useUser } from "@clerk/nextjs";
import Loading from "@/components/Loading";
import Sidebar from "@/components/dashboard/Sidebar/index";
import { useAppSelector, useAppDispatch } from "@/state/store";
import Navbar from "@/components/dashboard/Navbar/index";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { setIsDarkMode } from "@/state/slices/globalSlice";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const { user, isLoaded } = useUser();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Apply dark mode synchronously before the page renders
  useEffect(() => {
    const darkModeClass = "dark";
    if (isDarkMode) {
      document.documentElement.classList.add(darkModeClass);
    } else {
      document.documentElement.classList.remove(darkModeClass);
    }
  }, [isDarkMode]);  

  // Check user authentication
  if (!isLoaded) {
    return <Loading />;
  }

  if (!user) {
    //Set dark mode state based on a default value if desired
    dispatch(setIsDarkMode(!isDarkMode));

    return (
      <main className="relative flex flex-col items-center justify-center px-4 min-h-screen">
        <div className="flex flex-col items-center justify-center mx-auto h-screen">
          <div className="flex items-center justify-center flex-col">
            <span className="text-sm font-medium px-3.5 py-1 rounded-md bg-gradient-to-br from-violet-400 to-purple-600 text-neutral-50">
              ProjeXpert
            </span>
            <h1 className="text-3xl md:text-5xl font-bold dark:text-neutral-50 text-dark-bg mt-5">
              Access Denied
            </h1>
            <p className="text-base text-neutral-400 font-medium mt-5 text-center mx-auto max-w-xl">
              You need to be signed in to access this page. Please log in to continue.
            </p>
            <Link href="/auth/signin">
              <Button className="mt-8">Sign In</Button>
            </Link>
            <p className="mt-4 text-sm text-neutral-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-foreground font-medium">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <StoreProvider>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-dark-bg w-full">
        <Sidebar />
        <main
          className={`flex flex-col w-full transition-all duration-300 bg-gray-50 dark:bg-dark-bg ${
            isSidebarCollapsed ? "pl-0" : "md:pl-64"
          }`}
        >
          <Navbar />
          {children}
        </main>
      </div>
    </StoreProvider>
  );
};

export default DashboardLayout;
