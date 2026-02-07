'use client';

import { Highlight, themes } from 'prism-react-renderer';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'json', className, showLineNumbers = false }: CodeBlockProps) {
  return (
    <div className={cn('relative group', className)}>
      {language && (
        <span className="absolute top-2 right-3 text-xs text-secondary opacity-60 z-10">
          {language}
        </span>
      )}
      <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
        {({ className: preClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(preClassName, 'overflow-x-auto custom-scrollbar text-sm leading-relaxed !bg-[#011627] rounded-lg p-4')}
            style={{ ...style, backgroundColor: undefined }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {showLineNumbers && (
                  <span className="inline-block w-8 text-right mr-4 text-gray-500 select-none">
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
