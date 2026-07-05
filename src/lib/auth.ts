import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session_userId")?.value;

  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { userId: parseInt(userId) },
      select: { userId: true, fullName: true, email: true, role: true },
    });
    return user;
  } catch (error) {
    return null;
  }
}