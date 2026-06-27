import { BundleBuilderPage } from "@/features/bundle-builder/components/bundleBuilderPage";
import { BundleProvider } from "@/features/bundle-builder/context/bundle-context";
import { getInitialBundleState } from "@/features/bundle-builder/lib/selectors";
import { readBundle } from "@/lib/bundle-storage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const saved = await readBundle();
  const initialState = getInitialBundleState(saved);

  return (
    <BundleProvider initialState={initialState}>
      <BundleBuilderPage />
    </BundleProvider>
  );
}
