'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { ExerciseForm } from './ExerciseForm';

interface Exercise {
  id: string;
  name: string;
  category: string;
  equipment: string;
  muscle_group: string;
  description: string | null;
  demo_url: string | null;
  created_at: string;
}

export function ExerciseLibrary() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryFilter) params.set('category', categoryFilter);
      if (equipmentFilter) params.set('equipment', equipmentFilter);

      const response = await fetch(`/api/workouts/exercises?${params.toString()}`);
      const result = await response.json();
      if (result.success) {
        setExercises(result.data);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [search, categoryFilter, equipmentFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exercise?')) return;

    try {
      const response = await fetch(`/api/workouts/exercises/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchExercises();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete exercise');
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      alert('An error occurred');
    }
  };

  const categories = ['push', 'pull', 'legs', 'full_body', 'cardio', 'core', 'flexibility', 'other'];
  const equipment = ['dumbbells', 'barbell', 'bodyweight', 'machine', 'cable', 'kettlebell', 'resistance_band', 'other'];

  return (
    <div>
      {/* Header and Filters */}
      <div className="premium-card rounded-2xl p-6 mb-6 border border-gray-800/50">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
            <select
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Equipment</option>
              {equipment.map((eq) => (
                <option key={eq} value={eq}>
                  {eq.charAt(0).toUpperCase() + eq.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              setEditingExercise(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Exercise
          </button>
        </div>
      </div>

      {/* Exercises Table */}
      <div className="premium-card rounded-2xl overflow-hidden border border-gray-800/50">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading exercises...</div>
        ) : exercises.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">No exercises found</p>
            <button
              onClick={() => {
                setEditingExercise(null);
                setShowForm(true);
              }}
              className="text-red-400 hover:text-red-300"
            >
              Add your first exercise
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-900/50 border-b border-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Muscle Group
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {exercises.map((exercise) => (
                <tr key={exercise.id} className="hover:bg-gray-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-white">{exercise.name}</div>
                    {exercise.description && (
                      <div className="text-xs text-gray-400 mt-1 line-clamp-1">{exercise.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {exercise.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                      {exercise.equipment.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      {exercise.muscle_group.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingExercise(exercise);
                          setShowForm(true);
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exercise.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Exercise Form Modal */}
      {showForm && (
        <ExerciseForm
          exercise={editingExercise || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingExercise(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingExercise(null);
            fetchExercises();
          }}
        />
      )}
    </div>
  );
}




