# The Rooted Soul — Poetry Collection Landing Page

A premium, fully responsive React & TypeScript landing page celebrating **"The Rooted Soul"**, a poetry and reflection collection by **Alan McDonald**. 

This landing page leads visitors through a reflective narrative journey, matching the layout structure of the book itself. The project was initially structured using absolute coordinates and has been refactored into a modern, fluid, and highly interactive experience.

---

## 📖 About the Book
> *"We often define ourselves by our struggles—but forget the strength it took to overcome them."*

*The Rooted Soul* is an intimate, powerful collection of poems and reflections exploring mental struggle, healing, and the inner strength it takes to rise again. The website organizes this narrative through a series of sections:
- **Hero Intro**: Cover mockup and primary purchase/sampling paths.
- **The Quote**: Core philosophy and inspiration.
- **Five Phases**: Chronological milestones representing *The Descent*, *The Echoes*, *The Turning Point*, *The Ascent*, and *The Awakening*.
- **Author Bio**: Background on Alan McDonald's creative process.
- **Reviews**: Testimonials and reader evaluations.
- **Buy CTA**: Standard links to order the book (redirecting to an Amazon search fallback).
- **Newsletter**: Subscription form for updates on new poems and reflections.

---

## 🛠️ Tech Stack & Architecture
- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: Vanilla CSS Modules (maintaining scoped layouts and local visual variables)
- **Icons**: Inline SVGs (avoiding extra heavy icon package dependencies)

---

## ✨ Key Features & Responsive Refactoring

### 1. Fluid & Centered Layouts
- Replaced rigid Figma/Locofy exports (`1905px` fixed widths, absolute positioning offsets, and hardcoded `5483px` overall heights) with a fully responsive layout.
- Container elements dynamically adjust their width, bounds, and padding across all device viewports (desktop, tablet, and mobile).

### 2. Five-Phases Grid
- Refactored Card containers from nested layout groupings to direct flex siblings.
- Designed a responsive CSS grid that aligns phases chronological-order side-by-side (`I`, `II`, `III`, `IV`, `V`) on desktop, wrapping to 2 columns on tablet, and stacking into a single column on mobile.
- Removed outdated connector dividers to ensure a clean wrapping flow.

### 3. Animated Scroll Indicator
- Repositioned the scroll indicator ("Scroll v") to the bottom-center of the hero section.
- Added a smooth, continuous bounce micro-animation (`@keyframes bounce`) to prompt scrolling.
- Bound clicking the indicator to scroll down smoothly to the quote section.
- Hidden on small mobile screens to keep layout focus clean.

### 4. Interactive Elements & Hover Physics
- Relocated pointer click events from nested text containers directly to parent `<button>` tags, expanding active clicking surfaces.
- Implemented premium, springy cubic-bezier transitions (`transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)`) for buttons, navigation hooks, and social links to lift and scale on hover.
- Styled social media link containers into circular buttons featuring backdrop borders and hover glow fills.

### 5. Semantic Elements & SEO Optimization
- Configured newsletter subscription fields in a semantic `<form>` block to handle submission events.
- Updated `index.html` with an optimized page title and detailed meta description.
- Integrated direct SVG hyperlinks to Alan's Facebook and Instagram profiles.
- Set the copyright year to 2026.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (minimum version 20 recommended).

### 1. Install Dependencies
Navigate to the project root directory in your terminal and run:
```bash
npm install
```

### 2. Start the Development Server
Launch the Vite development server locally:
```bash
npm start
```
*The website will be available to preview in your browser at `http://localhost:5173`.*

### 3. Compile and Build
Validate typing and generate a production-ready static build bundle:
```bash
npm run build
```

---

## 📂 Directory Layout
```
├── public/                 # Static assets (mockups, SVGs, etc.)
├── src/
│   ├── components/         # Section components (Nav, Hero, Phases, Reviews, Footer, etc.)
│   │   ├── Nav.tsx & Nav.module.css
│   │   ├── Footer.tsx & Footer.module.css
│   │   └── ...
│   ├── pages/              # Main page container (WDefault.tsx & WDefault.module.css)
│   ├── global.css          # Design variables, typography imports, and utility styles
│   ├── index.tsx           # Entry point rendering the React App
│   └── vite-env.d.ts
├── index.html              # HTML shell & SEO meta configuration
├── tsconfig.json           # TS compiling configurations
└── package.json            # Scripts and dependencies setup
```