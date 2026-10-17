import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Copy, WandSparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { generateProductCopy } from "@/lib/server/ai";

export const Route = createFileRoute("/ai-assistant")({
  component: AIAssistant,
});

function AIAssistant() {
  const generateFn = useServerFn(generateProductCopy);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Kerajinan tangan");
  const [audience, setAudience] = useState("Pembeli umum");
  const [tone, setTone] = useState<"profesional" | "ramah" | "persuasif">("ramah");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult("");
    setCopied(false);
    setLoading(true);
    try {
      const response = await generateFn({ data: { productName, category, audience, tone, notes } });
      setResult(response.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
    } catch {
      setError("Belum bisa menyalin otomatis. Kamu bisa memilih teks dan menyalinnya sendiri.");
    }
  }

  return (
    <main className="page-wrap px-4 py-8 sm:py-12">
      <section className="island-shell overflow-hidden rounded-3xl">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-[var(--line)] p-6 sm:p-9 lg:border-b-0 lg:border-r">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--palm)]">
              <Sparkles size={16} /> Dibantu kecerdasan buatan
            </div>
            <p className="island-kicker mb-2">TEMAN KONTEN ONANAI</p>
            <h1 className="display-title mb-4 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
              Ceritakan produkmu dengan lebih menarik.
            </h1>
            <p className="mb-6 leading-7 text-[var(--sea-ink-soft)]">
              Buat judul, deskripsi, keunggulan, dan ajakan promosi dengan bantuan AI.
              Hasil AI adalah draf awal—periksa dan sesuaikan dengan informasi produk yang sebenarnya.
            </p>
            <div className="space-y-3">
              {["Deskripsi produk dalam Bahasa Indonesia", "Pilihan gaya bahasa sesuai target", "Hasil bisa disalin dan diedit"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] p-3 text-sm text-[var(--sea-ink)]">
                  <CheckCircle2 size={18} className="shrink-0 text-[var(--palm)]" /> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-9">
            <h2 className="mb-1 text-xl font-bold text-[var(--sea-ink)]">Ceritakan produkmu</h2>
            <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">Isi beberapa hal sederhana. Hasilnya bisa kamu ubah lagi.</p>
            <form onSubmit={handleGenerate} className="space-y-4">
              <Field label="Nama produk">
                <input required minLength={2} maxLength={120} value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Contoh: Tas ulos buatan tangan" className="ai-input" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Jenis produk">
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="ai-input">
                    <option>Kerajinan tangan</option><option>Kuliner</option><option>Fashion</option><option>Desain</option><option>Musik</option><option>Fotografi</option><option>Produk digital</option><option>Lainnya</option>
                  </select>
                </Field>
                <Field label="Untuk siapa produk ini?">
                  <input value={audience} maxLength={160} onChange={(e) => setAudience(e.target.value)} placeholder="Contoh: wisatawan dan keluarga" className="ai-input" />
                </Field>
              </div>
              <Field label="Gaya bahasa">
                <div className="grid grid-cols-3 gap-2">
                  {([{ value: "ramah", label: "Ramah" }, { value: "profesional", label: "Profesional" }, { value: "persuasif", label: "Meyakinkan" }] as const).map((option) => (
                    <button type="button" key={option.value} onClick={() => setTone(option.value)} className={`rounded-xl border px-2 py-2.5 text-sm font-semibold capitalize transition ${tone === option.value ? "border-[var(--lagoon-deep)] bg-[var(--sand)] text-[var(--sea-ink)]" : "border-[var(--line)] text-[var(--sea-ink-soft)] hover:bg-[var(--chip-bg)]"}`}>{option.label}</button>
                  ))}
                </div>
              </Field>
              <Field label="Hal yang ingin ditonjolkan (opsional)">
                <textarea value={notes} maxLength={1000} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Ceritakan bahan, ukuran, atau keunikan produkmu…" className="ai-input resize-y" />
              </Field>
              {error && <div role="alert" className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18} className="shrink-0" />{error}</div>}
              <button type="submit" disabled={loading || productName.trim().length < 2} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--sea-ink)] px-5 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Sedang merangkai kata…</> : <><WandSparkles size={18} /> Bantu buat konten</>}
              </button>
            </form>
            {result && <section aria-live="polite" className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--chip-bg)] p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-bold text-[var(--sea-ink)]">Draf kontenmu</h3>
                <button type="button" onClick={copyResult} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)]"><Copy size={15} />{copied ? "Sudah disalin" : "Salin hasil"}</button>
              </div>
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-[var(--sea-ink-soft)]">{result}</pre>
              <p className="mt-4 text-xs text-[var(--sea-ink-soft)]">Baca kembali hasilnya dan pastikan semua informasi sesuai dengan produkmu.</p>
            </section>}
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-2"><span className="block text-sm font-semibold text-[var(--sea-ink)]">{label}</span>{children}</label>;
}
