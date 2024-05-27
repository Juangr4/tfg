"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { insertUserSchema, type insertUserSchemaType } from "@/lib/types";
import { handleFormErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { trpc } from "../_trpc/client";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<insertUserSchemaType>({
    resolver: zodResolver(insertUserSchema),
  });
  const { mutate } = trpc.users.create.useMutation();
  const { toast } = useToast();

  const onSubmit = async (data: insertUserSchemaType) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/");
      },
      onError(error, variables, context) {
        if (
          error.message.includes(
            "duplicate key value violates unique constraint"
          )
        ) {
          toast({
            title: "Error",
            description: "Email already used.",
            variant: "destructive",
          });
        }
        if (error.message === "Invalid email.") {
          toast({
            title: "Error",
            description: "Invalid email.",
            variant: "destructive",
          });
        }
        if (!error.data?.zodError) return;
        handleFormErrors(error.data.zodError, form);
      },
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Fill the form below to create a new account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full">Register</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
