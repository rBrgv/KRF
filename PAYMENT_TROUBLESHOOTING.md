# Payment Order Creation - Troubleshooting Guide

## ✅ Verified Working
- ✅ Razorpay API keys are set correctly
- ✅ Razorpay SDK can create orders (tested)
- ✅ Environment variables are loaded
- ✅ Server is running

## 🔍 Debugging Steps

### 1. Check Browser Console
Open browser DevTools (F12) → Console tab
- Look for any error messages
- Check the Network tab for the `/api/payments/create-order` request
- See the actual error response

### 2. Check Server Logs
Look at your terminal where `npm run dev` is running
- You should see logs starting with `[Payment Order]`
- These will show exactly where the error occurs

### 3. Test the API Directly
```bash
# First, create a test registration (you'll need a real event ID)
# Then test the payment order creation:
curl -X POST http://localhost:3001/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"event_registration_id":"YOUR_REGISTRATION_ID","amount_in_inr":100}'
```

### 4. Test Razorpay Keys
Visit: `http://localhost:3001/api/payments/test-keys`
- Should return: `{"success": true, ...}`
- If this fails, the keys are the issue

## 🐛 Common Issues

### Issue 1: Registration Not Found
**Error:** `"Registration not found"`
**Cause:** Registration wasn't created successfully
**Fix:** Check the registration API response in browser console

### Issue 2: Invalid Amount
**Error:** `"Invalid amount"` or similar
**Cause:** Amount is 0 or negative
**Fix:** Ensure event price is > 0

### Issue 3: Razorpay API Error
**Error:** Razorpay-specific error message
**Cause:** Invalid keys, network issue, or Razorpay service issue
**Fix:** Check the error description in the response

### Issue 4: Environment Variables Not Loaded
**Error:** `"Razorpay credentials not configured"`
**Cause:** Server wasn't restarted after adding keys
**Fix:** Restart the server: `npm run dev`

## 📋 What to Check Now

1. **Open Browser Console (F12)**
   - Go to an event page
   - Try to register and pay
   - Check Console tab for errors
   - Check Network tab → find `/api/payments/create-order` → see Response

2. **Check Server Terminal**
   - Look for `[Payment Order]` logs
   - These show the exact error

3. **Share the Error Details**
   - Copy the exact error message from browser console
   - Copy any server logs
   - This will help identify the exact issue

## 🔧 Quick Fixes to Try

1. **Restart Server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear Browser Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

3. **Check Event Price**
   - Ensure event has a price > 0
   - Test with ₹100 minimum

4. **Verify Registration Created**
   - Check browser console for registration response
   - Should see `{ success: true, data: { id: "..." } }`

## 📞 Next Steps

Please share:
1. The exact error message from browser console
2. Any `[Payment Order]` logs from server terminal
3. The Network tab response for `/api/payments/create-order`

This will help pinpoint the exact issue!

