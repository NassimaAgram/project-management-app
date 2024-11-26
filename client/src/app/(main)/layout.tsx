import React from "react";
import { DashboardNavbar, DashboardSidebar} from "@/components";
import StoreProvider from "@/app/redux";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {

  return (
    <StoreProvider>
      <div className="flex flex-col min-h-screen w-full">
        <DashboardNavbar />
        <main className="flex flex-col lg:flex-row flex-1 size-full">
          <DashboardSidebar />
          <div className="w-full pt-14 lg:ml-72">
            {children}
          </div>
        </main>
      </div>
    </StoreProvider>
  );
};

export default DashboardLayout;
