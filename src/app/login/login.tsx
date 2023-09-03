"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function SignInForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const searchParams = useSearchParams();

  const onLogin = async () => {
    await signIn("credentials", {
      email,
      password,
      callbackUrl: searchParams.get("callbackUrl") ?? "/",
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Enter your account email and password below to login.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(ev) => {
              setEmail(ev.target.value);
            }}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(ev) => {
              setPassword(ev.target.value);
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="grid gap-4">
        <Button onClick={onLogin} className="w-full">
          Login
        </Button>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">
            Or create an account{" "}
            <Link href={"/register"} className="hover:underline">
              there.
            </Link>
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
