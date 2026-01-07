# History.js - Implementation Example

## 🎯 **How to Apply Unified Table System to History.js**

This is a step-by-step guide showing exactly how to update History.js with the new unified table system.

---

## 📝 **Step 1: Add Imports**

At the top of `History.js`, add:

```jsx
// Add these imports
import '../styles/layout/app-layout.css';
import '../styles/components/unified-table.css';
// Or use the component:
import AppTableLayout from '../components/common/AppTableLayout';
```

---

## 📝 **Step 2: Define Columns**

Inside your component, define columns:

```jsx
const History = () => {
  // ... existing code ...
  
  // Define table columns
  const tableColumns = [
    {
      header: 'Name',
      field: 'name',
      cellClassName: 'cell-name',
      render: (candidate) => `${candidate.firstName} ${candidate.lastName}`
    },
    {
      header: 'Email',
      field: 'email',
      cellClassName: 'cell-email',
      render: (candidate) => candidate.email
    },
    {
      header: 'Phone',
      field: 'phone',
      cellClassName: 'cell-phone',
      render: (candidate) => candidate.phone
    },
    {
      header: 'Status',
      field: 'status',
      type: 'status',
      render: (candidate) => (
        <span className={`unified-status-badge status-${candidate.status?.toLowerCase().replace('_', '-')}`}>
          {candidate.status?.replace('_', ' ')}
        </span>
      )
    },
    {
      header: 'Company',
      field: 'company',
      hideOnTablet: true,
      render: (candidate) => candidate.company || '-'
    },
    {
      header: 'Profile',
      field: 'profile',
      hideOnTablet: true,
      render: (candidate) => candidate.profile || '-'
    },
    {
      header: 'Location',
      field: 'location',
      hideOnTablet: true,
      render: (candidate) => candidate.location || '-'
    },
    {
      header: 'Experience',
      field: 'experience',
      hideOnTablet: true,
      render: (candidate) => candidate.experience || '-'
    },
    {
      header: 'Expected CTC',
      field: 'expectedCTC',
      hideOnTablet: true,
      render: (candidate) => candidate.expectedCTC || '-'
    },
    {
      header: 'Created',
      field: 'createdAt',
      cellClassName: 'cell-date',
      hideOnTablet: true,
      render: (candidate) => formatDate(candidate.createdAt)
    },
    {
      header: 'Actions',
      type: 'actions',
      cellClassName: 'cell-actions',
      render: (candidate) => (
        <div className="unified-action-buttons">
          <button 
            className="unified-action-btn unified-btn-edit"
            onClick={() => handleEdit(candidate.id)}
            title="Edit Candidate"
          >
            <Edit2 size={14} />
          </button>
          <button 
            className="unified-action-btn unified-btn-view"
            onClick={() => handleView(candidate.id)}
            title="View Candidate"
          >
            <Eye size={14} />
          </button>
        </div>
      )
    }
  ];
  
  // ... rest of component ...
};
```

---

## 📝 **Step 3: Replace Table JSX**

### **Option A: Using the Component (Recommended)**

```jsx
return (
  <>
    <Sidebar />
    <div className="main-content">
      <div className="page-container">
        {/* Header Section */}
        <div className="history-header-section">
          {/* ... existing header code ... */}
        </div>
        
        {/* Filters Section */}
        <div className="history-filters-section">
          {/* ... existing filters code ... */}
        </div>
        
        {/* Results Info */}
        <div className="history-results-section">
          {/* ... existing results info ... */}
        </div>
        
        {/* Table Section - NEW */}
        <div className="history-table-section">
          {filteredCandidates.length === 0 ? (
            <div className="unified-empty-state">
              <div className="unified-empty-state-icon">📋</div>
              <h3>No candidates found</h3>
              <p>
                {(localFilters.search || localFilters.status || localFilters.dateRange)
                  ? 'No candidates match your current filters'
                  : 'Start by adding your first candidate'}
              </p>
            </div>
          ) : (
            <AppTableLayout
              columns={tableColumns}
              data={filteredCandidates}
              loading={loading}
              renderMobileCard={(candidate) => (
                <div className="unified-mobile-card">
                  <div className="unified-card-header">
                    <div className="unified-card-title">
                      <div className="unified-card-name">
                        {candidate.firstName} {candidate.lastName}
                      </div>
                      <div className="unified-card-subtitle">{candidate.email}</div>
                    </div>
                    <span className={`unified-status-badge status-${candidate.status?.toLowerCase().replace('_', '-')}`}>
                      {candidate.status?.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="unified-card-body">
                    <div className="unified-card-row">
                      <span className="unified-card-label">Phone:</span>
                      <span className="unified-card-value">{candidate.phone}</span>
                    </div>
                    <div className="unified-card-row">
                      <span className="unified-card-label">Company:</span>
                      <span className="unified-card-value">{candidate.company || '-'}</span>
                    </div>
                    <div className="unified-card-row">
                      <span className="unified-card-label">Location:</span>
                      <span className="unified-card-value">{candidate.location || '-'}</span>
                    </div>
                    <div className="unified-card-row">
                      <span className="unified-card-label">Created:</span>
                      <span className="unified-card-value">{formatDate(candidate.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="unified-card-footer">
                    <button 
                      className="unified-action-btn unified-btn-edit"
                      onClick={() => handleEdit(candidate.id)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="unified-action-btn unified-btn-view"
                      onClick={() => handleView(candidate.id)}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              )}
            />
          )}
        </div>
        
        {/* Pagination Section */}
        <div className="pagination-wrapper-centered">
          {/* ... existing pagination code ... */}
        </div>
      </div>
    </div>
  </>
);
```

### **Option B: Manual Implementation (More Control)**

```jsx
<div className="history-table-section">
  {filteredCandidates.length === 0 ? (
    <div className="unified-empty-state">
      <div className="unified-empty-state-icon">📋</div>
      <h3>No candidates found</h3>
      <p>No candidates match your current filters</p>
    </div>
  ) : (
    <>
      {/* Desktop Table View */}
      <div className={`unified-table-wrapper ${loading ? 'unified-table-loading' : ''}`}>
        <table className="unified-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th className="hide-tablet">Company</th>
              <th className="hide-tablet">Profile</th>
              <th className="hide-tablet">Location</th>
              <th className="hide-tablet">Experience</th>
              <th className="hide-tablet">Expected CTC</th>
              <th className="hide-tablet">Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="cell-name">
                  {candidate.firstName} {candidate.lastName}
                </td>
                <td className="cell-email">{candidate.email}</td>
                <td className="cell-phone">{candidate.phone}</td>
                <td>
                  <span className={`unified-status-badge status-${candidate.status?.toLowerCase().replace('_', '-')}`}>
                    {candidate.status?.replace('_', ' ')}
                  </span>
                </td>
                <td className="hide-tablet">{candidate.company || '-'}</td>
                <td className="hide-tablet">{candidate.profile || '-'}</td>
                <td className="hide-tablet">{candidate.location || '-'}</td>
                <td className="hide-tablet">{candidate.experience || '-'}</td>
                <td className="hide-tablet">{candidate.expectedCTC || '-'}</td>
                <td className="cell-date hide-tablet">{formatDate(candidate.createdAt)}</td>
                <td className="cell-actions">
                  <div className="unified-action-buttons">
                    <button 
                      className="unified-action-btn unified-btn-edit"
                      onClick={() => handleEdit(candidate.id)}
                      title="Edit Candidate"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      className="unified-action-btn unified-btn-view"
                      onClick={() => handleView(candidate.id)}
                      title="View Candidate"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Card View */}
      <div className="unified-mobile-cards">
        {filteredCandidates.map((candidate) => (
          <div key={candidate.id} className="unified-mobile-card">
            <div className="unified-card-header">
              <div className="unified-card-title">
                <div className="unified-card-name">
                  {candidate.firstName} {candidate.lastName}
                </div>
                <div className="unified-card-subtitle">{candidate.email}</div>
              </div>
              <span className={`unified-status-badge status-${candidate.status?.toLowerCase().replace('_', '-')}`}>
                {candidate.status?.replace('_', ' ')}
              </span>
            </div>
            
            <div className="unified-card-body">
              <div className="unified-card-row">
                <span className="unified-card-label">Phone:</span>
                <span className="unified-card-value">{candidate.phone}</span>
              </div>
              <div className="unified-card-row">
                <span className="unified-card-label">Company:</span>
                <span className="unified-card-value">{candidate.company || '-'}</span>
              </div>
              <div className="unified-card-row">
                <span className="unified-card-label">Profile:</span>
                <span className="unified-card-value">{candidate.profile || '-'}</span>
              </div>
              <div className="unified-card-row">
                <span className="unified-card-label">Location:</span>
                <span className="unified-card-value">{candidate.location || '-'}</span>
              </div>
              <div className="unified-card-row">
                <span className="unified-card-label">Experience:</span>
                <span className="unified-card-value">{candidate.experience || '-'}</span>
              </div>
              <div className="unified-card-row">
                <span className="unified-card-label">Expected CTC:</span>
                <span className="unified-card-value">{candidate.expectedCTC || '-'}</span>
              </div>
              <div className="unified-card-row">
                <span className="unified-card-label">Created:</span>
                <span className="unified-card-value">{formatDate(candidate.createdAt)}</span>
              </div>
            </div>
            
            <div className="unified-card-footer">
              <button 
                className="unified-action-btn unified-btn-edit"
                onClick={() => handleEdit(candidate.id)}
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button 
                className="unified-action-btn unified-btn-view"
                onClick={() => handleView(candidate.id)}
                title="View"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</div>
```

---

## 📝 **Step 4: Remove Old CSS**

You can now optionally remove these old classes from `history.css` (or keep them for backward compatibility):
- `.history-table-shell`
- `.history-table-frame`
- `.history-data-table`
- `.history-table-head`
- `.history-table-th`
- `.history-table-body`
- `.history-table-td`
- `.history-status-badge`
- `.history-action-btn`

---

## ✅ **What You Get**

After implementing:

### **Desktop (> 1200px)**
- ✅ Full 11-column table
- ✅ All data visible
- ✅ Professional gradient header
- ✅ Smooth hover effects
- ✅ Perfect fit with sidebar

### **Laptop (992px - 1200px)**
- ✅ All columns visible
- ✅ Compact spacing
- ✅ Smaller fonts
- ✅ Still professional

### **Tablet (768px - 992px)**
- ✅ Essential columns only (Name, Email, Phone, Status, Actions)
- ✅ Horizontal scroll for table
- ✅ Touch-friendly

### **Mobile (< 768px)**
- ✅ **Beautiful card layout**
- ✅ All info in organized cards
- ✅ Large touch targets
- ✅ Swipe-friendly scrolling

---

## 🎯 **Testing Checklist**

- [ ] Desktop view (1920px, 1440px, 1366px)
- [ ] Laptop view (1200px, 1024px)
- [ ] Tablet view (992px, 768px)
- [ ] Mobile view (640px, 480px, 375px)
- [ ] Sidebar expanded
- [ ] Sidebar collapsed
- [ ] Empty state
- [ ] Loading state
- [ ] Long names/emails
- [ ] Action buttons work
- [ ] Mobile cards scroll smoothly

---

## 💡 **Pro Tips**

1. **Use `hideOnTablet`** for columns that aren't critical
2. **Keep actions column always visible**
3. **Test on real devices**, not just browser dev tools
4. **Check touch targets** - minimum 44px on mobile
5. **Verify scrollbar** shows when table overflows

---

## 🚀 **Quick Copy-Paste**

### Minimal working example:
```jsx
import AppTableLayout from '../components/common/AppTableLayout';
import { Edit2, Eye } from 'lucide-react';

const columns = [
  { header: 'Name', field: 'name', cellClassName: 'cell-name', render: (row) => `${row.firstName} ${row.lastName}` },
  { header: 'Email', field: 'email', cellClassName: 'cell-email' },
  { header: 'Status', type: 'status', render: (row) => <span className={`unified-status-badge status-${row.status.toLowerCase()}`}>{row.status}</span> },
  { header: 'Actions', type: 'actions', render: (row) => (
    <div className="unified-action-buttons">
      <button className="unified-action-btn unified-btn-edit" onClick={() => handleEdit(row.id)}><Edit2 size={14} /></button>
      <button className="unified-action-btn unified-btn-view" onClick={() => handleView(row.id)}><Eye size={14} /></button>
    </div>
  )}
];

<AppTableLayout columns={columns} data={filteredCandidates} loading={loading} />
```

---

**You're all set! 🎉**

The unified table system is production-ready and will give you consistent, professional tables across your entire application.
