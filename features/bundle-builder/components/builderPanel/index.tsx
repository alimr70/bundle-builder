"use client";

import { Accordion } from "@base-ui/react/accordion";
import catalog from "@/data/catalog.json";
import { StepAccordionItem } from "@/features/bundle-builder/components/stepAccordionItem";
import { useBundle } from "@/features/bundle-builder/hooks/use-bundle";
import type { Catalog } from "@/features/bundle-builder/types";
import styles from "./styles.module.css";

const catalogData = catalog as Catalog;

export const BuilderPanel = () => {
  const { state, setOpenStep } = useBundle();

  return (
    <section className={styles.panel}>
      <Accordion.Root
        value={state.openStep ? [state.openStep] : []}
        onValueChange={(value) => {
          setOpenStep(value[0] ?? "");
        }}
        className={styles.accordion}
      >
        {catalogData.steps.map((step) => (
          <StepAccordionItem key={step.id} step={step} />
        ))}
      </Accordion.Root>
    </section>
  );
};
