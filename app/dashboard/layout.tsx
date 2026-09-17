import Link from "next/link";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard"><span className="brand-mark">V</span><span>Voxora</span></Link>
        <nav>
          <Link className="active" href="/dashboard">Overview</Link>
          <Link href="/dashboard/phrases">Phrase library</Link>
          <span className="nav-disabled">Analytics</span>
          <span className="nav-disabled">Members & roles</span>
          <span className="nav-disabled">API keys</span>
          <span className="nav-disabled">Audit log</span>
        </nav>
        <div className="sidebar-user">
          <span className="avatar">{session.role.slice(0, 1)}</span>
          <div><strong>{session.email}</strong><small>{session.role} · Workspace</small></div>
        </div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div><span className="eyebrow">Voxora workspace</span><strong>Operations</strong></div>
          <form action="/api/auth/logout" method="post"><button className="button ghost" type="submit">Sign out</button></form>
        </header>
        {children}
      </div>
    </div>
  );
}
