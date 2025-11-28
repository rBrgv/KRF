'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Camera, TrendingUp, Target, Calendar, Plus, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BodyMeasurement {
  id: string;
  date: string;
  weight_kg: number | null;
  body_fat_percentage: number | null;
  waist_cm: number | null;
  chest_cm: number | null;
  arms_cm: number | null;
  thighs_cm: number | null;
  hips_cm: number | null;
  neck_cm: number | null;
  notes: string | null;
}

interface ProgressPhoto {
  id: string;
  photo_url: string;
  date: string;
  view_type: 'front' | 'side' | 'back' | 'other';
  notes: string | null;
  is_milestone: boolean;
}

interface ProgressPageProps {
  clientId: string;
}

export function ProgressPage({ clientId }: ProgressPageProps) {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedView, setSelectedView] = useState<'measurements' | 'photos'>('measurements');

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [measurementsRes, photosRes] = await Promise.all([
        fetch(`/api/progress/measurements?client_id=${clientId}&limit=30`),
        fetch(`/api/progress/photos?client_id=${clientId}&limit=20`),
      ]);

      if (measurementsRes.ok) {
        const measurementsData = await measurementsRes.json();
        setMeasurements(measurementsData.data || []);
      }

      if (photosRes.ok) {
        const photosData = await photosRes.json();
        setPhotos(photosData.data || []);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMeasurementSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const measurementData = {
      client_id: clientId,
      date: formData.get('date') as string,
      weight_kg: formData.get('weight_kg') ? parseFloat(formData.get('weight_kg') as string) : null,
      body_fat_percentage: formData.get('body_fat_percentage') ? parseFloat(formData.get('body_fat_percentage') as string) : null,
      waist_cm: formData.get('waist_cm') ? parseFloat(formData.get('waist_cm') as string) : null,
      chest_cm: formData.get('chest_cm') ? parseFloat(formData.get('chest_cm') as string) : null,
      arms_cm: formData.get('arms_cm') ? parseFloat(formData.get('arms_cm') as string) : null,
      thighs_cm: formData.get('thighs_cm') ? parseFloat(formData.get('thighs_cm') as string) : null,
      hips_cm: formData.get('hips_cm') ? parseFloat(formData.get('hips_cm') as string) : null,
      neck_cm: formData.get('neck_cm') ? parseFloat(formData.get('neck_cm') as string) : null,
      notes: formData.get('notes') as string || null,
    };

    try {
      const response = await fetch('/api/progress/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurementData),
      });

      if (response.ok) {
        setShowMeasurementForm(false);
        fetchData();
        alert('Measurement saved successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save measurement');
      }
    } catch (error) {
      console.error('Error saving measurement:', error);
      alert('An error occurred');
    }
  };

  const handlePhotoUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    const date = formData.get('date') as string;
    const viewType = formData.get('view_type') as string;
    const notes = formData.get('notes') as string || null;
    const isMilestone = formData.get('is_milestone') === 'on';

    if (!file) {
      alert('Please select a photo');
      return;
    }

    try {
      // First upload the file
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('client_id', clientId);
      uploadFormData.append('date', date);
      uploadFormData.append('view_type', viewType);

      const uploadResponse = await fetch('/api/progress/photos/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        const errorMessage = error.details 
          ? `${error.error}: ${error.details}`
          : error.error || 'Failed to upload photo';
        alert(errorMessage);
        console.error('Upload error:', error);
        return;
      }

      const uploadData = await uploadResponse.json();

      if (!uploadData.success || !uploadData.data?.photo_url) {
        alert('Upload succeeded but no photo URL returned. Please try again.');
        console.error('Invalid upload response:', uploadData);
        return;
      }

      // Then create the photo entry
      const photoResponse = await fetch('/api/progress/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          photo_url: uploadData.data.photo_url,
          date,
          view_type: viewType,
          notes,
          is_milestone: isMilestone,
        }),
      });

      if (photoResponse.ok) {
        setShowPhotoUpload(false);
        fetchData();
        alert('Photo uploaded successfully!');
      } else {
        const error = await photoResponse.json();
        const errorMessage = error.details 
          ? `${error.error}: ${error.details}`
          : error.error || 'Failed to save photo';
        alert(errorMessage);
        console.error('Photo save error:', error);
      }
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      alert(`An error occurred: ${error.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading progress data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Progress</h1>
          <p className="text-gray-400">Track your fitness journey</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowMeasurementForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Log Measurement
          </button>
          <button
            onClick={() => setShowPhotoUpload(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Upload Photo
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        <button
          onClick={() => setSelectedView('measurements')}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedView === 'measurements'
              ? 'text-red-400 border-b-2 border-red-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Measurements
        </button>
        <button
          onClick={() => setSelectedView('photos')}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedView === 'photos'
              ? 'text-red-400 border-b-2 border-red-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Progress Photos
        </button>
      </div>

      {/* Measurements View */}
      {selectedView === 'measurements' && (
        <div className="space-y-4">
          {measurements.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400">No measurements logged yet</p>
              <p className="text-sm text-gray-500 mt-2">Start tracking your progress today!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {measurements.map((measurement) => (
                <div
                  key={measurement.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold text-white">{formatDate(measurement.date)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {measurement.weight_kg && (
                      <div>
                        <p className="text-sm text-gray-400">Weight</p>
                        <p className="text-lg font-bold text-white">{measurement.weight_kg} kg</p>
                      </div>
                    )}
                    {measurement.body_fat_percentage && (
                      <div>
                        <p className="text-sm text-gray-400">Body Fat</p>
                        <p className="text-lg font-bold text-white">{measurement.body_fat_percentage}%</p>
                      </div>
                    )}
                    {measurement.waist_cm && (
                      <div>
                        <p className="text-sm text-gray-400">Waist</p>
                        <p className="text-lg font-bold text-white">{measurement.waist_cm} cm</p>
                      </div>
                    )}
                    {measurement.chest_cm && (
                      <div>
                        <p className="text-sm text-gray-400">Chest</p>
                        <p className="text-lg font-bold text-white">{measurement.chest_cm} cm</p>
                      </div>
                    )}
                    {measurement.arms_cm && (
                      <div>
                        <p className="text-sm text-gray-400">Arms</p>
                        <p className="text-lg font-bold text-white">{measurement.arms_cm} cm</p>
                      </div>
                    )}
                    {measurement.thighs_cm && (
                      <div>
                        <p className="text-sm text-gray-400">Thighs</p>
                        <p className="text-lg font-bold text-white">{measurement.thighs_cm} cm</p>
                      </div>
                    )}
                    {measurement.hips_cm && (
                      <div>
                        <p className="text-sm text-gray-400">Hips</p>
                        <p className="text-lg font-bold text-white">{measurement.hips_cm} cm</p>
                      </div>
                    )}
                    {measurement.neck_cm && (
                      <div>
                        <p className="text-sm text-gray-400">Neck</p>
                        <p className="text-lg font-bold text-white">{measurement.neck_cm} cm</p>
                      </div>
                    )}
                  </div>
                  {measurement.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-300">{measurement.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Photos View */}
      {selectedView === 'photos' && (
        <div className="space-y-4">
          {photos.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50">
              <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400">No progress photos yet</p>
              <p className="text-sm text-gray-500 mt-2">Upload your first progress photo!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50"
                >
                  <div className="relative aspect-square">
                    <img
                      src={photo.photo_url}
                      alt={`${photo.view_type} view - ${formatDate(photo.date)}`}
                      className="w-full h-full object-cover"
                    />
                    {photo.is_milestone && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                        Milestone
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white capitalize">{photo.view_type}</span>
                      <span className="text-xs text-gray-400">{formatDate(photo.date)}</span>
                    </div>
                    {photo.notes && (
                      <p className="text-sm text-gray-300 mt-2">{photo.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Measurement Form Modal */}
      {showMeasurementForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Log Measurement</h2>
              <button
                onClick={() => setShowMeasurementForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleMeasurementSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight_kg"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Body Fat (%)</label>
                  <input
                    type="number"
                    name="body_fat_percentage"
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Waist (cm)</label>
                  <input
                    type="number"
                    name="waist_cm"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Chest (cm)</label>
                  <input
                    type="number"
                    name="chest_cm"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Arms (cm)</label>
                  <input
                    type="number"
                    name="arms_cm"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Thighs (cm)</label>
                  <input
                    type="number"
                    name="thighs_cm"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hips (cm)</label>
                  <input
                    type="number"
                    name="hips_cm"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Neck (cm)</label>
                  <input
                    type="number"
                    name="neck_cm"
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                >
                  Save Measurement
                </button>
                <button
                  type="button"
                  onClick={() => setShowMeasurementForm(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Upload Progress Photo</h2>
              <button
                onClick={() => setShowPhotoUpload(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handlePhotoUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">View Type</label>
                <select
                  name="view_type"
                  required
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                >
                  <option value="front">Front</option>
                  <option value="side">Side</option>
                  <option value="back">Back</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Photo</label>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  required
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes (optional)</label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_milestone"
                  id="is_milestone"
                  className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                />
                <label htmlFor="is_milestone" className="text-sm text-gray-300">
                  Mark as milestone
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={() => setShowPhotoUpload(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

