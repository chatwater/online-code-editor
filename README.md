# Online Code Editor

An online code editor supporting multiple programming languages, similar to LeetCode's programming environment. Built with React + TypeScript + Vite for the frontend and Node.js + Express for the backend.

## Features

- Multiple Programming Languages Support:
  - Python
  - JavaScript
  - Java
  - C++
- Real-time Code Editing
- Code Execution
- Input/Output Support
- Responsive Design
- Syntax Highlighting
- Theme Switching (Light/Dark)
- Fullscreen Mode
- Code Compilation
- Copy to Clipboard
- Environment Configuration

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Monaco Editor (VS Code's editor)
- Tailwind CSS
- DaisyUI
- Axios
- Heroicons

### Backend
- Node.js
- Express
- TypeScript
- UUID

## Project Structure

```
online-code-editor/
├── frontend/           # Frontend project
│   ├── src/           # Source code
│   │   ├── components/  # React components
│   │   └── config/     # Configuration files
│   ├── public/        # Static assets
│   └── ...           # Config files
└── backend/           # Backend project
    ├── src/          # Source code
    └── ...          # Config files
```

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at http://localhost:3000

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend will run at http://localhost:3001

## Environment Configuration

The project uses environment variables for configuration:

- `.env.development` - Development environment settings
- `.env.production` - Production environment settings

## Development Requirements

- Node.js >= 18
- npm >= 9
- Python 3.x (for running Python code)
- Java JDK (for running Java code)
- G++ (for running C++ code)

## Version History

### v2.0
- Added code compilation feature
- Added theme switching
- Added fullscreen mode
- Added copy to clipboard functionality
- Improved error handling
- Added environment configuration

### v1.0
- Basic code editor functionality
- Multiple language support
- Input/Output handling
- Syntax highlighting

## Author

- chatwater
- Cursor

## License

MIT 