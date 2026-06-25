"use client";

import { Text } from "@/components/ui/text";
import { BuilderPanel } from "@/features/bundle-builder/components/builderPanel";
import { ReviewPanel } from "@/features/bundle-builder/components/reviewPanel";
import styles from "./styles.module.css";

export const BundleBuilderPage = () => (
  <main className={styles.page}>
    <Text
      variant="mobileHeading"
      color="title"
      as="h1"
      className={styles.mobileHeading}
    >
      Let&apos;s get started!
    </Text>

    <div className={styles.layout}>
      <section className={styles.builder} aria-label="Bundle builder">
        <BuilderPanel />
      </section>
      <div className={styles.review}>
        <ReviewPanel />
      </div>
    </div>
  </main>
);
