import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { GridCell, ZoneType, BuildingType } from "../types/city";

interface BuildingProps {
  cell: GridCell;
  position: [number, number, number];
}

export default function Building({ cell, position }: BuildingProps) {
  const grassTexture = useTexture("/textures/grass.png");
  const asphaltTexture = useTexture("/textures/asphalt.png");
  
  // Configure textures
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;

  // Create building components
  const buildingComponents = useMemo(() => {
    const components: JSX.Element[] = [];
    let mainHeight = 0;

    // Building types with realistic shapes
    if (cell.buildingType === BuildingType.ROAD) {
      components.push(
        <mesh key="road" position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshLambertMaterial map={asphaltTexture} />
        </mesh>
      );
      mainHeight = 0.05;
    } 
    else if (cell.buildingType === BuildingType.POWER_PLANT) {
      // Main building with cooling towers
      components.push(
        <mesh key="main-building" position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2, 0.7]} />
          <meshLambertMaterial color="#8B7355" />
        </mesh>
      );
      // Cooling towers (cylindrical)
      components.push(
        <mesh key="tower1" position={[-0.25, 2.5, 0.15]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.18, 3, 8]} />
          <meshLambertMaterial color="#D2B48C" />
        </mesh>
      );
      components.push(
        <mesh key="tower2" position={[0.25, 2.5, 0.15]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.18, 3, 8]} />
          <meshLambertMaterial color="#D2B48C" />
        </mesh>
      );
      // Smoke effects
      components.push(
        <mesh key="smoke1" position={[-0.25, 4.2, 0.15]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#E0E0E0" transparent opacity={0.6} />
        </mesh>
      );
      components.push(
        <mesh key="smoke2" position={[0.25, 4.2, 0.15]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#E0E0E0" transparent opacity={0.6} />
        </mesh>
      );
      mainHeight = 2;
    } 
    else if (cell.buildingType === BuildingType.WATER_FACILITY) {
      // Main building
      components.push(
        <mesh key="main" position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 1.6, 0.8]} />
          <meshLambertMaterial color="#4682B4" />
        </mesh>
      );
      // Water tank (cylindrical)
      components.push(
        <mesh key="tank" position={[0, 2.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.35, 1.2, 16]} />
          <meshLambertMaterial color="#87CEEB" />
        </mesh>
      );
      mainHeight = 1.6;
    } 
    else if (cell.buildingType === BuildingType.SCHOOL) {
      // Main school building with peaked roof
      components.push(
        <mesh key="main" position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 1.6, 0.7]} />
          <meshLambertMaterial color="#DEB887" />
        </mesh>
      );
      // Roof
      components.push(
        <mesh key="roof" position={[0, 1.8, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.6, 0.4, 4]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      );
      // Flag pole
      components.push(
        <mesh key="pole" position={[0.35, 2.5, 0.35]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      );
      // Flag
      components.push(
        <mesh key="flag" position={[0.45, 3, 0.35]}>
          <planeGeometry args={[0.2, 0.15]} />
          <meshBasicMaterial color="#FF6B6B" />
        </mesh>
      );
      mainHeight = 1.6;
    } 
    else if (cell.buildingType === BuildingType.HOSPITAL) {
      // Main building
      components.push(
        <mesh key="main" position={[0, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2.5, 0.8]} />
          <meshLambertMaterial color="#F0F8FF" />
        </mesh>
      );
      // Red cross on front
      components.push(
        <mesh key="cross-v" position={[0, 1.8, 0.41]}>
          <boxGeometry args={[0.05, 0.4, 0.02]} />
          <meshBasicMaterial color="#DC143C" />
        </mesh>
      );
      components.push(
        <mesh key="cross-h" position={[0, 1.8, 0.41]}>
          <boxGeometry args={[0.25, 0.05, 0.02]} />
          <meshBasicMaterial color="#DC143C" />
        </mesh>
      );
      // Emergency light
      components.push(
        <mesh key="light" position={[0, 2.7, 0]}>
          <boxGeometry args={[0.15, 0.1, 0.15]} />
          <meshBasicMaterial color="#FF4500" />
        </mesh>
      );
      mainHeight = 2.5;
    } 
    else if (cell.buildingType === BuildingType.POLICE_STATION) {
      // Main building
      components.push(
        <mesh key="main" position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.85, 2, 0.85]} />
          <meshLambertMaterial color="#4169E1" />
        </mesh>
      );
      // Police dome light
      components.push(
        <mesh key="dome" position={[0, 2.2, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshBasicMaterial color="#0000FF" />
        </mesh>
      );
      // Antenna
      components.push(
        <mesh key="antenna" position={[0.3, 2.5, 0.3]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.8, 8]} />
          <meshLambertMaterial color="#808080" />
        </mesh>
      );
      mainHeight = 2;
    } 
    else if (cell.buildingType === BuildingType.FIRE_STATION) {
      // Main building (wider for fire trucks)
      components.push(
        <mesh key="main" position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2, 0.9]} />
          <meshLambertMaterial color="#B22222" />
        </mesh>
      );
      // Garage door
      components.push(
        <mesh key="door" position={[0, 0.7, 0.46]}>
          <boxGeometry args={[0.6, 1.4, 0.02]} />
          <meshLambertMaterial color="#FFFF00" />
        </mesh>
      );
      // Fire alarm bell
      components.push(
        <mesh key="bell" position={[0, 2.3, 0]} castShadow>
          <sphereGeometry args={[0.08, 8, 6]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
      );
      mainHeight = 2;
    }
    // Zone types
    else if (cell.zoneType === ZoneType.RESIDENTIAL) {
      const buildingHeight = 0.5 + (cell.developmentLevel * 0.5);
      components.push(
        <mesh key="residential" position={[0, buildingHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, buildingHeight, 0.8]} />
          <meshLambertMaterial color="#90EE90" />
        </mesh>
      );
      // Add chimney for developed residential
      if (cell.developmentLevel > 1) {
        components.push(
          <mesh key="chimney" position={[0.25, buildingHeight + 0.15, 0.25]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
        );
      }
      mainHeight = buildingHeight;
    } 
    else if (cell.zoneType === ZoneType.COMMERCIAL) {
      const buildingHeight = 0.8 + (cell.developmentLevel * 0.7);
      components.push(
        <mesh key="commercial" position={[0, buildingHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, buildingHeight, 0.9]} />
          <meshLambertMaterial color="#87CEEB" />
        </mesh>
      );
      // Add signage for developed commercial
      if (cell.developmentLevel > 1) {
        components.push(
          <mesh key="sign" position={[0, buildingHeight + 0.1, 0.46]}>
            <boxGeometry args={[0.6, 0.2, 0.02]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        );
      }
      mainHeight = buildingHeight;
    } 
    else if (cell.zoneType === ZoneType.INDUSTRIAL) {
      const buildingHeight = 1.0 + (cell.developmentLevel * 0.5);
      components.push(
        <mesh key="industrial" position={[0, buildingHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, buildingHeight, 0.9]} />
          <meshLambertMaterial color="#DDA0DD" />
        </mesh>
      );
      // Add smokestacks for developed industrial
      if (cell.developmentLevel > 1) {
        components.push(
          <mesh key="stack1" position={[-0.2, buildingHeight + 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
            <meshLambertMaterial color="#696969" />
          </mesh>
        );
        components.push(
          <mesh key="stack2" position={[0.2, buildingHeight + 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
            <meshLambertMaterial color="#696969" />
          </mesh>
        );
      }
      mainHeight = buildingHeight;
    } 
    else {
      // Empty cell - show grass ground
      components.push(
        <mesh key="grass" position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1, 1]} />
          <meshLambertMaterial map={grassTexture} />
        </mesh>
      );
      mainHeight = 0;
    }

    return { components, mainHeight };
  }, [cell, grassTexture, asphaltTexture]);

  // Infrastructure indicators
  const indicators = useMemo(() => {
    const elements = [];
    
    if (cell.hasRoad && !cell.buildingType) {
      elements.push(
        <mesh key="road-indicator" position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.4, 8]} />
          <meshBasicMaterial color="#444444" />
        </mesh>
      );
    }
    
    if (cell.hasPower) {
      elements.push(
        <mesh key="power-indicator" position={[-0.3, buildingComponents.mainHeight + 0.1, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      );
    }
    
    if (cell.hasWater) {
      elements.push(
        <mesh key="water-indicator" position={[0.3, buildingComponents.mainHeight + 0.1, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#00bfff" />
        </mesh>
      );
    }
    
    return elements;
  }, [cell.hasRoad, cell.hasPower, cell.hasWater, cell.buildingType, buildingComponents.mainHeight]);

  return (
    <group position={position}>
      {buildingComponents.components}
      {indicators}
    </group>
  );
}
