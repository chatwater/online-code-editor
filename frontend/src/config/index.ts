import type { editor } from 'monaco-editor';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const EDITOR_THEMES = {
  'leetcode-dark': 'LeetCode Dark',
  'leetcode-light': 'LeetCode Light',
  'vs': 'Light',
  'vs-dark': 'Dark',
  'hc-black': 'High Contrast',
} as const;

export type EditorTheme = keyof typeof EDITOR_THEMES;

// LeetCode 主题配置
export const leetcodeDarkTheme = {
  base: 'vs-dark' as editor.BuiltinTheme,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955' },
    { token: 'keyword', foreground: 'C586C0' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'type', foreground: '4EC9B0' },
    { token: 'function', foreground: 'DCDCAA' },
    { token: 'variable', foreground: '9CDCFE' },
  ],
  colors: {
    'editor.background': '#1A1A1A',
    'editor.foreground': '#D4D4D4',
    'editor.lineHighlightBackground': '#2A2A2A',
    'editor.selectionBackground': '#264F78',
  },
};

export const leetcodeLightTheme = {
  base: 'vs' as editor.BuiltinTheme,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '008000' },
    { token: 'keyword', foreground: '0000FF' },
    { token: 'string', foreground: 'A31515' },
    { token: 'number', foreground: '098658' },
    { token: 'type', foreground: '267F99' },
    { token: 'function', foreground: '795E26' },
    { token: 'variable', foreground: '001080' },
  ],
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#000000',
    'editor.lineHighlightBackground': '#F5F5F5',
    'editor.selectionBackground': '#ADD6FF',
  },
}; 