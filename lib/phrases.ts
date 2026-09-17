import { sql } from "@/lib/db";

export type Phrase = { id: string; title: string; body: string; category: string; status: string };

export async function listPhrases(workspaceId: string): Promise<Phrase[]> {
  const rows = await sql<Phrase[]>`
    select id::text, title, body, category, status
    from phrases
    where workspace_id = ${workspaceId}
    order by created_at desc
    limit 100
  `;
  return rows;
}
