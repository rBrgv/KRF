import { redirect } from 'next/navigation';
import { getClientByUserId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { Apple, Plus, Calendar } from 'lucide-react';
import { NutritionLogForm } from '@/components/portal/NutritionLogForm';
import { NutritionLogsList } from '@/components/portal/NutritionLogsList';
import { WaterIntakeTracker } from '@/components/portal/WaterIntakeTracker';

export default async function PortalNutritionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const client = await getClientByUserId(user.id);

  if (!client) {
    redirect('/portal');
  }

  // Fetch recent nutrition logs (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const startDate = thirtyDaysAgo.toISOString().split('T')[0];

  const { data: nutritionLogs } = await supabase
    .from('nutrition_logs')
    .select(`
      *,
      food_log_entries (
        id,
        serving_size_g,
        calories,
        protein_g,
        carbs_g,
        fats_g,
        meal_type,
        foods:food_id (
          id,
          name,
          category,
          description
        )
      )
    `)
    .eq('client_id', client.id)
    .gte('date', startDate)
    .order('date', { ascending: false })
    .limit(30);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Apple className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Daily Nutrition</h1>
              <p className="text-gray-400 text-lg">Log your daily food intake</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Log Today Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl mb-8 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Log Today's Nutrition</h2>
            </div>
          </div>
        </div>
        <div className="p-6">
          <NutritionLogForm clientId={client.id} />
        </div>
      </div>

      {/* Water Intake Tracker */}
      <div className="mb-8">
        <WaterIntakeTracker clientId={client.id} />
      </div>

      {/* Recent Logs */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Recent Logs (Last 30 Days)</h2>
          </div>
        </div>
        <div className="p-6">
          <NutritionLogsList logs={nutritionLogs || []} />
        </div>
      </div>
    </div>
  );
}

