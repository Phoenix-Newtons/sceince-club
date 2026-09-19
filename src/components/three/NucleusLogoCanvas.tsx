import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { NucleusLogoScene } from './NucleusLogoScene';
import type { NucleusLogoState } from './logoState';
import { LOGO_RENDER_SIZE } from '../../lib/landingTheme';

/** Fires once, after the first real WebGL frame, so the loader can advance. */
function FirstFrame({ onFirstFrame }: { onFirstFrame: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onFirstFrame();
  });
  return null;
}

interface NucleusLogoCanvasProps {
  /** Mutable animation state — never causes a React re-render. */
  stateRef: React.MutableRefObject<NucleusLogoState>;
  reduced?: boolean;
  /** Compact mode drops the particle halo (used once docked in the header). */
  compact?: boolean;
  onFirstFrame?: () => void;
}

/**
 * The Nucleus 3D logo. This module is the code-split boundary: Three.js and
 * React Three Fiber only enter the dependency graph when the browser imports
 * it (see `lazyLogoCanvas` in `NucleusOrb`), so nothing here blocks first paint.
 */
export default function NucleusLogoCanvas({
  stateRef,
  reduced = false,
  compact = false,
  onFirstFrame,
}: NucleusLogoCanvasProps) {
  const handleFirstFrame = onFirstFrame ?? (() => undefined);
  const stableCallback = useRef(handleFirstFrame);

  useEffect(() => {
    stableCallback.current = handleFirstFrame;
  }, [handleFirstFrame]);

  return (
    <Canvas
      style={{ width: LOGO_RENDER_SIZE, height: LOGO_RENDER_SIZE, display: 'block' }}
      camera={{ position: [0, 0, 4.2], fov: 38, near: 0.1, far: 40 }}
      dpr={[1, 2]}
      flat
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      resize={{ scroll: false }}
    >
      <FirstFrame onFirstFrame={() => stableCallback.current()} />
      <NucleusLogoScene state={stateRef} reduced={reduced} compact={compact} />
    </Canvas>
  );
}
