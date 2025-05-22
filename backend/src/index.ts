import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// 使用绝对路径创建临时目录
const tempDir = join(process.cwd(), 'temp');
mkdir(tempDir, { recursive: true }).catch(console.error);

const executeCode = async (language: string, code: string, input: string): Promise<string> => {
  const fileName = uuidv4();
  let filePath = '';
  let command = '';
  let className = '';

  switch (language) {
    case 'python':
      filePath = join(tempDir, `${fileName}.py`);
      command = `python3 ${filePath}`;
      break;
    case 'javascript':
      filePath = join(tempDir, `${fileName}.js`);
      command = `node ${filePath}`;
      break;
    case 'java':
      // 使用有效的类名（以字母开头，只包含字母和数字）
      const uuidPart = fileName.replace(/[^a-zA-Z0-9]/g, '');
      className = `JavaClass${uuidPart}`;
      // 使用类名作为文件名
      filePath = join(tempDir, `${className}.java`);
      // 修改 Java 代码，将类名改为有效的名称
      const modifiedCode = code.replace(/public\s+class\s+\w+/, `public class ${className}`);
      command = `javac ${filePath} && java -cp ${tempDir} ${className}`;
      code = modifiedCode;
      break;
    case 'cpp':
      filePath = join(tempDir, `${fileName}.cpp`);
      command = `g++ ${filePath} -o ${join(tempDir, fileName)} && ${join(tempDir, fileName)}`;
      break;
    default:
      throw new Error('Unsupported language');
  }

  try {
    await writeFile(filePath, code);
    return new Promise((resolve, reject) => {
      const process = exec(command, (error, stdout, stderr) => {
        // 先清理文件
        cleanupFiles(language, filePath, className).catch(console.error);
        
        if (error) {
          reject(error.message);
        } else {
          resolve(stdout || stderr);
        }
      });

      if (input) {
        process.stdin?.write(input);
        process.stdin?.end();
      }
    });
  } catch (error) {
    // 确保在出错时也清理文件
    await cleanupFiles(language, filePath, className).catch(console.error);
    throw error;
  }
};

const cleanupFiles = async (language: string, filePath: string, className?: string) => {
  try {
    await unlink(filePath);
    
    if (language === 'java') {
      await unlink(join(tempDir, `${className}.class`));
    } else if (language === 'cpp') {
      const fileName = filePath.split('/').pop()?.replace('.cpp', '');
      if (fileName) {
        await unlink(join(tempDir, fileName));
      }
    }
  } catch (error) {
    console.error('Error cleaning up files:', error);
  }
};

const getFileExtension = (language: string): string => {
  switch (language) {
    case 'python': return 'py';
    case 'javascript': return 'js';
    case 'java': return 'java';
    case 'cpp': return 'cpp';
    default: throw new Error('Unsupported language');
  }
};

app.post('/run', async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }

  try {
    const output = await executeCode(language, code, input || '');
    res.json({ output });
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 