"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { QuantityStepper } from "@/components/ui/quantityStepper";
import { Text } from "@/components/ui/text";
import { VariantSelector } from "@/features/bundle-builder/components/variantSelector";
import { useBundle } from "@/features/bundle-builder/hooks/use-bundle";
import type { Product } from "@/features/bundle-builder/types";
import { getQuantityKey } from "@/features/bundle-builder/types";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

type ProductCardProps = {
  readonly product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const {
    state,
    setActiveVariant,
    setQuantity,
    getProductQuantity,
  } = useBundle();

  const activeVariantId =
    state.activeVariant[product.id] ?? product.defaultVariantId;
  const quantity = getProductQuantity(product);
  const isSelected = quantity > 0;
  const quantityKey = getQuantityKey(product.id, activeVariantId);
  const minQuantity = product.minQuantity ?? 0;

  const handleQuantityChange = (nextQuantity: number): void => {
    setQuantity(quantityKey, nextQuantity);
  };

  const mediaClassName = cn(
    styles.media,
    product.id === "wyze-cam-floodlight-v2" && styles.mediaTall,
    product.id === "wyze-duo-cam-doorbell" && styles.mediaSquare,
  );

  return (
    <article
      className={cn(styles.card, isSelected && styles.cardSelected)}
      data-selected={isSelected}
    >
      <div className={mediaClassName}>
        <div className={styles.imageWrap}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1023px) 50vw, 101px"
            className={styles.image}
          />
          {product.badge && (
            <Badge variant="discount" className={styles.badge}>
              {product.badge}
            </Badge>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <Text variant="cardTitle" color="title">
            {product.name}
          </Text>
          {product.description && (
            <div className={styles.description}>
              <Text variant="cardDesc" color="subtitle" as="p">
                {product.description}{" "}
                <span className={styles.learnMore}>Learn More</span>
              </Text>
            </div>
          )}
          {product.variants && activeVariantId && (
            <VariantSelector
              variants={product.variants}
              value={activeVariantId}
              onChange={(variantId) => setActiveVariant(product.id, variantId)}
            />
          )}
        </div>

        <div className={styles.footer}>
          {product.controls === "stepper" && (
            <QuantityStepper
              value={quantity}
              min={minQuantity}
              onChange={handleQuantityChange}
              disabled={product.required && quantity <= minQuantity && minQuantity > 0}
              size="card"
            />
          )}
          <Price
            price={product.price}
            compareAt={product.compareAt}
            priceLabel={product.priceLabel}
            compareAtLabel={product.compareAtLabel}
            isFree={product.isFree}
            size="card"
          />
        </div>
      </div>
    </article>
  );
};
