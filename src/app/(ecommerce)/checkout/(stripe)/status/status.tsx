"use client";

import { useCartStore } from "@/app/(ecommerce)/_shoppingcart";
import { trpc } from "@/app/_trpc/client";
import { useStripe } from "@stripe/react-stripe-js";
import { useState, type FC } from "react";

interface PaymentDetailsProps {
  paymentIntentId: string;
  paymentIntentSecret?: string;
  clear?: string;
}

export const PaymentDetails: FC<PaymentDetailsProps> = ({
  paymentIntentId,
  paymentIntentSecret,
  clear,
}) => {
  const stripe = useStripe();
  const [message, setMessage] = useState<string>();
  const { data: order } = trpc.payments.getByPaymentIntent.useQuery(
    paymentIntentId,
    {
      refetchInterval: 5000,
    }
  );

  const clearCart = useCartStore((store) => store.clearCart);
  if (clear) {
    setTimeout(() => {
      clearCart();
    }, 1500);
  }

  if (!stripe) {
    return <div>Oups</div>;
  }

  if (stripe && paymentIntentSecret) {
    stripe
      .retrievePaymentIntent(paymentIntentSecret)
      .then(({ paymentIntent }) => {
        if (!paymentIntent) {
          setMessage("That order doesn't exist.");
          return;
        }
        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      });
  }

  return (
    <div className="grid place-items-center h-full">
      <div>
        <h3>Estado del pago: {message}</h3>
        <h3>Estado del pedido: {order?.status}</h3>
      </div>
    </div>
  );
};
