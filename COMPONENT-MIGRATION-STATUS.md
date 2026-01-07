# Global CSS System - Component Migration Guide

## ✅ Completed Migrations

### 1. Dashboard.js ✓
**Status**: COMPLETE  
**Changes Applied**:
- Replaced `.dashboard-layout` → `.app-root`
- Replaced `.dashboard-content` → `.main-wrapper` + `.content` + `.content-container`
- Replaced `.metrics-grid` → `.dashboard-stats-grid`
- Replaced `<Card className="metric-card">` → `.stat-card` direct div
- Replaced `.charts-grid` → `.dashboard-charts-grid`
- Replaced `<Card title="">` → `.card` with `.card-header-gradient` and `.card-body`
- Removed import of Dashboard.css

### 2. LoginPage.js
**Status**: READY (LoginPage-NEW.js created)  
**To Apply**: Run `Move-Item`  
**Changes**:
- Uses global `.login-container`, `.login-left`, `.login-right` from `pages/login.css`
- Applied `.login-form-panel`, `.login-form-input` classes
- Removed all inline styles
- Removed import of LoginPage.css

---

## 📋 Remaining Migrations

### 3. Candidates.js (History.js)
**CSS Classes to Update**:

**Old** → **New**:
```javascript
// Layout
.app-container → .app-root
.main-content → .main-wrapper > .content > .content-container

// Cards
<Card className="filters-card"> → <div className="card">
  <div className="card-body">

// Forms
.filters-form → .candidate-filters (keep from candidates.css)
.search-input → .form-input
.filter-select → .form-select

// Buttons
<Button variant="primary"> → Keep (using common/Button component)

// Table
.candidates-table → .table
.table-container → .table-container (keep)
.action-buttons → .table-actions
.edit-btn → .table-action-btn
.delete-btn → .table-action-btn
.view-btn → .btn btn-cta (or table-action-btn)

// Status
.status-select → .form-select (with inline status colors)

// Pagination
.pagination → .pagination (keep - matches global)

// Modal
.modal-overlay → .modal-backdrop
.modal-content → .modal-dialog
.modal-header → .modal-header
.modal-close → .modal-close
.modal-body → .modal-body
.details-container → .candidate-detail-modal (keep from candidates.css)
```

**Files to Remove**:
- Remove `import './History.css'` (doesn't exist - already using component CSS)

### 4. Openings.js
**CSS Classes to Update**:

```javascript
// Layout
.main-content → .main-wrapper > .content > .content-container
.openings-container → (remove - use content-container)
.openings-header → .page-header

// Buttons
.btn-primary → .btn .btn-primary
.btn-search → .btn .btn-cta
.btn-cancel → .btn .btn-outline
.btn-submit → .btn .btn-primary

// Search/Filters
.search-filters → .toolbar
.search-row → .toolbar-left (or custom grid)
.search-input → .form-input
.filter-select → .form-select

// Table
.openings-table-container → .table-container
.openings-table → .table
.btn-action → .table-action-btn
.actions → .table-actions

// Badges
.bg-green-100 .text-green-800 → .badge .badge-success
.bg-red-100 .text-red-800 → .badge .badge-danger
.bg-yellow-100 → .badge .badge-warning

// Modal
.modal-overlay → .modal-backdrop
.modal → .modal-dialog
.modal-header → .modal-header
.modal-close → .modal-close
.form-group → .form-group (keep)
.form-select → .form-select (keep)
.form-textarea → .form-textarea (keep)
.modal-actions → .modal-footer

// Applications Table
.applications-table-container → .table-container
.applications-table → .table
```

**Files to Remove**:
- Remove `import './Openings.css'` (if exists)

### 5. HRManagement.js
**CSS Classes to Update**:

```javascript
// Layout
.app-container → .app-root
.main-content → .main-wrapper > .content > .content-container

// Card
<Card title="..."> → <div className="card">
  <div className="card-header card-header-gradient">
    <h3 className="card-title">...</h3>
  </div>
  <div className="card-body">

// Table
.hr-table → .table
.table-container → .table-container (keep)
.hr-name → .font-medium (or keep if specific styling needed)
.candidate-count-btn → .btn .btn-sm .btn-outline
.action-buttons → .table-actions
.edit-btn → .table-action-btn
.deactivate-btn → .table-action-btn

// Modal
.modal-overlay → .modal-backdrop
.modal-content → .modal-dialog
.modal-header → .modal-header
.modal-close → .modal-close
.modal-form → (remove - use default form structure)
.modal-footer → .modal-footer
.error-message → .form-error

// Form
.form-group → .form-group (keep)
input.error → .form-input.has-error

// Candidates Modal
.modal-large → .modal-dialog .modal-lg
.candidates-modal-body → .modal-body
.candidates-table-container → .table-container
.candidates-table → .table
```

**Files to Remove**:
- Remove `import './HRManagement.css'` (if exists)

### 6. CandidateForm.js
**CSS Classes to Update**:

```javascript
// Layout
.dashboard-layout → .app-root
.dashboard-content → .main-wrapper > .content > .content-container

// Card
<Card> → <div className="card">
  <div className="card-header">
    <h2 className="card-title">...</h2>
  </div>
  <div className="card-body">

// Form
.form-header → .card-header (part of card)
.search-section → .toolbar or flex items-center gap-3
.search-input → .form-input
.form-row → .form-grid .form-grid-4 (4 columns)
.form-group → .form-group (keep)
input → .form-input
select → .form-select
textarea → .form-textarea

// Buttons
<Button variant="primary"> → .btn .btn-primary (or keep Button component)
<Button variant="outline"> → .btn .btn-outline
.form-buttons → .modal-footer or .flex .justify-end .gap-3
```

**Files to Remove**:
- Remove `import './CandidateForm.css'` (if exists)

### 7. OpeningForm.js
**CSS Classes to Update**:

```javascript
// Layout - ADD Sidebar and main structure
// Currently missing layout wrapper - add:
<div className="app-root">
  <Sidebar />
  <MobileMenuButton />
  <div className="main-wrapper">
    <main className="content">
      <div className="content-container">

// Card
<Card> → <div className="card">
  <div className="card-header">
    <h2 className="card-title">...</h2>
  </div>
  <div className="card-body">

// Form
.form-header → .card-header
.opening-form → (remove - use default)
.form-row → .form-grid .form-grid-4
.form-group → .form-group (keep)
input → .form-input
select → .form-select
textarea → .form-textarea
.error → .has-error
.error-text → .form-error

// Buttons
.btn-cancel → .btn .btn-outline
.btn-submit → .btn .btn-primary
.form-buttons → .modal-footer or .flex .justify-end .gap-3
```

**Files to Remove**:
- Remove `import './OpeningForm.css'` (if exists)

### 8. RegistrationForm.js
**CSS Classes to Update**:

```javascript
// Layout - Use login page structure
.registration-container → .login-container
.registration-left → .login-left
.registration-right → .login-right
.registration-form-wrapper → .login-form-panel

// Form
.registration-form-title → .login-form-title
.registration-form-subtitle → .login-form-subtitle
.registration-form → .login-form
.form-row → .form-grid .form-grid-2
.form-field → .form-group
input → .login-form-input
.error → .has-error
.error-message → .form-error
.error-alert → .login-error-banner

// Password Toggle
.password-field → .relative
.toggle-password → .absolute .right-3 .top-1/2

// Button
.register-button → .login-submit-button

// Links
.signin-link → .login-forgot-link (or similar)
```

**Files to Remove**:
- Remove `import './RegistrationForm.css'` (if exists)

---

## 🔧 Common Patterns

### Layout Structure (All Pages)
```jsx
<div className="app-root">
  <Sidebar />
  <MobileMenuButton />
  <div className="main-wrapper">
    <main className="content">
      <div className="content-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Title</h1>
            <p className="page-subtitle">Subtitle</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-primary">Action</button>
          </div>
        </div>
        
        {/* Content */}
        ...
      </div>
    </main>
  </div>
</div>
```

### Card Pattern
```jsx
<div className="card">
  <div className="card-header card-header-gradient">
    <h3 className="card-title">Title</h3>
    <div className="card-actions">
      <button className="btn btn-sm btn-outline">Action</button>
    </div>
  </div>
  <div className="card-body">
    Content
  </div>
  <div className="card-footer">
    Footer
  </div>
</div>
```

### Form Pattern
```jsx
<div className="form-grid form-grid-2">
  <div className="form-group">
    <label className="form-label">Label</label>
    <input type="text" className="form-input" />
    <span className="form-help">Help text</span>
  </div>
</div>
```

### Modal Pattern
```jsx
<div className="modal-backdrop">
  <div className="modal-dialog">
    <div className="modal-header modal-header-gradient">
      <h3 className="modal-title">Title</h3>
      <button className="modal-close">×</button>
    </div>
    <div className="modal-body">
      Content
    </div>
    <div className="modal-footer">
      <button className="btn btn-outline">Cancel</button>
      <button className="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Table Pattern
```jsx
<div className="table-container">
  <table className="table">
    <thead>
      <tr>
        <th>Column</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data</td>
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
```

---

## 🎯 Quick Migration Commands

### Apply LoginPage
```powershell
Move-Item -Path "e:\Startica\private-app\private-app\src\Component\LoginPage-NEW.js" -Destination "e:\Startica\private-app\private-app\src\Component\LoginPage.js" -Force
```

### Remove Old CSS Backups
```powershell
Remove-Item "e:\Startica\private-app\private-app\src\Component\*.css.backup" -Force
```

---

## 📦 Component Checklist

- [x] Dashboard.js - COMPLETE ✓
- [ ] LoginPage.js - READY (apply Move-Item)
- [ ] Candidates.js - IN PROGRESS
- [ ] Openings.js - PENDING
- [ ] HRManagement.js - PENDING
- [ ] CandidateForm.js - PENDING
- [ ] OpeningForm.js - PENDING
- [ ] RegistrationForm.js - PENDING
- [ ] AdvancedSearch.js - CHECK NEEDED
- [ ] UserDashboard.js - CHECK NEEDED

---

## 🚀 Next Steps

1. ✅ Apply LoginPage-NEW.js
2. Create complete versions of remaining components
3. Test all pages for visual consistency
4. Remove old CSS imports
5. Remove .css.backup files
6. Final verification

---

**Generated**: Complete CSS makeover in progress  
**Design System**: Using src/styles/ global CSS
**Brand Colors**: #0B2F6B (primary) + #D20B2B (accent)
