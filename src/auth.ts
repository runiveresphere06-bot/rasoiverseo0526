import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ADMIN_EMAILS } from "@/lib/constants";
import type { Role } from "@prisma/client";
import { authConfig } from "@/auth.config";

async function syncAdminRole(email: string) {
  const normalized = email.toLowerCase();
  if (ADMIN_EMAILS.includes(normalized as (typeof ADMIN_EMAILS)[number])) {
    await prisma.user.update({
      where: { email: normalized },
      data: { role: "ADMIN" },
    });
    return "ADMIN" as const;
  }
  return null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase();
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(
          String(credentials.password),
          user.passwordHash,
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (user.email) {
        await syncAdminRole(user.email);
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user?.id) {
        token.id = user.id;
      }

      if (user && "role" in user && user.role) {
        token.role = user.role;
      }

      if (user?.id || trigger === "update" || !token.role) {
        const userId = (user?.id ?? token.id) as string | undefined;
        if (userId) {
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role | undefined) ?? "USER";
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email) {
        await syncAdminRole(user.email);
      }
    },
  },
});
