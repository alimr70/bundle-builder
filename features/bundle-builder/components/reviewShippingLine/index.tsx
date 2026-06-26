"use client";

import { AppImage } from "@/components/ui/appImage";
import { Price } from "@/components/ui/price";
import { Text } from "@/components/ui/text";
import lineStyles from "@/features/bundle-builder/components/reviewLine/styles.module.css";
import { getCatalog } from "@/features/bundle-builder/lib/pricing";
import styles from "./styles.module.css";

const catalog = getCatalog();

export const ReviewShippingLine = () => {
  const { shipping } = catalog;

  return (
    <div className={styles.section}>
      <div className={lineStyles.line}>
        <div className={lineStyles.main}>
          <div className={lineStyles.thumbnail}>
            <AppImage
              src={shipping.icon}
              alt=""
              fill
              sizes="41px"
              className={lineStyles.image}
            />
          </div>
          <Text variant="body" color="ink" className={lineStyles.name}>
            {shipping.name}
          </Text>
        </div>
        <Price
          price={0}
          compareAt={shipping.compareAt}
          isFree={shipping.isFree}
          size="review"
        />
      </div>
    </div>
  );
};
