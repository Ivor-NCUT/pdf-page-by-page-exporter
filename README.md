# PDF to Image Converter | PDF逐页导出工具

上传一份 PDF 文件，将 PDF 文件的每一页导出为图片，可以自定义导出到哪个文件夹下方。

## 功能特点

- 🎨 现代化UI设计，黑色和绿色科技感主题
- 📁 简单的PDF文件选择
- 🖼️ 自定义输出文件夹选择
- ⚡ 高速PDF到图片转换
- 📱 响应式设计，适配各种屏幕尺寸
- 🔔 完成提醒和进度提示
- 💾 可打包为DMG文件进行分发

## 技术栈

- **前端**: HTML5, TailwindCSS, JavaScript
- **桌面应用**: Electron
- **PDF处理**: pdf-poppler
- **图片处理**: sharp
- **打包**: electron-builder

## 安装和运行

### 开发环境

1. 克隆项目：
```bash
git clone https://github.com/Ivor-NCUT/pdf-page-by-page-exporter.git
cd pdf-page-by-page-exporter
```

2. 安装依赖：
```bash
npm install
```

3. 启动应用：
```bash
npm start
```

### 打包应用

#### 打包为Mac应用：
```bash
npm run build:mac
```

#### 生成DMG文件：
```bash
npm run dist
```

## 使用说明

1. 点击"选择PDF文件"按钮选择要转换的PDF文档
2. 点击"选择输出文件夹"按钮选择图片保存位置
3. 点击"开始转换"按钮开始转换过程
4. 等待转换完成，查看结果提示

## 项目结构

```
pdf-page-by-page-exporter/
├── main-simple.js        # Electron主进程（简化版）
├── main.js              # Electron主进程（完整版）
├── preload.js           # 预加载脚本
├── index.html           # 主界面
├── renderer.js          # 渲染进程逻辑
├── styles.css           # 样式文件
├── assets/              # 资源文件
├── package.json         # 项目配置
└── README.md           # 项目说明
```

## 系统要求

- macOS 10.12 或更高版本
- Node.js 14.0 或更高版本
- 至少100MB可用磁盘空间

## 注意事项

- 需要安装Ghostscript才能正常使用pdf-poppler
- 建议在macOS环境下进行开发和打包
- 打包DMG文件需要macOS开发环境

## 开发

项目使用Electron构建，支持热重载和调试。在开发模式下可以打开开发者工具进行调试。

## 许可证

MIT License
