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
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const ProfileMenu = () => {
  const { data: session, status } = useSession();

  if (status !== "authenticated")
    return (
      <div className="flex justify-center items-center">
        <Button
          variant="ghost"
          onClick={async () => {
            await signIn();
          }}
        >
          Login
        </Button>
      </div>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-4 flex gap-2">
        {session.user.name}
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
  );
};

export default ProfileMenu;
