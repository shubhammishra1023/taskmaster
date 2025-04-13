// app/providers.tsx
"use client"
import { ContactProviderButton } from "@/components/contact-provider-button"
import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}