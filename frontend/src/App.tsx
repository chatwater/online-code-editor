import { useState } from 'react'
import CodeEditor from './components/CodeEditor'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-gray-900">Online Code Editor</h1>
        </div>
      </header>
      <main>
        <CodeEditor />
      </main>
    </div>
  )
}

export default App 