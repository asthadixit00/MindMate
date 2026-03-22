import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { checkinApi } from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1a2332',
      borderColor: '#334155',
      borderWidth: 1,
      titleColor: '#94a3b8',
      bodyColor: '#e2e8f0',
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: { color: '#1e293b' },
      ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 11 } },
    },
    y: {
      grid: { color: '#1e293b' },
      ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 11 } },
    },
  },
};

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="card">
      <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-display ${accent || 'text-slate-100'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

const MOOD_EMOJI = ['', '😞', '😕', '😐', '😊', '🤩'];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkinApi.getAll().then((d) => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64 text-slate-500 font-mono text-sm">
        Loading analytics...
      </div>
    );
  }

  const checkins = data?.checkins || [];
  const insights = data?.insights || {};

  if (checkins.length === 0) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center mt-20">
        <p className="text-5xl mb-4">📊</p>
        <h3 className="font-display text-2xl text-slate-300 mb-2">No data yet</h3>
        <p className="text-slate-500">Complete a few daily check-ins to unlock your analytics dashboard.</p>
      </div>
    );
  }

  // Prepare chart data (latest 14 entries, reversed to chronological)
  const displayed = [...checkins].slice(0, 14).reverse();
  const labels = displayed.map((c) =>
    new Date(c.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  const moodData = {
    labels,
    datasets: [{
      data: displayed.map((c) => c.mood),
      borderColor: '#5a825a',
      backgroundColor: 'rgba(90,130,90,0.1)',
      pointBackgroundColor: '#7ca07c',
      pointBorderColor: '#2d422d',
      pointRadius: 5,
      tension: 0.4,
      fill: true,
    }],
  };

  const productivityData = {
    labels,
    datasets: [{
      data: displayed.map((c) => c.productivityScore),
      backgroundColor: 'rgba(212,141,46,0.25)',
      borderColor: '#d48d2e',
      borderRadius: 6,
      borderWidth: 2,
    }],
  };

  const moodOpts = {
    ...CHART_OPTIONS,
    scales: {
      ...CHART_OPTIONS.scales,
      y: { ...CHART_OPTIONS.scales.y, min: 1, max: 5, ticks: { ...CHART_OPTIONS.scales.y.ticks, callback: (v) => MOOD_EMOJI[v] || v } },
    },
  };

  const prodOpts = {
    ...CHART_OPTIONS,
    scales: {
      ...CHART_OPTIONS.scales,
      y: { ...CHART_OPTIONS.scales.y, min: 0, max: 10 },
    },
  };

  const avgMood = insights.averageMood || '-';
  const avgProd = insights.averageProductivity || '-';
  const consistency = insights.consistencyScore ?? '-';

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl text-slate-100">Analytics</h2>
        <p className="text-slate-500 mt-1">Your wellbeing trends at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Avg Mood" value={`${avgMood}/5`} sub="Last 30 days" accent="text-sage-400" />
        <StatCard label="Avg Productivity" value={`${avgProd}/10`} sub="Last 30 days" accent="text-warm-400" />
        <StatCard label="Consistency" value={`${consistency}%`} sub="Last 7 days" accent="text-blue-400" />
        <StatCard label="Total Check-ins" value={insights.totalCheckins || checkins.length} sub="All time" />
      </div>

      {/* Insight Banner */}
      {insights.message && (
        <div className="bg-sage-900/20 border border-sage-700/30 rounded-xl px-5 py-4 mb-8 text-sm text-sage-300 animate-fade-in">
          💡 {insights.message}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-4">Mood Trend</p>
          <div className="h-48">
            <Line data={moodData} options={moodOpts} />
          </div>
        </div>
        <div className="card">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-4">Productivity Trend</p>
          <div className="h-48">
            <Bar data={productivityData} options={prodOpts} />
          </div>
        </div>
      </div>

      {/* Recent Check-ins Table */}
      <div className="card">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-4">Recent Check-ins</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-mono text-slate-600 border-b border-slate-800">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Day</th>
                <th className="pb-3 pr-4">Mood</th>
                <th className="pb-3 pr-4">Productivity</th>
                <th className="pb-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {checkins.slice(0, 10).map((c) => (
                <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pr-4 text-slate-400 font-mono text-xs">{c.date}</td>
                  <td className="py-3 pr-4 text-slate-500 text-xs">{c.dayOfWeek}</td>
                  <td className="py-3 pr-4">
                    <span className="text-base">{MOOD_EMOJI[c.mood]}</span>
                    <span className="text-xs text-slate-500 ml-1 font-mono">{c.moodLabel}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-900 rounded-full h-1.5 w-20">
                        <div
                          className="h-full bg-warm-400 rounded-full"
                          style={{ width: `${(c.productivityScore / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-mono w-6">{c.productivityScore}</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-slate-600 max-w-xs truncate">{c.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
