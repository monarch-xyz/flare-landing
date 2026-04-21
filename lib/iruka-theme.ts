import type { PrismTheme } from 'prism-react-renderer';

const sharedStyles: PrismTheme['styles'] = [
  {
    types: ['comment', 'prolog', 'doctype', 'cdata'],
    style: {
      color: '#8a7c73',
      fontStyle: 'italic',
    },
  },
  {
    types: ['punctuation'],
    style: {
      color: '#9d948b',
    },
  },
  {
    types: ['operator', 'number', 'boolean', 'constant', 'symbol'],
    style: {
      color: '#e7b85a',
    },
  },
  {
    types: ['property', 'attr-name'],
    style: {
      color: '#ea7a39',
    },
  },
  {
    types: ['string', 'char', 'attr-value'],
    style: {
      color: '#d7c6a4',
    },
  },
  {
    types: ['keyword', 'atrule'],
    style: {
      color: '#b86e47',
    },
  },
  {
    types: ['function', 'builtin', 'class-name', 'selector'],
    style: {
      color: '#aebc91',
    },
  },
  {
    types: ['tag', 'entity', 'deleted'],
    style: {
      color: '#d06a5b',
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
];

export const irukaTheme: PrismTheme = {
  plain: {
    color: '#4c3e34',
    backgroundColor: '#fbf7f2',
  },
  styles: sharedStyles,
};

export const irukaDarkTheme: PrismTheme = {
  plain: {
    color: '#f4eee8',
    backgroundColor: '#130f11',
  },
  styles: sharedStyles,
};
