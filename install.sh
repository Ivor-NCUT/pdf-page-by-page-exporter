#!/bin/bash

# PDF to Image Converter Installation Script

echo "PDF to Image Converter - 安装脚本"
echo "=================================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 请先安装Node.js"
    echo "访问 https://nodejs.org/ 下载安装"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "错误: 请先安装npm"
    exit 1
fi

echo "Node.js版本: $(node --version)"
echo "npm版本: $(npm --version)"

# 安装依赖
echo "正在安装依赖包..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功"
    echo ""
    echo "使用方法："
    echo "  开发模式: npm start"
    echo "  打包Mac应用: npm run build:mac"
    echo "  生成DMG文件: npm run dist"
    echo ""
    echo "注意：打包DMG文件需要macOS开发环境"
else
    echo "❌ 依赖安装失败"
    echo "请检查网络连接或手动安装依赖"
    exit 1
fi