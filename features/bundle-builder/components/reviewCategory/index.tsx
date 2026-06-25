import { Text } from "@/components/ui/text";
import { ReviewLine } from "@/features/bundle-builder/components/reviewLine";
import type { ProductCategory } from "@/features/bundle-builder/types";
import styles from "./styles.module.css";

type ReviewCategoryProps = {
  readonly title: string;
  readonly items: ReadonlyArray<{ key: string; quantity: number }>;
};

export const ReviewCategory = ({ title, items }: ReviewCategoryProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.category}>
      <Text variant="categoryLabel" color="muted">
        {title}
      </Text>
      <div className={styles.items}>
        {items.map((item) => (
          <ReviewLine
            key={item.key}
            quantityKey={item.key}
            quantity={item.quantity}
          />
        ))}
      </div>
    </section>
  );
};

export const categoryTitleMap: Record<ProductCategory, string> = {
  Cameras: "Cameras",
  Sensors: "Sensors",
  Accessories: "accessories",
  Plan: "plan",
};
