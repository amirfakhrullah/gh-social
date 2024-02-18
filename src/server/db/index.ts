import { env } from "@/env.mjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(env.NEON_DB_URL);
export const db = drizzle(sql);
