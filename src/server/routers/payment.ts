import { CartItem } from "@/app/(ecommerce)/_shoppingcart";
import { dbClient } from "@/db";
import { orders, products, users } from "@/db/schema";
import { orderStatusSchema } from "@/lib/types";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getStripe } from "../stripe";
import { adminProcedure, loggedProcedure, router } from "../trpc";

export const PaymentRouter = router({
  create: loggedProcedure
    .input(z.array(CartItem))
    .mutation(async ({ input, ctx }) => {
      const clientSecret = await dbClient.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
          where: eq(users.email, ctx.session?.user.email as string),
        });

        const productIds = input.map((item) => item.product.id);
        const productsToBuy = await tx.query.products.findMany({
          where: inArray(products.id, productIds),
        });

        const itemsToBuy = productsToBuy.map((product) => ({
          product,
          amount:
            input.find((item) => item.product.id === product.id)?.amount ?? 0,
        }));

        const subtotal = itemsToBuy
          .map((item) => item.product.price * item.amount)
          .reduce((acc, current) => acc + current, 0);

        if (!user || !itemsToBuy || itemsToBuy.length === 0) {
          tx.rollback();
          console.log("Error creating the payment");
          return;
        }

        const stripe = getStripe();

        const paymentIntent = await stripe.paymentIntents.create({
          amount: subtotal * 100,
          currency: "eur",
          automatic_payment_methods: {
            enabled: true,
          },
          receipt_email: user.email,
        });

        await tx.insert(orders).values({
          stripePaymentIntentId: paymentIntent.id,
          email: user.email,
          name: user.name,
          status: paymentIntent.status,
          total: subtotal,
          userId: user.id,
          items: itemsToBuy,
        });

        return paymentIntent.client_secret;
      });

      return clientSecret;
    }),
  updateStatus: adminProcedure
    .input(
      z.object({
        paymentIntentId: z.string(),
        status: orderStatusSchema,
      })
    )
    .mutation(async ({ input }) => {
      await dbClient
        .update(orders)
        .set({
          status: input.status,
        })
        .where(eq(orders.stripePaymentIntentId, input.paymentIntentId));
    }),
  getByPaymentIntent: loggedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await dbClient.query.orders.findFirst({
        where: eq(orders.stripePaymentIntentId, input),
      });
    }),
});
