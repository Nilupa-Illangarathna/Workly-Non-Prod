import { db } from "@/drizzle/db";
import { users, verificationTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { phone, password } = await request.json();

  try {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, user.id));

    // Delete verification token
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
