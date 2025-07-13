import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Verify database connection with select 1 query
    await db.execute(sql`SELECT 1`);

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Database connection failed" },
      { status: 500 }
    );
  }
}
