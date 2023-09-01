import { TRPCError, initTRPC } from "@trpc/server";
import { type Session } from "next-auth";
import { ZodError } from "zod";

// https://trpc.io/docs/server/context
// https://github.com/t3-oss/create-t3-turbo/blob/main/apps/nextjs/src/app/api/trpc/[trpc]/route.ts
export async function createContext(session: Session | null) {
  return {
    session,
  };
}

export const createTRPCContext = () => {};

const t = initTRPC.context<typeof createContext>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

const isLogged = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return await next({ ctx });
});

export const loggedProcedure = publicProcedure.use(isLogged);

const isAdmin = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user || ctx.session.user.role !== "admin")
    throw new TRPCError({ code: "UNAUTHORIZED" });
  return await next({ ctx });
});

export const adminProcedure = publicProcedure.use(isAdmin);
