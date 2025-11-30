# Admin System Quick Setup & Testing Guide

## Prerequisites
- PostgreSQL database configured (Supabase)
- Backend and frontend properly configured

## Step 1: Run Database Migration

Execute the SQL migration script to add admin system fields:

```bash
# Connect to your Supabase PostgreSQL database using psql or the Supabase SQL editor
# Then run the migration script:
```

```sql
-- Copy contents from: doc/migrations/module17_admin_system.sql
-- Or run directly:
\i doc/migrations/module17_admin_system.sql
```

This will:
- Add `role` and `status` columns to `users` table
- Update `products` table status field
- Create admin user: `admin@glyzier.com` / `admin123`

## Step 2: Start the Backend

```bash
cd glyzier-backend
./mvnw spring-boot:run
```

Backend will start on: http://localhost:8080

## Step 3: Start the Frontend (Development Mode)

```bash
cd glyzier-frontend
npm install
npm run dev
```

Frontend will start on: http://localhost:5173

## Step 4: Login as Admin

1. Open browser: http://localhost:5173
2. Navigate to Login page
3. Login with admin credentials:
   - Email: `admin@glyzier.com`
   - Password: `admin123`

## Step 5: Access Admin Panel

After login, navigate to:
- Dashboard: http://localhost:5173/admin/dashboard
- Users: http://localhost:5173/admin/users
- Products: http://localhost:5173/admin/products
- Categories: http://localhost:5173/admin/categories

## Testing Checklist

### ✅ Admin Dashboard
- [ ] View dashboard stats (users, products, orders, revenue)
- [ ] Verify stats are accurate
- [ ] Sidebar navigation works

### ✅ User Management
- [ ] View all users in table
- [ ] User roles display correctly (USER, SELLER, ADMIN)
- [ ] User status displays correctly (ACTIVE, BANNED)
- [ ] Ban a test user
- [ ] Verify banned user cannot login
- [ ] Unban the user
- [ ] Verify unbanned user can login again

### ✅ Product Moderation
- [ ] View all products in table
- [ ] Product status displays correctly (ACTIVE, DELETED)
- [ ] Remove (soft delete) a test product
- [ ] Verify product is hidden from public listings
- [ ] Restore the product
- [ ] Verify product is visible again

### ✅ Authorization
- [ ] Login as regular user
- [ ] Try accessing `/admin/dashboard` (should redirect to home)
- [ ] Verify admin API calls return 401/403

## Testing Banned User Flow

1. Create a test user (if you don't have one):
```bash
# Register at http://localhost:5173/register
# Email: test@example.com
# Password: test123
```

2. Login as admin and ban the test user

3. Logout and try to login as the banned user:
```
Email: test@example.com
Password: test123
```

Expected: Login should fail with "User account has been banned"

4. Login as admin and unban the user

5. Try logging in as the test user again

Expected: Login should succeed

## Testing Product Soft Delete

1. Login as admin

2. Go to Products page: http://localhost:5173/admin/products

3. Find a test product and click "Remove"

4. Logout and go to home page

5. Verify the removed product is not visible

6. Login as admin and go to Products page

7. Click "Restore" on the removed product

8. Logout and verify product is visible again on home page

## Troubleshooting

### Admin login fails
- Check database: `SELECT * FROM users WHERE email = 'admin@glyzier.com';`
- Verify role is 'ADMIN' and status is 'ACTIVE'
- Check BCrypt password hash is correct

### Cannot access admin pages
- Check browser console for errors
- Verify JWT token is valid and not expired
- Check that user object in localStorage has `role: 'ADMIN'`

### Ban/Unban not working
- Check backend logs for errors
- Verify AdminController endpoints are accessible
- Check database status field updates

### Products not hiding after removal
- Check product status in database: `SELECT pid, productname, status FROM products;`
- Verify status changed to 'DELETED'
- Check frontend product filtering logic

## API Testing with cURL

### Get Dashboard Stats
```bash
# Login first to get token
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:8080/api/admin/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

### Get All Users
```bash
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

### Ban User
```bash
curl -X POST http://localhost:8080/api/admin/users/2/ban \
  -H "Authorization: Bearer $TOKEN"
```

### Get All Products
```bash
curl -X GET http://localhost:8080/api/admin/products \
  -H "Authorization: Bearer $TOKEN"
```

### Remove Product
```bash
curl -X DELETE http://localhost:8080/api/admin/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Success Criteria

✅ Admin can login and access admin panel
✅ Dashboard displays accurate statistics
✅ Admin can view all users and their roles
✅ Admin can ban/unban users successfully
✅ Banned users cannot login
✅ Admin can view all products including deleted ones
✅ Admin can soft delete and restore products
✅ Deleted products are hidden from public view
✅ Regular users cannot access admin pages
✅ Categories page displays hardcoded categories

## Next Steps

After verifying all functionality:
1. Update API_DOCUMENTATION.md with admin endpoints
2. Document any bugs or issues found
3. Proceed to Module 18 (Community Feed)

---

**Last Updated**: November 29, 2025
**Module**: 17 - Admin System
**Status**: Ready for Testing
