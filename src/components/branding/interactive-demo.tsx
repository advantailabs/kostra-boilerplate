'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const chatMessages = [
  { message: 'What invoices are overdue next month?', delay: 0, type: 'user' },
  { message: 'Analyzing financial records...', delay: 1000, type: 'assistant-thinking' },
  { message: '🤖 Based on your financial records:', delay: 2000, type: 'assistant' },
  {
    message: '• **12 invoices** totaling **$45,320** will be overdue',
    delay: 2500,
    type: 'assistant',
  },
  {
    message: '• **Top clients:** TechCorp ($18,500), DataFlow ($12,800)',
    delay: 3000,
    type: 'assistant',
  },
  {
    message: '• **Recommended action:** Send reminder emails by Jan 15th',
    delay: 3500,
    type: 'assistant',
  },
  {
    message: '📄 **Sources:** invoices_Q4_2024.pdf, client_contracts.docx',
    delay: 4000,
    type: 'citation',
  },
];

const sdkSnippet = `// Peon SDK - Ask Questions & Get Answers
import { PeonClient } from '@peon/sdk';

const peon = new PeonClient({
  apiKey: process.env.PEON_API_KEY
});

// Ask about financial data
const response = await peon.ask({
  question: "What invoices are overdue next month?",
  persona: "finance-assistant",
  knowledgeBase: "financial-records"
});

console.log(response.answer);
// Output: "Based on the financial records, there are 12 invoices
// totaling $45,320 that will be overdue next month. Here's the
// breakdown by client..."

console.log(response.sources);
// Output: ["invoices_Q4_2024.pdf", "client_contracts.docx"]

// Ask about revenue analysis
const revenueData = await peon.ask({
  question: "What was revenue generated in last 3 months?",
  persona: "analytics-agent"
});

console.log(revenueData.answer);
// Output: "Revenue for Q3: $234K, Q4: $289K, Q1: $312K.
// 15% growth quarter-over-quarter."
`;

export function InteractiveDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState<'chat' | 'api'>('chat');
  const [visibleMessages, setVisibleMessages] = useState<number>(0);

  useEffect(() => {
    if (!isInView) return undefined;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    chatMessages.forEach((msg, index) => {
      const timeout = setTimeout(() => {
        setVisibleMessages(index + 1);
      }, msg.delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isInView]);

  return (
    <section ref={ref} className="relative bg-black py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="mb-6 text-4xl font-light text-white md:text-6xl">See it in action</h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            Experience Peon's natural chat interface and powerful SDK. Ask complex questions and get
            detailed analysis with just a few lines of code.
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl">
          {/* Tab switcher */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center justify-center"
          >
            <div className="flex rounded-lg border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab('chat')}
                className={`rounded-md px-6 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'chat' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Chat Interface
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`rounded-md px-6 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'api' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                SDK Integration
              </button>
            </div>
          </motion.div>

          {/* Demo content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            {activeTab === 'chat' ? (
              // Chat interface demo
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm">
                {/* Chat header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600">
                      <span className="text-sm font-bold text-white">$$</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">Finance Assistant</span>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        <span className="text-xs text-gray-400">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Knowledge Base: Financial Records</div>
                </div>

                {/* Chat content */}
                <div className="min-h-[300px] space-y-4 p-6">
                  {chatMessages.slice(0, visibleMessages).map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${(() => {
                          if (msg.type === 'user') return 'bg-blue-600 text-white';
                          if (msg.type === 'assistant-thinking')
                            return 'bg-gray-700 italic text-gray-300';
                          if (msg.type === 'citation')
                            return 'border border-gray-600 bg-gray-800 text-gray-400';
                          return 'bg-gray-700 text-gray-100';
                        })()}`}
                      >
                        {msg.message}
                      </div>
                    </motion.div>
                  ))}
                  {visibleMessages === chatMessages.length && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-xs text-gray-500"
                    >
                      <span>✓ Response generated in 1.2s</span>
                    </motion.div>
                  )}
                </div>

                {/* Chat input */}
                <div className="border-t border-white/10 p-4">
                  <div className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/5 px-4 py-2">
                    <input
                      type="text"
                      placeholder="Ask Finance Assistant about revenue, invoices, expenses..."
                      className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                      disabled
                    />
                    <button className="text-gray-400 hover:text-white" aria-label="Send message">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // SDK demo
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm">
                {/* Code header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-gray-900/50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">peon-sdk-example.ts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">TypeScript</span>
                    <button className="rounded-md bg-white/10 px-3 py-1 text-xs text-gray-400 transition-colors hover:bg-white/20 hover:text-white">
                      Copy
                    </button>
                  </div>
                </div>

                {/* Code content */}
                <div className="p-6">
                  <pre className="overflow-x-auto text-sm leading-[1.6] text-gray-300">
                    <code
                      dangerouslySetInnerHTML={{ __html: highlightCode(sdkSnippet) }}
                      className="font-mono"
                    />
                  </pre>
                </div>

                {/* SDK Info badge */}
                <div className="absolute right-4 top-16">
                  <div className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
                    @peon/sdk
                  </div>
                </div>
              </div>
            )}

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -right-6 -top-6 h-12 w-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 h-8 w-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function highlightCode(code: string): string {
  // Define token types and their colors
  const tokenColors = {
    comment: '#5c6370',
    keyword: '#c678dd',
    sdkMethod: '#61afef',
    string: '#98c379',
    punctuation: '#abb2bf',
    default: '#abb2bf',
  };

  // Escape HTML to prevent injection
  const result = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Process line by line to handle comments properly
  const lines = result.split('\n');

  const processedLines = lines.map(line => {
    // Track if we're inside a string
    let inString = null; // null, 'single', or 'double'
    let currentToken = '';
    let processedLine = '';

    // Process each character
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const nextChar = i < line.length - 1 ? line[i + 1] : '';

      // Handle comments - they take precedence over everything else
      if (char === '/' && nextChar === '/' && !inString) {
        // If we have accumulated characters, process them first
        if (currentToken) {
          processedLine += colorizeToken(currentToken);
          currentToken = '';
        }

        // Add the comment
        const comment = line.substring(i);
        processedLine += `<span style="color: ${tokenColors.comment}; font-style: italic">${comment}</span>`;
        break; // Comment runs to end of line
      }

      // Handle string boundaries
      if (char === '"' && (i === 0 || line[i - 1] !== '\\') && inString !== 'single') {
        if (inString === 'double') {
          // End of double-quoted string
          currentToken += char;
          processedLine += `<span style="color: ${tokenColors.string}">${currentToken}</span>`;
          currentToken = '';
          inString = null;
        } else {
          // Start of double-quoted string
          if (currentToken) {
            processedLine += colorizeToken(currentToken);
            currentToken = '';
          }
          currentToken += char;
          inString = 'double';
        }
      } else if (char === "'" && (i === 0 || line[i - 1] !== '\\') && inString !== 'double') {
        if (inString === 'single') {
          // End of single-quoted string
          currentToken += char;
          processedLine += `<span style="color: ${tokenColors.string}">${currentToken}</span>`;
          currentToken = '';
          inString = null;
        } else {
          // Start of single-quoted string
          if (currentToken) {
            processedLine += colorizeToken(currentToken);
            currentToken = '';
          }
          currentToken += char;
          inString = 'single';
        }
      } else if (inString) {
        // If we're in a string, just accumulate characters
        currentToken += char;
      } else if (/[{}();:,.[\]=]/.test(char)) {
        // Handle punctuation
        if (currentToken) {
          processedLine += colorizeToken(currentToken);
          currentToken = '';
        }
        processedLine += `<span style="color: ${tokenColors.punctuation}">${char}</span>`;
      } else {
        // Accumulate characters for other token types
        currentToken += char;
      }
    }

    // Process any remaining token
    if (currentToken) {
      processedLine += colorizeToken(currentToken);
    }

    return processedLine;
  });

  return processedLines.join('\n');

  // Helper function to colorize a token based on its content
  function colorizeToken(token: string): string {
    // Check for keywords
    if (/^(import|from|const|await|console|log|new|process|env)$/.test(token)) {
      return `<span style="color: ${tokenColors.keyword}">${token}</span>`;
    }

    // Check for SDK methods
    if (/^(PeonClient|ask|question|persona|knowledgeBase|answer|sources|apiKey)$/.test(token)) {
      return `<span style="color: ${tokenColors.sdkMethod}">${token}</span>`;
    }

    // Default coloring
    return `<span style="color: ${tokenColors.default}">${token}</span>`;
  }
}
