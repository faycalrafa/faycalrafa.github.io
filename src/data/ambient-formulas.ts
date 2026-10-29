// src/data/ambient-formulas.ts
// Mathematical, physics, AI/ML, and systems code expressions for background ambient & pointer interactions

export const FORMULAS: readonly string[] = [
  // Deep Learning & Mathematics
  '∇ × B = μ₀J',
  '∂L/∂w = δ · aᵀ',
  'λ = h/p',
  'f(x) = ∫ e^(-t²)dt',
  'z.infer<typeof Schema>',
  'hash(chunk) >> 4',
  'O(N log N)',
  'tensor.dot(W, x) + b',
  '∑_{i=1}^n w_i x_i + b',
  'loss: 0.0018',
  'dim=[128, 768]',
  'softmax(QKᵀ / √d_k)V',
  'E[X] = ∫ x p(x) dx',
  'curl(E) = -∂B/∂t',
  '|ψ⟩ = α|0⟩ + β|1⟩',
  'H(X) = -∑ p(x) log₂ p(x)',
  'det(A - λI) = 0',
  'KL(P ‖ Q) = ∫ p log(p/q)',
  'σ(z) = 1 / (1 + e⁻ᶻ)',
  'L_reg = λ ‖θ‖₂²',
  'E = mc²',
  'iℏ ∂ψ/∂t = Ĥψ',
  'd/dx[eˣ] = eˣ',
  'R_μν - ½ R g_μν = 8πG T_μν',
  'P(A|B) = P(B|A)P(A)/P(B)',
  'tanh(W_h h_{t-1} + W_x x_t)',
  'cos²θ + sin²θ = 1',
  'e^{iπ} + 1 = 0',

  // Modern Engineering & Systems Code
  'await pipeline.run(ctx)',
  'type DeepReadonly<T>',
  'fn main() -> Result<(), Box<dyn Error>>',
  'docker run --gpus all -d vllm',
  'async *[Symbol.asyncIterator]()',
  'useMemo(() => compute(x), [x])',
  'mmap(NULL, len, PROT_READ, MAP_SHARED)',
  'SELECT * FROM embeddings ORDER BY cosine LIMIT 5',
  'export default defineComponent',
  'reinterpret_cast<uintptr_t>(ptr)',
  'z.object({ id: z.string().uuid() })',
  'worker.postMessage({ type: "SYNC", buffer })'
];
