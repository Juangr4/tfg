import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { exit } from "process";
import config from "../../drizzle.config";
import { users } from "./schema";

const main = async () => {
  console.log("Starting migration");
  const credentials = config.dbCredentials;
  const url = `postgres://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.database}`;
  const migrationsClient = postgres(url);
  const migratorClient = drizzle(migrationsClient, { logger: false });

  await migratorClient.insert(users).values({
    name: "admin",
    email: "admin@gmail.com",
    password: "1234",
  });
  console.log("Migration finished");
};

main()
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    exit();
  });
