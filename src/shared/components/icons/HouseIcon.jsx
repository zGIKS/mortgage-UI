import React from 'react';
import { cn } from '@/lib/utils';

const HouseIcon = React.forwardRef(({
  size = 64,
  houseColor = "hsl(0, 0%, 0%)",
  roofColor = "hsl(0, 0%, 20%)",
  strokeColor = "hsl(0, 0%, 0%)",
  strokeWidth = 2,
  className,
  ...props
}, ref) => {
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("house-icon", className)}
      {...props}
    >
      {/* Casa base */}
      <rect
        x="16"
        y="32"
        width="32"
        height="24"
        fill={houseColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Techo */}
      <polygon
        points="12,32 32,16 52,32"
        fill={roofColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
});

HouseIcon.displayName = "HouseIcon";

export { HouseIcon };