import postgres from "postgres";
import { env } from "@/lib/env";

const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

export const sql = globalForDb.sql ?? postgres(env().DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
});

if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;
