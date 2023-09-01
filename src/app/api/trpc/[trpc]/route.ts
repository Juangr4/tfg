import { authOptions } from "@/app/_nextauth/options";
import { appRouter } from "@/server";
import { createContext } from "@/server/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";

const handler = async (req: Request) => {
  const session = await getServerSession(authOptions);

  return await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => await createContext(session),
  });
};

export { handler as GET, handler as POST };
