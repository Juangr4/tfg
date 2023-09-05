import { dbClient } from "@/db";
import { users } from "@/db/schema";
import { insertUserSchema } from "@/lib/types";
import { TRPCError } from "@trpc/server";
import { compare, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  adminProcedure,
  loggedProcedure,
  publicProcedure,
  router,
} from "../trpc";

// TODO: Remove password from returned users to client;
export const UsersRouter = router({
  all: adminProcedure.query(async () => {
    return await dbClient.select().from(users);
  }),
  find: adminProcedure.input(z.string()).query(async ({ input }) => {
    return await dbClient.query.users.findFirst({
      where: eq(users.id, input),
    });
  }),
  findByEmail: loggedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      if (!ctx.session?.user || ctx.session.user.role !== "admin") return;
      return await dbClient.query.users.findFirst({
        where: eq(users.email, input),
      });
    }),
  create: publicProcedure
    .input(insertUserSchema)
    .mutation(async ({ input }) => {
      const hashedPassword = await hash(input.password, 10);
      const newUsers = await dbClient
        .insert(users)
        .values({ ...input, password: hashedPassword })
        .returning();
      return newUsers[0];
    }),
  changePassword: loggedProcedure
    .input(z.object({ oldPassword: z.string(), newPassword: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user.email)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      const user = await dbClient.query.users.findFirst({
        where: eq(users.email, ctx.session.user.email),
      });
      if (!user || !(await compare(input.oldPassword, user.password)))
        throw new TRPCError({ code: "BAD_REQUEST" });
      const hashedPassword = await hash(input.newPassword, 10);
      await dbClient
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.email, ctx.session.user.email));
    }),
  update: loggedProcedure
    .input(insertUserSchema.omit({ password: true }))
    .mutation(async ({ input, ctx }) => {
      if (!input.id) return;
      if (ctx.session?.user.role === "admin") {
        // Admin context -> No problem editing the user.
        const newUsers = await dbClient
          .update(users)
          .set(input)
          .where(eq(users.id, input.id))
          .returning();
        return newUsers[0];
      } else if (ctx.session?.user.email) {
        // User context -> Check if can edit the user.
        console.log("Entre");
        const user = await dbClient.query.users.findFirst({
          where: eq(users.email, ctx.session.user.email),
        });
        if (user?.id !== input.id) return;
        console.log("Edite");
        const newUsers = await dbClient
          .update(users)
          .set(input)
          .where(eq(users.id, input.id))
          .returning();
        return newUsers[0];
      }
    }),
});
