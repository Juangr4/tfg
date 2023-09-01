"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { useRef, useState, type ChangeEvent, type FC } from "react";

interface ImageUploadProps {
  productId: string;
}

export const ImageUpload: FC<ImageUploadProps> = ({ productId }) => {
  const [file, setFile] = useState<File>();
  const { mutate, isLoading } = trpc.products.images.uploadUrl.useMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0]);
  };

  const uploadImage = async () => {
    if (!file) return;
    mutate(productId, {
      onSuccess(data, variables, context) {
        const formData = new FormData();
        formData.append("file", file);
        fetch(`/api/images/${data}`, {
          method: "post",
          body: formData,
        }).finally(() => {
          toast({
            title: "Completed",
            description: "Image uploads completed successfully",
          });
          if (inputRef.current) inputRef.current.value = "";
          setFile(undefined);
        });
      },
    });
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Images</Label>
      <Input ref={inputRef} type="file" onChange={onImageChange} />
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
