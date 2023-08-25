import { dbClient } from "@/db";
import { productImages } from "@/db/schema";
import { existsImage, saveImage } from "@/lib/file-manager";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { imageId: string } }
) => {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return new NextResponse("FormData doesn't contain any file", {
        status: 400,
      });
    }

    const image = await dbClient.query.productImages.findFirst({
      where: eq(productImages.id, params.imageId),
    });

    if (!image || image.uploaded || existsImage(image.productId, image.id)) {
      return new NextResponse("Not Found", {
        status: 404,
      });
    }

    await dbClient.transaction(async (tx) => {
      await tx
        .update(productImages)
        .set({
          uploaded: true,
        })
        .where(eq(productImages.id, image.id));
      const info = await saveImage(file, image.productId, image.id);
      console.log(info);
    });

    return new NextResponse("Upload Completed", { status: 200 });
  } catch (error) {
    console.log("[ERROR_UPLOADING_IMAGE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
