'use client';

import { useState, useMemo } from 'react';
import { Highlight } from 'prism-react-renderer';
import { RiFileCopyLine, RiCheckLine, RiCodeSSlashLine, RiFileTextLine, RiTerminalLine } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import { flareDarkTheme } from '@/lib/flare-theme';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
  showHeader?: boolean;
  filename?: string;
  highlightLines?: number[];
}

const languageIcons: Record<string, React.ElementType> = {
  json: RiCodeSSlashLine,
  javascript: RiCodeSSlashLine,
  typescript: RiCodeSSlashLine,
  bash: RiTerminalLine,
  shell: RiTerminalLine,
  markdown: RiFileTextLine,
  md: RiFileTextLine,
};

const languageLabels: Record<string, string> = {
  json: 'JSON',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  bash: 'Shell',
  shell: 'Shell',
  markdown: 'Markdown',
  md: 'Markdown',
};

export function CodeBlock({ 
  code, 
  language = 'json', 
  className, 
  showLineNumbers = false,
  showHeader = true,
  filename,
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const Icon = languageIcons[language] || RiCodeSSlashLine;
  const label = languageLabels[language] || language.toUpperCase();

  const lineCount = useMemo(() => code.trim().split('\n').length, [code]);
  const gutterWidth = useMemo(() => 
    lineCount >= 100 ? 'w-10' : lineCount >= 10 ? 'w-8' : 'w-6', 
    [lineCount]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('relative group rounded-lg overflow-hidden', className)}>
      {/* Subtle glow effect on hover */}
      <div 
        className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6b35]/0 via-[#ff6b35]/10 to-[#ff9f1c]/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"
        aria-hidden="true"
      />
      
      <div className="relative bg-[#0d1117] rounded-lg overflow-hidden border border-[#30363d] group-hover:border-[#ff6b35]/30 transition-colors duration-300">
        {/* Header bar */}
        {showHeader && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d]">
            <div className="flex items-center gap-2">
              {/* macOS window buttons */}
              <div className="flex gap-1.5 mr-3">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-colors" />
              </div>
              
              {/* Filename or language */}
              <div className="flex items-center gap-1.5 text-[#8b949e]">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-mono">
                  {filename || label}
                </span>
              </div>
            </div>
            
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all',
                copied 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-[#30363d]/50 text-[#8b949e] hover:bg-[#ff6b35]/20 hover:text-[#ff6b35]'
              )}
              aria-label={copied ? 'Copied!' : 'Copy code'}
            >
              {copied ? (
                <>
                  <RiCheckLine className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <RiFileCopyLine className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Code content */}
        <Highlight theme={flareDarkTheme} code={code.trim()} language={language}>
          {({ className: preClassName, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={cn(
                preClassName,
                'overflow-x-auto custom-scrollbar text-[13px] sm:text-sm leading-relaxed',
                showHeader ? 'p-4' : 'p-4 pr-12'
              )}
              style={{ ...style, backgroundColor: 'transparent', margin: 0 }}
            >
              <code className="block min-w-fit">
                {tokens.map((line, i) => {
                  const lineNumber = i + 1;
                  const isHighlighted = highlightLines.includes(lineNumber);
                  
                  return (
                    <div 
                      key={i} 
                      {...getLineProps({ line })}
                      className={cn(
                        'relative',
                        isHighlighted && 'bg-[#ff6b35]/10 -mx-4 px-4 border-l-2 border-[#ff6b35]'
                      )}
                    >
                      {showLineNumbers && (
                        <span 
                          className={cn(
                            'inline-block text-right mr-4 text-[#484f58] select-none text-xs tabular-nums',
                            gutterWidth,
                            isHighlighted && 'text-[#ff6b35]'
                          )}
                        >
                          {lineNumber}
                        </span>
                      )}
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  );
                })}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
