import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ExternalLink, Clock, Code2, RefreshCw, Search } from 'lucide-react';

const STORAGE_KEY = 'cocode_history';

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  // BUG: timeAgo returns wrong value for exactly 1 minute
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const TYPE_LABELS = {
  explanation: { label: 'Explained', color: '#C6F135' },
  complexity: { label: 'Complexity', color: '#7CFFC4' },
  bugs: { label: 'Bug Report', color: '#FF757F' },
  optimization: { label: 'Optimized', color: '#4DD9FF' },
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // BUG: No validation of history item structure before rendering
      setHistory(raw ? JSON.parse(raw) : []);
    } catch {
      setHistory([]);
    }
  };

  const deleteEntry = (id, e) => {
    e.stopPropagation();
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (selected?.id === id) setSelected(null);
  };

  const clearAll = () => {
    if (confirm('Delete all history? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
      setSelected(null);
    }
  };

  const reopenInAnalyzer = (entry) => {
    // BUG: reopening in analyzer overwrites current API key from history entry's model
    localStorage.setItem('cocode_model', entry.model);
    navigate('/analyzer', { state: { code: entry.codeSnippet, language: entry.language } });
  };

  // BUG: Search filter is case-sensitive
  const filtered = history.filter(h =>
    search === '' ||
    h.language.includes(search) ||
    h.codeSnippet?.includes(search) ||
    h.model.includes(search)
  );

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: 'var(--carbon)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8 pt-6">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Syne', fontWeight: 800 }}>Analysis History</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{history.length} saved analyses</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadHistory} className="btn-ghost flex items-center gap-2 py-2 px-3 text-sm">
              <RefreshCw size={14} /> Refresh
            </button>
            {history.length > 0 && (
              <button onClick={clearAll} className="btn-ghost flex items-center gap-2 py-2 px-3 text-sm"
                style={{ borderColor: 'rgba(255,117,127,0.3)', color: '#FF757F' }}>
                <Trash2 size={14} /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by language, code, or model..."
            className="input-field pl-9"
          />
        </div>

        {history.length === 0 ? (
          <div className="text-center py-24">
            <Code2 size={48} className="mx-auto mb-4" style={{ color: 'var(--muted)', opacity: 0.3 }} />
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Syne' }}>No history yet</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
              Analyses you run will appear here automatically
            </p>
            <button onClick={() => navigate('/analyzer')} className="btn-acid">Open Analyzer →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* List */}
            <div className="lg:col-span-2 space-y-2">
              {filtered.map(entry => {
                const typeInfo = TYPE_LABELS[entry.type] || { label: 'Analysis', color: '#C6F135' };
                return (
                  <div
                    key={entry.id}
                    onClick={() => setSelected(entry)}
                    className="glass rounded-xl p-4 cursor-pointer transition-all"
                    style={{
                      border: `1px solid ${selected?.id === entry.id ? 'rgba(198,241,53,0.4)' : 'var(--border)'}`,
                      background: selected?.id === entry.id ? 'rgba(198,241,53,0.04)' : undefined
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: `${typeInfo.color}18`, color: typeInfo.color, fontFamily: 'Syne' }}>
                            {typeInfo.label}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full glass"
                            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
                            {entry.language}
                          </span>
                        </div>
                        <code className="text-xs block truncate mb-2" style={{ color: '#C8D3F5', fontFamily: 'JetBrains Mono' }}>
                          {entry.codeSnippet?.slice(0, 80) || '(no preview)'}
                        </code>
                        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
                          <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(entry.timestamp)}</span>
                          <span className="truncate">{entry.model?.split('/').pop()}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteEntry(entry.id, e)}
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-red-500/10"
                        style={{ color: 'var(--muted)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && search && (
                <div className="text-center py-10 text-sm" style={{ color: 'var(--muted)' }}>
                  No results for "{search}"
                </div>
              )}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-3">
              {selected ? (
                <div className="glass rounded-2xl p-5 sticky top-24" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold" style={{ fontFamily: 'Syne' }}>
                        {TYPE_LABELS[selected.type]?.label || 'Analysis'} — {selected.language}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                        {new Date(selected.timestamp).toLocaleString()} • {selected.model?.split('/').pop()}
                      </p>
                    </div>
                    <button
                      onClick={() => reopenInAnalyzer(selected)}
                      className="btn-ghost flex items-center gap-2 text-sm py-1.5 px-3"
                    >
                      <ExternalLink size={13} /> Reopen
                    </button>
                  </div>

                  {/* Code snippet */}
                  <div className="rounded-xl p-3 mb-4 text-xs overflow-auto max-h-32"
                    style={{ background: '#0D0D14', fontFamily: 'JetBrains Mono', color: '#C8D3F5', border: '1px solid var(--border)' }}>
                    {selected.codeSnippet}
                    {selected.codeSnippet?.length >= 200 && <span style={{ color: 'var(--muted)' }}> ... (truncated)</span>}
                  </div>

                  {/* Results tabs */}
                  <div className="space-y-3">
                    {Object.entries(selected.results || {}).map(([type, content]) => {
                      if (!content) return null;
                      const info = TYPE_LABELS[type];
                      return (
                        <details key={type} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                          <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-semibold"
                            style={{ background: 'var(--surface2)', fontFamily: 'Syne', color: info?.color || 'var(--text)' }}>
                            {info?.label || type}
                          </summary>
                          <div className="p-4 text-xs leading-relaxed overflow-auto max-h-48"
                            style={{ color: 'var(--text)', whiteSpace: 'pre-wrap', fontFamily: 'DM Sans', fontSize: '12px' }}>
                            {content}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="glass rounded-2xl flex items-center justify-center h-64"
                  style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Select an entry to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
