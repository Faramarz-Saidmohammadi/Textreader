import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import { listPhrases } from "@/lib/phrases";
import { assertPermission } from "@/lib/rbac";
import { getSession } from "@/lib/session";

const phraseSchema = z.object({
  title: z.string().trim().min(2).max(80),
  body: z.string().trim().min(2).max(280),
  category: z.string().trim().min(2).max(40),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  assertPermission(session.role, "phrase:read");
  return NextResponse.json({ phrases: await listPhrases(session.workspaceId) });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    assertPermission(session.role, "phrase:create");
  } catch {
    return NextResponse.json({ error: "Your role cannot create phrases." }, { status: 403 });
  }

  const parsed = phraseSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid phrase data.", issues: parsed.error.issues }, { status: 400 });

  const phrase = await sql.begin(async (tx) => {
    const rows = await tx<{ id: string; title: string; body: string; category: string; status: string }[]>`
      insert into phrases (workspace_id, created_by, title, body, category, status)
      values (${session.workspaceId}, ${session.userId}, ${parsed.data.title}, ${parsed.data.body}, ${parsed.data.category}, 'DRAFT')
      returning id::text, title, body, category, status
    `;

    await tx`
      insert into audit_logs (workspace_id, actor_user_id, action, resource_type, resource_id, metadata)
      values (${session.workspaceId}, ${session.userId}, 'phrase.created', 'phrase', ${rows[0].id}, ${tx.json({ category: parsed.data.category })})
    `;
    return rows[0];
  });

  return NextResponse.json({ phrase }, { status: 201 });
}
