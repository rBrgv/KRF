# Supabase Storage Setup for Event Images

To enable file uploads for event images, you need to set up a storage bucket in Supabase.

## Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Create Storage Bucket**
   - Go to **Storage** in the left sidebar
   - Click **New bucket**
   - Name: `event-images`
   - Make it **Public** (so images can be accessed via URL)
   - Click **Create bucket**

3. **Set Bucket Policies (Optional but Recommended)**
   - Go to **Storage** > **Policies** for the `event-images` bucket
   - Add a policy to allow authenticated users to upload:
     - Policy name: `Allow authenticated uploads`
     - Allowed operation: `INSERT`
     - Target roles: `authenticated`
     - Policy definition:
       ```sql
       (bucket_id = 'event-images'::text) AND (auth.role() = 'authenticated'::text)
       ```
   - Add a policy to allow public read access:
     - Policy name: `Allow public read`
     - Allowed operation: `SELECT`
     - Target roles: `public`
     - Policy definition:
       ```sql
       (bucket_id = 'event-images'::text)
       ```

4. **Test the Upload**
   - Go to your dashboard and try creating/editing an event
   - You should now be able to upload images from your computer

## Alternative: Using Public Folder (Not Recommended for Production)

If you prefer not to use Supabase Storage, you can modify the upload route to save files to the `public/events` folder. However, this is not recommended for production as:
- Files are committed to git
- No automatic CDN
- Harder to manage and scale

For production, Supabase Storage is the recommended approach.




