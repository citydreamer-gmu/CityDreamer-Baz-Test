import { useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GridCell, ZoneType, BuildingType, Direction, TrafficFlow } from "../types/city";

interface BuildingProps {
  cell: GridCell;
  position: [number, number, number];
}

export default function Building({ cell, position }: BuildingProps) {
  const grassTexture = useTexture("/textures/grass.png");
  const asphaltTexture = useTexture("/textures/asphalt.png");
  
  // Animation refs for trains
  const trainRef = useRef<THREE.Group>(null);
  const subwayTrainRef = useRef<THREE.Group>(null);
  const monorailTrainRef = useRef<THREE.Group>(null);
  
  // Configure textures
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;

  // Animate trains
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate train on train tracks
    if (trainRef.current && cell.buildingType === BuildingType.TRAIN_TRACK) {
      const speed = 2;
      const offset = (time * speed) % 4 - 2; // Move back and forth
      trainRef.current.position.z = offset;
    }
    
    // Animate subway train (underground indication)
    if (subwayTrainRef.current && cell.buildingType === BuildingType.SUBWAY_TRACK) {
      const speed = 1.5;
      const offset = (time * speed) % 3 - 1.5;
      subwayTrainRef.current.position.x = offset;
    }
    
    // Animate monorail
    if (monorailTrainRef.current && cell.buildingType === BuildingType.MONORAIL_TRACK) {
      const speed = 1.8;
      const offset = (time * speed) % 3.5 - 1.75;
      monorailTrainRef.current.position.z = offset;
    }
  });

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
    else if (cell.buildingType === BuildingType.PARK) {
      // Green space with trees
      components.push(
        <mesh key="grass" position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1, 1]} />
          <meshLambertMaterial color="#228B22" />
        </mesh>
      );
      // Trees
      components.push(
        <mesh key="tree1" position={[-0.2, 0.8, -0.2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      );
      components.push(
        <mesh key="leaves1" position={[-0.2, 1.3, -0.2]} castShadow>
          <sphereGeometry args={[0.25, 8, 6]} />
          <meshLambertMaterial color="#228B22" />
        </mesh>
      );
      components.push(
        <mesh key="tree2" position={[0.3, 0.6, 0.2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      );
      components.push(
        <mesh key="leaves2" position={[0.3, 1, 0.2]} castShadow>
          <sphereGeometry args={[0.2, 8, 6]} />
          <meshLambertMaterial color="#32CD32" />
        </mesh>
      );
      mainHeight = 0.1;
    }
    else if (cell.buildingType === BuildingType.LIBRARY) {
      // Library building
      components.push(
        <mesh key="main" position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.85, 1.6, 0.85]} />
          <meshLambertMaterial color="#DEB887" />
        </mesh>
      );
      // Book symbol on front
      components.push(
        <mesh key="book" position={[0, 1.2, 0.43]}>
          <boxGeometry args={[0.3, 0.4, 0.02]} />
          <meshBasicMaterial color="#8B4513" />
        </mesh>
      );
      mainHeight = 1.6;
    }
    else if (cell.buildingType === BuildingType.UNIVERSITY) {
      // Main university building
      components.push(
        <mesh key="main" position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 3, 0.9]} />
          <meshLambertMaterial color="#F5DEB3" />
        </mesh>
      );
      // Clock tower
      components.push(
        <mesh key="tower" position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshLambertMaterial color="#D2B48C" />
        </mesh>
      );
      // Clock face
      components.push(
        <mesh key="clock" position={[0, 3.5, 0.16]}>
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      );
      mainHeight = 3;
    }
    else if (cell.buildingType === BuildingType.WASTE_FACILITY) {
      // Waste processing building
      components.push(
        <mesh key="main" position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2, 0.7]} />
          <meshLambertMaterial color="#696969" />
        </mesh>
      );
      // Smokestack
      components.push(
        <mesh key="stack" position={[0.3, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
          <meshLambertMaterial color="#2F4F4F" />
        </mesh>
      );
      mainHeight = 2;
    }
    else if (cell.buildingType === BuildingType.BUS_STOP) {
      // Simple bus stop shelter
      components.push(
        <mesh key="shelter" position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.1, 0.4]} />
          <meshLambertMaterial color="#4169E1" />
        </mesh>
      );
      // Support posts
      components.push(
        <mesh key="post1" position={[-0.3, 0.5, -0.15]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <meshLambertMaterial color="#808080" />
        </mesh>
      );
      components.push(
        <mesh key="post2" position={[0.3, 0.5, -0.15]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <meshLambertMaterial color="#808080" />
        </mesh>
      );
      mainHeight = 1;
    }
    else if (cell.buildingType === BuildingType.SUBWAY_STATION) {
      // Underground entrance
      components.push(
        <mesh key="entrance" position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.6, 0.8]} />
          <meshLambertMaterial color="#2F4F4F" />
        </mesh>
      );
      // Subway sign
      components.push(
        <mesh key="sign" position={[0, 0.8, 0.41]}>
          <boxGeometry args={[0.4, 0.2, 0.02]} />
          <meshBasicMaterial color="#FF6B35" />
        </mesh>
      );
      // Stairs going down
      components.push(
        <mesh key="stairs" position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[0.6, 0.2, 0.6]} />
          <meshLambertMaterial color="#696969" />
        </mesh>
      );
      mainHeight = 0.6;
    }
    else if (cell.buildingType === BuildingType.CITY_HALL) {
      // Grand city hall building
      components.push(
        <mesh key="main" position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 3, 0.9]} />
          <meshLambertMaterial color="#F5F5DC" />
        </mesh>
      );
      // Dome
      components.push(
        <mesh key="dome" position={[0, 3.3, 0]} castShadow>
          <sphereGeometry args={[0.3, 16, 8]} />
          <meshLambertMaterial color="#DAA520" />
        </mesh>
      );
      // Flag
      components.push(
        <mesh key="flagpole" position={[0, 4, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      );
      mainHeight = 3;
    }
    else if (cell.buildingType === BuildingType.STADIUM) {
      // Large stadium structure
      components.push(
        <mesh key="main" position={[0, 1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.45, 3, 16]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
      );
      // Inner field
      components.push(
        <mesh key="field" position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.35, 16]} />
          <meshLambertMaterial color="#228B22" />
        </mesh>
      );
      // Lights
      components.push(
        <mesh key="light1" position={[0.3, 3.5, 0.3]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshBasicMaterial color="#FFFF00" />
        </mesh>
      );
      components.push(
        <mesh key="light2" position={[-0.3, 3.5, -0.3]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshBasicMaterial color="#FFFF00" />
        </mesh>
      );
      mainHeight = 3;
    }
    else if (cell.buildingType === BuildingType.POWER_LINE) {
      // Power line poles and cables
      components.push(
        <mesh key="pole" position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      );
      // Cross beam
      components.push(
        <mesh key="crossbeam" position={[0, 2.8, 0]} castShadow>
          <boxGeometry args={[0.8, 0.05, 0.05]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      );
      // Power cables (if connected)
      if (cell.powerLineConnections && cell.powerLineConnections.length > 0) {
        cell.powerLineConnections.forEach((direction, index) => {
          const angle = direction === 'north' ? 0 : direction === 'east' ? Math.PI/2 : 
                       direction === 'south' ? Math.PI : -Math.PI/2;
          components.push(
            <mesh key={`cable-${index}`} position={[Math.sin(angle) * 0.3, 2.7, Math.cos(angle) * 0.3]}>
              <cylinderGeometry args={[0.01, 0.01, 0.6, 8]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
          );
        });
      }
      mainHeight = 3;
    }
    else if (cell.buildingType === BuildingType.POWER_SUBSTATION) {
      // Substation building
      components.push(
        <mesh key="main" position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 1, 0.8]} />
          <meshLambertMaterial color="#696969" />
        </mesh>
      );
      // Electrical equipment
      components.push(
        <mesh key="transformer" position={[0.2, 1.2, 0.2]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.3]} />
          <meshLambertMaterial color="#4169E1" />
        </mesh>
      );
      // Warning signs
      components.push(
        <mesh key="warning" position={[0, 0.8, 0.41]}>
          <boxGeometry args={[0.2, 0.2, 0.01]} />
          <meshBasicMaterial color="#FFFF00" />
        </mesh>
      );
      mainHeight = 1;
    }
    else if (cell.buildingType === BuildingType.HIGHWAY) {
      // Highway with lane markings
      components.push(
        <mesh key="highway" position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshLambertMaterial map={asphaltTexture} />
        </mesh>
      );
      // Lane dividers
      components.push(
        <mesh key="divider" position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 1]} />
          <meshBasicMaterial color="#FFFF00" />
        </mesh>
      );
      mainHeight = 0.1;
    }
    else if (cell.buildingType === BuildingType.BRIDGE) {
      // Bridge structure
      components.push(
        <mesh key="bridge-deck" position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 0.2, 1]} />
          <meshLambertMaterial color="#8B7355" />
        </mesh>
      );
      // Support pillars
      components.push(
        <mesh key="pillar1" position={[-0.3, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
          <meshLambertMaterial color="#696969" />
        </mesh>
      );
      components.push(
        <mesh key="pillar2" position={[0.3, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
          <meshLambertMaterial color="#696969" />
        </mesh>
      );
      mainHeight = 0.4;
    }
    else if (cell.buildingType === BuildingType.TRAFFIC_LIGHT) {
      // Traffic light pole
      components.push(
        <mesh key="pole" position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
          <meshLambertMaterial color="#808080" />
        </mesh>
      );
      // Traffic light box
      components.push(
        <mesh key="lightbox" position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[0.2, 0.6, 0.15]} />
          <meshLambertMaterial color="#2F2F2F" />
        </mesh>
      );
      // Lights (red, yellow, green)
      components.push(
        <mesh key="red-light" position={[0, 3.7, 0.08]}>
          <circleGeometry args={[0.05, 8]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>
      );
      components.push(
        <mesh key="yellow-light" position={[0, 3.5, 0.08]}>
          <circleGeometry args={[0.05, 8]} />
          <meshBasicMaterial color="#FFFF00" />
        </mesh>
      );
      components.push(
        <mesh key="green-light" position={[0, 3.3, 0.08]}>
          <circleGeometry args={[0.05, 8]} />
          <meshBasicMaterial color="#00FF00" />
        </mesh>
      );
      mainHeight = 4;
    }
    else if (cell.buildingType === BuildingType.TRAIN_STATION) {
      // Large train station building
      components.push(
        <mesh key="main" position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 3, 0.9]} />
          <meshLambertMaterial color="#8B7355" />
        </mesh>
      );
      // Platform canopy
      components.push(
        <mesh key="canopy" position={[0, 2.8, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.6]} />
          <meshLambertMaterial color="#4169E1" />
        </mesh>
      );
      // Clock tower
      components.push(
        <mesh key="clock-tower" position={[0, 3.8, 0]} castShadow>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshLambertMaterial color="#D2B48C" />
        </mesh>
      );
      // Clock face
      components.push(
        <mesh key="clock" position={[0, 4, 0.16]}>
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      );
      mainHeight = 3;
    }
    else if (cell.buildingType === BuildingType.SUBWAY_TRACK) {
      // Underground subway track (surface indication)
      components.push(
        <mesh key="track-surface" position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 1]} />
          <meshLambertMaterial color="#2F4F4F" />
        </mesh>
      );
      // Ventilation grates
      components.push(
        <mesh key="grate1" position={[-0.2, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 0.1]} />
          <meshLambertMaterial color="#696969" />
        </mesh>
      );
      components.push(
        <mesh key="grate2" position={[0.2, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 0.1]} />
          <meshLambertMaterial color="#696969" />
        </mesh>
      );
      
      // Animated subway train (underground indication)
      if (cell.transitRidership && cell.transitRidership > 0) {
        components.push(
          <group key="subway-train" ref={subwayTrainRef}>
            <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.15, 0.4]} />
              <meshBasicMaterial color="#FF6B35" transparent opacity={0.8} />
            </mesh>
          </group>
        );
      }
      mainHeight = 0.05;
    }
    else if (cell.buildingType === BuildingType.TRAIN_TRACK) {
      // Above-ground train tracks
      components.push(
        <mesh key="rail1" position={[-0.15, 0.05, 0]} castShadow>
          <boxGeometry args={[0.02, 0.05, 1]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
      );
      components.push(
        <mesh key="rail2" position={[0.15, 0.05, 0]} castShadow>
          <boxGeometry args={[0.02, 0.05, 1]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
      );
      // Railroad ties
      for (let i = -4; i <= 4; i++) {
        components.push(
          <mesh key={`tie-${i}`} position={[0, 0.02, i * 0.2]} castShadow>
            <boxGeometry args={[0.4, 0.03, 0.05]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
        );
      }
      
      // Animated train
      if (cell.transitRidership && cell.transitRidership > 0) {
        components.push(
          <group key="train" ref={trainRef}>
            {/* Train engine */}
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[0.25, 0.3, 0.6]} />
              <meshLambertMaterial color="#1E40AF" />
            </mesh>
            {/* Train windows */}
            <mesh position={[0.13, 0.3, 0]} castShadow>
              <boxGeometry args={[0.02, 0.15, 0.4]} />
              <meshBasicMaterial color="#87CEEB" />
            </mesh>
            <mesh position={[-0.13, 0.3, 0]} castShadow>
              <boxGeometry args={[0.02, 0.15, 0.4]} />
              <meshBasicMaterial color="#87CEEB" />
            </mesh>
            {/* Train headlight */}
            <mesh position={[0, 0.25, 0.31]}>
              <sphereGeometry args={[0.03]} />
              <meshBasicMaterial color="#FFFF00" />
            </mesh>
          </group>
        );
      }
      mainHeight = 0.4;
    }
    else if (cell.buildingType === BuildingType.TRANSIT_HUB) {
      // Large multi-modal transit hub
      components.push(
        <mesh key="main" position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.95, 4, 0.95]} />
          <meshLambertMaterial color="#4682B4" />
        </mesh>
      );
      // Glass dome
      components.push(
        <mesh key="dome" position={[0, 4.3, 0]} castShadow>
          <sphereGeometry args={[0.4, 16, 8]} />
          <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
      );
      // Multiple platform indicators
      components.push(
        <mesh key="platform1" position={[-0.3, 0.5, 0]} castShadow>
          <boxGeometry args={[0.2, 1, 0.8]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
      );
      components.push(
        <mesh key="platform2" position={[0.3, 0.5, 0]} castShadow>
          <boxGeometry args={[0.2, 1, 0.8]} />
          <meshLambertMaterial color="#FF6347" />
        </mesh>
      );
      // Transit symbols
      components.push(
        <mesh key="train-symbol" position={[0, 3, 0.48]}>
          <boxGeometry args={[0.3, 0.2, 0.02]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      );
      mainHeight = 4;
    }
    else if (cell.buildingType === BuildingType.MONORAIL_STATION) {
      // Elevated monorail station
      components.push(
        <mesh key="support" position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
          <meshLambertMaterial color="#808080" />
        </mesh>
      );
      // Station platform
      components.push(
        <mesh key="platform" position={[0, 3.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.2, 1]} />
          <meshLambertMaterial color="#4169E1" />
        </mesh>
      );
      // Canopy
      components.push(
        <mesh key="canopy" position={[0, 3.6, 0]} castShadow>
          <boxGeometry args={[1, 0.05, 1.2]} />
          <meshLambertMaterial color="#FF6B35" />
        </mesh>
      );
      mainHeight = 3.2;
    }
    else if (cell.buildingType === BuildingType.CARGO_TERMINAL) {
      // Large cargo terminal
      components.push(
        <mesh key="main" position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2, 0.9]} />
          <meshLambertMaterial color="#8B7355" />
        </mesh>
      );
      // Loading docks
      components.push(
        <mesh key="dock1" position={[-0.3, 0.5, 0.46]} castShadow>
          <boxGeometry args={[0.2, 1, 0.02]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
      );
      components.push(
        <mesh key="dock2" position={[0.3, 0.5, 0.46]} castShadow>
          <boxGeometry args={[0.2, 1, 0.02]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
      );
      // Crane
      components.push(
        <mesh key="crane" position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[0.05, 1, 0.05]} />
          <meshLambertMaterial color="#FF6B35" />
        </mesh>
      );
      mainHeight = 2;
    }
    else if (cell.buildingType === BuildingType.WAREHOUSE) {
      // Large warehouse building
      components.push(
        <mesh key="main" position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2, 0.9]} />
          <meshLambertMaterial color="#A0A0A0" />
        </mesh>
      );
      // Loading bay
      components.push(
        <mesh key="bay" position={[0, 0.5, 0.46]} castShadow>
          <boxGeometry args={[0.6, 1, 0.02]} />
          <meshLambertMaterial color="#4169E1" />
        </mesh>
      );
      mainHeight = 2;
    }
    else if (cell.buildingType === BuildingType.FACTORY) {
      // Factory building with smokestacks
      components.push(
        <mesh key="main" position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2.4, 0.9]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      );
      // Smokestacks
      components.push(
        <mesh key="stack1" position={[-0.2, 3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
          <meshLambertMaterial color="#696969" />
        </mesh>
      );
      components.push(
        <mesh key="stack2" position={[0.2, 3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
          <meshLambertMaterial color="#696969" />
        </mesh>
      );
      mainHeight = 2.4;
    }
    else if (cell.buildingType === BuildingType.MINING_FACILITY) {
      // Mining facility with conveyor
      components.push(
        <mesh key="main" position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 1.6, 0.8]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
      );
      // Mining tower
      components.push(
        <mesh key="tower" position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[0.3, 2, 0.3]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      );
      // Conveyor belt
      components.push(
        <mesh key="conveyor" position={[0.4, 1, 0]} castShadow>
          <boxGeometry args={[0.1, 0.05, 0.8]} />
          <meshLambertMaterial color="#2F2F2F" />
        </mesh>
      );
      mainHeight = 1.6;
    }
    else if (cell.buildingType === BuildingType.OIL_REFINERY) {
      // Oil refinery with tanks
      components.push(
        <mesh key="main" position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 3, 0.7]} />
          <meshLambertMaterial color="#4A4A4A" />
        </mesh>
      );
      // Oil tanks
      components.push(
        <mesh key="tank1" position={[-0.3, 1, 0.3]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 2, 12]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
      );
      components.push(
        <mesh key="tank2" position={[0.3, 1, 0.3]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 2, 12]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
      );
      // Flare stack
      components.push(
        <mesh key="flare" position={[0, 4, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <meshLambertMaterial color="#FF4500" />
        </mesh>
      );
      mainHeight = 3;
    }
    else if (cell.buildingType === BuildingType.STEEL_MILL) {
      // Steel mill with blast furnace
      components.push(
        <mesh key="main" position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 3, 0.9]} />
          <meshLambertMaterial color="#8B0000" />
        </mesh>
      );
      // Blast furnace
      components.push(
        <mesh key="furnace" position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
          <meshLambertMaterial color="#FF4500" />
        </mesh>
      );
      // Cooling towers
      components.push(
        <mesh key="cooling1" position={[-0.3, 2, 0.3]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 1.5, 8]} />
          <meshLambertMaterial color="#D2B48C" />
        </mesh>
      );
      components.push(
        <mesh key="cooling2" position={[0.3, 2, 0.3]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 1.5, 8]} />
          <meshLambertMaterial color="#D2B48C" />
        </mesh>
      );
      mainHeight = 3;
    }
    else if (cell.buildingType === BuildingType.CHEMICAL_PLANT) {
      // Chemical plant with complex piping
      components.push(
        <mesh key="main" position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2.4, 0.8]} />
          <meshLambertMaterial color="#228B22" />
        </mesh>
      );
      // Chemical tanks
      components.push(
        <mesh key="tank1" position={[-0.25, 1.8, 0.35]} castShadow>
          <sphereGeometry args={[0.12, 8, 6]} />
          <meshLambertMaterial color="#FFFF00" />
        </mesh>
      );
      components.push(
        <mesh key="tank2" position={[0.25, 1.8, 0.35]} castShadow>
          <sphereGeometry args={[0.12, 8, 6]} />
          <meshLambertMaterial color="#00FF00" />
        </mesh>
      );
      // Pipes
      components.push(
        <mesh key="pipe1" position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
      );
      mainHeight = 2.4;
    }
    else if (cell.buildingType === BuildingType.ELECTRONICS_FACTORY) {
      // Clean electronics factory
      components.push(
        <mesh key="main" position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2, 0.9]} />
          <meshLambertMaterial color="#E6E6FA" />
        </mesh>
      );
      // Clean room indicators
      components.push(
        <mesh key="cleanroom" position={[0, 1.5, 0.46]} castShadow>
          <boxGeometry args={[0.6, 0.8, 0.02]} />
          <meshBasicMaterial color="#00FFFF" />
        </mesh>
      );
      // Ventilation
      components.push(
        <mesh key="vent1" position={[-0.3, 2.2, 0]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
      );
      components.push(
        <mesh key="vent2" position={[0.3, 2.2, 0]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
      );
      mainHeight = 2;
    }
    else if (cell.buildingType === BuildingType.FOOD_PROCESSING) {
      // Food processing plant
      components.push(
        <mesh key="main" position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2, 0.8]} />
          <meshLambertMaterial color="#DEB887" />
        </mesh>
      );
      // Silos
      components.push(
        <mesh key="silo1" position={[-0.3, 1.5, 0.35]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
          <meshLambertMaterial color="#F5DEB3" />
        </mesh>
      );
      components.push(
        <mesh key="silo2" position={[0.3, 1.5, 0.35]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
          <meshLambertMaterial color="#F5DEB3" />
        </mesh>
      );
      mainHeight = 2;
    }
    else if (cell.buildingType === BuildingType.SHIPPING_DOCK) {
      // Shipping dock with cranes
      components.push(
        <mesh key="dock" position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 1, 0.9]} />
          <meshLambertMaterial color="#8B7355" />
        </mesh>
      );
      // Container crane
      components.push(
        <mesh key="crane-base" position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
          <meshLambertMaterial color="#FF6B35" />
        </mesh>
      );
      components.push(
        <mesh key="crane-arm" position={[0.3, 2.5, 0]} castShadow>
          <boxGeometry args={[0.6, 0.05, 0.05]} />
          <meshLambertMaterial color="#FF6B35" />
        </mesh>
      );
      // Containers
      components.push(
        <mesh key="container1" position={[-0.2, 0.6, 0.2]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.3]} />
          <meshLambertMaterial color="#4169E1" />
        </mesh>
      );
      components.push(
        <mesh key="container2" position={[0.2, 0.6, 0.2]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.3]} />
          <meshLambertMaterial color="#DC143C" />
        </mesh>
      );
      mainHeight = 1;
    }
    else if (cell.buildingType === BuildingType.FREIGHT_RAIL_TERMINAL) {
      // Freight rail terminal
      components.push(
        <mesh key="main" position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2, 0.7]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
      );
      // Loading platform
      components.push(
        <mesh key="platform" position={[0, 0.6, 0.4]} castShadow>
          <boxGeometry args={[0.8, 0.2, 0.3]} />
          <meshLambertMaterial color="#D2B48C" />
        </mesh>
      );
      // Rail tracks
      components.push(
        <mesh key="rail1" position={[-0.15, 0.05, 0]} castShadow>
          <boxGeometry args={[0.02, 0.05, 1]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
      );
      components.push(
        <mesh key="rail2" position={[0.15, 0.05, 0]} castShadow>
          <boxGeometry args={[0.02, 0.05, 1]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
      );
      mainHeight = 2;
    }
    else if (cell.buildingType === BuildingType.HIGHWAY_CONNECTION) {
      // Highway connection to neighboring cities
      components.push(
        <mesh key="highway" position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshLambertMaterial color="#2F2F2F" />
        </mesh>
      );
      // Connection sign
      components.push(
        <mesh key="sign-pole" position={[0.3, 1, 0.3]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
          <meshLambertMaterial color="#808080" />
        </mesh>
      );
      components.push(
        <mesh key="sign" position={[0.3, 1.5, 0.3]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.02]} />
          <meshBasicMaterial color="#00FF00" />
        </mesh>
      );
      // Lane markings
      components.push(
        <mesh key="lanes" position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 1]} />
          <meshBasicMaterial color="#FFFF00" />
        </mesh>
      );
      mainHeight = 0.1;
    }
    else if (cell.buildingType === BuildingType.RAIL_CONNECTION) {
      // Rail connection to neighboring cities
      components.push(
        <mesh key="rail1" position={[-0.15, 0.05, 0]} castShadow>
          <boxGeometry args={[0.02, 0.05, 1]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
      );
      components.push(
        <mesh key="rail2" position={[0.15, 0.05, 0]} castShadow>
          <boxGeometry args={[0.02, 0.05, 1]} />
          <meshLambertMaterial color="#C0C0C0" />
        </mesh>
      );
      // Connection signal
      components.push(
        <mesh key="signal-pole" position={[0.4, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
          <meshLambertMaterial color="#808080" />
        </mesh>
      );
      components.push(
        <mesh key="signal" position={[0.4, 2.5, 0]} castShadow>
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshBasicMaterial color="#00FF00" />
        </mesh>
      );
      // Railroad ties
      for (let i = -4; i <= 4; i++) {
        components.push(
          <mesh key={`tie-${i}`} position={[0, 0.02, i * 0.2]} castShadow>
            <boxGeometry args={[0.4, 0.03, 0.05]} />
            <meshLambertMaterial color="#8B4513" />
          </mesh>
        );
      }
      mainHeight = 0.1;
    }
    else if (cell.buildingType === BuildingType.MONORAIL_TRACK) {
      // Elevated monorail track
      components.push(
        <mesh key="support" position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
          <meshLambertMaterial color="#808080" />
        </mesh>
      );
      // Track beam
      components.push(
        <mesh key="beam" position={[0, 3.1, 0]} castShadow>
          <boxGeometry args={[0.2, 0.2, 1]} />
          <meshLambertMaterial color="#4169E1" />
        </mesh>
      );
      
      // Animated monorail train
      if (cell.transitRidership && cell.transitRidership > 0) {
        components.push(
          <group key="monorail-train" ref={monorailTrainRef}>
            {/* Monorail car */}
            <mesh position={[0, 3.4, 0]} castShadow>
              <boxGeometry args={[0.3, 0.25, 0.8]} />
              <meshLambertMaterial color="#9333EA" />
            </mesh>
            {/* Monorail windows */}
            <mesh position={[0.16, 3.4, 0]} castShadow>
              <boxGeometry args={[0.02, 0.15, 0.6]} />
              <meshBasicMaterial color="#E0E7FF" />
            </mesh>
            <mesh position={[-0.16, 3.4, 0]} castShadow>
              <boxGeometry args={[0.02, 0.15, 0.6]} />
              <meshBasicMaterial color="#E0E7FF" />
            </mesh>
            {/* Connection to track */}
            <mesh position={[0, 3.25, 0]} castShadow>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshLambertMaterial color="#6B7280" />
            </mesh>
          </group>
        );
      }
      mainHeight = 3.6;
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

  // Infrastructure indicators and traffic visualization
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
    
    // Traffic flow visualization for roads
    if ((cell.buildingType === BuildingType.ROAD || 
         cell.buildingType === BuildingType.HIGHWAY ||
         cell.buildingType === BuildingType.BRIDGE) && 
        cell.trafficFlow && cell.trafficFlow.total > 0) {
      
      const trafficIntensity = Math.min(1, cell.trafficFlow.total / 50);
      const trafficColor = trafficIntensity > 0.7 ? "#FF0000" : 
                          trafficIntensity > 0.4 ? "#FFAA00" : "#00FF00";
      
      // Traffic flow arrows
      if (cell.trafficFlow.north > 5) {
        elements.push(
          <mesh key="traffic-north" position={[0, 0.15, -0.2]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.05, 0.1, 3]} />
            <meshBasicMaterial color={trafficColor} transparent opacity={0.8} />
          </mesh>
        );
      }
      
      if (cell.trafficFlow.south > 5) {
        elements.push(
          <mesh key="traffic-south" position={[0, 0.15, 0.2]} rotation={[0, Math.PI, 0]}>
            <coneGeometry args={[0.05, 0.1, 3]} />
            <meshBasicMaterial color={trafficColor} transparent opacity={0.8} />
          </mesh>
        );
      }
      
      if (cell.trafficFlow.east > 5) {
        elements.push(
          <mesh key="traffic-east" position={[0.2, 0.15, 0]} rotation={[0, Math.PI/2, 0]}>
            <coneGeometry args={[0.05, 0.1, 3]} />
            <meshBasicMaterial color={trafficColor} transparent opacity={0.8} />
          </mesh>
        );
      }
      
      if (cell.trafficFlow.west > 5) {
        elements.push(
          <mesh key="traffic-west" position={[-0.2, 0.15, 0]} rotation={[0, -Math.PI/2, 0]}>
            <coneGeometry args={[0.05, 0.1, 3]} />
            <meshBasicMaterial color={trafficColor} transparent opacity={0.8} />
          </mesh>
        );
      }
      
      // Traffic congestion indicator
      if (cell.trafficLevel > 50) {
        elements.push(
          <mesh key="congestion" position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color="#FF0000" transparent opacity={0.6} />
          </mesh>
        );
      }
    }
    
    // Power line connections
    if (cell.buildingType === BuildingType.POWER_LINE && cell.powerLineConnections) {
      cell.powerLineConnections.forEach((direction, index) => {
        const angle = direction === 'north' ? 0 : direction === 'east' ? Math.PI/2 : 
                     direction === 'south' ? Math.PI : -Math.PI/2;
        elements.push(
          <mesh key={`power-connection-${index}`} 
                position={[Math.sin(angle) * 0.4, 0.1, Math.cos(angle) * 0.4]}>
            <sphereGeometry args={[0.03]} />
            <meshBasicMaterial color="#FFFF00" />
          </mesh>
        );
      });
    }
    
    // Transit access indicator
    if (cell.transitAccess && cell.transitAccess > 20) {
      const transitColor = cell.transitAccess > 70 ? "#00FF00" : 
                          cell.transitAccess > 40 ? "#FFAA00" : "#FF6600";
      elements.push(
        <mesh key="transit-access" position={[0, buildingComponents.mainHeight + 0.2, 0]}>
          <sphereGeometry args={[0.06]} />
          <meshBasicMaterial color={transitColor} transparent opacity={0.8} />
        </mesh>
      );
    }
    
    // Transit ridership visualization
    if (cell.transitRidership && cell.transitRidership > 0) {
      const ridershipIntensity = Math.min(1, cell.transitRidership / 20);
      elements.push(
        <mesh key="ridership" position={[0.4, 0.1, 0]}>
          <sphereGeometry args={[0.04]} />
          <meshBasicMaterial color="#4169E1" transparent opacity={ridershipIntensity} />
        </mesh>
      );
    }
    
    // Station activity indicators
    if ((cell.buildingType === BuildingType.TRAIN_STATION || 
         cell.buildingType === BuildingType.SUBWAY_STATION ||
         cell.buildingType === BuildingType.MONORAIL_STATION ||
         cell.buildingType === BuildingType.TRANSIT_HUB) && 
        cell.transitRidership && cell.transitRidership > 5) {
      
      // Animated waiting passengers
      elements.push(
        <mesh key="passengers" position={[0.3, buildingComponents.mainHeight + 0.1, 0.3]}>
          <boxGeometry args={[0.05, 0.1, 0.05]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
      );
      elements.push(
        <mesh key="passengers2" position={[-0.2, buildingComponents.mainHeight + 0.1, 0.2]}>
          <boxGeometry args={[0.05, 0.1, 0.05]} />
          <meshBasicMaterial color="#FF6B35" />
        </mesh>
      );
      
      // Station status light
      const statusColor = cell.transitRidership > 15 ? "#00FF00" : "#FFAA00";
      elements.push(
        <mesh key="status-light" position={[0, buildingComponents.mainHeight + 0.3, 0]}>
          <sphereGeometry args={[0.03]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>
      );
    }
    
    // Industrial cargo traffic visualization
    if (cell.industrialTraffic && cell.industrialTraffic > 5) {
      // Cargo truck indicators on roads
      if (cell.buildingType === BuildingType.ROAD || 
          cell.buildingType === BuildingType.HIGHWAY ||
          cell.buildingType === BuildingType.BRIDGE) {
        
        const cargoIntensity = Math.min(1, cell.industrialTraffic / 50);
        elements.push(
          <mesh key="cargo-truck" position={[0, 0.2, 0]}>
            <boxGeometry args={[0.15, 0.08, 0.25]} />
            <meshBasicMaterial color="#8B4513" transparent opacity={cargoIntensity} />
          </mesh>
        );
        
        // Cargo trailer
        elements.push(
          <mesh key="cargo-trailer" position={[0, 0.2, -0.2]}>
            <boxGeometry args={[0.12, 0.1, 0.3]} />
            <meshBasicMaterial color="#C0C0C0" transparent opacity={cargoIntensity} />
          </mesh>
        );
      }
      
      // Freight train indicators on rail
      if (cell.buildingType === BuildingType.TRAIN_TRACK ||
          cell.buildingType === BuildingType.FREIGHT_RAIL_TERMINAL) {
        
        const freightIntensity = Math.min(1, cell.industrialTraffic / 30);
        elements.push(
          <mesh key="freight-car" position={[0, 0.3, 0]}>
            <boxGeometry args={[0.2, 0.15, 0.4]} />
            <meshBasicMaterial color="#654321" transparent opacity={freightIntensity} />
          </mesh>
        );
      }
    }
    
    // Supply chain connection indicators
    if (cell.supplyChainConnections && cell.supplyChainConnections.length > 0) {
      cell.supplyChainConnections.forEach((chain, index) => {
        const connectionColor = chain.efficiency > 70 ? "#00FF00" : 
                               chain.efficiency > 40 ? "#FFAA00" : "#FF0000";
        
        elements.push(
          <mesh key={`supply-chain-${index}`} 
                position={[0.4 + index * 0.1, buildingComponents.mainHeight + 0.2, 0.4]}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial color={connectionColor} transparent opacity={0.8} />
          </mesh>
        );
      });
    }
    
    // Industrial production indicators
    if (cell.industryType && cell.industryType !== 'none' && cell.productionLevel > 0) {
      const productionColor = cell.productionLevel > 70 ? "#00FF00" : 
                             cell.productionLevel > 40 ? "#FFAA00" : "#FF6600";
      
      elements.push(
        <mesh key="production-status" position={[0, buildingComponents.mainHeight + 0.4, 0]}>
          <sphereGeometry args={[0.04]} />
          <meshBasicMaterial color={productionColor} transparent opacity={0.9} />
        </mesh>
      );
      
      // Smoke/steam for active production
      if (cell.productionLevel > 50) {
        elements.push(
          <mesh key="production-smoke" position={[0, buildingComponents.mainHeight + 0.6, 0]}>
            <sphereGeometry args={[0.06]} />
            <meshBasicMaterial color="#E0E0E0" transparent opacity={0.4} />
          </mesh>
        );
      }
    }

    // Crime visualization overlay
    if (cell.crimeScore !== undefined && cell.crimeScore > 0) {
      // Crime heat map overlay on ground
      const crimeColor = cell.crimeScore < 20 ? "#00FF00" : 
                        cell.crimeScore < 40 ? "#FFFF00" : 
                        cell.crimeScore < 60 ? "#FFA500" : 
                        cell.crimeScore < 80 ? "#FF4500" : "#FF0000";
      
      const crimeOpacity = Math.min(0.6, cell.crimeScore / 100 * 0.8);
      
      // Ground crime overlay
      elements.push(
        <mesh key="crime-overlay" position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshBasicMaterial color={crimeColor} transparent opacity={crimeOpacity} />
        </mesh>
      );
      
      // Crime level indicator
      if (cell.crimeScore > 30) {
        elements.push(
          <mesh key="crime-indicator" position={[-0.4, buildingComponents.mainHeight + 0.1, -0.4]}>
            <sphereGeometry args={[0.04]} />
            <meshBasicMaterial color={crimeColor} transparent opacity={0.9} />
          </mesh>
        );
      }
      
      // High crime warning
      if (cell.crimeScore > 70) {
        elements.push(
          <mesh key="crime-warning" position={[0, buildingComponents.mainHeight + 0.5, 0]}>
            <octahedronGeometry args={[0.06]} />
            <meshBasicMaterial color="#FF0000" transparent opacity={0.8} />
          </mesh>
        );
      }
      
      // Crime type indicator
      if (cell.crimeType && cell.crimeType !== 'none' && cell.crimeScore > 40) {
        const crimeTypeColor = {
          'petty_theft': '#FFD700',
          'burglary': '#8B4513',
          'vandalism': '#FF6347',
          'drug_related': '#9932CC',
          'violent_crime': '#DC143C',
          'organized_crime': '#2F4F4F',
          'white_collar': '#4682B4'
        }[cell.crimeType] || '#FF0000';
        
        elements.push(
          <mesh key="crime-type" position={[0.4, buildingComponents.mainHeight + 0.15, -0.4]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshBasicMaterial color={crimeTypeColor} transparent opacity={0.8} />
          </mesh>
        );
      }
    }
    
    // Police coverage visualization
    if (cell.policeCoverage !== undefined && cell.policeCoverage > 0) {
      const coverageColor = cell.policeCoverage > 70 ? "#0000FF" : 
                           cell.policeCoverage > 40 ? "#4169E1" : "#87CEEB";
      
      const coverageOpacity = Math.min(0.4, cell.policeCoverage / 100 * 0.5);
      
      // Police coverage ring
      elements.push(
        <mesh key="police-coverage" position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.45, 16]} />
          <meshBasicMaterial color={coverageColor} transparent opacity={coverageOpacity} />
        </mesh>
      );
      
      // Police patrol indicator for high coverage areas
      if (cell.policeCoverage > 60) {
        elements.push(
          <mesh key="police-patrol" position={[0.4, buildingComponents.mainHeight + 0.1, 0.4]}>
            <sphereGeometry args={[0.03]} />
            <meshBasicMaterial color="#0000FF" transparent opacity={0.8} />
          </mesh>
        );
      }
    }

    // Financial indicators
    if (cell.monthlyTaxRevenue !== undefined && cell.monthlyTaxRevenue > 0) {
      // Tax revenue indicator (green for positive revenue)
      const revenueIntensity = Math.min(1, cell.monthlyTaxRevenue / 100);
      elements.push(
        <mesh key="tax-revenue" position={[-0.4, buildingComponents.mainHeight + 0.2, 0.4]}>
          <sphereGeometry args={[0.03]} />
          <meshBasicMaterial color="#00FF00" transparent opacity={revenueIntensity * 0.8} />
        </mesh>
      );
    }

    // Operating cost indicator (red for expenses)
    if (cell.monthlyOperatingCost !== undefined && cell.monthlyOperatingCost > 0) {
      const costIntensity = Math.min(1, cell.monthlyOperatingCost / 50);
      elements.push(
        <mesh key="operating-cost" position={[0.4, buildingComponents.mainHeight + 0.2, 0.4]}>
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color="#FF4500" transparent opacity={costIntensity * 0.8} />
        </mesh>
      );
    }

    // Business revenue indicator for commercial/industrial
    if (cell.businessRevenue !== undefined && cell.businessRevenue > 0) {
      const businessIntensity = Math.min(1, cell.businessRevenue / 200);
      elements.push(
        <mesh key="business-revenue" position={[0, buildingComponents.mainHeight + 0.3, 0.4]}>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={businessIntensity * 0.9} />
        </mesh>
      );
    }

    // High-value property indicator
    if (cell.landValue > 100) {
      elements.push(
        <mesh key="high-value" position={[0, buildingComponents.mainHeight + 0.4, 0]}>
          <octahedronGeometry args={[0.05]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
        </mesh>
      );
    }
    
    return elements;
  }, [cell.hasRoad, cell.hasPower, cell.hasWater, cell.buildingType, cell.trafficFlow, 
      cell.trafficLevel, cell.powerLineConnections, cell.crimeScore, cell.crimeType, 
      cell.policeCoverage, cell.monthlyTaxRevenue, cell.monthlyOperatingCost, 
      cell.businessRevenue, cell.landValue, buildingComponents.mainHeight]);

  return (
    <group position={position}>
      {buildingComponents.components}
      {indicators}
    </group>
  );
}
