import {
  type insertCategorySchemaType,
  type insertImageSchemaType,
  type insertOrderSchemaType,
  type insertProductSchemaType,
  type insertUserSchemaType,
  type selectCategorySchemaType,
  type selectImageSchemaType,
  type selectProductSchemaType,
  type selectUserSchemaType,
} from "@/lib/types";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { exit } from "process";
import config from "../../drizzle.config";
import { downloadFromUrl } from "../lib/file-manager";
import { categories, orders, productImages, products, users } from "./schema";

const NUMBER_OF_USERS = 10;
const NUMBER_OF_CATEGORIES = 5;
const NUMBER_OF_PRODUCTS = 20;
const NUMBER_OF_IMAGES = 1; // total image files -> NUMBER_OF_IMAGES * NUMBER_OF_PRODUCTS
const NUMBER_OF_ORDERS = 25;

const createRandomUser: (password: string) => insertUserSchemaType = (
  password
) => {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const name = faker.person.fullName({ firstName, lastName });
  const email = faker.internet.email({ firstName, lastName });

  return {
    name,
    email,
    password,
    role: "user",
  };
};

const createRandomProduct: (
  categories: selectCategorySchemaType[]
) => insertProductSchemaType = (categories) => {
  const product: insertProductSchemaType = {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number(faker.finance.amount(0.01, 250, 2)),
    archived: faker.datatype.boolean(0.2),
    categoryId: faker.helpers.arrayElement(categories).id,
  };
  return product;
};

const createRandomOrder: (
  client: selectUserSchemaType,
  products: selectProductSchemaType[]
) => insertOrderSchemaType = (client, products) => {
  const items = faker.helpers.arrayElements(products, 2);
  return {
    name: client.name,
    email: client.email,
    userId: client.id,
    isPaid: faker.datatype.boolean(0.3),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    items,
  };
};

const main = async () => {
  console.log("Starting migration");

  const credentials = config.dbCredentials;
  const url = `postgres://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.database}`;
  const migrationsClient = postgres(url);
  const migratorClient = drizzle(migrationsClient, { logger: false });

  console.log("Drop all table data");

  await migratorClient.delete(orders);
  await migratorClient.delete(productImages);
  await migratorClient.delete(products);
  await migratorClient.delete(categories);
  await migratorClient.delete(users);

  console.log("Populating all table data");
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

  const userPassword = await hash("1234", 10);

  const rawUsers: insertUserSchemaType[] = [];
  for (let i = 0; i < NUMBER_OF_USERS; i++) {
    rawUsers.push(createRandomUser(userPassword));
  }

  const createdUsers = await migratorClient
    .insert(users)
    .values(rawUsers)
    .onConflictDoNothing()
    .returning();

  const rawCategories: insertCategorySchemaType[] = [];
  for (let i = 0; i < NUMBER_OF_CATEGORIES; i++) {
    rawCategories.push({ name: faker.commerce.department() });
  }

  const createdCategories = await migratorClient
    .insert(categories)
    .values(rawCategories)
    .returning();

  const rawProducts: insertProductSchemaType[] = [];
  for (let i = 0; i < NUMBER_OF_PRODUCTS; i++) {
    rawProducts.push(createRandomProduct(createdCategories));
  }

  const createdProducts = await migratorClient
    .insert(products)
    .values(rawProducts)
    .returning();

  // https://byby.dev/node-download-image
  // TODO: Perform image download
  // Be careful with the disk space
  const rawImages: insertImageSchemaType[] = [];
  let product: selectProductSchemaType;
  for (product of createdProducts) {
    for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
      rawImages.push({ productId: product.id, uploaded: true });
    }
  }
  const createdImages = await migratorClient
    .insert(productImages)
    .values(rawImages)
    .returning();

  let image: selectImageSchemaType;
  for (image of createdImages) {
    const url = faker.image.url();
    await downloadFromUrl(url, image.productId, image.id);
  }

  const rawOrders: insertOrderSchemaType[] = [];
  for (let i = 0; i < NUMBER_OF_ORDERS; i++) {
    const client = faker.helpers.arrayElement(createdUsers);
    rawOrders.push(createRandomOrder(client, createdProducts));
  }
  await migratorClient.insert(orders).values(rawOrders);

  console.log("Migration finished");
};

main()
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    exit();
  });
