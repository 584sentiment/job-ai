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
 *
 * 数据说明：
 *   - 使用 @job-ai/shared 包中的类型定义
 *   - 状态值使用 PositionStatus 枚举：'0', '1', '2', '3', '4', '5', '-1'
 *   - 所有时间戳使用毫秒为单位
 */

import fetch from 'node-fetch';

// 配置
const CONFIG = {
  API_BASE_URL: process.env.SCRIPT_BASE_URL || 'http://localhost:8080/api',
  API_TOKEN: process.env.API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5MWRmNmNhLTRjNDctNDQ5YS1hNTcxLWQzZWUyM2E4YmM3MyIsInBob25lIjoiMTg2NzE3MTk2NTIiLCJuaWNrbmFtZSI6IuiAgeeOiyIsImlhdCI6MTc3MDIyNjYxNSwiZXhwIjoxNzcwODMxNDE1LCJhdWQiOiJqb2ItYWktdXNlcnMiLCJpc3MiOiJqb2ItYWktYmFja2VuZCJ9.HroFBS7GRGBm_L5sn5uNcR3vncGESHAiA59rphPRYRI',
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
 * 返回毫秒时间戳
 */
function randomDate(days = 30) {
  const now = new Date();
  const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  const date = new Date(randomTime);
  return date.getTime(); // 毫秒时间戳
}

/**
 * 岗位状态枚举（与 @job-ai/shared 保持一致）
 * PositionStatus: '0' | '1' | '2' | '3' | '4' | '5' | '-1'
 */
const POSITION_STATUS = {
  TO_BE_DELIVERED: '0',    // 待投递
  DELIVERED: '1',          // 已投递
  IN_PROCESS: '2',         // 流程中
  OFFER: '3',              // 已Offer
  JOINED: '4',             // 已入职
  REJECTED: '5',           // 已拒绝
  NOT_PASS: '-1'           // 未通过
};

/**
 * 生成测试数据
 * 返回 10 条岗位数据，覆盖所有投递状态
 * 符合 @job-ai/shared PositionCreateRequest 接口定义
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

  const channels = ['BOSS直聘', '拉勾网', '企业官网', '内推', '猎聘', '智联招聘', '前程无忧'];

  // 测试用例：覆盖所有状态
  const testCases = [
    { status: POSITION_STATUS.TO_BE_DELIVERED, desc: '待投递' },
    { status: POSITION_STATUS.DELIVERED, desc: '已投递' },
    { status: POSITION_STATUS.IN_PROCESS, desc: '流程中' },
    { status: POSITION_STATUS.OFFER, desc: '已Offer' },
    { status: POSITION_STATUS.JOINED, desc: '已入职' },
    { status: POSITION_STATUS.REJECTED, desc: '已拒绝' },
    { status: POSITION_STATUS.NOT_PASS, desc: '未通过' },
    { status: POSITION_STATUS.DELIVERED, desc: '已投递' },
    { status: POSITION_STATUS.IN_PROCESS, desc: '流程中' },
    { status: POSITION_STATUS.OFFER, desc: '已Offer' },
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
      jobDescription: `${company.position}岗位，负责相关业务系统的开发和维护。要求：\n1. 3年以上相关工作经验\n2. 熟悉相关技术栈\n3. 良好的团队协作能力`,
      contactName: 'HR部门',
      contactPhone: '400-888-8888',
      remarks: `${testCase.desc}状态 - 自动生成的测试数据 - ${new Date().toLocaleString()}`,
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

  log(`📊 准备插入 ${testData.length} 条测试数据`, 'blue');
  log(`📝 使用状态枚举: ${Object.values(POSITION_STATUS).join(', ')}`, 'blue');
  log(`⏰ 时间戳格式: 毫秒（13位数字）\n`, 'blue');

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
        log(`  ✅ 成功 - ID: ${id}, 状态: ${data.status} (${getStatusLabel(data.status)})\n`, 'green');
        results.push({ index, company: data.companyName, status: 'success', id, statusCode: data.status });
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
        const statusLabel = getStatusLabel(r.statusCode);
        log(`  - ID ${r.id}: ${r.company} [${statusLabel}]`, 'green');
      });
    log('');
  }

  // 输出状态分布统计
  if (successCount > 0) {
    const statusDistribution = {};
    results
      .filter(r => r.status === 'success')
      .forEach(r => {
        statusDistribution[r.statusCode] = (statusDistribution[r.statusCode] || 0) + 1;
      });

    log('📊 状态分布：', 'cyan');
    Object.entries(statusDistribution).forEach(([status, count]) => {
      const label = getStatusLabel(status);
      log(`  ${status} [${label}]: ${count} 条`, 'blue');
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
    log(`  1. 打开应用首页`, 'blue');
    log(`  2. 查看岗位列表是否显示 ${successCount} 条新数据`, 'blue');
    log(`  3. 测试状态筛选功能（检查所有 7 种状态）`, 'blue');
    log(`  4. 测试搜索功能`, 'blue');
    log(`  5. 点击岗位进入详情页验证数据完整性\n`, 'blue');
  }
}

/**
 * 获取状态标签
 */
function getStatusLabel(status) {
  const labels = {
    '0': '待投递',
    '1': '已投递',
    '2': '流程中',
    '3': '已Offer',
    '4': '已入职',
    '5': '已拒绝',
    '-1': '未通过'
  };
  return labels[status] || status;
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
