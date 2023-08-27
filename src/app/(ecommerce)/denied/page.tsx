import { Button } from "@/components/ui/button";
import Link from "next/link";

const DeniedPage = () => {
  return (
    <div className="flex flex-col justify-start p-8">
      <h1 className="text-5xl text-center">Oops</h1>
      <div className="mt-4 text-center">
        <p className="text-xl">
          Your don&apos;t have enought permission to access to that page.
        </p>
        <Button className="mt-8" asChild>
          <Link href={"/"}>Return to Home Page.</Link>
        </Button>
      </div>
    </div>
  );
};

export default DeniedPage;
