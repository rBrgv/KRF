# KR Fitness Platform

A fitness platform for personal training studio management.

## Tech Stack

- Next.js 14+ (App Router, TypeScript)
- Tailwind CSS
- Supabase (Postgres + Auth)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay (for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=+91XXXXXXXXXX
NEXT_PUBLIC_PHONE_NUMBER=+91XXXXXXXXXX
```

3. Set up Supabase:
   - Create a new Supabase project at https://supabase.com
   - Get your project URL and anon key from Settings > API
   - Add them to `.env.local`

4. Run the development server:
```bash
npm run dev
```

## Project Structure

- `/app` - Next.js App Router pages
- `/components` - React components
- `/lib` - Utility functions and Supabase clients
- `/middleware.ts` - Route protection middleware

## Authentication

- Login page: `/auth/login`
- Protected dashboard: `/dashboard` (requires authentication)
- Middleware automatically redirects unauthenticated users to login

## Features

### Public Website
- Home, About, Services, Transformations, Events, Blog, Contact pages
- Book Consultation page
- Clean, modern fitness-studio design

### Dashboard
- Protected route with authentication
- Welcome page for logged-in coaches
