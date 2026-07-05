import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  (await cookies()).delete("session_userId");
  return NextResponse.json({ message: "Logged out." });
}