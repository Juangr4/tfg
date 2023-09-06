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
import { Separator } from "@/components/ui/separator";
import { selectUserSchema, type selectUserSchemaType } from "@/lib/types";
import { useSession } from "next-auth/react";
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
  const { update } = useSession();
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
        setUser(newUser);
        await update(newUser);
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <h3 className="text-xl font-semibold">Profile Settings</h3>

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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email" {...field} />
              </FormControl>
              <FormDescription>
                This is the email that will be used for notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update account</Button>

        <Separator />

        <h3 className="text-xl font-semibold">Update your password</h3>

        <PasswordChanger />
      </form>
    </Form>
  );
};
