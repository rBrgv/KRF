# Consolidate Duplicate Leads

This guide explains how to consolidate existing duplicate leads in your database.

## Problem

When the same person submits from different sources (contact form, health assessment, booking form), duplicate leads are created. This script consolidates them into a single lead.

## Solution Options

### Option 1: SQL Migration (Recommended for Production)

Run the SQL migration in Supabase Dashboard:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase/migrations/029_consolidate_duplicate_leads.sql`
3. Review the script (it will show what duplicates it finds)
4. Click "Run" to execute

**What it does:**
- Finds all duplicate leads (same phone or email)
- Keeps the oldest lead (earliest `created_at`)
- Merges sources, goals, notes, and UTM parameters
- Updates all `health_assessments` to point to the kept lead
- Updates all `clients` to point to the kept lead
- Deletes duplicate leads

### Option 2: Node.js Script (Safer for Testing)

Run the Node.js script for a safer, step-by-step approach:

```bash
# First, do a dry run to see what would be consolidated
node scripts/consolidate-duplicate-leads.js --dry-run

# If everything looks good, run for real
node scripts/consolidate-duplicate-leads.js
```

**Requirements:**
- Node.js installed
- `.env.local` file with Supabase credentials:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (preferred) or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**What it does:**
- Shows a detailed report of all duplicates found
- Allows dry-run mode to preview changes
- Consolidates duplicates step by step
- Provides detailed logging

## What Gets Merged

When consolidating duplicates, the script:

1. **Sources**: Combines all sources (e.g., "contact_page, health_assessment, service-booking-offline")
2. **Goals**: Combines goals with " | " separator
3. **Notes**: Combines all notes with separator
4. **Email**: Uses the most complete email (first non-null)
5. **UTM Parameters**: Uses the first non-null value for each UTM parameter
6. **Referrer**: Uses the first non-null referrer

## Example

**Before:**
- Lead 1: Vinay Balakrishnan, `contact_page`, created Dec 1
- Lead 2: Vinay Balakrishnan, `health_assessment`, created Dec 6
- Lead 3: Vinay Balakrishnan, `service-booking-offline`, created Dec 6

**After:**
- Lead 1: Vinay Balakrishnan, `contact_page, health_assessment, service-booking-offline`, created Dec 1
- (Leads 2 and 3 are deleted, their data merged into Lead 1)

## Safety

- **Backup First**: Always backup your database before running consolidation
- **Dry Run**: Use `--dry-run` flag with the Node.js script to preview changes
- **Reversible**: The SQL script shows what it will do before executing
- **Preserves Data**: All data from duplicates is merged, nothing is lost

## After Consolidation

After running the consolidation:
1. All future leads will automatically check for duplicates (already implemented)
2. Existing duplicates will be merged
3. Your lead list will be clean and deduplicated

## Troubleshooting

**Error: "Missing Supabase credentials"**
- Make sure `.env.local` exists with correct credentials
- Or set environment variables directly

**Error: "Permission denied"**
- Use `SUPABASE_SERVICE_ROLE_KEY` instead of `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Service role key has full database access

**No duplicates found**
- This is good! Your database is already clean
- The duplicate detection will prevent future duplicates


