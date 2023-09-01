import Stripe from "stripe";

let stripe: Stripe;
export const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2023-08-16",
    });
  }
  return stripe;
};
