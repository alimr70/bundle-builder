import type { BundleState } from "@/features/bundle-builder/types";

const BUNDLE_API_PATH = "/api/bundle";

export const saveBundle = async (state: BundleState): Promise<void> => {
  const response = await fetch(BUNDLE_API_PATH, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(state),
  });

  if (!response.ok) {
    throw new Error("Failed to save bundle.");
  }
};
