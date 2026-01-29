/**
 * 日志工具（Winston）
 * 支持本地开发和Vercel生产环境
 */
import winston from 'winston'
import fs from 'fs'
import path from 'path'

const logLevel = process.env.LOG_LEVEL || 'info'

// 检测是否为Vercel环境
// 1. 显式 VERCEL 环境变量
// 2. 生产环境 NODE_ENV
// 3. 任何只读文件系统的迹象
let isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

// 尝试确保日志目录存在（仅本地环境）
if (!isVercel) {
  try {
    const logsDir = path.join(process.cwd(), 'logs')
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }
    // 尝试写入一个测试文件来验证写权限
    const testFile = path.join(logsDir, '.test')
    fs.writeFileSync(testFile, 'test')
    fs.unlinkSync(testFile)
  } catch (error) {
    // 如果无法写入文件，强制切换为 Vercel/只读模式
    console.warn('Filesystem is read-only or logs dir cannot be created, switching to console logging.')
    isVercel = true
  }
}

/**
 * 创建控制台传输（所有环境通用）
 */
const createConsoleTransport = () => {
  return new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      // 开发环境使用彩色输出，生产环境使用JSON格式
      isVercel
        ? winston.format.json() // Vercel会自动解析JSON日志
        : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ...metadata }) => {
            let msg = `${timestamp} [${level}]: ${message}`
            if (Object.keys(metadata).length > 0) {
              msg += ` ${JSON.stringify(metadata)}`
            }
            return msg
          })
        )
    ),
  })
}

/**
 * 创建文件传输（仅本地开发环境）
 */
const createFileTransports = () => {
  // Vercel环境不使用文件日志
  if (isVercel) {
    return []
  }

  return [
    // 错误日志单独记录
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    // 所有日志
    new winston.transports.File({
      filename: 'logs/combined.log'
    }),
  ]
}

/**
 * 创建Logger实例
 */
const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'job-ai-backend',
    environment: isVercel ? 'vercel' : 'local',
  },
  transports: [
    createConsoleTransport(),
    ...createFileTransports(),
  ],
})

export default logger
