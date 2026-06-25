"use client";

import { Text } from "@/components/ui/text";
import {
  ReviewCategory,
  categoryTitleMap,
} from "@/features/bundle-builder/components/reviewCategory";
import { ReviewSummary } from "@/features/bundle-builder/components/reviewSummary";
import { useBundle } from "@/features/bundle-builder/hooks/use-bundle";
import { getLineItemsByCategory } from "@/features/bundle-builder/lib/selectors";
import type { ProductCategory } from "@/features/bundle-builder/types";
import styles from "./styles.module.css";

const categoryOrder: ProductCategory[] = [
  "Cameras",
  "Sensors",
  "Accessories",
  "Plan",
];

export const ReviewPanel = () => {
  const { state } = useBundle();
  const grouped = getLineItemsByCategory(state.quantities);

  return (
    <aside className={styles.panel}>
      <div className={styles.eyebrow}>
        <Text variant="eyebrow" color="eyebrow">
          Review
        </Text>
      </div>

      <div className={styles.intro}>
        <Text variant="panelTitle" color="title">
          Your security system
        </Text>
        <Text variant="panelSubtitle" color="subtitle" as="p">
          Review your personalized protection system designed to keep what
          matters most safe.
        </Text>
      </div>

      <div className={styles.body}>
        <div className={styles.categories}>
          {categoryOrder.map((category) => (
            <ReviewCategory
              key={category}
              title={categoryTitleMap[category]}
              items={grouped[category]}
            />
          ))}
        </div>

        <div className={styles.summaryColumn}>
          <ReviewSummary />
        </div>
      </div>
    </aside>
  );
};
