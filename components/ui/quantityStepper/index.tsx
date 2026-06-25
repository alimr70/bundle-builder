"use client";

import { NumberField } from "@base-ui/react/number-field";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

type QuantityStepperProps = {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly disabled?: boolean;
  readonly size?: "card" | "compact";
  readonly className?: string;
};

const MinusIcon = () => (
  <svg className={styles.icon} viewBox="0 0 8 2" aria-hidden="true">
    <rect width="8" height="2" fill="currentColor" />
  </svg>
);

const PlusIcon = () => (
  <svg className={styles.icon} viewBox="0 0 8 8" aria-hidden="true">
    <path d="M3.5 0h1v3.5H8v1H4.5V8h-1V4.5H0v-1h3.5V0z" fill="currentColor" />
  </svg>
);

export const QuantityStepper = ({
  value,
  onChange,
  min = 0,
  max = 99,
  disabled = false,
  size = "card",
  className,
}: QuantityStepperProps) => {
  const isAtMin = value <= min;

  return (
    <NumberField.Root
      value={value}
      min={min}
      max={max}
      disabled={disabled}
      onValueChange={(nextValue) => {
        if (nextValue !== null) {
          onChange(nextValue);
        }
      }}
      className={cn(
        styles.root,
        size === "compact" && styles.rootCompact,
        className,
      )}
    >
      <NumberField.Group className={styles.group}>
        <NumberField.Decrement
          className={cn(styles.button, isAtMin && styles.buttonActive)}
          aria-label="Decrease quantity"
        >
          <MinusIcon />
        </NumberField.Decrement>
        <NumberField.Input
          className={cn(styles.input, size === "card" && styles.inputCard)}
          aria-label="Quantity"
        />
        <NumberField.Increment
          className={styles.button}
          aria-label="Increase quantity"
        >
          <PlusIcon />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
};
