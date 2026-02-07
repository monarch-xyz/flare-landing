'use client';

import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { RiFileCopyLine, RiCheckLine } from 'react-icons/ri';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'json', className, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('relative group', className)}>
      {/* Language badge and copy button */}
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        {language && (
          <span className="text-xs text-gray-400 opacity-60 hidden sm:inline">
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <RiCheckLine className="w-4 h-4 text-green-400" />
          ) : (
            <RiFileCopyLine className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
        {({ className: preClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(
              preClassName, 
              'overflow-x-auto custom-scrollbar text-xs sm:text-sm leading-relaxed !bg-[#011627] rounded-lg p-3 sm:p-4 pr-12'
            )}
            style={{ ...style, backgroundColor: undefined }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {showLineNumbers && (
                  <span className="inline-block w-6 sm:w-8 text-right mr-3 sm:mr-4 text-gray-500 select-none text-xs">
                    {i + 1}
                  </span>
                )}
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
