import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { itemName, categoryId, description, locationFound, dateFound } = data;

    // Basic validation
    if (!itemName || !categoryId || !locationFound || !dateFound) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Create the found item in the database
    const newItem = await prisma.foundItem.create({
      data: {
        itemName,
        categoryId: parseInt(categoryId),
        description,
        locationFound,
        dateFound: new Date(dateFound), // Convert string to Date object
        userId: user.userId, 
      },
    });

    return NextResponse.json({ message: "Item reported successfully!", item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating found item:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}