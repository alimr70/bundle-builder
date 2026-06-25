import catalog from "@/data/catalog.json";
import type {
  Catalog,
  PricingSummary,
  Product,
  ReviewLineItem,
} from "@/features/bundle-builder/types";
import { getQuantityKey } from "@/features/bundle-builder/types";

const catalogData = catalog as Catalog;

const getProductById = (productId: string): Product | undefined =>
  catalogData.products.find((product) => product.id === productId);

const buildLineItem = (
  product: Product,
  quantity: number,
  variantId?: string,
): ReviewLineItem => {
  const variant = product.variants?.find((item) => item.id === variantId);
  const variantLabel = variant ? ` (${variant.label})` : "";
  const linePrice = product.price * quantity;
  const lineCompareAt = product.compareAt
    ? product.compareAt * quantity
    : undefined;

  return {
    key: getQuantityKey(product.id, variantId),
    productId: product.id,
    variantId,
    name: `${product.name}${variantLabel}`,
    image: variant?.swatch ?? product.image,
    quantity,
    linePrice,
    lineCompareAt,
    priceLabel: product.priceLabel,
    compareAtLabel: product.compareAtLabel,
    isFree: product.isFree === true,
    controls: product.controls,
    required: product.required,
    minQuantity: product.minQuantity,
  };
};

export const buildReviewLineItems = (
  quantities: Record<string, number>,
): ReviewLineItem[] => {
  const items: ReviewLineItem[] = [];

  Object.entries(quantities).forEach(([key, quantity]) => {
    if (quantity <= 0) {
      return;
    }

    const [productId, variantPart] = key.split(":");
    const variantId = variantPart === "default" ? undefined : variantPart;
    const product = getProductById(productId);

    if (!product || product.showInReview === false) {
      return;
    }

    items.push(buildLineItem(product, quantity, variantId));
  });

  return items;
};

export const calculatePricingSummary = (
  quantities: Record<string, number>,
): PricingSummary => {
  const lineItems = buildReviewLineItems(quantities);
  const productSubtotal = lineItems.reduce(
    (total, item) => total + item.linePrice,
    0,
  );
  const productCompareSubtotal = lineItems.reduce(
    (total, item) => total + (item.lineCompareAt ?? item.linePrice),
    0,
  );

  const shippingCompare = catalogData.shipping.compareAt;
  const shippingPrice = catalogData.shipping.isFree ? 0 : shippingCompare;
  const subtotal = productSubtotal + shippingPrice;
  const compareSubtotal = productCompareSubtotal + shippingCompare;
  const savings = Math.max(compareSubtotal - subtotal, 0);
  const financingMonthly =
    subtotal / Math.max(catalogData.financingMonths, 1);

  return {
    subtotal,
    compareSubtotal,
    savings,
    financingMonthly,
    lineItems,
  };
};

export const getCatalog = (): Catalog => catalogData;

export const formatCurrency = (value: number): string =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

export const formatMonthly = (value: number): string =>
  `as low as ${formatCurrency(value)}/mo`;
