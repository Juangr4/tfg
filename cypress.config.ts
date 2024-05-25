/* eslint-disable import/first */
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import { dbClient } from "@/db";
import {
  categories,
  orders,
  productImages,
  products,
  users,
} from "@/db/schema";
import {
  type insertCategorySchemaType,
  type insertProductSchemaType,
} from "@/lib/types";
import { hash } from "bcrypt";
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      on("task", {
        "db:seed": async () => {
          // Removing all table data
          await dbClient.delete(orders);
          await dbClient.delete(productImages);
          await dbClient.delete(products);
          await dbClient.delete(categories);
          await dbClient.delete(users);
          await dbClient
            .insert(users)
            .values([
              {
                name: "admin",
                email: "admin@gmail.com",
                password: await hash("admin", 10),
                role: "admin",
              },
              {
                name: "prueba",
                email: "prueba@gmail.com",
                password: await hash("Prueba123", 10),
                role: "user",
              },
            ])
            .onConflictDoNothing();
          const rawCategories: insertCategorySchemaType[] = [
            {
              name: "Prueba 1",
            },
            {
              name: "Prueba 2",
            },
            {
              name: "Prueba 3",
            },
          ];
          const createdCategories = await dbClient
            .insert(categories)
            .values(rawCategories)
            .returning();
          const rawProducts: insertProductSchemaType[] = [
            {
              name: "Prueba 1.1",
              description: "Producto de prueba 1 de la categoria 1",
              price: 1.99,
              archived: false,
              categoryId: createdCategories[0].id,
            },
            {
              name: "Prueba 1.2",
              description: "Producto de prueba 2 de la categoria 1",
              price: 2.99,
              archived: true,
              categoryId: createdCategories[0].id,
            },
            {
              name: "Prueba 1.3",
              description: "Producto de prueba 3 de la categoria 1",
              price: 3.99,
              archived: false,
              categoryId: createdCategories[0].id,
            },
            {
              name: "Prueba 2.1",
              description: "Producto de prueba 1 de la categoria 2",
              price: 29,
              archived: false,
              categoryId: createdCategories[1].id,
            },
            {
              name: "Prueba 2.2",
              description: "Producto de prueba 2 de la categoria 2",
              price: 39.98,
              archived: false,
              categoryId: createdCategories[1].id,
            },
            {
              name: "Prueba 3.1",
              description: "Producto de prueba 1 de la categoria 3",
              price: 99.99,
              archived: false,
              categoryId: createdCategories[2].id,
            },
          ];
          return await dbClient
            .insert(products)
            .values(rawProducts)
            .returning();
        },
      });
    },
  },
});
