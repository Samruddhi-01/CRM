# EMPLOYMENT HISTORY FEATURE - QUICK REFERENCE

## 🎨 Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  PROFESSIONAL EXPERIENCE                                         │
│  ┌─ Experience Level ──────────┐  ┌─ Experience (years) ──────┐ │
│  │  ▼ 2-4 years                │  │  3                        │ │
│  └─────────────────────────────┘  └───────────────────────────┘ │
│                                                                   │
│  ┌─ Current Package (LPA) ─────┐  ┌─ Expected CTC (LPA) ──────┐ │
│  │  5.0                         │  │  8.0                      │ │
│  └─────────────────────────────┘  └───────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  EMPLOYMENT HISTORY                                              │
│                                                                   │
│  ╔══════════════════════════════════════════════════════════╗  │
│  ║ EMPLOYMENT 1                              [Remove] ⓧ    ║  │
│  ╠══════════════════════════════════════════════════════════╣  │
│  ║  ┌─ Company Name ───────────┐  ┌─ Designation ─────────┐ ║  │
│  ║  │  TCS                      │  │  Software Engineer    │ ║  │
│  ║  └───────────────────────────┘  └───────────────────────┘ ║  │
│  ║                                                            ║  │
│  ║  ┌─ Start Year ─┐  ┌─ End Year ──┐  ┌─ Duration ──────┐ ║  │
│  ║  │  2020       │  │  2023       │  │  3 years       │ ║  │
│  ║  └─────────────┘  └─────────────┘  └──────────────────┘ ║  │
│  ║                                                            ║  │
│  ║  ☐ Current Job                                           ║  │
│  ╚══════════════════════════════════════════════════════════╝  │
│                                                                   │
│  ╔══════════════════════════════════════════════════════════╗  │
│  ║ EMPLOYMENT 2                              [Remove] ⓧ    ║  │
│  ╠══════════════════════════════════════════════════════════╣  │
│  ║  ┌─ Company Name ───────────┐  ┌─ Designation ─────────┐ ║  │
│  ║  │  Infosys                  │  │  Senior Developer     │ ║  │
│  ║  └───────────────────────────┘  └───────────────────────┘ ║  │
│  ║                                                            ║  │
│  ║  ┌─ Start Year ─┐  ┌─ End Year ──┐  ┌─ Duration ──────┐ ║  │
│  ║  │  2023       │  │             │  │  1 years       │ ║  │
│  ║  └─────────────┘  └─────────────┘  └──────────────────┘ ║  │
│  ║                                     (disabled when ☑)     ║  │
│  ║  ☑ Current Job                                           ║  │
│  ╚══════════════════════════════════════════════════════════╝  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              ＋  ADD EMPLOYMENT                            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 User Interactions

### Adding New Employment
1. Click **"+ ADD EMPLOYMENT"** button
2. New card appears with empty fields
3. Fill in company, designation, years
4. Duration auto-calculates
5. Check "Current Job" if ongoing (disables end year)

### Removing Employment
1. Click **"Remove"** button on any card
2. Card disappears (minimum 1 card always remains)
3. Removed entry won't be saved

### Editing Employment
1. Change any field (company, designation, years)
2. Duration updates automatically
3. Toggle "Current Job" to enable/disable end year

---

## 📊 Data Structure (JSON Storage)

### Backend Storage Format
```json
[
  {
    "company": "TCS",
    "designation": "Software Engineer",
    "startYear": "2020",
    "endYear": "2023",
    "duration": "3 years",
    "isCurrent": false
  },
  {
    "company": "Infosys",
    "designation": "Senior Developer",
    "startYear": "2023",
    "endYear": "",
    "duration": "1 years",
    "isCurrent": true
  }
]
```

### Database Column
```
employment_history (TEXT) - Stores JSON array as string
```

---

## 💡 Smart Features

### Auto-Duration Calculation
```javascript
// For completed employment
startYear = 2020, endYear = 2023
→ duration = "3 years"

// For current employment
startYear = 2023, isCurrent = true
→ duration = "1 years" (current year 2024 - 2023)
```

### Empty Entry Filtering
```javascript
// Only entries with company OR designation are saved
Entry 1: company="TCS", designation="" → SAVED
Entry 2: company="", designation="Developer" → SAVED  
Entry 3: company="", designation="" → NOT SAVED
```

### Field States
```javascript
// End Year field
isCurrent = false → Enabled (user can input)
isCurrent = true  → Disabled (auto uses current year)

// Duration field
Always read-only (auto-calculated)
```

---

## 🔧 Technical Implementation

### Frontend State
```javascript
// JSON string for backend submission
formData.employmentHistory = '[{...}]'

// Array for UI rendering and editing
employmentEntries = [{
  company: '',
  designation: '',
  startYear: '',
  endYear: '',
  duration: '',
  isCurrent: false
}]
```

### Handler Functions
```javascript
addEmploymentEntry()           // Adds new entry
removeEmploymentEntry(index)   // Removes entry at index
updateEmploymentEntry(index, field, value) // Updates field + recalculates duration
```

### Form Submission
```javascript
// On submit: Filter + Serialize
const submissionData = {
  ...formData,
  employmentHistory: JSON.stringify(
    employmentEntries.filter(e => e.company || e.designation)
  )
}
```

### Data Loading
```javascript
// On edit: Parse + Populate
if (candidate.employmentHistory) {
  const parsed = JSON.parse(candidate.employmentHistory)
  setEmploymentEntries(parsed)
}
```

---

## 🎨 Style Classes

### Main Container
```css
.candidate-form-section          /* Section wrapper */
.candidate-form-section-title    /* "Employment History" title */
```

### Employment Cards
```css
.employment-entry-card          /* Card wrapper (light gray, border) */
.employment-entry-header        /* Header with number + remove button */
.employment-entry-number        /* "EMPLOYMENT 1" label */
.employment-remove-btn          /* Remove button (red) */
```

### Form Fields
```css
.candidate-form-grid            /* Grid layout for inputs */
.candidate-form-group           /* Individual input wrapper */
.candidate-form-label           /* Input label */
.candidate-form-input           /* Text/number input */
```

### Checkbox & Button
```css
.employment-current-wrapper     /* Checkbox container */
.employment-current-checkbox    /* Checkbox label + input */
.employment-add-btn             /* Add Employment button (gradient) */
```

---

## 📏 Design Specifications

### Colors
- Card background: `#FAFBFC`
- Card border: `#E2E8F0`
- Hover border: `#CBD5E1`
- Button gradient: `#0D2B66 → #1a3d7a`
- Remove button: `#EF4444` / `#FCA5A5`

### Typography
- All text: `0.75rem`
- Label weight: `500`
- Header weight: `600`
- Button weight: `600`

### Spacing
- Card padding: `0.75rem`
- Card margin: `0.625rem` bottom
- Input gaps: `0.5rem`
- Button margin: `0.5rem` top

### Effects
- Hover: Border color + shadow
- Button hover: Gradient flip + lift
- Checkbox: Brand blue accent

---

## ✅ Validation Rules

| Field      | Rule                           | Message               |
|------------|--------------------------------|-----------------------|
| Start Year | 1970 - current year            | Auto-limited by input |
| End Year   | 1970 - current year            | Auto-limited by input |
| Duration   | Read-only                      | Auto-calculated       |
| Company    | Optional (saved if filled)     | -                     |
| Designation| Optional (saved if filled)     | -                     |

---

## 🚦 Visibility Logic

```javascript
// Show employment section only for experienced candidates
{!isFresher && (
  <div className="candidate-form-section">
    {/* Employment History UI */}
  </div>
)}
```

**Trigger:**
- `experienceLevel` does NOT contain "fresher" or "0-1"

---

## 📱 Responsive Behavior

### Desktop (>768px)
- Full padding (0.75rem)
- Normal font sizes (0.75rem)
- All buttons visible

### Mobile (≤768px)
- Reduced padding (0.625rem)
- Smaller font sizes (0.688rem, 0.625rem)
- Compact buttons
- Single column grid

---

## 🔄 State Flow Diagram

```
User Fills Form
       ↓
updateEmploymentEntry()
       ↓
employmentEntries updated
       ↓
Duration auto-calculated
       ↓
UI re-renders
       ↓
User clicks Submit
       ↓
handleSubmit()
       ↓
Filter non-empty entries
       ↓
JSON.stringify(employmentEntries)
       ↓
submissionData.employmentHistory
       ↓
dispatch(createCandidate/updateCandidate)
       ↓
Backend API call
       ↓
Database saved
```

---

## 🎯 Success Criteria

✅ Section hidden for freshers  
✅ Section visible for experienced  
✅ Can add multiple employment entries  
✅ Can remove entries (min 1 kept)  
✅ Duration calculates automatically  
✅ Current job checkbox works  
✅ End year disabled when current  
✅ Empty entries filtered out  
✅ Data saves to backend  
✅ Data loads on edit  
✅ Ultra-compact professional design  
✅ Responsive on mobile  

---

**Quick Reference Guide Complete!** 🎉
