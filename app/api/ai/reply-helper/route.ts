import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { logAIUsage } from '@/lib/ai-logger';
import { z } from 'zod';

const replyHelperSchema = z.object({
  leadContext: z.string().min(10, 'Lead context must be at least 10 characters'),
  tone: z.enum(['friendly', 'direct', 'premium']).default('friendly'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = replyHelperSchema.parse(body);

    const toneDescriptions = {
      friendly: 'warm, approachable, and conversational',
      direct: 'straightforward, professional, and to-the-point',
      premium: 'sophisticated, polished, and high-value',
    };

    const prompt = `Based on the following lead context, generate professional reply templates for WhatsApp and email:

Lead Context:
${validatedData.leadContext}

Tone: ${toneDescriptions[validatedData.tone]}

Generate 2-3 WhatsApp templates (concise, under 160 words each) and 2-3 email templates (professional, 100-200 words each).

Return JSON with:
{
  "whatsappTemplates": ["template1", "template2", "template3"],
  "emailTemplates": ["template1", "template2", "template3"]
}

Make templates suitable for Indian audience, include relevant call-to-actions, and address the lead's specific context.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a customer service expert specializing in fitness and wellness communication. Generate professional, culturally appropriate reply templates in JSON format. Always return valid JSON only.',
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

    let templates;
    try {
      templates = JSON.parse(content);
    } catch {
      templates = { error: 'Failed to parse AI response', raw: content };
    }

    // Log usage
    await logAIUsage(
      'reply_helper',
      validatedData.leadContext.substring(0, 200),
      `Generated ${templates.whatsappTemplates?.length || 0} WhatsApp + ${templates.emailTemplates?.length || 0} email templates`
    );

    return NextResponse.json(templates);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error generating replies:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate replies' },
      { status: 500 }
    );
  }
}
