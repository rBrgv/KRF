import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Total leads
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    // Leads this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const { count: leadsThisWeek } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekStart.toISOString());

    // Converted leads
    const { count: convertedLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'converted');

    // Conversion rate
    const conversionRate =
      totalLeads && totalLeads > 0
        ? ((convertedLeads || 0) / totalLeads) * 100
        : 0;

    // Event revenue this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const { data: eventRegistrations } = await supabase
      .from('event_registrations')
      .select('amount_in_inr')
      .eq('status', 'confirmed')
      .gte('created_at', monthStart.toISOString());

    const eventRevenueThisMonth =
      eventRegistrations?.reduce((sum, reg) => sum + (reg.amount_in_inr || 0), 0) || 0;

    // Leads by source
    const { data: leadsBySourceData } = await supabase
      .from('leads')
      .select('source');

    const leadsBySource: Record<string, number> = {};
    leadsBySourceData?.forEach((lead) => {
      const source = lead.source || 'unknown';
      leadsBySource[source] = (leadsBySource[source] || 0) + 1;
    });

    // Leads by status
    const { data: leadsByStatusData } = await supabase
      .from('leads')
      .select('status');

    const leadsByStatus: Record<string, number> = {};
    leadsByStatusData?.forEach((lead) => {
      const status = lead.status || 'unknown';
      leadsByStatus[status] = (leadsByStatus[status] || 0) + 1;
    });

    // Leads over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: leadsOverTimeData } = await supabase
      .from('leads')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // Group by date
    const leadsOverTime: Record<string, number> = {};
    leadsOverTimeData?.forEach((lead) => {
      const date = new Date(lead.created_at).toISOString().split('T')[0];
      leadsOverTime[date] = (leadsOverTime[date] || 0) + 1;
    });

    // Event registrations per event
    const { data: events } = await supabase
      .from('events')
      .select('id, title');

    const eventRegistrationsData: Array<{
      event_id: string;
      event_title: string;
      registrations: number;
      revenue: number;
    }> = [];

    if (events) {
      for (const event of events) {
        const { data: registrations } = await supabase
          .from('event_registrations')
          .select('amount_in_inr')
          .eq('event_id', event.id)
          .eq('status', 'confirmed');

        const count = registrations?.length || 0;
        const revenue =
          registrations?.reduce((sum, reg) => sum + (reg.amount_in_inr || 0), 0) || 0;

        eventRegistrationsData.push({
          event_id: event.id,
          event_title: event.title,
          registrations: count,
          revenue: revenue,
        });
      }
    }

    // UTM breakdown - top utm_source
    const { data: utmSourceData } = await supabase
      .from('leads')
      .select('utm_source')
      .not('utm_source', 'is', null);

    const utmSourceCounts: Record<string, number> = {};
    utmSourceData?.forEach((lead) => {
      const source = lead.utm_source || '';
      if (source) {
        utmSourceCounts[source] = (utmSourceCounts[source] || 0) + 1;
      }
    });

    // UTM breakdown - top utm_campaign
    const { data: utmCampaignData } = await supabase
      .from('leads')
      .select('utm_campaign')
      .not('utm_campaign', 'is', null);

    const utmCampaignCounts: Record<string, number> = {};
    utmCampaignData?.forEach((lead) => {
      const campaign = lead.utm_campaign || '';
      if (campaign) {
        utmCampaignCounts[campaign] = (utmCampaignCounts[campaign] || 0) + 1;
      }
    });

    // Sort and get top 10
    const topUtmSources = Object.entries(utmSourceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }));

    const topUtmCampaigns = Object.entries(utmCampaignCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([campaign, count]) => ({ campaign, count }));

    return NextResponse.json({
      summary: {
        totalLeads: totalLeads || 0,
        leadsThisWeek: leadsThisWeek || 0,
        conversionRate: Math.round(conversionRate * 100) / 100,
        eventRevenueThisMonth: eventRevenueThisMonth,
      },
      leadsBySource: Object.entries(leadsBySource)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count),
      leadsByStatus: Object.entries(leadsByStatus)
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count),
      leadsOverTime: Object.entries(leadsOverTime)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      eventRegistrations: eventRegistrationsData.sort(
        (a, b) => b.registrations - a.registrations
      ),
      utmBreakdown: {
        topSources: topUtmSources,
        topCampaigns: topUtmCampaigns,
      },
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error.message },
      { status: 500 }
    );
  }
}

