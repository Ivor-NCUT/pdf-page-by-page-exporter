// 简单的应用测试脚本
const fs = require('fs');
const path = require('path');

console.log('PDF to Image Converter - 应用检查');
console.log('==================================');

// 检查必要文件
const requiredFiles = [
    'main-simple.js',
    'preload.js',
    'index.html',
    'renderer.js',
    'styles.css',
    'package.json'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - 缺失`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ 部分文件缺失，请检查项目完整性');
    process.exit(1);
}

// 检查package.json
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('\n📦 项目信息:');
    console.log(`   名称: ${packageJson.name}`);
    console.log(`   版本: ${packageJson.version}`);
    console.log(`   描述: ${packageJson.description}`);
    console.log(`   主文件: ${packageJson.main}`);
} catch (error) {
    console.log('\n❌ package.json 解析失败');
    process.exit(1);
}

// 检查是否有Electron
try {
    const electronPath = path.join('node_modules', 'electron', 'package.json');
    if (fs.existsSync(electronPath)) {
        const electronPackage = JSON.parse(fs.readFileSync(electronPath, 'utf8'));
        console.log(`\n⚡ Electron版本: ${electronPackage.version}`);
        console.log('\n✅ 应用检查完成，可以运行:');
        console.log('   npm start');
    } else {
        console.log('\n⚠️  Electron未安装，请运行:');
        console.log('   npm install');
    }
} catch (error) {
    console.log('\n⚠️  无法检查Electron版本');
}

console.log('\n🔧 运行环境检查:');
try {
    const { execSync } = require('child_process');
    console.log(`   Node.js: ${execSync('node --version').toString().trim()}`);
    console.log(`   npm: ${execSync('npm --version').toString().trim()}`);

    // 检查Ghostscript
    try {
        execSync('gs --version');
        console.log(`   Ghostscript: ${execSync('gs --version').toString().trim()}`);
    } catch (error) {
        console.log('   Ghostscript: 未安装 (需要安装: brew install ghostscript)');
    }
} catch (error) {
    console.log('   无法获取运行环境信息');
}