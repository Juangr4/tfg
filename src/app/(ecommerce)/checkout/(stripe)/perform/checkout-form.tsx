"use client";

import { Button } from "@/components/ui/button";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState, type FC, type FormEvent } from "react";

interface CheckoutFormProps {
  paymentIntent?: string;
}

export const CheckoutForm: FC<CheckoutFormProps> = ({ paymentIntent }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const location = window.location;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${location.protocol}//${location.host}/checkout/status?clear=true`,
      },
    });

    if (
      error.type === "card_error" ||
      error.type === "validation_error" ||
      error.type === "invalid_request_error"
    ) {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="container text-center">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <p>{message}</p>
        <PaymentElement options={{ layout: "tabs" }} />
        <Button>Realizar el pago</Button>
      </form>
    </div>
  );
};
