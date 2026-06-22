import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "amber" | "purple" | "blue" | "green" | "red" | "none";
}

export const Card = ({
  children,
  className = "",
  hover = true,
  glow = "none",
  ...props
}: CardProps) => {
  const glowStyles = {
    amber: "hover:shadow-amber-500/20 hover:border-amber-500/30",
    purple: "hover:shadow-purple-500/20 hover:border-purple-500/30",
    blue: "hover:shadow-blue-500/20 hover:border-blue-500/30",
    green: "hover:shadow-green-500/20 hover:border-green-500/30",
    red: "hover:shadow-red-500/20 hover:border-red-500/30",
    none: "hover:border-slate-600",
  };

  return (
    <div
      {...props}
      className={`
        bg-gradient-to-br from-slate-800/80 to-slate-900/80 
        backdrop-blur-sm rounded-2xl border border-slate-700/50 
        ${
          hover
            ? `transition-all duration-300 hover:shadow-xl ${glowStyles[glow]}`
            : ""
        }
        ${props.onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
