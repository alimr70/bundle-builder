# Bundle Builder

A frontend take-home prototype: a multi-step Wyze security bundle builder with a live review panel.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Stack

- **Next.js 16** (App Router) + **React 19**
- **@base-ui/react** for Accordion, NumberField, ToggleGroup
- **CSS Modules** for component styling + **Tailwind 4** for global tokens/reset
- **Local JSON** catalog at [`data/catalog.json`](data/catalog.json)

## Architecture

Feature-based layout:

- `components/ui/` — variant-driven design system (`Text`, `Button`, `Badge`, `Price`, `QuantityStepper`)
- `features/bundle-builder/` — builder state, accordion steps, product cards, review panel
- `data/catalog.json` — products, steps, seed selections
- `lib/bundle-storage.ts` — server-side read/write of bundle state to disk
- `lib/bundle-api.ts` — client-side `PUT` helper for explicit saves
- `app/api/bundle/` — REST route (`GET` / `PUT`) backed by the same file storage

### Data flow

1. **`app/page.tsx`** (Server Component) reads `data/saved-bundle.json` via `readBundle()` and passes normalized state to `BundleProvider`.
2. **`BundleProvider`** (Client Component) holds interactive state in a reducer — step navigation, variant selection, quantities, and live pricing.
3. **Save** — the user clicks "Save my system for later", which calls `PUT /api/bundle` to persist the current state to disk.

> **Note:** For simplicity, the backend does not use a database. Saved bundles are written to a local JSON file (`data/saved-bundle.json`) on the server filesystem. This is intentional for the prototype and would be replaced with a proper datastore in production.

## Decisions & tradeoffs

- **Server rendering:** Initial bundle state is loaded on the server during page render (no client-side fetch on mount, no blank loading screen). Interactive UI still runs client-side via React context.
- **Fonts:** Gilroy and TT Norms Pro are loaded via `next/font/local` from `app/fonts/`.
- **Pricing:** Totals are **computed** from unit price × quantity (not the hand-set review line totals in Figma, which are internally inconsistent). Savings and financing (`total / 12`) derive from compare-at vs active prices.
- **Persistence:** Saving is explicit only — there is no auto-save. Unsaved changes are lost on refresh.
- **Checkout:** Placeholder alert only (per BRD).
- **Variant chip styling:** Selection behavior and per-variant quantities are implemented; active-chip visual polish is best-effort per BRD.
- **Steps 2–4:** Product data for plan, sensors, and accessories is seeded from the review panel; step 2 plan card is minimal (no quantity control).

## Interactions

- Accordion steps (restores last open step from saved state, otherwise Step 1)
- Per-variant quantities with synced card/review steppers
- Live review panel with category grouping
- Responsive layouts for desktop (≥1024px), tablet (768–1023px), and mobile (<768px)
