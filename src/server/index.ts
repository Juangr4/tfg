import { router } from "@/server/trpc";
import { CategoryRouter } from "./routers/category";
import { PaymentRouter } from "./routers/payment";
import { ProductRouter } from "./routers/product";
import { UsersRouter } from "./routers/user";

export const appRouter = router({
  users: UsersRouter,
  products: ProductRouter,
  categories: CategoryRouter,
  payments: PaymentRouter,
});
export type AppRouter = typeof appRouter;
