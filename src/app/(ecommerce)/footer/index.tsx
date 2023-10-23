import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="py-6 container">
      <div className="grid md:grid-cols-3 [&>div]:text-center space-y-8 mb-8">
        <div className="text-3xl font-bold md:pb-4 flex flex-col items-center">
          <Link href={"/"}>
            <Image src={"/logo.png"} alt="Logo" width={128} height={32} />
          </Link>
          <p className="text-lg font-semibold">Imagine Inc.</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div>
            <h4 className="text-md">Links</h4>
          </div>
          <Separator className="w-1/3 mb-1" />
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
