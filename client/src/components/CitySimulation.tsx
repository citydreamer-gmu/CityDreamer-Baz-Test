import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import CityGrid from "./CityGrid";
import { useCityStore } from "../lib/stores/useCityStore";
import { CitySimulation as CitySimulationEngine } from "../lib/citySimulation";

enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  up = 'up',
  down = 'down'
}

export default function CitySimulation() {
  const { camera } = useThree();
  const [subscribe, getKeys] = useKeyboardControls<Controls>();
  const { 
    initializeGrid, 
    grid, 
    resources, 
    isSimulationRunning, 
    simulationSpeed,
    updateResources
  } = useCityStore();
  
  const simulationTimer = useRef(0);
  const cameraTarget = useRef(new THREE.Vector3(10, 0, 10));
  const cameraPosition = useRef(new THREE.Vector3(20, 15, 20));

  // Initialize the city grid on mount
  useEffect(() => {
    initializeGrid();
    console.log("City simulation initialized");
  }, [initializeGrid]);

  // Camera controls
  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward, up, down } = getKeys();
    const moveSpeed = 15 * delta;
    const rotateSpeed = 2 * delta;

    // Get camera direction
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(direction, camera.up).normalize();

    // Move camera
    if (forward) {
      cameraPosition.current.add(direction.clone().multiplyScalar(moveSpeed));
      cameraTarget.current.add(direction.clone().multiplyScalar(moveSpeed));
    }
    if (backward) {
      cameraPosition.current.sub(direction.clone().multiplyScalar(moveSpeed));
      cameraTarget.current.sub(direction.clone().multiplyScalar(moveSpeed));
    }
    if (rightward) {
      cameraPosition.current.add(right.clone().multiplyScalar(moveSpeed));
      cameraTarget.current.add(right.clone().multiplyScalar(moveSpeed));
    }
    if (leftward) {
      cameraPosition.current.sub(right.clone().multiplyScalar(moveSpeed));
      cameraTarget.current.sub(right.clone().multiplyScalar(moveSpeed));
    }
    if (up) {
      cameraPosition.current.y += moveSpeed;
    }
    if (down) {
      cameraPosition.current.y = Math.max(5, cameraPosition.current.y - moveSpeed);
    }

    // Update camera position
    camera.position.copy(cameraPosition.current);
    camera.lookAt(cameraTarget.current);

    // Run city simulation
    if (isSimulationRunning) {
      simulationTimer.current += delta * simulationSpeed;
      
      if (simulationTimer.current >= 2.0) { // Update every 2 seconds
        simulationTimer.current = 0;
        
        if (grid.length > 0) {
          const { grid: newGrid, resources: newResources } = CitySimulationEngine.updateCity(grid, resources);
          useCityStore.setState({ grid: newGrid });
          updateResources(newResources);
        }
      }
    }
  });

  return (
    <>
      {/* Ground plane */}
      <mesh receiveShadow position={[10, -0.1, 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshLambertMaterial color="#4a5568" />
      </mesh>

      {/* City Grid */}
      <CityGrid />
    </>
  );
}
