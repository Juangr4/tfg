"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState, type ChangeEvent, type FC } from "react";

interface ImageUploadProps {
  productId: string;
}

export const ImageUpload: FC<ImageUploadProps> = ({ productId }) => {
  const [file, setFile] = useState<File>();
  const { mutate, isLoading } = trpc.products.images.uploadUrl.useMutation();

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0]);
  };

  const uploadImage = async () => {
    if (!file) return;
    mutate(productId, {
      onSuccess(data, variables, context) {
        console.log(data);
        const formData = new FormData();
        formData.append("file", file);
        fetch(`/api/images/${data}`, {
          method: "post",
          body: formData,
        });
      },
    });
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Imagenes</Label>
      <Input id="picture" type="file" onChange={onImageChange} />
      {file && (
        <Image
          src={`${URL.createObjectURL(file)}`}
          alt="Uploaded image"
          width={256}
          height={256}
        />
      )}
      <Button disabled={isLoading || !file} onClick={uploadImage}>
        Upload image
      </Button>
    </div>
  );
};
