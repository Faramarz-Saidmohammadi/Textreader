"use client";

import { FormEvent, useMemo, useState } from "react";

type Phrase = { id: string; title: string; body: string; category: string; status: string };

export function PhraseComposer({ initialPhrases, canCreate }: { initialPhrases: Phrase[]; canCreate: boolean }) {
  const [phrases, setPhrases] = useState(initialPhrases);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("Select a phrase to test speech output.");
  const [error, setError] = useState("");

  const filtered = useMemo(() => phrases.filter((phrase) => `${phrase.title} ${phrase.body} ${phrase.category}`.toLowerCase().includes(query.toLowerCase())), [phrases, query]);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) {
      setError("Speech synthesis is not available in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
    setMessage(`Speaking: ${text}`);
  }

  async function createPhrase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/phrases", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: data.get("title"), body: data.get("body"), category: data.get("category") }),
    });
    const payload = (await response.json().catch(() => null)) as { phrase?: Phrase; error?: string } | null;
    if (!response.ok || !payload?.phrase) {
      setError(payload?.error ?? "Unable to create phrase.");
      return;
    }
    setPhrases((items) => [payload.phrase!, ...items]);
    event.currentTarget.reset();
    setMessage("Phrase created and audit event recorded.");
  }

  return (
    <div className="phrases-layout">
      <section className="data-card phrase-library">
        <div className="card-heading"><div><span className="eyebrow">Library</span><h2>{filtered.length} phrases</h2></div><input aria-label="Search phrases" className="search-input" placeholder="Search…" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <div className="phrase-table">
          {filtered.map((phrase) => (
            <button className="phrase-row" type="button" key={phrase.id} onClick={() => speak(phrase.body)}>
              <span><strong>{phrase.title}</strong><small>{phrase.category}</small></span>
              <p>{phrase.body}</p>
              <span className="status-chip">{phrase.status.toLowerCase()}</span>
            </button>
          ))}
          {filtered.length === 0 && <p className="muted padded">No phrases match the current search.</p>}
        </div>
      </section>

      <aside className="data-card composer-card">
        <span className="eyebrow">Composer</span><h2>Add a governed phrase</h2><p>Create content inside the active workspace. Authorization is checked again on the API route.</p>
        {canCreate ? (
          <form className="form-stack" onSubmit={createPhrase}>
            <label><span>Title</span><input name="title" minLength={2} maxLength={80} required /></label>
            <label><span>Category</span><input name="category" minLength={2} maxLength={40} defaultValue="General" required /></label>
            <label><span>Message</span><textarea name="body" rows={5} minLength={2} maxLength={280} required /></label>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="button primary" type="submit">Create phrase</button>
          </form>
        ) : <div className="notice">Your role has read-only access to this library.</div>}
        <div className="speech-status" role="status">{message}</div>
      </aside>
    </div>
  );
}
