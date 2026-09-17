import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await sql`select 1`;
    return NextResponse.json({ status: "ok", service: "voxora", database: "reachable" });
  } catch {
    return NextResponse.json({ status: "degraded", service: "voxora", database: "unreachable" }, { status: 503 });
  }
}
