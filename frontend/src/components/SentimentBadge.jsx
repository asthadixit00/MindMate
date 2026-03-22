import React from 'react';

const CONFIG = {
  positive: { emoji: '✨', label: 'Positive', classes: 'bg-green-900/30 border-green-600/40 text-green-400' },
  neutral:  { emoji: '😐', label: 'Neutral',  classes: 'bg-slate-700/50 border-slate-600/40 text-slate-400' },
  negative: { emoji: '💙', label: 'Low',      classes: 'bg-blue-900/30 border-blue-600/40 text-blue-400' },
};

export default function SentimentBadge({ sentiment }) {
  if (!sentiment) return null;
  const { emoji, label, classes } = CONFIG[sentiment] || CONFIG.neutral;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-mono ${classes}`}>
      {emoji} {label}
    </span>
  );
}
