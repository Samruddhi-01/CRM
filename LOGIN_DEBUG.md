# Login Debug Guide

## 🔍 401 Unauthorized Error Analysis

### ✅ Current Status
- **API URL**: ✅ Correctly pointing to `https://crmapi.zerlak.com/api/auth/login`
- **Request Format**: ✅ Correctly sending `username` and `password`
- **Frontend Code**: ✅ Properly configured

### 🚨 Possible Causes of 401 Error

1. **Invalid Credentials**
   - Username or password is incorrect
   - Case sensitivity issues
   - Extra spaces in username/password

2. **Backend Database Issues**
   - User not found in database
   - User account deactivated
   - Database connection issues

3. **Field Mismatch**
   - Backend expects `username` but receiving different field name
   - ✅ **CHECKED**: Frontend sends correct field names

### 🔧 Debugging Steps

#### 1. Check Browser Console
Open browser dev tools (F12) and check:
- Console tab for detailed error messages
- Network tab for request/response details
- Look for "Login error details" message

#### 2. Test with Known Credentials
Try logging in with:
- **Username**: admin
- **Password**: admin123

#### 3. Check Backend Response
In Network tab, examine the login response:
- Status: 401 Unauthorized
- Response body: Should contain error message

#### 4. Verify User Exists
Check if user exists in production database with correct status.

### 📋 Expected Request Format
```json
{
  "username": "your-username",
  "password": "your-password"
}
```

### 📋 Expected Response Format
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  }
}
```

### 🚨 Common Issues
1. **Using email instead of username**
   - Label says "Email ID" but field name is `username`
   - ✅ **CHECKED**: Field name is correct

2. **Database not synchronized**
   - Production database might not have test users
   - Need to create users in production

3. **Account deactivated**
   - User exists but account is deactivated
   - Should show specific error message

### 🛠️ Next Steps
1. Try with default admin credentials
2. Check browser console for detailed error
3. Verify user exists in production database
4. Contact backend team if credentials are correct
