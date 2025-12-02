import React from 'react';

interface LinqIconProps {
  className?: string;
}

const LinqIcon: React.FC<LinqIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#3B82F6" />
      <path
        d="M7 12h10M12 7v10"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LinqIcon;

