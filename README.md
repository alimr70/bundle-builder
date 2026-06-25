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
- `lib/storage.ts` — `localStorage` persistence

## Decisions & tradeoffs

- **Fonts:** Figma specifies Gilroy / TT Norms Pro (licensed). The app uses **Manrope** via `next/font` as a close substitute. Drop `.woff2` files into `app/fonts/` and switch `layout.tsx` to `next/font/local` for exact fidelity.
- **Pricing:** Totals are **computed** from unit price × quantity (not the hand-set review line totals in Figma, which are internally inconsistent). Savings and financing (`total / 12`) derive from compare-at vs active prices.
- **Persistence:** Configuration auto-saves to `localStorage` (`bundle-builder:v1`) on every change. "Save my system for later" shows a confirmation alert.
- **Checkout:** Placeholder alert only (per BRD).
- **Variant chip styling:** Selection behavior and per-variant quantities are implemented; active-chip visual polish is best-effort per BRD.
- **Steps 2–4:** Product data for plan, sensors, and accessories is seeded from the review panel; step 2 plan card is minimal (no quantity control).

## Interactions

- Accordion steps (Step 1 open by default)
- Per-variant quantities with synced card/review steppers
- Live review panel with category grouping
- Responsive layouts for desktop (≥1024px), tablet (640–1023px), and mobile (<640px)
