import React from "react";

interface ChipProps {
  children: React.ReactNode;
  variant?: "default" | "secondary";
  size?: "sm" | "md";
}

export const Chip = React.memo<ChipProps>(({ children, variant = "default", size = "sm" }) => {
  const baseClasses = "inline-flex items-center rounded-full font-medium";

  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
});

Chip.displayName = "Chip";
