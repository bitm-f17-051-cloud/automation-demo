import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isPrimary?: boolean;
}

const PrimaryButton = ({
  children,
  className,
  isPrimary = true,
  onClick,
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`rounded-lg border border-gray-300 px-3 py-2 ${
        disabled
          ? isPrimary
            ? "bg-dark-gradient-disabled text-white cursor-not-allowed"
            : " bg-gray-50 cursor-not-allowed"
          : isPrimary
          ? "bg-gradient text-white"
          : "bg-white"
      } text-xs font-medium text-gray-900 ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
