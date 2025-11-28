# Storage Upload Debug Checklist

## ✅ Your Setup Looks Good!

You have:
- ✅ Bucket `progress-photos` exists
- ✅ Bucket is Public
- ✅ All 7 policies are set up correctly

## 🔍 Debug Steps

### 1. Check Browser Console
When you try to upload, check the browser console (F12) for:
- Any JavaScript errors
- Network tab → Look for `/api/progress/photos/upload` request
- Check the response for detailed error messages

### 2. Verify Client Link
Make sure the client is properly linked to the user account:
```sql
-- Run in Supabase SQL Editor
SELECT c.id, c.name, c.user_id, up.id as user_profile_id, up.role
FROM clients c
LEFT JOIN user_profiles up ON c.user_id = up.id
WHERE c.id = 'YOUR_CLIENT_ID';
```

### 3. Test Policy Manually
Test if the policy works by running this in SQL Editor:
```sql
-- This should return true if the policy allows access
SELECT auth.uid() as current_user_id;

-- Check if client exists for current user
SELECT id FROM clients WHERE user_id = auth.uid();
```

### 4. Check Server Logs
Check your Next.js server console for:
- "Upload attempt:" log with clientId and fileName
- Any error messages

### 5. Verify File Path Structure
The upload creates files with this structure:
```
progress-photos/
  └── {clientId}/
      └── {date}/
          └── {viewType}_{timestamp}.{ext}
```

Make sure:
- `clientId` is a valid UUID
- `date` is in format `YYYY-MM-DD`
- `viewType` is one of: `front`, `side`, `back`, `other`

## 🐛 Common Issues

### Issue: "Permission denied" even with policies
**Solution:** The policy might be checking the wrong folder structure. Verify:
- Policy uses `(storage.foldername(name))[1]` to get the first folder (clientId)
- Client ID in the database matches the clientId being used

### Issue: Upload succeeds but file doesn't appear
**Solution:** 
- Check Storage → `progress-photos` bucket → Files
- Look in the folder structure: `{clientId}/{date}/`
- Verify the file was actually uploaded

### Issue: "Bucket not found" error
**Solution:**
- Double-check bucket name is exactly `progress-photos` (no spaces, correct spelling)
- Verify bucket is Public
- Try refreshing the Supabase dashboard

## 📝 Test Upload Manually

You can test the upload API directly using curl:

```bash
curl -X POST http://localhost:3000/api/progress/photos/upload \
  -H "Cookie: your-auth-cookie" \
  -F "file=@/path/to/image.jpg" \
  -F "client_id=YOUR_CLIENT_ID" \
  -F "date=2025-01-15" \
  -F "view_type=front"
```

## ✅ Next Steps

1. Try uploading again
2. Check browser console for the exact error
3. Check server logs for "Upload attempt:" message
4. Share the exact error message you see

The code has been updated to provide better error messages, so you should see more specific information about what's failing.



