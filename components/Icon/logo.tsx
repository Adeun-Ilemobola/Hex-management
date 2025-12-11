import React from 'react';
interface CustomSVGProps {
  size?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  gradientId?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: 'horizontal' | 'vertical' | 'diagonal';
}

const CustomSVG: React.FC<CustomSVGProps> = ({ 
  size = 100, 
  fillColor, 
  strokeColor,
  strokeWidth,
  className = '',
  gradientId = 'customGradient',
  gradientFrom,
  gradientTo,
  gradientDirection = 'vertical'
}) => {
  // Calculate width and height maintaining aspect ratio
  const aspectRatio = 1316 / 1157; // width / height from original viewBox
  const width = size * aspectRatio;
  const height = size;

  // Default classes when no color props are provided
  const defaultClasses = !fillColor && !strokeColor && !gradientFrom ? 'fill-gray-300 stroke-black stroke-1' : '';

  // Gradient coordinates based on direction
  const gradientCoords = {
    horizontal: { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
    vertical: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
    diagonal: { x1: '0%', y1: '0%', x2: '100%', y2: '100%' }
  };

  const coords = gradientCoords[gradientDirection];

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 1316 1157" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${defaultClasses} ${className}`.trim()}
    >
      {/* Define gradient if gradient colors are provided */}
      {gradientFrom && gradientTo && (
        <defs>
          <linearGradient 
            id={gradientId} 
            x1={coords.x1} 
            y1={coords.y1} 
            x2={coords.x2} 
            y2={coords.y2}
          >
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
        </defs>
      )}
      
      <path 
        d="M341.5 584.5C341.5 796 122.333 1057.33 1.5 1141C341.5 1209.5 518 1033.5 596 922L962.5 472V1141H1220.5V180.5C1220.5 73 1275 19 1315 0.5H962.5V180.5L596 584.5V180.5C596 0.5 469.5 0.5 341.5 0.5V584.5Z" 
        fill={gradientFrom && gradientTo ? `url(#${gradientId})` : fillColor || 'currentColor'} 
        stroke={strokeColor || 'currentColor'}
        strokeWidth={strokeWidth || 'inherit'}
      />
    </svg>
  );
};
export default CustomSVG;