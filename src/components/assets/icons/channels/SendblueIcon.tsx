import React from 'react';

interface SendblueIconProps {
  className?: string;
}

const SendblueIcon: React.FC<SendblueIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="5" fill="#007AFF" />
      <path
        d="M12 6L18 10V14L12 18L6 14V10L12 6Z"
        fill="white"
      />
      <path
        d="M12 10L15 12V14L12 16L9 14V12L12 10Z"
        fill="#007AFF"
      />
    </svg>
  );
};

export default SendblueIcon;

