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

  const { geometry, material, height } = useMemo(() => {
    let geom: THREE.BufferGeometry;
    let mat: THREE.Material;
    let h = 0;

    // Building types
    if (cell.buildingType === BuildingType.ROAD) {
      geom = new THREE.BoxGeometry(1, 0.1, 1);
      mat = new THREE.MeshLambertMaterial({ map: asphaltTexture });
      h = 0.05;
    } else if (cell.buildingType === BuildingType.POWER_PLANT) {
      geom = new THREE.BoxGeometry(1, 3, 1);
      mat = new THREE.MeshLambertMaterial({ color: '#ffd700' });
      h = 1.5;
    } else if (cell.buildingType === BuildingType.WATER_FACILITY) {
      geom = new THREE.BoxGeometry(1, 2, 1);
      mat = new THREE.MeshLambertMaterial({ color: '#4169e1' });
      h = 1;
    } else if (cell.buildingType === BuildingType.SCHOOL) {
      geom = new THREE.BoxGeometry(1, 2, 1);
      mat = new THREE.MeshLambertMaterial({ color: '#32cd32' });
      h = 1;
    } else if (cell.buildingType === BuildingType.HOSPITAL) {
      geom = new THREE.BoxGeometry(1, 2.5, 1);
      mat = new THREE.MeshLambertMaterial({ color: '#dc143c' });
      h = 1.25;
    } else if (cell.buildingType === BuildingType.POLICE_STATION) {
      geom = new THREE.BoxGeometry(1, 2, 1);
      mat = new THREE.MeshLambertMaterial({ color: '#000080' });
      h = 1;
    } else if (cell.buildingType === BuildingType.FIRE_STATION) {
      geom = new THREE.BoxGeometry(1, 2, 1);
      mat = new THREE.MeshLambertMaterial({ color: '#b22222' });
      h = 1;
    }
    // Zone types
    else if (cell.zoneType === ZoneType.RESIDENTIAL) {
      const buildingHeight = 0.5 + (cell.developmentLevel * 0.5);
      geom = new THREE.BoxGeometry(0.8, buildingHeight, 0.8);
      mat = new THREE.MeshLambertMaterial({ color: '#90EE90' });
      h = buildingHeight / 2;
    } else if (cell.zoneType === ZoneType.COMMERCIAL) {
      const buildingHeight = 0.8 + (cell.developmentLevel * 0.7);
      geom = new THREE.BoxGeometry(0.9, buildingHeight, 0.9);
      mat = new THREE.MeshLambertMaterial({ color: '#87CEEB' });
      h = buildingHeight / 2;
    } else if (cell.zoneType === ZoneType.INDUSTRIAL) {
      const buildingHeight = 1.0 + (cell.developmentLevel * 0.5);
      geom = new THREE.BoxGeometry(0.9, buildingHeight, 0.9);
      mat = new THREE.MeshLambertMaterial({ color: '#DDA0DD' });
      h = buildingHeight / 2;
    } else {
      // Empty cell - show grass ground
      geom = new THREE.PlaneGeometry(1, 1);
      mat = new THREE.MeshLambertMaterial({ map: grassTexture });
      h = 0;
    }

    return { geometry: geom, material: mat, height: h };
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
        <mesh key="power-indicator" position={[-0.3, height + 0.1, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      );
    }
    
    if (cell.hasWater) {
      elements.push(
        <mesh key="water-indicator" position={[0.3, height + 0.1, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#00bfff" />
        </mesh>
      );
    }
    
    return elements;
  }, [cell.hasRoad, cell.hasPower, cell.hasWater, cell.buildingType, height]);

  return (
    <group position={position}>
      <mesh 
        geometry={geometry} 
        material={material}
        castShadow
        receiveShadow
        position={[0, height, 0]}
        rotation={cell.zoneType === ZoneType.EMPTY ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}
      />
      {indicators}
    </group>
  );
}
