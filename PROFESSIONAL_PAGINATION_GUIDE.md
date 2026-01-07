# Professional Pagination Implementation Guide

## 📋 Overview

This guide shows how to implement professional pagination (centered, with show entries on top right) across all pages with tables.

---

## 🎯 Pages to Update

1. ✅ History.js - **COMPLETED**
2. ⏳ Openings.js - Pending
3. ⏳ Candidates.js - Pending
4. ⏳ HRManagement.js - Pending
5. ⏳ AdminReports.js - Pending
6. ⏳ HRCandidateRemarks.js - Pending

---

## 📦 Step 1: Import Shared CSS

Add to the top of your component file:

```javascript
import '../styles/components/professional-pagination.css';
```

---

## 🏗️ Step 2: Table Header with Show Entries

### Replace This (OLD):
```jsx
{/* Results or any section before table */}
<div className="results-section">
  <p>Showing X of Y entries</p>
</div>

{/* Table starts */}
<table>...
```

### With This (NEW):
```jsx
{/* Table Header with Show Entries */}
<div className="table-header-section">
  <div className="table-header-wrapper">
    <div className="results-info">
      <p className="results-count">
        Showing <strong>{displayedItems.length}</strong> of <strong>{totalItems}</strong> entries
      </p>
    </div>
    <div className="show-entries-wrapper">
      <label className="show-entries-label">Show entries:</label>
      <select 
        value={itemsPerPage}
        onChange={(e) => {
          setItemsPerPage(Number(e.target.value));
          setCurrentPage(0); // or dispatch(setPage(0))
        }}
        className="show-entries-select"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  </div>
</div>

{/* Table starts */}
<table className="professional-table">...
```

---

## 📄 Step 3: Professional Table Classes

### Add Professional Table Class:
```jsx
<table className="professional-table">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      ...
    </tr>
  </thead>
  <tbody>
    {items.map(item => (
      <tr key={item.id}>
        <td>{item.data}</td>
        ...
      </tr>
    ))}
  </tbody>
</table>
```

---

## 🔄 Step 4: Centered Pagination

### Replace This (OLD):
```jsx
<div className="pagination-wrapper">
  <div className="pagination-info">
    <label>Show:</label>
    <select value={itemsPerPage}>...
  </div>
  <div className="pagination">
    <button onClick={prevPage}>Previous</button>
    {/* page numbers */}
    <button onClick={nextPage}>Next</button>
  </div>
</div>
```

### With This (NEW):
```jsx
{/* Centered Pagination */}
{totalPages > 0 && (
  <div className="pagination-wrapper-centered">
    <div className="pagination-container">
      <button
        className="pagination-btn pagination-btn-prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        title="Previous Page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Previous</span>
      </button>
      
      <div className="pagination-numbers">
        {[...Array(totalPages)].map((_, index) => {
          if (
            index === 0 ||
            index === totalPages - 1 ||
            (index >= currentPage - 1 && index <= currentPage + 1)
          ) {
            return (
              <button
                key={index}
                className={`pagination-btn pagination-number ${currentPage === index ? 'active' : ''}`}
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </button>
            );
          } else if (index === currentPage - 2 || index === currentPage + 2) {
            return <span key={index} className="pagination-ellipsis">...</span>;
          }
          return null;
        })}
      </div>
      
      <button
        className="pagination-btn pagination-btn-next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        title="Next Page"
      >
        <span>Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
    
    <div className="pagination-info">
      <span>Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong></span>
      <span className="pagination-separator">•</span>
      <span>Total <strong>{totalItems}</strong> entries</span>
    </div>
  </div>
)}
```

---

## 🎨 Step 5: Action Buttons (Optional)

### Replace Text Buttons:
```jsx
<button onClick={handleEdit}>Edit</button>
<button onClick={handleView}>View</button>
```

### With Icon Buttons:
```jsx
import { Edit2, Eye, Trash2, Info } from 'lucide-react';

<div className="action-buttons-group">
  <button 
    className="action-btn-professional action-btn-edit"
    onClick={handleEdit}
    title="Edit"
  >
    <Edit2 size={16} />
  </button>
  <button 
    className="action-btn-professional action-btn-view"
    onClick={handleView}
    title="View"
  >
    <Eye size={16} />
  </button>
</div>
```

---

## 📊 Complete Example: Openings.js

### Before:
```javascript
// Openings.js (OLD STRUCTURE)
import React, { useState } from 'react';
import '../styles/pages/openings.css';

function Openings() {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  
  return (
    <div className="openings-container">
      {/* Old header */}
      <div className="table-card-header-right">
        <div className="pagination-controls">
          <label>Show:</label>
          <select value={itemsPerPage}>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>
      
      {/* Table */}
      <table className="openings-table">
        ...
      </table>
      
      {/* Old pagination at bottom */}
      <div className="pagination-wrapper">
        <div className="pagination-info">
          Showing 1 to 10 of 50
        </div>
        <div className="pagination">
          <button>Previous</button>
          <button>1</button>
          <button>2</button>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
}
```

### After:
```javascript
// Openings.js (NEW PROFESSIONAL STRUCTURE)
import React, { useState } from 'react';
import { Edit2, Eye } from 'lucide-react';
import '../styles/pages/openings.css';
import '../styles/components/professional-pagination.css';

function Openings() {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  return (
    <div className="openings-container">
      {/* NEW: Table Header with Show Entries on Right */}
      <div className="table-header-section">
        <div className="table-header-wrapper">
          <div className="results-info">
            <p className="results-count">
              Showing <strong>{openings.length}</strong> of <strong>{totalItems}</strong> openings
            </p>
          </div>
          <div className="show-entries-wrapper">
            <label className="show-entries-label">Show entries:</label>
            <select 
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(0);
              }}
              className="show-entries-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Professional Table */}
      <table className="professional-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {openings.map(opening => (
            <tr key={opening.id}>
              <td>{opening.title}</td>
              <td>{opening.department}</td>
              <td>
                <span className="status-badge-professional status-success">
                  {opening.status}
                </span>
              </td>
              <td>
                <div className="action-buttons-group">
                  <button className="action-btn-professional action-btn-edit" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button className="action-btn-professional action-btn-view" title="View">
                    <Eye size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* NEW: Centered Pagination */}
      {totalPages > 0 && (
        <div className="pagination-wrapper-centered">
          <div className="pagination-container">
            <button
              className="pagination-btn pagination-btn-prev"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Previous</span>
            </button>
            
            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, index) => {
                if (
                  index === 0 ||
                  index === totalPages - 1 ||
                  (index >= currentPage - 1 && index <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={index}
                      className={`pagination-btn pagination-number ${currentPage === index ? 'active' : ''}`}
                      onClick={() => handlePageChange(index)}
                    >
                      {index + 1}
                    </button>
                  );
                } else if (index === currentPage - 2 || index === currentPage + 2) {
                  return <span key={index} className="pagination-ellipsis">...</span>;
                }
                return null;
              })}
            </div>
            
            <button
              className="pagination-btn pagination-btn-next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              <span>Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          
          <div className="pagination-info">
            <span>Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong></span>
            <span className="pagination-separator">•</span>
            <span>Total <strong>{totalItems}</strong> entries</span>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## ✅ Checklist for Each Page

When updating a page, ensure:

- [ ] Imported `professional-pagination.css`
- [ ] Imported icons from `lucide-react` (if using icon buttons)
- [ ] Moved "Show entries" dropdown to top right
- [ ] Added `table-header-section` wrapper
- [ ] Applied `professional-table` class to table
- [ ] Replaced old pagination with centered version
- [ ] Added pagination info below (Page X of Y • Total N entries)
- [ ] Updated action buttons to use icons (optional)
- [ ] Tested on desktop (>640px)
- [ ] Tested on mobile (<640px)
- [ ] Verified pagination works correctly
- [ ] Checked scrollbar doesn't glitch

---

## 🎨 Visual Layout

```
┌─────────────────────────────────────────────────────┐
│ Showing 10 of 50 entries          Show entries: 10▼│ ← Top Right
├─────────────────────────────────────────────────────┤
│ TABLE                                                │
│ ┌────────┬──────────┬─────────┬─────────┐          │
│ │ COLUMN │ COLUMN   │ STATUS  │ ACTIONS │          │
│ ├────────┼──────────┼─────────┼─────────┤          │
│ │ Data   │ Data     │ Badge   │  ✏️ 👁️  │          │
│ └────────┴──────────┴─────────┴─────────┘          │
├─────────────────────────────────────────────────────┤
│              [← Prev] 1 [2] 3 [Next →]             │ ← Centered
│        Page 2 of 5 • Total 50 entries              │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Implementation Steps

1. **Copy the shared CSS file** (already created)
2. **For each page**:
   - Add import for `professional-pagination.css`
   - Find the old "Show" dropdown and move to top right
   - Find the old pagination and replace with centered version
   - Test thoroughly

3. **Optional enhancements**:
   - Add icon buttons using lucide-react
   - Apply professional table classes
   - Add status badges

---

## 📱 Mobile Responsive Behavior

**Desktop (>640px)**:
- Show entries: Top right
- Pagination: Full text on Previous/Next
- Action buttons: Icons or icon + text

**Mobile (<640px)**:
- Show entries: Full width below results count
- Pagination: Icons only on Previous/Next
- Action buttons: Larger touch targets

---

## 🎯 Benefits

✅ **Consistent UX across all pages**
✅ **Professional appearance**
✅ **Better usability**
✅ **Industry-standard layout**
✅ **Responsive design**
✅ **Reusable components**

---

**Created**: December 9, 2025
**Status**: Implementation Guide Complete
**Next Steps**: Apply to each page systematically
