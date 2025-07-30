import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="text-sm text-gray-200">
      <ReactMarkdown
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const code = String(children).replace(/\n$/, '');

            const [copied, setCopied] = useState(false);

            const handleCopy = async () => {
              try {
                await navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Reset after 2s
              } catch (err) {
                console.error('Failed to copy:', err);
              }
            };

            if (!inline && match) {
              return (
                <div className="relative">
                  <button
                    className="absolute right-2 top-2 z-10 rounded bg-gray-700 px-2 py-1 text-xs text-white hover:bg-gray-600"
                    onClick={handleCopy}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>

                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, paddingTop: '2.5rem' }}
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code className="rounded bg-gray-800 px-1 py-0.5 text-xs text-white">{children}</code>
            );
          },

          p: ({ children }) => (
            <p className="mb-[4px] mt-[4px] leading-snug text-gray-200">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-[4px] ml-5 mt-[4px] list-disc space-y-[4px] text-gray-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-[4px] ml-5 mt-[4px] list-decimal space-y-[4px] text-gray-200">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-snug text-gray-200">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
          h1: ({ children }) => (
            <h1 className="mb-[4px] mt-[6px] text-2xl font-bold text-white">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-[4px] mt-[6px] text-xl font-bold text-white">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-[4px] mt-[6px] text-lg font-bold text-white">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-[4px] mt-[6px] text-base font-bold text-white">{children}</h4>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
