import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session || role !== "admin") {
    return null;
  }
  return session;
}
