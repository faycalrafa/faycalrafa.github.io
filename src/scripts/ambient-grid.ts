// src/scripts/ambient-grid.ts
// Ambient Architectural Engineering Grid & Mathematical / Code Expressions Background Canvas Controller

export const FORMULAS: readonly string[] = [
  '∇ × B = μ₀J',
  '∂L/∂w',
  'λ = h/p',
  'f(x) = ∫ e^(-t²)dt',
  'z.infer<typeof Schema>',
  'hash(chunk) >> 4',
  'O(log n)',
  'tensor.dot(W, x) + b',
  '∑_{i=1}^n w_i x_i',
  'loss: 0.0024',
  'dim=[128, 768]',
  'softmax(QK^T / √d_k)',
  'E[X] = ∫ x p(x) dx',
  'curl(E) = -∂B/∂t',
  '|ψ⟩ = α|0⟩ + β|1⟩',
  'H(p, q) = -∑ p(x) log q(x)',
  'det(A - λI) = 0',
  'KL(P || Q)',
  'σ(z) = 1/(1+e^-z)',
  'L_reg = λ ‖θ‖₂²'
];

interface AmbientToken {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  baseColor: string;
  life: number;
  maxLife: number;
  fontSize: number;
}

interface PointerState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
}

// Global handle to manage singleton lifecycle across Astro view transitions
declare global {
  interface Window {
    __ambientGridState?: {
      canvas: HTMLCanvasElement;
      stop: () => void;
    };
  }
}

export function initAmbientGrid(): void {
  const canvas = document.getElementById('ambient-grid-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  // If already running on this exact canvas instance, avoid redundant loops
  if (window.__ambientGridState && window.__ambientGridState.canvas === canvas) {
    return;
  }

  // Clean up any previously running instance on a swapped canvas
  if (window.__ambientGridState) {
    window.__ambientGridState.stop();
    window.__ambientGridState = undefined;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const pointer: PointerState = {
    x: -2000,
    y: -2000,
    targetX: -2000,
    targetY: -2000,
    radius: 180
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getMaxTokens(): number {
    return window.innerWidth < 768 ? 14 : 22;
  }

  function getPalette(): string[] {
    const isDark = document.documentElement.classList.contains('dark') || true;
    return isDark
      ? [
          'rgba(147, 197, 253, ', // Sky 300
          'rgba(165, 180, 252, ', // Indigo 300
          'rgba(110, 231, 183, ', // Emerald 300
          'rgba(203, 213, 225, ', // Slate 300
          'rgba(173, 198, 255, '  // Soft periwinkle
        ]
      : [
          'rgba(59, 130, 246, ',
          'rgba(16, 185, 129, ',
          'rgba(99, 102, 241, ',
          'rgba(100, 116, 139, '
        ];
  }

  function createToken(customX?: number, customY?: number): AmbientToken {
    const text = FORMULAS[Math.floor(Math.random() * FORMULAS.length)];
    const palette = getPalette();
    const baseColor = palette[Math.floor(Math.random() * palette.length)];

    // Spawn randomly across the entire view area (with gentle margin)
    const paddingX = Math.min(60, width * 0.08);
    const paddingY = Math.min(60, height * 0.08);
    const usableW = Math.max(width - paddingX * 2, 200);
    const usableH = Math.max(height - paddingY * 2, 200);

    const x = typeof customX === 'number' ? customX : paddingX + Math.random() * usableW;
    const y = typeof customY === 'number' ? customY : paddingY + Math.random() * usableH;

    const speedScale = prefersReducedMotion ? 0 : 1;

    return {
      text,
      x,
      y,
      vx: ((Math.random() - 0.5) * 0.16) * speedScale,
      vy: (((Math.random() - 0.5) * 0.16) - 0.04) * speedScale,
      alpha: 0,
      maxAlpha: 0.18 + Math.random() * 0.18,
      baseColor,
      life: 0,
      maxLife: 420 + Math.random() * 360, // ~10 to 18 seconds lifespan
      fontSize: 11 + Math.floor(Math.random() * 3)
    };
  }

  const activeTokens: AmbientToken[] = [];

  function resize(): void {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas!.width = width * dpr;
    canvas!.height = height * dpr;
    canvas!.style.width = `${width}px`;
    canvas!.style.height = `${height}px`;
    ctx!.setTransform(1, 0, 0, 1, 0, 0);
    ctx!.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Subtle pointer tracking for parallax & proximity node highlights (NO SPAWNING)
  const onPointerMove = (e: PointerEvent): void => {
    pointer.targetX = e.clientX;
    pointer.targetY = e.clientY;
  };

  const onPointerLeave = (): void => {
    pointer.targetX = -2000;
    pointer.targetY = -2000;
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });

  // Initial ambient seeding distributed everywhere across the view
  const initialSeedCount = window.innerWidth < 768 ? 6 : 10;
  for (let i = 0; i < initialSeedCount; i++) {
    const t = createToken();
    t.life = Math.random() * t.maxLife * 0.65;
    activeTokens.push(t);
  }

  let animationId = 0;
  let isRunning = true;
  let lastTime = performance.now();
  let lastSpawnTime = performance.now();
  const SPAWN_INTERVAL_MS = 2400; // Slow, serene cadence: ~1 spawn every 2.4s

  function render(time: number): void {
    if (!isRunning) return;

    animationId = requestAnimationFrame(render);

    // Pause heavy calculations if tab is hidden
    if (document.hidden) {
      lastTime = time;
      return;
    }

    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    const deltaFactor = Math.max(0.5, Math.min(dt * 60, 2.0));

    // Smooth pointer interpolation
    pointer.x += (pointer.targetX - pointer.x) * 0.08;
    pointer.y += (pointer.targetY - pointer.y) * 0.08;

    ctx!.clearRect(0, 0, width, height);

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const isDark = document.documentElement.classList.contains('dark') || true;

    // Structural architectural grid
    const gridSize = 44;
    const offsetX = (pointer.x !== -2000 ? (pointer.x - width / 2) * 0.015 : 0) % gridSize;
    const offsetY = ((scrollY * 0.12) + (pointer.y !== -2000 ? (pointer.y - height / 2) * 0.015 : 0)) % gridSize;

    // Draw grid lines
    ctx!.lineWidth = 1;
    ctx!.strokeStyle = isDark ? 'rgba(147, 197, 253, 0.028)' : 'rgba(77, 142, 254, 0.045)';

    ctx!.beginPath();
    for (let x = offsetX; x < width; x += gridSize) {
      ctx!.moveTo(x, 0);
      ctx!.lineTo(x, height);
    }
    for (let y = offsetY; y < height; y += gridSize) {
      ctx!.moveTo(0, y);
      ctx!.lineTo(width, y);
    }
    ctx!.stroke();

    // Subtle grid intersection node highlights near pointer (blueprint inspection feel)
    if (pointer.x > -1000 && pointer.y > -1000 && !prefersReducedMotion) {
      const gridStartX = Math.floor((pointer.x - pointer.radius) / gridSize) * gridSize + offsetX;
      const gridEndX = Math.ceil((pointer.x + pointer.radius) / gridSize) * gridSize + offsetX;
      const gridStartY = Math.floor((pointer.y - pointer.radius) / gridSize) * gridSize + offsetY;
      const gridEndY = Math.ceil((pointer.y + pointer.radius) / gridSize) * gridSize + offsetY;

      for (let nx = gridStartX; nx <= gridEndX; nx += gridSize) {
        for (let ny = gridStartY; ny <= gridEndY; ny += gridSize) {
          const dx = nx - pointer.x;
          const dy = ny - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < pointer.radius) {
            const nodeAlpha = (1 - dist / pointer.radius) * 0.32;
            ctx!.fillStyle = `rgba(147, 197, 253, ${nodeAlpha})`;
            ctx!.beginPath();
            ctx!.arc(nx, ny, 1.5, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
      }
    }

    // SLOW-PACED AMBIENT SPAWNING EVERYWHERE IN VIEW (NOT AT POINTER)
    const maxTokens = getMaxTokens();
    if (time - lastSpawnTime > SPAWN_INTERVAL_MS && activeTokens.length < maxTokens) {
      // Spawn at a random position somewhere in the view
      activeTokens.push(createToken());
      lastSpawnTime = time;
    }

    // Minimum baseline guarantee
    if (activeTokens.length < 5) {
      activeTokens.push(createToken());
    }

    // Render & drift tokens
    for (let i = activeTokens.length - 1; i >= 0; i--) {
      const token = activeTokens[i];
      token.life += 1 * deltaFactor;

      // Smooth envelope: 20% fade-in, 55% hold, 25% fade-out
      const progress = token.life / token.maxLife;
      if (progress < 0.2) {
        token.alpha = (progress / 0.2) * token.maxAlpha;
      } else if (progress > 0.75) {
        token.alpha = ((1 - progress) / 0.25) * token.maxAlpha;
      } else {
        token.alpha = token.maxAlpha;
      }

      // Gentle drift
      token.x += token.vx * deltaFactor;
      token.y += token.vy * deltaFactor;

      // Soft non-intrusive cursor avoidance (water ripple feel, NO spawning)
      if (pointer.x > -1000 && pointer.y > -1000 && !prefersReducedMotion) {
        const pdx = token.x - pointer.x;
        const pdy = token.y - pointer.y;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist < pointer.radius && pdist > 0.001) {
          const repelForce = (1 - pdist / pointer.radius) * 0.35;
          token.x += (pdx / pdist) * repelForce;
          token.y += (pdy / pdist) * repelForce;
          token.alpha = Math.min(token.alpha * 1.25, 0.45);
        }
      }

      // Draw mathematical formula / code text
      ctx!.font = `500 ${token.fontSize}px 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx!.fillStyle = `${token.baseColor}${token.alpha})`;
      ctx!.fillText(token.text, token.x, token.y);

      // Cull deceased or far-out-of-bounds tokens
      if (
        token.life >= token.maxLife ||
        token.x < -140 ||
        token.x > width + 140 ||
        token.y < -140 ||
        token.y > height + 140
      ) {
        activeTokens.splice(i, 1);
      }
    }
  }

  animationId = requestAnimationFrame(render);

  window.__ambientGridState = {
    canvas,
    stop: () => {
      isRunning = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    }
  };
}
