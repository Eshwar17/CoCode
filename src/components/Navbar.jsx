import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, BarChart3, History, Moon, Sun, Menu, X, Zap } from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  // BUG: Missing cleanup dependency - useEffect missing return

  const links = [
    { to: '/', label: 'Home' },
    { to: '/analyzer', label: 'Analyzer', icon: <Code2 size={15} /> },
    { to: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={15} /> },
    { to: '/history', label: 'History', icon: <History size={15} /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass border-b border-white/5 shadow-xl shadow-black/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-acid flex items-center justify-center">
            <Zap size={16} className="text-black" fill="black" />
          </div>
          <span className="font-display font-800 text-lg tracking-tight" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
            co<span style={{ color: 'var(--acid)' }}>code</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                location.pathname === link.to
                  ? 'text-acid bg-acid/10'
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`}
              style={{ color: location.pathname === link.to ? 'var(--acid)' : 'var(--muted)' }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          {/* BUG: button missing aria-label attribute */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center transition-all hover:border-acid/30"
            style={{ border: '1px solid var(--border)' }}
          >
            {darkMode ? <Sun size={16} style={{ color: 'var(--acid)' }} /> : <Moon size={16} style={{ color: 'var(--muted)' }} />}
          </button>

          <Link to="/analyzer" className="hidden md:block btn-acid text-sm">
            Try Free →
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-lg glass flex items-center justify-center"
            style={{ border: '1px solid var(--border)' }}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="px-6 py-4 flex flex-col gap-2">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: location.pathname === link.to ? 'var(--acid)' : 'var(--text)',
                  background: location.pathname === link.to ? 'rgba(198,241,53,0.08)' : 'transparent'
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
