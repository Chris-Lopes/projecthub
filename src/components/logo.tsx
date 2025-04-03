import Link from "next/link";
import { HTMLAttributes } from "react";

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({
  size = "md",
  showText = true,
  className,
  ...props
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-xl" },
    lg: { icon: 40, text: "text-2xl" },
  };

  return (
    <div className={`flex items-center ${className}`} {...props}>
      <div className="relative">
        <svg
          width={sizeMap[size].icon}
          height={sizeMap[size].icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="32" height="32" rx="6" fill="#0D1120" />
          <path
            d="M9 8H21C23.2091 8 25 9.79086 25 12V15C25 17.2091 23.2091 19 21 19H15V24"
            stroke="url(#paint0_linear)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="9"
              y1="8"
              x2="25"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#14B8A6" />
              <stop offset="1" stopColor="#0D9488" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <h1 className={`font-bold ${sizeMap[size].text} text-white ml-2`}>
          ProjectHub
        </h1>
      )}
    </div>
  );
}
