import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { z } from 'zod';

const igCaptionSchema = z.object({
  content: z.string().min(10),
  type: z.enum(['transformation', 'event']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = igCaptionSchema.parse(body);

    const prompt = `Generate 2-3 Instagram caption suggestions for a ${validatedData.type} post with the following details:

${validatedData.content}

Requirements:
- Engaging and inspirational
- Include relevant hashtags (5-10)
- Suitable for Indian fitness audience
- Include emojis appropriately
- Call-to-action when relevant
- 150-300 words per caption

Return a JSON object with a "captions" array containing the caption strings.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a social media expert specializing in fitness and wellness content for Instagram.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const result = JSON.parse(content);
    const captions = result.captions || [];

    return NextResponse.json({ captions: Array.isArray(captions) ? captions : [captions] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error generating captions:', error);
    return NextResponse.json(
      { error: 'Failed to generate captions' },
      { status: 500 }
    );
  }
}

