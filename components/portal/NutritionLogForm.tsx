'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Search, Trash2 } from 'lucide-react';

interface Food {
  id: string;
  name: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fats_per_100g: number;
  common_serving_size_g: number;
  description?: string;
}

interface SelectedFood {
  food: Food;
  servingSizeG: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface NutritionLogFormProps {
  clientId: string;
}

export function NutritionLogForm({ clientId }: NutritionLogFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [manualMode, setManualMode] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    total_calories: '',
    total_protein_g: '',
    total_carbs_g: '',
    total_fats_g: '',
    notes: '',
  });
  const [defaultMealType, setDefaultMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  // Fetch foods when search query changes
  useEffect(() => {
    const fetchFoods = async () => {
      if (searchQuery.length < 2) {
        setFoods([]);
        return;
      }

      try {
        const params = new URLSearchParams();
        params.set('search', searchQuery);
        if (selectedCategory) params.set('category', selectedCategory);
        params.set('limit', '20');

        const response = await fetch(`/api/foods?${params.toString()}`);
        const result = await response.json();
        
        if (result.success) {
          setFoods(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

    const debounce = setTimeout(fetchFoods, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory]);

  // Close food search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.food-search-container')) {
        setShowFoodSearch(false);
      }
    };

    if (showFoodSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFoodSearch]);

  // Calculate totals from selected foods
  useEffect(() => {
    if (!manualMode && selectedFoods.length > 0) {
      const totals = selectedFoods.reduce(
        (acc, item) => ({
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fats: acc.fats + item.fats,
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );

      setFormData((prev) => ({
        ...prev,
        total_calories: totals.calories.toFixed(0),
        total_protein_g: totals.protein.toFixed(1),
        total_carbs_g: totals.carbs.toFixed(1),
        total_fats_g: totals.fats.toFixed(1),
      }));
    }
  }, [selectedFoods, manualMode]);

  const addFood = (food: Food, servingSizeG?: number) => {
    const size = servingSizeG || food.common_serving_size_g;
    const multiplier = size / 100;

    const selectedFood: SelectedFood = {
      food,
      servingSizeG: size,
      calories: food.calories_per_100g * multiplier,
      protein: food.protein_per_100g * multiplier,
      carbs: food.carbs_per_100g * multiplier,
      fats: food.fats_per_100g * multiplier,
      mealType: defaultMealType,
    };

    setSelectedFoods([...selectedFoods, selectedFood]);
    setSearchQuery('');
    setFoods([]);
    setShowFoodSearch(false);
  };

  const removeFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  const updateServingSize = (index: number, newSize: number) => {
    const updated = [...selectedFoods];
    const item = updated[index];
    const multiplier = newSize / 100;

    updated[index] = {
      ...item,
      servingSizeG: newSize,
      calories: item.food.calories_per_100g * multiplier,
      protein: item.food.protein_per_100g * multiplier,
      carbs: item.food.carbs_per_100g * multiplier,
      fats: item.food.fats_per_100g * multiplier,
    };

    setSelectedFoods(updated);
  };

  const updateMealType = (index: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const updated = [...selectedFoods];
    updated[index] = {
      ...updated[index],
      mealType,
    };
    setSelectedFoods(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Prepare food entries if foods were selected
      const food_entries = !manualMode && selectedFoods.length > 0
        ? selectedFoods.map((item) => ({
            food_id: item.food.id,
            serving_size_g: item.servingSizeG,
            calories: item.calories,
            protein_g: item.protein,
            carbs_g: item.carbs,
            fats_g: item.fats,
            meal_type: item.mealType,
          }))
        : undefined;

      const response = await fetch('/api/nutrition/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          date: formData.date,
          total_calories: parseFloat(formData.total_calories.toString()) || 0,
          total_protein_g: parseFloat(formData.total_protein_g.toString()) || 0,
          total_carbs_g: parseFloat(formData.total_carbs_g.toString()) || 0,
          total_fats_g: parseFloat(formData.total_fats_g.toString()) || 0,
          notes: formData.notes || null,
          source: 'manual',
          food_entries,
        }),
      });

      if (response.ok) {
        // Reset form
        setFormData({
          date: new Date().toISOString().split('T')[0],
          total_calories: '',
          total_protein_g: '',
          total_carbs_g: '',
          total_fats_g: '',
          notes: '',
        });
        setSelectedFoods([]);
        setShowForm(false);
        setManualMode(false);
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save nutrition log');
      }
    } catch (error) {
      console.error('Error saving nutrition log:', error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/30"
      >
        <Plus className="w-5 h-5" />
        Log Today's Nutrition
      </button>
    );
  }

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'grains', label: 'Grains' },
    { value: 'proteins', label: 'Proteins' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'nuts_seeds', label: 'Nuts & Seeds' },
    { value: 'oils', label: 'Oils' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Enter Nutrition Details</h3>
        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            setSelectedFoods([]);
            setManualMode(false);
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setManualMode(false)}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            !manualMode
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30'
              : 'bg-gray-800 text-gray-300 border border-gray-700'
          }`}
        >
          Select Foods
        </button>
        <button
          type="button"
          onClick={() => setManualMode(true)}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            manualMode
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30'
              : 'bg-gray-800 text-gray-300 border border-gray-700'
          }`}
        >
          Manual Entry
        </button>
      </div>

      {!manualMode ? (
        /* Food Selection Mode */
        <div className="space-y-4">
          {/* Food Search */}
          <div className="relative food-search-container">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowFoodSearch(true);
                  }}
                  onFocus={() => setShowFoodSearch(true)}
                  placeholder="Search for foods (e.g., chicken, apple, rice)..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <select
                value={defaultMealType}
                onChange={(e) => setDefaultMealType(e.target.value as 'breakfast' | 'lunch' | 'dinner' | 'snack')}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                title="Default meal type for new foods"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            {/* Food Search Results */}
            {showFoodSearch && foods.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {foods.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => addFood(food)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{food.name}</p>
                        {food.description && (
                          <p className="text-xs text-gray-400">{food.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {food.calories_per_100g.toFixed(0)} cal / 100g
                        </p>
                      </div>
                      <Plus className="w-5 h-5 text-green-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Foods List */}
          {selectedFoods.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-300">Selected Foods:</h4>
              {selectedFoods.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{item.food.name}</p>
                      <div className="flex gap-4 text-xs text-gray-400 mt-1">
                        <span className="text-red-400">
                          {item.calories.toFixed(0)} cal
                        </span>
                        <span className="text-blue-400">
                          {item.protein.toFixed(1)}g P
                        </span>
                        <span className="text-green-400">
                          {item.carbs.toFixed(1)}g C
                        </span>
                        <span className="text-yellow-400">
                          {item.fats.toFixed(1)}g F
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFood(index)}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-400">Serving Size (g):</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.servingSizeG}
                        onChange={(e) => updateServingSize(index, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 bg-gray-900/50 border border-gray-700 rounded text-gray-100 text-sm focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-400">Meal:</label>
                      <select
                        value={item.mealType}
                        onChange={(e) => updateMealType(index, e.target.value as 'breakfast' | 'lunch' | 'dinner' | 'snack')}
                        className="px-2 py-1 bg-gray-900/50 border border-gray-700 rounded text-gray-100 text-sm focus:ring-1 focus:ring-green-500"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Totals Display */}
          {selectedFoods.length > 0 && (
            <div className="bg-gradient-to-br from-green-600/20 to-green-700/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-300 mb-2">Total Nutrition:</p>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-gray-400">Calories</p>
                  <p className="font-bold text-red-400">{formData.total_calories || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Protein</p>
                  <p className="font-bold text-blue-400">{formData.total_protein_g || '0'}g</p>
                </div>
                <div>
                  <p className="text-gray-400">Carbs</p>
                  <p className="font-bold text-green-400">{formData.total_carbs_g || '0'}g</p>
                </div>
                <div>
                  <p className="text-gray-400">Fats</p>
                  <p className="font-bold text-yellow-400">{formData.total_fats_g || '0'}g</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Manual Entry Mode */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Calories
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.total_calories}
              onChange={(e) => setFormData({ ...formData, total_calories: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Protein (g)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.total_protein_g}
              onChange={(e) => setFormData({ ...formData, total_protein_g: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Carbs (g)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.total_carbs_g}
              onChange={(e) => setFormData({ ...formData, total_carbs_g: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fats (g)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.total_fats_g}
              onChange={(e) => setFormData({ ...formData, total_fats_g: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Notes (optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Any additional notes about your meals..."
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 shadow-lg shadow-green-600/30"
        >
          {isSaving ? 'Saving...' : 'Save Log'}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            setSelectedFoods([]);
            setManualMode(false);
          }}
          className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
