import { dbClient } from "@/db";
import { orders } from "@/db/schema";
import { getStripe } from "@/server/stripe";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

export const POST = async (req: NextRequest) => {
  const stripe = getStripe();
  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();
  if (!payload || !signature) return NextResponse.json({ received: true });
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET_KEY!
  );

  if (event.type !== "checkout.session.completed") {
    console.log(`Unhandled event type ${event.type}`);
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  if (!orderId) return NextResponse.json({ received: true });

  const addressComponents = [
    session.customer_details?.address?.line1,
    session.customer_details?.address?.line2,
    session.customer_details?.address?.city,
    session.customer_details?.address?.state,
    session.customer_details?.address?.postal_code,
    session.customer_details?.address?.country,
  ];

  const address = addressComponents.filter((addr) => addr !== null).join(", ");

  await dbClient
    .update(orders)
    .set({
      address,
      isPaid: true,
      phone: session.customer_details?.phone,
      email: session.customer_details?.email,
      name: session.customer_details?.name,
      total: (session.amount_subtotal ?? 0) / 100,
    })
    .where(eq(orders.id, orderId));

  console.log(`Order ${orderId} updated.`);

  return NextResponse.json({ received: true });
};
