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
    const id = Number(foundItemId);
    let updatedRecord = null;

    if (action === "request_dropoff") {
      updatedRecord = await prisma.foundItem.update({
        where: { foundItemId: id },
        data: { 
          adminMessage: message && message.trim() !== "" 
            ? message 
            : "Please bring this item to the Student Affairs office as soon as possible." 
        },
      });
    } else if (action === "mark_received") {
      updatedRecord = await prisma.foundItem.update({
        where: { foundItemId: id },
        data: { 
          custody: "with_admin", 
          adminMessage: "Item safely received by Administration." 
        },
      });
    }

    revalidatePath("/admin", "page");
    revalidatePath("/my-reports", "page");

    // We now send the EXACT record back to the frontend to prove it saved
    return NextResponse.json({ success: true, updatedRecord });
  } catch (error: any) {
    console.error("CUSTODY API ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}