// OpenRouter API service
const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

export const MODELS = [
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat (Free)', free: true },
  { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (Free)', free: true },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)', free: true },
  { id: 'qwen/qwen-2-7b-instruct:free', name: 'Qwen 2 7B (Free)', free: true },
  { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B (Free)', free: true },
  { id: 'microsoft/phi-3-mini-128k-instruct:free', name: 'Phi-3 Mini (Free)', free: true },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', free: false },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', free: false },
  { id: 'deepseek/deepseek-coder', name: 'DeepSeek Coder', free: false },
];

export const DEFAULT_MODEL = 'meta-llama/llama-3.1-8b-instruct:free';

async function callOpenRouter(apiKey, model, systemPrompt, userMessage) {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API key is required. Please enter your OpenRouter API key.');
  }

  const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://cocode.dev',
      'X-Title': 'Cocode - Code Explainer',
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    // BUG: Error message doesn't include status code
    throw new Error(err.error?.message || 'OpenRouter API request failed');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function explainCode(apiKey, model, code, language) {
  const system = `You are an expert code educator. Explain code clearly for developers.
Always structure your response with these exact sections:
## Simple Explanation
(2-3 sentences plain English)

## Line-by-Line Breakdown
(numbered list explaining each important line or block)

## Algorithm Summary
(describe the overall algorithm or pattern used)`;

  const user = `Explain this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;
  return callOpenRouter(apiKey, model, system, user);
}

export async function analyzeComplexity(apiKey, model, code, language) {
  const system = `You are an algorithms expert. Analyze code complexity precisely.
Always structure your response with these exact sections:
## Time Complexity
(Big-O notation with explanation)

## Space Complexity
(Big-O notation with explanation)

## Reasoning
(detailed explanation of why these complexities apply)

## Best/Worst/Average Cases
(if applicable)`;

  const user = `Analyze the time and space complexity of this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;
  return callOpenRouter(apiKey, model, system, user);
}

export async function detectBugs(apiKey, model, code, language) {
  const system = `You are a senior code reviewer specializing in bug detection.
Always structure your response with these exact sections:
## Critical Bugs
(list serious bugs with line references)

## Logical Issues
(potential logic errors or incorrect behavior)

## Code Smells
(anti-patterns, poor practices)

## Edge Cases
(inputs or conditions that could cause failures)

## Security Concerns
(any security vulnerabilities)

If no issues found in a category, write "None detected."`;

  const user = `Find all bugs, issues, and code smells in this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;
  return callOpenRouter(apiKey, model, system, user);
}

export async function optimizeCode(apiKey, model, code, language) {
  const system = `You are a performance optimization expert. Provide concrete improvements.
Always structure your response with these exact sections:
## Optimized Code
(provide the fully rewritten improved code in a code block)

## Changes Made
(numbered list of what was changed and why)

## Performance Impact
(estimated improvement and reasoning)

## Additional Tips
(further optimization strategies to consider)`;

  const user = `Optimize this ${language} code for performance, readability, and best practices:\n\`\`\`${language}\n${code}\n\`\`\``;
  return callOpenRouter(apiKey, model, system, user);
}
