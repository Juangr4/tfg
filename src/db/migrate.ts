import {
  type insertImageSchemaType,
  type insertOrderSchemaType,
  type insertProductSchemaType,
  type insertReviewSchemaType,
  type insertUserSchemaType,
  type selectCategorySchemaType,
  type selectImageSchemaType,
  type selectProductSchemaType,
  type selectUserSchemaType,
} from "@/lib/types";
import { faker } from "@faker-js/faker";
import { loadEnvConfig } from "@next/env";
import { hash } from "bcrypt";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { cwd, exit } from "process";
import { downloadFromUrl } from "../lib/file-manager";
import {
  categories,
  orders,
  productImages,
  products,
  reviews,
  users,
} from "./schema";

loadEnvConfig(cwd());

const NUMBER_OF_USERS = 15;
const NUMBER_OF_CATEGORIES = 5;
const NUMBER_OF_PRODUCTS = 75;
const NUMBER_OF_IMAGES = 3; // total image files -> NUMBER_OF_IMAGES * NUMBER_OF_PRODUCTS
const NUMBER_OF_ORDERS = 25;
const NUMBER_OF_REVIEWS = 250; // Must be lower than NUMBER_OF_USERS * NUMBER_OF_PRODUCTS;

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

const createRandomReview: (
  user: selectUserSchemaType,
  product: selectProductSchemaType
) => insertReviewSchemaType = (user, product) => {
  return {
    userId: user.id,
    productId: product.id,
    rate: faker.number.int(5),
    title: faker.lorem.words({ min: 1, max: 5 }),
    message: faker.lorem.text(),
  };
};

const main = async () => {
  console.log("Starting migration");

  const migrationsClient = postgres(process.env.DATABASE_URL as string);
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

  const rawUsers = faker.helpers.multiple(
    () => createRandomUser(userPassword),
    { count: NUMBER_OF_USERS }
  );

  const createdUsers = await migratorClient
    .insert(users)
    .values(rawUsers)
    .onConflictDoNothing()
    .returning();

  const rawCategories = faker.helpers.multiple(
    () => ({
      name: faker.commerce.department(),
    }),
    { count: NUMBER_OF_CATEGORIES }
  );

  const createdCategories = await migratorClient
    .insert(categories)
    .values(rawCategories)
    .returning();

  const rawProducts = faker.helpers.multiple(
    () => createRandomProduct(createdCategories),
    { count: NUMBER_OF_PRODUCTS }
  );

  const createdProducts = await migratorClient
    .insert(products)
    .values(rawProducts)
    .returning();

  // https://byby.dev/node-download-image
  if (NUMBER_OF_IMAGES > 0) {
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
  }

  if (NUMBER_OF_ORDERS > 0) {
    const rawOrders: insertOrderSchemaType[] = [];
    for (let i = 0; i < NUMBER_OF_ORDERS; i++) {
      const client = faker.helpers.arrayElement(createdUsers);
      rawOrders.push(createRandomOrder(client, createdProducts));
    }
    await migratorClient.insert(orders).values(rawOrders);
  }

  if (
    NUMBER_OF_REVIEWS > 0 &&
    NUMBER_OF_REVIEWS <= NUMBER_OF_PRODUCTS * NUMBER_OF_USERS
  ) {
    const memory = faker.helpers.shuffle(
      createdUsers.flatMap((user) =>
        createdProducts.map((product) => ({ user, product }))
      )
    );
    const rawReviews: insertReviewSchemaType[] = [];
    for (let i = 0; i < NUMBER_OF_REVIEWS; i++) {
      const data = memory.pop();
      if (!data) break;
      rawReviews.push(createRandomReview(data.user, data.product));
    }

    await migratorClient.insert(reviews).values(rawReviews);
  }

  console.log("Migration finished");
};

main()
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    exit();
  });
