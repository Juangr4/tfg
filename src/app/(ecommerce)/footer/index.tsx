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
        <div>Links</div>
        <div>Resources</div>
      </div>
      <Separator />
      <p>Social medias here</p>
      <p>&copy;Copyright. All rights reserved.</p>
    </div>
  );
};

export default Footer;
