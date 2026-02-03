# Production API Setup Complete

## ✅ Changes Made

### Frontend Configuration Updated

1. **src/utils/api.js** - Already updated:
   ```javascript
   baseURL: 'https://crmapi.zerlak.com'
   ```

2. **src/utils/constants.js** - Updated:
   ```javascript
   export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://crmapi.zerlak.com';
   ```

3. **.env file** - Already configured:
   ```
   REACT_APP_API_URL=https://crmapi.zerlak.com
   ```

### Backend Configuration Updated

4. **SecurityConfig.java** - Added production domain to CORS:
   ```java
   configuration.setAllowedOrigins(List.of(
     "http://localhost:3000", 
     "http://localhost:4200", 
     "https://crm.zerlak.com"  // Added production domain
   ));
   ```

## 🌐 API Endpoints Structure

All API calls will now go to:
- **Base URL**: `https://crmapi.zerlak.com`
- **Authentication**: `https://crmapi.zerlak.com/api/auth/*`
- **Admin**: `https://crmapi.zerlak.com/api/admin/*`
- **HR**: `https://crmapi.zerlak.com/api/hr/*`
- **Candidates**: `https://crmapi.zerlak.com/api/candidates/*`

## 🔧 Configuration Notes

### Environment Variables
- `REACT_APP_API_URL` is set to production URL
- Falls back to `https://crmapi.zerlak.com` if not set

### CORS Configuration
- Backend now accepts requests from `https://crm.zerlak.com`
- Still supports localhost for development

### JWT Token Handling
- Tokens are stored in localStorage as `accessToken`
- Automatically attached to all API requests via interceptors

## 🚀 Ready for Production

The application is now configured to use the production API at `https://crmapi.zerlak.com`. 

### To Deploy:
1. Build the React app: `npm run build`
2. Deploy to production server
3. Ensure backend is running at `https://crmapi.zerlak.com`

### Development Mode:
- Still works with local backend if needed
- Change `.env` file to point to localhost for local development
