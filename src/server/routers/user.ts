import { dbClient } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, loggedProcedure, router } from "../trpc";

export const UsersRouter = router({
  all: adminProcedure.query(async () => {
    return await dbClient.select().from(users);
  }),
  find: loggedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    return await dbClient.query.users.findFirst({
      where: eq(users.id, input),
    });
  }),
});
