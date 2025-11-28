# Resend Email Setup Guide

## Step 1: Sign Up for Resend

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" and create an account
3. Verify your email address

## Step 2: Get Your API Key

1. Once logged in, go to **API Keys** in the sidebar
2. Click **"Create API Key"**
3. Give it a name (e.g., "KR Fitness Production")
4. Copy the API key immediately (you won't be able to see it again!)

## Step 3: Add API Key to Environment Variables

Add to your `.env.local` file:

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=KR Fitness <no-reply@krfitnessstudio.com>
```

**Important Notes:**
- Replace `re_your_api_key_here` with your actual API key from Resend
- The `EMAIL_FROM` format: `Display Name <email@domain.com>`
- For now, you can use Resend's test domain (see Step 4)

## Step 4: Domain Setup (Choose One)

### Option A: Use Resend's Test Domain (Quick Start - Development Only)

Resend provides a test domain for development:
- **From Email**: `onboarding@resend.dev`
- This works immediately, no setup needed
- **Limitation**: Emails will be marked as "via resend.dev" and may go to spam

**For Development:**
```env
EMAIL_FROM=KR Fitness <onboarding@resend.dev>
```

### Option B: Verify Your Own Domain (Production Recommended)

1. In Resend dashboard, go to **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `krfitnessstudio.com` (or your actual domain)
4. Resend will provide DNS records to add:
   - **SPF Record** (TXT)
   - **DKIM Record** (TXT)
   - **DMARC Record** (TXT) - Optional but recommended

5. Add these DNS records to your domain provider (GoDaddy, Namecheap, etc.)
6. Wait for verification (usually 5-15 minutes)
7. Once verified, you can use:
   ```env
   EMAIL_FROM=KR Fitness <no-reply@krfitnessstudio.com>
   ```

**Benefits of verifying your domain:**
- Better email deliverability
- No "via resend.dev" tag
- Professional appearance
- Less likely to go to spam

## Step 5: Test the Setup

### Manual Test via API

You can test by calling the send endpoint directly:

```bash
curl -X POST http://localhost:3001/api/notifications/send \
  -H "Content-Type: application/json"
```

Or trigger notification generation first:

```bash
curl -X POST http://localhost:3001/api/notifications/run \
  -H "Content-Type: application/json"
```

### Check Resend Dashboard

1. Go to **Emails** in Resend dashboard
2. You'll see all sent emails with:
   - Status (delivered, bounced, etc.)
   - Timestamp
   - Recipient
   - Subject

## Step 6: Resend Free Tier Limits

Resend's free tier includes:
- **3,000 emails/month**
- **100 emails/day**
- Perfect for small to medium gyms

If you need more, pricing starts at $20/month for 50,000 emails.

## Troubleshooting

### "RESEND_API_KEY environment variable is not set"
- Make sure `.env.local` has `RESEND_API_KEY=re_...`
- Restart your Next.js dev server after adding env vars

### "Invalid API key"
- Double-check you copied the full API key
- Make sure there are no extra spaces
- Regenerate the key in Resend if needed

### Emails not sending
- Check Resend dashboard → Emails for error details
- Verify your domain is properly configured (if using custom domain)
- Check spam folder
- For test domain, emails might be delayed

### Emails going to spam
- Verify your domain with SPF/DKIM records
- Use a proper "from" address (not a free email like Gmail)
- Avoid spam trigger words in subject/body

## Quick Start (Development)

For immediate testing without domain verification:

1. Sign up at resend.com
2. Get API key from dashboard
3. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_your_key_here
   EMAIL_FROM=KR Fitness <onboarding@resend.dev>
   ```
4. Restart dev server
5. Test by calling `/api/notifications/run` then `/api/notifications/send`

That's it! You're ready to send emails.




