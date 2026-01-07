# Testing Guide - Education Fields Fix

## Quick Test Scenarios

### Scenario 1: Create & Edit Candidate with Custom Degree

#### Step 1: Create New Candidate
1. Navigate to "Add Candidate" form
2. Fill basic information (Name, Email, Phone, etc.)
3. Scroll to **Education Details** section
4. In **Degree/Qualification** dropdown, select **"Other (Specify)"**
5. Notice: A new field **"Specify Degree"** appears below
6. Enter: **"MBA"** in the custom degree field
7. Fill other education fields:
   - Specialization: "Finance"
   - Institution: "IIM Bangalore"
   - Passing Year: "2020"
   - Percentage: "8.5 CGPA"
8. Click **"Create Candidate"**
9. ✅ Success message should appear

#### Step 2: Edit the Same Candidate
1. Go to candidate list and click **Edit** on the candidate you just created
2. Scroll to **Education Details** section
3. **✅ VERIFY**: 
   - Degree dropdown shows: **"Other (Specify)"**
   - Custom degree field is visible and shows: **"MBA"**
   - Specialization shows: **"Finance"**
   - Institution shows: **"IIM Bangalore"**
   - Passing Year shows: **"2020"**
   - Percentage shows: **"8.5 CGPA"**
4. Change custom degree to **"BBA"**
5. Click **"Update Candidate"**
6. ✅ Success message should appear
7. Re-open for edit and verify "BBA" is displayed

---

### Scenario 2: Create & Edit Candidate with Predefined Degree

#### Step 1: Create New Candidate
1. Navigate to "Add Candidate" form
2. Fill basic information
3. In **Degree/Qualification** dropdown, select **"BTech"**
4. Notice: No custom degree field appears
5. Fill other education fields:
   - Specialization: "Computer Science"
   - Institution: "Anna University"
   - Passing Year: "2022"
   - Percentage: "85%"
6. Click **"Create Candidate"**

#### Step 2: Edit the Same Candidate
1. Go to candidate list and click **Edit**
2. Scroll to **Education Details** section
3. **✅ VERIFY**: 
   - Degree dropdown shows: **"BTech"**
   - Custom degree field is **NOT visible**
   - Specialization shows: **"Computer Science"**
   - Institution shows: **"Anna University"**
   - Passing Year shows: **"2022"**
   - Percentage shows: **"85%"**

---

### Scenario 3: Switch Between Predefined and Custom

#### Test Switching During Edit:
1. Open any candidate for edit
2. Change degree from **"BCA"** to **"Other (Specify)"**
3. ✅ VERIFY: Custom degree field appears immediately
4. Enter **"MBBS"** in custom field
5. Change back to **"MCA"**
6. ✅ VERIFY: Custom degree field disappears
7. Change to **"Other (Specify)"** again
8. ✅ VERIFY: Custom degree field is now empty (cleared when you switched to MCA)
9. Enter **"LLB"** 
10. Save and verify

---

### Scenario 4: Multiple Education Entries

#### Test Multiple Degrees:
1. Create/Edit a candidate
2. In Education section, click **"+ Add Another Education"**
3. Entry 1:
   - Degree: **"BTech"** (predefined)
   - Specialization: "Computer Science"
   - Institution: "NIT"
   - Passing Year: "2020"
4. Entry 2:
   - Degree: **"Other (Specify)"**
   - Custom Degree: **"MBA"**
   - Specialization: "Marketing"
   - Institution: "IIM"
   - Passing Year: "2022"
5. Save candidate
6. Re-open for edit
7. **✅ VERIFY**:
   - Entry 1 shows "BTech", no custom field, all data intact
   - Entry 2 shows "Other", custom field with "MBA", all data intact
8. Can add more entries independently

---

### Scenario 5: Employment History Loading

#### Test Employment Fields:
1. Create candidate with employment history
2. Select **"Yes"** for employment history
3. Add employment entry:
   - Company: "TCS"
   - Designation: "Software Engineer"
   - Start Year: "2018"
   - End Year: "2021"
4. Save candidate
5. Re-open for edit
6. **✅ VERIFY**:
   - Radio button **"Yes"** is selected
   - Employment entry shows all data correctly
   - Duration is calculated automatically

---

### Scenario 6: Edge Cases

#### Test 6a: Old Candidates (Before Custom Degree Feature)
1. Open a candidate created before this update
2. If they have a custom degree like "MBA" saved directly
3. **✅ VERIFY**: 
   - Dropdown automatically shows "Other"
   - Custom field shows their degree value
   - Can edit and save normally

#### Test 6b: Empty Custom Degree
1. Select "Other (Specify)"
2. Leave custom degree field empty
3. Try to save
4. **✅ VERIFY**: 
   - Required field validation should trigger
   - "Specify Degree *" indicates it's required

#### Test 6c: Very Long Degree Name
1. Select "Other (Specify)"
2. Enter very long name: "Bachelor of Business Administration in International Marketing"
3. Save and re-open
4. **✅ VERIFY**: Full name is preserved and displayed

---

## Browser Console Debugging

### How to Check Console Logs:
1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to **Console** tab
3. Edit a candidate
4. You should see logs like:

```
Loading candidate for edit: {firstName: "John", email: "john@example.com", ...}
Employment history from DB: [{"company":"TCS","designation":"Engineer",...}]
Parsed employment history: [...]
Parsed education from DB: [{"degree":"MBA","specialization":"Finance",...}]
Custom degree detected: "MBA" - setting to Other
Processed education entries: [{"degree":"Other","customDegree":"MBA",...}]
```

### What to Look For:
- ✅ "Loading candidate for edit" confirms data loaded
- ✅ "Parsed education from DB" shows raw database data
- ✅ "Custom degree detected" shows which degrees are custom
- ✅ "Processed education entries" shows final transformed data

---

## Common Issues & Solutions

### Issue 1: Custom Degree Field Not Showing
**Symptom**: Dropdown shows "Other" but custom field not visible
**Solution**: 
- Check if `entry.degree === 'Other'` in line 1291
- Verify React re-render is happening
- Check browser console for errors

### Issue 2: Custom Degree Not Saving
**Symptom**: Custom degree entered but not saved to database
**Solution**:
- Check submission logic at lines 588-597
- Verify custom degree is mapped correctly before save
- Check network tab for API payload

### Issue 3: Old Degree Values Not Loading
**Symptom**: Editing old candidate shows empty education
**Solution**:
- Check console logs for "Parsed education from DB"
- Verify JSON.parse is successful
- Check if `isCustomDegree()` function is working
- Verify backward compatibility logic (lines 371-425)

---

## Expected Behavior Summary

| Degree Value in DB | Dropdown Shows | Custom Field | Custom Field Value |
|-------------------|----------------|--------------|-------------------|
| "BCA" | BCA | Hidden | - |
| "BTech" | BTech | Hidden | - |
| "MBA" | Other (Specify) | Visible | MBA |
| "BBA" | Other (Specify) | Visible | BBA |
| "LLB" | Other (Specify) | Visible | LLB |
| "" (empty) | Select Degree | Hidden | - |

---

## Performance Testing

### Load Time Test:
1. Edit candidate with 5+ education entries
2. ✅ Form should load instantly (< 500ms)
3. All fields should be populated

### Interaction Test:
1. Switch between degrees rapidly
2. ✅ Custom field should show/hide smoothly
3. No lag or flickering

---

## Sign-Off Checklist

Before marking as complete, verify:

- [ ] Can create candidate with custom degree
- [ ] Can create candidate with predefined degree  
- [ ] Can edit candidate with custom degree - all fields load
- [ ] Can edit candidate with predefined degree - all fields load
- [ ] Can switch from predefined to custom during edit
- [ ] Can switch from custom to predefined during edit
- [ ] Multiple education entries work independently
- [ ] Employment history loads correctly
- [ ] Education gap loads correctly
- [ ] All fields (specialization, institution, year, percentage) load
- [ ] Console logs show expected output
- [ ] No errors in browser console
- [ ] No warnings in terminal (except 'errorData' unused)
- [ ] Old candidates (created before fix) still work

---

**Last Updated**: December 9, 2025
**Test Status**: Ready for QA
