import { Brain, Timer, Bug, Sparkles, Key, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: <Brain size={22} />,
    title: 'Code Explanation',
    desc: 'Get simple explanations, line-by-line breakdowns, and algorithm summaries for any code in any language.',
    color: '#C6F135',
  },
  {
    icon: <Timer size={22} />,
    title: 'Complexity Analysis',
    desc: 'Instantly know the Big-O time and space complexity with detailed reasoning from the AI.',
    color: '#7CFFC4',
  },
  {
    icon: <Bug size={22} />,
    title: 'Bug Detection',
    desc: 'Catch logical bugs, code smells, security issues, and edge cases before they reach production.',
    color: '#FF757F',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'Code Optimization',
    desc: 'Receive improved code snippets with explanations of every change and estimated performance gains.',
    color: '#FF966C',
  },
  {
    icon: <Key size={22} />,
    title: 'Bring Your Own Key',
    desc: 'Use your OpenRouter API key. We never store it on our servers. Your key, your control.',
    color: '#4DD9FF',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Analytics Dashboard',
    desc: 'Track your analyses, language distribution, bug patterns, and API usage over time.',
    color: '#C084FC',
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-32 relative" style={{ background: 'var(--carbon)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(198,241,53,0.1)', color: 'var(--acid)', fontFamily: 'Syne', border: '1px solid rgba(198,241,53,0.2)' }}>
            FEATURES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
            Everything you need to
            <br />
            <span className="grad-text">master any codebase</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            AI-powered code understanding across 50+ programming languages, powered by the best open models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass glass-hover rounded-2xl p-6 cursor-default"
              style={{ border: '1px solid var(--border)' }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}18`, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Syne', fontWeight: 700 }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
