# Email Troubleshooting Guide

## Issue: Email shows "sent" but not received in inbox

### Step 1: Check Resend Dashboard

1. Go to [Resend Dashboard](https://resend.com/emails)
2. Navigate to **Emails** section
3. Look for your sent email
4. Check the **Status**:
   - ✅ **Delivered** - Email was delivered (check spam folder)
   - ⚠️ **Bounced** - Email address is invalid or blocked
   - ⏳ **Pending** - Still being processed
   - ❌ **Failed** - Delivery failed (check error message)

### Step 2: Check Spam/Junk Folder

- Emails from unverified domains often go to spam
- Check your spam/junk folder
- Mark as "Not Spam" if found

### Step 3: Verify Domain Setup

**If using test domain (`onboarding@resend.dev`):**
- Emails may be delayed or go to spam
- This is normal for development/testing
- **Solution**: Verify your own domain (see below)

**If using custom domain:**
1. Go to Resend Dashboard → **Domains**
2. Check if your domain shows **Verified** ✅
3. If not verified:
   - Add the DNS records provided by Resend
   - Wait 5-15 minutes for verification
   - Check your domain provider's DNS settings

### Step 4: Check Environment Variables

Verify your `.env.local` has:

```env
RESEND_API_KEY=re_your_actual_key_here
EMAIL_FROM=KR Fitness <your-email@yourdomain.com>
```

**Important:**
- Restart your dev server after changing `.env.local`
- Make sure there are no extra spaces
- Use the exact format shown above

### Step 5: Check Email Address

1. Verify the recipient email address is correct
2. Check for typos
3. Make sure the email address exists and is active

### Step 6: Check Server Logs

Look for email-related logs in your terminal/console:

```
[Email] Email sent successfully: { emailId: '...', to: '...', subject: '...' }
```

If you see errors, they'll show what went wrong.

### Step 7: Test Email Delivery

1. **Send a test email to yourself:**
   - Use the compose email feature
   - Send to your own email address
   - Check if you receive it

2. **Check Resend Dashboard:**
   - Go to Resend → Emails
   - Find your test email
   - Check the delivery status

### Step 8: Common Issues & Solutions

#### Issue: "Email sent" but status shows "Pending"
- **Cause**: Resend is still processing
- **Solution**: Wait a few minutes, then check again

#### Issue: Email goes to spam
- **Cause**: Unverified domain or spam trigger words
- **Solution**: 
  - Verify your domain with SPF/DKIM records
  - Avoid spam trigger words (FREE, URGENT, etc.)
  - Use a professional "from" address

#### Issue: Email bounces
- **Cause**: Invalid email address or recipient's server blocking
- **Solution**: 
  - Verify the email address is correct
  - Check if recipient's email server is blocking emails
  - Try a different email address

#### Issue: No email ID in logs
- **Cause**: Resend API might not be responding correctly
- **Solution**: 
  - Check your API key is valid
  - Verify Resend account is active
  - Check Resend dashboard for API errors

### Step 9: Verify Resend Account Status

1. Go to Resend Dashboard
2. Check your account status
3. Verify you haven't hit rate limits:
   - Free tier: 100 emails/day, 3,000/month
   - If exceeded, upgrade your plan

### Step 10: Check Notification Status in Dashboard

1. Go to `/dashboard/notifications`
2. Find your sent email
3. Check the status:
   - **Sent** ✅ - Email was sent (check Resend dashboard for delivery status)
   - **Failed** ❌ - Check error_message column for details
   - **Pending** ⏳ - Still queued for sending

### Quick Diagnostic Checklist

- [ ] Resend API key is set in `.env.local`
- [ ] `EMAIL_FROM` is set correctly
- [ ] Dev server was restarted after env changes
- [ ] Checked Resend dashboard for email status
- [ ] Checked spam/junk folder
- [ ] Domain is verified (if using custom domain)
- [ ] Email address is correct
- [ ] Resend account is active and not rate-limited
- [ ] Checked server logs for errors

### Still Not Working?

1. **Check Resend Dashboard** - This is the most reliable source of truth
2. **Check server logs** - Look for `[Email]` prefixed messages
3. **Try sending to a different email** - Rule out recipient-specific issues
4. **Verify API key** - Make sure it's the correct key from Resend
5. **Contact Resend Support** - If emails show as delivered but not received

### Testing Email Setup

Run this in your terminal to test:

```bash
# Test the email API directly
curl -X POST http://localhost:3001/api/notifications/create \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "your-client-id",
    "subject": "Test Email",
    "body": "This is a test email",
    "type": "general"
  }'
```

Then check:
1. Resend dashboard for the email
2. Your inbox (and spam folder)
3. Server logs for any errors




