export const MessageDeliveryStatusIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 6C0 2.68629 2.68629 0 6 0H26C29.3137 0 32 2.68629 32 6V26C32 29.3137 29.3137 32 26 32H6C2.68629 32 0 29.3137 0 26V6Z"
        fill="#EBF5FF"
      />
      <path
        d="M10.6667 22.0002V13.3335C10.6667 12.2289 11.5621 11.3335 12.6667 11.3335H19.3333C20.4379 11.3335 21.3333 12.2289 21.3333 13.3335V17.3335C21.3333 18.4381 20.4379 19.3335 19.3333 19.3335H13.3333L10.6667 22.0002"
        stroke="#1C64F2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 16.6668H17.3333"
        stroke="#1C64F2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 13.9998H18.6667"
        stroke="#1C64F2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
