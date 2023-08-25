// https://stackoverflow.com/questions/75902311/next-js-13-and-next-auth-issues-with-usesession-and-sessionprovider

"use client";

import { SessionProvider } from "next-auth/react";

interface NextAuthProviderProps {
  children?: React.ReactNode;
}

export const NextAuthProvider = ({ children }: NextAuthProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
