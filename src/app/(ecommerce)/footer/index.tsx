import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="py-6 container">
      <div className="grid grid-cols-3">
        <div className="text-3xl font-bold pb-4 text-center">
          <Link href={"/"}>Logo</Link>
          <p className="text-lg font-semibold">Example Company</p>
        </div>
        <div className="w-1/3 text-center">
          <div className="mb-1">
            <h4 className="text-md">Links</h4>
            <Separator />
          </div>
          <Link href="/dashboard" className="text-sm">
            Admin panel
          </Link>
        </div>
        <div>Resources</div>
      </div>
      <Separator />
      <div className="text-center">
        <p>Social medias here</p>
        <p>&copy;Copyright. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
