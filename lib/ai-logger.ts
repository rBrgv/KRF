import { createClient } from '@/lib/supabase/server';

export async function logAIUsage(
  type: string,
  inputSummary: string,
  outputSummary: string
) {
  try {
    const supabase = await createClient();
    await supabase.from('ai_logs').insert([
      {
        type,
        input_summary: inputSummary.substring(0, 500), // Limit length
        output_summary: outputSummary.substring(0, 500),
      },
    ]);
  } catch (error) {
    // Don't fail the request if logging fails
    console.error('Error logging AI usage:', error);
  }
}

