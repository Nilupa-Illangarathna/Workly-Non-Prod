// lib/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/drizzle/schema";
import { env } from "@/data/env/server";
import postgres from "postgres";

const client = postgres(env.DATABASE_URL, {
  prepare: false,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  max: 10,
});

export const db = drizzle(client, { schema });
