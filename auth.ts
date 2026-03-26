import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";

const providers = [];
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email && user.id) {
        const normalizedEmail = user.email.toLowerCase();
        const role = normalizedEmail === env.ADMIN_EMAIL.toLowerCase() ? "admin" : "user";
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
