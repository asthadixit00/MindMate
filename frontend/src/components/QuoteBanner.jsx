import React, { useEffect, useState } from 'react';
import { quoteApi } from '../utils/api';

export default function QuoteBanner() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    quoteApi.daily().then((data) => setQuote(data.quote)).catch(() => {});
  }, []);

  if (!quote) return null;

  return (
    <div className="bg-gradient-to-r from-sage-900/40 to-warm-500/10 border border-sage-700/30 rounded-2xl px-6 py-4 mb-6 animate-fade-in">
      <p className="text-xs text-sage-500 font-mono uppercase tracking-widest mb-2">Daily Wisdom</p>
      <p className="text-slate-200 font-display italic text-lg leading-snug">"{quote.text}"</p>
      <p className="text-sage-500 text-sm mt-2">— {quote.author}</p>
    </div>
  );
}
