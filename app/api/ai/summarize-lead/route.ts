import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { logAIUsage } from '@/lib/ai-logger';
import { z } from 'zod';

const summarizeSchema = z.object({
  rawNotes: z.string().min(10, 'Notes must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = summarizeSchema.parse(body);

    const prompt = `Analyze the following lead notes and provide a structured summary:

${validatedData.rawNotes}

Provide a JSON response with:
{
  "summary": "Brief 2-3 sentence summary of the lead",
  "challenges": "Key challenges or concerns mentioned",
  "motivation": "What motivates this lead based on the notes",
  "likelihoodScore": "number between 1-10 indicating conversion likelihood",
  "suggestedNextSteps": "Recommended next steps for the coach"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a sales and lead management expert. Analyze lead notes and provide actionable insights in JSON format. Always return valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    let summary;
    try {
      summary = JSON.parse(content);
    } catch {
      summary = { error: 'Failed to parse AI response', raw: content };
    }

    // Log usage
    await logAIUsage(
      'lead_summary',
      validatedData.rawNotes.substring(0, 200),
      `Summary generated, likelihood: ${summary.likelihoodScore || 'N/A'}`
    );

    return NextResponse.json(summary);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error summarizing lead:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to summarize lead' },
      { status: 500 }
    );
  }
}

