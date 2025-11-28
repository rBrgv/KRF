# Razorpay Setup Guide - Step by Step

## ✅ Current Status

- ✅ Razorpay package installed (`razorpay@2.9.2`)
- ✅ Payment APIs implemented
- ✅ Database schema ready
- ✅ Frontend integration complete
- ✅ Payment verification implemented
- ❌ **Missing: API Keys & Environment Variables**

## 🚀 Next Steps (15 minutes)

### Step 1: Get Razorpay API Keys (5 minutes)

1. **Go to Razorpay Dashboard**
   - Visit: https://dashboard.razorpay.com/
   - Sign up or log in

2. **Navigate to Settings → API Keys**
   - Click on "Settings" in the left sidebar
   - Click on "API Keys"

3. **Generate Test Keys** (for development)
   - Click "Generate Test Key"
   - Copy the **Key ID** (starts with `rzp_test_...`)
   - Copy the **Key Secret** (starts with `...`)

4. **Generate Live Keys** (for production)
   - Complete KYC verification first
   - Click "Generate Live Key"
   - Copy the **Key ID** (starts with `rzp_live_...`)
   - Copy the **Key Secret**

### Step 2: Add Environment Variables (2 minutes)

Add these to your `.env.local` file:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

**Important:**
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` must start with `NEXT_PUBLIC_` (for client-side access)
- Use test keys for development
- Use live keys for production

### Step 3: Set Up Webhook (Optional for now, 5 minutes)

1. **In Razorpay Dashboard:**
   - Go to Settings → Webhooks
   - Click "Add New Webhook"

2. **Webhook URL:**
   - Development: `https://your-ngrok-url.ngrok.io/api/payments/webhook`
   - Production: `https://yourdomain.com/api/payments/webhook`

3. **Select Events:**
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `payment.authorized`

4. **Copy Webhook Secret:**
   - After creating webhook, copy the secret
   - Add to `.env.local` as `RAZORPAY_WEBHOOK_SECRET`

### Step 4: Restart Development Server (1 minute)

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test Payment Flow (5 minutes)

1. **Create a Test Event:**
   - Go to `/dashboard/events`
   - Create an event with a price (e.g., ₹100)

2. **Test Registration:**
   - Go to the event page
   - Fill in registration form
   - Click "Pay & Register"

3. **Test Payment:**
   - Use Razorpay test card: `4111 1111 1111 1111`
   - CVV: Any 3 digits (e.g., `123`)
   - Expiry: Any future date (e.g., `12/25`)
   - Name: Any name

4. **Verify:**
   - Check if payment is recorded in database
   - Check if registration status is "confirmed"
   - Check success page loads correctly

## 📋 Checklist

- [ ] Created Razorpay account
- [ ] Generated Test API Keys
- [ ] Added keys to `.env.local`
- [ ] Restarted development server
- [ ] Tested payment flow with test card
- [ ] Verified payment in database
- [ ] (Optional) Set up webhook
- [ ] (Production) Complete KYC and get Live keys

## 🔍 Testing Checklist

- [ ] Payment order creation works
- [ ] Razorpay checkout opens
- [ ] Test payment succeeds
- [ ] Payment verification works
- [ ] Success page displays
- [ ] Registration status updates to "confirmed"
- [ ] Payment record created in database
- [ ] Failed payment redirects correctly

## 🐛 Troubleshooting

### Issue: "Payment gateway not available"
- **Solution:** Check if `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly
- **Solution:** Restart server after adding env variables

### Issue: "Invalid payment signature"
- **Solution:** Check if `RAZORPAY_KEY_SECRET` matches the key ID
- **Solution:** Ensure you're using test keys with test keys (not mixing test/live)

### Issue: Payment succeeds but registration not confirmed
- **Solution:** Check webhook is configured
- **Solution:** Check `/api/payments/verify` endpoint logs
- **Solution:** Verify database connection

### Issue: Razorpay checkout doesn't open
- **Solution:** Check browser console for errors
- **Solution:** Verify Razorpay script loads: `https://checkout.razorpay.com/v1/checkout.js`
- **Solution:** Check if `NEXT_PUBLIC_RAZORPAY_KEY_ID` is accessible in browser

## 📚 Resources

- [Razorpay Dashboard](https://dashboard.razorpay.com/)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Test Cards](https://razorpay.com/docs/payments/test-cards/)
- [Webhook Guide](https://razorpay.com/docs/webhooks/)

## 🎯 Production Checklist

Before going live:

- [ ] Complete Razorpay KYC verification
- [ ] Generate Live API Keys
- [ ] Update `.env.local` with live keys
- [ ] Set up production webhook URL
- [ ] Test with real payment (small amount)
- [ ] Verify webhook receives events
- [ ] Set up payment monitoring/alerts
- [ ] Configure refund policy

## 💡 Quick Start Commands

```bash
# 1. Check if Razorpay package is installed
npm list razorpay

# 2. Check environment variables (don't show secrets!)
grep -E "RAZORPAY|NEXT_PUBLIC_RAZORPAY" .env.local | sed 's/=.*/=***/'

# 3. Test API endpoint
curl -X POST http://localhost:3001/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{"event_registration_id":"test","amount_in_inr":100}'

# 4. Check server logs for errors
# Look for Razorpay-related errors in terminal
```

## ✅ You're Done When:

1. ✅ Test payment completes successfully
2. ✅ Registration status shows "confirmed"
3. ✅ Payment appears in database
4. ✅ Success page displays correctly
5. ✅ No errors in console or logs

---

**Estimated Time:** 15 minutes  
**Difficulty:** Easy  
**Status:** Ready to implement! 🚀

