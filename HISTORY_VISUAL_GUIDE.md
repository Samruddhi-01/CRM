# History Page - Visual Guide

## 🎯 Quick Visual Reference

### Layout Changes

```
BEFORE:
┌─────────────────────────────────────────────────────────┐
│ Header                                                   │
├─────────────────────────────────────────────────────────┤
│ Filters                                                  │
├─────────────────────────────────────────────────────────┤
│ Showing X of Y candidates                               │
├─────────────────────────────────────────────────────────┤
│ Table                                                    │
│ ┌────────┬──────┬────────┬──────────┐                  │
│ │  Name  │Email │ Status │ Actions  │                  │
│ ├────────┼──────┼────────┼──────────┤                  │
│ │  John  │ j@   │ Pending│ Edit View│                  │
│ └────────┴──────┴────────┴──────────┘                  │
├─────────────────────────────────────────────────────────┤
│ Show: [10▼]  Showing 1-10 of 50     [Prev] 1 2 [Next] │
└─────────────────────────────────────────────────────────┘
```

```
AFTER:
┌─────────────────────────────────────────────────────────┐
│ Header                                                   │
├─────────────────────────────────────────────────────────┤
│ Filters                                                  │
├─────────────────────────────────────────────────────────┤
│ Showing X of Y candidates          Show entries: [10▼] │
├─────────────────────────────────────────────────────────┤
│ Table                                                    │
│ ┌────────┬──────┬────────┬──────────┐                  │
│ │  NAME  │EMAIL │ STATUS │ ACTIONS  │  ← Gradient      │
│ ├────────┼──────┼────────┼──────────┤                  │
│ │  John  │ j@   │ Pending│  ✏️ 👁️  │  ← Icons        │
│ └────────┴──────┴────────┴──────────┘                  │
├─────────────────────────────────────────────────────────┤
│              [← Prev] 1 2 3 [Next →]                   │  ← Centered
│        Page 1 of 5 • Total 50 entries                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Component Breakdown

### 1. Table Header Bar
```
┌────────────────────────────────────────────────────────────┐
│ Showing 10 of 50 candidates               Show entries: 10▼│
└────────────────────────────────────────────────────────────┘
     ↑                                            ↑
   Left side                                  Right side
   (Results info)                            (Entries dropdown)
```

**Features**:
- Flex layout with `space-between`
- Results count on left
- Dropdown on right
- White background with bottom border

---

### 2. Action Buttons (Desktop)

```
Desktop Table:
┌──────────────────┐
│ 🏢 TCS          │
│ 👤 Engineer     │
│ Actions: ✏️  👁️ │  ← Icon only
└──────────────────┘

Hover Effect:
┌─────────┐       ┌─────────┐
│  ✏️      │  →   │  ✏️      │  (filled blue, lifted)
│ (blue)  │       │ (white) │
└─────────┘       └─────────┘
```

**Features**:
- Icon-only buttons
- Tooltip on hover
- Transform lift effect
- Color fill animation
- Shadow on hover

---

### 3. Action Buttons (Mobile Cards)

```
Mobile Card:
┌──────────────────────────┐
│ John Doe                  │
│ john@example.com          │
│ 9876543210                │
│ ┌───────────┬───────────┐│
│ │ ✏️  Edit   │ 👁️  View  ││  ← Icon + Text
│ └───────────┴───────────┘│
└──────────────────────────┘
```

**Features**:
- Icon + text for clarity
- Full width buttons
- Same color scheme
- Touch-friendly sizing

---

### 4. Pagination (Centered)

```
Desktop:
┌────────────────────────────────────────────────┐
│  [← Previous]  1  [2]  3  ...  10  [Next →]   │
│      Page 2 of 10 • Total 100 entries          │
└────────────────────────────────────────────────┘
        ↑        ↑                      ↑
   Navigation  Active               Info bar
              (gradient)

Mobile:
┌──────────────────────────────────────┐
│    [←]  1  [2]  3  ...  10  [→]     │
│    Page 2 of 10 • Total 100          │
└──────────────────────────────────────┘
     ↑                            ↑
  Icons only              Abbreviated
```

**Features**:
- Fully centered layout
- Active page highlighted
- Previous/Next with arrows
- Info below pagination
- Responsive text hiding

---

## 🎨 Color Coding

### Action Buttons

**Edit Button** (Blue):
```
Normal:     ┌─────────┐
            │    ✏️    │  Border: #3b82f6
            │  (blue)  │  Background: white
            └─────────┘

Hover:      ┌─────────┐
            │    ✏️    │  Border: #3b82f6
            │ (white)  │  Background: #3b82f6
            └─────────┘  ↑ Lifted with shadow
```

**View Button** (Green):
```
Normal:     ┌─────────┐
            │    👁️    │  Border: #10b981
            │ (green)  │  Background: white
            └─────────┘

Hover:      ┌─────────┐
            │    👁️    │  Border: #10b981
            │ (white)  │  Background: #10b981
            └─────────┘  ↑ Lifted with shadow
```

---

### Status Badges

```
Interested/Hired:
┌──────────────┐
│  INTERESTED  │  Green: #d1fae5 bg, #065f46 text
└──────────────┘

Pending:
┌──────────────┐
│   PENDING    │  Yellow: #fef3c7 bg, #92400e text
└──────────────┘

Scheduled:
┌──────────────┐
│  SCHEDULED   │  Blue: #dbeafe bg, #1e40af text
└──────────────┘

Not Interested:
┌──────────────────┐
│ NOT INTERESTED   │  Red: #fee2e2 bg, #991b1b text
└──────────────────┘
```

---

### Pagination Buttons

```
Normal Page:
┌─────┐
│  3  │  White bg, gray border, gray text
└─────┘

Hover:
┌─────┐
│  3  │  White bg, blue border, blue text
└─────┘  ↑ Slightly lifted

Active Page:
┌─────┐
│  2  │  Blue gradient bg, white text
└─────┘  Shadow underneath
```

---

## 📏 Spacing & Sizing

### Action Buttons
```
┌───────────────┐
│   Padding:    │  0.5rem (top/bottom)
│   0.625rem    │  0.625rem (left/right)
│               │  
│  Height: 38px │
│  Min-width:   │
│     38px      │
└───────────────┘
```

### Pagination Buttons
```
Page Numbers:
┌────────┐
│   1    │  38px × 38px minimum
└────────┘

Previous/Next:
┌──────────────┐
│ ← Previous   │  Auto width with padding
└──────────────┘
```

---

## 🎬 Animations

### Button Hover
```
State Change Timeline:
0ms   → Normal state
200ms → Hover complete

Properties animated:
- background-color (0.2s cubic-bezier)
- color (0.2s cubic-bezier)
- transform (0.2s cubic-bezier)
- box-shadow (0.2s cubic-bezier)
```

### Row Hover
```
Table Row:
Normal → Hover (150ms ease)

Effects:
- Background: transparent → #f8fafc
- Transform: scale(1) → scale(1.001)
- Shadow: none → subtle shadow
```

---

## 📐 Responsive Breakpoints

### 640px Breakpoint

**Above 640px**:
- Show entries: Right aligned
- Action buttons: Icon only
- Pagination: Text + Icons
- Table: Full width scroll

**Below 640px**:
- Show entries: Full width
- Action buttons: Icon + Text
- Pagination: Icons only
- Cards: Stacked layout

---

## 🔍 Interactive States

### Dropdown (Show Entries)

```
Default:
┌──────────┐
│  10   ▼ │  Border: #e5e7eb
└──────────┘

Hover:
┌──────────┐
│  10   ▼ │  Border: #3b82f6, Background: #f8fafc
└──────────┘

Focus:
┌──────────┐
│  10   ▼ │  Border: #3b82f6, Focus ring
└──────────┘
```

### Pagination Buttons

```
Enabled:
┌──────┐
│  →   │  Clickable, hover effects
└──────┘

Disabled:
┌──────┐
│  →   │  40% opacity, not clickable
└──────┘
```

---

## ✨ Key Features Highlighted

### 1. **Icon-Only Actions (Desktop)**
- ✏️ Edit (Blue pencil icon)
- 👁️ View (Green eye icon)
- Tooltips show on hover
- Smooth color transitions

### 2. **Smart Pagination**
- Always centered
- Shows nearby pages
- Ellipsis for gaps
- Active page stands out

### 3. **Professional Polish**
- Gradient table header
- Hover lift effects
- Smooth transitions
- Consistent spacing

### 4. **Mobile Optimized**
- Touch-friendly buttons
- Icon + text labels
- Responsive hiding
- Card-based layout

---

## 🎯 User Experience Flow

### Finding and Editing a Candidate:

```
1. User scans table
   ↓
2. Hovers over row (background changes)
   ↓
3. Sees blue ✏️ icon in Actions
   ↓
4. Hovers icon (fills blue, lifts)
   ↓
5. Tooltip shows "Edit Candidate"
   ↓
6. Clicks → Navigates to edit page
```

### Changing Items Per Page:

```
1. Looks at top right
   ↓
2. Sees "Show entries: 10"
   ↓
3. Clicks dropdown
   ↓
4. Selects 25
   ↓
5. Table updates immediately
   ↓
6. Pagination recalculates
```

---

## 💡 Pro Tips

**For Users**:
- Hover over icons to see what they do (tooltips)
- Use show entries dropdown to view more/less items
- Active page is highlighted in blue
- Click page numbers to jump directly

**For Developers**:
- Icons are from `lucide-react` package
- All colors use CSS custom properties
- Transitions use cubic-bezier for smoothness
- Layout uses flexbox for responsiveness

---

**Last Updated**: December 9, 2025
**Version**: 2.0 (Professional Redesign)
