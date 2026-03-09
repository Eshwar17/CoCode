import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';
import { ArrowRight, CheckCircle, Github, ExternalLink, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const HOW_IT_WORKS = [
  { step: '01', title: 'Paste your code', desc: 'Paste any code snippet in any programming language into the editor.' },
  { step: '02', title: 'Add your API key', desc: 'Provide your free OpenRouter API key. It stays in your browser only.' },
  { step: '03', title: 'Choose a model', desc: 'Pick from free models like Llama, Mistral, DeepSeek, or Qwen.' },
  { step: '04', title: 'Analyze & learn', desc: 'Get instant explanations, complexity analysis, bug reports, and optimizations.' },
];

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Senior Engineer @ Stripe', quote: 'Cocode saved me hours reviewing legacy code. The line-by-line explanations are incredibly detailed.', avatar: 'SC' },
  { name: 'Marcus Rodriguez', role: 'CS Student @ MIT', quote: "Finally understand Big-O complexity intuitively. I use this daily when studying algorithms.", avatar: 'MR' },
  { name: 'Priya Nair', role: 'Tech Lead @ Linear', quote: 'The bug detection caught a subtle race condition I missed in code review. Genuinely impressed.', avatar: 'PN' },
  { name: 'Alex Thorn', role: 'Open Source Maintainer', quote: 'Love that it\'s BYOK and open source. No vendor lock-in, full control over your data and usage.', avatar: 'AT' },
];

const FAQS = [
  { q: 'Is my API key safe?', a: "Your API key is stored only in your browser's localStorage. It never leaves your device and is never sent to our servers. We recommend revoking keys you no longer need." },
  { q: 'Which models are supported?', a: 'We support all models available on OpenRouter, including free ones like Llama 3.1, Mistral 7B, DeepSeek Chat, and Qwen 2. Paid models like GPT-4o and Claude are also available.' },
  { q: 'How do I get an OpenRouter API key?', a: 'Visit openrouter.ai, create a free account, navigate to API Keys in your dashboard, and generate a new key. The free tier includes generous credits to get started.' },
  { q: 'What languages are supported?', a: 'We support 50+ programming languages including JavaScript, Python, Java, C++, Go, Rust, PHP, Ruby, Swift, Kotlin, SQL, and many more.' },
  { q: 'Is this really free?', a: "Cocode itself is free and open source. You only pay for the AI model usage through your OpenRouter account. Most analyses cost less than $0.001 when using free models." },
  { q: 'How do I contribute?', a: 'Check out our GitHub repository! We have intentional bugs marked in the issue tracker, documentation improvements, and feature requests. All contributions welcome.' },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-semibold text-sm" style={{ fontFamily: 'Syne' }}>{q}</span>
        <ChevronDown
          size={16}
          style={{ color: 'var(--muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm" style={{ color: 'var(--muted)' }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      <Hero />

      {/* How It Works */}
      <section className="py-32" style={{ background: 'var(--surface)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(77,217,255,0.1)', color: '#4DD9FF', fontFamily: 'Syne', border: '1px solid rgba(77,217,255,0.2)' }}>
              HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
              Up and running in{' '}
              <span className="grad-text">60 seconds</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative">
                <div className="glass rounded-2xl p-6 h-full" style={{ border: '1px solid var(--border)' }}>
                  <div className="text-4xl font-black mb-4 leading-none"
                    style={{ fontFamily: 'Syne', color: 'rgba(198,241,53,0.15)', WebkitTextStroke: '1px rgba(198,241,53,0.3)' }}>
                    {step.step}
                  </div>
                  <h3 className="font-bold mb-2 text-base" style={{ fontFamily: 'Syne' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{step.desc}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10" style={{ color: 'var(--muted)' }}>
                    <ArrowRight size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeatureGrid />

      {/* Live Demo CTA */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'var(--surface)' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(198,241,53,0.06) 0%, transparent 70%)'
        }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
            Try it right now
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--muted)' }}>
            No signup required. Just bring your OpenRouter API key and start analyzing code instantly.
          </p>
          <Link to="/analyzer" className="btn-acid inline-flex items-center gap-2 text-lg px-10 py-4">
            Open Analyzer <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Developer Benefits */}
      <section className="py-32" style={{ background: 'var(--carbon)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{ background: 'rgba(192,132,252,0.1)', color: '#C084FC', fontFamily: 'Syne', border: '1px solid rgba(192,132,252,0.2)' }}>
                FOR DEVELOPERS
              </div>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
                Built by developers,
                <br /><span className="grad-text">for developers</span>
              </h2>
              <div className="space-y-4">
                {[
                  'Full source code available on GitHub',
                  'No account or subscription required',
                  'Works with 50+ programming languages',
                  'Save analysis history locally',
                  'Export analyses as JSON',
                  'Keyboard shortcuts for power users',
                  'Dark and light mode support',
                  'Works offline with saved keys',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle size={16} style={{ color: 'var(--acid)', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
              <div className="text-xs mb-4" style={{ color: 'var(--muted)', fontFamily: 'Syne', letterSpacing: '0.1em' }}>
                KEYBOARD SHORTCUTS
              </div>
              {[
                { key: '⌘ + Enter', action: 'Explain Code' },
                { key: '⌘ + Shift + C', action: 'Analyze Complexity' },
                { key: '⌘ + Shift + B', action: 'Find Bugs' },
                { key: '⌘ + Shift + O', action: 'Optimize Code' },
                { key: '⌘ + K', action: 'Clear Editor' },
                { key: '⌘ + D', action: 'Download Analysis' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>{s.action}</span>
                  <kbd className="px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', fontFamily: 'JetBrains Mono', color: 'var(--acid)' }}>
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32" style={{ background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(198,241,53,0.1)', color: 'var(--acid)', fontFamily: 'Syne', border: '1px solid rgba(198,241,53,0.2)' }}>
            PRICING
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
            Free. Forever.
          </h2>
          <p className="text-lg mb-12" style={{ color: 'var(--muted)' }}>
            Cocode is open source and free to use. You only pay for AI model usage through OpenRouter.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { tier: 'Free', price: '$0', desc: 'Cocode app itself', items: ['Unlimited analyses', 'All features', 'Local history', 'Open source'] },
              { tier: 'OpenRouter Free', price: '$0', desc: 'Free model usage', items: ['Llama 3.1 8B', 'Mistral 7B', 'Qwen 2 7B', 'Gemma 2 9B'], highlight: true },
              { tier: 'OpenRouter Paid', price: 'Pay per use', desc: 'Premium models', items: ['GPT-4o Mini', 'Claude 3 Haiku', 'DeepSeek Coder', 'More models'] },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-6 text-left ${plan.highlight ? 'pulse-border' : ''}`}
                style={{
                  border: plan.highlight ? '1px solid rgba(198,241,53,0.4)' : '1px solid var(--border)',
                  background: plan.highlight ? 'rgba(198,241,53,0.04)' : 'var(--surface2)'
                }}>
                {plan.highlight && (
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--acid)', fontFamily: 'Syne' }}>RECOMMENDED</div>
                )}
                <div className="text-2xl font-black mb-1" style={{ fontFamily: 'Syne' }}>{plan.price}</div>
                <div className="font-bold mb-1">{plan.tier}</div>
                <div className="text-xs mb-4" style={{ color: 'var(--muted)' }}>{plan.desc}</div>
                <ul className="space-y-2">
                  {plan.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={13} style={{ color: plan.highlight ? 'var(--acid)' : 'var(--muted)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="py-32" style={{ background: 'var(--carbon)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Github size={48} className="mx-auto mb-6" style={{ color: 'var(--muted)' }} />
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
            Open Source &{' '}
            <span className="grad-text">Community Driven</span>
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Cocode has intentional bugs scattered throughout the codebase — perfect for
            contributors to find, report, and fix. Join 180+ contributors on GitHub.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {['Find Bugs', 'Submit Issues', 'Open PRs', 'Add Features', 'Improve Docs', 'Join Discord'].map((a, i) => (
              <span key={i} className="px-4 py-2 rounded-full text-sm glass"
                style={{ border: '1px solid var(--border)' }}>
                {a}
              </span>
            ))}
          </div>
          <a href="https://github.com/cocode-dev/cocode" target="_blank" rel="noopener noreferrer"
            className="btn-acid inline-flex items-center gap-2 text-base px-8 py-3.5">
            <Github size={18} /> Star on GitHub
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32" style={{ background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
              Loved by developers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass glass-hover rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--muted)' }}>"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--acid)', color: 'black', fontFamily: 'Syne' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ fontFamily: 'Syne' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32" style={{ background: 'var(--carbon)' }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FAQ key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-lg" style={{ fontFamily: 'Syne' }}>co<span style={{ color: 'var(--acid)' }}>code</span></span>
              <span className="text-sm" style={{ color: 'var(--muted)' }}>— AI Code Explainer</span>
            </div>
            <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--muted)' }}>
              <a href="https://github.com/cocode-dev/cocode" className="hover:text-white transition-colors">GitHub</a>
              <a href="https://openrouter.ai" className="hover:text-white transition-colors">OpenRouter</a>
              <Link to="/analyzer" className="hover:text-white transition-colors">Analyzer</Link>
              <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              MIT License • Open Source
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
