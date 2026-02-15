/**
 * Custom Sentinel syntax highlighting theme
 * Designed to match Sentinel's orange/ember brand colors while maintaining readability
 */
import type { PrismTheme } from 'prism-react-renderer';

export const sentinelTheme: PrismTheme = {
  plain: {
    color: '#e6e6e6',
    backgroundColor: '#0d1117',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#6e7681',
        fontStyle: 'italic',
      },
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.8,
      },
    },
    {
      types: ['string', 'attr-value'],
      style: {
        color: '#a5d6ff', // Light blue for strings - easy on eyes
      },
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: '#8b949e',
      },
    },
    {
      types: ['entity', 'url', 'symbol', 'number', 'boolean', 'variable', 'constant', 'regex', 'inserted'],
      style: {
        color: '#ff9f1c', // Ember yellow - Sentinel accent
      },
    },
    {
      types: ['property'],
      style: {
        color: '#ff6b35', // Sentinel orange for JSON keys
      },
    },
    {
      types: ['atrule', 'attr-name', 'keyword'],
      style: {
        color: '#ff7b72', // Soft coral for keywords
      },
    },
    {
      types: ['function', 'deleted', 'tag'],
      style: {
        color: '#d2a8ff', // Purple for functions
      },
    },
    {
      types: ['selector', 'class-name'],
      style: {
        color: '#7ee787', // Green for classes
      },
    },
    {
      types: ['builtin', 'char'],
      style: {
        color: '#79c0ff',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold',
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic',
      },
    },
  ],
};

// Dark variant with more contrast
export const sentinelDarkTheme: PrismTheme = {
  plain: {
    color: '#e6edf3',
    backgroundColor: '#0d1117',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#6e7681',
        fontStyle: 'italic',
      },
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.8,
      },
    },
    {
      types: ['string', 'attr-value'],
      style: {
        color: '#a5d6ff',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: '#8b949e',
      },
    },
    {
      types: ['operator'],
      style: {
        color: '#ff9f1c', // Ember for operators
      },
    },
    {
      types: ['entity', 'url', 'symbol', 'number', 'boolean', 'variable', 'constant', 'regex', 'inserted'],
      style: {
        color: '#ff9f1c',
      },
    },
    {
      types: ['property'],
      style: {
        color: '#ff6b35', // Sentinel primary for properties
        fontWeight: '500',
      },
    },
    {
      types: ['atrule', 'attr-name', 'keyword'],
      style: {
        color: '#ff7b72',
      },
    },
    {
      types: ['function', 'deleted', 'tag'],
      style: {
        color: '#d2a8ff',
      },
    },
    {
      types: ['selector', 'class-name'],
      style: {
        color: '#7ee787',
      },
    },
    {
      types: ['builtin', 'char'],
      style: {
        color: '#79c0ff',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold',
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic',
      },
    },
  ],
};
