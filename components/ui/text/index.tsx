import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

export type TextVariant =
  | "eyebrow"
  | "stepTitle"
  | "panelTitle"
  | "panelSubtitle"
  | "categoryLabel"
  | "cardTitle"
  | "cardDesc"
  | "body"
  | "bodySemibold"
  | "priceCompare"
  | "priceCompareSm"
  | "priceActive"
  | "priceActiveSm"
  | "badge"
  | "savings"
  | "total"
  | "totalCompare"
  | "link"
  | "linkItalic"
  | "mobileHeading";

export type TextColor =
  | "eyebrow"
  | "ink"
  | "title"
  | "subtitle"
  | "muted"
  | "purple"
  | "discount"
  | "gray"
  | "green"
  | "white"
  | "inherit";

type TextProps<T extends ElementType = "span"> = {
  readonly as?: T;
  readonly variant: TextVariant;
  readonly color?: TextColor;
  readonly className?: string;
  readonly children: ReactNode;
};

const colorClassMap: Record<TextColor, string | undefined> = {
  eyebrow: styles.colorEyebrow,
  ink: styles.colorInk,
  title: styles.colorTitle,
  subtitle: styles.colorSubtitle,
  muted: styles.colorMuted,
  purple: styles.colorPurple,
  discount: styles.colorDiscount,
  gray: styles.colorGray,
  green: styles.colorGreen,
  white: styles.colorWhite,
  inherit: undefined,
};

export const Text = <T extends ElementType = "span">({
  as,
  variant,
  color = "inherit",
  className,
  children,
}: TextProps<T>) => {
  const Component = as ?? "span";

  return (
    <Component
      className={cn(styles[variant], colorClassMap[color], className)}
    >
      {children}
    </Component>
  );
};
