import { appRouter } from "@/server";

export const serverClient = appRouter.createCaller({
  session: {
    user: {
      role: "admin",
    },
    expires: "",
  },
});
