import React from 'react';
import { usePomodoro } from '../hooks/usePomodoro';

export default function PomodoroPage() {
  const { phase, minutes, seconds, isRunning, cycles, progress, start, pause, reset } = usePomodoro();

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress);
  const isWork = phase === 'work';

  return (
    <div className="p-6 max-w-lg mx-auto flex flex-col items-center">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl text-slate-100">Pomodoro Timer</h2>
        <p className="text-slate-500 mt-1">25 minutes focus · 5 minute break</p>
      </div>

      {/* Phase Badge */}
      <div className={`mb-8 px-5 py-2 rounded-full border font-mono text-sm transition-all duration-500 ${
        isWork
          ? 'bg-sage-900/40 border-sage-600/50 text-sage-400'
          : 'bg-blue-900/40 border-blue-600/50 text-blue-400'
      }`}>
        {isWork ? '🎯 Focus Session' : '☕ Break Time'}
      </div>

      {/* Circular Timer */}
      <div className="relative mb-10">
        <svg width="220" height="220" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx="110" cy="110" r="90"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            cx="110" cy="110" r="90"
            fill="none"
            stroke={isWork ? '#5a825a' : '#3b82f6'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-5xl text-slate-100 tabular-nums leading-none">
            {minutes}:{seconds}
          </span>
          <span className="text-xs text-slate-600 mt-2 font-mono uppercase tracking-widest">
            {isRunning ? 'running' : 'paused'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={reset}
          className="btn-ghost w-12 h-12 flex items-center justify-center rounded-xl p-0"
        >
          ↺
        </button>

        <button
          onClick={isRunning ? pause : start}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl transition-all active:scale-95 ${
            isRunning
              ? 'bg-slate-700 hover:bg-slate-600 border border-slate-600'
              : 'bg-sage-600 hover:bg-sage-500'
          }`}
        >
          {isRunning ? '⏸' : '▶'}
        </button>

        <div className="w-12 h-12 flex items-center justify-center text-slate-600 font-mono text-sm">
          #{cycles + 1}
        </div>
      </div>

      {/* Cycle stats */}
      <div className="w-full card">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-4">Session Stats</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-display text-sage-400">{cycles}</p>
            <p className="text-xs text-slate-600 font-mono mt-1">Pomodoros</p>
          </div>
          <div>
            <p className="text-2xl font-display text-warm-400">{cycles * 25}</p>
            <p className="text-xs text-slate-600 font-mono mt-1">Min Focused</p>
          </div>
          <div>
            <p className="text-2xl font-display text-blue-400">{cycles}</p>
            <p className="text-xs text-slate-600 font-mono mt-1">Breaks Taken</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-4">
        <p className="text-xs text-slate-500 font-mono mb-1">💡 Pomodoro Tip</p>
        <p className="text-sm text-slate-400">
          {isWork
            ? 'Close all notifications, put your phone away. 25 minutes of deep work beats 2 hours of distracted effort.'
            : 'Step away from the screen. Stretch, breathe, grab water. Your brain needs this recovery time.'}
        </p>
      </div>
    </div>
  );
}
