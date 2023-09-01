import { type selectProductSchemaType } from "@/lib/types";
import { relations } from "drizzle-orm";
import {
  boolean,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  // price: decimal("price", { scale: 2 }).notNull(),
  price: real("price").notNull(),
  archived: boolean("archived").notNull().default(false),
  categoryId: uuid("categoryId")
    .notNull()
    .references(() => categories.id),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
}));

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productImages = pgTable(
  "images",
  {
    id: uuid("id").defaultRandom().notNull(),
    productId: uuid("productId")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),
    uploaded: boolean("uploaded").notNull().default(false),
  },
  (table) => {
    return {
      pk: primaryKey(table.id, table.productId),
    };
  }
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.id],
    references: [products.id],
  }),
}));

export const userRoles = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  role: userRoles("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
});

export const orderStatus = pgEnum("orderStatus", [
  "requires_payment_method",
  "requires_confirmation",
  "requires_action",
  "processing",
  "requires_capture",
  "canceled",
  "succeeded",
]);

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId"),
  items: json("items")
    .$type<Array<{
      product: selectProductSchemaType;
      amount: number;
    }> | null>()
    .default(null),
  total: real("total").notNull().default(0),
  stripePaymentIntentId: text("stripePaymentIntentId").notNull().unique(),
  status: orderStatus("status"),
  name: text("name"),
  email: text("email"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));
