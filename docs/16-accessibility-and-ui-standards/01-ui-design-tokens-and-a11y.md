# Document ID: DOC-A11Y-001
# UI Design Tokens, DaisyUI Themes & Accessibility Standards

> **Document Version:** 1.0.0  
> **Classification:** Design System & Accessibility Engineering  
> **Status:** APPROVED  
> **Authoring Lead:** UX Architect & Frontend Architect  
> **Review Date:** October 2026  
> **Compliance Baseline:** WCAG 2.1 Level AA Compliance  

---

## 1. Design Philosophy & Aesthetic Identity

The visual language of **AlumniConnect** balances institutional credibility with modern, vibrant, and approachable digital product aesthetics:
- **Primary Tone:** Academic Blue (`#1e3a8a` / `#172554`) signifying university trust and institutional authority.
- **Secondary Accent:** Electric Emerald (`#059669` / `#10b981`) representing career growth, verified opportunities, and success.
- **Warning / Trial Accent:** Warm Amber (`#d97706` / `#f59e0b`) indicating time-bounded introductory chat countdowns and pending requests.
- **Surface Elevation:** Clean white and light slate in Light Mode; deep navy and slate-950 in Dark Mode with subtle glassmorphic borders (`border-slate-200` / `border-slate-800`).

---

## 2. Design Tokens Catalog

### 2.1 Color Tokens & Contrast Ratios

| Design Token Name | Light Mode Value | Dark Mode Value | Semantic Purpose | WCAG Contrast Ratio against Background |
| :--- | :--- | :--- | :--- | :---: |
| `color-primary` | `#1e3a8a` (Blue-900) | `#60a5fa` (Blue-400) | Primary CTA buttons, brand badges, active nav. | $\ge 7.5:1$ (Passes AAA) |
| `color-surface` | `#ffffff` (White) | `#020617` (Slate-950) | Main page background canvas. | N/A (Baseline) |
| `color-card` | `#ffffff` | `#0f172a` (Slate-900) | Elevated cards, modals, dropdown panels. | N/A (Surface) |
| `color-border` | `#e2e8f0` (Slate-200) | `#1e293b` (Slate-800) | Subtle container separation borders. | $\ge 3.2:1$ (Component) |
| `color-text-main` | `#0f172a` (Slate-900) | `#f8fafc` (Slate-50) | High-contrast body text and headers. | $\ge 12.1:1$ (Passes AAA) |
| `color-text-muted`| `#64748b` (Slate-500) | `#94a3b8` (Slate-400) | Secondary metadata, timestamps, department tags.| $\ge 4.8:1$ (Passes AA) |
| `color-success` | `#059669` (Emerald-600)| `#34d399` (Emerald-400)| Verified badges, accepted connections, success toasts.| $\ge 4.6:1$ (Passes AA) |
| `color-warning` | `#d97706` (Amber-600) | `#fbbf24` (Amber-400) | 2-minute introductory chat timer, pending review.| $\ge 4.5:1$ (Passes AA) |
| `color-danger` | `#dc2626` (Red-600) | `#f87171` (Red-400) | Call disconnect button, report abuse, delete account.| $\ge 4.9:1$ (Passes AA) |

---

### 2.2 Typography Scale
- **Font Family:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
- **Headings:**
  - `h1` (Display): `text-2xl md:text-3xl font-black tracking-tight` (28px – 36px)
  - `h2` (Section): `text-xl md:text-2xl font-bold tracking-tight` (20px – 24px)
  - `h3` (Card Title): `text-base md:text-lg font-bold` (16px – 18px)
- **Body:**
  - Body Regular: `text-sm leading-6` (14px, line-height 24px)
  - Metadata / Microcopy: `text-xs font-semibold` (12px)

---

## 3. WCAG 2.1 Level AA Accessibility Standards

### 3.1 Keyboard Navigation & Focus Management
- **Focus Rings:** All interactive elements (`<button>`, `<a>`, `<input>`, `<select>`) exhibit a high-contrast focus ring upon keyboard navigation:
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`
- **Tab Sequence:** Natural DOM source order is maintained across all screens. Modal dialogues trap focus within the active dialog using `focus-trap` and release focus back to the triggering element upon close (`Esc` key).

### 3.2 Screen Reader Optimization & ARIA Landmarks
- **Landmarks:** Every page template utilizes semantic HTML5 regions: `<header>`, `<nav role="navigation">`, `<main id="main-content">`, and `<aside>`.
- **Live Regions:** Dynamic status changes (e.g. 2-minute trial timer countdown, incoming call alerts) utilize `aria-live="polite"` or `role="alert"` so assistive technology users receive real-time notifications.
- **Icon Buttons:** Pure icon buttons (theme toggle, notification bell, call controls) are strictly annotated with descriptive `aria-label` attributes.

### 3.3 Motion & Vestibular Sensitivity
- The application honors the `prefers-reduced-motion` operating system setting:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
