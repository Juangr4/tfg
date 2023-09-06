import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
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

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull().default(""),
    message: text("message").notNull().default(""),
    rate: integer("rate").notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("productId").references(() => products.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
  },
  (table) => {
    return {
      unq: unique("already_rated").on(table.userId, table.productId),
    };
  }
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
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
    fields: [productImages.productId],
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

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId"),
  // Removed type of items because it give problems
  items: json("items").default(null),
  total: real("total").notNull().default(0),
  isPaid: boolean("isPaid").notNull().default(false),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));
