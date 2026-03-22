import React, { useState, useRef, useEffect } from 'react';
import { chatApi } from '../utils/api';
import { useSession } from '../hooks/useSession';
import SentimentBadge from '../components/SentimentBadge';
import TagPill from '../components/TagPill';
import TypingIndicator from '../components/TypingIndicator';
import QuoteBanner from '../components/QuoteBanner';

const WELCOME = {
  id: 'welcome',
  role: 'bot',
  content: "Hey there! 👋 I'm MindMate — your mental wellness and productivity companion. How are you feeling today? You can tell me anything — whether you're stressed, focused, anxious, or just want to chat.",
};

const SUGGESTIONS = [
  "I'm feeling overwhelmed with assignments",
  "I can't seem to focus today",
  "I'm doing great and feeling productive!",
  "I'm really stressed and anxious",
  "Just feeling okay, nothing special",
];

export default function ChatPage() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { sessionId, saveSession } = useSession();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function handleSend(text = input) {
    const msg = text.trim();
    if (!msg || isTyping) return;
    setInput('');
    setError(null);

    const userMsg = { id: Date.now(), role: 'user', content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const data = await chatApi.sendMessage(msg, sessionId);
      if (!sessionId) saveSession(data.sessionId);

      // Simulate slight delay for realism
      await new Promise((r) => setTimeout(r, 400));

      setMessages((prev) => [
        ...prev,
        {
          ...data.botMessage,
          sentiment: data.analysis.sentiment,
          tags: data.analysis.tags,
          showAnalysis: true,
        },
      ]);
    } catch (e) {
      setError('Could not reach MindMate. Is the backend running?');
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex-shrink-0">
        <QuoteBanner />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-slate-100">Chat with MindMate</h2>
            <p className="text-sm text-slate-500 mt-0.5">Sentiment-aware support & productivity coaching</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
            <span className="text-xs text-slate-500 font-mono">Active</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
              msg.role === 'user'
                ? 'bg-warm-500/20 border border-warm-500/40'
                : 'bg-sage-600/30 border border-sage-600/40'
            }`}>
              {msg.role === 'user' ? '🎓' : '🌿'}
            </div>

            {/* Bubble */}
            <div className={`max-w-lg ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sage-600/25 border border-sage-600/30 text-slate-200 rounded-tr-sm'
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>

              {/* Analysis metadata */}
              {msg.showAnalysis && (
                <div className="flex flex-wrap items-center gap-1.5 px-1">
                  <SentimentBadge sentiment={msg.sentiment} />
                  {msg.tags?.map((tag) => <TagPill key={tag} tag={tag} />)}
                </div>
              )}

              <span className="text-xs text-slate-600 px-1 font-mono">
                {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        {error && (
          <div className="text-center text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-xl py-3 px-4">
            ⚠️ {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-6 pb-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="flex-shrink-0 text-xs bg-slate-800 border border-slate-700 hover:border-sage-600 text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-6 pt-3 border-t border-slate-800 flex-shrink-0">
        <div className="flex gap-3 items-end bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 focus-within:border-sage-600/60 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="How are you feeling right now?"
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 text-sm resize-none outline-none leading-relaxed max-h-28"
            style={{ field_sizing: 'content' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="w-9 h-9 bg-sage-600 hover:bg-sage-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all active:scale-90 flex-shrink-0"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-700 mt-2 text-center font-mono">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
