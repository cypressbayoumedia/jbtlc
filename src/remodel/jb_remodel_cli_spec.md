# Website Remodel Specification: J&B's Tropical Leaf Corner

## 1. Project Overview
This document serves as the structural and design instruction set for generating the remodeled website for J&B's Tropical Leaf Corner. The site should reflect a natural, elevated, and rooted luxury wellness tea brand inspired by the tropics and nurtured in the bayou. It is critical that the digital storefront clearly communicates our core product offering: premium botanical teas derived from leaves, distinguishing our focus entirely from fruit sales.

## 2. Technical Stack
- **Framework:** Angular v21
- **Styling:** CSS (utilizing the provided brand palette variables)
- **Architecture:** Standalone components (Angular v21 modern best practices, web serach if needed)

## 3. Brand Kit & Aesthetics
### 3.1. Color Palette
Implement global CSS variables for the core brand colors:
- `--color-olive`: `#8A8C43` (Primary accents, top banner background)
- `--color-gold`: `#E6BF53` (Buttons, highlights, luxury accents)
- `--color-cream`: `#FFFBED` (Main background, navbar background)
- `--color-tan`: `#DCCAA6` (Secondary backgrounds, paper textures)
- `--color-black`: `#030000` (Primary text, dark overlays)

### 3.2. Typography
- **Headings (Primary):** `The Seasons` (Used for Hero text, H1, H2, elegant callouts)
- **Body (Secondary):** `Open Sans` (Used for navigation, paragraphs, UI elements)

### 3.3. Assets
- **Logos:** All primary, submark, and alternate logos are located in the `remodel/` directory. Use the primary horizontal logo for the main desktop navigation.

## 4. Layout & UI Requirements
### 4.1. Top Announcement Bar
- **Background:** `--color-olive`
- **Text:** "FROM THE TROPICS TO THE BAYOU." (Centered, flanked by subtle botanical leaf icons).

### 4.2. Main Navigation (Header)
- **Background:** `--color-cream`
- **Logo:** Display the primary logo from `remodel/` on the far left.
- **Links (Center):** HOME, OUR STORY, SHOP, TEA COLLECTIONS, LEARN, CONTACT.
- **Icons (Far Right):** Search, User Profile, Shopping Cart.

### 4.3. Hero Section (Home Page)
- **Background:** Full-width lush tropical foliage imagery with a dark overlay to ensure text contrast.
- **Typography:** 
  - Main Headline (The Seasons, White/Cream): "LUXURY WELLNESS TEAS ROOTED IN LOUISIANA."
  - Subheadline (Open Sans, White/Cream): "HONORING TRADITIONS. NURTURING WELLNESS. BRINGING THE TROPICS TO THE BAYOU."
- **Call-to-Action (CTA):** 
  - Button Text: "SHOP TEA COLLECTIONS"
  - Button Style: Solid `--color-gold` background, `--color-black` text, minimal border radius.

## 5. Component Generation Commands
Antigravity CLI should execute the following scaffolding steps:
1. edit  Angular v21  using modern naming conventions and angular best practices.
2. Configure `styles.scss` with the provided CSS variables, `@font-face` or Google Fonts imports for *The Seasons* and *Open Sans*.
3. Scaffold `AnnouncementBar` and `Navbar`.
4. Scaffold `HeroComponent` implementing the dark-overlay image layout.
5. Setup the core routing module mapped to: `/`, `/our-story`, `/shop`, `/tea-collections`, `/learn`, `/contact`.


## 6. Our Story 

Welcome to J&B's Tropical Leaf Corner LLC. Our premium Tropical Blend is lovingly handcrafted in small batches right from our own family orchard. Every single Soursop, Mango, and Pineapple Guava leaf is carefully hand-picked at peak freshness, gently air-dried, and hand-packed to preserve its natural, vibrant properties. From our backyard to your teacup, enjoy a pure, authentic taste of the tropics.