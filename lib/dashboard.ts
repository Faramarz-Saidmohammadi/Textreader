import { sql } from "@/lib/db";

export async function getDashboardSnapshot(workspaceId: string) {
  const [counts, recentAudit] = await Promise.all([
    sql<{ phrase_count: number; member_count: number; usage_count: number; audit_count: number }[]>`
      select
        (select count(*)::int from phrases where workspace_id = ${workspaceId}) phrase_count,
        (select count(*)::int from memberships where workspace_id = ${workspaceId}) member_count,
        (select count(*)::int from usage_events where workspace_id = ${workspaceId} and created_at >= now() - interval '30 days') usage_count,
        (select count(*)::int from audit_logs where workspace_id = ${workspaceId} and created_at >= now() - interval '30 days') audit_count
    `,
    sql<{ id: string; action: string; resourceType: string; createdAt: string }[]>`
      select id::text, action, resource_type as "resourceType", created_at::text as "createdAt"
      from audit_logs where workspace_id = ${workspaceId}
      order by created_at desc limit 6
    `,
  ]);

  const c = counts[0] ?? { phrase_count: 0, member_count: 0, usage_count: 0, audit_count: 0 };
  return { phraseCount: c.phrase_count, memberCount: c.member_count, usageCount: c.usage_count, auditCount: c.audit_count, recentAudit };
}
