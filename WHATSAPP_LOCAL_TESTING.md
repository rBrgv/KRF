# WhatsApp Webhook - Local Testing Guide

## Quick Setup for Local Testing

### Step 1: Verify Token Added ✅
The verify token has been added to your `.env.local`:
```
WHATSAPP_VERIFY_TOKEN=929eb029b895288d64dca90602f35c53ec54501e9fc522d067aa3906cd6fa2ae
```

### Step 2: Install ngrok (for Local Testing)

**Option A: Using Homebrew (macOS)**
```bash
brew install ngrok
```

**Option B: Download from website**
1. Go to: https://ngrok.com/download
2. Download for macOS
3. Extract and add to PATH, or use directly

**Option C: Using npm (if you prefer)**
```bash
npm install -g ngrok
```

### Step 3: Start ngrok Tunnel

```bash
# In a new terminal window
ngrok http 3001
```

You'll see output like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3001
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

### Step 4: Test Webhook Endpoint Manually

Before setting up in Meta, test that your endpoint works:

```bash
# Replace YOUR_TOKEN with the token from .env.local
curl "http://localhost:3001/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=929eb029b895288d64dca90602f35c53ec54501e9fc522d067aa3906cd6fa2ae&hub.challenge=test123"
```

**Expected Response:** `test123` (the challenge value)

If you get an error, check:
- Server is running on port 3001
- Verify token matches exactly

### Step 5: Configure Webhook in Meta

1. **Go to Meta for Developers:**
   - https://developers.facebook.com/apps/
   - Your App → WhatsApp → Configuration

2. **Set Up Webhook:**
   - Click "Edit" next to "Webhook"
   - **Callback URL:** `https://YOUR-NGROK-URL.ngrok.io/api/whatsapp/webhook`
     - Example: `https://abc123.ngrok.io/api/whatsapp/webhook`
   - **Verify Token:** `929eb029b895288d64dca90602f35c53ec54501e9fc522d067aa3906cd6fa2ae`
   - Click "Verify and Save"

3. **Subscribe to Fields:**
   - ✅ `messages` (to receive incoming messages)
   - ✅ `message_status` (to receive delivery/read statuses)
   - Click "Save"

### Step 6: Verify It's Working

1. **Check Server Logs:**
   - You should see: `[WhatsApp Webhook] Verification successful`

2. **Test with a Message:**
   - Send a WhatsApp message to your test number
   - Reply to that message
   - Check server logs for: `[WhatsApp Webhook] Incoming message`

3. **Check Database:**
   - Go to Supabase → `whatsapp_messages` table
   - You should see the incoming message

## Troubleshooting

### "Callback URL or verify token couldn't be validated"

**Common Causes:**

1. **Server Not Running:**
   ```bash
   # Make sure server is running
   PORT=3001 npm run dev
   ```

2. **ngrok Not Running:**
   ```bash
   # Start ngrok in separate terminal
   ngrok http 3001
   ```

3. **Wrong URL Format:**
   - Must be HTTPS (ngrok provides this)
   - Must include `/api/whatsapp/webhook`
   - No trailing slash

4. **Token Mismatch:**
   - Token in Meta must match exactly with `.env.local`
   - Case-sensitive
   - No extra spaces

5. **Server Not Restarted:**
   - After adding `WHATSAPP_VERIFY_TOKEN`, restart server
   ```bash
   # Kill and restart
   pkill -f "next dev"
   PORT=3001 npm run dev
   ```

### Test Webhook Endpoint Directly

```bash
# Test GET (verification)
curl "http://localhost:3001/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=929eb029b895288d64dca90602f35c53ec54501e9fc522d067aa3906cd6fa2ae&hub.challenge=test123"

# Should return: test123

# Test with wrong token (should fail)
curl "http://localhost:3001/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=test123"

# Should return: Forbidden
```

### Check Server Logs

Watch your server terminal for:
- `[WhatsApp Webhook] Verification successful` ✅
- `[WhatsApp Webhook] Verification failed` ❌
- `[WhatsApp Webhook] Incoming message` (when message received)

## Alternative: Cloudflare Tunnel

If ngrok doesn't work, try Cloudflare Tunnel:

```bash
# Install cloudflared
brew install cloudflared

# Start tunnel
cloudflared tunnel --url http://localhost:3001
```

Use the HTTPS URL provided.

## Production Setup

Once working locally:
1. Deploy to production
2. Update webhook URL to your production domain
3. Keep the same verify token (or generate a new one)

## Quick Checklist

- [ ] Verify token added to `.env.local`
- [ ] Server restarted (to load new env var)
- [ ] ngrok installed and running
- [ ] ngrok HTTPS URL copied
- [ ] Webhook URL set in Meta: `https://YOUR-NGROK-URL.ngrok.io/api/whatsapp/webhook`
- [ ] Verify token set in Meta (same as `.env.local`)
- [ ] Subscribed to `messages` and `message_status` fields
- [ ] Test message sent and reply received
- [ ] Check database for incoming message



