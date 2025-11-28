# Vercel Deployment Troubleshooting

## Server-Side Exception Error

If you're seeing "Application error: a server-side exception has occurred", it's likely due to missing environment variables.

### Required Environment Variables

Make sure these are set in your Vercel project settings:

1. **Supabase (Required)**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

2. **Razorpay (Required for payments)**
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Your Razorpay key ID
   - `RAZORPAY_KEY_SECRET` - Your Razorpay key secret

3. **WhatsApp (Optional)**
   - `WHATSAPP_ACCESS_TOKEN` - Your WhatsApp Business API access token
   - `WHATSAPP_PHONE_NUMBER_ID` - Your WhatsApp phone number ID
   - `WHATSAPP_BUSINESS_ACCOUNT_ID` - Your WhatsApp business account ID

4. **OpenAI (Optional - for AI features)**
   - `OPENAI_API_KEY` - Your OpenAI API key

### How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: The variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: The variable value
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application (Vercel will automatically redeploy when you save env vars, or you can trigger a manual redeploy)

### Verifying Environment Variables

After adding the variables, check the build logs to ensure they're being read correctly. The middleware and server components will now log errors if variables are missing.

### Common Issues

1. **Missing `NEXT_PUBLIC_` prefix**: Variables that need to be accessible in the browser must start with `NEXT_PUBLIC_`
2. **Wrong environment**: Make sure variables are set for the correct environment (Production/Preview/Development)
3. **Typo in variable name**: Double-check the exact variable names match what's in your code
4. **Not redeploying**: After adding env vars, you must redeploy for changes to take effect

### Testing Locally

To test if your environment variables are correct:

```bash
# Check if variables are set
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run the app locally
npm run dev
```

### Error Messages

The updated code will now provide more helpful error messages:
- If Supabase env vars are missing, you'll see: "Missing Supabase environment variables"
- Check Vercel function logs for detailed error messages

### Next Steps

1. Add all required environment variables in Vercel
2. Redeploy the application
3. Check the Vercel function logs if errors persist
4. Verify the Supabase connection is working

