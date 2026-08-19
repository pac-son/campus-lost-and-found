import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { foundItemId, action, message } = await request.json();

    if (action === "request_dropoff") {
      await prisma.foundItem.update({
        where: { foundItemId },
        data: { adminMessage: message },
      });
    } else if (action === "mark_received") {
      await prisma.foundItem.update({
        where: { foundItemId },
        data: { custody: "with_admin", adminMessage: "Item safely received by Administration." },
      });
    }

    revalidatePath("/admin");
    revalidatePath("/my-reports");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}