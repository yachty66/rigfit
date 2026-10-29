"use client";

import { useState } from "react";
import { BUILDS, CONTEXTS, MODELS, QUANTS, memoryNeeded, rankBuilds, rentEstimate, type Build, type QuantId } from "@/lib/data";

const TIERS = [
  { id: "frontier", label: "Frontier" },
  { id: "large", label: "Large" },
  { id: "mid", label: "Mid" },
  { id: "small", label: "Small" },
] as const;

const eur = (n: number) => `€${n.toLocaleString("en-US")}`;
const gb = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(2)} TB` : `${Math.round(n)} GB`);
const params = (b: number) => (b >= 1000 ? `${(b / 1000).toFixed(b % 1000 ? 2 : 0)}T` : `${b}B`);
const speed = (t: number) => (t >= 100 ? "100+" : t >= 10 ? Math.round(t).toString() : t.toFixed(1));

const KIND: Record<Build["kind"], string> = { nvidia: "bg-lime-400/15 text-lime-300", apple: "bg-zinc-200/10 text-zinc-200", amd: "bg-red-400/15 text-red-300", datacenter: "bg-sky-400/15 text-sky-300" };

function feel(tps: number) {
  if (tps >= 40) return { label: "Instant", cls: "text-emerald-300" };
  if (tps >= 15) return { label: "Smooth", cls: "text-lime-300" };
  if (tps >= 8) return { label: "Usable", cls: "text-amber-300" };
  return { label: "Slow", cls: "text-red-300" };
}

export default function Picker() {
  const [modelId, setModelId] = useState("qwen3.8-27b");
  const [quant, setQuant] = useState<QuantId>("q4");
  const [ctx, setCtx] = useState<(typeof CONTEXTS)[number]>(32);

  const model = MODELS.find((m) => m.id === modelId)!;
  const bits = QUANTS.find((q) => q.id === quant)!.bits;
  const mem = memoryNeeded(model, bits, ctx);
  const { fits, best, budget, fastest } = rankBuilds(model, bits, ctx);
  const rent = rentEstimate(mem.total);
  const others = fits.filter((f) => f.build.id !== best?.build.id);

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <aside className="space-y-6">
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">1 · Pick a model</h2>
          <div className="space-y-4">
            {TIERS.map((t) => (
              <div key={t.id}>
                <div className="mb-1.5 text-[11px] text-zinc-600">{t.label}</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {MODELS.filter((m) => m.tier === t.id).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setModelId(m.id)}
                      className={`rounded-lg border px-3 py-2 text-left transition ${m.id === modelId ? "border-lime-400/60 bg-lime-400/10" : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600"}`}
                    >
                      <div className="truncate text-sm font-medium">{m.name}</div>
                      <div className="text-[11px] text-zinc-500">
                        {m.maker} · {params(m.totalB)}
                        {m.activeB !== m.totalB && ` / ${params(m.activeB)} active`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">2 · Quality</h2>
          <div className="grid grid-cols-3 gap-1.5">
            {QUANTS.map((q) => (
              <button key={q.id} onClick={() => setQuant(q.id)} className={`rounded-lg border px-2 py-2 text-sm ${q.id === quant ? "border-lime-400/60 bg-lime-400/10" : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600"}`}>
                {q.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-zinc-500">{QUANTS.find((q) => q.id === quant)!.hint}</p>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">3 · Context length</h2>
          <div className="grid grid-cols-3 gap-1.5">
            {CONTEXTS.map((c) => (
              <button key={c} onClick={() => setCtx(c)} className={`rounded-lg border px-2 py-2 text-sm ${c === ctx ? "border-lime-400/60 bg-lime-400/10" : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600"}`}>
                {c}K
              </button>
            ))}
          </div>
        </section>
      </aside>

      <main className="space-y-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-sm text-zinc-500">{model.maker}</div>
              <h2 className="text-2xl font-semibold tracking-tight">{model.name}</h2>
              {model.note && <div className="mt-0.5 text-xs text-zinc-500">{model.note}</div>}
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold tabular-nums">{gb(mem.total)}</div>
              <div className="text-xs text-zinc-500">memory needed</div>
            </div>
          </div>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-zinc-800">
            <div className="bg-lime-400" style={{ width: `${(mem.weights / mem.total) * 100}%` }} />
            <div className="bg-sky-400" style={{ width: `${(mem.kv / mem.total) * 100}%` }} />
          </div>
          <div className="mt-2 flex gap-4 text-[11px] text-zinc-500">
            <span><span className="mr-1 inline-block size-2 rounded-full bg-lime-400" />weights {gb(mem.weights)}</span>
            <span><span className="mr-1 inline-block size-2 rounded-full bg-sky-400" />context cache {gb(mem.kv)}</span>
          </div>
        </div>

        {best ? (
          <div className="rounded-2xl border border-lime-400/40 bg-gradient-to-b from-lime-400/10 to-transparent p-6">
            <div className="mb-3 text-xs font-medium uppercase tracking-widest text-lime-300">Best build for you</div>
            <BuildRow build={best.build} tps={best.tps} big />
            {best.tps < 8 && <p className="mt-3 text-sm text-amber-300">Nothing local runs this smoothly. Consider renting below.</p>}
          </div>
        ) : (
          <div className="rounded-2xl border border-red-400/40 bg-red-400/5 p-6">
            <div className="mb-1 text-xs font-medium uppercase tracking-widest text-red-300">Too big for a home setup</div>
            <p className="text-sm text-zinc-300">None of our builds has {gb(mem.total)} of memory. Try 4-bit, a shorter context, or rent GPUs.</p>
          </div>
        )}

        {budget && fastest && budget.build.id !== fastest.build.id && (
          <div className="grid gap-3 sm:grid-cols-2">
            {budget.build.id !== best?.build.id && <MiniCard title="Cheapest that fits" build={budget.build} tps={budget.tps} />}
            {fastest.build.id !== best?.build.id && <MiniCard title="Fastest option" build={fastest.build} tps={fastest.tps} />}
          </div>
        )}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="mb-1 text-xs font-medium uppercase tracking-widest text-zinc-500">Or rent instead</div>
          <p className="text-sm text-zinc-300">
            {rent.gpus}× H100 80 GB on RunPod / Vast.ai ≈ <span className="font-semibold text-white">{eur(Math.round(rent.perHour * 10) / 10)}/hour</span>.
            {best && <> Buying the build above pays off after about <span className="font-semibold text-white">{Math.round(best.build.priceEUR / rent.perHour).toLocaleString()} hours</span> of use.</>}{" "}
            Or call it via OpenRouter and pay per token.
          </p>
        </div>

        {others.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">Everything else that fits ({others.length})</h3>
            <div className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800">
              {others.map((f) => (
                <div key={f.build.id} className="p-4">
                  <BuildRow build={f.build} tps={f.tps} />
                </div>
              ))}
            </div>
          </div>
        )}

        <details className="text-xs text-zinc-500">
          <summary className="cursor-pointer">Doesn&apos;t fit ({BUILDS.length - fits.length})</summary>
          <ul className="mt-2 space-y-1">
            {BUILDS.filter((b) => !fits.some((f) => f.build.id === b.id)).map((b) => (
              <li key={b.id}>
                {b.name}: {gb(b.memGB)} usable, needs {gb(mem.total)}
              </li>
            ))}
          </ul>
        </details>
      </main>
    </div>
  );
}

function BuildRow({ build, tps, big }: { build: Build; tps: number; big?: boolean }) {
  const f = feel(tps);
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={big ? "text-xl font-semibold" : "font-medium"}>{build.name}</span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${KIND[build.kind]}`}>{build.kind}</span>
        </div>
        <div className="mt-0.5 text-xs text-zinc-500">{build.parts}</div>
        {big && <div className="mt-2 text-sm text-zinc-300">{build.why}</div>}
      </div>
      <div className="flex gap-6 text-right">
        <div>
          <div className={`${big ? "text-2xl" : "text-base"} font-semibold tabular-nums ${f.cls}`}>{speed(tps)}</div>
          <div className="text-[11px] text-zinc-500">tok/s · {f.label}</div>
        </div>
        <div>
          <div className={`${big ? "text-2xl" : "text-base"} font-semibold tabular-nums`}>{eur(build.priceEUR)}</div>
          <div className="text-[11px] text-zinc-500">approx.</div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ title, build, tps }: { title: string; build: Build; tps: number }) {
  const f = feel(tps);
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">{title}</div>
      <div className="font-medium">{build.name}</div>
      <div className="mt-1 text-sm text-zinc-400">
        {eur(build.priceEUR)} · <span className={f.cls}>{speed(tps)} tok/s</span>
      </div>
    </div>
  );
}
