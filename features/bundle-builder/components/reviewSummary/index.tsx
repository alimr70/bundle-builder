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

  return (
    <div className={styles.summary}>
      <div className={styles.totalsRow}>
        <AppImage
          src="/assets/satisfaction-badge.png"
          alt="100% Wyze Satisfaction Guaranteed"
          width={78}
          height={78}
          className={styles.badge}
        />
        <div className={styles.totals}>
          <Badge variant="financing">
            {formatMonthly(pricing.financingMonthly)}
          </Badge>
          <div className={styles.priceRow}>
            <Text variant="totalCompare" color="muted">
              {formatCurrency(pricing.compareSubtotal)}
            </Text>
            <Text variant="total" color="purple">
              {formatCurrency(pricing.subtotal)}
            </Text>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {pricing.savings > 0 && (
          <Text variant="savings" color="green" className={styles.savings}>
            Congrats! You&apos;re saving {formatCurrency(pricing.savings)} on
            your security bundle!
          </Text>
        )}
        <Button variant="primary" size="md" fullWidth onClick={handleCheckout}>
          Checkout
        </Button>
        <Button
          variant="link"
          size="sm"
          fullWidth
          className={styles.saveLink}
          onClick={saveForLater}
        >
          Save my system for later
        </Button>
      </div>
    </div>
  );
};
