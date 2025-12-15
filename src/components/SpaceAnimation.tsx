'use client';

import { useEffect, useState } from 'react';
import { useTheme } from './theme-provider';

interface Star {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
  duration: number;
  delay: number;
}

export default function SpaceAnimation() {
  const { resolvedTheme } = useTheme();
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const starCount = 400; // Increased number of stars
      const newStars: Star[] = [];
      const centerX = 50; // Center of viewport in percentage
      const centerY = 50;

      for (let i = 0; i < starCount; i++) {
        // Generate stars from center outward in straight 3D lines
        const angle = Math.random() * Math.PI * 2;
        const elevation = (Math.random() - 0.5) * Math.PI * 0.3; // 3D elevation angle
        
        // Start from center (or very close to it)
        const startDistance = Math.random() * 5; // Start 0-5% from center
        const startX = centerX + Math.cos(angle) * Math.cos(elevation) * startDistance;
        const startY = centerY + Math.sin(angle) * Math.cos(elevation) * startDistance;
        
        // End position - far out in straight line
        const endDistance = 150 + Math.random() * 100; // Move far out (150-250%)
        const endX = centerX + Math.cos(angle) * Math.cos(elevation) * endDistance;
        const endY = centerY + Math.sin(angle) * Math.cos(elevation) * endDistance;

        // Vary sizes
        const sizeVariation = Math.random();
        const size = sizeVariation > 0.7 
          ? 3 + Math.random() * 4  // 3-7px for larger stars (30% chance)
          : 2 + Math.random() * 2; // 2-4px for regular stars (70% chance)

        newStars.push({
          id: i,
          startX: Math.max(-30, Math.min(130, startX)),
          startY: Math.max(-30, Math.min(130, startY)),
          endX: Math.max(-100, Math.min(200, endX)),
          endY: Math.max(-100, Math.min(200, endY)),
          size: size,
          duration: 1 + Math.random() * 2, // 1-3 seconds (faster for speed effect)
          delay: Math.random() * 0.5,
        });
      }

      return newStars;
    };

    setStars(generateStars());
  }, []);

  const isDark = resolvedTheme === 'dark';
  const starColor = isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.9)';
  const bgColor = isDark ? 'rgba(18, 18, 18, 1)' : 'rgba(255, 255, 255, 1)'; // Background color matching theme

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => {
        const dx = star.endX - star.startX;
        const dy = star.endY - star.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const trailLength = Math.min(distance * 0.15, 80); // Trail length based on distance
        
        return (
          <div
            key={star.id}
            className="absolute star-trail"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              width: `${trailLength}px`,
              height: `${star.size}px`,
              '--end-x': `${dx * 0.85}vw`,
              '--end-y': `${dy * 0.85}vh`,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
              '--angle': `${angle}deg`,
              '--star-size': `${star.size}px`,
              '--star-color': starColor,
              '--bg-color': bgColor,
            } as React.CSSProperties & {
              '--end-x': string;
              '--end-y': string;
              '--duration': string;
              '--delay': string;
              '--angle': string;
              '--star-size': string;
              '--star-color': string;
              '--bg-color': string;
            }}
          />
        );
      })}
    </div>
  );
}

