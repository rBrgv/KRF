# Photo Upload Troubleshooting Guide

## Common Issues and Solutions

### 1. "Storage bucket not found" Error

**Problem:** The `progress-photos` bucket doesn't exist in Supabase Storage.

**Solution:**
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `progress-photos`
4. Make it **Public**
5. Click "Create bucket"

### 2. "Permission denied" or RLS Policy Error

**Problem:** Row-Level Security (RLS) policies are blocking the upload.

**Solution:** Run these SQL policies in Supabase Dashboard → SQL Editor:

```sql
-- Allow clients to upload their own photos
CREATE POLICY "Clients can upload own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'progress-photos' AND
  (storage.foldername(name))[1] = (
    SELECT id::text FROM clients WHERE user_id = auth.uid()
  )
);

-- Allow clients to view their own photos
CREATE POLICY "Clients can view own photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'progress-photos' AND
  (storage.foldername(name))[1] = (
    SELECT id::text FROM clients WHERE user_id = auth.uid()
  )
);

-- Allow admins/trainers to view all photos
CREATE POLICY "Admins can view all photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'progress-photos' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'trainer')
  )
);

-- Allow admins/trainers to upload photos for any client
CREATE POLICY "Admins can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'progress-photos' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'trainer')
  )
);

-- Allow clients to delete their own photos
CREATE POLICY "Clients can delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'progress-photos' AND
  (storage.foldername(name))[1] = (
    SELECT id::text FROM clients WHERE user_id = auth.uid()
  )
);
```

### 3. "File size too large" Error

**Problem:** Photo exceeds 10MB limit.

**Solution:**
- Compress the image before uploading
- Use a photo editing app to reduce file size
- Maximum allowed size: 10MB

### 4. "File must be an image" Error

**Problem:** Uploaded file is not an image format.

**Solution:**
- Only image files are allowed (JPEG, PNG, WebP, GIF)
- Check the file extension and format

### 5. "Missing required fields" Error

**Problem:** Form data is incomplete.

**Solution:**
- Ensure all fields are filled: Date, View Type, and Photo file
- Check browser console for detailed error messages

### 6. Upload Succeeds but Photo Doesn't Appear

**Problem:** Photo uploaded but database entry failed.

**Solution:**
- Check browser console for errors
- Verify the photo was actually uploaded to Storage
- Try refreshing the page
- Check if the photo entry was created in the `progress_photos` table

## Quick Setup Checklist

- [ ] Database migration `023_add_progress_tracking_and_goals.sql` has been run
- [ ] `progress-photos` bucket exists in Supabase Storage
- [ ] Bucket is set to **Public**
- [ ] RLS policies are created (see above)
- [ ] Client account is linked to a client profile
- [ ] File size is under 10MB
- [ ] File is a valid image format

## Testing Steps

1. **Check Bucket Exists:**
   ```sql
   SELECT * FROM storage.buckets WHERE name = 'progress-photos';
   ```

2. **Check RLS Policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
   ```

3. **Test Upload via API:**
   - Use browser DevTools → Network tab
   - Watch for the `/api/progress/photos/upload` request
   - Check the response for error details

## Debug Mode

To see detailed error messages:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try uploading a photo
4. Check for error messages in console
5. Check Network tab for API response details

## Still Having Issues?

1. Check Supabase Dashboard → Storage → `progress-photos` bucket
2. Verify bucket is Public
3. Check Storage → Policies for correct RLS rules
4. Verify client is authenticated and linked to a client profile
5. Check browser console for JavaScript errors
6. Check Network tab for API error responses



