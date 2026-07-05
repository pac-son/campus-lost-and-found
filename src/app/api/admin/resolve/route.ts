import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { claimId, foundItemId, action } = await request.json(); // action: 'approve' | 'reject'

    if (action === "approve") {
      // Use a transaction to ensure both updates happen together
      await prisma.$transaction([
        // 1. Update the specific claim to approved
        prisma.claim.update({
          where: { claimId },
          data: { claimStatus: "approved" },
        }),
        // 2. Update the found item to returned
        prisma.foundItem.update({
          where: { foundItemId },
          data: { status: "returned" },
        }),
        // 3. Optional: Reject all other pending claims for this item
        prisma.claim.updateMany({
          where: { 
            foundItemId, 
            claimId: { not: claimId } 
          },
          data: { claimStatus: "rejected" },
        })
      ]);
    } else {
      // If rejected, just update the claim status
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