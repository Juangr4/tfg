import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    database: "tfg",
    user: "tfg",
    password: "secretpasw",
  },
  verbose: false,
} satisfies Config;
