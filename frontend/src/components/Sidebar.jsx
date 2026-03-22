import React from 'react';

const NAV_ITEMS = [
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'checkin', label: 'Check-in', icon: '📋' },
  { id: 'dashboard', label: 'Analytics', icon: '📊' },
  { id: 'pomodoro', label: 'Pomodoro', icon: '⏱️' },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col py-8 px-4 fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="mb-10 px-2">
        <h1 className="font-display text-2xl text-sage-400 leading-tight">
          Mind<span className="text-warm-400">Mate</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-body">Your mental wellness companion</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
              activePage === id
                ? 'bg-sage-600/20 text-sage-400 border border-sage-600/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span className="text-base">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-2 pt-6 border-t border-slate-800">
        <p className="text-xs text-slate-600 leading-relaxed">
          You're doing great.<br />One step at a time. 🌿
        </p>
      </div>
    </aside>
  );
}
