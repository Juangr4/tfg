"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  insertReviewSchema,
  type insertReviewSchemaType,
  type selectProductSchemaType,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { type FC } from "react";
import { useForm } from "react-hook-form";

interface ProductsReviewsProps {
  product: selectProductSchemaType;
}

export const ProductReviews: FC<ProductsReviewsProps> = ({ product }) => {
  const { toast } = useToast();

  const { data: reviews, refetch } = trpc.products.reviews.all.useQuery(
    product.id,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { mutate: postReview, isLoading } =
    trpc.products.reviews.create.useMutation();
  const form = useForm<insertReviewSchemaType>({
    defaultValues: {
      productId: product.id,
      rate: 0,
    },
    resolver: zodResolver(insertReviewSchema.omit({ userId: true })),
  });

  const { data: session } = useSession();

  const onSubmit = (data: insertReviewSchemaType) => {
    postReview(data, {
      onSuccess(data, variables, context) {
        refetch();
      },
      onError(error, variables, context) {
        if (error.data?.stack?.includes("already_rated"))
          toast({
            title: "Error",
            description: "You have already rated that product",
            variant: "destructive",
          });
        if (!error.data?.zodError) return;
        const errors = error.data.zodError.fieldErrors;
        for (const key in errors) {
          const issues = errors[key];
          issues?.forEach((issue) => {
            form.setError(key as keyof insertReviewSchemaType, {
              type: "custom",
              message: issue,
            });
          });
        }
      },
    });
  };

  return (
    <>
      <div id="reviews" className="grid grid-cols-3 gap-y-8 p-4">
        {!reviews ||
          (reviews.length === 0 && (
            <div className="col-span-3">
              No reviews were found for that product.
            </div>
          ))}
        {reviews?.map((review) => (
          <SingleReview key={review.id} review={review} />
        ))}
        <Separator className="col-span-3" />
      </div>
      <div className="space-y-4 border p-4 rounded-lg">
        <h3 className="text-lg text-center font-semibold">
          Add you own review of the product
        </h3>
        {!session && (
          <h4 className="text-lg font-medium text-center underline text-gray-700">
            You must be logged to post a review of a product
          </h4>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-4 gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={!session} placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Rate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={!session}
                      placeholder="3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!session}
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!session || isLoading}
              className="col-start-2 col-span-2"
            >
              {!session ? "Login before posting the review" : "Post review"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

const SingleReview = ({
  review,
}: {
  review: {
    name: string | null;
    rate: number;
    title: string;
    message: string;
    createAt: string | null;
  };
}) => {
  return (
    <>
      <div>
        <p className="font-semibold">{review.name}</p>
        <p>Mayo 16, 2021</p>
      </div>
      <div className="col-span-2 grid gap-2">
        <div className="flex gap-1 items-center">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <StarIcon
                key={i}
                className={cn("h-5 w-5", i >= review.rate ? "opacity-25" : "")}
              />
            ))}
          <span className="text-lg ml-4">{review.rate}</span>
        </div>
        <p className="font-semibold">{review.title}</p>
        <p>{review.message}</p>
      </div>
    </>
  );
};
