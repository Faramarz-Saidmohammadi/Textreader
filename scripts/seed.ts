import { sql } from "../lib/db";
import { hashPassword } from "../lib/password";

async function main() {
  const email = "owner@voxora.dev";
  const passwordHash = await hashPassword("VoxoraDemo!2026");

  const [workspace] = await sql<{ id: string }[]>`
    insert into workspaces (name, slug, plan)
    values ('Voxora Demo Workspace', 'voxora-demo', 'BUSINESS')
    on conflict (slug) do update set name = excluded.name
    returning id::text
  `;

  const [user] = await sql<{ id: string }[]>`
    insert into users (email, password_hash, display_name)
    values (${email}, ${passwordHash}, 'Demo Owner')
    on conflict (email) do update set password_hash = excluded.password_hash, display_name = excluded.display_name
    returning id::text
  `;

  await sql`
    insert into memberships (workspace_id, user_id, role)
    values (${workspace.id}, ${user.id}, 'OWNER')
    on conflict (workspace_id, user_id) do update set role = 'OWNER'
  `;

  const starter = [
    ['Welcome', 'Welcome. How can I help you today?', 'Service'],
    ['Please wait', 'Please wait a moment while I check that for you.', 'Service'],
    ['Need assistance', 'I need assistance, please.', 'Essential'],
    ['Thank you', 'Thank you for your help.', 'Essential'],
    ['Directions', 'Could you show me where I need to go?', 'Navigation'],
    ['Repeat', 'Could you please repeat that more slowly?', 'Communication'],
  ];

  for (const [title, body, category] of starter) {
    await sql`
      insert into phrases (workspace_id, created_by, title, body, category, status)
      select ${workspace.id}, ${user.id}, ${title}, ${body}, ${category}, 'PUBLISHED'
      where not exists (select 1 from phrases where workspace_id = ${workspace.id} and title = ${title})
    `;
  }

  await sql`
    insert into audit_logs (workspace_id, actor_user_id, action, resource_type, metadata)
    values (${workspace.id}, ${user.id}, 'workspace.seeded', 'workspace', ${sql.json({ source: "seed-script" })})
  `;

  console.log(`Seed complete. Login: ${email} / VoxoraDemo!2026`);
  await sql.end();
}

main().catch(async (error) => {
  console.error(error);
  await sql.end();
  process.exit(1);
});
