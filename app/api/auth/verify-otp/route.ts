import { db } from "@/drizzle/db";
import { users, verificationTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { phone, otp } = await request.json();

  try {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [token] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens?.userId, user.id));

    if (!token || token.token !== otp)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    if (token.expires < new Date())
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
