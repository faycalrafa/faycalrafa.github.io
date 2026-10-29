// src/scripts/ambient-grid.ts
// Ambient Architectural Engineering Grid & Mathematical / Code Expressions Background Canvas Controller

import { FORMULAS } from '../data/ambient-formulas';
export { FORMULAS };

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
  isPointer?: boolean;
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
    return window.innerWidth < 768 ? 65 : 120;
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

  function createAmbientToken(): AmbientToken {
    const text = FORMULAS[Math.floor(Math.random() * FORMULAS.length)];
    const palette = getPalette();
    const baseColor = palette[Math.floor(Math.random() * palette.length)];

    // Spawn randomly across the entire view area
    const paddingX = Math.min(60, width * 0.08);
    const paddingY = Math.min(60, height * 0.08);
    const usableW = Math.max(width - paddingX * 2, 200);
    const usableH = Math.max(height - paddingY * 2, 200);

    const x = paddingX + Math.random() * usableW;
    const y = paddingY + Math.random() * usableH;
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
      fontSize: 11 + Math.floor(Math.random() * 3),
      isPointer: false
    };
  }

  const activeTokens: AmbientToken[] = [];

  function spawnPointerToken(originX: number, originY: number, customAngle?: number, customSpeed?: number): void {
    if (activeTokens.length >= getMaxTokens()) {
      // Discard the oldest pointer token to prioritize responsive new ones
      const oldestIdx = activeTokens.findIndex(t => t.isPointer);
      if (oldestIdx !== -1) {
        activeTokens.splice(oldestIdx, 1);
      } else {
        return;
      }
    }

    const text = FORMULAS[Math.floor(Math.random() * FORMULAS.length)];
    const palette = getPalette();
    const baseColor = palette[Math.floor(Math.random() * palette.length)];
    const speedScale = prefersReducedMotion ? 0 : 1;

    // Small radial offset from exact pointer center so multiple tokens distribute smoothly
    const jitterX = (Math.random() - 0.5) * 16;
    const jitterY = (Math.random() - 0.5) * 16;

    const angle = typeof customAngle === 'number' ? customAngle : Math.random() * Math.PI * 2;
    const speed = (typeof customSpeed === 'number' ? customSpeed : 0.45 + Math.random() * 1.3) * speedScale;

    activeTokens.push({
      text,
      x: originX + jitterX,
      y: originY + jitterY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.32 * speedScale, // graceful upward floating bias
      alpha: 0,
      maxAlpha: 0.55 + Math.random() * 0.35, // crisp, vibrant, glowing visibility
      baseColor,
      life: 0,
      maxLife: 90 + Math.random() * 95, // ~1.5 to 3.0 seconds
      fontSize: 11 + Math.floor(Math.random() * 3),
      isPointer: true
    });
  }

  function spawnPointerBurst(originX: number, originY: number, count = 6): void {
    const angleStep = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep + (Math.random() - 0.5) * 0.4;
      const speed = 0.85 + Math.random() * 1.35;
      spawnPointerToken(originX, originY, angle, speed);
    }
  }

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

  let lastMoveX = -2000;
  let lastMoveY = -2000;
  let lastMoveSpawnTime = 0;

  // Real-time mouse movement: generate continuous streams of math/code at cursor tip
  const onPointerMove = (e: PointerEvent): void => {
    pointer.targetX = e.clientX;
    pointer.targetY = e.clientY;

    const now = performance.now();
    const dist = Math.hypot(e.clientX - lastMoveX, e.clientY - lastMoveY);

    if (dist > 10 || (dist > 3 && now - lastMoveSpawnTime > 45)) {
      const spawnCount = window.innerWidth < 768 ? 1 : 2;
      for (let k = 0; k < spawnCount; k++) {
        spawnPointerToken(e.clientX, e.clientY);
      }
      lastMoveX = e.clientX;
      lastMoveY = e.clientY;
      lastMoveSpawnTime = now;
    }
  };

  // Mouse click or stylus press: spawn radiant burst of math/code
  const onPointerDown = (e: PointerEvent): void => {
    pointer.targetX = e.clientX;
    pointer.targetY = e.clientY;
    const burstCount = window.innerWidth < 768 ? 4 : 7;
    spawnPointerBurst(e.clientX, e.clientY, burstCount);
  };

  const onPointerLeave = (): void => {
    pointer.targetX = -2000;
    pointer.targetY = -2000;
  };

  // Finger tap: spawn rich burst directly under fingertip
  const onTouchStart = (e: TouchEvent): void => {
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      pointer.targetX = touch.clientX;
      pointer.targetY = touch.clientY;
      const burstCount = window.innerWidth < 768 ? 4 : 6;
      spawnPointerBurst(touch.clientX, touch.clientY, burstCount);
    }
  };

  // Finger drag: generate continuous trail directly at fingertip
  const onTouchMove = (e: TouchEvent): void => {
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      pointer.targetX = touch.clientX;
      pointer.targetY = touch.clientY;
      spawnPointerToken(touch.clientX, touch.clientY);
      if (Math.random() > 0.45) {
        spawnPointerToken(touch.clientX, touch.clientY);
      }
    }
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  // Initial ambient seeding distributed everywhere across the view
  const initialSeedCount = window.innerWidth < 768 ? 6 : 10;
  for (let i = 0; i < initialSeedCount; i++) {
    const t = createAmbientToken();
    t.life = Math.random() * t.maxLife * 0.65;
    activeTokens.push(t);
  }

  let animationId = 0;
  let isRunning = true;
  let lastTime = performance.now();
  let lastSpawnTime = performance.now();
  const SPAWN_INTERVAL_MS = 2400; // Slow ambient cadence for general background

  function render(time: number): void {
    if (!isRunning) return;

    animationId = requestAnimationFrame(render);

    // Pause calculations if tab is hidden
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

    // Slow ambient background spawning everywhere in view
    const ambientCount = activeTokens.filter(t => !t.isPointer).length;
    const maxAmbient = window.innerWidth < 768 ? 10 : 16;
    if (time - lastSpawnTime > SPAWN_INTERVAL_MS && ambientCount < maxAmbient) {
      activeTokens.push(createAmbientToken());
      lastSpawnTime = time;
    }

    // Minimum baseline guarantee
    if (ambientCount < 4) {
      activeTokens.push(createAmbientToken());
    }

    // Render & drift tokens
    for (let i = activeTokens.length - 1; i >= 0; i--) {
      const token = activeTokens[i];
      token.life += 1 * deltaFactor;

      const progress = token.life / token.maxLife;

      if (token.isPointer) {
        // Pointer / finger tip tokens: snappy fade-in (12%), sustained glow (50%), graceful fade-out (38%)
        if (progress < 0.12) {
          token.alpha = (progress / 0.12) * token.maxAlpha;
        } else if (progress > 0.62) {
          token.alpha = ((1 - progress) / 0.38) * token.maxAlpha;
        } else {
          token.alpha = token.maxAlpha;
        }

        // Slight deceleration for organic particle physics
        token.vx *= Math.pow(0.985, deltaFactor);
        token.vy *= Math.pow(0.985, deltaFactor);
      } else {
        // Ambient background tokens: gentle 20% fade-in, 55% hold, 25% fade-out
        if (progress < 0.2) {
          token.alpha = (progress / 0.2) * token.maxAlpha;
        } else if (progress > 0.75) {
          token.alpha = ((1 - progress) / 0.25) * token.maxAlpha;
        } else {
          token.alpha = token.maxAlpha;
        }
      }

      // Drift position
      token.x += token.vx * deltaFactor;
      token.y += token.vy * deltaFactor;

      // Soft non-intrusive cursor avoidance applies only to ambient background tokens
      if (!token.isPointer && pointer.x > -1000 && pointer.y > -1000 && !prefersReducedMotion) {
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
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    }
  };
}
