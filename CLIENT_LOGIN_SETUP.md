# Client Login Setup Guide

## How Clients Can Log In

Clients can log in using the same login page as admins: `/auth/login`

The system automatically redirects them based on their role:
- **Clients** → `/portal` (Client Portal)
- **Admins/Trainers** → `/dashboard` (Admin Dashboard)

## Setup Process

### Option 1: Client Self-Signup (Recommended for Production)

1. Client goes to `/auth/signup`
2. Creates account with email and password
3. System automatically:
   - Creates `user_profiles` entry with `role = 'client'`
   - Client can then be linked to a `clients` record by admin

### Option 2: Admin Creates Client Account (For Existing Clients)

1. **Create Auth User** (via Supabase Dashboard or API):
   - Go to Supabase Dashboard > Authentication > Users
   - Click "Add User"
   - Enter client's email and set a temporary password
   - User will receive email to set their password

2. **Link Client to User**:
   - Go to Dashboard > Clients > [Select Client]
   - Update the client record to link `user_id` to the auth user
   - Or run SQL:
     ```sql
     UPDATE clients 
     SET user_id = 'AUTH_USER_ID' 
     WHERE id = 'CLIENT_ID';
     ```

3. **Ensure Role is Set**:
   - Update user profile to have `role = 'client'`:
     ```sql
     UPDATE user_profiles 
     SET role = 'client' 
     WHERE id = 'AUTH_USER_ID';
     ```

## For Test Clients

To set up test clients for login:

1. **Create Auth Users** in Supabase Dashboard:
   - `amit.patel@example.com` (password: `test123456`)
   - `anjali.mehta@example.com` (password: `test123456`)
   - `rahul.verma@example.com` (password: `test123456`)

2. **Run Migration 014** to link them automatically:
   ```sql
   -- Migration 014_setup_client_accounts.sql will link them
   ```

3. **Test Login**:
   - Go to `/auth/login`
   - Use client email and password
   - Should redirect to `/portal`

## Login Flow

1. Client visits `/auth/login`
2. Enters email and password
3. System checks `user_profiles.role`:
   - If `role = 'client'` → Redirects to `/portal`
   - If `role = 'admin'` or `'trainer'` → Redirects to `/dashboard`
4. Portal checks if `user_id` is linked to a `clients` record
5. If linked, shows client data; if not, shows message to contact support

## Troubleshooting

### Client can't log in:
- Check if auth user exists in Supabase Auth
- Check if `user_profiles` has entry with correct role
- Check if `clients.user_id` is linked to auth user

### Client redirected to wrong place:
- Check `user_profiles.role` - should be `'client'`
- Check middleware is working correctly

### "Account not linked to client profile":
- Client's `user_id` in `clients` table is NULL
- Admin needs to link the client record to the auth user




