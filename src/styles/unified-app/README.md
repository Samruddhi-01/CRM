# Unified App UI System

A comprehensive, professional CSS system for the entire application shell including sidebar, header, filters, and tables.

## 📦 Package Contents

```
unified-app/
├── design-tokens.css      # CSS variables and design tokens
├── app-shell.css         # Sidebar, header, and main layout
├── app-filters.css       # Filter cards and form controls
├── app-tables.css        # Data tables with responsive stacking
├── app-responsive.css    # Media queries and breakpoints
├── README.md            # This file
└── example-overrides.css # Theme customization examples
```

## 🚀 Quick Start

### 1. Import CSS Files

Add these imports to your main CSS/SCSS file **in this order**:

```css
/* In your main.css or App.css */
@import './unified-app/design-tokens.css';
@import './unified-app/app-shell.css';
@import './unified-app/app-filters.css';
@import './unified-app/app-tables.css';
@import './unified-app/app-responsive.css';
```

Or import in your main JavaScript file:

```javascript
// In index.js or App.js
import './styles/unified-app/design-tokens.css';
import './styles/unified-app/app-shell.css';
import './styles/unified-app/app-filters.css';
import './styles/unified-app/app-tables.css';
import './styles/unified-app/app-responsive.css';
```

### 2. Wrap Your App

Wrap your entire application with the `.app-ui` class:

```jsx
<div className="app-ui">
  <div className="app-shell">
    {/* Sidebar */}
    <aside className="app-sidebar">
      {/* Sidebar content */}
    </aside>
    
    {/* Header */}
    <header className="page-header">
      <h1 className="page-header-title">Candidates</h1>
      <div className="page-header-actions">
        <button className="btn-primary-cta">Add New Candidate</button>
      </div>
    </header>
    
    {/* Main Content */}
    <main className="app-content">
      <div className="content-inner">
        {/* Your page content */}
      </div>
    </main>
  </div>
</div>
```

## 📐 Layout Structure

### App Shell

The main layout uses CSS Grid with sidebar and content areas:

```html
<div className="app-ui">
  <div className="app-shell">
    <!-- Grid areas: sidebar, header, content -->
  </div>
</div>
```

### Sidebar States

#### Expanded (Default)
```html
<div className="app-ui">
  <aside className="app-sidebar">
    <!-- Width: 260px -->
  </aside>
</div>
```

#### Collapsed
```html
<div className="app-ui sidebar-collapsed">
  <aside className="app-sidebar">
    <!-- Width: 72px -->
  </aside>
</div>
```

#### Mobile Drawer
```html
<div className="app-ui drawer-open">
  <div className="sidebar-backdrop"></div>
  <aside className="app-sidebar">
    <!-- Slides in from left -->
  </aside>
</div>
```

### Toggle Sidebar (JavaScript)

```javascript
// Toggle sidebar collapsed state
function toggleSidebar() {
  document.querySelector('.app-ui').classList.toggle('sidebar-collapsed');
}

// Toggle mobile drawer
function toggleDrawer() {
  document.querySelector('.app-ui').classList.toggle('drawer-open');
}

// Close drawer when clicking backdrop
document.querySelector('.sidebar-backdrop')?.addEventListener('click', () => {
  document.querySelector('.app-ui').classList.remove('drawer-open');
});
```

## 🎨 Components

### 1. Sidebar Navigation

```html
<aside className="app-sidebar">
  <div className="sidebar-header">
    <img src="/logo.svg" alt="Logo" className="sidebar-logo" />
    <span className="sidebar-brand">Startica</span>
  </div>
  
  <nav className="sidebar-nav">
    <a href="/dashboard" className="sidebar-nav-item active" data-tooltip="Dashboard">
      <span className="sidebar-nav-icon">
        <svg><!-- icon --></svg>
      </span>
      <span className="sidebar-nav-label">Dashboard</span>
    </a>
    
    <a href="/candidates" className="sidebar-nav-item" data-tooltip="Candidates">
      <span className="sidebar-nav-icon">
        <svg><!-- icon --></svg>
      </span>
      <span className="sidebar-nav-label">Candidates</span>
    </a>
  </nav>
  
  <button className="sidebar-toggle" onclick="toggleSidebar()">
    <svg><!-- toggle icon --></svg>
  </button>
</aside>
```

**Important**: Add `data-tooltip` attribute for collapsed state tooltips.

### 2. Page Header

```html
<header className="page-header">
  <h1 className="page-header-title">Candidates</h1>
  <div className="page-header-actions">
    <button className="btn-primary-cta">
      <svg><!-- plus icon --></svg>
      Add New Candidate
    </button>
  </div>
</header>
```

### 3. Filter Card

```html
<div className="filter-card">
  <div className="filter-grid">
    <!-- 4 columns on desktop, 2 on tablet, 1 on mobile -->
    
    <div className="form-group col-1">
      <label className="form-label">Search</label>
      <div className="search-input-wrapper">
        <svg className="search-input-icon"><!-- search icon --></svg>
        <input type="text" className="form-input" placeholder="Name, email, phone...">
      </div>
    </div>
    
    <div className="form-group col-1">
      <label className="form-label">Status</label>
      <select className="form-select">
        <option>All Status</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
    </div>
    
    <div className="form-group col-1">
      <label className="form-label">Sort By</label>
      <select className="form-select">
        <option>Date Added</option>
        <option>Name</option>
      </select>
    </div>
    
    <div className="form-group col-1">
      <label className="form-label">Order</label>
      <select className="form-select">
        <option>Newest First</option>
        <option>Oldest First</option>
      </select>
    </div>
  </div>
  
  <div className="filter-actions">
    <button className="btn btn-secondary">Clear</button>
    <button className="btn btn-accent">Search</button>
  </div>
</div>
```

#### Column Utilities

- `.col-1` - Spans 1 column (25% on desktop)
- `.col-2` - Spans 2 columns (50% on desktop)
- `.col-3` - Spans 3 columns (75% on desktop)
- `.col-4` - Spans 4 columns (100% on desktop)

### 4. Data Table

```html
<div className="table-card">
  <div className="table-header">
    <h2 className="table-title">Candidates List</h2>
    <div className="table-actions">
      <button className="btn btn-secondary">Export CSV</button>
    </div>
  </div>
  
  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
          <th className="text-center">Applications</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>john@example.com</td>
          <td>+1 234 567 890</td>
          <td><span className="status-badge active">Active</span></td>
          <td className="text-center">5</td>
          <td>
            <div className="table-actions-cell">
              <button className="table-action-btn">
                <svg><!-- edit icon --></svg>
              </button>
              <button className="table-action-btn danger">
                <svg><!-- delete icon --></svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <div className="table-pagination">
    <div className="pagination-info">
      Showing <strong>1-10</strong> of <strong>47</strong> entries
    </div>
    <div className="pagination-controls">
      <button className="pagination-btn" disabled>Previous</button>
      <button className="pagination-btn active">1</button>
      <button className="pagination-btn">2</button>
      <button className="pagination-btn">3</button>
      <span className="pagination-ellipsis">...</span>
      <button className="pagination-btn">5</button>
      <button className="pagination-btn">Next</button>
    </div>
  </div>
</div>
```

#### Status Badges

```html
<span className="status-badge active">Active</span>
<span className="status-badge inactive">Inactive</span>
<span className="status-badge pending">Pending</span>
<span className="status-badge success">Success</span>
<span className="status-badge warning">Warning</span>
<span className="status-badge danger">Danger</span>
<span className="status-badge info">Info</span>
```

#### Empty State

```html
<div className="table-card">
  <div className="table-empty">
    <svg className="table-empty-icon"><!-- empty icon --></svg>
    <h3 className="table-empty-title">No Candidates Found</h3>
    <p className="table-empty-text">Get started by adding your first candidate</p>
    <div className="table-empty-action">
      <button className="btn btn-accent">Add New Candidate</button>
    </div>
  </div>
</div>
```

### 5. Responsive Table (Mobile Stacking)

Add `.table-responsive-stack` class to enable mobile card stacking:

```html
<div className="table-card table-responsive-stack">
  <!-- Regular table for desktop -->
  <div className="table-wrapper">
    <table className="data-table">
      <!-- table content -->
    </table>
  </div>
  
  <!-- Mobile cards (hidden on desktop) -->
  <div className="table-mobile-cards">
    <div className="table-mobile-card">
      <div className="table-mobile-row">
        <span className="table-mobile-label">Name</span>
        <span className="table-mobile-value">John Doe</span>
      </div>
      <div className="table-mobile-row">
        <span className="table-mobile-label">Email</span>
        <span className="table-mobile-value">john@example.com</span>
      </div>
      <div className="table-mobile-row">
        <span className="table-mobile-label">Status</span>
        <span className="table-mobile-value">
          <span className="status-badge active">Active</span>
        </span>
      </div>
      <div className="table-mobile-actions">
        <button className="btn btn-sm btn-secondary">Edit</button>
        <button className="btn btn-sm btn-danger">Delete</button>
      </div>
    </div>
  </div>
</div>
```

## 🎨 Design Tokens

All design tokens are CSS variables in `:root`. You can override them:

```css
:root {
  /* Colors */
  --app-primary-gradient-start: #123669;
  --app-primary-gradient-end: #1A4A8A;
  --app-accent: #2F80ED;
  --app-surface: #FFFFFF;
  
  /* Spacing */
  --app-space-xs: 6px;
  --app-space-sm: 10px;
  --app-space-md: 16px;
  --app-space-lg: 24px;
  --app-space-xl: 32px;
  
  /* Typography */
  --app-font-family: 'Inter', system-ui, sans-serif;
  --app-font-h1: 28px;
  --app-font-button: 16px;
  
  /* Layout */
  --app-sidebar-width: 260px;
  --app-sidebar-collapsed-width: 72px;
  
  /* Shadows */
  --app-shadow-soft: 0 6px 18px rgba(6, 30, 69, 0.08);
  --app-shadow-focus: 0 0 0 3px rgba(47, 128, 237, 0.25);
}
```

## 📱 Breakpoints

The system uses these breakpoints:

| Name | Range | Behavior |
|------|-------|----------|
| **Desktop XL** | >= 1400px | 4-column filters, full sidebar |
| **Desktop** | 1200-1399px | 4-column filters, full sidebar |
| **Laptop** | 1024-1199px | 2-column filters, collapsed sidebar |
| **Tablet** | 768-1023px | 2-column filters, drawer sidebar |
| **Mobile** | <= 767px | 1-column filters, drawer sidebar, stacked tables |
| **Small** | <= 400px | Compact spacing, smaller fonts |

## 🔧 JavaScript Integration

### Update Sidebar Width Dynamically

```javascript
// Toggle collapsed state
function toggleSidebar() {
  const appUi = document.querySelector('.app-ui');
  appUi.classList.toggle('sidebar-collapsed');
  
  // Optional: Save state to localStorage
  localStorage.setItem(
    'sidebarCollapsed',
    appUi.classList.contains('sidebar-collapsed')
  );
}

// Restore state on page load
window.addEventListener('DOMContentLoaded', () => {
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (isCollapsed) {
    document.querySelector('.app-ui').classList.add('sidebar-collapsed');
  }
});
```

### Mobile Drawer

```javascript
// Open drawer
function openDrawer() {
  document.querySelector('.app-ui').classList.add('drawer-open');
  document.body.style.overflow = 'hidden'; // Prevent body scroll
}

// Close drawer
function closeDrawer() {
  document.querySelector('.app-ui').classList.remove('drawer-open');
  document.body.style.overflow = '';
}

// Toggle drawer
function toggleDrawer() {
  const appUi = document.querySelector('.app-ui');
  if (appUi.classList.contains('drawer-open')) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

// Close on backdrop click
document.querySelector('.sidebar-backdrop')?.addEventListener('click', closeDrawer);

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.querySelector('.app-ui.drawer-open')) {
    closeDrawer();
  }
});
```

### React Integration

```jsx
import { useState, useEffect } from 'react';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  useEffect(() => {
    // Restore sidebar state
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved) setSidebarCollapsed(saved === 'true');
  }, []);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('sidebarCollapsed', newState);
      return newState;
    });
  };
  
  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };
  
  return (
    <div className={`app-ui ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${drawerOpen ? 'drawer-open' : ''}`}>
      <div className="app-shell">
        {drawerOpen && <div className="sidebar-backdrop" onClick={() => setDrawerOpen(false)} />}
        
        <aside className="app-sidebar">
          {/* Sidebar content */}
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            Toggle
          </button>
        </aside>
        
        <header className="page-header">
          {/* Header content */}
        </header>
        
        <main className="app-content">
          {/* Main content */}
        </main>
      </div>
    </div>
  );
}
```

## 🎨 Customization

### Override Tokens

Create a custom theme file:

```css
/* custom-theme.css */
:root {
  /* Brand colors */
  --app-primary-gradient-start: #6B46C1;
  --app-primary-gradient-end: #8B5CF6;
  --app-accent: #A78BFA;
  
  /* Custom spacing */
  --app-space-md: 20px;
  --app-space-lg: 28px;
  
  /* Custom fonts */
  --app-font-family: 'Poppins', sans-serif;
}
```

Import after design-tokens.css:

```css
@import './unified-app/design-tokens.css';
@import './custom-theme.css'; /* Override tokens */
@import './unified-app/app-shell.css';
/* ... rest of imports */
```

### Component-Specific Overrides

```css
/* Override specific components */
.app-ui .page-header {
  background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%);
}

.app-ui .data-table thead {
  background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%);
}

.app-ui .btn-accent {
  background: #A78BFA;
}
```

## ♿ Accessibility

This system follows WCAG 2.1 AA standards:

### Color Contrast
- All text meets minimum 4.5:1 contrast ratio
- Interactive elements have clear focus states
- Status badges use both color and text

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus rings are visible (using `--app-shadow-focus`)
- Skip links supported (add your own)

### Screen Readers
- Use semantic HTML (`<nav>`, `<header>`, `<main>`, `<table>`)
- Add ARIA labels where needed:

```html
<button className="sidebar-toggle" aria-label="Toggle sidebar">
  <svg aria-hidden="true"><!-- icon --></svg>
</button>

<button className="table-action-btn" aria-label="Edit candidate">
  <svg aria-hidden="true"><!-- icon --></svg>
</button>
```

### Touch Targets
- Minimum 40x40px on mobile (44px recommended)
- Buttons: 48px desktop, 44px tablet, 40px mobile
- Table action buttons: 40x40px

## 🧪 Testing Checklist

- [ ] Visual consistency across all pages
- [ ] Sidebar expands/collapses smoothly
- [ ] Mobile drawer opens/closes correctly
- [ ] Filter card responsive at all breakpoints
- [ ] Tables display correctly on desktop
- [ ] Tables stack to cards on mobile (if using `.table-responsive-stack`)
- [ ] Pagination works on all screen sizes
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets are 40x40px minimum on mobile
- [ ] Print styles work correctly

## 🐛 Troubleshooting

### Sidebar not collapsing

**Issue**: Sidebar doesn't change width when adding `.sidebar-collapsed`

**Solution**: Ensure you're adding the class to `.app-ui`, not `.app-sidebar`:

```javascript
// ❌ Wrong
document.querySelector('.app-sidebar').classList.add('sidebar-collapsed');

// ✅ Correct
document.querySelector('.app-ui').classList.add('sidebar-collapsed');
```

### Content not shifting with sidebar

**Issue**: Main content doesn't adjust when sidebar collapses

**Solution**: CSS Grid is handling this automatically. Check that your HTML structure matches:

```html
<div className="app-ui">
  <div className="app-shell">  <!-- Grid container -->
    <aside className="app-sidebar"></aside>
    <header className="page-header"></header>
    <main className="app-content"></main>
  </div>
</div>
```

### Mobile drawer not showing

**Issue**: Drawer doesn't appear on mobile

**Solution**: 
1. Add `.drawer-open` class to `.app-ui`
2. Ensure `.sidebar-backdrop` exists in DOM
3. Check z-index conflicts

### Table not stacking on mobile

**Issue**: Table stays as table on mobile instead of cards

**Solution**: Add `.table-responsive-stack` class:

```html
<div className="table-card table-responsive-stack">
  <!-- Add mobile cards structure -->
</div>
```

### Filters not responsive

**Issue**: Filter grid doesn't change columns

**Solution**: Use `.filter-grid` class and column utilities:

```html
<div className="filter-grid">
  <div className="form-group col-1">...</div>
  <div className="form-group col-1">...</div>
</div>
```

## 📄 License

This CSS system is part of the Startica application.

## 🤝 Contributing

When adding new components:
1. Follow existing naming conventions
2. Use design tokens (CSS variables)
3. Add responsive behavior
4. Test keyboard navigation
5. Check color contrast
6. Update this README

## 📞 Support

For questions or issues with the unified app system, please contact the development team or create an issue in the project repository.

---

**Version**: 1.0.0  
**Last Updated**: December 11, 2025  
**Author**: Startica Development Team
