'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Edit2, Plus, Calendar, Clock, Trash2, Play, Dumbbell, CheckCircle, XCircle, AlertCircle, Apple, LogIn, LogOut, Mail, MessageCircle } from 'lucide-react';
import { RecurringSessionForm } from './RecurringSessionForm';
import { WorkoutAssignmentForm } from './workouts/WorkoutAssignmentForm';
import { WorkoutCompletionLogForm } from './workouts/WorkoutCompletionLogForm';
import { MealPlanAssignmentForm } from './nutrition/MealPlanAssignmentForm';
import { NutritionLogForm } from './nutrition/NutritionLogForm';
import { EmailComposeForm } from './EmailComposeForm';
import { WhatsAppComposeForm } from './WhatsAppComposeForm';
import { WhatsAppConversation } from './WhatsAppConversation';
import { ClientProgressView } from './ClientProgressView';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  goal: string | null;
  program_start_date: string | null;
  subscription_type: '3_month' | 'monthly' | 'yearly' | null;
  program_type: 'silver' | 'gold' | 'platinum' | 'weight_loss' | 'weight_gain' | 'strength_conditioning' | 'medical_condition' | 'rehab' | null;
  notes: string | null;
  lead_id: string | null;
  created_at: string;
}

const subscriptionLabels: Record<string, string> = {
  '3_month': '3 Month',
  'monthly': 'Monthly',
  'yearly': 'Yearly',
};

const programLabels: Record<string, string> = {
  'silver': 'Silver',
  'gold': 'Gold',
  'platinum': 'Platinum',
  'weight_loss': 'Weight Loss',
  'weight_gain': 'Weight Gain',
  'strength_conditioning': 'Strength & Conditioning',
  'medical_condition': 'Medical Condition',
  'rehab': 'Rehabilitation',
};

const subscriptionColors: Record<string, string> = {
  '3_month': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'monthly': 'bg-green-500/10 text-green-400 border-green-500/30',
  'yearly': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
};

const programColors: Record<string, string> = {
  'silver': 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  'gold': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  'platinum': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  'weight_loss': 'bg-red-500/10 text-red-400 border-red-500/30',
  'weight_gain': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  'strength_conditioning': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  'medical_condition': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  'rehab': 'bg-teal-500/10 text-teal-400 border-teal-500/30',
};

interface Lead {
  id: string;
  name: string;
  source: string | null;
  status: string;
}

interface Appointment {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string | null;
  type: string | null;
}

interface RecurringSession {
  id: string;
  client_id: string;
  days_of_week: number[];
  start_time: string;
  duration_minutes: number;
  title: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

interface WorkoutAssignment {
  id: string;
  client_id: string;
  workout_plan_id: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  notes: string | null;
  workout_plans?: {
    id: string;
    title: string;
    goal_type: string;
    level: string;
  };
}

interface CompletionLog {
  id: string;
  client_id: string;
  workout_plan_id: string;
  workout_plan_day_id: string;
  date: string;
  status: 'completed' | 'partially_completed' | 'skipped';
  notes: string | null;
  workout_plans?: {
    id: string;
    title: string;
  };
  workout_plan_days?: {
    id: string;
    day_index: number;
    title: string;
  };
}

interface MealPlanAssignment {
  id: string;
  client_id: string;
  meal_plan_id: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  notes: string | null;
  meal_plans?: {
    id: string;
    title: string;
    goal_type: string;
  };
}

interface Food {
  id: string;
  name: string;
  category: string;
  description?: string;
}

interface FoodLogEntry {
  id: string;
  serving_size_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  meal_type: string | null;
  foods: Food | null;
}

interface NutritionLog {
  id: string;
  client_id: string;
  date: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fats_g: number;
  notes: string | null;
  source: string;
  food_log_entries?: FoodLogEntry[];
}

interface AttendanceLog {
  id: string;
  client_id: string;
  appointment_id: string | null;
  check_in_time: string;
  check_out_time: string | null;
  notes: string | null;
  appointments?: {
    title: string;
    date: string;
    start_time: string;
  };
}

interface ClientDetailProps {
  client: Client;
  lead: Lead | null;
  appointments: Appointment[];
  recurringSessions?: RecurringSession[];
  workoutAssignments?: WorkoutAssignment[];
  completionLogs?: CompletionLog[];
  mealPlanAssignments?: MealPlanAssignment[];
  nutritionLogs?: NutritionLog[];
  attendanceLogs?: AttendanceLog[];
  sessionsLast30Days?: number;
}

export function ClientDetail({ client, lead, appointments, recurringSessions = [], workoutAssignments = [], completionLogs = [], mealPlanAssignments = [], nutritionLogs = [], attendanceLogs = [], sessionsLast30Days = 0 }: ClientDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    subscription_type: client.subscription_type || '',
    program_type: client.program_type || '',
  });
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [editingSession, setEditingSession] = useState<RecurringSession | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [showMealPlanAssignmentForm, setShowMealPlanAssignmentForm] = useState(false);
  const [showNutritionLogForm, setShowNutritionLogForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription_type: formData.subscription_type || null,
          program_type: formData.program_type || null,
        }),
      });

      if (response.ok) {
        router.refresh();
        setIsEditing(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <Link
        href="/dashboard/clients"
        className="text-gray-400 hover:text-red-400 mb-6 inline-block transition-colors"
      >
        ← Back to Clients
      </Link>

      <div className="premium-card rounded-2xl p-8 mb-8 border border-gray-800/50">
        <div className="flex items-start justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">{client.name}</h1>
          <div className="flex gap-2 flex-wrap">
            {client.program_type && (
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${programColors[client.program_type] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                {programLabels[client.program_type] || client.program_type}
              </span>
            )}
            {client.subscription_type && (
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${subscriptionColors[client.subscription_type] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                {subscriptionLabels[client.subscription_type] || client.subscription_type}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="premium-card rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Contact Information</h2>
              <div className="flex gap-2">
                {client.email && (
                  <button
                    onClick={() => setShowEmailForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </button>
                )}
                {client.phone && (
                  <button
                    onClick={() => setShowWhatsAppForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/30"
                    title="Send WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send WhatsApp
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-gray-300">
                <span className="font-semibold text-white">Phone:</span> <span className="text-gray-300">{client.phone}</span>
              </p>
              {client.email && (
                <p className="text-gray-300">
                  <span className="font-semibold text-white">Email:</span> <span className="text-gray-300">{client.email}</span>
                </p>
              )}
              {client.goal && (
                <p className="text-gray-300">
                  <span className="font-semibold text-white">Goal:</span> <span className="text-gray-300">{client.goal}</span>
                </p>
              )}
              {client.program_start_date && (
                <p className="text-gray-300">
                  <span className="font-semibold text-white">Program Start:</span>{' '}
                  <span className="text-gray-300">{formatDate(client.program_start_date)}</span>
                </p>
              )}
            </div>
          </div>

          <div className="premium-card rounded-xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Program & Subscription</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Edit Program & Subscription"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Program Type
                  </label>
                  <select
                    value={formData.program_type}
                    onChange={(e) => setFormData({ ...formData, program_type: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select Program</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="weight_gain">Weight Gain</option>
                    <option value="strength_conditioning">Strength & Conditioning</option>
                    <option value="medical_condition">Medical Condition</option>
                    <option value="rehab">Rehabilitation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subscription Type
                  </label>
                  <select
                    value={formData.subscription_type}
                    onChange={(e) => setFormData({ ...formData, subscription_type: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select Subscription</option>
                    <option value="3_month">3 Month</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        subscription_type: client.subscription_type || '',
                        program_type: client.program_type || '',
                      });
                    }}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {client.program_type ? (
                  <div>
                    <span className="font-semibold text-white text-sm">Program:</span>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${programColors[client.program_type] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                        {programLabels[client.program_type] || client.program_type}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No program assigned</p>
                )}
                {client.subscription_type ? (
                  <div>
                    <span className="font-semibold text-white text-sm">Subscription:</span>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${subscriptionColors[client.subscription_type] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                        {subscriptionLabels[client.subscription_type] || client.subscription_type}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No subscription set</p>
                )}
              </div>
            )}
          </div>

          {lead && (
            <div className="premium-card rounded-xl p-6 border border-gray-800/50">
              <h2 className="text-xl font-semibold mb-4 text-white">Linked Lead</h2>
              <div className="space-y-3">
                <p className="text-gray-300">
                  <span className="font-semibold text-white">Source:</span> <span className="text-gray-300">{lead.source || '-'}</span>
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold text-white">Status:</span> <span className="text-gray-300">{lead.status}</span>
                </p>
                <Link
                  href={`/dashboard/leads/${lead.id}`}
                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                >
                  View Lead →
                </Link>
              </div>
            </div>
          )}
        </div>

        {client.notes && (
          <div className="mb-8 premium-card rounded-xl p-6 border border-gray-800/50">
            <h2 className="text-xl font-semibold mb-4 text-white">Notes</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{client.notes}</p>
          </div>
        )}

        <div className="text-sm text-gray-500 border-t border-gray-800 pt-6">
          <p>Created: {formatDate(client.created_at)}</p>
        </div>
      </div>

      {/* Workout Plans Section */}
      <div className="premium-card rounded-2xl p-8 border border-gray-800/50 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Workout Plans</h2>
          <button
            onClick={() => setShowAssignmentForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Assign Plan
          </button>
        </div>

        {workoutAssignments.length > 0 ? (
          <div className="space-y-4 mb-6">
            {workoutAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`premium-card rounded-xl p-6 border ${
                  assignment.is_active ? 'border-green-500/30' : 'border-gray-800/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Dumbbell className="w-5 h-5 text-red-400" />
                      <h3 className="text-lg font-semibold text-white">
                        {assignment.workout_plans?.title || 'Unknown Plan'}
                      </h3>
                      {assignment.is_active ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/30">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>
                        <span className="font-semibold">Start:</span> {formatDate(assignment.start_date)}
                      </p>
                      {assignment.end_date && (
                        <p>
                          <span className="font-semibold">End:</span> {formatDate(assignment.end_date)}
                        </p>
                      )}
                      {assignment.workout_plans && (
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            {assignment.workout_plans.goal_type.replace('_', ' ')}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/30">
                            {assignment.workout_plans.level}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-6">
            <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No workout plans assigned</p>
            <p className="text-sm text-gray-500">
              Assign a workout plan to track client progress
            </p>
          </div>
        )}

        {/* Recent Completion Logs */}
        <div className="border-t border-gray-800/50 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Workout Completion</h3>
            <button
              onClick={() => setShowCompletionForm(true)}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Log Completion
            </button>
          </div>
          {completionLogs.length > 0 ? (
            <div className="space-y-2">
              {completionLogs.slice(0, 5).map((log) => {
                const statusIcons = {
                  completed: <CheckCircle className="w-4 h-4 text-green-400" />,
                  partially_completed: <AlertCircle className="w-4 h-4 text-yellow-400" />,
                  skipped: <XCircle className="w-4 h-4 text-red-400" />,
                };
                const statusColors = {
                  completed: 'text-green-400',
                  partially_completed: 'text-yellow-400',
                  skipped: 'text-red-400',
                };
                return (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {statusIcons[log.status]}
                      <div>
                        <p className="text-sm text-white">
                          {log.workout_plans?.title || 'Unknown Plan'} - Day {log.workout_plan_days?.day_index || '?'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(log.date)} • {log.workout_plan_days?.title || ''}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${statusColors[log.status]}`}>
                      {log.status.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No completion logs yet</p>
          )}
        </div>
      </div>

      {/* Nutrition Section */}
      <div className="premium-card rounded-2xl p-8 border border-gray-800/50 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Nutrition</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowMealPlanAssignmentForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              Assign Plan
            </button>
            <button
              onClick={() => setShowNutritionLogForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Log Entry
            </button>
          </div>
        </div>

        {/* Meal Plan Assignments */}
        {mealPlanAssignments.length > 0 ? (
          <div className="space-y-4 mb-6">
            {mealPlanAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`premium-card rounded-xl p-6 border ${
                  assignment.is_active ? 'border-green-500/30' : 'border-gray-800/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Apple className="w-5 h-5 text-red-400" />
                      <h3 className="text-lg font-semibold text-white">
                        {assignment.meal_plans?.title || 'Unknown Plan'}
                      </h3>
                      {assignment.is_active ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/30">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>
                        <span className="font-semibold">Start:</span> {formatDate(assignment.start_date)}
                      </p>
                      {assignment.end_date && (
                        <p>
                          <span className="font-semibold">End:</span> {formatDate(assignment.end_date)}
                        </p>
                      )}
                      {assignment.meal_plans && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 mt-2">
                          {assignment.meal_plans.goal_type.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-6">
            <Apple className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No meal plans assigned</p>
            <p className="text-sm text-gray-500">
              Assign a meal plan to track nutrition
            </p>
          </div>
        )}

        {/* Recent Nutrition Logs */}
        <div className="border-t border-gray-800/50 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Nutrition Logs</h3>
          {nutritionLogs.length > 0 ? (
            <div className="space-y-4">
              {nutritionLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-4 bg-gray-900/30 rounded-lg border border-gray-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-white font-semibold">
                      {formatDate(log.date)}
                    </p>
                    <span className="text-xs text-gray-500">
                      {log.source === 'from_plan' ? 'From Plan' : 'Manual'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400 mb-3">
                    <span className="text-red-400">{Number(log.total_calories || 0).toFixed(0)} cal</span>
                    <span className="text-blue-400">{Number(log.total_protein_g || 0).toFixed(1)}g P</span>
                    <span className="text-green-400">{Number(log.total_carbs_g || 0).toFixed(1)}g C</span>
                    <span className="text-yellow-400">{Number(log.total_fats_g || 0).toFixed(1)}g F</span>
                  </div>
                  {log.food_log_entries && log.food_log_entries.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700/30">
                      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">Foods Logged:</p>
                      {(() => {
                        // Group entries by meal type
                        const mealGroups: Record<string, FoodLogEntry[]> = {
                          breakfast: [],
                          lunch: [],
                          dinner: [],
                          snacks: [],
                        };

                        log.food_log_entries.forEach((entry) => {
                          const mealType = entry.meal_type || 'snacks';
                          if (mealGroups[mealType]) {
                            mealGroups[mealType].push(entry);
                          } else {
                            mealGroups.snacks.push(entry);
                          }
                        });

                        const mealLabels: Record<string, string> = {
                          breakfast: '🍳 Breakfast',
                          lunch: '🍽️ Lunch',
                          dinner: '🌙 Dinner',
                          snacks: '🍪 Snacks',
                        };

                        return (
                          <div className="space-y-2">
                            {Object.entries(mealGroups).map(([mealType, entries]) => {
                              if (entries.length === 0) return null;
                              return (
                                <div key={mealType} className="space-y-1">
                                  <p className="text-xs font-semibold text-purple-400">
                                    {mealLabels[mealType] || mealType}
                                  </p>
                                  {entries.map((entry) => (
                                    <div
                                      key={entry.id}
                                      className="flex items-center justify-between text-xs bg-gray-800/30 rounded px-2 py-1"
                                    >
                                      <span className="text-gray-300">
                                        {entry.foods?.name || 'Unknown Food'}
                                        {entry.serving_size_g && (
                                          <span className="text-gray-500 ml-1">
                                            ({entry.serving_size_g.toFixed(0)}g)
                                          </span>
                                        )}
                                      </span>
                                      <span className="text-gray-400">
                                        {entry.calories.toFixed(0)} cal
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  {log.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-700/30">
                      <p className="text-xs font-semibold text-gray-400 mb-1">Notes:</p>
                      <p className="text-xs text-gray-300">{log.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No nutrition logs yet</p>
          )}
        </div>
      </div>

      {/* Attendance Section */}
      <div className="premium-card rounded-2xl p-8 border border-gray-800/50 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Attendance</h2>
            <p className="text-sm text-gray-400 mt-1">
              {sessionsLast30Days} sessions attended in last 30 days
            </p>
          </div>
        </div>

        {attendanceLogs.length > 0 ? (
          <div className="space-y-4">
            <div className="premium-card rounded-xl overflow-hidden border border-gray-800/50">
              <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Session
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Check In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Check Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {attendanceLogs.slice(0, 10).map((log) => {
                    const checkIn = new Date(log.check_in_time);
                    const checkOut = log.check_out_time ? new Date(log.check_out_time) : null;
                    const duration = checkOut 
                      ? Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60))
                      : null;

                    return (
                      <tr key={log.id} className="hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(log.check_in_time)}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {log.appointments?.title || 'Standalone Session'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {checkIn.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {checkOut 
                            ? checkOut.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                            : <span className="text-yellow-400">In Session</span>
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {duration !== null 
                            ? `${duration} min`
                            : '-'
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <LogIn className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No attendance records yet</p>
            <p className="text-sm text-gray-500">
              Attendance will be tracked when clients check in for appointments
            </p>
          </div>
        )}
      </div>

      {/* Recurring Sessions Section */}
      <div className="premium-card rounded-2xl p-8 border border-gray-800/50 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Recurring Sessions</h2>
          <button
            onClick={() => {
              setEditingSession(null);
              setShowRecurringForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Session
          </button>
        </div>

        {recurringSessions.length > 0 ? (
          <div className="space-y-4">
            {recurringSessions.map((session) => {
              const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const selectedDays = session.days_of_week.map(d => DAYS[d]).join(', ');
              const [hours, minutes] = session.start_time.split(':').map(Number);
              const endTime = new Date();
              endTime.setHours(hours, minutes + session.duration_minutes, 0, 0);
              const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

              return (
                <div
                  key={session.id}
                  className={`premium-card rounded-xl p-6 border ${
                    session.is_active ? 'border-green-500/30' : 'border-gray-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-white">
                          {session.title || 'Recurring Session'}
                        </h3>
                        {session.is_active ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/30">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{selectedDays}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{session.start_time} - {endTimeStr} ({session.duration_minutes} min)</span>
                        </div>
                        {session.notes && (
                          <p className="text-gray-400 text-xs mt-2">{session.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={async () => {
                          setIsGenerating(true);
                          try {
                            const response = await fetch('/api/recurring-sessions/generate', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                client_id: client.id,
                                weeks_ahead: 4,
                              }),
                            });
                            if (response.ok) {
                              const result = await response.json();
                              alert(`Generated ${result.generated} appointments for the next 4 weeks`);
                              router.refresh();
                            } else {
                              const error = await response.json();
                              alert(error.error || 'Failed to generate appointments');
                            }
                          } catch (error) {
                            console.error('Error generating appointments:', error);
                            alert('An error occurred');
                          } finally {
                            setIsGenerating(false);
                          }
                        }}
                        disabled={isGenerating || !session.is_active}
                        className="p-2 text-green-400 hover:text-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Generate appointments for next 4 weeks"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingSession(session);
                          setShowRecurringForm(true);
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit session"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm('Are you sure you want to delete this recurring session?')) return;
                          try {
                            const response = await fetch(`/api/recurring-sessions/${session.id}`, {
                              method: 'DELETE',
                            });
                            if (response.ok) {
                              router.refresh();
                            } else {
                              const error = await response.json();
                              alert(error.error || 'Failed to delete session');
                            }
                          } catch (error) {
                            console.error('Error deleting session:', error);
                            alert('An error occurred');
                          }
                        }}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No recurring sessions set up</p>
            <p className="text-sm text-gray-500">
              Add a recurring session to automatically generate appointments
            </p>
          </div>
        )}
      </div>

      <div className="premium-card rounded-2xl p-8 border border-gray-800/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Appointments</h2>
          <Link
            href={`/dashboard/appointments?client_id=${client.id}`}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            View all →
          </Link>
        </div>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.slice(0, 5).map((apt) => (
              <div key={apt.id} className="border-b border-gray-800 pb-4 last:border-0">
                <p className="font-semibold text-white mb-1">{apt.title}</p>
                <p className="text-sm text-gray-400">
                  {formatDate(apt.date)} • {apt.start_time}
                  {apt.end_time && ` - ${apt.end_time}`}
                  {apt.type && ` • ${apt.type}`}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No appointments</p>
        )}
      </div>

      {/* Recurring Session Form Modal */}
      {showRecurringForm && (
        <RecurringSessionForm
          clientId={client.id}
          session={editingSession || undefined}
          onClose={() => {
            setShowRecurringForm(false);
            setEditingSession(null);
          }}
        />
      )}

      {/* Workout Assignment Form Modal */}
      {showAssignmentForm && (
        <WorkoutAssignmentForm
          clientId={client.id}
          onClose={() => setShowAssignmentForm(false)}
          onSuccess={() => {
            setShowAssignmentForm(false);
            router.refresh();
          }}
        />
      )}

      {/* Workout Completion Log Form Modal */}
      {showCompletionForm && (
        <WorkoutCompletionLogForm
          clientId={client.id}
          assignments={workoutAssignments.filter(a => a.is_active)}
          onClose={() => setShowCompletionForm(false)}
          onSuccess={() => {
            setShowCompletionForm(false);
            router.refresh();
          }}
        />
      )}

      {/* Meal Plan Assignment Form Modal */}
      {showMealPlanAssignmentForm && (
        <MealPlanAssignmentForm
          clientId={client.id}
          onClose={() => setShowMealPlanAssignmentForm(false)}
          onSuccess={() => {
            setShowMealPlanAssignmentForm(false);
            router.refresh();
          }}
        />
      )}

      {/* Nutrition Log Form Modal */}
      {showNutritionLogForm && (
        <NutritionLogForm
          clientId={client.id}
          onClose={() => setShowNutritionLogForm(false)}
          onSuccess={() => {
            setShowNutritionLogForm(false);
            router.refresh();
          }}
        />
      )}

      {/* WhatsApp Conversation Section */}
      {client.phone && (
        <div className="mb-8">
          <WhatsAppConversation clientId={client.id} clientPhone={client.phone} />
        </div>
      )}

      {/* Progress Section */}
      <div className="premium-card rounded-2xl p-8 border border-gray-800/50 mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">Progress Tracking</h2>
          <p className="text-sm text-gray-400 mt-1">
            View client's body measurements, progress photos, and goals
          </p>
        </div>
        <ClientProgressView clientId={client.id} />
      </div>

      {/* Email Compose Form Modal */}
      {showEmailForm && (
        <EmailComposeForm
          clientId={client.id}
          clientName={client.name}
          clientEmail={client.email || undefined}
          onClose={() => setShowEmailForm(false)}
          onSuccess={() => {
            setShowEmailForm(false);
            router.refresh();
          }}
        />
      )}

      {/* WhatsApp Compose Form Modal */}
      {showWhatsAppForm && (
        <WhatsAppComposeForm
          clientId={client.id}
          clientName={client.name}
          clientPhone={client.phone || undefined}
          onClose={() => setShowWhatsAppForm(false)}
          onSuccess={() => {
            setShowWhatsAppForm(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

