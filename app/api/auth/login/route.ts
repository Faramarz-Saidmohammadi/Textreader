import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { setSession, type Role } from "@/lib/session";

const inputSchema = z.object({
  email: z.string().email().max(160).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid credentials." }, { status: 400 });

  const rows = await sql<{ userId: string; email: string; passwordHash: string; workspaceId: string; role: Role }[]>`
    select u.id::text as "userId", u.email, u.password_hash as "passwordHash",
           m.workspace_id::text as "workspaceId", m.role
    from users u
    join memberships m on m.user_id = u.id
    where u.email = ${parsed.data.email} and u.status = 'ACTIVE'
    order by m.created_at asc
    limit 1
  `;

  const account = rows[0];
  if (!account || !(await verifyPassword(parsed.data.password, account.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await setSession({ userId: account.userId, workspaceId: account.workspaceId, email: account.email, role: account.role });

  await sql`
    insert into audit_logs (workspace_id, actor_user_id, action, resource_type, metadata)
    values (${account.workspaceId}, ${account.userId}, 'auth.login', 'session', ${sql.json({ method: "password" })})
  `;

  return NextResponse.json({ ok: true });
}
