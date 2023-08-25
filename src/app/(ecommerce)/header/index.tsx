import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import ProfileMenu from "./profile-menu";
import ShoppingCartMenu from "./shopping-cart-menu";

const MainHeader = () => {
  return (
    <div className="py-6">
      <div className="container sm:flex justify-between items-center">
        <div className="text-center text-4xl font-bold pb-4">
          <Link href={"/"}>Logo</Link>
        </div>
        <div className="w-full md:w-[60%] sm:w-[350px] relative">
          <Input
            className="w-full rounded-lg p-2 border"
            placeholder="Write any product"
            type="text"
          />
          <SearchIcon className="h-4 w-4 absolute right-0 top-0 mr-3 mt-3" />
        </div>
        <div className="hidden md:flex gap-4">
          <ProfileMenu />
          <ShoppingCartMenu />
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
