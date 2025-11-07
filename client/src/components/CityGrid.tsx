import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import Building from "./Building";
import { useCityStore } from "../lib/stores/useCityStore";
import { ZoneType, BuildingType } from "../types/city";

export default function CityGrid() {
  const { camera, raycaster, pointer, scene } = useThree();
  const { grid, selectedTool, placeZone, placeBuilding } = useCityStore();

  // Create grid lines
  const gridLines = useMemo() => {
    const gridSize = 20;
    const lines = [];
    
    for (let i = 0; i <= gridSize; i++) {
      // Vertical lines
      lines.push(
        <line key={`v-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([i, 0, 0, i, 0, gridSize])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#666666" opacity={0.3} transparent />
        </line>
      );
      
      // Horizontal lines
      lines.push(
        <line key={`h-${j}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, i, gridSize, 0, i])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#666666" opacity={0.3} transparent />
        </line>
      );
    }
    
    return lines;
  }, []);

  // Handle grid clicks
  const handleClick = (event: THREE.Event) => {
    if (!selectedTool) return;

    event.stopPropagation();
    
    // Cast ray from camera through mouse position
    raycaster.setFromCamera(pointer, camera);
    
    // Create an invisible plane at y=0 for intersection
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    
    if (intersectionPoint) {
      const x = Math.floor(intersectionPoint.x);
      const z = Math.floor(intersectionPoint.z);
      
      console.log(`Clicked grid at: ${x}, ${z} with tool: ${selectedTool}`);
      
      if (x >= 0 && x < 20 && z >= 0 && z < 20) {
        // Check if it's a zone or building tool
        if (Object.values(ZoneType).includes(selectedTool as ZoneType)) {
          const success = placeZone(x, z, selectedTool as ZoneType);
          console.log(`Zone placement ${success ? 'successful' : 'failed'}`);
        } else if (Object.values(BuildingType).includes(selectedTool as BuildingType)) {
          const success = placeBuilding(x, z, selectedTool as BuildingType);
          console.log(`Building placement ${success ? 'successful' : 'failed'}`);
        }
      }
    }
  };

  return (
    <group>
      {/* Grid lines */}
      {gridLines}
      
      {/* Invisible plane for mouse interaction */}
      <mesh onClick={handleClick} position={[10, 0, 10]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Render buildings and zones */}
      {grid.map((row, x) =>
        row.map((cell, z) => (
          <Building
            key={`${x}-${z}`}
            cell={cell}
            position={[x + 0.5, 0, z + 0.5]}
          />
        ))
      )}
    </group>
  );
}
