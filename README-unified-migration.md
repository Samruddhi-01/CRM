# Unified UI Migration Guide

> **Version:** 1.0.0  
> **Last Updated:** December 12, 2025  
> **Status:** Active Migration

## Overview

This document provides a complete guide for migrating pages to the **Unified App UI System**, ensuring consistent design across all pages while maintaining visual parity with the canonical **Candidates** and **Job Openings** pages.

---

## Table of Contents

1. [Unified CSS Architecture](#unified-css-architecture)
2. [Design Tokens](#design-tokens)
3. [Class Mappings](#class-mappings)
4. [Migration Steps](#migration-steps)
5. [Page Migration Status](#page-migration-status)
6. [Compatibility Layer](#compatibility-layer)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Unified CSS Architecture

The unified system consists of **5 core CSS files** located in `src/styles/unified-app/`:

```
unified-app/
├── design-tokens.css       # CSS variables (colors, spacing, typography)
├── app-shell.css           # Layout (sidebar, header, content grid)
├── app-filters.css         # Search/filter cards and form controls
├── app-tables.css          # Data tables, pagination, status badges
├── app-responsive.css      # Responsive breakpoints and media queries
└── unified-ui-compat.css   # Legacy class mappings (temporary)
```

### Import Order (Critical)

```css
/* In your component JS file */
import '../styles/unified-app/design-tokens.css';
import '../styles/unified-app/app-shell.css';
import '../styles/unified-app/app-filters.css';
import '../styles/unified-app/app-tables.css';
import '../styles/unified-app/app-responsive.css';
import '../styles/unified-app/unified-ui-compat.css'; /* Only during migration */
```

---

## Design Tokens

### Core Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--app-primary-gradient-start` | `#123669` | Primary brand gradient start |
| `--app-primary-gradient-end` | `#1A4A8A` | Primary brand gradient end |
| `--app-navy` | `#0F2B57` | Dark navy for buttons |
| `--app-accent` | `#2F80ED` | Accent blue for actions |
| `--app-surface` | `#FFFFFF` | Card/panel background |
| `--app-muted-border` | `#E6EEF7` | Border color |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--app-space-xs` | `6px` | Tight spacing |
| `--app-space-sm` | `10px` | Small spacing |
| `--app-space-md` | `16px` | Default spacing |
| `--app-space-lg` | `24px` | Large spacing |
| `--app-space-xl` | `32px` | Extra large |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--app-font-h1` | `28px` | Page titles |
| `--app-font-h2` | `24px` | Section headers |
| `--app-font-label` | `14px` | Labels |
| `--app-font-table` | `14px` | Table text |
| `--app-font-caption` | `13px` | Small text |

---

## Class Mappings

### Page Headers

**Legacy → Unified**

| Old Class | New Class | Notes |
|-----------|-----------|-------|
| `.candidate-header` | `.page-header` | Dark blue gradient header |
| `.openings-header` | `.page-header` | Same unified header |
| `.hr-management-header` | `.page-header` | Use `.page-header` |

**Example:**

```jsx
// BEFORE
<div className="candidate-header">
  <h1>Candidates</h1>
</div>

// AFTER
<div className="page-header">
  <div className="page-header-title">
    <h1>Candidates</h1>
  </div>
</div>
```

### Filter Cards

**Legacy → Unified**

| Old Class | New Class | Notes |
|-----------|-----------|-------|
| `.candidate-filter-card` | `.filter-card` | White card container |
| `.openings-filters-card` | `.filter-card` | Same unified filter |
| `.candidate-filter-form` | `.filter-grid` | Grid layout for inputs |

**Example:**

```jsx
// BEFORE
<div className="candidate-filter-card">
  <div className="candidate-filter-form">
    <input className="candidate-filter-input" />
  </div>
</div>

// AFTER
<div className="filter-card">
  <div className="filter-grid">
    <input className="form-input" />
  </div>
</div>
```

### Tables

**Legacy → Unified**

| Old Class | New Class | Notes |
|-----------|-----------|-------|
| `.candidate-table` | `.data-table` | Enterprise table |
| `.openings-table` | `.data-table` | Same unified table |
| `.candidates-table-card` | `.table-card` | Card container |
| `.candidate-table-wrapper` | `.table-wrapper` | Scrollable wrapper |

**Example:**

```jsx
// BEFORE
<div className="candidates-table-card">
  <div className="candidate-table-wrapper">
    <table className="candidate-table">
      <thead>...</thead>
      <tbody>...</tbody>
    </table>
  </div>
</div>

// AFTER
<div className="table-card">
  <div className="table-wrapper">
    <table className="data-table">
      <thead>...</thead>
      <tbody>...</tbody>
    </table>
  </div>
</div>
```

### Form Inputs

**Legacy → Unified**

| Old Class | New Class | Notes |
|-----------|-----------|-------|
| `.candidate-filter-input` | `.form-input` | Text inputs |
| `.candidate-filter-select` | `.form-select` | Dropdowns |
| `.openings-search-input` | `.form-input` | Search fields |

### Buttons

**Legacy → Unified**

| Old Class | New Class | Notes |
|-----------|-----------|-------|
| `.candidate-filter-btn-primary` | `.btn-primary` | Primary action |
| `.openings-search-btn` | `.btn-accent` | Search/filter button |
| `.candidate-filter-btn-secondary` | `.btn-secondary` | Secondary action |
| `.btn-primary-cta` | `.btn-primary-cta` | Already unified ✓ |

### Status Badges

**Legacy → Unified**

| Old Class | New Class | Notes |
|-----------|-----------|-------|
| `.opening-status-badge.status-active` | `.status-badge.active` | Green badge |
| `.opening-status-badge.status-closed` | `.status-badge.danger` | Red badge |
| `.app-status-badge` | `.status-badge` | Generic badge |

---

## Migration Steps

### Step 1: Add Unified CSS Imports

Update your component imports:

```javascript
// src/Component/YourPage.js

// Remove old page-specific CSS
// import '../styles/pages/your-page.css'; // REMOVE

// Add unified system (in order)
import '../styles/unified-app/design-tokens.css';
import '../styles/unified-app/app-shell.css';
import '../styles/unified-app/app-filters.css';
import '../styles/unified-app/app-tables.css';
import '../styles/unified-app/app-responsive.css';
```

### Step 2: Add .app-ui Root Class

Wrap your page content with `.app-ui`:

```jsx
// BEFORE
<div className="your-page-container">
  {/* content */}
</div>

// AFTER
<div className="main-wrapper">
  <main className="content">
    <div className="app-ui your-page-name">
      {/* content */}
    </div>
  </main>
</div>
```

### Step 3: Replace Legacy Classes

Use the [Class Mappings](#class-mappings) table to replace old classes with unified equivalents.

### Step 4: Test Responsively

Test at all breakpoints:
- **Desktop XL:** ≥ 1400px
- **Desktop:** 1200px - 1399px
- **Laptop:** 1024px - 1199px
- **Tablet:** 768px - 1023px
- **Mobile:** ≤ 767px
- **Small:** ≤ 400px

### Step 5: Remove Legacy CSS

Once verified, remove old page-specific CSS files and the compatibility layer import.

---

## Page Migration Status

| Page | Status | Unified Classes | Visual Parity | Notes |
|------|--------|----------------|---------------|-------|
| **Candidates** | ✅ Complete | Yes | ✓ Canonical | Source of truth |
| **Job Openings** | ✅ Complete | Yes | ✓ Canonical | Source of truth |
| **History** | ✅ Complete | Yes | ✓ Verified | Uses `.app-ui` wrapper |
| **HR Management** | ✅ Complete | Yes | ✓ Verified | Migrated to unified |
| **Analytics** | 🔄 In Progress | Partial | - | Needs filter migration |
| **Admin Reports** | 🔄 In Progress | Partial | - | Needs table migration |
| **Candidate Form** | ⏳ Pending | No | - | Planned |
| **Opening Form** | ⏳ Pending | No | - | Planned |

**Legend:**
- ✅ Complete
- 🔄 In Progress
- ⏳ Pending

---

## Compatibility Layer

The `unified-ui-compat.css` file provides temporary backward compatibility for legacy class names.

### When to Use

- **During gradual migration:** Keep existing HTML/JSX unchanged
- **Emergency hotfix:** Quick visual fixes without refactoring
- **Testing:** Verify unified system before full migration

### How It Works

```css
/* Maps old classes to unified tokens */
.candidate-filter-input {
  padding: 8px 12px;
  border: 1px solid var(--app-muted-border);
  border-radius: var(--app-radius-sm);
  /* Uses unified design tokens */
}
```

### Removal Plan

Once all pages are migrated:
1. Remove `import '../styles/unified-app/unified-ui-compat.css';`
2. Delete `unified-ui-compat.css` file
3. Archive legacy page CSS files

---

## Testing Checklist

### Visual Testing

- [ ] **Header:** Dark blue gradient, white text, proper padding
- [ ] **Filters:** White card, proper input heights (42px desktop, 40px mobile)
- [ ] **Tables:** 
  - [ ] Dark blue sticky header
  - [ ] Zebra striping (white/light blue)
  - [ ] Hover effect (blue highlight)
  - [ ] Scrollbar styling
- [ ] **Buttons:** Proper hover states, shadows, transitions
- [ ] **Status Badges:** Correct colors (green/red/yellow/blue)
- [ ] **Pagination:** Buttons align center, proper spacing

### Responsive Testing

**Desktop (≥1200px)**
- [ ] 4-column filter grid
- [ ] Full table visible
- [ ] Sidebar expanded by default

**Tablet (768px-1023px)**
- [ ] 2-column filter grid
- [ ] Horizontal table scroll
- [ ] Sidebar collapsed by default

**Mobile (≤767px)**
- [ ] 1-column filter grid
- [ ] Table cards (stacked)
- [ ] Sidebar drawer
- [ ] Full-width buttons

### Functional Testing

- [ ] Form inputs accept values
- [ ] Dropdowns open/close
- [ ] Search filters data
- [ ] Pagination changes pages
- [ ] Sort columns (if applicable)
- [ ] Action buttons trigger correct handlers
- [ ] Modals open/close
- [ ] No console errors

### Accessibility Testing

- [ ] Focus outlines visible (blue ring)
- [ ] Keyboard navigation works
- [ ] `aria-current` on active pagination
- [ ] High contrast mode supported
- [ ] Screen reader labels present
- [ ] Color contrast ≥ 4.5:1

### Browser Testing

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Troubleshooting

### Issue: Header not showing gradient

**Cause:** Missing `.page-header` class or incorrect import order

**Solution:**
```jsx
// Ensure import order
import '../styles/unified-app/design-tokens.css';
import '../styles/unified-app/app-shell.css';

// Use correct class
<div className="page-header">
  ...
</div>
```

### Issue: Table columns too narrow

**Cause:** Missing `table-layout: auto` or min-width constraints

**Solution:**
```css
/* In unified-table.css, ensure: */
.data-table {
  table-layout: auto; /* Not fixed */
}

.data-table th:nth-child(1) {
  min-width: 150px; /* Add min-widths as needed */
}
```

### Issue: Horizontal scrollbar on page

**Cause:** Content exceeding viewport width

**Solution:**
```css
/* Ensure proper containment */
.app-ui {
  overflow-x: hidden;
  max-width: 100%;
}

.main-wrapper .content .app-ui {
  max-width: 100%;
  padding: 0;
}
```

### Issue: Filter grid not responsive

**Cause:** Missing responsive breakpoints

**Solution:**
```css
/* Ensure app-responsive.css is imported */
@media (max-width: 767px) {
  .filter-grid {
    grid-template-columns: 1fr; /* Single column */
  }
}
```

### Issue: Sidebar overlapping content

**Cause:** Incorrect wrapper structure

**Solution:**
```jsx
// Use proper structure
<div className="main-wrapper">
  <main className="content">
    <div className="app-ui">
      {/* Your content */}
    </div>
  </main>
</div>
```

---

## Migration Examples

### Example 1: Simple Page (History)

**Before:**
```jsx
<div className="history-page">
  <div className="history-header">
    <h1>History</h1>
  </div>
  <div className="history-table">
    ...
  </div>
</div>
```

**After:**
```jsx
<div className="main-wrapper">
  <main className="content">
    <div className="app-ui">
      <div className="page-header">
        <div className="page-header-title">
          <h1>History</h1>
        </div>
      </div>
      <div className="table-card">
        <div className="table-wrapper">
          <table className="data-table">
            ...
          </table>
        </div>
      </div>
    </div>
  </main>
</div>
```

### Example 2: Complex Page (Candidates)

**Before:**
```jsx
<div className="candidates-page">
  <div className="candidate-header">...</div>
  <div className="candidate-filter-card">
    <div className="candidate-filter-form">
      <input className="candidate-filter-input" />
      <button className="candidate-filter-btn-primary">Search</button>
    </div>
  </div>
  <div className="candidates-table-card">...</div>
</div>
```

**After:**
```jsx
<div className="main-wrapper">
  <main className="content">
    <div className="app-ui candidates-page">
      <div className="page-header">...</div>
      <div className="filter-card">
        <div className="filter-grid">
          <input className="form-input" />
          <button className="btn-primary">Search</button>
        </div>
      </div>
      <div className="table-card">...</div>
    </div>
  </main>
</div>
```

---

## Additional Resources

- **Design Tokens Reference:** See `design-tokens.css` for complete variable list
- **Component Examples:** Check `Candidates.js` and `Openings.js` for canonical implementations
- **Accessibility Guide:** See `unified-ui.js` for keyboard navigation enhancements

---

## Support

For questions or issues during migration:
1. Check this README first
2. Review canonical pages (Candidates, Job Openings)
3. Inspect `unified-ui-compat.css` for legacy mappings
4. Test at all responsive breakpoints

---

**Last Updated:** December 12, 2025  
**Maintained By:** Development Team  
**Status:** Active - Migration in Progress
