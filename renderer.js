class PDFConverterApp {
    constructor() {
        this.pdfPath = null;
        this.outputPath = null;
        this.isConverting = false;

        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.selectPdfBtn = document.getElementById('selectPdfBtn');
        this.selectFolderBtn = document.getElementById('selectFolderBtn');
        this.convertBtn = document.getElementById('convertBtn');
        this.clearPdfBtn = document.getElementById('clearPdfBtn');
        this.clearFolderBtn = document.getElementById('clearFolderBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');

        this.pdfFileInfo = document.getElementById('pdfFileInfo');
        this.folderInfo = document.getElementById('folderInfo');
        this.pdfFileName = document.getElementById('pdfFileName');
        this.folderPath = document.getElementById('folderPath');

        this.statusContainer = document.getElementById('statusContainer');
        this.statusText = document.getElementById('statusText');
        this.statusIcon = document.getElementById('statusIcon');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressBar = document.getElementById('progressBar');

        this.resultModal = document.getElementById('resultModal');
        this.resultIcon = document.getElementById('resultIcon');
        this.resultIconClass = document.getElementById('resultIconClass');
        this.resultTitle = document.getElementById('resultTitle');
        this.resultMessage = document.getElementById('resultMessage');
    }

    attachEventListeners() {
        this.selectPdfBtn.addEventListener('click', () => this.selectPdfFile());
        this.selectFolderBtn.addEventListener('click', () => this.selectOutputFolder());
        this.convertBtn.addEventListener('click', () => this.startConversion());
        this.clearPdfBtn.addEventListener('click', () => this.clearPdfFile());
        this.clearFolderBtn.addEventListener('click', () => this.clearOutputFolder());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());

        // Close modal on backdrop click
        this.resultModal.addEventListener('click', (e) => {
            if (e.target === this.resultModal) {
                this.closeModal();
            }
        });
    }

    async selectPdfFile() {
        try {
            this.updateStatus('正在选择PDF文件...', 'info');
            const selectedPath = await window.electronAPI.selectPdfFile();

            if (selectedPath) {
                this.pdfPath = selectedPath;
                this.pdfFileName.textContent = this.getFileName(selectedPath);
                this.pdfFileInfo.classList.remove('hidden');
                this.updateStatus('PDF文件已选择', 'success');
                this.updateConvertButton();
            } else {
                this.updateStatus('已取消选择', 'info');
            }
        } catch (error) {
            this.showError('选择PDF文件时出错', error.message);
        }
    }

    async selectOutputFolder() {
        try {
            this.updateStatus('正在选择输出文件夹...', 'info');
            const selectedPath = await window.electronAPI.selectOutputFolder();

            if (selectedPath) {
                this.outputPath = selectedPath;
                this.folderPath.textContent = selectedPath;
                this.folderInfo.classList.remove('hidden');
                this.updateStatus('输出文件夹已选择', 'success');
                this.updateConvertButton();
            } else {
                this.updateStatus('已取消选择', 'info');
            }
        } catch (error) {
            this.showError('选择输出文件夹时出错', error.message);
        }
    }

    clearPdfFile() {
        this.pdfPath = null;
        this.pdfFileInfo.classList.add('hidden');
        this.updateStatus('PDF文件已清除', 'info');
        this.updateConvertButton();
    }

    clearOutputFolder() {
        this.outputPath = null;
        this.folderInfo.classList.add('hidden');
        this.updateStatus('输出文件夹已清除', 'info');
        this.updateConvertButton();
    }

    updateConvertButton() {
        const canConvert = this.pdfPath && this.outputPath && !this.isConverting;

        if (canConvert) {
            this.convertBtn.disabled = false;
            this.convertBtn.className = 'bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25';
        } else {
            this.convertBtn.disabled = true;
            this.convertBtn.className = 'bg-gray-600 text-gray-400 font-medium py-4 px-8 rounded-xl text-lg transition-all duration-300 disabled:cursor-not-allowed';
        }
    }

    async startConversion() {
        if (!this.pdfPath || !this.outputPath || this.isConverting) {
            return;
        }

        this.isConverting = true;
        this.updateConvertButton();
        this.showProgress();
        this.updateStatus('正在转换PDF文件...', 'info');

        try {
            const result = await window.electronAPI.convertPdfToImages(this.pdfPath, this.outputPath);

            if (result.success) {
                this.hideProgress();
                this.updateStatus('转换完成！', 'success');
                this.showResult(true, '转换成功', result.message);
            } else {
                this.hideProgress();
                this.updateStatus('转换失败', 'error');
                this.showResult(false, '转换失败', result.message);
            }
        } catch (error) {
            this.hideProgress();
            this.updateStatus('转换出错', 'error');
            this.showResult(false, '转换出错', error.message);
        } finally {
            this.isConverting = false;
            this.updateConvertButton();
        }
    }

    updateStatus(message, type = 'info') {
        this.statusText.textContent = message;
        this.statusContainer.classList.remove('hidden');

        // Update icon and color based on type
        this.statusContainer.className = 'mb-6 fade-in';
        const statusCard = this.statusContainer.querySelector('div');
        statusCard.className = 'bg-gray-800 rounded-xl p-4 border-l-4';

        switch (type) {
            case 'success':
                statusCard.classList.add('status-success');
                this.statusIcon.className = 'fas fa-check-circle text-green-400 mr-3';
                break;
            case 'error':
                statusCard.classList.add('status-error');
                this.statusIcon.className = 'fas fa-exclamation-circle text-red-400 mr-3';
                break;
            case 'info':
            default:
                statusCard.classList.add('status-info');
                this.statusIcon.className = 'fas fa-info-circle text-blue-400 mr-3';
                break;
        }
    }

    showProgress() {
        this.progressContainer.classList.remove('hidden');
        this.progressBar.style.width = '0%';

        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 90) {
                progress = 90;
                clearInterval(interval);
            }
            this.progressBar.style.width = `${progress}%`;
        }, 500);
    }

    hideProgress() {
        this.progressContainer.classList.add('hidden');
        this.progressBar.style.width = '100%';
    }

    showResult(success, title, message) {
        this.resultTitle.textContent = title;
        this.resultMessage.textContent = message;

        if (success) {
            this.resultIcon.className = 'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-500';
            this.resultIconClass.className = 'fas fa-check text-white text-3xl';
        } else {
            this.resultIcon.className = 'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-500';
            this.resultIconClass.className = 'fas fa-times text-white text-3xl';
        }

        this.resultModal.classList.remove('hidden');
        this.resultModal.classList.add('flex', 'modal-backdrop');
    }

    closeModal() {
        this.resultModal.classList.add('hidden');
        this.resultModal.classList.remove('flex', 'modal-backdrop');
    }

    showError(title, message) {
        this.updateStatus(message, 'error');
        this.showResult(false, title, message);
    }

    getFileName(path) {
        return path.split('/').pop().split('\\').pop();
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PDFConverterApp();
});