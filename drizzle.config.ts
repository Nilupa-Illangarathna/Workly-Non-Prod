import { defineConfig } from "drizzle-kit";
import { env } from "./data/env/server";

export default defineConfig({
  out: "./drizzle/migrations", // ✅ Where to store migration files
  schema: "./drizzle/schema.ts", // ✅ Path to schema file
  dialect: "postgresql", // ✅ PostgreSQL is the database
  dbCredentials: {
    url: env.DATABASE_URL, // ✅ Connection URL
    ssl: false, // ✅ Disable SSL
  },
  strict: true, // ✅ Enforce strict mode
  verbose: true, // ✅ Enable verbose mode
});
