# WhatsApp Business API Integration Setup

## Overview
This integration allows you to send WhatsApp messages to clients through the WhatsApp Business API. The system supports both template messages (for business-initiated conversations) and free-form text messages (for customer-initiated conversations within 24 hours).

## Environment Variables

Add these to your `.env.local` file:

```bash
# WhatsApp Business API Credentials
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id_here
```

### Getting Your Credentials

1. **Access Token**: 
   - Go to Meta for Developers → Your App → WhatsApp → API Setup
   - Click "Generate access token"
   - Select your WhatsApp Business Account
   - Copy the token (Note: Tokens expire, you may need to regenerate)

2. **Phone Number ID**:
   - Found in the same API Setup page
   - Format: `857442674125194` (numeric string)

3. **Business Account ID**:
   - Found in WhatsApp Manager → Settings → Phone numbers
   - Format: `2303303270174270` (numeric string)

## Testing

### Using the Test Template
For initial testing, you can use the default "hello_world" template that Meta provides:

```bash
# Test via API
curl -X POST http://localhost:3001/api/notifications/create \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "your-client-id",
    "channel": "whatsapp",
    "whatsapp_text": "Hello! This is a test message.",
    "template": {
      "name": "hello_world",
      "language": { "code": "en_US" }
    }
  }'
```

### Free-Form Messages
Free-form messages work when:
- The customer has messaged you first (customer-initiated)
- Within 24 hours of their last message
- No template required

## Production Setup

### Creating Custom Templates

For production, you'll need to create and get approved custom message templates:

1. **Go to WhatsApp Manager**:
   - Navigate to: https://business.facebook.com/wa/manage/message-templates/

2. **Create Template**:
   - Click "Create Template"
   - Choose category: Utility, Marketing, or Authentication
   - Fill in template details:
     - Name: `appointment_reminder` (lowercase, no spaces)
     - Language: English (US)
     - Category: Utility
     - Content: 
       ```
       Hi {{1}}! Reminder: You have an appointment on {{2}} at {{3}}. See you soon! - KR Fitness
       ```
     - Variables:
       - {{1}} = Client name
       - {{2}} = Appointment date
       - {{3}} = Appointment time

3. **Submit for Review**:
   - Review typically takes 24-48 hours
   - Once approved, you can use the template in your code

### Recommended Templates

1. **Appointment Reminder** (`appointment_reminder`)
   ```
   Hi {{1}}! Reminder: You have an appointment on {{2}} at {{3}}. See you soon! - KR Fitness
   ```

2. **Membership Expiry** (`membership_expiry`)
   ```
   Hi {{1}}! Your membership expires on {{2}}. Renew now to continue! - KR Fitness
   ```

3. **General Notification** (`general_notification`)
   ```
   {{1}} - KR Fitness
   ```

## Usage

### Manual Notification Creation

```typescript
// Via API
POST /api/notifications/create
{
  "client_id": "uuid",
  "channel": "whatsapp",
  "whatsapp_text": "Your message here",
  "type": "general",
  "scheduled_at": "2024-01-01T10:00:00Z" // Optional, null for immediate
}
```

### Automated Notifications

The system automatically creates WhatsApp notifications for:
- **Appointment Reminders**: 24 hours before appointment
- **Membership Expiry**: 7 days before expiry

These are created by the `/api/notifications/run` cron job and sent by `/api/notifications/send`.

## Phone Number Formatting

The system automatically formats phone numbers:
- Input: `"+91 96324 84104"` or `"919632484104"` or `"9632484104"`
- Output: `"919632484104"` (E.164 format without +)

## Error Handling

Common errors:
- **131047**: Template required for business-initiated messages
- **Missing phone number**: Client doesn't have a phone number
- **Invalid token**: Access token expired or invalid

## Security Notes

- **Never commit** `.env.local` to version control
- Access tokens expire - set up token refresh if needed
- Use environment variables for all credentials
- Test with test numbers before going to production

## Next Steps

1. ✅ Add environment variables
2. ✅ Test with "hello_world" template
3. ⏳ Create custom templates in WhatsApp Manager
4. ⏳ Get templates approved
5. ⏳ Update code to use custom template names (if different)
6. ⏳ Test with real client numbers
7. ⏳ Deploy to production

## Support

- WhatsApp Business API Docs: https://developers.facebook.com/docs/whatsapp
- Meta for Developers: https://developers.facebook.com/



