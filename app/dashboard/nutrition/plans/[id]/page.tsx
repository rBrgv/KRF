import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { MealPlanEditor } from '@/components/dashboard/nutrition/MealPlanEditor';

export default async function MealPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const { id } = await params;

  // Fetch plan with items directly from Supabase
  const supabase = await createClient();
  
  const { data: plan, error: planError } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('id', id)
    .single();

  if (planError || !plan) {
    redirect('/dashboard/nutrition');
  }

  // Fetch items
  const { data: items, error: itemsError } = await supabase
    .from('meal_plan_items')
    .select('*')
    .eq('meal_plan_id', id)
    .order('meal_type', { ascending: true })
    .order('order_index', { ascending: true });

  const planWithItems = {
    ...plan,
    items: items || [],
  };

  return (
    <div className="p-4 lg:p-8">
      <MealPlanEditor planId={id} initialPlan={planWithItems} />
    </div>
  );
}




