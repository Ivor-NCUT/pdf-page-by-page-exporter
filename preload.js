const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectPdfFile: () => ipcRenderer.invoke('select-pdf-file'),
  selectOutputFolder: () => ipcRenderer.invoke('select-output-folder'),
  convertPdfToImages: (pdfPath, outputPath) => ipcRenderer.invoke('convert-pdf-to-images', pdfPath, outputPath)
});