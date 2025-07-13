"use server";

import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { users } from "@/drizzle/schema";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { inputPassword, userId } = await request.json();

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.worklyid, userId));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(inputPassword, user.password);

    return NextResponse.json({ valid: isMatch });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
