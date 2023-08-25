import { type ReactNode } from "react";
import DashboardNavbar from "./dashboard-navbar";
import DashboardSidebar from "./dashboard-sidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardNavbar />
      <div className="w-full h-full flex gap-16">
        <DashboardSidebar />
        <main className="flex justify-center items-center flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
