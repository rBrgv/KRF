import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { z } from 'zod';

const workoutPlanSchema = z.object({
  goal: z.string().min(10),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  daysPerWeek: z.number().min(1).max(7),
  equipment: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = workoutPlanSchema.parse(body);

    const prompt = `Generate a detailed 4-week workout plan for someone with the following requirements:
- Goal: ${validatedData.goal}
- Experience Level: ${validatedData.experience}
- Days per Week: ${validatedData.daysPerWeek}
- Available Equipment: ${validatedData.equipment || 'Standard gym equipment'}

Create a structured 4-week plan with:
1. Weekly breakdown
2. Specific exercises for each day
3. Sets, reps, and rest periods
4. Progressive overload recommendations
5. Notes and tips

Format the response as a JSON object with weeks as an array, each containing days with exercises.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional fitness trainer. Generate detailed, safe, and effective workout plans.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Try to parse as JSON, fallback to text
    let plan;
    try {
      plan = JSON.parse(content);
    } catch {
      plan = { raw: content };
    }

    return NextResponse.json({ plan });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error generating workout plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate workout plan' },
      { status: 500 }
    );
  }
}

