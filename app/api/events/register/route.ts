import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      name,
      email,
      phone,
      city,
      source,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      referrer,
      amount_in_inr,
      payment_mode,
    } = body;

    if (!eventId || !name || !phone) {
      return NextResponse.json(
        { error: 'Event ID, name, and phone are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if event exists and is active
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('is_active', true)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found or inactive' },
        { status: 404 }
      );
    }

    // Check capacity if max_capacity is set (include both confirmed and pending registrations)
    if (event.max_capacity) {
      const { count } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .in('status', ['confirmed', 'pending']);

      if (count && count >= event.max_capacity) {
        return NextResponse.json(
          { error: 'Event is full' },
          { status: 400 }
        );
      }
    }

    // Create registration
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([
        {
          event_id: eventId,
          name,
          email: email || null,
          phone,
          city: city || null,
          source: source || 'website',
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
          utm_content: utm_content || null,
          referrer: referrer || null,
          status: (amount_in_inr || event.price_in_inr || 0) === 0 ? 'confirmed' : 'pending',
          amount_in_inr: amount_in_inr || event.price_in_inr || 0,
          payment_mode: payment_mode || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating registration:', error);
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/events/register:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
