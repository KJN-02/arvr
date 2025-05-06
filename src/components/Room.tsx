
import React, { useRef } from 'react';
import * as THREE from 'three';
import { Text, Box, Plane, useTexture } from '@react-three/drei';
import { artworks } from '../data/artworks';

interface RoomProps {
  onArtworkClick: (artwork: typeof artworks[0]) => void;
}

const Room: React.FC<RoomProps> = ({ onArtworkClick }) => {
  // Room dimensions
  const roomWidth = 20;
  const roomDepth = 20;
  const roomHeight = 5;
  const wallThickness = 0.1;
  
  // Create checkerboard material directly using standard material
  const checkerboardMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    metalness: 0.1,
  });
  
  // Create a checkerboard pattern using a shader
  checkerboardMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.checkSize = { value: 1.0 };
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
      varying vec2 vUv;`
    );
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      vUv = uv;`
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
      
      // Create checkerboard pattern
      vec2 position = vUv * 8.0;
      vec2 pos = floor(position);
      float pattern = mod(pos.x + pos.y, 2.0);
      
      // Mix between black and white
      diffuseColor.rgb = mix(vec3(0.9), vec3(0.1), pattern);
      `
    );
  };

  // Create ceiling grid material
  const ceilingMaterial = new THREE.MeshStandardMaterial({ 
    color: "#ffffff", 
    roughness: 0.5 
  });

  // Distribute artworks on walls - 5 per wall
  const artworkPositions = [];
  
  // North wall (back) - 5 frames
  for (let i = 0; i < 5; i++) {
    const artworkIndex = i % artworks.length;
    const artwork = artworks[artworkIndex];
    const width = 1.5;
    const height = 1.2;
    const spacing = roomWidth / 6; // Distribute 5 frames evenly
    const x = -roomWidth / 2 + spacing + i * spacing;
    
    artworkPositions.push({
      position: [x, roomHeight / 2, -roomDepth / 2 + wallThickness + 0.01],
      rotation: [0, 0, 0],
      artwork,
      scale: [width, height, 0.05]
    });
  }
  
  // East wall (right) - 5 frames
  for (let i = 0; i < 5; i++) {
    const artworkIndex = (i + 5) % artworks.length;
    const artwork = artworks[artworkIndex];
    const width = 1.5;
    const height = 1.2;
    const spacing = roomDepth / 6; // Distribute 5 frames evenly
    const z = -roomDepth / 2 + spacing + i * spacing;
    
    artworkPositions.push({
      position: [roomWidth / 2 - wallThickness - 0.01, roomHeight / 2, z],
      rotation: [0, -Math.PI / 2, 0],
      artwork,
      scale: [width, height, 0.05]
    });
  }
  
  // West wall (left) - 5 frames
  for (let i = 0; i < 5; i++) {
    const artworkIndex = (i + 10) % artworks.length;
    const artwork = artworks[artworkIndex];
    const width = 1.5;
    const height = 1.2;
    const spacing = roomDepth / 6; // Distribute 5 frames evenly
    const z = -roomDepth / 2 + spacing + i * spacing;
    
    artworkPositions.push({
      position: [-roomWidth / 2 + wallThickness + 0.01, roomHeight / 2, z],
      rotation: [0, Math.PI / 2, 0],
      artwork,
      scale: [width, height, 0.05]
    });
  }
  
  // South wall (front) - 5 frames
  for (let i = 0; i < 5; i++) {
    const artworkIndex = (i + 15) % artworks.length;
    const artwork = artworks[artworkIndex];
    const width = 1.5;
    const height = 1.2;
    const spacing = roomWidth / 6; // Distribute 5 frames evenly
    const x = -roomWidth / 2 + spacing + i * spacing;
    
    artworkPositions.push({
      position: [x, roomHeight / 2, roomDepth / 2 - wallThickness - 0.01],
      rotation: [0, Math.PI, 0],
      artwork,
      scale: [width, height, 0.05]
    });
  }

  // Custom component for artwork with image texture
  const Artwork = ({ position, rotation, artwork, scale }: { 
    position: [number, number, number],
    rotation: [number, number, number],
    artwork: typeof artworks[0],
    scale: [number, number, number]
  }) => {
    // Load artwork image as texture - properly handle the return type
    const texture = useTexture(artwork.image);
    
    return (
      <group 
        position={position} 
        rotation={rotation}
      >
        {/* Artwork frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[scale[0] + 0.1, scale[1] + 0.1, scale[2]]} />
          <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.8} />
        </mesh>
        
        {/* Artwork image */}
        <mesh 
          position={[0, 0, scale[2] / 2 + 0.01]} 
          onClick={() => onArtworkClick(artwork)}
        >
          <planeGeometry args={[scale[0] - 0.15, scale[1] - 0.15]} />
          <meshBasicMaterial map={texture} />
        </mesh>
        
        {/* Artwork title */}
        <Text
          position={[0, -(scale[1] / 2) - 0.2, scale[2] / 2 + 0.01]}
          fontSize={0.15}
          color="black"
          anchorX="center"
          anchorY="top"
          maxWidth={scale[0] * 0.8}
        >
          {artwork.title}
        </Text>
      </group>
    );
  };
  
  return (
    <group>
      {/* Floor with checkerboard pattern */}
      <mesh 
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomWidth, roomDepth]} />
        <primitive object={checkerboardMaterial} />
      </mesh>
      
      {/* Ceiling */}
      <mesh 
        position={[0, roomHeight, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomWidth, roomDepth]} />
        <primitive object={ceilingMaterial} />
      </mesh>
      
      {/* Walls with improved materials */}
      {/* North Wall (back) */}
      <mesh position={[0, roomHeight / 2, -roomDepth / 2]} receiveShadow castShadow>
        <boxGeometry args={[roomWidth, roomHeight, wallThickness]} />
        <meshStandardMaterial color="#f0e6d8" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* East Wall (right) */}
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, roomHeight, roomDepth]} />
        <meshStandardMaterial color="#f0e6d8" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* West Wall (left) */}
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, roomHeight, roomDepth]} />
        <meshStandardMaterial color="#f0e6d8" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* South Wall (front) */}
      <mesh position={[0, roomHeight / 2, roomDepth / 2]} receiveShadow castShadow>
        <boxGeometry args={[roomWidth, roomHeight, wallThickness]} />
        <meshStandardMaterial color="#f0e6d8" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Optimized lighting */}
      <pointLight 
        position={[-5, roomHeight - 0.2, -5]} 
        intensity={0.4}
        distance={8}
        decay={2}
        castShadow
      />
      <pointLight 
        position={[5, roomHeight - 0.2, 5]} 
        intensity={0.4}
        distance={8}
        decay={2}
        castShadow
      />
      <pointLight 
        position={[-5, roomHeight - 0.2, 5]} 
        intensity={0.4}
        distance={8}
        decay={2}
        castShadow
      />
      <pointLight 
        position={[5, roomHeight - 0.2, -5]} 
        intensity={0.4}
        distance={8}
        decay={2}
        castShadow
      />
      
      {/* Artworks with images */}
      {artworkPositions.map((item, index) => (
        <Artwork 
          key={index}
          position={item.position as [number, number, number]}
          rotation={item.rotation as [number, number, number]}
          artwork={item.artwork}
          scale={item.scale as [number, number, number]}
        />
      ))}
      
      {/* Room label */}
      <Text
        position={[0, roomHeight - 0.5, -roomDepth / 2 + 0.1]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="bottom"
      >
        Modern Masters Gallery
      </Text>
    </group>
  );
};

export default Room;
