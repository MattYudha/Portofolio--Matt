import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePortfolioStore } from "../../store/usePortfolioStore";

const fireVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fireFragmentShader = `
uniform float time;
varying vec2 vUv;

// Noise generation functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vec2 uv = vUv;
  
  // Create upward moving noise
  float noise = snoise(vec3(uv.x * 5.0, uv.y * 5.0 - time * 3.0, time * 0.5));
  float noise2 = snoise(vec3(uv.x * 10.0, uv.y * 10.0 - time * 5.0, time * 1.0));
  
  // Shape the fire (taper at top, wide at bottom)
  float shape = uv.y;
  float flameMask = 1.0 - distance(vec2(uv.x, uv.y * 0.5), vec2(0.5, 0.2)) * 2.0;
  
  // Combine noise and shape
  float fireIntensity = flameMask * 0.5 + noise * 0.3 + noise2 * 0.1;
  fireIntensity = smoothstep(0.1, 0.8, fireIntensity);
  
  // Add gradient colors (yellow center, orange mid, red edge, dark fade)
  vec3 color = mix(
    vec3(1.0, 0.0, 0.0), // Red
    vec3(1.0, 0.8, 0.1), // Yellow/Orange
    smoothstep(0.3, 0.7, fireIntensity)
  );
  
  // Fade out top and edges
  float alpha = fireIntensity * smoothstep(1.0, 0.2, uv.y);
  
  // Only render if bright enough
  if (alpha < 0.05) discard;
  
  gl_FragColor = vec4(color, alpha);
}
`;

export default function Campfire(props) {
  const isNightMode = usePortfolioStore((state) => state.isNightMode);
  const materialRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
    if (lightRef.current) {
      // Flickering logic directly on reference to avoid re-renders
      // Base intensity higher in night mode
      const targetIntensity = isNightMode ? 35.0 : 0.0;
      const flicker = Math.sin(state.clock.elapsedTime * 15) * 5.0 + Math.sin(state.clock.elapsedTime * 7) * 3.0;
      
      // Smoothly lerp towards target intensity with flicker
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        targetIntensity > 0 ? targetIntensity + flicker : 0,
        0.2
      );

    }
  });

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
    }),
    []
  );

  // Generate a ring of rocks
  const rocks = useMemo(() => {
    const arr = [];
    const numRocks = 8;
    const radius = 0.4;
    for (let i = 0; i < numRocks; i++) {
      const angle = (i / numRocks) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      arr.push({ x, y: 0.05, z, angle });
    }
    return arr;
  }, []);

  return (
    <group {...props}>
      <mesh position={[0, 0.5, 0]}>
        <planeGeometry args={[1, 1.5]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={fireVertexShader}
          fragmentShader={fireFragmentShader}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Logs */}
      <group>
        <mesh position={[0, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} userData={{ skipTint: true }}>
          <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[0, Math.PI / 3, Math.PI / 2]} userData={{ skipTint: true }}>
          <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
          <meshStandardMaterial color="#4e342e" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.1, 0]} rotation={[0, -Math.PI / 3, Math.PI / 2]} userData={{ skipTint: true }}>
          <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
      </group>

      {/* Ring of Rocks */}
      <group>
        {rocks.map((rock, i) => (
          <mesh key={i} position={[rock.x, rock.y, rock.z]} rotation={[0, rock.angle, 0]} userData={{ skipTint: true }}>
            <dodecahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial color="#757575" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* The Campfire Light */}
      <pointLight
        ref={lightRef}
        color="#ff7b00"
        position={[0, 0.5, 0]}
        distance={20}
        intensity={0}
        decay={1.5}
      />
    </group>
  );
}
