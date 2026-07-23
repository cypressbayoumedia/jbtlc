# J&B's Tropical Leaf Corner — Blueprint

## Overview
J&B's Tropical Leaf Corner (JBTLC) is a premium botanical leaf tea e-commerce application built with Angular 21+. The app showcases curated botanical leaf teas and educational content sourced from Contentful CMS, with payment processing via Stripe and backend services powered by Firebase.

## Architecture & Features

### Phase 1 — Foundation (Completed)
- **Angular 21+ standalone app** with `OnPush` change detection, signals, and modern control flow (`@if`, `@for`)
- **Routing**: Lazy-loaded pages — Home, Our Story, Shop, Tea Collections, Learn, Contact, POS (Buy), Checkout
- **Design system**: Brand palette (olive, gold, cream, tan, black), custom typography (`The Seasons` + `Open Sans`), CSS variables, noise texture, scrollbar styling
- **Components**: Announcement bar, Navbar, page scaffolds
- **Firebase**: Auth, Firestore, Cloud Functions integration
- **Stripe**: Payment processing via `ngx-stripe`

### Phase 2 — Contentful Integration & Data Binding (Completed)
- **Environment config**: Contentful `spaceId` and `accessToken` in `environment.ts` and `environment.development.ts`
- **Contentful SDK**: `contentful` npm package + `@contentful/rich-text-html-renderer`
- **Data provider**: `Contentful` (`src/app/core/contentful.ts`) with `getTeas()`, `getLearnArticles()`, `getTeaBySlug()`
- **Shop page**: Product grid from Contentful, clickable cards linking to `/shop/:slug`
- **Learn page**: Article grid from Contentful
- **Product detail page**: Two-column layout, rich text rendering, slug-based routing

### Phase 3 — Checkout Flow (Completed)
- **Backend refactor**: Stripe code extracted from `functions/src/index.ts` into `functions/src/stripe.ts`, index.ts is now a clean re-export hub. Added `lineItems` metadata to PaymentIntent.
- **Cart service** (`src/app/core/cart.ts`):
  - Signals-based state with `items`, `totalItems`, `totalPrice`, `hasItems` computed signals
  - `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`, `getLineItemsSummary()`
  - Persisted to `localStorage` via `effect()`
- **Payment service** (`src/app/services/payment.service.ts`):
  - Typed interfaces (`PaymentIntentRequest`, `PaymentIntentResponse`)
  - Supports `lineItems` metadata
- **Cart indicator** (`src/app/components/cart-indicator/cart-indicator.ts`):
  - Shopping bag icon with animated badge count
  - Links to `/checkout`
  - Integrated into navbar (replaced static cart button)
- **Product detail "Add to Cart"**:
  - Quantity selector (± buttons)
  - "Add to Cart" CTA with animated "Added!" confirmation state
  - Trust signals below CTA
- **Checkout page** (`src/app/pages/checkout/`):
  - Multi-step flow: Review → Information → Payment → Confirmation
  - Visual step progress bar with active/completed states
  - Step 1: Cart review with inline quantity editing, item removal, line totals
  - Step 2: Customer info form (name, email) with inline validation
  - Step 3: Stripe Payment Element with trust badges
  - Step 4: Success animation (checkmark + confetti), confirmation message
  - Sticky order summary sidebar (collapses on mobile)
  - Error banner with slide-down animation
  - Responsive: two-column → single-column on mobile
- **UX conversion patterns**: Cart persistence, step progress, constant price transparency, trust signals, inline validation, celebration on success

## Current Change — Checkout Flow (Phase 3)

### Steps Completed
1. ✅ Extracted Stripe code into `functions/src/stripe.ts` with lineItems metadata
2. ✅ Slimmed `functions/src/index.ts` to re-export hub
3. ✅ Created `Cart` service with signals, localStorage persistence
4. ✅ Updated `PaymentService` with typed interfaces and lineItems
5. ✅ Created `CartIndicator` component with animated badge
6. ✅ Integrated cart indicator into navbar
7. ✅ Added "Add to Cart" flow to product detail page
8. ✅ Created multi-step `CheckoutComponent` with Stripe integration
9. ✅ Added `/checkout` route
10. ✅ Verified Angular build — 0 errors
11. ✅ Verified Firebase Functions build — 0 errors
