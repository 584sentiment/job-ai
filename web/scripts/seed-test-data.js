#!/usr/bin/env node

/**
 * 测试数据生成脚本
 *
 * 功能：
 * 1. 生成 10 条测试岗位数据
 * 2. 调用后端 API 批量插入数据
 * 3. 显示操作结果和统计信息
 *
 * 使用方式：
 *   node scripts/seed-test-data.js
 *   或
 *   npm run seed-data
 *
 * 环境变量（可选）：
 *   API_BASE_URL - API 基础地址（默认：http://localhost:8080/api）
 *   API_TOKEN - 认证 Token（如果需要认证）
 */

import fetch from 'node-fetch';

// 配置
const CONFIG = {
  API_BASE_URL: process.env.SCRIPT_BASE_URL || 'http://localhost:8080',
  API_TOKEN: process.env.API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE2MDk3YTM1LWNlZmEtNDE2My1hMmY5LWRjZTU5ZDU4NDc5ZSIsInBob25lIjoiMTg2NzE3MTk2NTIiLCJuaWNrbmFtZSI6IuiAgeeOiyIsImlhdCI6MTc2OTUzMTcwOSwiZXhwIjoxNzcwMTM2NTA5LCJhdWQiOiJqb2ItYWktdXNlcnMiLCJpc3MiOiJqb2ItYWktYmFja2VuZCJ9.iDzRvihlMdNPKdw2aRNAUhd1Z-uNSOwoVa8CQRidFZ0',
  TIMEOUT: 10000, // 10秒超时
};

// console.log(process.env)

// 颜色输出（ANSI 转义码）
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * 带颜色的日志输出
 */
function log(message, color = 'reset') {
  const colorCode = COLORS[color] || COLORS.reset;
  console.log(`${colorCode}${message}${COLORS.reset}`);
}

/**
 * 生成指定范围内的随机日期（最近30天内）
 */
function randomDate(days = 30) {
  const now = new Date();
  const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  const date = new Date(randomTime);
  return date.getTime(); // 时间戳
}

/**
 * 生成测试数据
 * 返回 10 条岗位数据，覆盖所有投递状态
 */
function generateTestData() {
  const companies = [
    { name: '字节跳动', position: '前端开发工程师', location: '北京', salary: '25K-40K' },
    { name: '阿里巴巴', position: '后端开发工程师', location: '杭州', salary: '30K-50K' },
    { name: '腾讯', position: '全栈开发工程师', location: '深圳', salary: '28K-45K' },
    { name: '美团', position: '产品经理', location: '北京', salary: '30K-60K' },
    { name: '京东', position: 'UI设计师', location: '北京', salary: '20K-35K' },
    { name: '百度', position: '算法工程师', location: '北京', salary: '35K-55K' },
    { name: '小米', position: '测试工程师', location: '北京', salary: '18K-30K' },
    { name: '华为', position: '运维工程师', location: '深圳', salary: '25K-40K' },
    { name: '网易', position: '数据分析师', location: '杭州', salary: '20K-35K' },
    { name: '滴滴', position: '移动端开发', location: '北京', salary: '25K-45K' },
  ];

  const channels = ['BOSS直聘', '拉勾网', '企业官网', '内推', '猎聘', '智联招聘'];

  const testCases = [
    { status: '0', desc: '待投递' },
    { status: '1', desc: '已投递' },
    { status: '2', desc: '流程中' },
    { status: '3', desc: '已Offer' },
    { status: '4', desc: '已入职' },
    { status: '5', desc: '已拒绝' },
    { status: '-1', desc: '未通过' },
    { status: '1', desc: '已投递' },
    { status: '2', desc: '流程中' },
    { status: '3', desc: '已Offer' },
  ];

  return companies.map((company, index) => {
    const testCase = testCases[index];
    const channel = channels[Math.floor(Math.random() * channels.length)];

    return {
      companyName: company.name,
      positionName: company.position,
      deliveryChannel: channel,
      deliveryDate: randomDate(30),
      workLocation: company.location,
      salaryRange: company.salary,
      jobDescription: `${company.position}岗位，负责相关业务系统的开发和维护。`,
      remarks: `${testCase.desc}状态 - 测试数据`,
      status: testCase.status,
      isCollected: Math.random() > 0.8 ? 1 : 0, // 20% 概率收藏
    };
  });
}

/**
 * 调用 API 创建岗位
 */
async function createPosition(data) {
  const url = `${CONFIG.API_BASE_URL}/positions`;

  const headers = {
    'Content-Type': 'application/json',
  };

  // 如果配置了 Token，添加认证头
  if (CONFIG.API_TOKEN) {
    headers['Authorization'] = `Bearer ${CONFIG.API_TOKEN}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('请求超时（10秒）');
    }
    throw error;
  }
}

/**
 * 批量插入测试数据
 */
async function seedData() {
  log('\n🌱 开始生成测试数据...\n', 'cyan');

  const testData = generateTestData();

  log(`📊 准备插入 ${testData.length} 条测试数据\n`, 'blue');

  let successCount = 0;
  let failCount = 0;
  const results = [];

  // 逐条插入数据
  for (let i = 0; i < testData.length; i++) {
    const data = testData[i];
    const index = i + 1;

    try {
      log(`[${index}/${testData.length}] 正在插入: ${data.companyName} - ${data.positionName}...`, 'blue');

      const response = await createPosition(data);

      if (response.code === 200 && response.data) {
        successCount++;
        const id = response.data.id;
        log(`  ✅ 成功 - ID: ${id}, 状态: ${data.status}\n`, 'green');
        results.push({ index, company: data.companyName, status: 'success', id });
      } else {
        failCount++;
        log(`  ❌ 失败 - ${response.message || '未知错误'}\n`, 'red');
        results.push({ index, company: data.companyName, status: 'failed', error: response.message });
      }
    } catch (error) {
      failCount++;
      log(`  ❌ 失败 - ${error.message}\n`, 'red');
      results.push({ index, company: data.companyName, status: 'failed', error: error.message });
    }

    // 添加延迟，避免请求过快
    if (i < testData.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  // 输出统计信息
  log('\n' + '='.repeat(60), 'bright');
  log('📈 插入结果统计\n', 'cyan');
  log(`  总计: ${testData.length} 条`, 'bright');
  log(`  ✅ 成功: ${successCount} 条`, 'green');
  log(`  ❌ 失败: ${failCount} 条`, 'red');
  log('='.repeat(60) + '\n', 'bright');

  // 输出详细结果
  if (successCount > 0) {
    log('✅ 成功插入的岗位：', 'green');
    results
      .filter(r => r.status === 'success')
      .forEach(r => {
        log(`  - ID ${r.id}: ${r.company}`, 'green');
      });
    log('');
  }

  if (failCount > 0) {
    log('❌ 插入失败的岗位：', 'red');
    results
      .filter(r => r.status === 'failed')
      .forEach(r => {
        log(`  - ${r.company}: ${r.error}`, 'red');
      });
    log('');
  }

  // 输出验证提示
  if (successCount > 0) {
    log('🔍 验证步骤：', 'cyan');
    log(`  1. 打开应用首页: http://localhost:3002`, 'blue');
    log(`  2. 查看岗位列表是否显示 ${successCount} 条新数据`, 'blue');
    log(`  3. 测试状态筛选功能`, 'blue');
    log(`  4. 测试搜索功能`, 'blue');
    log(`  5. 点击岗位进入详情页验证数据完整性\n`, 'blue');
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    await seedData();
  } catch (error) {
    log(`\n❌ 脚本执行失败: ${error.message}\n`, 'red');
    process.exit(1);
  }
}

// 执行主函数
main();
