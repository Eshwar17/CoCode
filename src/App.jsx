import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Analyzer from './pages/Analyzer';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

export default function App() {
  // BUG: darkMode default doesn't check system preference
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('cocode_theme') !== 'light';
  });

  useEffect(() => {
    // BUG: class applied to wrong element - should toggle on documentElement
    document.body.classList.toggle('light', !darkMode);
    localStorage.setItem('cocode_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className={darkMode ? '' : 'light'}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          {/* BUG: No 404 route handler */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
