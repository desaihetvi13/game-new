import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { env } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";

const providers = [];

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

providers.push(
  Credentials({
    name: "Admin Login",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = String(credentials?.email || "").trim().toLowerCase();
      const password = String(credentials?.password || "");
      const adminEmail = env.ADMIN_EMAIL.trim().toLowerCase();
      const adminPassword = env.ADMIN_PASSWORD;

      if (!email || !password || !adminEmail || !adminPassword) {
        return null;
      }

      if (email !== adminEmail || password !== adminPassword) {
        return null;
      }

      return {
        id: "admin-local",
        email: adminEmail,
        name: "Admin",
        role: "admin",
      };
    },
  }),
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email && user.id) {
        const normalizedEmail = user.email.toLowerCase();
        const role = user.role || (normalizedEmail === env.ADMIN_EMAIL.toLowerCase() ? "admin" : "user");
        token.role = role;
        try {
          const prisma = getPrisma();
          await prisma.user.upsert({
            where: { id: user.id },
            create: {
              id: user.id,
              email: normalizedEmail,
              name: user.name,
              image: user.image,
              role,
            },
            update: {
              email: normalizedEmail,
              name: user.name,
              image: user.image,
              role,
            },
          });
        } catch {
          // Ignore DB persistence issues to keep auth functional.
        }
      } else if (token?.email) {
        token.role = token.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase() ? "admin" : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: env.NEXTAUTH_SECRET || "dev-secret-change-me-please",
});
