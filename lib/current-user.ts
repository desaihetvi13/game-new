import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";

export async function getCurrentDbUser() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;

  const prisma = getPrisma();
  return prisma.user.findFirst({
    where: { email },
    select: { id: true, email: true, role: true },
  });
}
