"use client";

import { AppImage } from "@/components/ui/appImage";
import { Price } from "@/components/ui/price";
import { QuantityStepper } from "@/components/ui/quantityStepper";
import { Text } from "@/components/ui/text";
import { useBundle } from "@/features/bundle-builder/hooks/use-bundle";
import { getProductById } from "@/features/bundle-builder/lib/selectors";
import { parseQuantityKey } from "@/features/bundle-builder/types";
import styles from "./styles.module.css";

type ReviewLineProps = {
  readonly quantityKey: string;
  readonly quantity: number;
};

export const ReviewLine = ({ quantityKey, quantity }: ReviewLineProps) => {
  const { setQuantity } = useBundle();
  const { productId, variantId } = parseQuantityKey(quantityKey);
  const product = getProductById(productId);

  if (!product) {
    return null;
  }

  const variant = product.variants?.find((item) => item.id === variantId);
  const displayName = variant
    ? product.name
    : product.name;
  const linePrice = product.price * quantity;
  const lineCompareAt = product.compareAt
    ? product.compareAt * quantity
    : undefined;
  const minQuantity = product.isFree ? 0 : (product.minQuantity ?? 0);
  const isPlan = product.category === "Plan";

  return (
    <div className={styles.line}>
      <div className={styles.main}>
        <div className={styles.thumbnail}>
          <AppImage
            src={variant?.swatch ?? product.image}
            alt=""
            fill
            sizes="41px"
            className={styles.image}
          />
        </div>

        {isPlan ? (
          <div className={styles.planName}>
            <AppImage
              src={product.image}
              alt=""
              width={20}
              height={24}
              className={styles.planLogo}
            />
            <Text variant="body" color="ink" as="span">
              Cam{" "}
              <Text variant="bodySemibold" color="purple" as="span">
                Unlimited
              </Text>
            </Text>
          </div>
        ) : (
          <Text variant="body" color="ink" className={styles.name}>
            {displayName}
          </Text>
        )}

        {product.controls === "stepper" && (
          <QuantityStepper
            value={quantity}
            min={minQuantity}
            size="compact"
            onChange={(nextQuantity) => setQuantity(quantityKey, nextQuantity)}
            disabled={
              !product.isFree &&
              product.required &&
              quantity <= minQuantity &&
              minQuantity > 0
            }
          />
        )}
      </div>

      <Price
        price={linePrice}
        compareAt={lineCompareAt}
        priceLabel={product.priceLabel}
        compareAtLabel={product.compareAtLabel}
        isFree={product.isFree}
        size="review"
      />
    </div>
  );
};
