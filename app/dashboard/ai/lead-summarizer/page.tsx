'use client';

import { useState } from 'react';

export default function LeadSummarizerPage() {
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!notes.trim()) {
      alert('Please enter notes to summarize');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/lead-summarizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const result = await response.json();
      if (response.ok) {
        setSummary(result);
      } else {
        alert(result.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">AI Lead Notes Summarizer</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Enter Lead Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Enter free-text notes about the lead..."
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-4 w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            {isGenerating ? 'Generating Summary...' : 'Generate Summary'}
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          {summary ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-gray-700">{summary.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Challenges</h3>
                <p className="text-gray-700">{summary.challenges}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Motivation</h3>
                <p className="text-gray-700">{summary.motivation}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Likelihood</h3>
                <p className="text-gray-700">{summary.likelihood}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Next Steps</h3>
                <p className="text-gray-700">{summary.nextSteps}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Enter notes and generate a summary.</p>
          )}
        </div>
      </div>
    </div>
  );
}

