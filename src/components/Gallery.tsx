import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import Room from './Room';
import ArtworkDialog from './ArtworkDialog';
import ControlsInfo from './ControlsInfo';
import VisitorBook from './VisitorBook';
import { artworks } from '../data/artworks';

type VisitorData = {
  name: string;
  email: string;
  message?: string;
  subscribe: boolean;
};

const Gallery: React.FC = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<typeof artworks[0] | null>(null);
  const [isControlsEnabled, setIsControlsEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showVisitorBook, setShowVisitorBook] = useState(true);
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const controlsRef = useRef<any>(null);
  
  // Handle keyboard controls for camera movement with free movement
  useEffect(() => {
    // Reduced movement speed for more realistic walking pace
    const moveSpeed = 0.05;
    const keys = { 
      w: false, 
      a: false, 
      s: false, 
      d: false,
      arrowup: false,
      arrowdown: false,
      arrowleft: false,
      arrowright: false
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys) {
        keys[key as keyof typeof keys] = true;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys) {
        keys[key as keyof typeof keys] = false;
      }
    };
    
    // Room boundaries (matching the Room component dimensions)
    const roomBoundaries = {
      minX: -9.5, // slightly inside wall at -10
      maxX: 9.5,  // slightly inside wall at 10
      minZ: -9.5, // slightly inside wall at -10
      maxZ: 9.5   // slightly inside wall at 10
    };
    
    // Movement logic function with true free movement and room boundaries
    const updatePosition = () => {
      if (!controlsRef.current) return;
      
      const controls = controlsRef.current;
      const camera = controls.object;
      
      // Get camera's forward and right vectors for movement relative to where you're looking
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      
      // Remove vertical component to keep movement horizontal
      forward.y = 0;
      right.y = 0;
      
      // Normalize vectors to ensure consistent speed in all directions
      forward.normalize();
      right.normalize();
      
      const movement = new THREE.Vector3(0, 0, 0);
      
      // Calculate movement direction
      if (keys.w) movement.add(forward.clone().multiplyScalar(moveSpeed));
      if (keys.s) movement.add(forward.clone().multiplyScalar(-moveSpeed));
      if (keys.a) movement.add(right.clone().multiplyScalar(-moveSpeed));
      if (keys.d) movement.add(right.clone().multiplyScalar(moveSpeed));
      
      // Apply movement if any keys are pressed
      if (movement.length() > 0) {
        // Calculate new position
        const newPosition = camera.position.clone().add(movement);
        
        // Check boundaries and clamp position if necessary
        newPosition.x = Math.max(roomBoundaries.minX, Math.min(roomBoundaries.maxX, newPosition.x));
        newPosition.z = Math.max(roomBoundaries.minZ, Math.min(roomBoundaries.maxZ, newPosition.z));
        
        // Apply the boundary-checked position
        camera.position.copy(newPosition);
      }
      
      // Keep camera at a fixed height (eye level)
      camera.position.y = 1.6;
      
      // Handle camera rotation with arrow keys
      if (keys.arrowup) {
        camera.rotation.x = Math.max(-Math.PI / 2, camera.rotation.x - 0.03);
      }
      if (keys.arrowdown) {
        camera.rotation.x = Math.min(Math.PI / 2, camera.rotation.x + 0.03);
      }
      if (keys.arrowleft) {
        camera.rotation.y += 0.03;
      }
      if (keys.arrowright) {
        camera.rotation.y -= 0.03;
      }
      
      // Update controls target based on where camera is looking
      const lookDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const targetPosition = new THREE.Vector3().addVectors(
        camera.position, 
        lookDirection.multiplyScalar(1)
      );
      controls.target.copy(targetPosition);
      
      // Disable auto rotation of controls
      controls.autoRotate = false;
    };
    
    // Animation loop for smooth movement
    let animationId: number;
    const animate = () => {
      updatePosition();
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle click on artwork
  const handleArtworkClick = (artwork: typeof artworks[0]) => {
    setSelectedArtwork(artwork);
    setDialogOpen(true);
  };

  // Handle visitor book submission
  const handleVisitorBookSubmit = (data: VisitorData) => {
    setVisitorData(data);
    setShowVisitorBook(false);
    console.log("Visitor book signed:", data);
  };

  // If the visitor book is shown, don't render the gallery yet
  if (showVisitorBook) {
    return <VisitorBook onSubmit={handleVisitorBookSubmit} />;
  }

  return (
    <div className="w-full h-screen relative">
      <Canvas 
        shadows
        camera={{ position: [0, 1.6, 0], fov: 75 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]} // Limit pixel ratio for better performance
      >
        <fog attach="fog" args={['#f0f0f0', 1, 25]} />
        <color attach="background" args={['#f0f0f0']} />
        
        {/* Simplified Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]} // Reduced shadow map size
        />
        <pointLight position={[0, 5, 0]} intensity={0.8} castShadow />
        
        {/* Room with artwork */}
        <Room onArtworkClick={handleArtworkClick} />
        
        {/* Controls */}
        <OrbitControls 
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={0.5}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2}
          enablePan={false}
          enabled={isControlsEnabled}
        />
      </Canvas>
      
      {/* Center dialog for artwork details */}
      <ArtworkDialog 
        artwork={selectedArtwork}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      
      <ControlsInfo />
    </div>
  );
};

export default Gallery;
