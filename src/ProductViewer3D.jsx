import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Grid, Text, Line } from '@react-three/drei';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';

// ─── Stable Model Loader ───
const Model = React.memo(({ path, color, onMeasured }) => {
  const { scene } = useGLTF(path, undefined, undefined, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const measuredRef = useRef(false);
  const prevPathRef = useRef(null);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        // Fix SketchUp missing normals
        if (!child.geometry.attributes.normal) {
           child.geometry.computeVertexNormals();
        }
        
        // Fix SketchUp flipped faces (make double sided)
        child.material = new THREE.MeshStandardMaterial({
           color: color === 'white' ? 0xf5f5f0 : 0x1a1a1a,
           roughness: 0.3,
           metalness: 0.2,
           side: THREE.DoubleSide,
           envMapIntensity: 1.5
        });
      }
    });
    return clone;
  }, [scene, color]);

  useEffect(() => {
    if (prevPathRef.current !== path) {
      measuredRef.current = false;
      prevPathRef.current = path;
    }
  }, [path]);

  useEffect(() => {
    if (!clonedScene || measuredRef.current) return;

    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);

    let w = size.x, h = size.y, d = size.z;
    const maxDim = Math.max(w, h, d);
    let unitScale = 1;
    if (maxDim > 0 && maxDim < 10) unitScale = 1000;
    else if (maxDim > 0 && maxDim < 150) unitScale = 25.4;

    measuredRef.current = true;
    if (onMeasured) {
      onMeasured({
        w: w * unitScale, h: h * unitScale, d: d * unitScale,
        rawW: w, rawH: h, rawD: d,
        centerY: (box.min.y + box.max.y) / 2,
        minY: box.min.y,
      });
    }
  }, [clonedScene, onMeasured]);

  return <primitive object={clonedScene} />;
});

// ─── Dimension Axes from Origin (0,0,0) ───
const DimensionAxes = React.memo(({ dim }) => {
  if (!dim) return null;
  const textSz = Math.max(dim.rawW, dim.rawH, dim.rawD) * 0.05;

  return (
    <group>
      <Line points={[[0, 0, 0], [dim.rawW, 0, 0]]} color="#E74C3C" lineWidth={2} />
      <Text position={[dim.rawW + textSz, 0, 0]} fontSize={textSz} color="#E74C3C" anchorX="left" outlineWidth={textSz * 0.08} outlineColor="#111">
        {dim.w.toFixed(0)} mm
      </Text>

      <Line points={[[0, 0, 0], [0, dim.rawH, 0]]} color="#2ECC71" lineWidth={2} />
      <Text position={[0, dim.rawH + textSz * 0.6, 0]} fontSize={textSz} color="#2ECC71" anchorY="bottom" outlineWidth={textSz * 0.08} outlineColor="#111">
        {dim.h.toFixed(0)} mm
      </Text>

      <Line points={[[0, 0, 0], [0, 0, dim.rawD]]} color="#3498DB" lineWidth={2} />
      <Text position={[0, 0, dim.rawD + textSz]} fontSize={textSz} color="#3498DB" rotation={[0, Math.PI / 4, 0]} anchorX="left" outlineWidth={textSz * 0.08} outlineColor="#111">
        {dim.d.toFixed(0)} mm
      </Text>
    </group>
  );
});

// ─── Scene Setup: frames camera + controls when dim arrives ───
const SceneSetup = ({ dim, controlsRef }) => {
  const { camera } = useThree();
  const doneRef = useRef(null);

  useEffect(() => {
    if (!dim) return;
    const key = `${dim.rawW}_${dim.rawH}_${dim.rawD}`;
    if (doneRef.current === key) return;
    doneRef.current = key;

    const maxRaw = Math.max(dim.rawW, dim.rawH, dim.rawD);
    const dist = maxRaw * 2.2;

    // Position camera at a nice angle
    camera.position.set(dist * 0.8, dist * 0.6, dist * 0.8);
    camera.near = maxRaw * 0.001;
    camera.far = maxRaw * 200;
    camera.updateProjectionMatrix();

    // Point controls target at center of object
    if (controlsRef.current) {
      controlsRef.current.target.set(0, dim.rawH * 0.4, 0);
      controlsRef.current.update();
    }

    camera.lookAt(0, dim.rawH * 0.4, 0);
  }, [dim, camera, controlsRef]);

  return null;
};

// ─── Main 3D Viewer ───
export default function ProductViewer3D({ product, config }) {
  const [dim, setDim] = useState(null);
  const [contextLost, setContextLost] = useState(false);
  const controlsRef = useRef();

  const handleMeasured = useCallback((data) => {
    setDim(data);
  }, []);

  let filename = product.id;
  if (product.id === 'chair-short') {
    filename = (config && config.activeAddons && config.activeAddons.includes('chair-long')) ? 'chair_long' : 'chair_short';
  } else if (product.id === 'table-dining') {
    filename = 'table_dining';
  } else if (product.id === 'hose') {
    filename = 'hose';
  }
  const modelPath = `/models/${filename}.glb`;

  const maxRaw = dim ? Math.max(dim.rawW, dim.rawH, dim.rawD) : 2;

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', position: 'relative', background: '#2a2a2a' }}>
      <Canvas 
        shadows 
        camera={{ position: [5, 4, 5], fov: 40 }} 
        gl={{ antialias: true, failIfMajorPerformanceCaveat: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setContextLost(true);
          });
        }}
      >

        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[maxRaw * 2, maxRaw * 2, maxRaw]} intensity={1.8} castShadow />
        <directionalLight position={[-maxRaw, maxRaw, -maxRaw * 0.5]} intensity={0.4} />

        {/* HDR Environment */}
        <React.Suspense fallback={null}>
          <Environment preset="city" />
        </React.Suspense>

        {/* Auto camera+controls framing */}
        <SceneSetup dim={dim} controlsRef={controlsRef} />

        {/* Model positioned so bottom sits on Y=0 */}
        <group position={[0, dim ? -dim.minY : 0, 0]}>
          <React.Suspense fallback={null}>
            <Model path={modelPath} color={config?.color} onMeasured={handleMeasured} />
          </React.Suspense>
        </group>

        {/* Soft shadow on floor */}
        <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={maxRaw * 5} blur={2.5} far={maxRaw * 3} resolution={512} color="#000000" />

        {/* Blender-style Grid Floor */}
        <Grid
          position={[0, -0.02, 0]}
          cellSize={maxRaw * 0.1}
          cellThickness={0.6}
          cellColor="#3d3d3d"
          sectionSize={maxRaw * 1}
          sectionThickness={1.2}
          sectionColor="#555555"
          fadeDistance={maxRaw * 12}
          fadeStrength={1.5}
          infiniteGrid={true}
        />

        {/* Dimension Axes */}
        {dim && <DimensionAxes dim={dim} />}

        {/* Blender-style Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          zoomSpeed={0.6}
          panSpeed={0.6}
          rotateSpeed={0.6}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>

      {/* Controls Legend */}
      <div style={{
        position: 'absolute', bottom: '20px', left: '20px',
        padding: '10px 18px',
        background: 'rgba(30,30,30,0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.08)',
        fontSize: '12px', color: '#ccc', lineHeight: '1.6'
      }}>
        <strong style={{ color: '#fff' }}>🕹️ 3D Studio</strong><br />
        <span style={{ color: '#999' }}>
          • LMB Drag → Rotate<br />
          • Scroll → Zoom<br />
          • RMB Drag → Pan
        </span>
      </div>

      {/* Dimension Badge */}
      {dim && (
        <div style={{
          position: 'absolute', top: '20px', right: '20px',
          padding: '12px 20px',
          background: 'rgba(30,30,30,0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.08)',
          fontSize: '12px', color: '#ccc', lineHeight: '1.8',
          fontFamily: 'Inter, monospace'
        }}>
          <strong style={{ color: '#fff', fontSize: '13px' }}>📐 Dimensions</strong><br />
          <span style={{ color: '#E74C3C' }}>W</span> {dim.w.toFixed(0)} mm<br />
          <span style={{ color: '#2ECC71' }}>H</span> {dim.h.toFixed(0)} mm<br />
          <span style={{ color: '#3498DB' }}>D</span> {dim.d.toFixed(0)} mm
        </div>
      )}
    </div>
  );
}
