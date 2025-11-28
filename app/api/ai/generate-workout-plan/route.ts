import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { logAIUsage } from '@/lib/ai-logger';
import { z } from 'zod';

const workoutPlanSchema = z.object({
  goal: z.string().min(10, 'Goal must be at least 10 characters'),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  daysPerWeek: z.number().int().min(1).max(7),
  equipment: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = workoutPlanSchema.parse(body);

    const prompt = `Generate a detailed 4-week workout plan in JSON format for someone with the following requirements:

Goal: ${validatedData.goal}
Experience Level: ${validatedData.experience}
Days per Week: ${validatedData.daysPerWeek}
Available Equipment: ${validatedData.equipment || 'Standard gym equipment'}

Create a structured 4-week program with:
- Week-by-week progression
- Day-by-day breakdown with specific exercises
- Sets, reps, and rest periods for each exercise
- Progressive overload recommendations
- Notes and tips for each week

Return ONLY a valid JSON object with this structure:
{
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "string",
      "days": [
        {
          "dayNumber": 1,
          "focus": "string",
          "exercises": [
            {
              "name": "string",
              "sets": number,
              "reps": "string",
              "rest": "string",
              "notes": "string"
            }
          ]
        }
      ],
      "notes": "string"
    }
  ],
  "summary": "Overall program summary"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional fitness trainer. Generate detailed, safe, and effective workout plans in JSON format. Always return valid JSON only.',
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

    let plan;
    try {
      plan = JSON.parse(content);
    } catch {
      // Fallback if not valid JSON
      plan = { error: 'Failed to parse AI response', raw: content };
    }

    // Log usage
    await logAIUsage(
      'workout_plan',
      `Goal: ${validatedData.goal}, Experience: ${validatedData.experience}, Days: ${validatedData.daysPerWeek}`,
      `Generated ${plan.weeks?.length || 0} weeks`
    );

    return NextResponse.json({ plan });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error generating workout plan:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate workout plan' },
      { status: 500 }
    );
  }
}

