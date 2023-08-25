"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Users",
    path: "/dashboard/users",
  },
  {
    name: "Products",
    path: "/dashboard/products",
  },
  {
    name: "Categories",
    path: "/dashboard/categories",
  },
  {
    name: "Billboards",
    path: "/dashboard",
  },
  {
    name: "Transport",
    path: "/dashboard",
  },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between bg-[#55D6BE]">
      <div className="text-xl">This is the logo</div>
      <nav className="flex flex-col items-center justify-center gap-x-2">
        {routes.map((route, index) => {
          return (
            <Link
              key={index}
              href={route.path}
              className={cn(
                "bg-[#55D6BE] p-2 hover:bg-[#ACFCD9] rounded-md",
                pathname === route.path ? "underline" : ""
              )}
            >
              {route.name}
            </Link>
          );
        })}
      </nav>
      <div>This is the profile icon</div>
    </div>
  );
};

export default DashboardSidebar;
