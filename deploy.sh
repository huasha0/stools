#!/usr/bin/env bash
# 一键发布到 https://stools.surge.sh
# 用法：bash deploy.sh
# 原理：把要上线的文件挑到 .dist（排除 .workbuddy、CNAME 等），再推给 surge。
set -e

cd "$(dirname "$0")"

DOMAIN="stools.surge.sh"

rm -rf .dist
mkdir -p .dist/assets
cp *.html .dist/          # 首页 + 所有工具页，新增页面自动包含
cp assets/*.js assets/*.css .dist/assets/

surge ./.dist "$DOMAIN"
