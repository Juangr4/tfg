import { type FC } from "react";
import StripeProvider from "../_stripe/provider";
import { CheckoutForm } from "./checkout-form";

interface CheckoutFormPageProps {
  searchParams: {
    clientSecret: string;
  };
}

const CheckoutFormPage: FC<CheckoutFormPageProps> = ({ searchParams }) => {
  return (
    <StripeProvider clientSecret={searchParams.clientSecret}>
      <CheckoutForm />
    </StripeProvider>
  );
};

export default CheckoutFormPage;
