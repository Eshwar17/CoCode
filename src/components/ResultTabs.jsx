import { useState } from 'react';
import { Copy, Download, Share2, CheckCheck } from 'lucide-react';

const TABS = [
  { id: 'explanation', label: 'Explanation' },
  { id: 'complexity', label: 'Complexity' },
  { id: 'bugs', label: 'Bug Report' },
  { id: 'optimization', label: 'Optimized Code' },
];

function formatMarkdown(text) {
  if (!text) return '';
  // Very basic markdown-to-HTML
  return text
    .replace(/## (.+)/g, '<h3 class="text-base font-bold mt-4 mb-2" style="color:var(--acid);font-family:Syne">$1</h3>')
    .replace(/### (.+)/g, '<h4 class="text-sm font-semibold mt-3 mb-1" style="color:#7CFFC4">$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded text-xs" style="background:rgba(255,255,255,0.08);font-family:JetBrains Mono;color:#FF966C">$1</code>')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="my-3 p-4 rounded-xl text-xs overflow-x-auto" style="background:#0A0A12;border:1px solid rgba(255,255,255,0.06);font-family:JetBrains Mono;color:#C8D3F5;line-height:1.7">$1</pre>')
    .replace(/\n/g, '<br/>');
}

export default function ResultTabs({ results, loading, activeAnalysis }) {
  const [activeTab, setActiveTab] = useState('explanation');
  const [copiedTab, setCopiedTab] = useState(null);

  // BUG: activeTab is not reset when new analysis starts
  const handleCopy = (tabId) => {
    const content = results[tabId];
    if (content) {
      navigator.clipboard.writeText(content);
      setCopiedTab(tabId);
      setTimeout(() => setCopiedTab(null), 2000);
    }
  };

  const handleDownload = () => {
    // BUG: download filename doesn't include timestamp
    const data = {
      timestamp: new Date().toISOString(),
      results,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    // BUG: Share creates a URL but it's not actually functional (no backend)
    const encoded = btoa(JSON.stringify(results)).slice(0, 50);
    const shareUrl = `${window.location.origin}/share/${encoded}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied! (Note: sharing requires a backend)');
  };

  const hasResults = Object.values(results).some(v => v);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
      {/* Tab bar */}
      <div className="flex items-center justify-between px-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex">
          {TABS.map(tab => {
            const isLoading = loading === tab.id;
            const hasResult = results[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3.5 text-sm font-medium transition-all relative flex items-center gap-2 ${
                  activeTab === tab.id ? 'tab-active' : ''
                }`}
                style={{
                  color: activeTab === tab.id ? 'var(--acid)' : 'var(--muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--acid)' : '2px solid transparent',
                  fontFamily: 'Syne',
                  fontWeight: 600,
                }}
              >
                {isLoading && <span className="spinner" style={{ width: 12, height: 12 }} />}
                {hasResult && !isLoading && (
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--acid)' }} />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>

        {hasResults && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(activeTab)}
              className="btn-ghost py-1.5 px-2.5 text-xs flex items-center gap-1"
            >
              {copiedTab === activeTab ? <CheckCheck size={12} /> : <Copy size={12} />}
              Copy
            </button>
            <button onClick={handleDownload} className="btn-ghost py-1.5 px-2.5 text-xs flex items-center gap-1">
              <Download size={12} /> JSON
            </button>
            <button onClick={handleShare} className="btn-ghost py-1.5 px-2.5 text-xs flex items-center gap-1">
              <Share2 size={12} /> Share
            </button>
          </div>
        )}
      </div>

      {/* Tab content */}
      <div className="p-5 min-h-48">
        {loading === activeTab ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="spinner" style={{ width: 32, height: 32 }} />
            <p className="text-sm" style={{ color: 'var(--muted)' }}>AI is analyzing your code...</p>
          </div>
        ) : results[activeTab] ? (
          <div
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text)', fontFamily: 'DM Sans' }}
            dangerouslySetInnerHTML={{ __html: formatMarkdown(results[activeTab]) }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center glass"
              style={{ border: '1px solid var(--border)' }}>
              <span className="text-xl">
                {activeTab === 'explanation' ? '📖' : activeTab === 'complexity' ? '⏱️' : activeTab === 'bugs' ? '🐛' : '⚡'}
              </span>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
              No {TABS.find(t => t.id === activeTab)?.label} yet
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Paste code and click a button above to analyze
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
