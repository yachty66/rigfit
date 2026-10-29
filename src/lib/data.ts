// Specs are approximate, collected from public model cards and comparison posts (Oct 2026).
// Prices are rough street prices in EUR for a complete working machine, not just the GPU.

export type Model = {
  id: string;
  name: string;
  maker: string;
  totalB: number; // total parameters, billions
  activeB: number; // active parameters per token, billions (= total for dense)
  tier: "frontier" | "large" | "mid" | "small";
  note?: string;
};

export const MODELS: Model[] = [
  { id: "kimi-k3", name: "Kimi K3", maker: "Moonshot", totalB: 2800, activeB: 104, tier: "frontier", note: "Largest open-weight model so far" },
  { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro", maker: "DeepSeek", totalB: 1600, activeB: 49, tier: "frontier" },
  { id: "mimo-v2.6-pro", name: "MiMo-V2.6-Pro", maker: "Xiaomi", totalB: 1020, activeB: 42, tier: "frontier", note: "Tops BenchLM & Artificial Analysis" },
  { id: "glm-5.2", name: "GLM-5.2", maker: "Zhipu", totalB: 750, activeB: 40, tier: "frontier" },
  { id: "deepseek-v4.1-flash", name: "DeepSeek V4.1 Flash", maker: "DeepSeek", totalB: 552, activeB: 16, tier: "large" },
  { id: "deepseek-v4-flash", name: "DeepSeek V4 Flash", maker: "DeepSeek", totalB: 284, activeB: 13, tier: "large" },
  { id: "qwen3-235b", name: "Qwen3 235B-A22B", maker: "Alibaba", totalB: 235, activeB: 22, tier: "large" },
  { id: "gpt-oss-120b", name: "gpt-oss-120b", maker: "OpenAI", totalB: 117, activeB: 5.1, tier: "large" },
  { id: "llama-3.3-70b", name: "Llama 3.3 70B", maker: "Meta", totalB: 70, activeB: 70, tier: "mid" },
  { id: "qwen3.8-27b", name: "Qwen3.8 27B", maker: "Alibaba", totalB: 27, activeB: 27, tier: "mid", note: "Best single-GPU model, Apache 2.0" },
  { id: "gemma-3-27b", name: "Gemma 3 27B", maker: "Google", totalB: 27, activeB: 27, tier: "mid" },
  { id: "mistral-small-24b", name: "Mistral Small 24B", maker: "Mistral", totalB: 24, activeB: 24, tier: "small" },
  { id: "gpt-oss-20b", name: "gpt-oss-20b", maker: "OpenAI", totalB: 21, activeB: 3.6, tier: "small" },
];

export type Build = {
  id: string;
  name: string;
  kind: "nvidia" | "apple" | "amd" | "datacenter";
  parts: string;
  memGB: number; // usable memory for weights + cache
  bandwidthGBs: number; // effective aggregate memory bandwidth
  priceEUR: number;
  why: string;
};

export const BUILDS: Build[] = [
  { id: "3090", name: "Used RTX 3090 PC", kind: "nvidia", parts: "1× RTX 3090 24 GB (used), Ryzen 7, 64 GB RAM", memGB: 24, bandwidthGBs: 936, priceEUR: 1500, why: "Cheapest way into 24 GB of fast VRAM." },
  { id: "strix", name: "Ryzen AI Max+ 395 mini PC", kind: "amd", parts: "Strix Halo, 128 GB unified memory (~110 GB usable for the GPU)", memGB: 110, bandwidthGBs: 256, priceEUR: 2200, why: "Lots of memory for little money, but slow memory." },
  { id: "5090", name: "RTX 5090 PC", kind: "nvidia", parts: "1× RTX 5090 32 GB, Ryzen 9, 96 GB RAM, 1200 W PSU", memGB: 32, bandwidthGBs: 1792, priceEUR: 4000, why: "Fastest consumer GPU. Unbeatable if the model fits in 32 GB." },
  { id: "spark", name: "Nvidia DGX Spark", kind: "nvidia", parts: "GB10, 128 GB unified memory", memGB: 120, bandwidthGBs: 273, priceEUR: 4200, why: "CUDA in a tiny box with 128 GB, but slow per token." },
  { id: "mac-96", name: "Mac Studio M5 Ultra 96 GB", kind: "apple", parts: "M5 Ultra, 96 GB unified memory", memGB: 72, bandwidthGBs: 1000, priceEUR: 5800, why: "Silent, efficient, runs MLX models well." },
  { id: "2x5090", name: "Dual RTX 5090 workstation", kind: "nvidia", parts: "2× RTX 5090 32 GB, Threadripper, 128 GB RAM, 1600 W PSU", memGB: 64, bandwidthGBs: 2900, priceEUR: 7800, why: "64 GB of very fast VRAM for 70B-class models." },
  { id: "2xspark", name: "2× DGX Spark (linked)", kind: "nvidia", parts: "2× GB10 over 200 GbE, 256 GB total", memGB: 240, bandwidthGBs: 480, priceEUR: 8500, why: "256 GB of CUDA memory on a desk." },
  { id: "mac-256", name: "Mac Studio M5 Ultra 256 GB", kind: "apple", parts: "M5 Ultra, 256 GB unified memory", memGB: 210, bandwidthGBs: 1000, priceEUR: 8000, why: "Big MoE models on one quiet machine." },
  { id: "pro6000", name: "RTX PRO 6000 workstation", kind: "nvidia", parts: "1× RTX PRO 6000 Blackwell 96 GB, Threadripper, 192 GB RAM", memGB: 96, bandwidthGBs: 1792, priceEUR: 11000, why: "Best single workstation GPU: 96 GB at 5090 speed." },
  { id: "mac-512", name: "Mac Studio M5 Ultra 512 GB", kind: "apple", parts: "M5 Ultra, 512 GB unified memory", memGB: 440, bandwidthGBs: 1000, priceEUR: 11500, why: "The cheapest single machine that runs frontier MoE models." },
  { id: "2xpro6000", name: "2× RTX PRO 6000 workstation", kind: "nvidia", parts: "2× RTX PRO 6000 96 GB, Threadripper PRO, 256 GB RAM", memGB: 192, bandwidthGBs: 3200, priceEUR: 21000, why: "192 GB of fast VRAM, great for large MoE." },
  { id: "2xmac-512", name: "2× Mac Studio 512 GB cluster", kind: "apple", parts: "2× M5 Ultra 512 GB over Thunderbolt 5 (exo / MLX distributed)", memGB: 880, bandwidthGBs: 1000, priceEUR: 23000, why: "Frontier models at home without a server rack." },
  { id: "4xpro6000", name: "4× RTX PRO 6000 server", kind: "nvidia", parts: "4× RTX PRO 6000 96 GB, EPYC, 512 GB RAM", memGB: 384, bandwidthGBs: 6000, priceEUR: 42000, why: "Fast frontier inference with vLLM / SGLang." },
  { id: "4xmac-512", name: "4× Mac Studio 512 GB cluster", kind: "apple", parts: "4× M5 Ultra 512 GB over Thunderbolt 5", memGB: 1760, bandwidthGBs: 1000, priceEUR: 46000, why: "Enough memory for the very largest open models." },
  { id: "8xpro6000", name: "8× RTX PRO 6000 server", kind: "nvidia", parts: "8× RTX PRO 6000 96 GB, dual EPYC, 1 TB RAM", memGB: 768, bandwidthGBs: 11000, priceEUR: 85000, why: "Top-tier local speed for 1T+ models." },
  { id: "8xh200", name: "8× H200 server", kind: "datacenter", parts: "HGX H200, 8× 141 GB HBM3e", memGB: 1128, bandwidthGBs: 30000, priceEUR: 300000, why: "Data-centre class. What the labs use." },
];

export const QUANTS = [
  { id: "q4", label: "4-bit", bits: 4.5, hint: "Best trade-off, small quality loss" },
  { id: "q8", label: "8-bit", bits: 8.5, hint: "Near-original quality" },
  { id: "fp16", label: "16-bit", bits: 16, hint: "Original weights" },
] as const;

export const CONTEXTS = [8, 32, 128] as const; // thousands of tokens

export type QuantId = (typeof QUANTS)[number]["id"];

export function memoryNeeded(m: Model, bits: number, ctxK: number) {
  const weights = (m.totalB * bits) / 8;
  // Rough KV-cache estimate: grows with context and with model width (approximated by active params).
  const kv = (ctxK / 32) * Math.max(1.5, Math.sqrt(m.activeB) * 0.9);
  return { weights, kv, total: weights * 1.05 + kv + 2 };
}

export function tokensPerSecond(m: Model, bits: number, b: Build) {
  const bytesPerToken = (m.activeB * bits) / 8; // GB read per generated token
  return (b.bandwidthGBs * 0.55) / bytesPerToken;
}

export function rankBuilds(m: Model, bits: number, ctxK: number) {
  const need = memoryNeeded(m, bits, ctxK).total;
  const fits = BUILDS.filter((b) => b.memGB >= need)
    .map((b) => ({ build: b, tps: tokensPerSecond(m, bits, b) }))
    .sort((a, b) => a.build.priceEUR - b.build.priceEUR);
  const usable = fits.filter((f) => f.tps >= 8);
  const best = usable[0] ?? fits[0];
  const budget = fits[0];
  const fastest = [...fits].sort((a, b) => b.tps - a.tps)[0];
  return { need, fits, best, budget, fastest };
}

// Renting: number of 80 GB GPUs needed, ~€2.2 per H100-hour on marketplaces like RunPod / Vast.ai.
export function rentEstimate(needGB: number) {
  const gpus = Math.max(1, Math.pow(2, Math.ceil(Math.log2(Math.ceil(needGB / 75)))));
  return { gpus, perHour: gpus * 2.2 };
}
