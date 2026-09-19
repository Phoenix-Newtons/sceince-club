import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  /** Depth 0.2 (far) – 1 (near): drives size, speed and twinkle */
  z: number;
  r: number;
  phase: number;
  twinkleSpeed: number;
  tint: 'white' | 'cyan' | 'gold';
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const STAR_TINTS: Record<Star['tint'], string> = {
  white: '255, 255, 255',
  cyan: '165, 243, 252',
  gold: '254, 240, 138',
};

/**
 * Animated starfield: three parallax layers of drifting, twinkling stars with
 * the occasional shooting star, plus a gentle pointer parallax. Renders a
 * single static frame when the user prefers reduced motion.
 */
export function StarfieldCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let time = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: 0.5, y: 0.5 }; // normalised target
    const offset = { x: 0, y: 0 }; // eased parallax offset
    let stars: Star[] = [];
    let comet: Comet | null = null;
    let cometCooldown = 240; // frames until the first shooting star

    const seed = () => {
      const count = Math.max(90, Math.min(220, Math.round((width * height) / 6500)));
      stars = Array.from({ length: count }, () => {
        const z = 0.2 + Math.random() * 0.8;
        const tintRoll = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: z < 0.5 ? 0.4 + Math.random() * 0.6 : 0.7 + Math.random() * 1.3,
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.5 + Math.random() * 1.4,
          tint: tintRoll > 0.88 ? 'gold' : tintRoll > 0.62 ? 'cyan' : 'white',
        };
      });
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        const twinkle = 0.55 + 0.45 * Math.sin(time * star.twinkleSpeed + star.phase);
        const parallax = star.z * 14;
        const x = star.x + offset.x * parallax;
        const y = star.y + offset.y * parallax;
        const alpha = (0.25 + 0.75 * twinkle) * (0.35 + 0.65 * star.z);

        if (star.r > 1) {
          ctx.save();
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${STAR_TINTS[star.tint]}, ${alpha.toFixed(3)})`;
          ctx.fillStyle = `rgba(${STAR_TINTS[star.tint]}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, star.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(${STAR_TINTS[star.tint]}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (comet) {
        const fade = Math.min(1, comet.life / (comet.maxLife * 0.25), (comet.maxLife - comet.life) / (comet.maxLife * 0.4));
        const tail = 90;
        const gradient = ctx.createLinearGradient(
          comet.x,
          comet.y,
          comet.x - comet.vx * tail,
          comet.y - comet.vy * tail,
        );
        gradient.addColorStop(0, `rgba(103, 232, 249, ${(0.9 * fade).toFixed(3)})`);
        gradient.addColorStop(1, 'rgba(103, 232, 249, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(comet.x, comet.y);
        ctx.lineTo(comet.x - comet.vx * tail, comet.y - comet.vy * tail);
        ctx.stroke();
      }
    };

    const spawnComet = () => {
      const fromLeft = Math.random() > 0.5;
      const speed = 7 + Math.random() * 5;
      comet = {
        x: fromLeft ? -40 : width * (0.3 + Math.random() * 0.7),
        y: Math.random() * height * 0.4,
        vx: fromLeft ? speed : -speed * 0.4,
        vy: speed * (0.35 + Math.random() * 0.3),
        life: 0,
        maxLife: 60 + Math.random() * 40,
      };
    };

    const step = () => {
      time += 0.016;

      // Slow, steady drift — nearer stars move faster (parallax).
      for (const star of stars) {
        star.x -= 0.05 + star.z * 0.12;
        star.y += 0.012 * star.z;
        if (star.x < -4) star.x = width + 4;
        if (star.y > height + 4) star.y = -4;
      }

      // Ease the parallax offset toward the pointer.
      offset.x += (pointer.x - 0.5) * 0.02 - offset.x * 0.04;
      offset.y += (pointer.y - 0.5) * 0.02 - offset.y * 0.04;

      if (comet) {
        comet.x += comet.vx;
        comet.y += comet.vy;
        comet.life += 1;
        if (comet.life > comet.maxLife || comet.x > width + 120 || comet.y > height + 120) {
          comet = null;
          cometCooldown = 260 + Math.random() * 480;
        }
      } else {
        cometCooldown -= 1;
        if (cometCooldown <= 0) spawnComet();
      }

      drawFrame();
      raf = requestAnimationFrame(step);
    };

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();
    const observer = new ResizeObserver(() => {
      resize();
      if (reduced) drawFrame();
    });
    observer.observe(canvas);
    canvas.addEventListener('pointermove', onPointer);

    if (reduced) {
      drawFrame();
    } else {
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} aria-hidden="true" />;
}
