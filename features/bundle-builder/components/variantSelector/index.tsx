"use client";

import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import Image from "next/image";
import type { ProductVariant } from "@/features/bundle-builder/types";
import styles from "./styles.module.css";

type VariantSelectorProps = {
  readonly variants: readonly ProductVariant[];
  readonly value: string;
  readonly onChange: (variantId: string) => void;
};

export const VariantSelector = ({
  variants,
  value,
  onChange,
}: VariantSelectorProps) => (
  <ToggleGroup
    value={[value]}
    onValueChange={(nextValue) => {
      const selected = nextValue[0];
      if (selected) {
        onChange(selected);
      }
    }}
    className={styles.group}
  >
    {variants.map((variant) => (
      <Toggle
        key={variant.id}
        value={variant.id}
        className={styles.chip}
        aria-label={variant.label}
      >
        <Image
          src={variant.swatch}
          alt=""
          width={22}
          height={22}
          className={styles.swatch}
        />
        <span className={styles.label}>{variant.label}</span>
      </Toggle>
    ))}
  </ToggleGroup>
);
