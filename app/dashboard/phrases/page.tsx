import { PhraseComposer } from "@/components/phrase-composer";
import { listPhrases } from "@/lib/phrases";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function PhrasesPage() {
  const session = await requireSession();
  const phrases = await listPhrases(session.workspaceId);

  return (
    <main className="dashboard-content">
      <div className="dashboard-title">
        <div><span className="eyebrow">Content operations</span><h1>Phrase library</h1><p>Create governed reusable phrases and test speech output in the browser.</p></div>
      </div>
      <PhraseComposer initialPhrases={phrases} canCreate={["OWNER", "ADMIN", "EDITOR"].includes(session.role)} />
    </main>
  );
}
