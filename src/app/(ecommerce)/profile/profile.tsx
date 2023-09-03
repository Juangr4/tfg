"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { selectUserSchema, type selectUserSchemaType } from "@/lib/types";
import { signOut } from "next-auth/react";
import { useState, type FC } from "react";
import { type z } from "zod";
import { trpc } from "../../_trpc/client";
import { PasswordChanger } from "./password-changer";

interface AccountFormProps {
  user: selectUserSchemaType;
}

const profileSchema = selectUserSchema.omit({
  password: true,
  createdAt: true,
  role: true,
});

export const AccountForm: FC<AccountFormProps> = ({ user: defaultValues }) => {
  const [user, setUser] = useState(defaultValues);
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: user,
  });
  const { mutate } = trpc.users.update.useMutation();

  function onSubmit(data: z.infer<typeof profileSchema>) {
    mutate(data, {
      async onSuccess(newUser, variables, context) {
        if (!newUser) return;
        await signOut({ callbackUrl: "/login" });
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your email" {...field} />
              </FormControl>
              <FormDescription>
                This is the email that will be used in your purchases.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update account</Button>

        <PasswordChanger />
      </form>
    </Form>
  );
};
