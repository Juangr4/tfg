import { router } from "@/server/trpc";
import { CategoryRouter } from "./routers/category";
import { OrderRouter } from "./routers/orders";
import { ProductRouter } from "./routers/product";
import { UsersRouter } from "./routers/user";

export const appRouter = router({
  users: UsersRouter,
  products: ProductRouter,
  categories: CategoryRouter,
  orders: OrderRouter,
});
export type AppRouter = typeof appRouter;
