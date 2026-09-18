import React from 'react';

export function UniPathLogo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M8.5 7V17.5C8.5 21.6421 11.8579 25 16 25C20.1421 25 23.5 21.6421 23.5 17.5V7"
        stroke="#1765ED"
        strokeWidth="4.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
