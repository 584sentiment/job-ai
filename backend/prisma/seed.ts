/**
 * Prisma 种子数据
 * 用于开发和测试
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化种子数据...')

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('123456', 10)

  const user = await prisma.user.upsert({
    where: { phone: '13800138000' },
    update: {},
    create: {
      phone: '13800138000',
      password: hashedPassword,
      nickname: '测试用户',
      bio: '这是一个测试账号',
      createTime: BigInt(Date.now()),
      updateTime: BigInt(Date.now()),
    },
  })

  console.log('创建用户:', user.phone)

  // 创建测试岗位
  const position = await prisma.position.upsert({
    where: { id: 'test-position-1' },
    update: {},
    create: {
      id: 'test-position-1',
      userId: user.id,
      companyName: '字节跳动',
      positionName: '前端工程师',
      deliveryChannel: '招聘网站',
      workLocation: '北京',
      salaryRange: '25-40K',
      status: 'applied',
      deliveryDate: BigInt(Date.now()),
      jobDescription: '负责产品前端开发，使用 Vue3 + TypeScript 技术栈。',
      isCollected: 0,
      createTime: BigInt(Date.now()),
      updateTime: BigInt(Date.now()),
    },
  })

  console.log('创建岗位:', position.companyName, position.positionName)

  // 创建测试面试
  const interview = await prisma.interview.upsert({
    where: { id: 'test-interview-1' },
    update: {},
    create: {
      id: 'test-interview-1',
      userId: user.id,
      positionId: position.id,
      interviewRound: '一面',
      interviewTime: BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后
      interviewLocation: '北京海淀区',
      interviewForm: '现场面试',
      status: 0,
      createTime: BigInt(Date.now()),
      updateTime: BigInt(Date.now()),
    },
  })

  console.log('创建面试:', position.companyName, interview.interviewRound)

  // 创建测试面经
  const experience = await prisma.experience.upsert({
    where: { id: 'test-experience-1' },
    update: {},
    create: {
      id: 'test-experience-1',
      userId: user.id,
      positionId: position.id,
      companyName: '阿里巴巴',
      positionName: '高级前端工程师',
      interviewRound: '一面',
      interviewDate: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7天前
      content: `
# 阿里巴巴前端面试经验

## 技术面（一面）

### 1. JavaScript 基础
- 闭包的原理和应用场景
- 原型链的理解
- async/await 的实现原理
- Event Loop 的执行机制

### 2. Vue 相关
- Vue3 Composition API 的优势
- provide/inject 的使用场景
- 响应式原理（Proxy vs Object.defineProperty）

### 3. 工程化
- Vite 与 Webpack 的区别
- 性能优化方案
- 组件库开发经验

## HR 面（二面）

- 职业规划
- 项目经验介绍
- 团队协作经历
- 薪资期望

## 总结

整体难度适中，重点考察基础知识和项目经验。建议提前准备算法题和项目细节。
      `.trim(),
      contentType: 'markdown',
      tags: ['Vue3', 'TypeScript', '前端', '技术面'],
      isAnonymous: 0,
      isFavorite: 0,
      views: 128,
      comments: 3,
      createTime: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updateTime: BigInt(Date.now()),
    },
  })

  console.log('创建面经:', experience.companyName, experience.positionName)

  // 创建测试总结
  const summary = await prisma.summary.upsert({
    where: { id: 'test-summary-1' },
    update: {},
    create: {
      id: 'test-summary-1',
      userId: user.id,
      interviewId: interview.id,
      positionId: position.id,
      companyName: '字节跳动',
      positionName: '前端工程师',
      round: '一面',
      date: BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后
      content: {
        strengths: ['技术基础扎实', '项目经验丰富', '沟通能力强'],
        weaknesses: ['算法需要加强', '某些设计模式理解不够深入'],
        questions: [
          '请介绍一下你的项目',
          'Vue3 的响应式原理是什么',
          '如何解决性能问题',
          'Promise 的实现原理',
        ],
        improvements: [
          '多刷 LeetCode 算法题',
          '深入学习设计模式',
          '提升系统设计能力',
        ],
        overall: '整体表现良好，技术能力达到要求，需要继续提升算法能力',
      },
      createTime: BigInt(Date.now()),
      updateTime: BigInt(Date.now()),
    },
  })

  console.log('创建总结:', summary.companyName, summary.round)

  console.log('种子数据初始化完成!')
}

main()
  .catch((e) => {
    console.error('种子数据初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
