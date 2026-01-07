# 🚀 Enterprise Advanced Search - Quick Start Guide

## ✅ **WHAT'S BEEN CREATED**

### Complete File Structure:
```
src/
├── Component/
│   └── AdvancedSearchNew.js         ✅ CREATED (Main page component)
│
├── components/advanced-search/
│   ├── FilterAccordion.js           ✅ CREATED
│   ├── MultiSelect.js               ✅ CREATED
│   ├── RangeSlider.js               ✅ CREATED
│   ├── FilterChips.js               ✅ CREATED
│   ├── CandidateCard.js             ✅ CREATED
│   ├── SearchBar.js                 ✅ CREATED
│   ├── ActiveFiltersBar.js          ✅ CREATED
│   └── FilterSidebar.js             ✅ CREATED
│
└── styles/advanced-search/
    ├── design-system.css            ✅ CREATED (CSS variables, utilities)
    ├── search-bar.css               ✅ CREATED
    ├── filter-sidebar.css           ✅ CREATED
    ├── candidate-card.css           ✅ CREATED
    ├── results-layout.css           ✅ CREATED
    ├── saved-search-modal.css       ✅ CREATED
    └── index.css                    ✅ CREATED (Master import)
```

---

## 📦 **STEP 1: Install Dependencies**

```powershell
npm install lucide-react
```

**What is lucide-react?**
- Modern icon library (replaces react-icons)
- Used for Search, Filter, Close, ChevronDown, etc. icons
- Lightweight and tree-shakeable

---

## 🔗 **STEP 2: Import CSS in App.js**

**File:** `src/App.js`

Add this import at the top:

```javascript
import './styles/advanced-search/index.css';
```

**Full example:**
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/advanced-search/index.css'; // ← ADD THIS LINE

// ... rest of your imports

function App() {
  return (
    <Router>
      <Routes>
        {/* Your existing routes */}
      </Routes>
    </Router>
  );
}

export default App;
```

---

## 🛣️ **STEP 3: Add Route**

**File:** `src/App.js` (inside Routes)

```javascript
import AdvancedSearchNew from './Component/AdvancedSearchNew';

// Inside your <Routes>:
<Route path="/search/advanced" element={<AdvancedSearchNew />} />
```

**Full routing example:**
```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/candidates" element={<Candidates />} />
  <Route path="/search/advanced" element={<AdvancedSearchNew />} /> {/* NEW */}
  {/* ... other routes */}
</Routes>
```

---

## 🚀 **STEP 4: Run the Application**

```powershell
npm start
```

Navigate to: **http://localhost:3000/search/advanced**

---

## 🎨 **WHAT YOU'LL SEE**

### 1. **Top Search Bar**
- Large search input with Boolean operators support
- Search, Clear, Save, Load buttons
- Placeholder: "Search by name, skills, designation, college, company..."
- Boolean operators help section (AND, OR, NOT, "", -)

### 2. **Left Filter Sidebar**
**5 Accordion Sections:**
- ✅ **Candidate Information** (Locations, Experience, Notice Period, CTC)
- ✅ **Skills & Technology** (Primary/Secondary skills, Match type)
- ✅ **Education** (Qualification, Specialization, Passing Year)
- ✅ **Job Application** (Application Status)
- ✅ **Advanced Filters** (Exclude duplicates, blocked, verified only)

### 3. **Active Filters Bar**
- Shows all applied filters as removable chips
- "Clear All" button
- Filter count badge

### 4. **Results Area**
- Results count (e.g., "540 candidates found")
- Sort dropdown (Relevance, Latest, Experience, Salary)
- Candidate cards with:
  - Profile photo placeholder
  - Name, role, skills chips
  - Experience, location, CTC, notice period
  - "View Profile" and "Download" buttons
  - Verified badge for verified profiles

### 5. **Pagination**
- Previous/Next buttons
- Page numbers (1, 2, 3...)
- Items per page selector (20, 50, 100)
- Entry statistics (e.g., "Showing 1 to 20 of 540")

### 6. **Mobile Features**
- Floating filter button (bottom-right)
- Filter drawer opens from left
- Overlay backdrop
- Touch-friendly controls

---

## 🔍 **TESTING THE FEATURES**

### Test 1: Search Functionality
1. Type "Java Developer" in search bar
2. Press Enter or click Search button
3. Results should filter (currently shows mock data)

### Test 2: Apply Filters
1. Click "Candidate Information" accordion
2. Select "Pune" and "Bangalore" in Current Location
3. Adjust Experience slider to 3-7 years
4. Notice Period: "Immediate"
5. Check active filters bar shows your selections

### Test 3: Remove Filters
1. Click X on any filter chip
2. That filter should be removed
3. Click "Clear All" to reset everything

### Test 4: Pagination
1. Change items per page to 50
2. Click page 2
3. Click Previous/Next buttons

### Test 5: Save Search
1. Apply some filters
2. Click Save button (bookmark icon)
3. Enter a name when prompted
4. Search is saved to localStorage

### Test 6: Mobile View
1. Resize browser to < 992px width
2. Filter sidebar disappears
3. Floating filter button appears bottom-right
4. Click it to open filter drawer
5. Apply filters and close drawer

---

## 🎨 **CUSTOMIZATION**

### Change Primary Brand Color
**File:** `src/styles/advanced-search/design-system.css`

```css
:root {
  --primary-blue: #1976d2;      /* Change to #FF5722 for orange */
  --primary-blue-dark: #1565c0; /* Change to #E64A19 */
  --primary-blue-light: #42a5f5; /* Change to #FF7043 */
}
```

### Adjust Spacing
```css
:root {
  --space-4: 16px;  /* Increase to 20px for more spacing */
  --space-6: 24px;  /* Increase to 30px */
}
```

### Change Font
```css
body {
  font-family: 'Inter', 'Roboto', sans-serif; /* Your custom font */
}
```

---

## 🔧 **CONNECT TO BACKEND API**

### Current State: Mock Data
The component currently shows 2 mock candidates for testing UI.

### To Connect Real API:

**File:** `src/Component/AdvancedSearchNew.js`

**Find this section (line ~81):**
```javascript
const handleSearch = useCallback(async () => {
  setLoading(true);
  
  try {
    const searchPayload = {
      query: searchQuery,
      ...filters,
      sortBy,
      page,
      limit: itemsPerPage,
    };

    // TODO: Replace with actual API call
    console.log('Search payload:', searchPayload);
    
    // ⬇️ REPLACE THIS MOCK DATA SECTION ⬇️
    setCandidates([/* mock data */]);
    setTotalResults(2);
    
  } catch (error) {
    console.error('Search error:', error);
  } finally {
    setLoading(false);
  }
}, [searchQuery, filters, sortBy, page, itemsPerPage]);
```

**Replace with:**
```javascript
const handleSearch = useCallback(async () => {
  setLoading(true);
  
  try {
    const searchPayload = {
      query: searchQuery,
      ...filters,
      sortBy,
      page,
      limit: itemsPerPage,
    };

    // Real API call
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/api/search/candidates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(searchPayload)
    });

    const data = await response.json();
    setCandidates(data.results || []);
    setTotalResults(data.totalCount || 0);
    
  } catch (error) {
    console.error('Search error:', error);
    setCandidates([]);
    setTotalResults(0);
  } finally {
    setLoading(false);
  }
}, [searchQuery, filters, sortBy, page, itemsPerPage]);
```

---

## 🐛 **TROUBLESHOOTING**

### Issue: Icons not showing
**Solution:** Install lucide-react
```powershell
npm install lucide-react
```

### Issue: Styles not applied
**Solution:** Verify CSS import in App.js
```javascript
import './styles/advanced-search/index.css';
```

### Issue: Component not rendering
**Solution:** Check route is added
```javascript
<Route path="/search/advanced" element={<AdvancedSearchNew />} />
```

### Issue: Filter sidebar not showing
**Solution:** Check browser width > 992px or click mobile filter button

### Issue: Search not working
**Solution:** Check browser console for errors, verify API endpoint

---

## 📱 **RESPONSIVE BREAKPOINTS**

- **≥ 1400px:** Full desktop layout
- **1200px - 1400px:** Slightly condensed
- **992px - 1200px:** Reduced spacing
- **768px - 992px:** Filter sidebar becomes drawer, mobile filter button appears
- **576px - 768px:** Stacked layout, reduced font sizes
- **< 576px:** Full mobile view, touch-optimized

---

## 🎯 **NEXT STEPS**

1. ✅ **Test UI Components** - Use mock data to verify all features
2. ✅ **Connect Backend API** - Replace mock data with real endpoint
3. ✅ **Add Authentication** - Ensure JWT token is passed
4. ✅ **Test with Real Data** - Populate database with test candidates
5. ✅ **Customize Branding** - Change colors, fonts, logos
6. ✅ **Add More Filters** - Extend FilterSidebar with additional fields
7. ✅ **Implement Export** - Add Excel/PDF export functionality
8. ✅ **Add Analytics** - Track search queries and filter usage

---

## 📞 **SUPPORT**

### Check These First:
1. Browser console (F12) for JavaScript errors
2. Network tab for failed API calls
3. React DevTools for component state
4. CSS inspector for styling issues

### Common Fixes:
- Clear browser cache (Ctrl+Shift+Delete)
- Restart development server (Ctrl+C, then `npm start`)
- Delete node_modules and reinstall (`npm install`)
- Check Node.js version (requires Node 14+)

---

## ✅ **READY TO USE!**

Your Enterprise Advanced Search is now ready with:
- ✅ Professional Naukri-style UI
- ✅ 25+ filter options
- ✅ Boolean search operators
- ✅ Saved searches
- ✅ Mobile responsive design
- ✅ Clean, modern CSS
- ✅ Smooth animations
- ✅ Accessibility features

**Navigate to:** http://localhost:3000/search/advanced

**Enjoy! 🎉**
