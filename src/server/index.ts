import { products } from "@/db/schema";
import { publicProcedure, router } from "@/server/trpc";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "drizzle" });

export const appRouter = router({
  getProducts: publicProcedure.query(async () => {
    return db.select().from(products).all();
  }),
});
export type AppRouter = typeof appRouter;
