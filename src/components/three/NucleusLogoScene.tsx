import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { NucleusLogoState } from './logoState';

const NEON_BLUE = new THREE.Color('#38BDF8');
const QUANTUM = new THREE.Color('#8B5CF6');
const CORE = new THREE.Color('#4F7CFF');

/* ------------------------------------------------------------------ *
 * Shaders
 * ------------------------------------------------------------------ */

const FRESNEL_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRESNEL_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = pow(1.0 - clamp(dot(vNormal, vView), 0.0, 1.0), uPower);
    gl_FragColor = vec4(uColor * rim * uIntensity, rim);
  }
`;

const PLASMA_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const PLASMA_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;

  void main() {
    float rim = pow(1.0 - clamp(dot(vNormal, vView), 0.0, 1.0), 2.2);
    // Cheap layered sine "plasma" — no noise texture, no extra draw cost.
    float bands =
      sin(vPos.y * 9.0 - uTime * 1.4) * 0.5 +
      sin(vPos.x * 11.0 + uTime * 0.9) * 0.3 +
      sin((vPos.x + vPos.z) * 6.0 - uTime * 2.1) * 0.2;
    float plasma = smoothstep(-0.35, 0.85, bands);
    vec3 colour = mix(uColorA, uColorB, plasma * 0.85 + rim * 0.35);
    float alpha = 0.55 + rim * 0.45 + plasma * 0.12 * (0.4 + uEnergy);
    gl_FragColor = vec4(colour * (0.85 + uEnergy * 0.75 + rim), clamp(alpha, 0.0, 1.0));
  }
`;

/* ------------------------------------------------------------------ *
 * Orbital rings
 * ------------------------------------------------------------------ */

interface RingConfig {
  radius: number;
  tilt: [number, number, number];
  spinAxis: 'x' | 'y' | 'z';
  speed: number;
  colour: THREE.Color;
  electrons: number;
}

const RINGS: RingConfig[] = [
  { radius: 0.72, tilt: [Math.PI / 2.35, 0, 0.35], spinAxis: 'z', speed: 0.55, colour: NEON_BLUE, electrons: 1 },
  { radius: 0.92, tilt: [Math.PI / 1.7, 0.5, -0.25], spinAxis: 'z', speed: -0.42, colour: QUANTUM, electrons: 2 },
  { radius: 1.14, tilt: [Math.PI / 1.35, -0.45, 0.7], spinAxis: 'z', speed: 0.3, colour: CORE, electrons: 1 },
];

function OrbitalRing({
  config,
  state,
  reduced,
}: {
  config: RingConfig;
  state: React.MutableRefObject<NucleusLogoState>;
  reduced: boolean;
}) {
  const spin = useRef<THREE.Group>(null);
  const electrons = useRef<THREE.Group[]>([]);

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: config.colour,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [config.colour],
  );

  useEffect(() => () => ringMaterial.dispose(), [ringMaterial]);

  useFrame((_, delta) => {
    const group = spin.current;
    if (!group) return;
    const { progress, energy } = state.current;
    // Rings accelerate with load progress, then settle to a calm idle spin.
    const boost = reduced ? 0.25 : 1 + progress * 2.6 + energy * 1.2;
    group.rotation.z += delta * config.speed * boost;

    for (let i = 0; i < electrons.current.length; i += 1) {
      const electron = electrons.current[i];
      if (!electron) continue;
      const pulse = 1 + Math.sin(performance.now() * 0.004 + i * 1.7) * 0.22;
      const scale = (0.85 + progress * 0.35 + energy * 0.3) * pulse;
      electron.scale.setScalar(Math.max(0.0001, scale));
      electron.rotation.y += delta * 1.6;
    }
  });

  return (
    <group rotation={config.tilt}>
      <group ref={spin}>
        <mesh material={ringMaterial}>
          <torusGeometry args={[config.radius, 0.0075, 8, 128]} />
        </mesh>
        {/* Faint halo band gives the orbit real depth instead of a flat line. */}
        <mesh>
          <torusGeometry args={[config.radius, 0.028, 8, 96]} />
          <meshBasicMaterial
            color={config.colour}
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {Array.from({ length: config.electrons }).map((_, index) => (
          <group
            key={index}
            rotation={[0, 0, (index * Math.PI * 2) / config.electrons]}
            ref={(node) => {
              if (node) electrons.current[index] = node;
            }}
          >
            <group position={[config.radius, 0, 0]}>
              <mesh>
                <icosahedronGeometry args={[0.045, 1]} />
                <meshBasicMaterial color="#F8FBFF" />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.105, 16, 16]} />
                <meshBasicMaterial
                  color={config.colour}
                  transparent
                  opacity={0.5}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Ambient particle halo
 * ------------------------------------------------------------------ */

function ParticleHalo({ count = 260 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 1.35 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.55;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: NEON_BLUE,
        size: 0.022,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.05;
  });

  return <points ref={points} geometry={geometry} material={material} />;
}

/* ------------------------------------------------------------------ *
 * The logo itself
 * ------------------------------------------------------------------ */

export function NucleusLogoScene({
  state,
  reduced = false,
  compact = false,
}: {
  state: React.MutableRefObject<NucleusLogoState>;
  reduced?: boolean;
  compact?: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const aura = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const clock = useRef(0);

  const plasmaUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uColorA: { value: CORE.clone() },
      uColorB: { value: QUANTUM.clone() },
    }),
    [],
  );

  const shellUniforms = useMemo(
    () => ({
      uColor: { value: NEON_BLUE.clone() },
      uIntensity: { value: 1.6 },
      uPower: { value: 2.4 },
    }),
    [],
  );

  const auraUniforms = useMemo(
    () => ({
      uColor: { value: QUANTUM.clone() },
      uIntensity: { value: 1.15 },
      uPower: { value: 1.5 },
    }),
    [],
  );

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    const { progress, energy, pointerX, pointerY } = state.current;
    const rate = reduced ? 0.12 : 0.18 + progress * 0.55 + energy * 0.35;
    clock.current += step * (reduced ? 0.4 : 1);

    if (root.current) {
      root.current.rotation.y += step * rate;
      // Pointer parallax, critically damped so it never feels twitchy.
      const targetX = pointerY * 0.28;
      const targetZ = -pointerX * 0.28;
      root.current.rotation.x += (targetX - root.current.rotation.x) * Math.min(1, step * 3.2);
      root.current.rotation.z += (targetZ - root.current.rotation.z) * Math.min(1, step * 3.2);
      const breathe = 1 + Math.sin(clock.current * 1.1) * 0.014 + energy * 0.04;
      root.current.scale.setScalar(breathe);
    }

    plasmaUniforms.uTime.value = clock.current;
    plasmaUniforms.uEnergy.value = progress * 0.75 + energy * 0.5;
    shellUniforms.uIntensity.value = 1.25 + progress * 1.5 + energy * 0.8;
    auraUniforms.uIntensity.value = 0.85 + progress * 1.35 + energy * 0.9;
    auraUniforms.uPower.value = 1.9 - progress * 0.5;

    if (core.current) {
      const pulse = 1 + Math.sin(clock.current * 2.1) * 0.02 + progress * 0.035;
      core.current.scale.setScalar(pulse);
    }

    // The aura physically expands as loading completes — the visual progress bar.
    if (aura.current) {
      const target = 1.02 + progress * 0.42 + energy * 0.28;
      const current = aura.current.scale.x;
      const next = current + (target - current) * Math.min(1, step * 2.6);
      aura.current.scale.setScalar(next);
    }

    if (shell.current) {
      shell.current.rotation.y -= step * rate * 0.6;
      shell.current.rotation.x += step * rate * 0.25;
    }

    if (light.current) light.current.intensity = 1.6 + progress * 3.4 + energy * 1.2;
  });

  return (
    <group ref={root}>
      <pointLight ref={light} position={[0, 0, 0]} color={NEON_BLUE} intensity={1.6} distance={6} decay={2} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2.4, 3, 2]} intensity={0.65} color="#CFE4FF" />

      {/* Crystalline core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.44, 1]} />
        <shaderMaterial
          vertexShader={PLASMA_VERT}
          fragmentShader={PLASMA_FRAG}
          uniforms={plasmaUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Faceted shell — the "abstract crystalline geometry" layer */}
      <mesh>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshBasicMaterial color={NEON_BLUE} wireframe transparent opacity={0.22} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Inner fresnel shell */}
      <mesh ref={shell}>
        <sphereGeometry args={[0.62, 48, 48]} />
        <shaderMaterial
          vertexShader={FRESNEL_VERT}
          fragmentShader={FRESNEL_FRAG}
          uniforms={shellUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Expanding aura — grows with loading progress */}
      <mesh ref={aura}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          vertexShader={FRESNEL_VERT}
          fragmentShader={FRESNEL_FRAG}
          uniforms={auraUniforms}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {RINGS.map((ring) => (
        <OrbitalRing key={ring.radius} config={ring} state={state} reduced={reduced} />
      ))}

      {!compact ? <ParticleHalo /> : null}
    </group>
  );
}
