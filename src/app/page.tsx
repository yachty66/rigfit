import Picker from "./Picker";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-10">
        <div className="text-sm font-medium text-lime-300">rigfit</div>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">What do I need to run it locally?</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">Pick an open-weight model and get the cheapest machine that runs it well, with memory, speed and price estimates.</p>
      </header>
      <Picker />
      <footer className="mt-16 border-t border-zinc-800 pt-6 text-xs leading-relaxed text-zinc-600">
        Estimates only. Memory = weights at the chosen precision + context cache + overhead. Speed = memory bandwidth ÷ bytes read per token (active params), at ~55% efficiency.
        Real numbers depend on the runtime (vLLM, SGLang, llama.cpp, MLX), batch size and quant format. Model specs and prices as of Oct 2026.
      </footer>
    </div>
  );
}
