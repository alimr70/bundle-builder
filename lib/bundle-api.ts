import type { BundleState } from "@/features/bundle-builder/types";

const BUNDLE_API_PATH = "/api/bundle";

export const fetchSavedBundle = async (): Promise<BundleState | null> => {
  const response = await fetch(BUNDLE_API_PATH, { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load saved bundle.");
  }

  const payload = (await response.json()) as { data: BundleState | null };
  return payload.data;
};

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
