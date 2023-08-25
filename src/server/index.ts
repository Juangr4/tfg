import { router } from "@/server/trpc";
import { CategoryRouter } from "./routers/category";
import { ProductRouter } from "./routers/product";
import { UsersRouter } from "./routers/user";

export const appRouter = router({
  users: UsersRouter,
  products: ProductRouter,
  categories: CategoryRouter,
});
export type AppRouter = typeof appRouter;
