# Meta Pixel Setup Guide

This document explains how to configure and use Meta Pixel tracking in the KR Fitness application.

## Environment Variable

Add the following to your `.env.local` file:

```env
# Meta Pixel (for Facebook/Meta tracking)
# Get your Pixel ID from: https://business.facebook.com/events_manager
# Format: Usually a 15-16 digit number (e.g., 123456789012345)
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id

# Meta Pixel Test Event Code (optional, for testing only)
# Get from Meta Events Manager > Test Events tab
# Format: TEST followed by numbers (e.g., TEST12687)
# NEXT_PUBLIC_META_PIXEL_TEST_CODE=TEST12687
```

## How to Get Your Meta Pixel ID

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager)
2. Select your Business Account
3. Click on "Data Sources" in the left menu
4. Find your Pixel (or create a new one)
5. Copy the Pixel ID (usually a 15-16 digit number)

## What's Tracked

### 1. Global PageView Tracking
- **Location**: `components/MetaPixel.tsx` (included in root layout)
- **When**: Automatically tracks PageView on:
  - Initial page load
  - Every route change/navigation
- **Event**: `PageView`

### 2. Health Check ViewContent
- **Location**: `app/health-check/components/HealthCheckTracker.tsx`
- **When**: When a user views the Health Check page (`/health-check`)
- **Event**: `ViewContent`
- **Parameters**:
  - `content_name`: "Health Check"
  - `content_category`: "HealthScoreTest"

### 3. Health Check Lead
- **Location**: `app/health-check/components/HealthAssessmentWizard.tsx`
- **When**: When a user successfully submits the Health Check form
- **Event**: `Lead`
- **Parameters**:
  - `content_name`: "Health Check Lead"
  - `value`: 0
  - `currency`: "INR"

## Files Modified/Created

1. **`lib/metaPixel.ts`** - Configuration and helper functions
2. **`components/MetaPixel.tsx`** - Global PageView tracking component
3. **`app/layout.tsx`** - Added MetaPixel component
4. **`app/health-check/components/HealthCheckTracker.tsx`** - ViewContent tracking
5. **`app/health-check/components/HealthAssessmentWizard.tsx`** - Lead event tracking

## Verification

### Using Meta Pixel Helper (Chrome Extension)

1. Install the [Meta Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
2. Visit your website
3. Click the extension icon to see:
   - If Pixel is loaded correctly
   - Events being fired
   - Any errors

### Using Meta Events Manager

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager)
2. Select your Pixel
3. Click on "Test Events" tab
4. Visit your website and perform actions:
   - Navigate between pages (should see PageView events)
   - Visit `/health-check` (should see ViewContent event)
   - Complete health check form (should see Lead event)

## Safety Features

- **Non-blocking**: If Meta Pixel fails to load or track, it won't break the application
- **Environment check**: Pixel only initializes if `NEXT_PUBLIC_META_PIXEL_ID` is set
- **Error handling**: All tracking functions have try-catch blocks
- **TypeScript support**: Full type definitions for `fbq` function

## Disabling Meta Pixel

To disable Meta Pixel tracking:
1. Remove or comment out `NEXT_PUBLIC_META_PIXEL_ID` from `.env.local`
2. The app will continue to work normally without tracking

