#!/bin/bash

# Vercel 引用清理脚本
# 从文档中移除所有 Vercel 相关的引用和说明

echo "🔧 清理文档中的 Vercel 引用..."
echo ""

# 定义需要处理的文件列表
files=(
  "./CLAUDE.md"
  "./docs/ROOT_DIRECTORY_STANDARDS.md"
  "./docs/arch-design.md"
  "./backend/README.md"
  "./backend/DEVELOPMENT.md"
  "./backend/IMPLEMENTATION_SUMMARY.md"
)

# 处理每个文件
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "处理: $file"

    # 创建临时文件
    temp_file=$(mktemp)

    # 使用 sed 删除包含 vercel 的行（不区分大小写）
    # 但保留包含 "VERCEL_CLEANUP" 的行
    sed '/vercel/Id; /VERCEL_CLEANUP/!d' "$file" > "$temp_file" 2>/dev/null

    # 检查临时文件是否为空
    if [ -s "$temp_file" ]; then
      # 备份原文件
      cp "$file" "${file}.backup"
      # 替换原文件
      mv "$temp_file" "$file"
      echo "  ✓ 已更新"
    else
      # 临时文件为空，说明所有行都被删除了，恢复原文件
      rm "$temp_file"
      echo "  ⚠ 跳过（会导致文件为空）"
    fi
  else
    echo "⚠ 文件不存在: $file"
  fi
done

echo ""
echo "✅ 清理完成！"
echo ""
echo "备份文件位于原位置，后缀为 .backup"
