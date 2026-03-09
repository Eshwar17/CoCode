# Cocode – Code Explainer BYOK

> AI-powered code explanation, complexity analysis, bug detection, and optimization — bring your own OpenRouter API key.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Open Issues](https://img.shields.io/github/issues/cocode-dev/cocode)
![Stars](https://img.shields.io/github/stars/cocode-dev/cocode)

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## 📋 Features

- **Code Explanation** – Simple, line-by-line, and algorithm summaries
- **Complexity Analysis** – Big-O time and space complexity
- **Bug Detection** – Logical bugs, code smells, edge cases, security issues
- **Code Optimization** – Rewritten code with performance improvements
- **BYOK** – Bring Your Own OpenRouter API key
- **History** – All analyses saved locally
- **Dashboard** – Visual analytics with Chart.js
- **Dark/Light Mode** – Full theme support

## 🔑 Getting an OpenRouter API Key

1. Visit [openrouter.ai](https://openrouter.ai)
2. Create a free account
3. Go to **API Keys** in your dashboard
4. Click **Create Key** and copy it
5. Paste it in the Analyzer page

## 🐛 Open Source Bug Hunt

This project contains **50 intentional bugs** for contributors to find and fix!

### Bug Categories

| Category | Count | Examples |
|---|---|---|
| UI Bugs | ~10 | Mobile layout overflow, missing dark mode styles |
| Logic Bugs | ~10 | Wrong complexity regex, stale closures in shortcuts |
| Security Bugs | ~5 | Plain text API key storage, missing input sanitization |
| Performance Bugs | ~8 | Missing memoization, unnecessary re-renders |
| Accessibility Bugs | ~8 | Missing aria-labels, low contrast, missing alt text |
| Code Quality | ~9 | Unused variables, duplicate logic, missing error handling |

### How to Contribute

1. Fork the repo
2. Find a bug (check the categories above)
3. Open a GitHub Issue describing the bug
4. Submit a PR with the fix
5. Profit! 🎉

**Good first issues:** Look for `// BUG:` comments — wait, there aren't any! That's the challenge. 🕵️

## 🗂️ Project Structure

```
src/
  components/
    Navbar.jsx          # Navigation with dark mode toggle
    Hero.jsx            # Landing page hero section
    FeatureGrid.jsx     # Features showcase
    CodeEditor.jsx      # Code input with line numbers
    ResultTabs.jsx      # Analysis results display
    DashboardCharts.jsx # Chart.js visualizations
  pages/
    Landing.jsx         # Full SaaS landing page
    Analyzer.jsx        # Main analysis tool
    Dashboard.jsx       # Analytics dashboards
    History.jsx         # Local analysis history
  services/
    openrouter.js       # OpenRouter API integration
  App.jsx
  main.jsx
```

## 🤖 Supported Models

### Free
- Llama 3.1 8B (default)
- Mistral 7B
- DeepSeek Chat
- Qwen 2 7B
- Gemma 2 9B
- Phi-3 Mini

### Paid (via OpenRouter)
- GPT-4o Mini
- Claude 3 Haiku
- DeepSeek Coder

## 📄 License

MIT License — free to use, modify, and distribute.
