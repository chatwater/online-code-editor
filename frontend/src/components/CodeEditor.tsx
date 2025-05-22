import { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const languages = [
  { id: 'cpp', name: 'C++' },
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'java', name: 'Java' },
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

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(defaultCode[language as keyof typeof defaultCode]);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const response = await axios.post('http://localhost:3001/run', {
        language: selectedLanguage,
        code,
        input,
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error: Failed to run code');
      console.error(error);
    }
    setIsRunning(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
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
        <button
          className="btn btn-primary"
          onClick={handleRunCode}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>

      <div className="flex gap-4">
        <div className="w-2/3 h-[600px] border rounded-lg overflow-hidden">
          <Editor
            height="100%"
            language={selectedLanguage}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </div>

        <div className="w-1/3 space-y-4">
          <div className="h-[280px] border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Input</h3>
            <textarea
              className="w-full h-[calc(100%-2rem)] p-2 border rounded"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input here..."
            />
          </div>

          <div className="h-[280px] border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Output</h3>
            <pre className="w-full h-[calc(100%-2rem)] p-2 bg-gray-100 rounded overflow-auto">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 