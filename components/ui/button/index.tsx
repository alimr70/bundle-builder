import type { ButtonHTMLAttributes, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

export type ButtonVariant = "primary" | "outline" | "link" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps<T extends ElementType = "button"> = {
  readonly as?: T;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly fullWidth?: boolean;
  readonly children: ReactNode;
  readonly className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

export const Button = <T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps<T>) => {
  const Component = as ?? "button";

  return (
    <Component
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className,
      )}
      type={Component === "button" ? type : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
};
