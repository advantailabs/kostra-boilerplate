import { useTheme } from 'next-themes';
import { forwardRef, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MarkdownRendererProps {
  content: string;
  forceWhiteText?: boolean;
}

// Code component with copy functionality
const CodeBlock = forwardRef<HTMLElement, any>(function CodeBlock(
  { inline, className, children, forceWhiteText, ...props },
  ref
) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');
  const isDark = theme === 'dark';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!inline && match) {
    return (
      <div className="relative">
        <button
          className="absolute right-2 top-2 z-10 rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-300 hover:text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          onClick={handleCopy}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>

        <SyntaxHighlighter
          style={isDark ? oneDark : oneLight}
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
    <code
      ref={ref as any}
      className={`rounded px-1 py-0.5 text-xs ${
        forceWhiteText
          ? 'bg-indigo-800 text-white'
          : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white'
      }`}
    >
      {children}
    </code>
  );
});

// Create component factories to avoid inline component definitions
const createParagraph = (forceWhiteText: boolean) =>
  forwardRef<HTMLParagraphElement, any>(function Paragraph({ children, ...props }, ref) {
    return (
      <p
        ref={ref}
        className={`mb-2 mt-1 leading-relaxed ${
          forceWhiteText ? 'text-white' : 'text-gray-800 dark:text-gray-200'
        }`}
        {...props}
      >
        {children}
      </p>
    );
  });

const createUnorderedList = (forceWhiteText: boolean) =>
  forwardRef<HTMLUListElement, any>(function UnorderedList({ children, ...props }, ref) {
    return (
      <ul
        ref={ref}
        className={`mb-3 ml-6 mt-2 list-disc space-y-1 ${
          forceWhiteText ? 'text-white' : 'text-gray-800 dark:text-gray-200'
        }`}
        {...props}
      >
        {children}
      </ul>
    );
  });

const createOrderedList = (forceWhiteText: boolean) =>
  forwardRef<HTMLOListElement, any>(function OrderedList({ children, ...props }, ref) {
    return (
      <ol
        ref={ref}
        className={`mb-3 ml-6 mt-2 list-decimal space-y-1 ${
          forceWhiteText ? 'text-white' : 'text-gray-800 dark:text-gray-200'
        }`}
        {...props}
      >
        {children}
      </ol>
    );
  });

const createListItem = (forceWhiteText: boolean) =>
  forwardRef<HTMLLIElement, any>(function ListItem({ children, ...props }, ref) {
    return (
      <li
        ref={ref}
        className={`leading-relaxed ${
          forceWhiteText ? 'text-white' : 'text-gray-800 dark:text-gray-200'
        }`}
        {...props}
      >
        {children}
      </li>
    );
  });

const createStrong = (forceWhiteText: boolean) =>
  forwardRef<HTMLElement, any>(function Strong({ children, ...props }, ref) {
    return (
      <strong
        ref={ref}
        className={`font-semibold ${
          forceWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}
        {...props}
      >
        {children}
      </strong>
    );
  });

const createEmphasis = (forceWhiteText: boolean) =>
  forwardRef<HTMLElement, any>(function Emphasis({ children, ...props }, ref) {
    return (
      <em
        ref={ref}
        className={`italic ${
          forceWhiteText ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
        }`}
        {...props}
      >
        {children}
      </em>
    );
  });

const createHeading1 = (forceWhiteText: boolean) =>
  forwardRef<HTMLHeadingElement, any>(function Heading1({ children, ...props }, ref) {
    return (
      <h1
        ref={ref}
        className={`mb-3 mt-6 text-2xl font-bold ${
          forceWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}
        {...props}
      >
        {children}
      </h1>
    );
  });

const createHeading2 = (forceWhiteText: boolean) =>
  forwardRef<HTMLHeadingElement, any>(function Heading2({ children, ...props }, ref) {
    return (
      <h2
        ref={ref}
        className={`mb-3 mt-5 text-xl font-bold ${
          forceWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}
        {...props}
      >
        {children}
      </h2>
    );
  });

const createHeading3 = (forceWhiteText: boolean) =>
  forwardRef<HTMLHeadingElement, any>(function Heading3({ children, ...props }, ref) {
    return (
      <h3
        ref={ref}
        className={`mb-2 mt-4 text-lg font-bold ${
          forceWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}
        {...props}
      >
        {children}
      </h3>
    );
  });

const createHeading4 = (forceWhiteText: boolean) =>
  forwardRef<HTMLHeadingElement, any>(function Heading4({ children, ...props }, ref) {
    return (
      <h4
        ref={ref}
        className={`mb-2 mt-3 text-base font-bold ${
          forceWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}
        {...props}
      >
        {children}
      </h4>
    );
  });

const createHorizontalRule = (forceWhiteText: boolean) =>
  forwardRef<HTMLHRElement, any>(function HorizontalRule({ ...props }, ref) {
    return (
      <hr
        ref={ref}
        className={`my-4 ${
          forceWhiteText ? 'border-indigo-400' : 'border-gray-300 dark:border-gray-600'
        }`}
        {...props}
      />
    );
  });

export default function MarkdownRenderer({
  content,
  forceWhiteText = false,
}: MarkdownRendererProps) {
  // Create component instances with the forceWhiteText prop baked in
  const components = useMemo(() => ({
    code: (props: any) => <CodeBlock {...props} forceWhiteText={forceWhiteText} />,
    p: createParagraph(forceWhiteText),
    ul: createUnorderedList(forceWhiteText),
    ol: createOrderedList(forceWhiteText),
    li: createListItem(forceWhiteText),
    strong: createStrong(forceWhiteText),
    em: createEmphasis(forceWhiteText),
    h1: createHeading1(forceWhiteText),
    h2: createHeading2(forceWhiteText),
    h3: createHeading3(forceWhiteText),
    h4: createHeading4(forceWhiteText),
    hr: createHorizontalRule(forceWhiteText),
  }), [forceWhiteText]);

  return (
    <div
      className={`text-sm ${forceWhiteText ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}
    >
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}