"use client";

import { AppImage } from "@/components/ui/appImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useBundle } from "@/features/bundle-builder/hooks/use-bundle";
import {
  formatCurrency,
  formatMonthly,
} from "@/features/bundle-builder/lib/pricing";
import styles from "./styles.module.css";

export const ReviewSummary = () => {
  const { pricing, saveForLater, handleCheckout } = useBundle();
  const savingsAmount = pricing.compareSubtotal - pricing.subtotal;

  return (
    <div className={styles.summary}>
      <div className={styles.totalsRow}>
        <div className={styles.returnsRow}>
          <AppImage
            src='/assets/satisfaction-badge.png'
            alt='100% Wyze Satisfaction Guaranteed'
            width={131}
            height={131}
            className={styles.badge}
          />
          <div className={styles.returnsInfo}>
            <Text variant='returnTitle' color='title'>
              30-day hassle-free returns
            </Text>
            <br />
            <Text variant='returnBody' color='title' as='p'>
              If you&apos;re not totally in love with the product, we will
              refund you 100%.
            </Text>
          </div>
        </div>
        <div className={styles.pricingRow}>
          <Badge variant='financing'>
            {formatMonthly(pricing.financingMonthly)}
          </Badge>
          <div className={styles.priceRow}>
            <Text variant='totalCompare' color='muted'>
              {formatCurrency(pricing.compareSubtotal)}
            </Text>
            <Text variant='total' color='purple'>
              {formatCurrency(pricing.subtotal)}
            </Text>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {savingsAmount > 0 && (
          <Text variant='savings' color='green' className={styles.savings}>
            Congrats! You&apos;re saving {formatCurrency(savingsAmount)} on your
            security bundle!
          </Text>
        )}
        <Button variant='primary' size='md' fullWidth onClick={handleCheckout}>
          Checkout
        </Button>
        <Button
          variant='link'
          size='sm'
          fullWidth
          className={styles.saveLink}
          onClick={saveForLater}>
          Save my system for later
        </Button>
      </div>
    </div>
  );
};
