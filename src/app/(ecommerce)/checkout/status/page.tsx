import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type FC } from "react";
import { ClearCart } from "./status";

interface CheckoutStatusPageProps {
  searchParams: {
    success?: boolean;
    cancel?: boolean;
  };
}

const CheckoutStatusPage: FC<CheckoutStatusPageProps> = async ({
  searchParams,
}) => {
  let message = "Something went wrong";
  if (searchParams.success) message = "Payment completed";

  if (searchParams.cancel) message = "Payment canceled";

  return (
    <div className="grid gap-4 place-items-center">
      <h3>{message}</h3>
      <Button asChild>
        <Link href={"/"}>Return to the Homepage</Link>
      </Button>
      {searchParams.success && <ClearCart />}
    </div>
  );
};

export default CheckoutStatusPage;
