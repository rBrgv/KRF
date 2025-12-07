# Meta Pixel Troubleshooting Guide

## Issue: "No pixel found" on Production

If you're seeing "No pixel found" on your production site (krfitnessstudio.com), follow these steps:

### 1. Verify Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify `NEXT_PUBLIC_META_PIXEL_ID` is set:
   - **Name**: `NEXT_PUBLIC_META_PIXEL_ID`
   - **Value**: `1806584646670614`
   - **Environment**: Make sure it's set for **Production** (and Preview/Development if needed)

### 2. Important: Redeploy After Adding Environment Variables

**Critical**: After adding or updating environment variables in Vercel, you MUST redeploy:

1. Go to **Deployments** tab in Vercel
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger a new deployment

**Why?** Next.js embeds `NEXT_PUBLIC_*` variables at **build time**. If the variable wasn't set when the build happened, it won't be available even if you add it later.

### 3. Verify the Build

After redeploying, check the build logs:

1. Go to **Deployments** → Click on the deployment
2. Check **Build Logs**
3. Look for any errors or warnings about environment variables

### 4. Test on Production

1. Visit `https://krfitnessstudio.com`
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Look for:
   - `[Meta Pixel] Initialized with ID: 1806584646670614` (success)
   - `[Meta Pixel] NEXT_PUBLIC_META_PIXEL_ID not configured` (failure - env var not set)

### 5. Check Network Tab

1. Open DevTools → **Network** tab
2. Filter by "fbevents"
3. You should see a request to `https://connect.facebook.net/en_US/fbevents.js`
4. If you don't see it, the script isn't loading

### 6. Use Meta Pixel Helper

1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
2. Visit `https://krfitnessstudio.com`
3. Click the extension icon
4. It should show:
   - ✅ Pixel ID: `1806584646670614`
   - ✅ Events firing
   - ❌ If it shows "No pixel found", the script isn't loading

### 7. Common Issues

#### Issue: Variable set but still not working
**Solution**: 
- Make sure variable name is exactly `NEXT_PUBLIC_META_PIXEL_ID` (case-sensitive)
- Make sure it's set for **Production** environment
- **Redeploy** after adding/updating

#### Issue: Works locally but not in production
**Solution**:
- Local `.env.local` doesn't affect production
- Must set in Vercel environment variables
- Must redeploy after setting

#### Issue: Script loads but Pixel Helper shows error
**Solution**:
- Check browser console for JavaScript errors
- Disable ad blockers temporarily
- Check if any browser extensions are blocking Facebook scripts

### 8. Verify in Source Code

1. Visit `https://krfitnessstudio.com`
2. Right-click → **View Page Source**
3. Search for `fbq('init'`
4. You should see: `fbq('init', '1806584646670614');`
5. If you see `NEXT_PUBLIC_META_PIXEL_ID not configured`, the env var wasn't set at build time

### 9. Quick Fix Checklist

- [ ] Environment variable `NEXT_PUBLIC_META_PIXEL_ID` is set in Vercel
- [ ] Variable is set for **Production** environment
- [ ] Value is exactly `1806584646670614` (no spaces, no quotes)
- [ ] Application has been **redeployed** after adding the variable
- [ ] Checked build logs for errors
- [ ] Tested with Meta Pixel Helper extension
- [ ] Checked browser console for errors

### 10. Still Not Working?

If after all these steps it's still not working:

1. **Double-check the variable in Vercel**:
   - Go to Settings → Environment Variables
   - Verify `NEXT_PUBLIC_META_PIXEL_ID` exists
   - Click "Edit" to see the exact value

2. **Create a test deployment**:
   - Make a small change (add a comment in code)
   - Commit and push
   - This will trigger a new build with the env var

3. **Check Vercel build logs**:
   - Look for any warnings about missing environment variables
   - Check if the build completed successfully

4. **Contact support**:
   - Share the build logs
   - Share a screenshot of your Vercel environment variables (hide the values)
   - Share the browser console output

## Additional Environment Variables

If you're also using Conversions API, make sure these are set in Vercel:

- `META_CONVERSIONS_API_ACCESS_TOKEN` (server-side, no NEXT_PUBLIC_ prefix)
- `META_DATASET_QUALITY_API_TOKEN` (server-side, no NEXT_PUBLIC_ prefix)
- `NEXT_PUBLIC_META_PIXEL_TEST_CODE` (optional, for testing)

**Note**: Server-side variables (without `NEXT_PUBLIC_`) are available at runtime and don't require a rebuild, but client-side variables (with `NEXT_PUBLIC_`) must be set before the build.

