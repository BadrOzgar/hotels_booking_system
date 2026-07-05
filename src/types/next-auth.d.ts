import type { DefaultSession } from "next-auth";
import type { SystemRole } from "@/generated/prisma/enums";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      systemRole: SystemRole;
      /** The hotel this user owns, or null for a Super Admin. */
      hotelId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    systemRole: SystemRole;
    hotelId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    systemRole: SystemRole;
    hotelId: string | null;
  }
}
