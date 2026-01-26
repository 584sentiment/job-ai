/**
 * 日志工具（Winston）
 */
import winston from 'winston'

const logLevel = process.env.LOG_LEVEL || 'info'

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'job-ai-backend' },
  transports: [
    // 错误日志单独记录
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // 所有日志
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})

// 开发环境下，同时在控制台输出
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...metadata }) => {
          let msg = `${timestamp} [${level}]: ${message}`
          if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`
          }
          return msg
        })
      ),
    })
  )
}

export default logger
