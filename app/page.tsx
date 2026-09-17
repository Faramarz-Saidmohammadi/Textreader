import Link from "next/link";

const capabilities = [
  ["Workspace governance", "Organize teams, roles, phrase libraries, and access boundaries per workspace."],
  ["Accessible voice tools", "Compose and speak messages with browser-native speech controls and reusable phrase collections."],
  ["Usage intelligence", "Track adoption, activity, and usage events without exposing sensitive message content."],
  ["API-ready platform", "Integrate approved phrase libraries into kiosks, portals, and internal service workflows."],
  ["Auditability", "Record administrative changes and security-relevant actions for operational review."],
  ["Subscription foundation", "Plan and usage models are represented in the domain so billing can evolve without rewrites."],
] as const;

export default function HomePage() {
  return (
    <main>
      <nav className="nav shell">
        <Link className="brand" href="/" aria-label="Voxora home">
          <span className="brand-mark">V</span>
          <span>Voxora</span>
        </Link>
        <div className="nav-links">
          <a href="#platform">Platform</a>
          <a href="#architecture">Architecture</a>
          <Link className="button ghost" href="/login">Sign in</Link>
          <Link className="button primary" href="/login">Open workspace</Link>
        </div>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <span className="pill">Multi-tenant accessibility platform</span>
          <h1>Make voice communication operational, secure, and measurable.</h1>
          <p>
            Voxora gives service teams one governed workspace for reusable communication phrases,
            browser-based speech, role-aware collaboration, APIs, audit trails, and usage insight.
          </p>
          <div className="hero-actions">
            <Link className="button primary large" href="/login">Explore the dashboard</Link>
            <a className="button ghost large" href="#architecture">View architecture</a>
          </div>
          <div className="trust-row">
            <span>No speech audio is uploaded</span>
            <span>Workspace-scoped data</span>
            <span>API-first domain model</span>
          </div>
        </div>

        <div className="hero-panel" aria-label="Voxora product preview">
          <div className="panel-top">
            <span className="dot" /><span className="dot" /><span className="dot" />
            <strong>Operations workspace</strong>
          </div>
          <div className="metric-grid">
            <div><small>Phrase usage</small><strong>12,480</strong><span>+18.6% this month</span></div>
            <div><small>Active members</small><strong>28</strong><span>4 roles configured</span></div>
            <div><small>API requests</small><strong>31.2k</strong><span>99.98% accepted</span></div>
            <div><small>Audit events</small><strong>184</strong><span>7-day review window</span></div>
          </div>
          <div className="activity-preview">
            <span className="activity-icon">A</span>
            <div><strong>Library published</strong><p>Front Desk — Essential Phrases v4</p></div>
            <time>2m</time>
          </div>
          <div className="activity-preview">
            <span className="activity-icon">R</span>
            <div><strong>Role updated</strong><p>Trainer group changed to Editor</p></div>
            <time>19m</time>
          </div>
        </div>
      </section>

      <section id="platform" className="section shell">
        <div className="section-heading">
          <span className="eyebrow">Platform capabilities</span>
          <h2>Designed as a SaaS system, not a single-page demo.</h2>
          <p>Every core feature maps to a maintainable product boundary: identity, tenancy, content, usage, auditing, API access, and billing.</p>
        </div>
        <div className="feature-grid">
          {capabilities.map(([title, description], index) => (
            <article className="feature-card" key={title}>
              <span className="feature-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="architecture" className="section shell architecture">
        <div className="section-heading">
          <span className="eyebrow">Engineering depth</span>
          <h2>Production-oriented boundaries from the first commit.</h2>
        </div>
        <div className="architecture-grid">
          <div className="stack-card"><small>Application</small><strong>Next.js 16 + React 19</strong><p>App Router, Server Components, route handlers, strict TypeScript.</p></div>
          <div className="stack-card"><small>Data</small><strong>PostgreSQL</strong><p>Workspace-scoped relational model with indexes, constraints, and audit records.</p></div>
          <div className="stack-card"><small>Security</small><strong>Signed sessions + RBAC</strong><p>HttpOnly session cookies, scrypt password hashing, server-enforced permissions.</p></div>
          <div className="stack-card"><small>Operations</small><strong>CI + Docker + health checks</strong><p>Repeatable builds, tests, container deployment, and environment validation.</p></div>
        </div>
      </section>

      <footer className="footer shell">
        <Link className="brand" href="/"><span className="brand-mark">V</span><span>Voxora</span></Link>
        <p>Senior-level SaaS portfolio project focused on accessibility operations and multi-tenant engineering.</p>
      </footer>
    </main>
  );
}
