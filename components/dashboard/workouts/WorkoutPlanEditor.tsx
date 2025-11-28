'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { WorkoutDayForm } from './WorkoutDayForm';
import { WorkoutExerciseForm } from './WorkoutExerciseForm';

interface Exercise {
  id: string;
  name: string;
  category: string;
  equipment: string;
  muscle_group: string;
}

interface WorkoutPlanExercise {
  id: string;
  exercise_id: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  order_index: number;
  notes: string | null;
  exercises?: Exercise;
}

interface WorkoutPlanDay {
  id: string;
  day_index: number;
  title: string;
  notes: string | null;
  exercises: WorkoutPlanExercise[];
}

interface WorkoutPlan {
  id: string;
  title: string;
  goal_type: string;
  level: string;
  notes: string | null;
  days: WorkoutPlanDay[];
}

interface WorkoutPlanEditorProps {
  planId: string;
  initialPlan: WorkoutPlan;
}

export function WorkoutPlanEditor({ planId, initialPlan }: WorkoutPlanEditorProps) {
  const router = useRouter();
  const [plan, setPlan] = useState<WorkoutPlan>(initialPlan);
  const [showDayForm, setShowDayForm] = useState(false);
  const [editingDay, setEditingDay] = useState<WorkoutPlanDay | null>(null);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<{ exercise: WorkoutPlanExercise; dayId: string } | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Expand first day by default
    if (plan.days && plan.days.length > 0) {
      setExpandedDays(new Set([plan.days[0].id]));
    }
  }, []);

  const fetchPlan = async () => {
    try {
      const response = await fetch(`/api/workouts/plans/${planId}`);
      const result = await response.json();
      if (result.success) {
        setPlan(result.data);
      }
    } catch (error) {
      console.error('Error fetching plan:', error);
    }
  };

  const toggleDay = (dayId: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayId)) {
      newExpanded.delete(dayId);
    } else {
      newExpanded.add(dayId);
    }
    setExpandedDays(newExpanded);
  };

  const handleDeleteDay = async (dayId: string) => {
    if (!confirm('Are you sure you want to delete this day? All exercises will be deleted.')) return;

    try {
      const response = await fetch(`/api/workouts/plans/days/${dayId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchPlan();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete day');
      }
    } catch (error) {
      console.error('Error deleting day:', error);
      alert('An error occurred');
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!confirm('Are you sure you want to remove this exercise from the plan?')) return;

    try {
      const response = await fetch(`/api/workouts/plans/exercises/${exerciseId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchPlan();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete exercise');
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      alert('An error occurred');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/workouts"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workouts</span>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{plan.title}</h1>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                {plan.goal_type.replace('_', ' ')}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                {plan.level}
              </span>
            </div>
            {plan.notes && (
              <p className="text-gray-400 mt-2">{plan.notes}</p>
            )}
          </div>
          <button
            onClick={() => {
              setEditingDay(null);
              setShowDayForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Day
          </button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {plan.days && plan.days.length > 0 ? (
          plan.days.map((day) => (
            <div
              key={day.id}
              className="premium-card rounded-xl p-6 border border-gray-800/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDay(day.id)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <GripVertical className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Day {day.day_index}: {day.title}
                    </h3>
                    {day.notes && (
                      <p className="text-sm text-gray-400 mt-1">{day.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingDay(day);
                      setShowDayForm(true);
                    }}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Edit day"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDay(day.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete day"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedDays.has(day.id) && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-300">Exercises</h4>
                    <button
                      onClick={() => {
                        setEditingExercise(null);
                        setShowExerciseForm(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Add Exercise
                    </button>
                  </div>

                  {day.exercises && day.exercises.length > 0 ? (
                    <div className="space-y-2">
                      {day.exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="premium-card rounded-lg p-4 border border-gray-800/50 bg-gray-900/30"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-semibold text-white">
                                  {exercise.exercises?.name || 'Unknown Exercise'}
                                </h5>
                                <span className="text-xs text-gray-400">
                                  {exercise.sets} sets × {exercise.reps} reps
                                </span>
                                {exercise.rest_seconds > 0 && (
                                  <span className="text-xs text-gray-500">
                                    • {exercise.rest_seconds}s rest
                                  </span>
                                )}
                              </div>
                              {exercise.notes && (
                                <p className="text-xs text-gray-400">{exercise.notes}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingExercise({ exercise, dayId: day.id });
                                  setShowExerciseForm(true);
                                }}
                                className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteExercise(exercise.id)}
                                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No exercises added yet. Click "Add Exercise" to get started.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="premium-card rounded-xl p-12 text-center border border-gray-800/50">
            <p className="text-gray-400 mb-4">No days added to this plan yet</p>
            <button
              onClick={() => {
                setEditingDay(null);
                setShowDayForm(true);
              }}
              className="text-red-400 hover:text-red-300"
            >
              Add your first day
            </button>
          </div>
        )}
      </div>

      {/* Day Form Modal */}
      {showDayForm && (
        <WorkoutDayForm
          planId={planId}
          day={editingDay || undefined}
          existingDays={plan.days || []}
          onClose={() => {
            setShowDayForm(false);
            setEditingDay(null);
          }}
          onSuccess={() => {
            setShowDayForm(false);
            setEditingDay(null);
            fetchPlan();
          }}
        />
      )}

      {/* Exercise Form Modal */}
      {showExerciseForm && (
        <WorkoutExerciseForm
          dayId={editingExercise?.dayId || ''}
          exercise={editingExercise?.exercise}
          onClose={() => {
            setShowExerciseForm(false);
            setEditingExercise(null);
          }}
          onSuccess={() => {
            setShowExerciseForm(false);
            setEditingExercise(null);
            fetchPlan();
          }}
        />
      )}
    </div>
  );
}

