# Fix: "Failed to create notification" Error

## Problem
When trying to compose an email, you get "Failed to create notification" error. This is because the database constraint doesn't allow the 'general' notification type yet.

## Solution

### Option 1: Run Migration in Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste this SQL:

```sql
-- Drop the old constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Add the new constraint with 'general' type
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
  CHECK (type IN ('appointment_reminder', 'payment_reminder', 'membership_expiry', 'general'));
```

4. Click **Run** to execute

### Option 2: Use Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db push
```

This will apply all pending migrations including `018_update_notifications_type.sql`.

### Option 3: Direct SQL Query

Run this in your Supabase SQL Editor:

```sql
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
  CHECK (type IN ('appointment_reminder', 'payment_reminder', 'membership_expiry', 'general'));
```

## Verify Fix

After running the migration, try composing an email again. The error should be resolved.

## If Still Having Issues

Check the browser console (F12) for detailed error messages. The API now provides more specific error details.




