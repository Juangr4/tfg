"use client";

import { Button } from "@/components/ui/button";
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
    name: "Orders",
    path: "/dashboard/orders",
  },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-center border-r-2">
      <nav className="flex flex-col items-center justify-center gap-x-2">
        {routes.map((route, index) => {
          return (
            <Button key={index} className="w-full m-2" variant={"link"} asChild>
              <Link
                href={route.path}
                className={pathname === route.path ? "underline" : ""}
              >
                {route.name}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
