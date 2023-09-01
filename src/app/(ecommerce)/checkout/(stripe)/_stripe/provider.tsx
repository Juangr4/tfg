"use client";

import getStripe from "@/lib/get-stripe";
import { Elements } from "@stripe/react-stripe-js";
import { type Appearance, type StripeElementsOptions } from "@stripe/stripe-js";
import { type ReactNode } from "react";

const StripeProvider = ({
  children,
  clientSecret,
}: {
  children: ReactNode;
  clientSecret?: string;
}) => {
  const stripe = getStripe();

  const appearance: Appearance = {
    theme: "stripe",
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
