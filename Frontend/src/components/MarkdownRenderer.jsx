import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

/**
 * Lightweight, robust, zero-dependency Markdown renderer tailored for code and technical solutions.
 * Supports:
 * - Fenced code blocks with language tags, line numbers, and copy button
 * - Headers (h1 to h4)
 * - Lists (ordered and unordered)
 * - Inline code, bold, italic
 * - Blockquotes
 */
export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Split into blocks: code blocks vs text blocks
  const parts = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index)
      });
    }
    parts.push({
      type: 'code',
      language: match[1] || 'plaintext',
      code: match[2].trimEnd()
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex)
    });
  }

  return (
    <div className="space-y-3.5 text-slate-800 leading-relaxed font-normal text-sm md:text-[14.5px]">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return <CodeBlock key={idx} language={part.language} code={part.code} />;
        }
        return <TextSection key={idx} rawText={part.content} />;
      })}
    </div>
  );
}

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-md group relative">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#1e293b]/90 border-b border-slate-700/60 text-xs text-slate-300 font-mono">
        <span className="uppercase tracking-wider font-semibold text-[11px] text-indigo-300">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto text-xs md:text-[13px] font-mono leading-relaxed text-slate-200">
        <pre>
          <code>{highlightCode(code, language)}</code>
        </pre>
      </div>
    </div>
  );
}

function highlightCode(code) {
  // Simple token highlight for JS/TS/Py/JSON
  const lines = code.split('\n');
  return lines.map((line, lIdx) => {
    return (
      <div key={lIdx} className="table-row">
        <span className="table-cell pr-4 text-slate-600 select-none text-right font-mono text-[11px] w-6">
          {lIdx + 1}
        </span>
        <span className="table-cell font-mono whitespace-pre">
          {formatCodeLine(line)}
        </span>
      </div>
    );
  });
}

function formatCodeLine(line) {
  // Check for comment
  if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('#')) {
    return <span className="text-slate-400 italic">{line}</span>;
  }

  // Basic keyword highlighting
  const words = line.split(/(\s+|[(),;.[\]{}]+)/);
  return words.map((token, i) => {
    const trimmed = token.trim();
    if (['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'throw', 'new', 'import', 'from', 'export', 'default', 'async', 'await', 'class', 'type', 'interface'].includes(trimmed)) {
      return <span key={i} className="text-purple-300 font-medium">{token}</span>;
    }
    if (['true', 'false', 'null', 'undefined', 'BigInt', 'Math', 'Map', 'RangeError', 'TypeError', 'Promise'].includes(trimmed)) {
      return <span key={i} className="text-amber-300">{token}</span>;
    }
    if (/^\d+n?$/.test(trimmed)) {
      return <span key={i} className="text-cyan-300">{token}</span>;
    }
    if (/^["'`].*["'`]$/.test(trimmed)) {
      return <span key={i} className="text-emerald-300">{token}</span>;
    }
    return token;
  });
}

function TextSection({ rawText }) {
  const paragraphs = rawText.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <>
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();

        // Headers
        if (trimmed.startsWith('#### ')) {
          return <h4 key={pIdx} className="font-semibold text-slate-900 text-sm tracking-tight pt-1">{parseInline(trimmed.slice(5))}</h4>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={pIdx} className="font-bold text-slate-900 text-[15px] tracking-tight pt-1.5">{parseInline(trimmed.slice(4))}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={pIdx} className="font-bold text-slate-900 text-base tracking-tight pt-2">{parseInline(trimmed.slice(3))}</h2>;
        }
        if (trimmed.startsWith('# ')) {
          return <h1 key={pIdx} className="font-extrabold text-slate-900 text-lg tracking-tight pt-2">{parseInline(trimmed.slice(2))}</h1>;
        }

        // List items
        const lines = trimmed.split('\n');
        const isList = lines.every(l => l.trim().startsWith('- ') || l.trim().startsWith('* ') || /^\d+\.\s/.test(l.trim()));
        if (isList) {
          const isOrdered = /^\d+\.\s/.test(lines[0].trim());
          if (isOrdered) {
            return (
              <ol key={pIdx} className="list-decimal pl-5 space-y-1 text-slate-700">
                {lines.map((item, i) => (
                  <li key={i}>{parseInline(item.replace(/^\d+\.\s/, ''))}</li>
                ))}
              </ol>
            );
          }
          return (
            <ul key={pIdx} className="list-disc pl-5 space-y-1 text-slate-700">
              {lines.map((item, i) => (
                <li key={i}>{parseInline(item.replace(/^[-*]\s/, ''))}</li>
              ))}
            </ul>
          );
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={pIdx} className="border-l-4 border-indigo-400 pl-3 py-1 my-2 text-slate-600 bg-slate-50/70 rounded-r text-sm italic">
              {parseInline(trimmed.slice(2))}
            </blockquote>
          );
        }

        // Regular paragraph with potential soft newlines
        return (
          <p key={pIdx} className="text-slate-700">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {parseInline(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

function parseInline(text) {
  if (!text) return null;

  // Split by inline code `code`
  const codeParts = text.split(/(`[^`]+`)/);
  return codeParts.map((segment, cIdx) => {
    if (segment.startsWith('`') && segment.endsWith('`')) {
      const code = segment.slice(1, -1);
      return (
        <code key={cIdx} className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-[12.5px] border border-slate-200/80 mx-0.5 font-medium">
          {code}
        </code>
      );
    }

    // Bold **text**
    const boldParts = segment.split(/(\*\*[^*]+\*\*)/);
    return (
      <React.Fragment key={cIdx}>
        {boldParts.map((bSegment, bIdx) => {
          if (bSegment.startsWith('**') && bSegment.endsWith('**')) {
            const boldText = bSegment.slice(2, -2);
            return <strong key={bIdx} className="font-semibold text-slate-900">{boldText}</strong>;
          }
          
          // Math notation $...$
          const mathParts = bSegment.split(/(\$[^$]+\$)/);
          return (
            <React.Fragment key={bIdx}>
              {mathParts.map((mSegment, mIdx) => {
                if (mSegment.startsWith('$') && mSegment.endsWith('$')) {
                  const math = mSegment.slice(1, -1);
                  return <span key={mIdx} className="font-mono text-purple-700 bg-purple-50/60 px-1 py-0.2 rounded text-[13px]">{math}</span>;
                }
                return mSegment;
              })}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  });
}
