'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Event {
  id?: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  image_url?: string | null;
  start_datetime: string;
  end_datetime: string;
  price_in_inr: number;
  max_capacity: number | null;
  is_active: boolean;
}

interface EventFormProps {
  event?: Event;
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: event?.title || '',
    slug: event?.slug || '',
    description: event?.description || '',
    location: event?.location || '',
    image_url: event?.image_url || '',
    start_datetime: event?.start_datetime
      ? new Date(event.start_datetime).toISOString().slice(0, 16)
      : '',
    end_datetime: event?.end_datetime
      ? new Date(event.end_datetime).toISOString().slice(0, 16)
      : '',
    price_in_inr: event?.price_in_inr || 0,
    max_capacity: event?.max_capacity || '',
    is_active: event?.is_active ?? true,
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!event && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData({ ...formData, slug });
    }
  }, [formData.title]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === 'number'
          ? value === ''
            ? ''
            : parseInt(value)
          : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    });
    // Clear upload error when user types in URL field
    if (name === 'image_url') {
      setUploadError(null);
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('File size too large. Maximum size is 5MB.');
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Clear URL field when file is selected
    setFormData({ ...formData, image_url: '' });
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('folder', 'events');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Set the uploaded image URL
      setFormData({ ...formData, image_url: result.url });
      setSelectedFile(null);
      setImagePreview(null);
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setUploadError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = event
        ? `/api/events/${event.id}`
        : '/api/events';
      const method = event ? 'PATCH' : 'POST';

      // Validate required fields
      if (!formData.title || !formData.slug || !formData.start_datetime) {
        alert('Please fill in all required fields: Title, Slug, and Start Date/Time');
        setIsSubmitting(false);
        return;
      }

      // Convert dates properly
      let startDatetime: string;
      let endDatetime: string | null = null;
      
      try {
        // Handle date input (YYYY-MM-DDTHH:mm format)
        const startDate = new Date(formData.start_datetime);
        if (isNaN(startDate.getTime())) {
          throw new Error('Invalid start date/time');
        }
        startDatetime = startDate.toISOString();
        
        if (formData.end_datetime) {
          const endDate = new Date(formData.end_datetime);
          if (isNaN(endDate.getTime())) {
            throw new Error('Invalid end date/time');
          }
          endDatetime = endDate.toISOString();
        }
      } catch (dateError: any) {
        alert(`Invalid date format: ${dateError.message}`);
        setIsSubmitting(false);
        return;
      }

      // Clean up image_url - ensure empty string becomes null
      let imageUrl = formData.image_url?.trim() || null;
      if (imageUrl === '') {
        imageUrl = null;
      }

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description?.trim() || null,
        location: formData.location?.trim() || null,
        image_url: imageUrl,
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        price_in_inr: parseInt(String(formData.price_in_inr)) || 0,
        max_capacity: formData.max_capacity ? parseInt(String(formData.max_capacity)) : null,
        is_active: formData.is_active,
      };

      console.log('[Event Form] Form data:', formData);
      console.log('[Event Form] Submitting payload:', JSON.stringify(payload, null, 2));
      console.log('[Event Form] Date conversion:', {
        original: formData.start_datetime,
        converted: startDatetime,
        endOriginal: formData.end_datetime,
        endConverted: endDatetime,
      });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/dashboard/events');
        router.refresh();
      } else {
        let errorData;
        try {
          const text = await response.text();
          console.error('[Event Form] Error response text:', text);
          errorData = JSON.parse(text);
        } catch (e) {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.error('[Event Form] Error creating/updating event:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          payload: payload,
        });
        
        const errorMessage = errorData.error || errorData.message || 'Failed to save event';
        
        // Handle duplicate slug error
        if (errorData.code === 'DUPLICATE_SLUG' || errorMessage.includes('slug') || errorMessage.includes('already exists')) {
          const userMessage = errorData.message || `An event with the slug "${formData.slug}" already exists. Please change the slug to something unique.`;
          alert(userMessage);
          // Focus on slug field (if it exists in the DOM)
          const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
          if (slugInput) {
            slugInput.focus();
            slugInput.select();
          }
        } else {
          // Show detailed error message
          let errorDetails = '';
          if (errorData.details) {
            if (Array.isArray(errorData.details)) {
              errorDetails = errorData.details.map((d: any) => `${d.path?.join('.')}: ${d.message}`).join('\n');
            } else {
              errorDetails = String(errorData.details);
            }
          }
          if (errorData.message && errorData.message !== errorMessage) {
            errorDetails = errorData.message;
          }
          
          const fullMessage = errorDetails ? `${errorMessage}\n\n${errorDetails}` : errorMessage;
          console.error('[Event Form] Full error:', fullMessage);
          alert(fullMessage);
        }
      }
    } catch (error: any) {
      console.error('[Event Form] Error saving event:', error);
      alert(error.message || 'An error occurred while saving the event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Slug *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Event Image
          </label>
          
          {/* File Upload Section */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Upload from your computer
            </label>
            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 hover:border-red-500/50 transition-all text-center">
                  {selectedFile ? selectedFile.name : 'Choose File'}
                </div>
              </label>
              {selectedFile && (
                <>
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    disabled={isUploading}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={isUploading}
                    className="px-4 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-all disabled:opacity-50"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
            {uploadError && (
              <p className="text-xs text-red-400 mt-2">{uploadError}</p>
            )}
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border border-gray-700"
                />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* URL Input Section */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Or enter an image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
            {formData.image_url && !selectedFile && (
              <div className="mt-3">
                <img
                  src={formData.image_url}
                  alt="Event preview"
                  className="w-full h-48 object-cover rounded-xl border border-gray-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              name="start_datetime"
              value={formData.start_datetime}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              name="end_datetime"
              value={formData.end_datetime}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price (INR) *
            </label>
            <input
              type="number"
              name="price_in_inr"
              value={formData.price_in_inr}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Capacity
            </label>
            <input
              type="number"
              name="max_capacity"
              value={formData.max_capacity}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-300">Active</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-8 py-3 text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="relative z-10">
              {isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 rounded-full border-2 border-gray-700 text-gray-300 font-semibold hover:border-red-500/50 hover:text-red-400 transition-all duration-300 hover:bg-red-500/5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

