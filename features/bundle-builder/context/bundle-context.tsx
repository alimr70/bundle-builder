"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import catalog from "@/data/catalog.json";
import { calculatePricingSummary } from "@/features/bundle-builder/lib/pricing";
import {
  createInitialActiveVariants,
  createInitialQuantities,
  getNextStepId,
  getProductsByStep,
  getSelectedCountForStep,
} from "@/features/bundle-builder/lib/selectors";
import type {
  BundleState,
  Catalog,
  PricingSummary,
  Product,
} from "@/features/bundle-builder/types";
import { getQuantityKey } from "@/features/bundle-builder/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";

const STORAGE_KEY = "bundle-builder:v1";
const catalogData = catalog as Catalog;

type BundleAction =
  | { type: "HYDRATE"; payload: BundleState }
  | { type: "SET_OPEN_STEP"; payload: string }
  | { type: "SET_ACTIVE_VARIANT"; payload: { productId: string; variantId: string } }
  | { type: "SET_QUANTITY"; payload: { key: string; quantity: number } }
  | { type: "SAVE_FOR_LATER" };

const createInitialState = (): BundleState => ({
  quantities: createInitialQuantities(),
  activeVariant: createInitialActiveVariants(),
  openStep: catalogData.steps[0]?.id ?? "step-1",
});

const bundleReducer = (
  state: BundleState,
  action: BundleAction,
): BundleState => {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "SET_OPEN_STEP":
      return { ...state, openStep: action.payload };
    case "SET_ACTIVE_VARIANT":
      return {
        ...state,
        activeVariant: {
          ...state.activeVariant,
          [action.payload.productId]: action.payload.variantId,
        },
      };
    case "SET_QUANTITY": {
      const nextQuantity = Math.max(action.payload.quantity, 0);

      return {
        ...state,
        quantities: {
          ...state.quantities,
          [action.payload.key]: nextQuantity,
        },
      };
    }
    case "SAVE_FOR_LATER":
      setStorageItem(STORAGE_KEY, state);
      return state;
    default:
      return state;
  }
};

type BundleContextValue = {
  readonly state: BundleState;
  readonly pricing: PricingSummary;
  readonly setOpenStep: (stepId: string) => void;
  readonly goToNextStep: (currentStepId: string) => void;
  readonly setActiveVariant: (productId: string, variantId: string) => void;
  readonly setQuantity: (key: string, quantity: number) => void;
  readonly setProductQuantity: (
    product: Product,
    quantity: number,
    variantId?: string,
  ) => void;
  readonly getProductQuantity: (product: Product) => number;
  readonly getSelectedCount: (stepId: string) => number;
  readonly getStepProducts: (stepId: string) => Product[];
  readonly saveForLater: () => void;
  readonly handleCheckout: () => void;
};

const BundleContext = createContext<BundleContextValue | null>(null);

export const BundleProvider = ({ children }: { readonly children: ReactNode }) => {
  const [state, dispatch] = useReducer(bundleReducer, undefined, createInitialState);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    const saved = getStorageItem<BundleState>(STORAGE_KEY);
    if (saved) {
      dispatch({ type: "HYDRATE", payload: saved });
    }
  }, []);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    setStorageItem(STORAGE_KEY, state);
  }, [state]);

  const pricing = useMemo(
    () => calculatePricingSummary(state.quantities),
    [state.quantities],
  );

  const value = useMemo<BundleContextValue>(
    () => ({
      state,
      pricing,
      setOpenStep: (stepId) => dispatch({ type: "SET_OPEN_STEP", payload: stepId }),
      goToNextStep: (currentStepId) => {
        const nextStepId = getNextStepId(currentStepId);
        if (nextStepId) {
          dispatch({ type: "SET_OPEN_STEP", payload: nextStepId });
        }
      },
      setActiveVariant: (productId, variantId) =>
        dispatch({
          type: "SET_ACTIVE_VARIANT",
          payload: { productId, variantId },
        }),
      setQuantity: (key, quantity) =>
        dispatch({ type: "SET_QUANTITY", payload: { key, quantity } }),
      setProductQuantity: (product, quantity, variantId) => {
        const activeVariantId =
          variantId ??
          state.activeVariant[product.id] ??
          product.defaultVariantId;
        const key = getQuantityKey(product.id, activeVariantId);
        dispatch({ type: "SET_QUANTITY", payload: { key, quantity } });
      },
      getProductQuantity: (product) => {
        const variantId =
          state.activeVariant[product.id] ?? product.defaultVariantId;
        const key = getQuantityKey(product.id, variantId);
        return state.quantities[key] ?? 0;
      },
      getSelectedCount: (stepId) =>
        getSelectedCountForStep(stepId, state.quantities),
      getStepProducts: (stepId) => getProductsByStep(stepId),
      saveForLater: () => {
        setStorageItem(STORAGE_KEY, state);
        window.alert("Your system has been saved. Come back anytime!");
      },
      handleCheckout: () => {
        window.alert("Checkout is a placeholder in this prototype.");
      },
    }),
    [state, pricing],
  );

  return (
    <BundleContext.Provider value={value}>{children}</BundleContext.Provider>
  );
};

export const useBundle = (): BundleContextValue => {
  const context = useContext(BundleContext);
  if (!context) {
    throw new Error("useBundle must be used within BundleProvider");
  }

  return context;
};
