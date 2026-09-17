import Link from "next/link";
import { getDashboardSnapshot } from "@/lib/dashboard";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireSession();
  const snapshot = await getDashboardSnapshot(session.workspaceId);

  return (
    <main className="dashboard-content">
      <div className="dashboard-title">
        <div><span className="eyebrow">Overview</span><h1>Workspace health</h1><p>Operational indicators for the current workspace.</p></div>
        <Link className="button primary" href="/dashboard/phrases">Manage phrases</Link>
      </div>

      <section className="kpi-grid" aria-label="Workspace metrics">
        <article className="kpi"><span>Phrase library</span><strong>{snapshot.phraseCount}</strong><small>published and draft phrases</small></article>
        <article className="kpi"><span>Active members</span><strong>{snapshot.memberCount}</strong><small>workspace memberships</small></article>
        <article className="kpi"><span>Usage events</span><strong>{snapshot.usageCount}</strong><small>last 30 days</small></article>
        <article className="kpi"><span>Audit events</span><strong>{snapshot.auditCount}</strong><small>last 30 days</small></article>
      </section>

      <section className="dashboard-grid-two">
        <article className="data-card">
          <div className="card-heading"><div><span className="eyebrow">Recent activity</span><h2>Audit stream</h2></div><span className="status-chip">Server enforced</span></div>
          <div className="activity-list">
            {snapshot.recentAudit.length === 0 ? <p className="muted">No audit events yet.</p> : snapshot.recentAudit.map((item) => (
              <div className="activity-row" key={item.id}><span className="activity-icon">{item.action[0]}</span><div><strong>{item.action}</strong><p>{item.resourceType}</p></div><time>{new Date(item.createdAt).toLocaleDateString()}</time></div>
            ))}
          </div>
        </article>

        <article className="data-card">
          <div className="card-heading"><div><span className="eyebrow">Architecture signal</span><h2>Security posture</h2></div></div>
          <ul className="security-list">
            <li><span>✓</span><div><strong>Workspace-scoped queries</strong><p>Tenant ID is resolved from the signed session, never from client input.</p></div></li>
            <li><span>✓</span><div><strong>Server-side RBAC</strong><p>Mutations require explicit role permissions.</p></div></li>
            <li><span>✓</span><div><strong>HttpOnly signed sessions</strong><p>Session payloads use HMAC integrity and expiration checks.</p></div></li>
            <li><span>✓</span><div><strong>Structured audit events</strong><p>Administrative writes create traceable records.</p></div></li>
          </ul>
        </article>
      </section>
    </main>
  );
}
