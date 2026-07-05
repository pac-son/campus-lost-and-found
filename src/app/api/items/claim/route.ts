import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { foundItemId, claimantId, verificationAnswer } = await request.json();

    const newClaim = await prisma.claim.create({
      data: {
        foundItemId,
        claimantId,
        verificationAnswer,
        claimStatus: "pending",
      },
    });

    return NextResponse.json({ message: "Claim submitted for review.", claim: newClaim }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit claim." }, { status: 500 });
  }
}