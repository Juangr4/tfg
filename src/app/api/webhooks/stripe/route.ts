import { serverClient } from "@/app/_trpc/serverClient";
import { getStripe } from "@/server/stripe";
import { type PaymentIntent } from "@stripe/stripe-js";
import { NextResponse, type NextRequest } from "next/server";

const handlePaymentIntentStatus = async (paymentIntent: PaymentIntent) => {
  await serverClient.payments.updateStatus({
    paymentIntentId: paymentIntent.id,
    status: paymentIntent.status,
  });
};

export const POST = async (req: NextRequest) => {
  const stripe = getStripe();
  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();
  if (!payload || !signature) return NextResponse.json({ received: true });
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET_KEY as string
  );

  switch (event.type) {
    case "payment_intent.requires_payment_method":
    case "payment_intent.requires_confirmation":
    case "payment_intent.requires_action":
    case "payment_intent.processing":
    case "payment_intent.requires_capture":
    case "payment_intent.canceled":
    case "payment_intent.succeeded":
      handlePaymentIntentStatus(event.data.object as PaymentIntent);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
};
