import { existsSync } from "fs";
import { mkdir, rm } from "fs/promises";
import sharp from "sharp";

export const saveImage = async (file: File, path: string, filename: string) => {
  const actualPath = process.cwd();
  const filePath = `${actualPath}/public/images/${path}`;

  if (!existsSync(filePath)) await mkdir(filePath, { recursive: true });

  const bytes = await file.arrayBuffer();
  const imageBuffer = Buffer.from(bytes);
  const info = await sharp(imageBuffer).toFile(
    `${actualPath}/public/images/${path}/${filename}.webp`
  );

  return info;
};

export const existsImage = (path: string, filename: string) => {
  return existsSync(`${process.cwd()}/public/images/${path}/${filename}.webp`);
};

export const removeImage = async (path: string, filename: string) => {
  try {
    await rm(`${process.cwd()}/public/images/${path}/${filename}.webp`);
  } catch (error) {}
};

export const removeImageFolder = async (path: string) => {
  try {
    await rm(`${process.cwd()}/public/images/${path}`, {
      recursive: true,
    });
  } catch (error) {}
};

export const downloadFromUrl = async (
  url: string,
  path: string,
  filename: string
) => {
  const actualPath = process.cwd();
  const filePath = `${actualPath}/public/images/${path}`;

  if (!existsSync(filePath)) await mkdir(filePath, { recursive: true });

  const imageBuffer = await (await fetch(url)).arrayBuffer();

  await sharp(imageBuffer).toFile(
    `${actualPath}/public/images/${path}/${filename}.webp`
  );
};
