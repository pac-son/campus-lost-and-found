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
    
    // Safety check: Ensure Prisma reads the ID as an integer
    const id = Number(foundItemId);

    if (action === "request_dropoff") {
      await prisma.foundItem.update({
        where: { foundItemId: id },
        data: { 
          // If the admin leaves the box blank, force a default message so it never saves as a falsy empty string
          adminMessage: message && message.trim() !== "" 
            ? message 
            : "Please bring this item to the Student Affairs office as soon as possible." 
        },
      });
    } else if (action === "mark_received") {
      await prisma.foundItem.update({
        where: { foundItemId: id },
        data: { 
          custody: "with_admin", 
          adminMessage: "Item safely received by Administration." 
        },
      });
    }

    // Force Next.js to purge the cache for both dashboards immediately
    revalidatePath("/admin", "page");
    revalidatePath("/my-reports", "page");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CUSTODY API ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}