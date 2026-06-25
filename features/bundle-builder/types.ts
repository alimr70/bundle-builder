export type ProductCategory =
  | "Cameras"
  | "Sensors"
  | "Accessories"
  | "Plan";

export type ProductControls = "stepper" | "none";

export type ProductVariant = {
  readonly id: string;
  readonly label: string;
  readonly swatch: string;
};

export type Product = {
  readonly id: string;
  readonly name: string;
  readonly category: ProductCategory;
  readonly stepId: string;
  readonly description?: string;
  readonly image: string;
  readonly badge?: string;
  readonly price: number;
  readonly compareAt?: number;
  readonly priceLabel?: string;
  readonly compareAtLabel?: string;
  readonly variants?: readonly ProductVariant[];
  readonly defaultVariantId?: string;
  readonly controls: ProductControls;
  readonly required?: boolean;
  readonly minQuantity?: number;
  readonly isFree?: boolean;
  readonly learnMoreUrl?: string;
  readonly showInBuilder?: boolean;
  readonly showInReview?: boolean;
};

export type BuilderStep = {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly icon: string;
  readonly nextLabel?: string;
};

export type SeedSelection = {
  readonly productId: string;
  readonly variantId?: string;
  readonly quantity: number;
};

export type Catalog = {
  readonly steps: readonly BuilderStep[];
  readonly products: readonly Product[];
  readonly seedSelections: readonly SeedSelection[];
  readonly shipping: {
    readonly name: string;
    readonly compareAt: number;
    readonly isFree: boolean;
    readonly icon: string;
  };
  readonly financingMonths: number;
};

export type BundleState = {
  readonly quantities: Record<string, number>;
  readonly activeVariant: Record<string, string>;
  readonly openStep: string;
};

export type ReviewLineItem = {
  readonly key: string;
  readonly productId: string;
  readonly variantId?: string;
  readonly name: string;
  readonly image: string;
  readonly quantity: number;
  readonly linePrice: number;
  readonly lineCompareAt?: number;
  readonly priceLabel?: string;
  readonly compareAtLabel?: string;
  readonly isFree: boolean;
  readonly controls: ProductControls;
  readonly required?: boolean;
  readonly minQuantity?: number;
};

export type PricingSummary = {
  readonly subtotal: number;
  readonly compareSubtotal: number;
  readonly savings: number;
  readonly financingMonthly: number;
  readonly lineItems: readonly ReviewLineItem[];
};

export const getQuantityKey = (
  productId: string,
  variantId?: string,
): string => `${productId}:${variantId ?? "default"}`;

export const parseQuantityKey = (
  key: string,
): { productId: string; variantId?: string } => {
  const [productId, variantPart] = key.split(":");
  return {
    productId,
    variantId: variantPart === "default" ? undefined : variantPart,
  };
};
