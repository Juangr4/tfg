import { loadEnvConfig } from "@next/env";
import type { Config } from "drizzle-kit";
import { cwd } from "process";

loadEnvConfig(cwd());

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: false,
} satisfies Config;
