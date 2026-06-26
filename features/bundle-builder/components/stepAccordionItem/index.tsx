"use client";

import { Accordion } from "@base-ui/react/accordion";
import { AppImage } from "@/components/ui/appImage";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ProductCard } from "@/features/bundle-builder/components/productCard";
import { useBundle } from "@/features/bundle-builder/hooks/use-bundle";
import { getStepById } from "@/features/bundle-builder/lib/selectors";
import type { BuilderStep } from "@/features/bundle-builder/types";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

type StepAccordionItemProps = {
  readonly step: BuilderStep;
};

const ChevronUp = () => (
  <svg className={styles.chevron} viewBox='0 0 12 12' aria-hidden='true'>
    <path
      d='M2 8 L6 4 L10 8'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    />
  </svg>
);

const ChevronDown = () => (
  <svg className={styles.chevron} viewBox='0 0 12 12' aria-hidden='true'>
    <path
      d='M2 4 L6 8 L10 4'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    />
  </svg>
);

export const StepAccordionItem = ({ step }: StepAccordionItemProps) => {
  const { state, getSelectedCount, getStepProducts, goToNextStep } =
    useBundle();

  const isOpen = state.openStep === step.id;
  const selectedCount = getSelectedCount(step.id);
  const products = getStepProducts(step.id);
  const stepMeta = getStepById(step.id);

  return (
    <Accordion.Item
      value={step.id}
      className={cn(styles.step, isOpen && styles.stepExpanded)}>
      <Text variant='eyebrow' color='eyebrow' className={styles.eyebrowRow}>
        Step {step.number} of 4
      </Text>

      <Accordion.Header>
        <Accordion.Trigger
          className={cn(
            styles.header,
            isOpen ? styles.headerExpanded : styles.headerCollapsed,
          )}>
          <div className={styles.headerInner}>
            <div className={styles.titleGroup}>
              <AppImage
                src={step.icon}
                alt=''
                width={26}
                height={26}
                className={styles.icon}
              />
              <Text variant='stepTitle' color='ink' as='span'>
                {step.title}
              </Text>
            </div>
            <div className={styles.status}>
              {selectedCount > 0 && (
                <Text variant='body' color='purple'>
                  {selectedCount} selected
                </Text>
              )}
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Panel className={styles.panel}>
        <div className={styles.panelInner}>
          <div className={styles.productGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {stepMeta?.nextLabel && (
            <div className={styles.nextButtonWrap}>
              <Button
                variant='outline'
                size='lg'
                onClick={() => goToNextStep(step.id)}>
                {stepMeta.nextLabel}
              </Button>
            </div>
          )}
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  );
};
