/**
 * Consolidate Duplicate Leads Script
 * 
 * This script finds and consolidates duplicate leads in the database.
 * It keeps the oldest lead and merges all data from duplicates.
 * 
 * Usage:
 *   node scripts/consolidate-duplicate-leads.js [--dry-run]
 * 
 * Options:
 *   --dry-run: Show what would be consolidated without making changes
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local if it exists
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (error) {
  console.warn('Could not load .env.local, using environment variables directly');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const isDryRun = process.argv.includes('--dry-run');

function normalizePhone(phone) {
  if (!phone) return null;
  return phone.replace(/\D/g, '').slice(0, 10);
}

function mergeSources(sources) {
  const unique = [...new Set(sources.filter(s => s && s.trim()))];
  return unique.join(', ');
}

function mergeGoals(goals) {
  const unique = [...new Set(goals.filter(g => g && g.trim()))];
  return unique.join(' | ');
}

function mergeNotes(notes) {
  return notes.filter(n => n && n.trim()).join('\n\n---\n\n');
}

async function findDuplicateGroups() {
  // Fetch all leads
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  // Group by phone or email
  const groups = new Map();
  
  for (const lead of leads) {
    const phoneNorm = normalizePhone(lead.phone);
    const emailNorm = lead.email ? lead.email.toLowerCase().trim() : null;
    
    // Use email if available, otherwise normalized phone
    const groupKey = emailNorm || phoneNorm;
    
    if (!groupKey) continue; // Skip leads without phone or email
    
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey).push(lead);
  }

  // Filter to only groups with duplicates
  const duplicateGroups = [];
  for (const [key, groupLeads] of groups.entries()) {
    if (groupLeads.length > 1) {
      duplicateGroups.push({
        key,
        leads: groupLeads,
        keepLead: groupLeads[0], // Oldest lead
        duplicates: groupLeads.slice(1), // All others
      });
    }
  }

  return duplicateGroups;
}

async function consolidateDuplicates() {
  console.log('🔍 Finding duplicate leads...\n');
  
  const duplicateGroups = await findDuplicateGroups();
  
  if (duplicateGroups.length === 0) {
    console.log('✅ No duplicate leads found!');
    return;
  }

  console.log(`📊 Found ${duplicateGroups.length} duplicate groups:`);
  let totalDuplicates = 0;
  
  for (const group of duplicateGroups) {
    console.log(`\n  Group: ${group.key}`);
    console.log(`    Keep: ${group.keepLead.name} (${group.keepLead.id}) - Created: ${group.keepLead.created_at}`);
    console.log(`    Duplicates (${group.duplicates.length}):`);
    group.duplicates.forEach(dup => {
      console.log(`      - ${dup.name} (${dup.id}) - Source: ${dup.source || 'N/A'} - Created: ${dup.created_at}`);
    });
    totalDuplicates += group.duplicates.length;
  }

  console.log(`\n📈 Summary: ${duplicateGroups.length} groups, ${totalDuplicates} duplicate leads to consolidate\n`);

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made');
    console.log('\nTo actually consolidate, run without --dry-run flag');
    return;
  }

  console.log('🔄 Starting consolidation...\n');

  let consolidated = 0;
  let errors = 0;

  for (const group of duplicateGroups) {
    try {
      const keepId = group.keepLead.id;
      const duplicateIds = group.duplicates.map(d => d.id);

      // Collect all data
      const allLeads = [group.keepLead, ...group.duplicates];
      const sources = allLeads.map(l => l.source).filter(Boolean);
      const goals = allLeads.map(l => l.goal).filter(Boolean);
      const notes = allLeads.map(l => l.notes).filter(Boolean);
      const emails = allLeads.map(l => l.email).filter(Boolean);
      const utmSources = allLeads.map(l => l.utm_source).filter(Boolean);
      const utmMediums = allLeads.map(l => l.utm_medium).filter(Boolean);
      const utmCampaigns = allLeads.map(l => l.utm_campaign).filter(Boolean);
      const utmContents = allLeads.map(l => l.utm_content).filter(Boolean);
      const referrers = allLeads.map(l => l.referrer).filter(Boolean);

      // Merge data
      const mergedSource = mergeSources(sources);
      const mergedGoal = mergeGoals(goals);
      const mergedNotes = mergeNotes(notes);
      const mergedEmail = emails[0] || group.keepLead.email; // Use first non-null email
      const mergedUtmSource = utmSources[0] || group.keepLead.utm_source;
      const mergedUtmMedium = utmMediums[0] || group.keepLead.utm_medium;
      const mergedUtmCampaign = utmCampaigns[0] || group.keepLead.utm_campaign;
      const mergedUtmContent = utmContents[0] || group.keepLead.utm_content;
      const mergedReferrer = referrers[0] || group.keepLead.referrer;

      // Update kept lead
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          source: mergedSource || group.keepLead.source,
          goal: mergedGoal || group.keepLead.goal,
          notes: mergedNotes || group.keepLead.notes,
          email: mergedEmail || group.keepLead.email,
          utm_source: mergedUtmSource || group.keepLead.utm_source,
          utm_medium: mergedUtmMedium || group.keepLead.utm_medium,
          utm_campaign: mergedUtmCampaign || group.keepLead.utm_campaign,
          utm_content: mergedUtmContent || group.keepLead.utm_content,
          referrer: mergedReferrer || group.keepLead.referrer,
          updated_at: new Date().toISOString(),
        })
        .eq('id', keepId);

      if (updateError) {
        console.error(`  ❌ Error updating lead ${keepId}:`, updateError.message);
        errors++;
        continue;
      }

      // Update health_assessments
      const { error: haError } = await supabase
        .from('health_assessments')
        .update({ lead_id: keepId })
        .in('lead_id', duplicateIds);

      if (haError) {
        console.error(`  ⚠️  Error updating health_assessments:`, haError.message);
      }

      // Update clients
      const { error: clientsError } = await supabase
        .from('clients')
        .update({ lead_id: keepId })
        .in('lead_id', duplicateIds);

      if (clientsError) {
        console.error(`  ⚠️  Error updating clients:`, clientsError.message);
      }

      // Delete duplicate leads
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .in('id', duplicateIds);

      if (deleteError) {
        console.error(`  ❌ Error deleting duplicates:`, deleteError.message);
        errors++;
        continue;
      }

      consolidated++;
      console.log(`  ✅ Consolidated ${duplicateIds.length} duplicates into lead ${keepId} (${group.keepLead.name})`);

    } catch (error) {
      console.error(`  ❌ Error processing group ${group.key}:`, error.message);
      errors++;
    }
  }

  console.log(`\n✨ Consolidation complete!`);
  console.log(`   ✅ Consolidated: ${consolidated} groups`);
  if (errors > 0) {
    console.log(`   ⚠️  Errors: ${errors} groups`);
  }
}

// Run the script
consolidateDuplicates()
  .then(() => {
    console.log('\n✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

