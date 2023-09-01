import { loadStripe, type Stripe as ClientStripe } from "@stripe/stripe-js";

let stripePromise: Promise<ClientStripe | null>;
const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
    );
  }
  return await stripePromise;
};

export default getStripe;
