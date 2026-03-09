import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, HelpCircle, Zap, Brain, Timer, Bug, Sparkles, AlertCircle } from 'lucide-react';
import CodeEditor from '../components/CodeEditor';
import ResultTabs from '../components/ResultTabs';
import { MODELS, DEFAULT_MODEL, explainCode, analyzeComplexity, detectBugs, optimizeCode } from '../services/openrouter';

// BUG: API key is stored in localStorage as plaintext — security vulnerability
const STORAGE_KEY_APIKEY = 'cocode_apikey';
const STORAGE_KEY_MODEL = 'cocode_model';
const STORAGE_KEY_HISTORY = 'cocode_history';

function saveToHistory(entry) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');
    // BUG: No limit on history size - could cause localStorage overflow
    existing.unshift(entry);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save history', e);
  }
}

export default function Analyzer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [apiKey, setApiKey] = useState(localStorage.getItem(STORAGE_KEY_APIKEY) || '');
  const [model, setModel] = useState(localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL);
  const [showKey, setShowKey] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');
  const [results, setResults] = useState({
    explanation: '',
    complexity: '',
    bugs: '',
    optimization: '',
  });

  // Save key and model to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_APIKEY, apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODEL, model);
  }, [model]);

  // Keyboard shortcuts
  // BUG: keyboard shortcut handler doesn't check for textarea focus before triggering
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey)) {
        if (e.key === 'Enter') { e.preventDefault(); handleExplain(); }
        if (e.shiftKey && e.key === 'C') { e.preventDefault(); handleComplexity(); }
        if (e.shiftKey && e.key === 'B') { e.preventDefault(); handleBugs(); }
        if (e.shiftKey && e.key === 'O') { e.preventDefault(); handleOptimize(); }
        if (e.key === 'k') { e.preventDefault(); setCode(''); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [code, apiKey, model, language]); // BUG: missing handleExplain etc from deps (stale closures)

  const handleAnalysis = async (type, fn) => {
    if (!code.trim()) { setError('Please paste some code first.'); return; }
    if (!apiKey.trim()) { setError('Please enter your OpenRouter API key.'); return; }
    setError('');
    setLoading(type);
    try {
      const result = await fn(apiKey, model, code, language);
      setResults(prev => ({ ...prev, [type]: result }));

      // Save to history after any analysis
      const historyEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        language,
        model,
        codeSnippet: code.slice(0, 200),
        results: { ...results, [type]: result },
        type,
      };
      saveToHistory(historyEntry);
    } catch (err) {
      setError(err.message || 'Analysis failed. Check your API key and try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleExplain = () => handleAnalysis('explanation', explainCode);
  const handleComplexity = () => handleAnalysis('complexity', analyzeComplexity);
  const handleBugs = () => handleAnalysis('bugs', detectBugs);
  const handleOptimize = () => handleAnalysis('optimization', optimizeCode);

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: 'var(--carbon)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 pt-6">
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
            Code Analyzer
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Paste code, configure your key, and get instant AI-powered analysis
          </p>
        </div>

        {/* Config bar */}
        <div className="glass rounded-2xl p-4 mb-6" style={{ border: '1px solid var(--border)' }}>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            {/* API Key */}
            <div className="flex-1">
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted)', fontFamily: 'Syne' }}>
                OPENROUTER API KEY
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="input-field pr-20"
                  // BUG: no autocomplete="off" — browser may autofill wrong values
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="w-7 h-7 flex items-center justify-center rounded"
                    style={{ color: 'var(--muted)' }}
                  >
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="w-7 h-7 flex items-center justify-center rounded"
                    style={{ color: 'var(--muted)' }}
                  >
                    <HelpCircle size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Model selector */}
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--muted)', fontFamily: 'Syne' }}>
                MODEL
              </label>
              {/* BUG: Model selector shows all models including paid ones without warning */}
              <select value={model} onChange={e => setModel(e.target.value)} className="select-field" style={{ minWidth: '220px' }}>
                <optgroup label="Free Models">
                  {MODELS.filter(m => m.free).map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Paid Models">
                  {MODELS.filter(m => !m.free).map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Help panel */}
          {showHelp && (
            <div className="mt-4 p-4 rounded-xl text-sm" style={{ background: 'rgba(198,241,53,0.06)', border: '1px solid rgba(198,241,53,0.2)' }}>
              <p className="font-semibold mb-2" style={{ color: 'var(--acid)', fontFamily: 'Syne' }}>How to get an OpenRouter API key:</p>
              <ol className="space-y-1 list-decimal list-inside" style={{ color: 'var(--muted)' }}>
                <li>Visit <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--acid)' }}>openrouter.ai</a> and create a free account</li>
                <li>Click your profile → <strong>API Keys</strong></li>
                <li>Click <strong>Create Key</strong> and copy the key</li>
                <li>Paste it above — it's stored only in your browser</li>
              </ol>
              <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
                🔒 Your key is never sent to our servers. It's stored in localStorage and used directly in browser API calls.
              </p>
            </div>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 text-sm"
            style={{ background: 'rgba(255,117,127,0.1)', border: '1px solid rgba(255,117,127,0.3)', color: '#FF757F' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Editor */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold" style={{ color: 'var(--muted)', fontFamily: 'Syne' }}>CODE INPUT</span>
            </div>
            <CodeEditor code={code} setCode={setCode} language={language} setLanguage={setLanguage} />

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleExplain}
                disabled={!!loading}
                className="btn-acid flex items-center justify-center gap-2 py-3"
              >
                {loading === 'explanation' ? <span className="spinner" /> : <Brain size={16} />}
                Explain Code
              </button>
              <button
                onClick={handleComplexity}
                disabled={!!loading}
                className="btn-ghost flex items-center justify-center gap-2 py-3"
              >
                {loading === 'complexity' ? <span className="spinner" /> : <Timer size={16} />}
                Complexity
              </button>
              <button
                onClick={handleBugs}
                disabled={!!loading}
                className="btn-ghost flex items-center justify-center gap-2 py-3"
                style={{ borderColor: loading ? undefined : 'rgba(255,117,127,0.3)', color: loading ? undefined : '#FF757F' }}
              >
                {loading === 'bugs' ? <span className="spinner" /> : <Bug size={16} />}
                Find Bugs
              </button>
              <button
                onClick={handleOptimize}
                disabled={!!loading}
                className="btn-ghost flex items-center justify-center gap-2 py-3"
                style={{ borderColor: loading ? undefined : 'rgba(77,217,255,0.3)', color: loading ? undefined : '#4DD9FF' }}
              >
                {loading === 'optimization' ? <span className="spinner" /> : <Sparkles size={16} />}
                Optimize
              </button>
            </div>

            {/* Shortcut hint */}
            <div className="mt-3 text-xs" style={{ color: 'var(--muted)' }}>
              <span>⌘+Enter explain • ⌘⇧C complexity • ⌘⇧B bugs • ⌘⇧O optimize</span>
            </div>
          </div>

          {/* Right: Results */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold" style={{ color: 'var(--muted)', fontFamily: 'Syne' }}>ANALYSIS RESULTS</span>
              {loading && (
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--acid)' }}>
                  <Zap size={12} />
                  AI is analyzing...
                </div>
              )}
            </div>
            <ResultTabs results={results} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
