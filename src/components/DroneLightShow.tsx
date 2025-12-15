'use client';

import { useEffect, useState } from 'react';

interface DroneLight {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
}

export default function DroneLightShow() {
  const [droneLights, setDroneLights] = useState<DroneLight[]>([]);
  const [droneFormations, setDroneFormations] = useState<DroneLight[]>([]);

  useEffect(() => {
    // Generate random positions only on client side
    const generateDroneLights = () => {
      const lights: DroneLight[] = [];
      for (let i = 0; i < 100; i++) {
        lights.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 2 + Math.random() * 2,
        });
      }
      return lights;
    };

    const generateDroneFormations = () => {
      const formations: DroneLight[] = [];
      for (let i = 0; i < 20; i++) {
        formations.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 8 + Math.random() * 4,
        });
      }
      return formations;
    };

    setDroneLights(generateDroneLights());
    setDroneFormations(generateDroneFormations());
  }, []);

  return (
    <div className="absolute inset-0 bg-background">
      {/* Animated stars/drone lights */}
      <div className="absolute inset-0">
        {droneLights.map((light) => (
          <div
            key={light.id}
            className="absolute w-1 h-1 bg-foreground/40 rounded-full twinkle"
            style={{
              left: `${light.left}%`,
              top: `${light.top}%`,
              animationDelay: `${light.delay}s`,
              animationDuration: `${light.duration}s`,
            }}
          />
        ))}
      </div>
      
      {/* Moving drone formations */}
      <div className="absolute inset-0">
        {droneFormations.map((formation) => (
          <div
            key={`formation-${formation.id}`}
            className="absolute w-2 h-2 bg-foreground/60 rounded-full drone-light"
            style={{
              left: `${formation.left}%`,
              top: `${formation.top}%`,
              animationDelay: `${formation.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
