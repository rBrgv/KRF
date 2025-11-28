import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { z } from 'zod';

const summarizerSchema = z.object({
  notes: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = summarizerSchema.parse(body);

    const prompt = `Analyze the following lead notes and provide a structured summary:

${validatedData.notes}

Provide a JSON response with the following structure:
{
  "summary": "Brief summary of the lead",
  "challenges": "Key challenges or concerns mentioned",
  "motivation": "What motivates this lead",
  "likelihood": "Assessment of conversion likelihood (high/medium/low) with reasoning",
  "nextSteps": "Recommended next steps for the coach"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a sales and lead management expert. Analyze lead notes and provide actionable insights.',
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

    const summary = JSON.parse(content);

    return NextResponse.json(summary);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

