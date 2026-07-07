import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import type { SystemRole } from "@/generated/prisma/enums";

/** Thrown instead of a generic sign-in failure so the login page can show a distinct message. */
export class AccountSuspendedError extends CredentialsSignin {
  code = "account_suspended";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { ownedHotel: { select: { id: true, accountStatus: true } } },
        });
        if (!user?.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // A suspended hotel account is fully locked out until reactivated by the Super Admin.
        if (user.ownedHotel?.accountStatus === "SUSPENDED") throw new AccountSuspendedError();

        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          systemRole: user.systemRole,
          hotelId: user.ownedHotel?.id ?? null,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.systemRole = user.systemRole;
        token.hotelId = user.hotelId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.systemRole = token.systemRole as SystemRole;
        session.user.hotelId = token.hotelId as string | null;
      }
      return session;
    },
  },
});
