'use client';

import { useState } from 'react';

export default function ReplyHelperPage() {
  const [context, setContext] = useState('');
  const [replies, setReplies] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!context.trim()) {
      alert('Please enter lead context');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/reply-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });

      const result = await response.json();
      if (response.ok) {
        setReplies(result.replies || []);
      } else {
        alert(result.error || 'Failed to generate replies');
      }
    } catch (error) {
      console.error('Error generating replies:', error);
      alert('An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">AI Reply Helper</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Lead Context</h2>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Enter lead information, recent conversation, questions asked, etc..."
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-4 w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            {isGenerating ? 'Generating Replies...' : 'Generate Reply Templates'}
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Replies</h2>
          {replies.length > 0 ? (
            <div className="space-y-4">
              {replies.map((reply, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{reply}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Enter context and generate reply templates.</p>
          )}
        </div>
      </div>
    </div>
  );
}

