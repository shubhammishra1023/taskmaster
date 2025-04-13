import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      providerProfile?: {
        id: string;
        serviceType: string;
        verified: boolean;
      } | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    providerProfile?: {
      id: string;
      serviceType: string;
      verified: boolean;
    } | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    providerProfile?: {
      id: string;
      serviceType: string;
      verified: boolean;
    } | null;
  }
}