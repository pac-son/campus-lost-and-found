import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // We now extract collectionInstructions from the request
    const { claimId, foundItemId, action, collectionInstructions } = await request.json();

    if (action === "approve") {
      await prisma.$transaction([
        prisma.claim.update({
          where: { claimId },
          // Save the custom instructions to the database
          data: { claimStatus: "approved", collectionInstructions }, 
        }),
        prisma.foundItem.update({
          where: { foundItemId },
          data: { status: "awaiting_collection" },
        }),
        prisma.claim.updateMany({
          where: { foundItemId, claimId: { not: claimId } },
          data: { claimStatus: "rejected" },
        })
      ]);
    } else if (action === "handover") {
      await prisma.$transaction([
        prisma.claim.update({
          where: { claimId },
          data: { claimStatus: "completed" },
        }),
        prisma.foundItem.update({
          where: { foundItemId },
          data: { status: "returned" },
        })
      ]);
    } else if (action === "reject") {
      await prisma.claim.update({
        where: { claimId },
        data: { claimStatus: "rejected" },
      });
    }

    return NextResponse.json({ message: `Claim ${action}d successfully.` });
  } catch (error) {
    console.error("Resolution error:", error);
    return NextResponse.json({ error: "Failed to resolve claim." }, { status: 500 });
  }
}