import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price"),
  archived: integer("archived"),
});
