'use client';

import { useState } from 'react';

export function CaptionGenerator() {
  const [contextType, setContextType] = useState<'transformation' | 'event'>('transformation');
  const [details, setDetails] = useState('');
  const [captions, setCaptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!details.trim()) {
      alert('Please enter details');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/caption-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contextType,
          details,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setCaptions(result.captions || []);
      } else {
        alert(result.error || 'Failed to generate captions');
      }
    } catch (error) {
      console.error('Error generating captions:', error);
      alert('An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Content Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={contextType}
              onChange={(e) => setContextType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="transformation">Transformation</option>
              <option value="event">Event</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details *
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder={
                contextType === 'transformation'
                  ? 'Enter transformation details: client name, before/after stats, duration, key achievements, challenges overcome...'
                  : 'Enter event details: event name, date, highlights, key takeaways, participant feedback...'
              }
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !details.trim()}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            {isGenerating ? 'Generating Captions...' : 'Generate Captions'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Generated Captions</h2>
        {captions.length > 0 ? (
          <div className="space-y-4">
            {captions.map((caption, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-gray-500">Caption {index + 1}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(caption)}
                    className="text-xs text-orange-600 hover:text-orange-700"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{caption}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Enter details and generate caption suggestions.</p>
        )}
      </div>
    </div>
  );
}

