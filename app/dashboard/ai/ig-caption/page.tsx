'use client';

import { useState } from 'react';

export default function IGCaptionHelperPage() {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'transformation' | 'event'>('transformation');
  const [captions, setCaptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!content.trim()) {
      alert('Please enter content details');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/ig-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type }),
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
    <div>
      <h1 className="text-3xl font-bold mb-8">AI Instagram Caption Helper</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Content Details</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="transformation">Transformation</option>
              <option value="event">Event</option>
            </select>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder={
              type === 'transformation'
                ? 'Enter transformation details: client name, before/after stats, duration, key achievements...'
                : 'Enter event details: event name, date, highlights, key takeaways...'
            }
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-4 w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            {isGenerating ? 'Generating Captions...' : 'Generate Captions'}
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Captions</h2>
          {captions.length > 0 ? (
            <div className="space-y-4">
              {captions.map((caption, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{caption}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Enter content details and generate caption suggestions.</p>
          )}
        </div>
      </div>
    </div>
  );
}

