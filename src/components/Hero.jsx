import { Link } from 'react-router-dom';
import { ArrowRight, Github, Star, GitFork } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16" style={{ background: 'var(--carbon)' }}>
      {/* Background effects */}
      <div className="hero-glow" style={{ top: '-100px', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(77,217,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(124,255,196,0.06) 0%, transparent 50%)'
      }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass pulse-border mb-8 text-sm"
          style={{ border: '1px solid rgba(198,241,53,0.3)' }}>
          <span className="w-2 h-2 rounded-full bg-acid inline-block" style={{ background: 'var(--acid)' }} />
          <span style={{ color: 'var(--acid)', fontFamily: 'Syne', fontWeight: 600 }}>Open Source • BYOK • Free Forever</span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-8xl font-bold leading-none tracking-tight mb-6" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
          Understand{' '}
          <span className="grad-text">any code</span>
          <br />instantly.
        </h1>

        <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--muted)' }}>
          Paste code, bring your OpenRouter key, and get AI-powered explanations,
          complexity analysis, bug detection, and optimizations — in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/analyzer" className="btn-acid flex items-center gap-2 text-base px-8 py-3.5">
            Start Analyzing <ArrowRight size={18} />
          </Link>
          <a
            href="https://github.com/cocode-dev/cocode"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex items-center gap-2 text-base px-8 py-3.5"
          >
            <Github size={18} /> View on GitHub
          </a>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm" style={{ color: 'var(--muted)' }}>
          {[
            { icon: <Star size={14} />, label: '2.4k Stars' },
            { icon: <GitFork size={14} />, label: '180 Forks' },
            { label: '50+ Contributors' },
            { label: '12 Languages Supported' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {s.icon}
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Code preview card */}
        <div className="mt-20 float">
          <div className="glass rounded-2xl overflow-hidden text-left max-w-2xl mx-auto shadow-2xl"
            style={{ border: '1px solid rgba(198,241,53,0.15)', boxShadow: '0 32px 64px rgba(0,0,0,0.4), 0 0 80px rgba(198,241,53,0.06)' }}>
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'rgba(0,0,0,0.3)' }}>
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-4 text-xs" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>cocode ~ analysis</span>
            </div>
            <div className="p-5 text-sm mono" style={{ background: '#0D0D14', color: '#C8D3F5' }}>
              <div style={{ color: '#636DA6' }}>{'// Paste your code here...'}</div>
              <div><span style={{ color: '#FF757F' }}>function</span> <span style={{ color: '#82AAFF' }}>quickSort</span><span>(arr) {'{'}</span></div>
              <div className="pl-4"><span style={{ color: '#FF757F' }}>if</span> (arr.length {'<='} 1) <span style={{ color: '#FF757F' }}>return</span> arr;</div>
              <div className="pl-4"><span style={{ color: '#FF757F' }}>const</span> pivot = arr[<span style={{ color: '#FF966C' }}>Math.floor</span>(arr.length / 2)];</div>
              <div className="pl-4">...</div>
              <div>{'}'}</div>
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--acid)' }}>
                ✓ O(n log n) average time complexity
              </div>
              <div style={{ color: '#7CFFC4' }}>✓ No critical bugs detected</div>
              <div style={{ color: '#4DD9FF' }}>✓ 3 optimization suggestions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
