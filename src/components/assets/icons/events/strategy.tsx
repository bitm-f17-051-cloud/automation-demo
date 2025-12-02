import { cn } from "@/lib/utils"

export const StrategyEventIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("!size-4", className)}
    >
      <g id="Frame" clipPath="url(#clip0_28793_79465)">
        <path
          id="Vector"
          d="M6.66797 5.83333C6.66797 6.71739 7.01916 7.56523 7.64428 8.19036C8.2694 8.81548 9.11725 9.16667 10.0013 9.16667C10.8854 9.16667 11.7332 8.81548 12.3583 8.19036C12.9834 7.56523 13.3346 6.71739 13.3346 5.83333C13.3346 4.94928 12.9834 4.10143 12.3583 3.47631C11.7332 2.85119 10.8854 2.5 10.0013 2.5C9.11725 2.5 8.2694 2.85119 7.64428 3.47631C7.01916 4.10143 6.66797 4.94928 6.66797 5.83333Z"
          stroke="#1E429F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          id="Vector_2"
          d="M5 17.5V15.8333C5 14.9493 5.35119 14.1014 5.97631 13.4763C6.60143 12.8512 7.44928 12.5 8.33333 12.5H10.8333"
          stroke="#1E429F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          id="Vector_3"
          d="M17.5013 12.5H15.418C15.0864 12.5 14.7685 12.6317 14.5341 12.8661C14.2997 13.1005 14.168 13.4185 14.168 13.75C14.168 14.0815 14.2997 14.3995 14.5341 14.6339C14.7685 14.8683 15.0864 15 15.418 15H16.2513C16.5828 15 16.9008 15.1317 17.1352 15.3661C17.3696 15.6005 17.5013 15.9185 17.5013 16.25C17.5013 16.5815 17.3696 16.8995 17.1352 17.1339C16.9008 17.3683 16.5828 17.5 16.2513 17.5H14.168"
          stroke="#1E429F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          id="Vector_4"
          d="M15.832 17.5001V18.3334M15.832 11.6667V12.5001"
          stroke="#1E429F"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_28793_79465">
          <rect width="20" height="20" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>
  );
};
