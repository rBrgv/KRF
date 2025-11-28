import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { logAIUsage } from '@/lib/ai-logger';
import { z } from 'zod';

const captionHelperSchema = z.object({
  contextType: z.enum(['transformation', 'event']),
  details: z.string().min(10, 'Details must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = captionHelperSchema.parse(body);

    const prompt = `Generate 3-5 Instagram caption suggestions for a ${validatedData.contextType} post with the following details:

${validatedData.details}

Requirements:
- Engaging and inspirational
- Include 5-10 relevant hashtags
- Suitable for Indian fitness audience
- Include emojis appropriately
- Call-to-action when relevant
- 150-300 words per caption
- Make each caption unique

Return JSON with:
{
  "captions": ["caption1", "caption2", "caption3", "caption4", "caption5"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a social media expert specializing in fitness and wellness content for Instagram. Generate engaging, culturally appropriate captions in JSON format. Always return valid JSON only.',
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

    let captions;
    try {
      captions = JSON.parse(content);
    } catch {
      captions = { error: 'Failed to parse AI response', raw: content };
    }

    // Log usage
    await logAIUsage(
      'caption_helper',
      `${validatedData.contextType}: ${validatedData.details.substring(0, 200)}`,
      `Generated ${captions.captions?.length || 0} captions`
    );

    return NextResponse.json(captions);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error generating captions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate captions' },
      { status: 500 }
    );
  }
}

