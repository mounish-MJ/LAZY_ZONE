import React from "react";

export function MuscularLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bodybuilder Silhouette Front Double Bicep Pose */}
      {/* Head */}
      <circle cx="50" cy="18" r="7.5" />
      {/* Neck */}
      <path d="M 47.5,25.5 L 52.5,25.5 L 52,30 L 48,30 Z" />
      {/* Left arm: bicep and forearm flexed */}
      <path d="M 43,30.5 C 38.5,30 33.5,31.2 29,33.5 C 25,30 18,28.5 13,31 C 8,33 7,39 11,42 C 14.5,45 19,43.5 22.5,41 C 25,45.5 29.5,48.5 35,50 C 37,43.5 39.5,37 43,30.5 Z" />
      {/* Left Fist/Forearm raised */}
      <path d="M 15.5,31.5 C 12,25.5 15.5,17 22,15 C 26.5,13.5 30,19 28,26 Z" />
      
      {/* Right arm: bicep and forearm flexed */}
      <path d="M 57,30.5 C 61.5,30 66.5,31.2 71,33.5 C 75,30 82,28.5 87,31 C 92,33 93,39 89,42 C 85.5,45 81,43.5 77.5,41 C 75,45.5 70.5,48.5 65,50 C 63,43.5 60.5,37 57,30.5 Z" />
      {/* Right Fist/Forearm raised */}
      <path d="M 84.5,31.5 C 88,25.5 84.5,17 78,15 C 73.5,13.5 70,19 72,26 Z" />
      
      {/* Torso: broad chest/shoulders, wide back lats, and narrow waist */}
      <path d="M 43,30.5 C 45,30 55,30 57,30.5 C 62,43 65.5,53.5 61,68 C 57.5,75.5 55.5,79 55,87 L 45,87 C 44.5,79 42.5,75.5 39,68 C 34.5,53.5 38,43 43,30.5 Z" />
    </svg>
  );
}
