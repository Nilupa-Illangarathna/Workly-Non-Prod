import "dotenv/config";
import { db } from "@/drizzle/db"; // Import Drizzle DB instance
import { users } from "@/drizzle/schema/users";
import { hash } from "bcryptjs"; // Hash password
import { eq } from "drizzle-orm";

async function seed() {
  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.role, "admin"));

  if (existingAdmin.length > 0) {
    console.log("Admin already exists!");
    return;
  }

  const passwordHash = await hash("admin@5799", 10);

  await db.insert(users).values({
    worklyid: "WCS0001",
    firstname: "Admin",
    lastname: "User",
    nicnumber: "123456789V",
    dateofbirth: new Date(),
    phone: "0712345678",
    whatsapp: "0712345678",
    email: "admin@workly.cloud",
    is_email_verified: true,
    is_phone_verified: true,
    language: "sinhala",
    address: "123, Admin Street",
    district: "Colombo",
    country: "Sri Lanka",
    loginid: "wcsadmin",
    password: passwordHash,
    role: "admin",
    status: "approved",
  });

  console.log("Admin user inserted!");
}

seed().catch(console.error);
