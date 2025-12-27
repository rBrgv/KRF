import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      programName,
      programTitle,
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

    if (!programName || !programTitle || !name || !phone) {
      return NextResponse.json(
        { error: 'Program name, title, name, and phone are required' },
        { status: 400 }
      );
    }

    // Validate amount if provided
    let amount = amount_in_inr || 0;
    if (typeof amount_in_inr === 'string') {
      amount = parseFloat(amount_in_inr);
      if (isNaN(amount)) {
        return NextResponse.json(
          { error: 'amount_in_inr must be a valid number' },
          { status: 400 }
        );
      }
    }

    // Validate program name
    const validPrograms = ['11-day-trial', '4-week-starter', 'master-transformation'];
    if (!validPrograms.includes(programName)) {
      return NextResponse.json(
        { error: `Invalid program name. Must be one of: ${validPrograms.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create registration
    const { data, error } = await supabase
      .from('program_registrations')
      .insert([
        {
          program_name: programName,
          program_title: programTitle,
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
          status: amount === 0 ? 'confirmed' : 'pending',
          amount_in_inr: amount,
          payment_mode: payment_mode || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[Program Registration] Error creating registration:', {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        body: { programName, programTitle, name, phone, amount },
      });
      return NextResponse.json(
        { error: 'Failed to create registration', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      console.error('[Program Registration] No data returned from insert');
      return NextResponse.json(
        { error: 'Registration created but no data returned' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/programs/register:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



