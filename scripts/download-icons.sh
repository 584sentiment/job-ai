#!/bin/bash

# 图标下载和转换脚本
# 从 lucide.dev 下载 SVG 图标并转换为 PNG

set -e

# 颜色定义
COLOR_INACTIVE="#9CA3AF"  # 未选中状态（灰色）
COLOR_ACTIVE="#8B5CF6"     # 选中状态（紫色）
COLOR_WHITE="#FFFFFF"       # 白色

# 图标列表
ICONS=(
  "briefcase:briefcase:TabBar/岗位"
  "calendar:calendar:TabBar/面试"
  "book:book:TabBar/面经"
  "user:user:TabBar/我的"
  "search:search:页面/搜索"
  "map-pin:location:页面/位置"
  "circle-dollar-sign:salary:页面/薪资"
  "plus:add-white:页面/添加按钮"
  "inbox:empty:页面/空状态"
)

# 创建图标目录
ICONS_DIR="miniprogram/assets/icons"
mkdir -p "$ICONS_DIR"

# 下载 SVG 图标
download_svg() {
  local icon_name=$1
  local icon_file=$2
  local color=$3
  local size=$4

  # 从 unpkg CDN 获取 lucide 图标的 SVG
  local url="https://unpkg.com/lucide-static@0.321.0/icons/${icon_file}.svg"

  echo "下载 $icon_name 图标..."
  curl -s "$url" -o /tmp/${icon_name}.svg

  # 使用 sed 修改颜色
  sed -i '' "s/currentColor/${color}/g" /tmp/${icon_name}.svg

  # 转换为 PNG
  if command -v convert &> /dev/null; then
    convert -background none -size ${size}x${size} /tmp/${icon_name}.svg "$ICONS_DIR/${icon_name}.png"
  else
    echo "警告: ImageMagick 未安装，跳过 PNG 转换"
    echo "请安装 ImageMagick: brew install imagemagick"
    cp /tmp/${icon_name}.svg "$ICONS_DIR/${icon_name}.svg"
  fi

  rm /tmp/${icon_name}.svg
}

# 下载 TabBar 图标（48x48）
echo "开始下载 TabBar 图标..."
for icon_info in "${ICONS[@]}"; do
  IFS=':' read -r icon_file icon_name category description <<< "$icon_info"

  if [[ "$category" == "TabBar" ]]; then
    # 未选中状态
    download_svg "${icon_name}" "$icon_file" "$COLOR_INACTIVE" "48"

    # 选中状态
    download_svg "${icon_name}-active" "$icon_file" "$COLOR_ACTIVE" "48"
  fi
done

# 下载页面图标（32x32）
echo "开始下载页面图标..."
for icon_info in "${ICONS[@]}"; do
  IFS=':' read -r icon_file icon_name category description <<< "$icon_info"

  if [[ "$category" == "页面" ]]; then
    if [[ "$icon_name" == "add-white" ]]; then
      download_svg "$icon_name" "$icon_file" "$COLOR_WHITE" "32"
    else
      download_svg "$icon_name" "$icon_file" "$COLOR_INACTIVE" "32"
    fi
  fi
done

echo "✓ 图标下载完成！"
echo "图标位置: $ICONS_DIR"
