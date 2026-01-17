#!/usr/bin/env node

/**
 * 图标下载和转换脚本
 * 从 lucide.dev 下载 SVG 图标并转换为 PNG 格式
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色定义
const COLORS = {
  inactive: '#9CA3AF',  // 未选中状态（灰色）
  active: '#8B5CF6',     // 选中状态（紫色）
  white: '#FFFFFF'       // 白色
};

// 图标配置
const ICONS = [
  // TabBar 图标 (48x48)
  { name: 'briefcase', file: 'briefcase', type: 'tabbar', size: 48 },
  { name: 'briefcase-active', file: 'briefcase', type: 'tabbar', size: 48, color: COLORS.active },
  { name: 'calendar', file: 'calendar', type: 'tabbar', size: 48 },
  { name: 'calendar-active', file: 'calendar', type: 'tabbar', size: 48, color: COLORS.active },
  { name: 'book', file: 'book', type: 'tabbar', size: 48 },
  { name: 'book-active', file: 'book', type: 'tabbar', size: 48, color: COLORS.active },
  { name: 'user', file: 'user', type: 'tabbar', size: 48 },
  { name: 'user-active', file: 'user', type: 'tabbar', size: 48, color: COLORS.active },

  // 页面图标 (32x32)
  { name: 'search', file: 'search', type: 'page', size: 32 },
  { name: 'location', file: 'map-pin', type: 'page', size: 32 },
  { name: 'salary', file: 'circle-dollar-sign', type: 'page', size: 32 },
  { name: 'add-white', file: 'plus', type: 'page', size: 32, color: COLORS.white },
  { name: 'empty', file: 'inbox', type: 'page', size: 32 }
];

// 创建图标目录
const iconsDir = path.join(__dirname, '../miniprogram/assets/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

/**
 * 下载 SVG 文件
 */
async function downloadSVG(iconName, iconFile) {
  const url = `https://unpkg.com/lucide-static@0.321.0/icons/${iconFile}.svg`;
  const svgPath = path.join('/tmp', `${iconName}.svg`);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(svgPath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => resolve(svgPath));
        file.on('error', reject);
      } else {
        reject(new Error(`Failed to download ${url}`));
      }
    });
  });
}

/**
 * 修改 SVG 颜色
 */
function fixSVGColor(svgContent, color) {
  // 替换 currentColor 和 stroke 颜色
  return svgContent
    .replace(/currentColor/g, color)
    .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
    .replace(/fill="[^"]*"/g, (match) => {
      // 保持 fill="none" 不变
      if (match === 'fill="none"') return match;
      return `fill="${color}"`;
    });
}

/**
 * 转换 SVG 为 PNG
 */
async function convertToPNG(svgPath, pngPath, size) {
  // 检查是否安装了 sharp
  try {
    const sharp = require('sharp');
    const svg = fs.readFileSync(svgPath);
    await sharp(svg, { density: 300 })
      .resize(size, size)
      .png()
      .toFile(pngPath);
    return true;
  } catch (error) {
    // sharp 未安装，尝试使用 ImageMagick
    try {
      execSync(`convert -background none -density 300 -resize ${size}x${size} "${svgPath}" "${pngPath}"`);
      return true;
    } catch (error) {
      console.error('错误: 需要安装 sharp 或 ImageMagick');
      console.log('安装方法:');
      console.log('  npm install sharp  # 推荐');
      console.log('  brew install imagemagick  # macOS');
      return false;
    }
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('开始下载图标...\n');

  let successCount = 0;
  let failCount = 0;

  for (const icon of ICONS) {
    const { name, file, size, color } = icon;

    try {
      console.log(`下载: ${name}.png (${size}x${size})`);

      // 下载 SVG
      const svgPath = await downloadSVG(name, file);

      // 读取并修改颜色
      let svgContent = fs.readFileSync(svgPath, 'utf8');
      if (color) {
        svgContent = fixSVGColor(svgContent, color);
        fs.writeFileSync(svgPath, svgContent);
      }

      // 转换为 PNG
      const pngPath = path.join(iconsDir, `${name}.png`);
      const success = await convertToPNG(svgPath, pngPath, size);

      if (success) {
        console.log(`  ✓ 成功\n`);
        successCount++;
      } else {
        console.log(`  ✗ 失败 (需要安装转换工具)\n`);
        failCount++;
      }

      // 清理临时文件
      fs.unlinkSync(svgPath);
    } catch (error) {
      console.error(`  ✗ 错误: ${error.message}\n`);
      failCount++;
    }
  }

  console.log('\n下载完成!');
  console.log(`成功: ${successCount} 个`);
  console.log(`失败: ${failCount} 个`);
  console.log(`图标位置: ${iconsDir}`);

  if (failCount > 0) {
    console.log('\n提示: 如果转换失败，请安装 sharp 或 ImageMagick');
    console.log('npm install sharp');
  }
}

// 运行
main().catch(console.error);
