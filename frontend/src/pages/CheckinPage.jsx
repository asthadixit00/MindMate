import React, { useState } from 'react';
import { checkinApi } from '../utils/api';

const MOODS = [
  { value: 1, emoji: '😞', label: 'Terrible' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '🤩', label: 'Great' },
];

export default function CheckinPage() {
  const [mood, setMood] = useState(null);
  const [productivity, setProductivity] = useState(5);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    if (!mood) return;
    setSubmitting(true);
    setError(null);
    try {
      await checkinApi.create({ mood, productivityScore: productivity, notes });
      setSuccess(true);
      setMood(null);
      setProductivity(5);
      setNotes('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl text-slate-100">Daily Check-in</h2>
        <p className="text-slate-500 mt-1">A quick pulse check to track your wellbeing over time.</p>
      </div>

      {success && (
        <div className="mb-6 bg-sage-900/30 border border-sage-600/40 text-sage-400 rounded-xl px-5 py-4 text-sm animate-slide-up">
          ✅ Check-in saved! Keep up the streak. Your data is being tracked in Analytics.
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-700/40 text-red-400 rounded-xl px-5 py-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Mood selector */}
      <div className="card mb-5">
        <p className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider font-mono text-xs">How's your mood today?</p>
        <div className="flex gap-3 justify-between">
          {MOODS.map(({ value, emoji, label }) => (
            <button
              key={value}
              onClick={() => setMood(value)}
              className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border transition-all duration-200 ${
                mood === value
                  ? 'bg-sage-600/20 border-sage-500/60 scale-105'
                  : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
              }`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-slate-500 font-mono">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Productivity slider */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Productivity Score</p>
          <span className="text-2xl font-display text-sage-400">{productivity}<span className="text-sm text-slate-600">/10</span></span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          value={productivity}
          onChange={(e) => setProductivity(Number(e.target.value))}
          className="w-full accent-sage-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-700 mt-1 font-mono">
          <span>Unproductive</span>
          <span>Highly focused</span>
        </div>
      </div>

      {/* Notes */}
      <div className="card mb-6">
        <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">Notes (optional)</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="What's on your mind? Any wins or challenges today?"
          className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none focus:border-sage-600/60 transition-colors"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!mood || submitting}
        className="w-full btn-primary py-3.5 text-base disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? 'Saving...' : 'Save Check-in ✓'}
      </button>

      <p className="text-xs text-slate-700 text-center mt-4 font-mono">
        Consistent check-ins unlock better insights in Analytics.
      </p>
    </div>
  );
}
