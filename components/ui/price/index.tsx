import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

type PriceProps = {
  readonly price: number;
  readonly compareAt?: number;
  readonly priceLabel?: string;
  readonly compareAtLabel?: string;
  readonly isFree?: boolean;
  readonly size?: "card" | "review";
  readonly className?: string;
};

const formatCurrency = (value: number): string =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

export const Price = ({
  price,
  compareAt,
  priceLabel,
  compareAtLabel,
  isFree = false,
  size = "card",
  className,
}: PriceProps) => {
  const compareVariant = size === "card" ? "priceCompare" : "priceCompareSm";
  const activeVariant = size === "card" ? "priceActive" : "priceActiveSm";
  const compareColor = size === "card" ? "discount" : "muted";
  const activeColor = size === "card" ? "gray" : "purple";

  return (
    <div
      data-price-size={size}
      className={cn(
        styles.price,
        size === "card" && styles.priceCard,
        className,
      )}
    >
      {compareAt !== undefined && compareAt > 0 && (
        <Text variant={compareVariant} color={compareColor}>
          {compareAtLabel ?? formatCurrency(compareAt)}
        </Text>
      )}
      <Text
        variant={activeVariant}
        color={isFree ? "purple" : activeColor}
        className={isFree ? styles.free : undefined}
      >
        {isFree ? "FREE" : (priceLabel ?? formatCurrency(price))}
      </Text>
    </div>
  );
};
