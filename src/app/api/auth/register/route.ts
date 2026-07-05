import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { fullName, email, phoneNumber, password } = await request.json();

    // 1. Basic validation
    if (!fullName || !email || !phoneNumber || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // 2. Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    // 3. Hash the password securely before saving
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create the new user record in the database[cite: 13]
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        phoneNumber,
        passwordHash,
        role: "user", // Default role as specified in the requirements[cite: 13]
      },
    });

    return NextResponse.json(
      { message: "Account created successfully.", userId: newUser.userId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred during registration." },
      { status: 500 }
    );
  }
}