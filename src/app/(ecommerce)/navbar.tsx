"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/products",
    name: "Products",
  },
  {
    path: "/#about",
    name: "About Us",
  },
  {
    path: "/contact",
    name: "Contact",
  },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="container flex justify-center mb-4">
      <div className="flex w-fit gap-8 text-lg font-medium">
        {routes.map((route, index) => (
          <Link
            key={index}
            href={route.path}
            className={
              pathname === route.path ? "underline underline-offset-2" : ""
            }
          >
            {route.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
