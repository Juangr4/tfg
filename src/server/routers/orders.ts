import { CartItemWithPhoto } from "@/app/(ecommerce)/_shoppingcart";
import { dbClient } from "@/db";
import { orders, products, users } from "@/db/schema";
import { type cartItemType } from "@/lib/types";
import { eq, inArray } from "drizzle-orm";
import type Stripe from "stripe";
import { z } from "zod";
import { getStripe } from "../stripe";
import { adminProcedure, loggedProcedure, router } from "../trpc";

export const OrderRouter = router({
  create: loggedProcedure
    .input(z.array(CartItemWithPhoto))
    .mutation(async ({ input, ctx }) => {
      const paymentSessionUrl = await dbClient.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
          where: eq(users.email, ctx.session?.user.email as string),
        });

        const productIds = input.map((item) => item.product.id);
        const productsToBuy = await tx.query.products.findMany({
          where: inArray(products.id, productIds),
        });

        const itemsToBuy: cartItemType[] = productsToBuy.map((product) => ({
          product: {
            ...product,
            price: Math.round(product.price * 100) / 100,
          },
          amount:
            input.find((item) => item.product.id === product.id)?.amount ?? 0,
        }));

        if (!user || !itemsToBuy || itemsToBuy.length === 0) {
          tx.rollback();
          console.error("Error creating the payment");
          return;
        }

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

        itemsToBuy.forEach((item) => {
          lineItems.push({
            quantity: item.amount,
            price_data: {
              currency: "EUR",
              product_data: {
                name: item.product.name,
              },
              unit_amount: Math.round(item.product.price * 100),
            },
          });
        });

        const subtotal = itemsToBuy
          .map((item) => item.product.price * item.amount)
          .reduce((acc, current) => acc + current, 0);

        const newOrders = await tx
          .insert(orders)
          .values({
            email: user.email,
            items: itemsToBuy,
            total: Math.round(subtotal * 100) / 100, // Because round return to closest integer
            name: user.name,
            userId: user.id,
          })
          .returning();
        const order = newOrders[0];

        const stripe = getStripe();

        const session = await stripe.checkout.sessions.create({
          line_items: lineItems,
          mode: "payment",
          billing_address_collection: "required",
          phone_number_collection: {
            enabled: true,
          },
          success_url: `${process.env.HOST_URL}/checkout/status?success=true`,
          cancel_url: `${process.env.HOST_URL}/checkout/status?cancel=true`,
          metadata: {
            orderId: order.id,
          },
        });

        return session.url;
      });

      return paymentSessionUrl;
    }),
  all: adminProcedure.query(async () => {
    const orders = await dbClient.query.orders.findMany();
    return orders;
  }),
  findByUser: adminProcedure
    .input(z.string())
    .query(async ({ input: userId, ctx }) => {
      if (ctx.session?.user.role !== "admin") return;
      return await dbClient.query.orders.findMany({
        where: eq(orders.userId, userId),
      });
    }),
  allByUser: loggedProcedure
    .input(z.string().optional())
    .query(async ({ input: userId, ctx }) => {
      if (ctx.session?.user.role === "admin" && userId) {
        return await dbClient
          .select()
          .from(orders)
          .where(eq(orders.userId, userId));
      }
      if (!ctx.session?.user.email) return;
      const user = await dbClient.query.users.findFirst({
        where: eq(users.email, ctx.session.user.email),
      });
      if (!user) return;
      return await dbClient
        .select()
        .from(orders)
        .where(eq(orders.userId, user.id));
    }),
});
