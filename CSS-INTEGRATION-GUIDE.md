# CSS Integration Guide - Candidates Consulting Management

## ✅ What Was Done

### 1. Global Stylesheet Created
- **Location**: `src/styles/global.css`
- **Size**: ~1,100 lines (comprehensive with comments)
- **Theme**: Deep Red (#C4123B) & Deep Blue (#0D3B66)
- **Approach**: Vanilla CSS with BEM-like naming conventions

### 2. Files Modified
- `src/index.js` - Updated to import only `global.css`
- Removed old CSS file imports (they were already deleted)

## 📁 CSS Architecture

The stylesheet is organized into 15 sections:

```
1. Design Tokens (CSS Variables)     - All colors, spacing, typography
2. Global Reset & Base Styles        - Normalize styles
3. Typography System                 - Headings, paragraphs
4. Layout System                     - App shell, containers, grid
5. Sidebar Navigation                - Fixed sidebar with brand blue
6. Topbar Navigation                 - Sticky header
7. Cards & Dashboard Widgets         - Stat tiles, card components
8. Form Components                   - Dark/light input variants
9. Buttons                           - Primary (blue), secondary (red)
10. Tables & Data Display            - Zebra striping, sticky headers
11. Charts & Visualizations          - Chart containers
12. Utility Classes                  - Spacing, display, text helpers
13. Responsive Breakpoints           - Mobile/tablet/desktop
14. Accessibility Features           - Focus, reduced motion
15. Animations & Transitions         - Loading spinners, fades
```

## 🎨 Design System Overview

### Color Palette
```css
--brand-red: #C4123B       /* Primary accent */
--brand-blue: #0D3B66      /* Primary brand */
--bg-primary: #F8F9FA      /* Page background */
--card-bg: #FFFFFF         /* Card background */
--input-bg: #0D3B66        /* Dark input (login forms) */
```

### Key Components Styled

#### ✅ Layout Components
- `.app-shell` - Main application wrapper
- `.sidebar` - Fixed sidebar with collapse functionality
- `.topbar` - Sticky top navigation bar
- `.content-wrapper` - Main content area with proper margins
- `.content-inner` - Inner content padding

#### ✅ Navigation
- `.sidebar` / `.sidebar-collapsed` - Responsive sidebar
- `.nav-item` / `.nav-item-active` - Navigation links with red active indicator
- `.sidebar-user` - User profile in sidebar
- `.topbar` - Header with page title and user actions

#### ✅ Cards & Widgets
- `.card` - Basic card component
- `.stat-tile` / `.stat-tile-red` - Dashboard KPI tiles (blue/red gradients)
- `.card-header` / `.card-body` / `.card-footer` - Card sections

#### ✅ Forms
- `.form-input-dark` - Dark blue inputs (for login/registration)
- `.form-input-light` - Light gray inputs (for data forms)
- `.form-grid` - Two-column responsive form layout
- `.form-label-required` - Labels with red asterisk
- `.form-error` - Error message styling

#### ✅ Buttons
- `.btn-primary` - Blue button
- `.btn-secondary` - Red button
- `.btn-outline` - Outline variant
- `.btn-muted` - Gray cancel button
- `.btn-success` / `.btn-danger` - Success/danger variants
- `.btn-sm` / `.btn-lg` - Size variants

#### ✅ Tables
- `.table-wrapper` - Scrollable table container
- `.table` - Full-width table with zebra striping
- `.table thead` - Sticky header
- `.pagination` - Pagination controls

## 🔧 Component Integration Guide

### Example: Login Page
```jsx
// LoginPage.js
<div className="auth-only">
  <div className="card" style={{ maxWidth: '400px' }}>
    <div className="card-body">
      <h2 className="mb-4">Login</h2>
      <form className="form">
        <div className="form-group">
          <label className="form-label form-label-required">Email</label>
          <input 
            type="email" 
            className="form-input form-input-dark" 
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label className="form-label form-label-required">Password</label>
          <input 
            type="password" 
            className="form-input form-input-dark" 
            placeholder="Enter password"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-full">
          Login
        </button>
      </form>
    </div>
  </div>
</div>
```

### Example: Dashboard with Stat Tiles
```jsx
// Dashboard.js
<div className="content-inner">
  <div className="grid grid-gap-lg mb-4">
    <div className="col-3">
      <div className="stat-tile">
        <div className="stat-tile-icon">👥</div>
        <div className="stat-tile-value">1,234</div>
        <div className="stat-tile-label">Total Candidates</div>
      </div>
    </div>
    <div className="col-3">
      <div className="stat-tile stat-tile-red">
        <div className="stat-tile-icon">💼</div>
        <div className="stat-tile-value">45</div>
        <div className="stat-tile-label">Open Positions</div>
      </div>
    </div>
  </div>
</div>
```

### Example: Data Form
```jsx
// CandidateForm.js
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Candidate Information</h3>
  </div>
  <div className="card-body">
    <form className="form">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label form-label-required">First Name</label>
          <input 
            type="text" 
            className="form-input form-input-light" 
            placeholder="Enter first name"
          />
        </div>
        <div className="form-group">
          <label className="form-label form-label-required">Last Name</label>
          <input 
            type="text" 
            className="form-input form-input-light" 
            placeholder="Enter last name"
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-muted">Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  </div>
</div>
```

### Example: Data Table
```jsx
// Candidates.js
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Candidates List</h3>
  </div>
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>john@example.com</td>
          <td><span className="badge badge-success">Active</span></td>
          <td>
            <div className="table-actions">
              <button className="btn btn-sm btn-primary">Edit</button>
              <button className="btn btn-sm btn-danger">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div className="pagination">
    <button className="pagination-item">Previous</button>
    <button className="pagination-item pagination-item-active">1</button>
    <button className="pagination-item">2</button>
    <button className="pagination-item">Next</button>
  </div>
</div>
```

## 📱 Responsive Behavior

### Mobile (≤600px)
- Sidebar transforms off-screen, opens with overlay
- Topbar adjusts to full width
- Grid becomes single column
- Form buttons stack vertically
- Table font size reduces

### Tablet (601-900px)
- Grid becomes 6 columns
- Forms collapse to single column
- Stat tiles reduce in size

### Desktop (>1200px)
- Full 12-column grid
- Sidebar at full width (260px)
- All features fully visible

## 🎯 Next Steps for Your Components

### 1. Update Existing Components

For each page component, update class names:

**Before:**
```jsx
<div className="dashboard-container">
  <div className="stats-grid">
    <div className="stat-card blue">
```

**After:**
```jsx
<div className="content-inner">
  <div className="grid grid-gap-lg">
    <div className="col-3">
      <div className="stat-tile">
```

### 2. Form Components Migration

**Login/Registration** (dark inputs):
```jsx
className="form-input form-input-dark"
```

**Data Entry Forms** (light inputs):
```jsx
className="form-input form-input-light"
```

### 3. Button Standardization

Replace all button classes with:
- `.btn-primary` - Main actions (blue)
- `.btn-secondary` - Secondary actions (red)
- `.btn-muted` - Cancel actions (gray)
- `.btn-outline` - Alternative style
- `.btn-success` / `.btn-danger` - Contextual actions

### 4. Card Wrapper Updates

Wrap content in cards:
```jsx
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Title</h3>
  </div>
  <div className="card-body">
    {/* content */}
  </div>
</div>
```

## 🔍 Testing Checklist

### Visual Testing
- [ ] Login page displays with dark blue inputs
- [ ] Dashboard shows stat tiles in blue/red alternating colors
- [ ] Sidebar shows brand blue background with red active indicators
- [ ] Topbar displays correctly with user profile
- [ ] Forms use appropriate input styling (dark vs light)
- [ ] Tables have zebra striping and sticky headers
- [ ] Buttons show correct colors and hover states
- [ ] Cards have proper shadows and spacing

### Responsive Testing
- [ ] Mobile: Sidebar slides in/out with overlay
- [ ] Mobile: Grid collapses to single column
- [ ] Mobile: Form buttons stack vertically
- [ ] Tablet: Layout adjusts appropriately
- [ ] Desktop: Full layout with all features

### Accessibility Testing
- [ ] Tab navigation highlights elements properly
- [ ] Color contrast meets AA standards
- [ ] Focus states are visible
- [ ] Screen reader text is present where needed

## 🚀 Spring Boot Integration

If serving from Spring Boot:

1. **Build React App:**
   ```bash
   npm run build
   ```

2. **Copy to Spring Boot static folder:**
   ```bash
   Copy-Item -Path .\build\static\css\* -Destination .\server\src\main\resources\static\css\ -Recurse -Force
   ```

3. **Serve from Spring Boot:**
   ```java
   // In application.properties
   spring.web.resources.static-locations=classpath:/static/
   ```

## 📊 CSS Statistics

- **Total Lines**: ~1,100 (including comments)
- **CSS Variables**: 50+ design tokens
- **Components**: 15+ major component families
- **Utility Classes**: 50+ helpers
- **Responsive Breakpoints**: 4 (mobile, tablet, laptop, desktop)
- **Browser Support**: Modern browsers (ES6+)

## 🎨 Customization

To customize the theme, edit CSS variables in `:root`:

```css
:root {
  --brand-red: #YOUR_RED_COLOR;
  --brand-blue: #YOUR_BLUE_COLOR;
  --space-md: YOUR_SPACING;
  /* etc. */
}
```

## 📝 Optional: Split into SCSS Files

If you prefer SCSS modular structure:

```
src/styles/
├── global.scss (main file)
├── _variables.scss
├── _reset.scss
├── _layout.scss
├── _sidebar.scss
├── _topbar.scss
├── _cards.scss
├── _forms.scss
├── _buttons.scss
├── _tables.scss
├── _utilities.scss
└── _responsive.scss
```

Import in `global.scss`:
```scss
@import 'variables';
@import 'reset';
@import 'layout';
// etc.
```

## 🐛 Troubleshooting

**Issue**: Sidebar not showing
- Check that `app-shell` class is on root div
- Verify sidebar component is rendered

**Issue**: Inputs not dark blue
- Use `form-input-dark` class for login pages
- Use `form-input-light` class for data forms

**Issue**: Layout broken on mobile
- Ensure viewport meta tag in `public/index.html`:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```

## 📞 Support

The CSS is fully self-contained with no framework dependencies. All classes follow BEM-like naming conventions for clarity and maintainability.

---

**Status**: ✅ Ready for integration
**Framework**: Vanilla CSS (no preprocessor required)
**Compatibility**: React 19.x, Modern Browsers
**File Size**: ~45KB uncompressed
