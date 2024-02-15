import { drizzle } from "drizzle-orm/mysql2";
import { env } from "@/env.mjs";
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USERNAME,
  database: env.DATABASE_NAME,
  password: env.DATABASE_PASSWORD,
  port: Number(env.DATABASE_PORT),
});

export const db = drizzle(connection);
