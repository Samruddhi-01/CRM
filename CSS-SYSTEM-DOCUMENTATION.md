# 🎨 Global CSS System - Complete Documentation

## 📋 Overview

This document describes the **complete, professional global CSS system** built for the HR Management SaaS application. The system follows enterprise-grade design principles with a unified theme, consistent spacing, and scalable architecture.

---

## 🏗️ Architecture

### Folder Structure

```
src/styles/
├── global.css                 # Master import file
├── core/
│   ├── variables.css         # Design tokens & CSS variables
│   ├── reset.css             # Global reset & normalize
│   ├── base.css              # Base typography & elements
│   ├── layout.css            # App layout system
│   └── utilities.css         # Utility classes
├── components/
│   ├── sidebar.css           # Sidebar navigation
│   ├── card.css              # Card components
│   ├── button.css            # Button system
│   ├── form.css              # Form elements
│   ├── table.css             # Table components
│   ├── modal.css             # Modal dialogs
│   └── badge.css             # Badge & status tags
└── pages/
    ├── login.css             # Login page specific
    ├── dashboard.css         # Dashboard layout
    └── candidates.css        # Candidates page
```

### Import Order (Critical)

```css
/* src/index.css */
@import './styles/global.css';
```

The global.css handles all imports in the correct order.

---

## 🎨 Design System

### Brand Colors

```css
--color-primary: #0B2F6B      /* Dark Blue - Main brand */
--color-accent: #D20B2B       /* Red - Highlight/Active */
--color-cta: #1F8BFF          /* Bright Blue - CTAs */
--color-surface: #FFFFFF      /* White - Cards/Surfaces */
--color-bg: #F2F5F9           /* Light Background */
```

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | #0B2F6B | Sidebar, headers, primary actions |
| `--color-primary-light` | #1a4d8f | Gradients, hover states |
| `--color-primary-dark` | #082351 | Active states |
| `--color-accent` | #D20B2B | Active menu items, danger actions |
| `--color-cta` | #1F8BFF | Call-to-action buttons, links |
| `--color-success` | #10B981 | Success states |
| `--color-warning` | #F59E0B | Warning states |
| `--color-danger` | #EF4444 | Error states, delete |
| `--color-info` | #3B82F6 | Info states |

### Spacing Scale (4px Grid)

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
```

**Usage**: Use spacing tokens consistently. Never hard-code values.

```css
/* ✅ Good */
padding: var(--space-4);
margin-bottom: var(--space-5);

/* ❌ Bad */
padding: 15px;
margin-bottom: 22px;
```

### Typography

**Font Family**:
- Primary: `Inter` (fallback: System UI)
- Headings: `Poppins`

**Font Sizes**:

| Token | Size | Usage |
|-------|------|-------|
| `--fz-xs` | 12px | Badges, captions |
| `--fz-sm` | 13px | Helper text, labels |
| `--fz-base` | 15px | Body text |
| `--fz-md` | 16px | Inputs, buttons |
| `--fz-lg` | 18px | Card titles, h3 |
| `--fz-xl` | 20px | Topbar title |
| `--fz-2xl` | 22px | h2 |
| `--fz-3xl` | 28px | h1, page titles |

**Font Weights**:
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Border Radius

```css
--radius-sm: 6px    /* Small elements */
--radius-md: 10px   /* Default */
--radius-lg: 14px   /* Cards, modals */
--radius-xl: 18px   /* Large containers */
--radius-full: 9999px /* Pills, circles */
```

### Shadows

```css
--shadow-xs: 0 1px 2px rgba(0,0,0,0.05)
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08)   /* Cards */
--shadow-md: 0 6px 18px rgba(0,0,0,0.12)  /* Hover states */
--shadow-lg: 0 10px 30px rgba(0,0,0,0.15) /* Modals */
--shadow-xl: 0 20px 50px rgba(0,0,0,0.2)  /* Important dialogs */
```

### Transitions

```css
--transition-fast: 0.15s ease
--transition-base: 0.25s ease
--transition-slow: 0.3s ease
```

---

## 📐 Layout System

### App Structure

```html
<div class="app-root">
  <!-- Sidebar (fixed left) -->
  <aside class="sidebar">...</aside>
  
  <!-- Main content area -->
  <div class="main-wrapper">
    <!-- Top navigation bar -->
    <header class="topbar">...</header>
    
    <!-- Page content -->
    <main class="content">
      <div class="content-container">
        <!-- Your page content -->
      </div>
    </main>
  </div>
</div>
```

### Sidebar

**Dimensions**:
- Expanded: `260px` width
- Collapsed: `72px` width
- Height: `100vh` (fixed)

**Features**:
- Dark blue background (`--color-primary`)
- Red accent for active items (`--color-accent`)
- Smooth transition (0.3s)
- Auto-collapse on mobile
- Tooltips in collapsed mode

**Classes**:
```css
.sidebar                /* Main sidebar */
.sidebar.collapsed      /* Collapsed state */
.sidebar.mobile-open    /* Mobile open state */
.nav-link               /* Navigation item */
.nav-link.active        /* Active item (red border) */
```

**Example**:

```html
<aside class="sidebar">
  <div class="sidebar-header">
    <div class="sidebar-logo">
      <span class="sidebar-logo-icon">🏢</span>
      <span class="sidebar-logo-text">HR Portal</span>
    </div>
    <button class="sidebar-toggle">☰</button>
  </div>
  
  <nav class="sidebar-nav">
    <div class="nav-item">
      <a href="#" class="nav-link active">
        <span class="nav-icon">📊</span>
        <span class="nav-text">Dashboard</span>
      </a>
    </div>
    <!-- More nav items -->
  </nav>
</aside>
```

### Topbar

**Dimensions**:
- Height: `64px`
- Background: White
- Border bottom: 1px
- Sticky positioning

**Classes**:
```css
.topbar              /* Main topbar */
.topbar-left         /* Left section */
.topbar-right        /* Right section */
.topbar-title        /* Page title */
```

### Content Area

```css
.content                /* Main content wrapper */
.content-container      /* Max-width container (1400px) */
.page-header            /* Page header section */
.page-title             /* h1 page title */
.page-subtitle          /* Subtitle/description */
.page-actions           /* Action buttons row */
```

---

## 🧩 Components

### 1. Cards

**Basic Card**:

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
    <div class="card-actions">
      <button class="btn-icon">⋮</button>
    </div>
  </div>
  <div class="card-body">
    Content goes here
  </div>
  <div class="card-footer">
    Footer content
  </div>
</div>
```

**Variants**:
- `.card-primary` - Blue left border
- `.card-accent` - Red left border
- `.card-success` - Green left border
- `.card-gradient-header` - Gradient header

**Stat Card**:

```html
<div class="stat-card">
  <div class="stat-icon stat-icon-primary">📊</div>
  <div class="stat-info">
    <div class="stat-label">Total Candidates</div>
    <div class="stat-value">1,234</div>
    <div class="stat-change stat-change-positive">+12%</div>
  </div>
</div>
```

### 2. Buttons

**Classes**:

| Class | Usage |
|-------|-------|
| `.btn` | Base button |
| `.btn-primary` | Dark blue gradient |
| `.btn-accent` | Red gradient |
| `.btn-cta` | Bright blue gradient |
| `.btn-success` | Green |
| `.btn-danger` | Red |
| `.btn-outline` | Bordered, transparent |
| `.btn-ghost` | No border |
| `.btn-icon` | Icon only |
| `.btn-sm` | Small size |
| `.btn-lg` | Large size |

**Examples**:

```html
<button class="btn btn-primary">Save</button>
<button class="btn btn-accent">Delete</button>
<button class="btn btn-outline">Cancel</button>
<button class="btn btn-icon">⋮</button>
```

### 3. Forms

**Form Structure**:

```html
<form class="form">
  <div class="form-group">
    <label class="form-label">Name</label>
    <input type="text" class="form-input" placeholder="Enter name">
    <span class="form-help">Helper text</span>
  </div>
  
  <div class="form-group has-error">
    <label class="form-label">Email</label>
    <input type="email" class="form-input">
    <span class="form-error">Invalid email</span>
  </div>
  
  <div class="form-group">
    <label class="form-label">Country</label>
    <select class="form-select">
      <option>Select...</option>
    </select>
  </div>
  
  <div class="form-group">
    <label class="form-label">Message</label>
    <textarea class="form-textarea"></textarea>
  </div>
</form>
```

**Form Grid**:

```html
<div class="form-grid form-grid-2">
  <div class="form-group">...</div>
  <div class="form-group">...</div>
</div>

<div class="form-grid form-grid-4">
  <!-- 4 columns -->
</div>
```

**Input States**:
- `.form-input` - Default
- `.form-input:hover` - Hover
- `.form-input:focus` - 2px blue border
- `.has-error .form-input` - Red border

### 4. Tables

**Table Structure**:

```html
<div class="table-container">
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th class="table-cell-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>john@example.com</td>
          <td><span class="badge badge-success">Active</span></td>
          <td class="table-cell-right">
            <div class="table-actions">
              <button class="table-action-btn table-action-btn-primary">✏️</button>
              <button class="table-action-btn table-action-btn-danger">🗑️</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <div class="table-footer">
    <div class="table-footer-info">Showing 1-10 of 100</div>
    <div>Pagination...</div>
  </div>
</div>
```

**Variants**:
- `.table-striped` - Alternating rows
- `.table-compact` - Smaller padding

### 5. Modals

**Modal Structure**:

```html
<div class="modal-backdrop">
  <div class="modal-dialog">
    <div class="modal-header modal-header-gradient">
      <h3 class="modal-title">Modal Title</h3>
      <button class="modal-close">✕</button>
    </div>
    
    <div class="modal-body">
      Modal content
    </div>
    
    <div class="modal-footer">
      <button class="btn btn-outline">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

**Sizes**:
- `.modal-dialog-sm` - 480px
- `.modal-dialog` - 720px (default)
- `.modal-dialog-lg` - 960px
- `.modal-dialog-xl` - 1200px
- `.modal-dialog-fullscreen` - Full viewport

### 6. Badges

**Status Badges**:

```html
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Rejected</span>
<span class="badge badge-info">In Review</span>

<!-- Soft variants -->
<span class="badge badge-success-soft">Active</span>
<span class="badge badge-primary-soft">Primary</span>
```

**Candidate Status Badges**:

```html
<span class="badge badge-status-interested">Interested</span>
<span class="badge badge-status-pending">Pending</span>
<span class="badge badge-status-not-interested">Not Interested</span>
<span class="badge badge-status-hired">Hired</span>
```

**Shapes**:
- `.badge` - Default rounded
- `.badge-pill` - Fully rounded
- `.badge-square` - Square corners

---

## 🛠️ Utility Classes

### Spacing

```html
<!-- Margin -->
<div class="m-4">Margin all sides</div>
<div class="mt-4">Margin top</div>
<div class="mb-4">Margin bottom</div>
<div class="ml-4">Margin left</div>
<div class="mr-4">Margin right</div>
<div class="mx-4">Margin horizontal</div>
<div class="my-4">Margin vertical</div>

<!-- Padding (same pattern) -->
<div class="p-4">Padding all sides</div>
<div class="px-4">Padding horizontal</div>
```

### Flexbox

```html
<div class="flex items-center justify-between gap-4">
  <div>Left</div>
  <div>Right</div>
</div>

<div class="flex flex-col gap-3">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**Flex Classes**:
- `.flex` - Display flex
- `.flex-col` - Column direction
- `.items-center` - Align center
- `.items-start` - Align start
- `.items-end` - Align end
- `.justify-between` - Space between
- `.justify-center` - Center
- `.gap-1` to `.gap-6` - Gap spacing

### Grid

```html
<div class="grid grid-cols-3 gap-4">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>

<div class="grid grid-cols-auto gap-5">
  <!-- Auto-fit grid -->
</div>
```

### Width/Height

```html
<div class="w-full">Full width</div>
<div class="w-50">50% width</div>
<div class="h-full">Full height</div>
```

### Text

```html
<div class="text-center">Centered</div>
<div class="text-muted">Muted text</div>
<div class="text-primary">Primary color</div>
<div class="font-bold">Bold text</div>
<div class="text-sm">Small text</div>
<div class="text-uppercase">UPPERCASE</div>
```

### Display

```html
<div class="hidden">Hidden</div>
<div class="block">Block</div>
<div class="inline-block">Inline block</div>
```

### Shadows & Borders

```html
<div class="shadow-sm">Small shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="rounded">Rounded corners</div>
<div class="rounded-full">Fully rounded</div>
<div class="border">With border</div>
```

---

## 📱 Responsive Design

### Breakpoints

```css
@media (max-width: 1200px)  /* Large tablets */
@media (max-width: 1024px)  /* Tablets */
@media (max-width: 768px)   /* Mobile */
```

### Responsive Behavior

**Sidebar**:
- Desktop: Fixed 260px width
- Tablet: Overlay drawer
- Mobile: Full-width drawer with backdrop

**Grid Layouts**:
- 4 cols → 2 cols (1024px)
- 2 cols → 1 col (768px)

**Tables**:
- Horizontal scroll on mobile
- Min-width to prevent crushing

**Forms**:
- Multi-column → Single column on mobile

---

## 🎯 Usage Examples

### Dashboard Page

```html
<div class="app-root">
  <aside class="sidebar">...</aside>
  
  <div class="main-wrapper">
    <header class="topbar">
      <div class="topbar-left">
        <h1 class="topbar-title">Dashboard</h1>
      </div>
    </header>
    
    <main class="content">
      <div class="content-container">
        <!-- Stats Grid -->
        <div class="dashboard-stats">
          <div class="stat-card">...</div>
          <div class="stat-card">...</div>
          <div class="stat-card">...</div>
          <div class="stat-card">...</div>
        </div>
        
        <!-- Charts -->
        <div class="dashboard-charts">
          <div class="chart-container">...</div>
          <div class="chart-container">...</div>
        </div>
      </div>
    </main>
  </div>
</div>
```

### Candidates List Page

```html
<main class="content">
  <div class="content-container">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Candidates</h1>
      <p class="page-subtitle">Manage all candidates</p>
      <div class="page-actions">
        <button class="btn btn-primary">+ Add Candidate</button>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="candidate-filters">
      <div class="filter-row">
        <div class="form-search">
          <input class="form-input" placeholder="Search...">
        </div>
        <select class="form-select">
          <option>Status</option>
        </select>
        <button class="btn btn-cta">Search</button>
        <button class="btn btn-outline">Reset</button>
      </div>
    </div>
    
    <!-- Table -->
    <div class="table-container">
      <table class="table">...</table>
    </div>
  </div>
</main>
```

### Login Page

```html
<div class="login-page">
  <div class="login-container">
    <!-- Left: Logo -->
    <div class="login-left">
      <div class="login-logo-wrapper">
        <img src="logo.png" class="login-logo">
        <h1 class="login-brand-name">HR Portal</h1>
        <p class="login-tagline">Modern HR Management</p>
      </div>
    </div>
    
    <!-- Right: Form (Red Panel) -->
    <div class="login-right">
      <div class="login-form-header">
        <h2 class="login-form-title">Welcome Back</h2>
        <p class="login-form-subtitle">Sign in to continue</p>
      </div>
      
      <form class="login-form">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input">
        </div>
        <button class="btn btn-primary w-full">Sign In</button>
      </form>
      
      <div class="login-footer">
        Don't have an account? <a href="#">Sign up</a>
      </div>
    </div>
  </div>
</div>
```

---

## ✅ Best Practices

### 1. Always Use Design Tokens

```css
/* ✅ Good */
color: var(--color-primary);
padding: var(--space-4);
border-radius: var(--radius-md);

/* ❌ Bad */
color: #0B2F6B;
padding: 16px;
border-radius: 10px;
```

### 2. Use Utility Classes

```html
<!-- ✅ Good -->
<div class="flex items-center gap-4 mb-5">

<!-- ❌ Bad -->
<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
```

### 3. Semantic Class Names

```html
<!-- ✅ Good -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
  </div>
</div>

<!-- ❌ Bad -->
<div class="container-1">
  <div class="top-section">
    <h3 class="heading-text">Title</h3>
  </div>
</div>
```

### 4. Consistent Spacing

Use the 4px grid system:
- Small gaps: `gap-2` (8px)
- Default gaps: `gap-4` (16px)
- Large gaps: `gap-6` (24px)

### 5. Mobile-First Approach

```css
/* Mobile first */
.stats-grid {
  grid-template-columns: 1fr;
}

/* Then tablet */
@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Then desktop */
@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 🚀 Migration Guide

### Removing Old CSS

1. **Delete old component CSS files**:
```bash
rm src/Component/*.css
```

2. **Update imports in index.css**:
```css
/* Remove old imports */
/* Add new global import */
@import './styles/global.css';
```

3. **Update component className**:

**Before**:
```jsx
<div className="candidates-container">
  <div className="header-section">
    <h1 className="page-heading">Candidates</h1>
  </div>
</div>
```

**After**:
```jsx
<div className="content">
  <div className="content-container">
    <div className="page-header">
      <h1 className="page-title">Candidates</h1>
    </div>
  </div>
</div>
```

### Common Replacements

| Old | New |
|-----|-----|
| `.candidates-table` | `.table` |
| `.custom-button` | `.btn .btn-primary` |
| `.modal-wrapper` | `.modal-backdrop` |
| `.status-badge` | `.badge badge-success` |
| `.form-field` | `.form-group` |
| `.input-box` | `.form-input` |

---

## 📊 Component Checklist

Use this for all pages:

- [ ] Uses `.app-root` structure
- [ ] Includes `.sidebar` with navigation
- [ ] Has `.topbar` with page title
- [ ] Content wrapped in `.content` and `.content-container`
- [ ] Page header uses `.page-header`, `.page-title`
- [ ] Cards use `.card` component
- [ ] Buttons use `.btn` variants
- [ ] Forms use `.form-group`, `.form-input`
- [ ] Tables use `.table-container`, `.table`
- [ ] Modals use `.modal-backdrop`, `.modal-dialog`
- [ ] Status badges use `.badge` with variants
- [ ] Spacing uses utility classes (`.mb-4`, `.gap-3`)
- [ ] No inline styles
- [ ] No hard-coded colors/spacing
- [ ] Mobile responsive

---

## 🎨 Theme Customization

To customize the theme, edit `src/styles/core/variables.css`:

```css
:root {
  /* Change primary color */
  --color-primary: #0B2F6B;  /* Change this */
  
  /* Change accent color */
  --color-accent: #D20B2B;   /* Change this */
  
  /* Change spacing scale */
  --space-4: 16px;           /* Adjust as needed */
}
```

All components will automatically update!

---

## 🐛 Troubleshooting

### Issue: Styles not applying

**Solution**: Check import order in `global.css`. Variables must load first.

### Issue: Sidebar not collapsing

**Solution**: Ensure JavaScript is toggling `.sidebar.collapsed` class.

### Issue: Modal not showing

**Solution**: Check z-index. Modal should have `z-index: var(--z-modal)`.

### Issue: Forms look broken

**Solution**: Ensure parent has `.form` class and inputs have `.form-input`.

---

## 📝 Summary

This global CSS system provides:

✅ **Unified Design** - Same look across all pages
✅ **Professional Quality** - Enterprise-grade UI components
✅ **Scalable Architecture** - Easy to extend and maintain
✅ **Responsive by Default** - Mobile-first approach
✅ **Design Tokens** - Consistent colors, spacing, typography
✅ **Zero Duplication** - DRY principles
✅ **Accessibility** - Focus states, ARIA-friendly
✅ **Performance** - Optimized CSS, no bloat

**Next Steps**:
1. Apply layout structure to all pages
2. Replace old component classes with new system
3. Test responsive behavior
4. Verify accessibility
5. Remove old CSS files

---

**Created**: November 2025
**Version**: 1.0.0
**Maintained by**: Development Team
