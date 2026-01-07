# HR PERFORMANCE ANALYTICS - QUICK START GUIDE

## 🚀 Getting Started in 3 Steps

### Step 1: Database Setup (Required)

Open your MySQL client and run:

```sql
USE privateappdb;

-- Add new columns
ALTER TABLE candidates
ADD COLUMN hr_remark TEXT COMMENT 'Remark added by HR who created the candidate',
ADD COLUMN admin_remark TEXT COMMENT 'Remark added by Admin for internal tracking';

-- Add indexes for performance
CREATE INDEX idx_candidates_source_hr ON candidates(source_hr_id);
CREATE INDEX idx_candidates_status_hr ON candidates(status, source_hr_id);
```

**Verify:**
```sql
DESCRIBE candidates;
-- You should see hr_remark and admin_remark columns
```

### Step 2: Restart Backend

```powershell
cd server
.\start.bat
# or
mvn spring-boot:run
```

**Expected Console Output:**
```
Mapped "{[/api/admin/hr-performance/overview],methods=[GET]}"
Mapped "{[/api/admin/hr-performance/{hrId}/candidates],methods=[GET]}"
Mapped "{[/api/hr/candidates],methods=[GET]}"
```

### Step 3: Restart Frontend

```powershell
cd e:\Startica\Staetica copy\startica-co
npm start
```

## ✅ Testing the Feature

### As ADMIN:

1. **Login** as admin
2. **Sidebar** → Click "HR Performance" (📊 icon)
3. **View HR Cards** showing metrics
4. **Click** "View Candidates" on any HR card
5. **Test Features:**
   - Search candidates
   - Filter by status
   - Edit Admin Remark (click ✎ icon)
   - Change Status (click ✎ on status badge)
   - View HR Remarks (read-only)

### As HR:

1. **Login** as HR user
2. **Verify** "HR Performance" is NOT in sidebar
3. **Navigate** to Candidates page
4. **Test Features:**
   - View your own candidates
   - Add/Edit HR Remarks
   - Change Status
   - Verify you cannot see Admin Remarks

## 🔧 Troubleshooting

### Backend Issues

**Error:** `Column 'hr_remark' not found`
**Solution:** Run the SQL migration script

**Error:** `Access Denied`
**Solution:** Check JWT token and role in request

**Error:** `Candidate not found`
**Solution:** Ensure candidate exists and belongs to the HR

### Frontend Issues

**Error:** Cannot find module 'hrPerformanceSlice'
**Solution:** Clear npm cache: `npm cache clean --force && npm install`

**Error:** HR Performance page not loading
**Solution:** Check browser console, verify Redux store includes hrPerformance

**Error:** Sidebar doesn't show HR Performance
**Solution:** Ensure logged in as ADMIN, not HR

## 📊 What You'll See

### Admin Dashboard
```
┌─────────────────────────────────────────────┐
│   HR Performance Analytics                  │
│   Monitor HR team performance              │
└─────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Rahul S.   │  │   Priya K.   │  │   Amit P.    │
│ rahul@co.com │  │ priya@co.com │  │ amit@co.com  │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ Total: 12    │  │ Total: 8     │  │ Total: 15    │
│ Hired: 3     │  │ Hired: 2     │  │ Hired: 5     │
│ Contacted: 6 │  │ Contacted: 4 │  │ Contacted: 8 │
│ Pending: 3   │  │ Pending: 2   │  │ Pending: 2   │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ [View →]     │  │ [View →]     │  │ [View →]     │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Candidate Detail Table
```
┌────────────────────────────────────────────────────────────────────┐
│ Candidates - Rahul Sharma                                          │
│ 12 total candidates                                                │
├────────────────────────────────────────────────────────────────────┤
│ Search: [___________] [Filter: All Status ▼]                      │
├────────┬──────────┬──────────┬────────┬──────────┬───────────┬────┤
│ Name   │ Contact  │ Profile  │ Status │ HR Remark│ Admin Rem │... │
├────────┼──────────┼──────────┼────────┼──────────┼───────────┼────┤
│ John D.│ john@... │ Sr. Dev  │ HIRED  │ Great... │ [Edit ✎]  │... │
│ Sara K.│ sara@... │ Jr. Dev  │ CONTACTED│ Called │ [Edit ✎]  │... │
└────────┴──────────┴──────────┴────────┴──────────┴───────────┴────┘
```

## 🎯 Key Features Working

✅ **Role-Based Access**
- ADMIN sees all HR and candidates
- HR sees only their own candidates

✅ **Remark System**
- HR adds HR Remarks
- ADMIN adds Admin Remarks
- Proper visibility control

✅ **Status Management**
- Both ADMIN and HR can update
- Real-time updates
- Color-coded badges

✅ **Search & Filter**
- Search by name, email, phone
- Filter by status
- Pagination support

## 📞 Quick Help

**Cannot see HR Performance in sidebar?**
→ You must be logged in as ADMIN

**HR Remark not saving?**
→ Ensure you're editing your own candidate

**Admin Remark visible to HR?**
→ This is a bug - admin remarks should never appear for HR

**Database columns not found?**
→ Run the migration SQL script

## 🎓 Usage Examples

### Admin: Add Admin Remark
1. Navigate to HR Performance
2. Click on any HR card
3. Find candidate row
4. Click ✎ icon in Admin Remark column
5. Type your remark
6. Click "Save"

### HR: Add HR Remark
1. Go to Candidates page
2. Find your candidate
3. Click ✎ icon in HR Remark column
4. Type your remark
5. Click "Save"

### Change Status
1. Click ✎ icon next to status badge
2. Select new status from dropdown
3. Click ✓ to save

## 📋 API Testing (Optional)

### Using Postman/Curl

**Get HR Overview:**
```bash
curl -X GET http://localhost:8080/api/admin/hr-performance/overview \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Update Admin Remark:**
```bash
curl -X PUT http://localhost:8080/api/admin/hr-performance/candidates/1/admin-remark \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"adminRemark": "Strong candidate, proceed to interview"}'
```

**HR Get My Candidates:**
```bash
curl -X GET http://localhost:8080/api/hr/candidates \
  -H "Authorization: Bearer YOUR_HR_TOKEN"
```

---

## ✅ Success Checklist

- [ ] Database migration completed
- [ ] Backend server restarted successfully
- [ ] Frontend running without errors
- [ ] Admin can see HR Performance in sidebar
- [ ] HR cannot see HR Performance in sidebar
- [ ] Admin can view all HRs
- [ ] Admin can drill down into HR candidates
- [ ] Admin can edit Admin Remarks
- [ ] Admin can change candidate status
- [ ] HR can see only their candidates
- [ ] HR can edit HR Remarks
- [ ] HR can change candidate status
- [ ] HR cannot see Admin Remarks

**All checkboxes ticked? You're ready to use the system!** 🎉

---

**Need more help?** Check `HR-PERFORMANCE-IMPLEMENTATION-COMPLETE.md` for detailed documentation.
