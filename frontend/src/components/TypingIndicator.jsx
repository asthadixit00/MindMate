import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-sage-600/30 border border-sage-600/40 flex items-center justify-center text-sm flex-shrink-0">
        🌿
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 0.2, 0.4].map((delay, i) => (
            <span
              key={i}
              className="w-2 h-2 bg-sage-500 rounded-full animate-bounce-dot"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
