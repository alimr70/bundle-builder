import { getCatalog } from "@/features/bundle-builder/lib/pricing";
import type { Product, ProductCategory } from "@/features/bundle-builder/types";
import { getQuantityKey } from "@/features/bundle-builder/types";

const catalog = getCatalog();

export const getProductsByStep = (stepId: string): Product[] =>
  catalog.products.filter(
    (product) => product.stepId === stepId && product.showInBuilder !== false,
  );

export const getSelectedCountForStep = (
  stepId: string,
  quantities: Record<string, number>,
): number => {
  const stepProducts = getProductsByStep(stepId);
  const selectedProductIds = new Set<string>();

  stepProducts.forEach((product) => {
    const hasQuantity = Object.entries(quantities).some(([key, quantity]) => {
      if (quantity <= 0) {
        return false;
      }

      const [productId] = key.split(":");
      return productId === product.id;
    });

    if (hasQuantity) {
      selectedProductIds.add(product.id);
    }
  });

  return selectedProductIds.size;
};

export const getLineItemsByCategory = (
  quantities: Record<string, number>,
): Record<ProductCategory, Array<{ key: string; quantity: number }>> => {
  const grouped: Record<ProductCategory, Array<{ key: string; quantity: number }>> =
    {
      Cameras: [],
      Sensors: [],
      Accessories: [],
      Plan: [],
    };

  Object.entries(quantities).forEach(([key, quantity]) => {
    if (quantity <= 0) {
      return;
    }

    const [productId] = key.split(":");
    const product = catalog.products.find((item) => item.id === productId);

    if (!product || product.showInReview === false) {
      return;
    }

    grouped[product.category].push({ key, quantity });
  });

  return grouped;
};

export const createInitialQuantities = (): Record<string, number> => ({});

export const createInitialActiveVariants = (): Record<string, string> => {
  const activeVariant: Record<string, string> = {};

  catalog.products.forEach((product) => {
    if (product.variants && product.variants.length > 0) {
      activeVariant[product.id] =
        product.defaultVariantId ?? product.variants[0].id;
    }
  });

  return activeVariant;
};

export const getNextStepId = (currentStepId: string): string | null => {
  const currentIndex = catalog.steps.findIndex((step) => step.id === currentStepId);
  if (currentIndex < 0 || currentIndex >= catalog.steps.length - 1) {
    return null;
  }

  return catalog.steps[currentIndex + 1].id;
};

export const getStepById = (stepId: string) =>
  catalog.steps.find((step) => step.id === stepId);

export const getProductById = (productId: string): Product | undefined =>
  catalog.products.find((product) => product.id === productId);
