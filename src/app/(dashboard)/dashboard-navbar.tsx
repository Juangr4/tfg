"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const DashboardNavbar = () => {
  const { data: session } = useSession();

  return (
    <header className="flex w-full items-center justify-between h-12 p-6 border-b-2">
      <div className="text-xl">
        <span className="font-semibold">Imagine</span> dashboard
      </div>
      <nav className="flex items-center justify-center gap-x-2">
        <Button variant={"link"} asChild>
          <Link href="/">Visitar la tienda</Link>
        </Button>
      </nav>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-4 flex gap-2">
          {session?.user.name}
          <UserIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/profile"}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/profile/orders"}>Orders</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await signOut({ callbackUrl: "/" });
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default DashboardNavbar;
