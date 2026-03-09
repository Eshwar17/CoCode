import { useState, useEffect } from 'react';
import { BarChart3, Bug, Zap, Clock, Code2, Activity } from 'lucide-react';
import { LanguageBarChart, ComplexityDoughnutChart, BugCategoryChart, UsageTrendChart } from '../components/DashboardCharts';

const STORAGE_KEY = 'cocode_history';

// BUG: processHistory called on every render instead of memoized
function processHistory(history) {
  // Language distribution
  const langMap = {};
  const complexityMap = {};
  const bugCategories = { 'Critical Bugs': 0, 'Logical Issues': 0, 'Code Smells': 0, 'Edge Cases': 0, 'Security': 0 };
  const dateMap = {};
  let totalBugs = 0;
  let totalOptimizations = 0;
  const modelsUsed = {};

  history.forEach(entry => {
    // Languages
    langMap[entry.language] = (langMap[entry.language] || 0) + 1;

    // Complexity
    if (entry.results?.complexity) {
      const text = entry.results.complexity;
      // BUG: Regex incorrectly matches O(n²) as O(n) due to greedy matching
      const match = text.match(/O\([^)]+\)/);
      if (match) {
        complexityMap[match[0]] = (complexityMap[match[0]] || 0) + 1;
      }
    }

    // Bugs
    if (entry.results?.bugs) {
      const text = entry.results.bugs;
      Object.keys(bugCategories).forEach(cat => {
        if (text.includes(cat)) {
          bugCategories[cat]++;
          totalBugs++;
        }
      });
    }

    // Optimizations
    if (entry.results?.optimization) totalOptimizations++;

    // Models
    modelsUsed[entry.model] = (modelsUsed[entry.model] || 0) + 1;

    // Date trend
    const date = new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dateMap[date] = (dateMap[date] || 0) + 1;
  });

  return {
    langData: Object.entries(langMap).map(([language, count]) => ({ language, count })).sort((a, b) => b.count - a.count).slice(0, 8),
    complexityData: Object.entries(complexityMap).map(([label, count]) => ({ label, count })),
    bugData: Object.entries(bugCategories).map(([category, count]) => ({ category, count })).filter(d => d.count > 0),
    trendData: Object.entries(dateMap).slice(-7).map(([date, count]) => ({ date, count })),
    totalBugs,
    totalOptimizations,
    modelsUsed,
    total: history.length,
  };
}

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, color }}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black mb-1" style={{ fontFamily: 'Syne' }}>{value}</div>
      <div className="text-sm font-semibold" style={{ fontFamily: 'Syne' }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{sub}</div>}
    </div>
  );
}

function ChartCard({ title, icon, children, empty }) {
  return (
    <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span style={{ color: 'var(--acid)' }}>{icon}</span>
        <span className="font-bold text-sm" style={{ fontFamily: 'Syne' }}>{title}</span>
      </div>
      {empty ? (
        <div className="h-40 flex items-center justify-center text-sm" style={{ color: 'var(--muted)' }}>
          No data yet — analyze some code first!
        </div>
      ) : (
        <div style={{ height: '220px' }}>{children}</div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // BUG: No error handling if localStorage contains invalid JSON
    const raw = localStorage.getItem(STORAGE_KEY);
    const history = raw ? JSON.parse(raw) : [];
    setStats(processHistory(history));
  }, []);

  if (!stats) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  const topLang = stats.langData[0]?.language || 'N/A';
  const topModel = Object.entries(stats.modelsUsed).sort((a, b) => b[1] - a[1])[0]?.[0]?.split('/')[1] || 'N/A';

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: 'var(--carbon)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 pt-6">
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Syne', fontWeight: 800 }}>Analytics Dashboard</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Your code analysis statistics from local history</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<Code2 size={18} />} label="Total Analyses" value={stats.total} color="#C6F135" sub="All time" />
          <StatCard icon={<Bug size={18} />} label="Bugs Found" value={stats.totalBugs} color="#FF757F" sub="Across all analyses" />
          <StatCard icon={<Zap size={18} />} label="Optimizations" value={stats.totalOptimizations} color="#4DD9FF" sub="Code improvements" />
          <StatCard icon={<Activity size={18} />} label="Top Language" value={topLang} color="#7CFFC4" sub={`${stats.langData[0]?.count || 0} analyses`} />
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <ChartCard title="Language Distribution" icon={<BarChart3 size={16} />} empty={stats.langData.length === 0}>
            <LanguageBarChart data={stats.langData} />
          </ChartCard>

          <ChartCard title="Complexity Distribution" icon={<Clock size={16} />} empty={stats.complexityData.length === 0}>
            <ComplexityDoughnutChart data={stats.complexityData.length > 0 ? stats.complexityData : [
              { label: 'O(1)', count: 3 }, { label: 'O(n)', count: 8 }, { label: 'O(n log n)', count: 5 }, { label: 'O(n²)', count: 2 }
            ]} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="Bug Categories Found" icon={<Bug size={16} />} empty={stats.bugData.length === 0}>
            <BugCategoryChart data={stats.bugData.length > 0 ? stats.bugData : [
              { category: 'Critical', count: 2 }, { category: 'Logical', count: 5 }, { category: 'Smells', count: 8 }, { category: 'Edge Cases', count: 3 }
            ]} />
          </ChartCard>

          <ChartCard title="Analysis Trend (7 days)" icon={<Activity size={16} />} empty={stats.trendData.length === 0}>
            <UsageTrendChart data={stats.trendData.length > 0 ? stats.trendData : [
              { date: 'Mon', count: 1 }, { date: 'Tue', count: 3 }, { date: 'Wed', count: 2 },
              { date: 'Thu', count: 5 }, { date: 'Fri', count: 4 }, { date: 'Sat', count: 2 }, { date: 'Sun', count: 0 }
            ]} />
          </ChartCard>
        </div>

        {/* Model usage */}
        {Object.keys(stats.modelsUsed).length > 0 && (
          <div className="glass rounded-2xl p-5 mt-5" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} style={{ color: 'var(--acid)' }} />
              <span className="font-bold text-sm" style={{ fontFamily: 'Syne' }}>Models Used</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(stats.modelsUsed).map(([model, count]) => (
                <div key={model} className="rounded-xl p-3" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                  <div className="text-xl font-black mb-1" style={{ fontFamily: 'Syne' }}>{count}x</div>
                  <div className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>{model.split('/').pop()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
