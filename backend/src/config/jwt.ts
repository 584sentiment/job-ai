/**
 * JWT 配置
 */
export const JWT_CONFIG = {
  // JWT 密钥（从环境变量获取，开发环境有默认值）
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',

  // Token 过期时间（默认 7 天）
  expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string | number,

  // Token 签发者
  issuer: process.env.JWT_ISSUER || 'job-ai-backend',

  // Token 受众
  audience: process.env.JWT_AUDIENCE || 'job-ai-users',
}

export default JWT_CONFIG
