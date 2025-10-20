# Module 6 - Quick Reference Guide

## 🎯 What Was Built

Module 6 implements a complete authentication system with:
- User registration and login
- Protected routes
- Global authentication state
- Session persistence

---

## 📁 File Structure

```
glyzier-frontend/src/
├── services/
│   ├── api.js                    # ✅ Module 5 - Axios instance with interceptors
│   └── authService.js            # ✅ NEW - Login, register, logout functions
│
├── context/
│   └── AuthContext.jsx           # ✅ NEW - Global auth state (user, isAuthenticated)
│
├── components/
│   └── ProtectedRoute.jsx        # ✅ NEW - Wraps protected pages
│
├── pages/
│   ├── HomePage.jsx              # ✅ UPDATED - Shows different content for guests/users
│   ├── LoginPage.jsx             # ✅ UPDATED - Full authentication integration
│   ├── RegisterPage.jsx          # ✅ UPDATED - Full registration integration
│   └── DashboardPage.jsx         # ✅ UPDATED - Displays real user info
│
├── styles/
│   └── common.js                 # ✅ NEW - Reusable style objects
│
└── App.jsx                       # ✅ UPDATED - AuthProvider wrapper, protected routes
```

---

## 🔄 Authentication Flow

### 1️⃣ Registration Flow
```
User fills form → RegisterPage
    ↓
Validates inputs (client-side)
    ↓
Calls register() from AuthContext
    ↓
AuthContext calls authService.register()
    ↓
authService sends POST to /api/auth/register
    ↓
Success: Show message → Redirect to /login
    ↓
Error: Display error message
```

### 2️⃣ Login Flow
```
User enters credentials → LoginPage
    ↓
Calls login() from AuthContext
    ↓
AuthContext calls authService.login()
    ↓
authService sends POST to /api/auth/login
    ↓
Backend returns JWT token + user info
    ↓
Token saved to localStorage
    ↓
AuthContext updates global state
    ↓
User redirected to /dashboard
```

### 3️⃣ Protected Route Flow
```
User tries to access /dashboard
    ↓
ProtectedRoute checks isAuthenticated from AuthContext
    ↓
Is authenticated?
    ├─ YES → Render DashboardPage
    └─ NO → Redirect to /login (with return URL)
```

### 4️⃣ Session Persistence Flow
```
User refreshes page or opens new tab
    ↓
AuthProvider runs useEffect on mount
    ↓
Checks localStorage for token and user info
    ↓
If found → Restore auth state
    ↓
If not found → User remains logged out
```

### 5️⃣ Logout Flow
```
User clicks Logout button
    ↓
Calls logout() from AuthContext
    ↓
AuthContext calls authService.logout()
    ↓
authService clears localStorage
    ↓
AuthContext resets state (user = null, isAuthenticated = false)
    ↓
User redirected to home page
```

---

## 🔧 How Components Work Together

### App.jsx (Root Component)
```jsx
<AuthProvider>                     // Provides auth state to all children
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />              // Public
      <Route path="/login" element={<LoginPage />} />        // Public
      <Route path="/register" element={<RegisterPage />} />  // Public
      
      <Route path="/dashboard" element={                     // Protected
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

### Any Page Component
```jsx
import { useAuth } from '../context/AuthContext.jsx';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user.displayname}!</div>;
  }
  
  return <div>Please log in</div>;
}
```

---

## 🔑 Key Concepts

### localStorage
Where user data is stored for session persistence:
- `token` - JWT token string
- `user` - JSON string of user object: `{ uid, displayname, email }`

### AuthContext State
Global state available to all components:
- `user` - Current user object or `null`
- `isAuthenticated` - `true` or `false`
- `loading` - `true` during initial auth check
- `login()` - Function to log in
- `register()` - Function to register
- `logout()` - Function to log out

### Axios Interceptor (from Module 5)
Automatically adds JWT token to all API requests:
```javascript
config.headers.Authorization = `Bearer ${token}`;
```

---

## 📡 Backend API Integration

### Login Endpoint
**Request:**
```javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "uid": 1,
  "displayname": "John Doe",
  "email": "user@example.com"
}
```

### Register Endpoint
**Request:**
```javascript
POST /api/auth/register
{
  "displayname": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```javascript
{
  "message": "User registered successfully",
  "uid": 1
}
```

---

## 🎨 Styling System

### Modular Styles (styles/common.js)
Provides reusable style objects:

```javascript
import { buttonPrimary, card, alertError } from '../styles/common.js';

<button style={buttonPrimary}>Click Me</button>
<div style={card}>Content</div>
<div style={alertError}>Error message</div>
```

### Available Styles:
- **Buttons:** `buttonPrimary`, `buttonSecondary`, `buttonDanger`, `buttonDisabled`
- **Cards:** `card`, `cardHover`
- **Forms:** `formGroup`, `label`, `input`, `inputError`
- **Alerts:** `alertError`, `alertSuccess`, `alertWarning`
- **Layout:** `container`, `centerContainer`, `flexRow`, `flexColumn`, `grid`
- **Typography:** `heading1`, `heading2`, `heading3`, `link`, `textMuted`
- **Utilities:** `mt1`, `mt2`, `mt3`, `mb1`, `mb2`, `mb3`, `textCenter`

### Easy to Replace
All inline styles can be easily replaced with:
1. CSS Modules
2. Styled Components
3. Tailwind CSS
4. Material-UI
5. Custom Figma designs

---

## ✅ Testing Checklist

- [ ] Start backend server (port 8080)
- [ ] Start frontend dev server (port 5173)
- [ ] Open http://localhost:5173 in browser
- [ ] Click "Register" and create a new account
- [ ] Verify success message appears
- [ ] Wait for redirect to login page
- [ ] Enter credentials and log in
- [ ] Verify redirect to dashboard
- [ ] Check that user info is displayed correctly
- [ ] Click "Logout" button
- [ ] Verify redirect to home page
- [ ] Try accessing /dashboard directly
- [ ] Verify redirect to /login
- [ ] Log in again
- [ ] Verify redirect back to /dashboard
- [ ] Refresh the page
- [ ] Verify you remain logged in
- [ ] Close tab and reopen
- [ ] Verify session persists

---

## 🐛 Troubleshooting

### Issue: "Failed to parse source for import analysis"
**Solution:** Ensure files with JSX use `.jsx` extension, not `.js`

### Issue: Login not working
**Solution:** 
1. Check backend is running on port 8080
2. Check browser console for errors
3. Verify credentials are correct
4. Check network tab for API responses

### Issue: Protected routes not working
**Solution:**
1. Check localStorage for `token` (DevTools → Application → Local Storage)
2. Verify AuthProvider wraps the entire app
3. Check ProtectedRoute is used correctly

### Issue: Session not persisting
**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Log in again
3. Check localStorage contains `token` and `user`

### Issue: CORS errors
**Solution:**
1. Verify backend CORS configuration allows localhost:5173
2. Check SecurityConfig.java in backend

---

## 🚀 Next Steps

### Module 7: Product & Seller Views
- Create ProductService
- Update HomePage with product grid
- Create Product Detail Page
- Add "Place Order" button
- Implement product browsing

### Module 8: Order & Seller Features
- Create OrderService and SellerService
- Implement order placement
- Display order history
- Seller registration flow
- Seller dashboard with product management

---

## 📚 Additional Resources

### Files to Read:
1. `MODULE_6_SUMMARY.md` - Detailed implementation guide
2. `MODULE_6_COMPLETION_SUMMARY.md` - This completion summary
3. `glyzier-frontend/src/services/authService.js` - Authentication logic
4. `glyzier-frontend/src/context/AuthContext.jsx` - Global state management

### Key Patterns Used:
- React Context API for global state
- Protected routes pattern
- JWT authentication
- Session persistence with localStorage
- Axios interceptors
- Async/await error handling

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the error messages in browser console
3. Check the network tab for API responses
4. Verify backend server is running
5. Ensure database is properly configured

---

**Module 6 Complete! 🎉**

**Ready for Module 7!** ✅
