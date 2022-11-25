
// types/index.ts
export {};

declare global {
  interface Window {
    markdownit: any;
    markdownitEmoji: any;
    markdownitFootnote: any;
    MathJax: any;
    hljs: any;
  }
}