const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    show: false,
    backgroundColor: '#0a0a0a'
  });

  mainWindow.loadFile('index.html');
  mainWindow.once('ready-to-show', () => mainWindow.show());

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('select-pdf-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    title: '选择PDF文件'
  });

  if (canceled) return null;
  return filePaths[0];
});

ipcMain.handle('select-output-folder', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: '选择输出文件夹'
  });

  if (canceled) return null;
  return filePaths[0];
});

ipcMain.handle('convert-pdf-to-images', async (event, pdfPath, outputPath) => {
  try {
    // 检查是否安装了ghostscript
    try {
      await execAsync('gs --version');
    } catch (error) {
      throw new Error('未找到Ghostscript，请先安装：brew install ghostscript');
    }

    const baseName = path.basename(pdfPath, '.pdf');
    const outputPattern = path.join(outputPath, `${baseName}_%d.png`);

    // 使用ghostscript转换PDF到PNG
    const command = `gs -dNOPAUSE -dBATCH -sDEVICE=pngalpha -r300 -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -sOutputFile="${outputPattern}" "${pdfPath}"`;

    await execAsync(command);

    // 获取生成的文件列表
    const files = await fs.readdir(outputPath);
    const convertedFiles = files
      .filter(file => file.startsWith(baseName + '_') && file.endsWith('.png'))
      .map(file => path.join(outputPath, file))
      .sort();

    return {
      success: true,
      files: convertedFiles,
      message: `成功转换 ${convertedFiles.length} 页图片`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: '转换失败: ' + error.message
    };
  }
});