import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { itemName, categoryId, description, locationLost, dateLost, userId } = data;

    if (!itemName || !categoryId || !locationLost || !dateLost) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const newLostItem = await prisma.lostItem.create({
      data: {
        itemName,
        categoryId: parseInt(categoryId),
        description,
        locationLost,
        dateLost: new Date(dateLost),
        userId: userId || 1, 
      },
    });

    return NextResponse.json({ message: "Lost item reported!", item: newLostItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}