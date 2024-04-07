import { type SupportedTextSplitterLanguage } from 'langchain/text_splitter';

export const FILE_EXTENSIONS_LANGUAGE_MAP: Record<
  string,
  SupportedTextSplitterLanguage
> = {
  ts: 'js',
  js: 'js',
  tsx: 'js',
  jsx: 'js',
  cpp: 'cpp',
  go: 'go',
  java: 'java',
  php: 'php',
  proto: 'proto',
  py: 'python',
  rst: 'rst',
  rb: 'ruby',
  rs: 'rust',
  scala: 'scala',
  swift: 'swift',
  md: 'markdown',
  tex: 'latex',
  html: 'html',
  sol: 'sol',
};
