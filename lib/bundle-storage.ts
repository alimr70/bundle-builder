import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import type { BundleState } from "@/features/bundle-builder/types";

const BUNDLE_FILE_NAME = "saved-bundle.json";
const BUNDLE_DIRECTORY = path.join(process.cwd(), "data");
const BUNDLE_FILE_PATH = path.join(BUNDLE_DIRECTORY, BUNDLE_FILE_NAME);
const BUNDLE_TEMP_FILE_PATH = `${BUNDLE_FILE_PATH}.tmp`;

export const isValidBundleState = (value: unknown): value is BundleState => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.openStep === "string" &&
    candidate.quantities !== null &&
    typeof candidate.quantities === "object" &&
    candidate.activeVariant !== null &&
    typeof candidate.activeVariant === "object"
  );
};

export const readBundle = async (): Promise<BundleState | null> => {
  try {
    const raw = await readFile(BUNDLE_FILE_PATH, "utf-8");
    const parsed: unknown = JSON.parse(raw);

    if (!isValidBundleState(parsed)) {
      return null;
    }

    return parsed;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
};

export const writeBundle = async (state: BundleState): Promise<void> => {
  await mkdir(BUNDLE_DIRECTORY, { recursive: true });

  const payload = JSON.stringify(state, null, 2);
  await writeFile(BUNDLE_TEMP_FILE_PATH, payload, "utf-8");
  await rename(BUNDLE_TEMP_FILE_PATH, BUNDLE_FILE_PATH);
};
