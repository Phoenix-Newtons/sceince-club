import { useEffect, useRef, type ReactNode } from 'react';

interface Orbiter {
  angle: number;
  speed: number;
  dist: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  cyan: boolean;
  orbiter: Orbiter | null;
}

const LINK_DIST = 110;
const MOUSE_DIST = 150;

/**
 * Abstract, scientific canvas illustration: a drifting molecular network with
 * glowing nodes, connecting bonds and orbiting electrons. The network reacts
 * to the pointer, and renders a single static frame when the user prefers
 * reduced motion.
 */
export function HeroCanvas({ children }: { children?: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let particles: Particle[] = [];

    const seed = () => {
      const count = Math.max(30, Math.min(58, Math.round((width * height) / 16000)));
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: 1.5 + Math.random() * 1.8,
        cyan: Math.random() < 0.4,
        orbiter:
          i % 8 === 0
            ? { angle: Math.random() * Math.PI * 2, speed: 0.008 + Math.random() * 0.012, dist: 12 + Math.random() * 8 }
            : null,
      }));
    };

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // Bonds
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.32;
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        // Pointer bonds
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < MOUSE_DIST * MOUSE_DIST) {
          const alpha = (1 - Math.sqrt(md2) / MOUSE_DIST) * 0.45;
          ctx.strokeStyle = `rgba(103, 232, 249, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Nodes
      for (const p of particles) {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.cyan ? 'rgba(34, 211, 238, 0.9)' : 'rgba(99, 102, 241, 0.9)';
        ctx.fillStyle = p.cyan ? 'rgba(165, 243, 252, 0.95)' : 'rgba(199, 210, 254, 0.95)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.orbiter) {
          p.orbiter.angle += p.orbiter.speed;
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.orbiter.dist, 0, Math.PI * 2);
          ctx.stroke();
          const ex = p.x + Math.cos(p.orbiter.angle) * p.orbiter.dist;
          const ey = p.y + Math.sin(p.orbiter.angle) * p.orbiter.dist;
          ctx.save();
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(34, 211, 238, 1)';
          ctx.fillStyle = 'rgba(103, 232, 249, 1)';
          ctx.beginPath();
          ctx.arc(ex, ey, 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    };

    const step = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 8 || p.x > width - 8) p.vx *= -1;
        if (p.y < 8 || p.y > height - 8) p.vy *= -1;

        // Gentle attraction toward the pointer
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_DIST * MOUSE_DIST && d2 > 1) {
          const d = Math.sqrt(d2);
          p.vx += (dx / d) * 0.006;
          p.vy += (dy / d) * 0.006;
        }
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 0.55) {
          p.vx = (p.vx / speed) * 0.55;
          p.vy = (p.vy / speed) * 0.55;
        }
      }
      drawFrame();
      raf = requestAnimationFrame(step);
    };

    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();
    const observer = new ResizeObserver(() => {
      resize();
      if (reduced) drawFrame();
    });
    observer.observe(container);
    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerleave', onLeave);

    if (reduced) {
      drawFrame();
    } else {
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full cursor-crosshair overflow-hidden rounded-3xl bg-slate-950 shadow-lift ring-1 ring-slate-900/10"
    >
      <div className="pointer-events-none absolute inset-0 bg-dots-dark" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-600/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" aria-hidden="true" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      {children}
    </div>
  );
}
