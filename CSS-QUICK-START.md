# 🚀 Quick Start Guide - Global CSS System

## ⚡ Getting Started (5 Minutes)

### Step 1: Import Global CSS

Your `src/index.css` should only have:

```css
@import './styles/global.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 2: Basic Page Structure

```jsx
function YourPage() {
  return (
    <div className="app-root">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="main-wrapper">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">Page Title</h1>
          </div>
        </header>
        
        {/* Content */}
        <main className="content">
          <div className="content-container">
            {/* Your content here */}
          </div>
        </main>
      </div>
    </div>
  );
}
```

---

## 📋 Component Quick Reference

### Buttons

```jsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-accent">Accent (Red)</button>
<button className="btn btn-cta">CTA (Blue)</button>
<button className="btn btn-outline">Outline</button>
<button className="btn btn-sm">Small</button>
<button className="btn btn-lg">Large</button>
```

### Cards

```jsx
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Title</h3>
  </div>
  <div className="card-body">Content</div>
</div>

{/* Stat Card */}
<div className="stat-card">
  <div className="stat-icon stat-icon-primary">📊</div>
  <div className="stat-info">
    <div className="stat-label">Label</div>
    <div className="stat-value">1,234</div>
  </div>
</div>
```

### Forms

```jsx
<div className="form-group">
  <label className="form-label">Label</label>
  <input type="text" className="form-input" placeholder="..." />
  <span className="form-help">Helper text</span>
</div>

<div className="form-group has-error">
  <label className="form-label">Email</label>
  <input type="email" className="form-input" />
  <span className="form-error">Error message</span>
</div>

<select className="form-select">
  <option>Select...</option>
</select>

<textarea className="form-textarea"></textarea>
```

### Tables

```jsx
<div className="table-container">
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Data 1</td>
          <td>Data 2</td>
          <td>
            <div className="table-actions">
              <button className="table-action-btn">✏️</button>
              <button className="table-action-btn">🗑️</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### Modals

```jsx
<div className="modal-backdrop">
  <div className="modal-dialog">
    <div className="modal-header modal-header-gradient">
      <h3 className="modal-title">Title</h3>
      <button className="modal-close">✕</button>
    </div>
    <div className="modal-body">Content</div>
    <div className="modal-footer">
      <button className="btn btn-outline">Cancel</button>
      <button className="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Badges

```jsx
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-danger">Rejected</span>
<span className="badge badge-status-hired">Hired</span>
```

---

## 🎨 Design Tokens Quick Reference

### Colors

```jsx
// Use in inline styles if needed (prefer CSS classes)
style={{ color: 'var(--color-primary)' }}
style={{ backgroundColor: 'var(--color-accent)' }}
```

### Spacing (4px grid)

| Class | Value |
|-------|-------|
| `gap-2` | 8px |
| `gap-3` | 12px |
| `gap-4` | 16px |
| `gap-5` | 20px |
| `gap-6` | 24px |
| `m-4` | margin: 16px |
| `p-4` | padding: 16px |
| `mb-4` | margin-bottom: 16px |

---

## 🔧 Common Layouts

### Dashboard Stats Grid

```jsx
<div className="grid grid-cols-4 gap-5">
  <div className="stat-card">...</div>
  <div className="stat-card">...</div>
  <div className="stat-card">...</div>
  <div className="stat-card">...</div>
</div>
```

### Form Grid (2 columns)

```jsx
<div className="form-grid form-grid-2">
  <div className="form-group">...</div>
  <div className="form-group">...</div>
</div>
```

### Page Header with Actions

```jsx
<div className="page-header">
  <h1 className="page-title">Page Title</h1>
  <p className="page-subtitle">Description</p>
  <div className="page-actions">
    <button className="btn btn-outline">Export</button>
    <button className="btn btn-primary">+ Add New</button>
  </div>
</div>
```

### Toolbar/Filters

```jsx
<div className="toolbar">
  <div className="toolbar-left">
    <input className="form-input" placeholder="Search..." />
  </div>
  <div className="toolbar-right">
    <button className="btn btn-cta">Search</button>
    <button className="btn btn-outline">Reset</button>
  </div>
</div>
```

---

## 🛠️ Utility Classes Cheat Sheet

### Flexbox

```jsx
className="flex items-center justify-between gap-4"
className="flex flex-col gap-3"
className="flex flex-wrap"
```

### Grid

```jsx
className="grid grid-cols-3 gap-4"
className="grid grid-cols-auto gap-5"
```

### Spacing

```jsx
className="mt-4 mb-6"      // Margin top & bottom
className="px-4 py-3"      // Padding horizontal & vertical
className="m-0"            // No margin
className="p-0"            // No padding
```

### Text

```jsx
className="text-center"
className="text-muted"
className="text-primary"
className="font-bold"
className="text-sm"
className="text-lg"
```

### Display

```jsx
className="block"
className="hidden"
className="flex"
```

### Width

```jsx
className="w-full"         // 100%
className="w-50"           // 50%
```

---

## 📱 Responsive Classes

Grid auto-adjusts:
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column

```jsx
// This is responsive by default
<div className="grid grid-cols-4 gap-4">
```

---

## ✅ Migration Checklist

### For Each Page:

- [ ] Remove old CSS import
- [ ] Wrap in `<div className="app-root">`
- [ ] Add `<Sidebar />` component
- [ ] Add `<div className="main-wrapper">`
- [ ] Add `<header className="topbar">`
- [ ] Add `<main className="content">`
- [ ] Replace old button classes with `.btn .btn-primary`
- [ ] Replace old form classes with `.form-group`, `.form-input`
- [ ] Replace old table classes with `.table`
- [ ] Replace old modal classes with `.modal-backdrop`
- [ ] Use spacing utilities instead of custom margins
- [ ] Test mobile responsiveness

---

## 🎯 Examples

### Before (Old)

```jsx
<div className="candidates-container">
  <div className="header-wrapper">
    <h1 className="heading-text">Candidates</h1>
    <button className="add-button primary-btn">Add</button>
  </div>
  <div className="filter-section">
    <input className="search-box" />
  </div>
  <div className="data-table-wrapper">
    <table className="candidates-table">
      ...
    </table>
  </div>
</div>
```

### After (New)

```jsx
<div className="content">
  <div className="content-container">
    <div className="page-header">
      <h1 className="page-title">Candidates</h1>
      <div className="page-actions">
        <button className="btn btn-primary">+ Add</button>
      </div>
    </div>
    
    <div className="toolbar">
      <div className="toolbar-left">
        <input className="form-input" placeholder="Search..." />
      </div>
    </div>
    
    <div className="table-container">
      <table className="table">
        ...
      </table>
    </div>
  </div>
</div>
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't Do This

```jsx
// Hard-coded values
<div style={{ padding: '15px', margin: '10px' }}>

// Custom classes for everything
<div className="my-custom-container">

// Mixing old and new
<div className="old-class new-class">
```

### ✅ Do This Instead

```jsx
// Use design tokens
<div className="p-4 m-3">

// Use global components
<div className="card">

// Use only new system
<div className="content-container">
```

---

## 💡 Pro Tips

1. **Use Browser DevTools**: Inspect elements to see which CSS variables are available
2. **Check the Documentation**: Refer to CSS-SYSTEM-DOCUMENTATION.md for detailed info
3. **Start Small**: Convert one page at a time
4. **Test Responsive**: Always check mobile view
5. **Use Consistent Spacing**: Stick to the 4px grid (space-1 through space-8)

---

## 📞 Need Help?

**Common Issues**:

| Issue | Solution |
|-------|----------|
| Styles not working | Check if `global.css` is imported in `index.css` |
| Sidebar not showing | Ensure `app-root` structure is correct |
| Modal not visible | Check z-index, add `modal-backdrop` class |
| Forms look weird | Use `.form-group` wrapper for each field |
| Table overflows | Wrap in `.table-container` and `.table-wrapper` |

**Reference Files**:
- Full docs: `CSS-SYSTEM-DOCUMENTATION.md`
- Variables: `src/styles/core/variables.css`
- Components: `src/styles/components/*.css`

---

**Ready to build? Start with the basic structure above and customize as needed!** 🚀
