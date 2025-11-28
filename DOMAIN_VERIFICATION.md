# Resend Domain Verification Guide

## Current Issue

You're seeing this error:
> "You can only send testing emails to your own email address (bhargavtaurus@gmail.com). To send emails to other recipients, please verify a domain at resend.com/domains"

This happens because you're using Resend's **test domain** which only allows sending to your own email address.

## Solution: Verify Your Domain

To send emails to clients, you need to verify your own domain.

### Step 1: Go to Resend Domains

1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain (e.g., `krfitnessstudio.com` or your actual domain)

### Step 2: Add DNS Records

Resend will provide you with DNS records to add. You'll need to add these to your domain provider (GoDaddy, Namecheap, Cloudflare, etc.):

**Example DNS Records:**
```
Type: TXT
Name: @ (or your domain)
Value: [SPF record from Resend]

Type: TXT
Name: resend._domainkey
Value: [DKIM record from Resend]

Type: TXT (Optional but recommended)
Name: _dmarc
Value: v=DMARC1; p=none;
```

### Step 3: Wait for Verification

- DNS changes can take 5-15 minutes to propagate
- Resend will automatically verify once DNS records are detected
- You'll see a ✅ "Verified" status in Resend dashboard

### Step 4: Update Environment Variables

Once verified, update your `.env.local`:

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=KR Fitness <no-reply@yourdomain.com>
```

**Important:** Replace `yourdomain.com` with your actual verified domain.

### Step 5: Restart Server

After updating `.env.local`:
```bash
# Stop your dev server (Ctrl+C)
# Then restart it
npm run dev
```

## Quick Test Domain Setup (Temporary)

If you need to test immediately while setting up domain verification:

1. **For testing only**, you can send to your own email (`bhargavtaurus@gmail.com`)
2. Once domain is verified, you can send to any email address

## Domain Options

### Option 1: Use Your Main Domain
- If you own `krfitnessstudio.com`, verify that
- Use: `no-reply@krfitnessstudio.com` or `noreply@krfitnessstudio.com`

### Option 2: Use a Subdomain
- Create a subdomain like `mail.krfitnessstudio.com`
- Verify the subdomain
- Use: `no-reply@mail.krfitnessstudio.com`

### Option 3: Use a Different Domain
- If you have another domain, verify that
- Use any email address on that domain

## Verification Checklist

- [ ] Domain added in Resend dashboard
- [ ] DNS records added to domain provider
- [ ] DNS records verified (can take 5-15 minutes)
- [ ] Domain shows "Verified" ✅ in Resend
- [ ] Updated `.env.local` with verified domain email
- [ ] Restarted dev server
- [ ] Tested sending to a client email

## Common Issues

### "Domain not verified"
- Wait a few more minutes for DNS propagation
- Double-check DNS records are correct
- Make sure you added ALL required records

### "DNS records not found"
- DNS changes can take up to 48 hours (usually 5-15 minutes)
- Use a DNS checker tool to verify records are live
- Make sure you saved DNS records in your domain provider

### "Still can't send to other emails"
- Make sure you're using the verified domain in `EMAIL_FROM`
- Restart your server after changing `.env.local`
- Check Resend dashboard shows domain as "Verified"

## Need Help?

1. Check Resend documentation: https://resend.com/docs/dashboard/domains/introduction
2. Contact Resend support if verification fails
3. Check your domain provider's DNS documentation

## After Verification

Once your domain is verified:
- ✅ You can send to any email address
- ✅ Better email deliverability
- ✅ No "via resend.dev" tag
- ✅ Professional appearance
- ✅ Less likely to go to spam




