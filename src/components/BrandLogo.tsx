import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = "w-8 h-8", size }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 3 Golden Yellow Circles (Foliage) */}
      <circle cx="100" cy="60" r="38" fill="#F2B518" />
      <circle cx="50" cy="112" r="38" fill="#F2B518" />
      <circle cx="150" cy="112" r="38" fill="#F2B518" />

      {/* Dark Brown Branches and Trunk */}
      <path
        d="M 100 150 L 50 112"
        stroke="#52381A"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M 100 150 L 150 112"
        stroke="#52381A"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M 100 184 L 100 60"
        stroke="#52381A"
        strokeWidth="14"
        strokeLinecap="round"
      />
    </svg>
  );
};
