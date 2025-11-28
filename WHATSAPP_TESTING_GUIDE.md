# WhatsApp Integration - Testing Guide

## Prerequisites

1. ✅ Environment variables set in `.env.local`:
   ```bash
   WHATSAPP_ACCESS_TOKEN=your_token_here
   WHATSAPP_PHONE_NUMBER_ID=857442674125194
   WHATSAPP_BUSINESS_ACCOUNT_ID=2303303270174270
   ```

2. ✅ Server running on `http://localhost:3001`

3. ✅ A client in your database with a phone number (e.g., `+91 96324 84104`)

## Method 1: Test via API (Recommended for Quick Testing)

### Step 1: Get a Client ID

First, find a client ID from your database or dashboard:

```bash
# Option A: Query Supabase directly
# Option B: Check the dashboard URL when viewing a client
# The client ID is a UUID like: "123e4567-e89b-12d3-a456-426614174000"
```

### Step 2: Test with "hello_world" Template

This is the easiest way to test - uses Meta's default template:

```bash
curl -X POST http://localhost:3001/api/notifications/create \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{
    "client_id": "YOUR_CLIENT_ID_HERE",
    "channel": "whatsapp",
    "whatsapp_text": "Hello! This is a test message from KR Fitness.",
    "template": {
      "name": "hello_world",
      "language": { "code": "en_US" }
    },
    "type": "general"
  }'
```

**Note**: You'll need to be authenticated. If using curl, you may need to:
1. Log in via browser first
2. Copy the session cookie
3. Use it in the curl command

### Step 3: Test Free-Form Message (No Template)

For testing free-form messages (only works if customer messaged you first):

```bash
curl -X POST http://localhost:3001/api/notifications/create \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{
    "client_id": "YOUR_CLIENT_ID_HERE",
    "channel": "whatsapp",
    "whatsapp_text": "Hi! This is a test message. Free-form messages work within 24 hours of customer contact.",
    "type": "general"
  }'
```

## Method 2: Test via Browser Console (Easier Authentication)

### Step 1: Open Browser DevTools

1. Go to `http://localhost:3001/dashboard/notifications`
2. Open DevTools (F12 or Cmd+Option+I)
3. Go to Console tab

### Step 2: Run Test Script

```javascript
// Replace with your actual client ID
const clientId = "YOUR_CLIENT_ID_HERE";

// Test with hello_world template
fetch('/api/notifications/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    client_id: clientId,
    channel: 'whatsapp',
    whatsapp_text: 'Hello! This is a test message from KR Fitness.',
    template: {
      name: 'hello_world',
      language: { code: 'en_US' }
    },
    type: 'general'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Success:', data);
  if (data.notification) {
    console.log('Notification ID:', data.notification.id);
    console.log('Status:', data.notification.status);
  }
})
.catch(err => {
  console.error('❌ Error:', err);
});
```

### Step 3: Check the Result

- If successful, you should see the notification in the response
- Check the WhatsApp number you're testing with
- The message should arrive within a few seconds

## Method 3: Test via Notification Send Route

This tests the actual sending mechanism:

```bash
# First, create a notification (use Method 1 or 2)
# Then trigger the send route:

curl -X POST http://localhost:3001/api/notifications/send
```

Or via browser console:

```javascript
fetch('/api/notifications/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(res => res.json())
.then(data => {
  console.log('Send Result:', data);
  console.log('Success:', data.success);
  console.log('Failed:', data.failed);
})
.catch(err => console.error('Error:', err));
```

## Method 4: Test Automated Notifications

### Test Appointment Reminders

1. Create an appointment for a client (with phone number)
2. Set the appointment date to tomorrow (24 hours from now)
3. Run the notification generation:

```bash
curl -X POST http://localhost:3001/api/notifications/run
```

4. Then send the notifications:

```bash
curl -X POST http://localhost:3001/api/notifications/send
```

This will create and send both email and WhatsApp notifications if the client has both.

## Expected Results

### ✅ Success Response

```json
{
  "success": true,
  "notification": {
    "id": "uuid",
    "client_id": "uuid",
    "channel": "whatsapp",
    "status": "sent",
    "sent_at": "2024-01-01T10:00:00Z"
  },
  "message": "WhatsApp sent"
}
```

### ❌ Common Errors

1. **"Client phone number not found"**
   - Solution: Make sure the client has a phone number in the database

2. **"Template message required"**
   - Solution: Use the `template` parameter with "hello_world" for testing

3. **"WhatsApp credentials not configured"**
   - Solution: Check your `.env.local` file has the correct variables

4. **"Unauthorized" or "Forbidden"**
   - Solution: Make sure you're logged in as admin or trainer

## Debugging

### Check Server Logs

Look for these log messages in your terminal:

```
[WhatsApp] Sending template message: { to: '919632484104', template: 'hello_world' }
[WhatsApp] Template message sent successfully: { messageId: 'wamid.xxx', to: '919632484104' }
[Notifications] WhatsApp sent - Message ID: wamid.xxx, To: +91 96324 84104
```

### Check Notification Status

1. Go to `/dashboard/notifications`
2. Look for your test notification
3. Check the status (should be "sent" if successful)
4. Check the channel (should show WhatsApp icon)

### Verify Phone Number Format

The system automatically formats phone numbers. Check the logs to see the formatted number:
- Input: `"+91 96324 84104"` or `"9632484104"`
- Output: `"919632484104"` (E.164 format)

## Quick Test Checklist

- [ ] Environment variables set
- [ ] Server running
- [ ] Client has phone number
- [ ] Tested with "hello_world" template
- [ ] Received message on WhatsApp
- [ ] Notification status shows "sent"
- [ ] Checked server logs for errors

## Next Steps After Testing

1. ✅ If test successful → Create custom templates in WhatsApp Manager
2. ✅ Get templates approved (24-48 hours)
3. ✅ Update template names in code if needed
4. ✅ Test with real client scenarios
5. ✅ Deploy to production

## Troubleshooting

### Message Not Received?

1. **Check phone number format**: Should be E.164 (e.g., `919632484104`)
2. **Check template name**: Must match exactly (case-sensitive)
3. **Check access token**: May have expired, regenerate if needed
4. **Check test number**: Make sure you're using a test number or approved number
5. **Check WhatsApp Business Account**: Must be verified and active

### Still Having Issues?

1. Check server logs for detailed error messages
2. Verify environment variables are loaded (restart server after adding)
3. Test with a simple curl command first
4. Check Meta's WhatsApp API status
5. Verify your WhatsApp Business Account is active



