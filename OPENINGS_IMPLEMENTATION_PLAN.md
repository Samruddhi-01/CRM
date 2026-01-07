# 📋 Openings.js - Implementation Plan

## 🎯 **Current Status**

**File**: `src/Component/Openings.js`  
**Lines**: 843 total  
**Complexity**: High (9 columns, 5 action buttons, modals)

---

## 📊 **Table Structure**

### **9 Columns**
1. **JOB TITLE** - Opening title
2. **DEPARTMENT** - Department name
3. **LOCATION** - Job location
4. **POSITIONS** - Number of positions (centered)
5. **EXPERIENCE** - Experience badge with icons
6. **APPLICATIONS** - Clickable count button (centered)
7. **STATUS** - Status badge (ACTIVE, CLOSED, ON_HOLD, DRAFT)
8. **CREATED** - Creation date
9. **ACTIONS** - 5 buttons (Edit, Apply, Hold/Activate, Close, Delete)

---

## 🔧 **Implementation Steps**

### **Step 1: Add Imports**
```jsx
import { Edit2, UserPlus, Pause, Play, Lock, Trash2 } from 'lucide-react';
import '../styles/layout/app-layout.css';
import '../styles/components/unified-table.css';
```

### **Step 2: Update Table Structure**
- Change `.openings-table` → `.unified-table`
- Change `.openings-table-container` → `.unified-table-section`
- Change `.openings-table-responsive` → `.unified-table-wrapper`

### **Step 3: Update Cell Classes**
- `.opening-title-cell` → `.cell-name`
- `.opening-date-cell` → `.cell-date`
- `.opening-actions-cell` → `.cell-actions`

### **Step 4: Update Action Buttons**
Replace icon-only buttons with unified buttons:

**Current** (Icon buttons):
```jsx
<button className="icon-button icon-edit" />
<button className="icon-button icon-apply" />
<button className="icon-button icon-hold" />
<button className="icon-button icon-close" />
<button className="icon-button icon-delete" />
```

**New** (Unified buttons with icons):
```jsx
<button className="unified-action-btn unified-btn-edit">
  <Edit2 size={14} />
</button>
<button className="unified-action-btn unified-btn-primary">
  <UserPlus size={14} />
</button>
{opening.status === 'ACTIVE' ? (
  <button className="unified-action-btn unified-btn-warning">
    <Pause size={14} />
  </button>
) : opening.status === 'ON_HOLD' ? (
  <button className="unified-action-btn unified-btn-success">
    <Play size={14} />
  </button>
) : null}
<button className="unified-action-btn unified-btn-neutral">
  <Lock size={14} />
</button>
<button className="unified-action-btn unified-btn-delete">
  <Trash2 size={14} />
</button>
```

### **Step 5: Preserve Unique Features**
- **Experience badges** with icons (🌱, 📝, 🎯, etc.)
- **Applications count button** (clickable to view applications)
- **Status badges** (ACTIVE, CLOSED, ON_HOLD, DRAFT)
- **Conditional action buttons** (Hold/Activate based on status)
- **Mobile card view** with emoji icons

---

## 🎨 **Status Badge Mapping**

```jsx
ACTIVE   → status-active   (Green)
CLOSED   → status-closed   (Red)
ON_HOLD  → status-on-hold  (Purple)
DRAFT    → status-draft    (Gray)
```

---

## 💡 **Special Considerations**

### **1. Applications Count Button**
Keep the clickable button for viewing applications:
```jsx
<button 
  className="openings-applications-btn"
  onClick={() => handleViewApplications(opening)}
>
  {opening.applicationsCount ?? 0}
</button>
```

### **2. Experience Badges**
Keep the custom experience badges with icons:
```jsx
{getExperienceBadge(opening.experience)}
```

### **3. Conditional Action Buttons**
Show Hold or Activate button based on current status:
```jsx
{opening.status === 'ACTIVE' ? (
  <Pause button />
) : opening.status === 'ON_HOLD' ? (
  <Play button />
) : null}
```

### **4. Mobile Card View**
Update mobile buttons to use Lucide icons instead of emojis.

---

## 📁 **Files to Modify**

1. **Openings.js** (lines 1-840)
   - Add imports
   - Update table structure (lines 456-548)
   - Update action buttons (lines 496-542)
   - Update mobile cards (lines 580-636)

---

## ⏱️ **Estimated Changes**

- **Imports**: +3 lines
- **Table structure**: ~10 lines modified
- **Action buttons**: ~50 lines modified
- **Mobile cards**: ~20 lines modified
- **Total**: ~80 lines affected

---

## ✅ **Expected Result**

After implementation:
- ✅ Unified table styling (matches History.js, Candidates.js)
- ✅ Professional action buttons with icons
- ✅ All unique features preserved
- ✅ Responsive mobile card view
- ✅ Consistent design across application

---

**Ready to implement? This will take a few minutes due to the complexity.**

Let me know and I'll proceed with the implementation! 🚀
