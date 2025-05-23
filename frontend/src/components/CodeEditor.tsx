import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';
import axios from 'axios';
import { API_BASE_URL, EDITOR_THEMES, type EditorTheme, leetcodeDarkTheme, leetcodeLightTheme } from '../config';
import { 
  ArrowsPointingOutIcon, 
  ArrowsPointingInIcon, 
  DocumentDuplicateIcon,
  PlayIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

const languages = [
  { id: 'cpp', name: 'C++', needsCompile: true },
  { id: 'python', name: 'Python', needsCompile: false },
  { id: 'javascript', name: 'JavaScript', needsCompile: false },
  { id: 'java', name: 'Java', needsCompile: true },
];

const defaultCode = {
  cpp: '// Write your C++ code here\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++!" << std::endl;\n    return 0;\n}',
  python: '# Write your Python code here\nprint("Hello, Python!")',
  javascript: '// Write your JavaScript code here\nconsole.log("Hello, Javascript!");',
  java: '// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}',
};

export default function CodeEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [code, setCode] = useState(defaultCode.cpp);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<EditorTheme>('leetcode-dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLPreElement>(null);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(defaultCode[language as keyof typeof defaultCode]);
  };

  const handleCompile = async () => {
    const currentLang = languages.find(lang => lang.id === selectedLanguage);
    if (!currentLang?.needsCompile) {
      handleRunCode();
      return;
    }

    setIsCompiling(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/compile`, {
        language: selectedLanguage,
        code,
      });
      if (response.data.success) {
        setOutput('Compilation successful!\n' + response.data.output);
      } else {
        setOutput('Compilation failed:\n' + response.data.output);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to compile code';
      setOutput(`Error: ${errorMessage}`);
      console.error(error);
    }
    setIsCompiling(false);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/run`, {
        language: selectedLanguage,
        code,
        input,
      });
      setOutput(response.data.output);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to run code';
      setOutput(`Error: ${errorMessage}`);
      console.error(error);
    }
    setIsRunning(false);
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // 注册 LeetCode 主题
    monaco.editor.defineTheme('leetcode-dark', leetcodeDarkTheme);
    monaco.editor.defineTheme('leetcode-light', leetcodeLightTheme);
    
    // 设置初始主题
    monaco.editor.setTheme('leetcode-dark');
  };

  // 监听主题变化
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(selectedTheme);
    }
  }, [selectedTheme]);

  const handleThemeChange = (theme: EditorTheme) => {
    setSelectedTheme(theme);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 2000);
  };

  const IconButton = ({ 
    icon: Icon, 
    onClick, 
    tooltip, 
    className = '' 
  }: { 
    icon: any; 
    onClick: () => void; 
    tooltip: string; 
    className?: string;
  }) => (
    <button
      className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
      onClick={onClick}
      title={tooltip}
    >
      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </button>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedTheme}
            onChange={(e) => handleThemeChange(e.target.value as EditorTheme)}
          >
            {Object.entries(EDITOR_THEMES).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-ghost flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleCompile}
            disabled={isCompiling || isRunning}
          >
            <CodeBracketIcon className="w-5 h-5" />
            {isCompiling ? 'Compiling...' : 'Compile'}
          </button>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={handleRunCode}
            disabled={isRunning || isCompiling}
          >
            <PlayIcon className="w-5 h-5" />
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      <div className={`flex gap-4 ${isFullscreen ? 'fixed inset-0 z-50 dark:bg-gray-900' : ''}`}>
        <div className={`${isFullscreen ? 'w-full h-screen' : 'w-2/3 h-[600px]'} border rounded-lg overflow-hidden relative`}>
          <div className="absolute top-2 right-2 z-10 flex gap-2 dark:bg-gray-900 rounded-lg">
            <IconButton
              icon={isFullscreen ? ArrowsPointingInIcon : ArrowsPointingOutIcon}
              onClick={toggleFullscreen}
              tooltip={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            />
            <IconButton
              icon={DocumentDuplicateIcon}
              onClick={() => copyToClipboard(code, 'code')}
              tooltip="Copy Code"
            />
          </div>
          <Editor
            height="100%"
            language={selectedLanguage}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme={selectedTheme}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        <div className={`${isFullscreen ? 'hidden' : 'w-1/3'} space-y-4`}>
          <div className="h-[280px] border rounded-lg p-4 relative">
            <h3 className="text-lg font-semibold mb-2">Input</h3>
            <textarea
              ref={inputRef}
              className="w-full h-[calc(100%-2rem)] p-2 border rounded dark:bg-gray-800 dark:text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input here..."
            />
            <div className="absolute top-2 right-2">
              <IconButton
                icon={DocumentDuplicateIcon}
                onClick={() => copyToClipboard(input, 'input')}
                tooltip="Copy Input"
              />
            </div>
          </div>

          <div className="h-[280px] border rounded-lg p-4 relative">
            <h3 className="text-lg font-semibold mb-2">Output</h3>
            <pre
              ref={outputRef}
              className="w-full h-[calc(100%-2rem)] p-2 bg-gray-100 dark:bg-gray-800 dark:text-white rounded overflow-auto"
            >
              {output}
            </pre>
            <div className="absolute top-2 right-2">
              <IconButton
                icon={DocumentDuplicateIcon}
                onClick={() => copyToClipboard(output, 'output')}
                tooltip="Copy Output"
              />
            </div>
          </div>
        </div>
      </div>

      {showCopyTooltip && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
} 