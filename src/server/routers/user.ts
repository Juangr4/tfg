import { dbClient } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const UsersRouter = router({
  all: publicProcedure.query(async () => {
    return await dbClient.select().from(users);
  }),
  find: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await dbClient.query.users.findFirst({
      where: eq(users.id, input),
    });
  }),
});
