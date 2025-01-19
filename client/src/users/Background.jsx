import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Stars, Float } from '@react-three/drei';
import * as random from 'maath/random';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

function ParticleField() {
  const { theme } = useTheme();
  const particlesRef = useRef();
  const particlesRef2 = useRef();
  const particlesRef3 = useRef();
  
  // Memoize particle positions
  const [sphere, sphere2, helix] = useMemo(() => {
    const s1 = random.inSphere(new Float32Array(5000 * 3), { 
      radius: 1.4,
      center: new Float32Array([0, 0, 0])
    });

    const s2 = random.inSphere(new Float32Array(2000 * 3), { 
      radius: 2,
      center: new Float32Array([0, 0, 0])
    });

    const points = [];
    for(let i = 0; i < 100; i++) {
      const t = i * 0.1;
      points.push(
        Math.cos(t) * 2,
        t * 0.1 - 5,
        Math.sin(t) * 2
      );
    }
    return [s1, s2, new Float32Array(points)];
  }, []);

  // Optimize animation frame
  const animate = useCallback((delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x -= delta / 15;
      particlesRef.current.rotation.y -= delta / 20;
    }
    if (particlesRef2.current) {
      particlesRef2.current.rotation.x += delta / 25;
      particlesRef2.current.rotation.y += delta / 30;
    }
    if (particlesRef3.current) {
      particlesRef3.current.rotation.y += delta / 10;
    }
  }, []);

  useFrame((_, delta) => animate(delta));

  const particleColor = theme === 'dark' ? '#4c35e0' : '#6366f1';
  const particleColor2 = theme === 'dark' ? '#35e0d0' : '#3b82f6';
  const particleColor3 = theme === 'dark' ? '#e035a7' : '#ec4899';

  return (
    <>
      <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
        <group rotation={[0, 0, Math.PI / 4]}>
          <Points ref={particlesRef} positions={sphere} stride={3} frustumCulled={false}>
            <PointMaterial
              transparent
              color={particleColor}
              size={0.002}
              sizeAttenuation={true}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </Points>
        </group>
      </Float>

      <group rotation={[Math.PI / 6, 0, Math.PI / 3]}>
        <Points ref={particlesRef2} positions={sphere2} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color={particleColor2}
            size={0.001}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </Points>
      </group>

      <Float speed={2} rotationIntensity={2} floatIntensity={1}>
        <Points ref={particlesRef3} positions={helix} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color={particleColor3}
            size={0.003}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </Points>
      </Float>

      <Stars 
        radius={50}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <ambientLight intensity={0.1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} />
    </>
  );
}

export default function Background() {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 -z-10 transition-opacity duration-300">
      <Canvas 
        camera={{ position: [0, 0, 1.5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ParticleField />
        <fog attach="fog" args={[theme === 'dark' ? '#050816' : '#ffffff', 3.5, 7]} />
      </Canvas>
    </div>
  );
}