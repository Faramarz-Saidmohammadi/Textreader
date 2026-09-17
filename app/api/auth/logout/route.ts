import { NextResponse } from "next/server";
import { clearSession, getSession } from "@/lib/session";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getSession();
  if (session) {
    await sql`
      insert into audit_logs (workspace_id, actor_user_id, action, resource_type, metadata)
      values (${session.workspaceId}, ${session.userId}, 'auth.logout', 'session', ${sql.json({})})
    `;
  }
  await clearSession();
  return NextResponse.redirect(new URL("/login", request.url), 303);
}
