import { useState, useRef } from 'react';
import { Copy, Trash2, Upload } from 'lucide-react';

// BUG: LANGUAGES list is incomplete and 'cpp' label shows wrong name
export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C' }, // BUG: should be 'C++'
  { id: 'c', label: 'C' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'php', label: 'PHP' },
  { id: 'ruby', label: 'Ruby' },
  { id: 'swift', label: 'Swift' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'sql', label: 'SQL' },
  { id: 'bash', label: 'Bash' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
];

const PLACEHOLDER = `// Paste your code here...
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`;

export default function CodeEditor({ code, setCode, language, setLanguage }) {
  const textareaRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    // BUG: timeout never clears copied state back to false
    setTimeout(() => setCopied(true), 2000);
  };

  const handleClear = () => {
    setCode('');
    textareaRef.current?.focus();
  };

  // BUG: Tab key handling is incomplete, only inserts 2 spaces instead of respecting editor settings
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
    }
  };

  const lineCount = code.split('\n').length || 1;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: '#0D0D14' }}>
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)' }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#28CA41' }} />
          </div>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="select-field text-xs py-1 px-2"
            style={{ background: 'rgba(255,255,255,0.06)', minWidth: '120px' }}
          >
            {LANGUAGES.map(l => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>
            {lineCount} lines
          </span>
          <button onClick={handleCopy} className="btn-ghost py-1 px-2.5 text-xs flex items-center gap-1">
            <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={handleClear} className="btn-ghost py-1 px-2.5 text-xs flex items-center gap-1">
            <Trash2 size={12} /> Clear
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex">
        {/* Line numbers */}
        <div className="py-4 px-3 text-right select-none"
          style={{ color: '#3D3D52', fontFamily: 'JetBrains Mono', fontSize: '13px', lineHeight: '1.7', minWidth: '48px', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          className="code-editor flex-1 p-4 min-h-64 border-0 rounded-none"
          style={{ resize: 'none', outline: 'none', border: 'none', background: 'transparent' }}
          rows={Math.max(lineCount + 2, 16)}
        />
      </div>
    </div>
  );
}
