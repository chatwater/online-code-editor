import express from 'express';
import cors from 'cors';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// 确保临时目录存在
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// 清理临时文件
const cleanupTempFiles = async (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
    // 对于 C++ 和 Java，还需要删除编译后的文件
    const execPath = filePath.replace(/\.[^.]+$/, '');
    if (fs.existsSync(execPath)) {
      await fs.promises.unlink(execPath);
    }
  } catch (error) {
    console.error('Error cleaning up files:', error);
  }
};

// 编译接口
app.post('/compile', async (req, res) => {
  const { language } = req.body;
  let { code } = req.body;  // 使用 let 声明，因为我们需要修改它
  const fileId = uuidv4();
  let filePath = '';
  let compileCommand = '';
  let success = false;
  let output = '';

  try {
    switch (language) {
      case 'cpp':
        filePath = path.join(tempDir, `${fileId}.cpp`);
        compileCommand = `g++ ${filePath} -o ${path.join(tempDir, fileId)}`;
        break;
      case 'java':
        // 生成有效的 Java 类名（只使用字母和数字）
        const className = `JavaClass${fileId.replace(/[^a-zA-Z0-9]/g, '')}`;
        // 修改 Java 代码，将类名改为有效的名称
        code = code.replace(/public\s+class\s+\w+/, `public class ${className}`);
        filePath = path.join(tempDir, `${className}.java`);
        compileCommand = `javac ${filePath}`;
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language for compilation' });
    }

    // 写入代码到文件
    await fs.promises.writeFile(filePath, code);

    // 执行编译命令
    const { stdout, stderr } = await execAsync(compileCommand);
    output = stdout || stderr;
    success = !stderr;

    res.json({ success, output });
  } catch (error: any) {
    output = error.stderr || error.message;
    success = false;
    res.json({ success, output });
  } finally {
    // 清理临时文件
    await cleanupTempFiles(filePath);
  }
});

// 运行接口
app.post('/run', async (req, res) => {
  const { language, code, input } = req.body;
  const fileId = uuidv4();
  let filePath = '';
  let runCommand = '';
  let output = '';

  try {
    switch (language) {
      case 'cpp':
        filePath = path.join(tempDir, `${fileId}.cpp`);
        await fs.promises.writeFile(filePath, code);
        await execAsync(`g++ ${filePath} -o ${path.join(tempDir, fileId)}`);
        runCommand = path.join(tempDir, fileId);
        break;
      case 'python':
        filePath = path.join(tempDir, `${fileId}.py`);
        await fs.promises.writeFile(filePath, code);
        runCommand = `python3 ${filePath}`;
        break;
      case 'javascript':
        filePath = path.join(tempDir, `${fileId}.js`);
        await fs.promises.writeFile(filePath, code);
        runCommand = `node ${filePath}`;
        break;
      case 'java':
        // 生成有效的 Java 类名（只使用字母和数字）
        const className = `JavaClass${fileId.replace(/[^a-zA-Z0-9]/g, '')}`;
        // 修改 Java 代码，将类名改为有效的名称
        const modifiedCode = code.replace(/public\s+class\s+\w+/, `public class ${className}`);
        filePath = path.join(tempDir, `${className}.java`);
        await fs.promises.writeFile(filePath, modifiedCode);
        await execAsync(`javac ${filePath}`);
        runCommand = `java -cp ${tempDir} ${className}`;
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    // 使用 spawn 来处理输入
    const [command, ...args] = runCommand.split(' ');
    const process = spawn(command, args);
    
    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // 如果有输入，写入到进程的标准输入
    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }

    // 等待进程结束
    await new Promise((resolve, reject) => {
      process.on('error', (err) => {
        reject(new Error(`Failed to start process: ${err.message}`));
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || `Process exited with code ${code}`));
        }
      });
    });

    output = stdout || stderr;
    res.json({ output });
  } catch (error: any) {
    console.error('Execution error:', error);
    output = error.message || 'Unknown error occurred';
    res.json({ output });
  } finally {
    // 清理临时文件
    await cleanupTempFiles(filePath);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 