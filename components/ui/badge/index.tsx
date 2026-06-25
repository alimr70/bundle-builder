import type { ReactNode } from "react";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

export type BadgeVariant = "discount" | "financing";

type BadgeProps = {
  readonly variant: BadgeVariant;
  readonly children: ReactNode;
  readonly className?: string;
};

export const Badge = ({ variant, children, className }: BadgeProps) => (
  <span className={cn(styles.badge, styles[variant], className)}>
    <Text variant="badge" color="white">
      {children}
    </Text>
  </span>
);
