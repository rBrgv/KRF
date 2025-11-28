# Progress Photos Storage Policies - Quick Setup

## ⚠️ Current Issue

You have policies that are:
- ❌ Too specific (checking for exact folder names like `ubj8dd_0`)
- ❌ For `anon` users (should be for `authenticated` users)
- ❌ Not matching our folder structure

## ✅ Correct Setup

### Step 1: Delete Existing Policies

In Supabase Dashboard → Storage → Policies for `progress-photos`:
1. Delete all existing policies (the ones with `ubj8dd_0`, `ubj8dd_1`, etc.)

### Step 2: Run the Migration

Run this SQL in Supabase Dashboard → SQL Editor:

```sql
-- File: supabase/migrations/024_setup_progress_photos_storage_policies.sql
```

Or copy-paste the policies from that file.

### Step 3: Verify Bucket Settings

1. Go to Storage → `progress-photos` bucket
2. Ensure it's set to **Public**
3. RLS should be **Enabled**

## 📋 What the Correct Policies Do

1. **Clients can upload own photos** - Clients can only upload to their own folder (`{clientId}/...`)
2. **Clients can view own photos** - Clients can only see their own photos
3. **Admins can view all photos** - Trainers/admins can see all client photos
4. **Admins can upload photos** - Trainers/admins can upload for any client
5. **Clients can delete own photos** - Clients can delete their own photos
6. **Admins can delete photos** - Trainers/admins can delete any photos
7. **Public can view progress photos** - Allows public URLs to work (for displaying in UI)

## 🎯 Folder Structure

Our implementation uses:
```
progress-photos/
  └── {clientId}/
      └── {date}/
          └── {viewType}_{timestamp}.{ext}
```

Example:
```
progress-photos/
  └── abc123-def456/
      └── 2025-01-15/
          └── front_1705320000000.jpg
```

## ✅ After Setup

1. Try uploading a photo again
2. Check browser console if it still fails
3. Verify the photo appears in Storage → `progress-photos` bucket

---

**The migration file `024_setup_progress_photos_storage_policies.sql` contains all the correct policies!**



