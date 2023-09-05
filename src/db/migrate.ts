import { hash } from "bcrypt";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { exit } from "process";
import config from "../../drizzle.config";
import { categories, products, users } from "./schema";

const main = async () => {
  console.log("Starting migration");
  const credentials = config.dbCredentials;
  const url = `postgres://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.database}`;
  const migrationsClient = postgres(url);
  const migratorClient = drizzle(migrationsClient, { logger: false });

  const adminPassword = await hash("admin", 10);
  await migratorClient
    .insert(users)
    .values({
      name: "admin",
      email: "admin@gmail.com",
      password: adminPassword,
      role: "admin",
    })
    .onConflictDoNothing();

  const [fruitsCategory] = await migratorClient
    .insert(categories)
    .values([{ name: "frutas" }])
    .returning();

  const createdProducts = await migratorClient.insert(products).values([
    {
      name: "Platano",
      description: "Platano de canarias",
      price: 1.12,
      categoryId: fruitsCategory.id,
    },
    {
      name: "Pera",
      description: "Pera limonera",
      price: 1.23,
      categoryId: fruitsCategory.id,
    },
    {
      name: "Manzana",
      description: "Manzana verde",
      price: 1.68,
      categoryId: fruitsCategory.id,
    },
    {
      name: "Kiwi",
      description: "Kiwi del norte",
      price: 2.5,
      categoryId: fruitsCategory.id,
    },
    {
      name: "Naranja",
      description: "Naranja de la huerta",
      price: 0.99,
      categoryId: fruitsCategory.id,
    },
    {
      name: "Limón",
      description: "Limón fresco recien recogido de los arboles del campo.",
      price: 1.4,
      categoryId: fruitsCategory.id,
    },
  ]);

  console.log("Migration finished");
};

main()
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    exit();
  });
