import { relations } from "drizzle-orm";
import {
  boolean,
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
  price: real("price").notNull(),
  archived: boolean("archived").notNull().default(false),
  categoryId: uuid("categoryId")
    .notNull()
    .references(() => categories.id),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "string" }),
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
  updatedAt: timestamp("updatedAt", { mode: "string" }),
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
  updatedAt: timestamp("updatedAt", { mode: "string" }),
});
