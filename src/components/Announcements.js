import React, { useState } from 'react';
import { Megaphone, Sparkles, ChevronDown, ChevronUp, Calendar, User } from 'lucide-react';
import { announcements } from '../data/mockData';
import { summarizeAnnouncement } from '../services/aiService';

const categoryColors = {
  HR:         'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  Holiday:    'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  Benefits:   'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  Company:    'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
  Policy:     'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  Facilities: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
};

const priorityDot = {
  high:   'bg-rose-500',
  medium: 'bg-amber-500',
  low:    'bg-emerald-500',
};

const AnnouncementCard = ({ ann }) => {
  const [expanded, setExpanded] = useState(false);
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [summaryDone, setSummaryDone] = useState(false);

  const handleSummarize = async (e) => {
    e.stopPropagation();
    if (summaryDone) { setSummaryDone(false); setSummary(''); return; }
    setSummarizing(true);
    try {
      const result = await summarizeAnnouncement(ann.content);
      setSummary(result);
      setSummaryDone(true);
      setExpanded(true);
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
      <div
        className="p-5 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${priorityDot[ann.priority]}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">{ann.title}</h4>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[ann.category] || 'bg-slate-100 text-slate-600'}`}>
                  {ann.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                  <User className="w-3 h-3" />
                  {ann.author}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleSummarize}
              disabled={summarizing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                summaryDone
                  ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 hover:bg-violet-200'
                  : 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 shadow-sm'
              } disabled:opacity-60`}
            >
              {summarizing ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI...
                </span>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  {summaryDone ? 'Hide AI' : 'AI Summary'}
                </>
              )}
            </button>
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-3">
          {summaryDone && summary && (
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">AI Summary</span>
              </div>
              <div className="text-sm text-indigo-900 dark:text-indigo-100 space-y-1 whitespace-pre-line leading-relaxed">
                {summary}
              </div>
            </div>
          )}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{ann.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Announcements = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(announcements.map(a => a.category))];

  const filtered = filter === 'All' ? announcements : announcements.filter(a => a.category === filter);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Company Announcements</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Click "AI Summary" to get an instant AI-generated summary</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                filter === c
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(ann => <AnnouncementCard key={ann.id} ann={ann} />)}
      </div>
    </div>
  );
};

export default Announcements;
