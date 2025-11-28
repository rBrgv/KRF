# WhatsApp Webhook Setup Guide

## Overview
This guide will help you set up webhooks to receive incoming WhatsApp messages in your application. Once configured, you'll be able to see customer replies and send free-form messages within the 24-hour window.

## Prerequisites
- ✅ WhatsApp Business API access
- ✅ Access token configured
- ✅ Database migration run (`026_add_whatsapp_messages.sql`)

## Step 1: Run Database Migration

First, run the migration to create the messages table:

```bash
# If using Supabase CLI
supabase migration up

# Or run the SQL file directly in Supabase Dashboard
# File: supabase/migrations/026_add_whatsapp_messages.sql
```

## Step 2: Set Up Webhook Environment Variables

Add to your `.env.local`:

```bash
# WhatsApp Webhook Configuration
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token_here
WHATSAPP_WEBHOOK_SECRET=your_webhook_secret_here  # Optional but recommended
```

**Generate a secure verify token:**
- Use a random string (e.g., `openssl rand -hex 32`)
- Keep it secret - this is used to verify webhook requests

## Step 3: Configure Webhook in Meta for Developers

1. **Go to Meta for Developers:**
   - Navigate to: https://developers.facebook.com/apps/
   - Select your app → WhatsApp → Configuration

2. **Set Up Webhook:**
   - Click "Edit" next to "Webhook"
   - **Callback URL:** `https://yourdomain.com/api/whatsapp/webhook`
     - For local testing: Use ngrok or similar: `https://your-ngrok-url.ngrok.io/api/whatsapp/webhook`
   - **Verify Token:** Enter the same token from `.env.local` (`WHATSAPP_VERIFY_TOKEN`)
   - Click "Verify and Save"

3. **Subscribe to Webhook Fields:**
   - Check: `messages` (to receive incoming messages)
   - Check: `message_status` (to receive delivery/read statuses)
   - Click "Save"

## Step 4: Test Webhook (Local Development)

For local testing, you need to expose your local server:

### Option 1: Using ngrok (Recommended)

```bash
# Install ngrok: https://ngrok.com/download
ngrok http 3001

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Use this as your webhook URL in Meta
```

### Option 2: Using Cloudflare Tunnel

```bash
# Install cloudflared
cloudflared tunnel --url http://localhost:3001
```

## Step 5: Verify Webhook is Working

1. **Check Webhook Verification:**
   - Meta will send a GET request to verify your webhook
   - Check your server logs for: `[WhatsApp Webhook] Verification successful`

2. **Test with a Message:**
   - Send a test message to your WhatsApp Business number
   - Reply to that message
   - Check your server logs for: `[WhatsApp Webhook] Incoming message`

3. **Check Database:**
   - Go to Supabase Dashboard → Table Editor → `whatsapp_messages`
   - You should see the incoming message

## Step 6: View Messages in UI

Once messages are being received:

1. **Go to Client Detail Page:**
   - Navigate to `/dashboard/clients/[id]`
   - Scroll down to "WhatsApp Conversation" section

2. **Features:**
   - See all messages (inbound and outbound)
   - Send replies directly from the UI
   - Messages are stored in database
   - Auto-links messages to clients by phone number

## Troubleshooting

### Webhook Not Receiving Messages

1. **Check Webhook URL:**
   - Must be HTTPS (not HTTP)
   - Must be publicly accessible
   - Must return 200 status for GET verification

2. **Check Verify Token:**
   - Must match exactly in Meta and `.env.local`
   - Case-sensitive

3. **Check Server Logs:**
   - Look for `[WhatsApp Webhook]` logs
   - Check for errors

4. **Test Webhook Manually:**
   ```bash
   # Test GET (verification)
   curl "https://yourdomain.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test123"
   
   # Should return: test123
   ```

### Messages Not Appearing in UI

1. **Check Database:**
   - Verify messages are in `whatsapp_messages` table
   - Check `client_id` is linked correctly

2. **Check Phone Number Format:**
   - Phone numbers are normalized (digits only)
   - Client phone must match message phone

3. **Refresh the Page:**
   - Messages load on page load
   - Click refresh button in conversation UI

## Security Notes

- **Verify Token:** Keep it secret and use a strong random string
- **Webhook Secret:** Optional but recommended for production
- **HTTPS Required:** Meta requires HTTPS for webhooks
- **Rate Limiting:** Consider adding rate limiting for production

## Production Deployment

1. **Update Webhook URL:**
   - Change from ngrok/local URL to your production domain
   - Update in Meta for Developers dashboard

2. **Set Environment Variables:**
   - Add `WHATSAPP_VERIFY_TOKEN` to production environment
   - Add `WHATSAPP_WEBHOOK_SECRET` (optional but recommended)

3. **Test:**
   - Send a test message
   - Verify it appears in your production app

## Next Steps

- ✅ Webhook configured
- ✅ Messages being received
- ✅ UI showing conversations
- ⏳ Set up automated replies (optional)
- ⏳ Add message search/filtering (optional)
- ⏳ Add notifications for new messages (optional)



