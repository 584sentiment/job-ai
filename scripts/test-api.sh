#!/bin/bash

# 求职追踪助手 - API 测试脚本
# 用于测试后端 API 功能

set -e

API_BASE="http://localhost:8080/api"

echo "🧪 求职追踪助手 - API 测试"
echo "========================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 测试后端服务
echo "1️⃣  测试后端服务..."
if curl -s "$API_BASE/positions/page" -X POST -H "Content-Type: application/json" -d '{"page":1,"pageSize":10}' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 后端服务正常运行${NC}"
else
    echo -e "${RED}❌ 后端服务未运行${NC}"
    echo "请先启动后端服务: cd backend && pnpm dev"
    exit 1
fi
echo ""

# 2. 注册测试用户
echo "2️⃣  注册测试用户..."
PHONE="13800138000"
PASSWORD="Test123456"
NICKNAME="测试用户"

REGISTER_RESPONSE=$(curl -s "$API_BASE/users/register" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"phone\": \"$PHONE\",
    \"password\": \"$PASSWORD\",
    \"nickname\": \"$NICKNAME\"
  }")

echo "注册响应: $REGISTER_RESPONSE"

# 检查是否注册成功
if echo "$REGISTER_RESPONSE" | grep -q '"code":200'; then
    echo -e "${GREEN}✅ 注册成功${NC}"
elif echo "$REGISTER_RESPONSE" | grep -q "已存在"; then
    echo -e "${YELLOW}⚠️  用户已存在，直接登录${NC}"
else
    echo -e "${RED}❌ 注册失败${NC}"
    echo "$REGISTER_RESPONSE"
fi
echo ""

# 3. 登录获取 token
echo "3️⃣  登录获取认证令牌..."
LOGIN_RESPONSE=$(curl -s "$API_BASE/users/login" \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"phone\": \"$PHONE\",
    \"password\": \"$PASSWORD\"
  }")

echo "登录响应: $LOGIN_RESPONSE"

# 提取 token
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ 登录失败，无法获取 token${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 登录成功${NC}"
echo "Token: ${TOKEN:0:20}..."
echo ""

# 4. 测试获取岗位列表
echo "4️⃣  测试获取岗位列表..."
JOBS_RESPONSE=$(curl -s "$API_BASE/positions/page" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "page": 1,
    "pageSize": 10
  }')

echo "岗位列表响应: $JOBS_RESPONSE"

if echo "$JOBS_RESPONSE" | grep -q '"code":200'; then
    echo -e "${GREEN}✅ 获取岗位列表成功${NC}"
else
    echo -e "${YELLOW}⚠️  响应: $JOBS_RESPONSE${NC}"
fi
echo ""

# 5. 测试创建岗位
echo "5️⃣  测试创建岗位..."
CREATE_RESPONSE=$(curl -s "$API_BASE/positions" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "companyName": "字节跳动",
    "positionName": "前端工程师",
    "deliveryChannel": "官网",
    "deliveryDate": '$(date +%s)000',
    "workLocation": "北京",
    "salaryRange": "20k-35k"
  }')

echo "创建岗位响应: $CREATE_RESPONSE"

if echo "$CREATE_RESPONSE" | grep -q '"code":200'; then
    echo -e "${GREEN}✅ 创建岗位成功${NC}"
else
    echo -e "${YELLOW}⚠️  响应: $CREATE_RESPONSE${NC}"
fi
echo ""

# 6. 获取用户信息
echo "6️⃣  获取用户信息..."
USER_RESPONSE=$(curl -s "$API_BASE/users/current" \
  -H "Authorization: Bearer $TOKEN")

echo "用户信息: $USER_RESPONSE"

if echo "$USER_RESPONSE" | grep -q '"code":200'; then
    echo -e "${GREEN}✅ 获取用户信息成功${NC}"
else
    echo -e "${YELLOW}⚠️  响应: $USER_RESPONSE${NC}"
fi
echo ""

echo "========================="
echo -e "${GREEN}✅ 测试完成！${NC}"
echo ""
echo "📋 测试账号信息:"
echo "  手机号: $PHONE"
echo "  密码: $PASSWORD"
echo "  Token: $TOKEN"
echo ""
echo "🔗 使用此账号登录前端:"
echo "  http://localhost:5173/login"
