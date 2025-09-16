const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

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

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

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

  if (canceled) {
    return null;
  }
  return filePaths[0];
});

ipcMain.handle('select-output-folder', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: '选择输出文件夹'
  });

  if (canceled) {
    return null;
  }
  return filePaths[0];
});

ipcMain.handle('convert-pdf-to-images', async (event, pdfPath, outputPath) => {
  try {
    const pdf = require('pdf-poppler');
    const sharp = require('sharp');

    const opts = {
      format: 'png',
      out_dir: outputPath,
      out_prefix: 'page',
      page: null
    };

    const results = await pdf.convert(pdfPath, opts);

    const convertedFiles = [];
    for (let i = 0; i < results.length; i++) {
      const inputFile = results[i];
      const outputFile = path.join(outputPath, `page_${i + 1}.png`);

      await sharp(inputFile.path)
        .png({ quality: 100 })
        .toFile(outputFile);

      await fs.unlink(inputFile.path);

      convertedFiles.push(outputFile);
    }

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