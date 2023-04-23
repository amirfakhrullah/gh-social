"use client";

import { env } from "@/env.mjs";
import { ClerkProvider } from "@clerk/nextjs/app-beta/client";
import React from "react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}
