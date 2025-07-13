import { db } from "@/drizzle/db";
import { users, verificationTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { phone, otp } = await request.json();

  try {
    // Find user by phone
    const user = (
      await db.select().from(users).where(eq(users.loginid, phone))
    )[0];

    if (!user.phone) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete existing tokens
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.userId, user.id));

    // Create new verification token
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 30);

    await db.insert(verificationTokens).values({
      userId: user.id,
      token: otp.toString(),
      expires,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
