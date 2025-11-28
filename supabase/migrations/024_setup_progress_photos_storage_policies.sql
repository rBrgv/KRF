-- ============================================================================
-- STORAGE POLICIES FOR PROGRESS PHOTOS BUCKET
-- ============================================================================
-- These policies allow clients to upload/view their own photos and
-- admins/trainers to view all photos

-- First, drop any existing policies on the progress-photos bucket
DROP POLICY IF EXISTS "Clients can upload own photos" ON storage.objects;
DROP POLICY IF EXISTS "Clients can view own photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Clients can delete own photos" ON storage.objects;

-- Policy 1: Allow clients to upload photos to their own folder
-- Folder structure: {clientId}/{date}/{viewType}_{timestamp}.{ext}
CREATE POLICY "Clients can upload own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'progress-photos' AND
  (storage.foldername(name))[1] = (
    SELECT id::text FROM clients WHERE user_id = auth.uid()
  )
);

-- Policy 2: Allow clients to view their own photos
CREATE POLICY "Clients can view own photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'progress-photos' AND
  (storage.foldername(name))[1] = (
    SELECT id::text FROM clients WHERE user_id = auth.uid()
  )
);

-- Policy 3: Allow admins/trainers to view all photos
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

-- Policy 4: Allow admins/trainers to upload photos for any client
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

-- Policy 5: Allow clients to delete their own photos
CREATE POLICY "Clients can delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'progress-photos' AND
  (storage.foldername(name))[1] = (
    SELECT id::text FROM clients WHERE user_id = auth.uid()
  )
);

-- Policy 6: Allow admins/trainers to delete any photos
CREATE POLICY "Admins can delete photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'progress-photos' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'trainer')
  )
);

-- Policy 7: Allow public read access (for displaying photos in UI)
-- This is needed because photos need to be accessible via public URLs
CREATE POLICY "Public can view progress photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'progress-photos');



