/**
 * 密码加密工具
 * 支持 Web Crypto API 和 crypto-js 两种实现
 */

// 动态导入 crypto-js（避免在 Node.js 环境中报错）
let CryptoJS = null

async function loadCryptoJS() {
  if (!CryptoJS) {
    CryptoJS = await import('crypto-js')
  }
  return CryptoJS
}

/**
 * 使用 Web Crypto API 进行 SHA-256 加密（推荐）
 * 仅在 HTTPS 或 localhost 环境中可用
 * @param {string} password - 明文密码
 * @returns {Promise<string>} 返回加密后的密码（十六进制字符串）
 */
async function hashWithWebCrypto(password) {
  try {
    // 检查 crypto.subtle 是否可用
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      throw new Error('Web Crypto API 不可用')
    }

    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)

    // 将 ArrayBuffer 转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch (error) {
    console.error('Web Crypto API 加密失败:', error)
    throw error
  }
}

/**
 * 使用 crypto-js 进行 SHA-256 加密（降级方案）
 * 可以在任何环境中使用
 * @param {string} password - 明文密码
 * @returns {Promise<string>} 返回加密后的密码（十六进制字符串）
 */
async function hashWithCryptoJS(password) {
  try {
    const CryptoJS = await loadCryptoJS()
    const hash = CryptoJS.SHA256(password)
    return hash.toString(CryptoJS.enc.Hex)
  } catch (error) {
    console.error('crypto-js 加密失败:', error)
    throw new Error('密码加密失败，请确保使用支持的环境')
  }
}

/**
 * 使用 SHA-256 算法对密码进行哈希加密
 * 优先使用 Web Crypto API（更快、更安全），降级使用 crypto-js
 * @param {string} password - 明文密码
 * @returns {Promise<string>} 返回加密后的密码（十六进制字符串）
 */
export async function hashPassword(password) {
  try {
    // 优先使用 Web Crypto API（HTTPS 或 localhost）
    const hash = await hashWithWebCrypto(password)
    return hash
  } catch (error) {
    console.warn('Web Crypto API 不可用，使用 crypto-js 降级方案:', error.message)

    // 降级使用 crypto-js（HTTP 环境）
    const hash = await hashWithCryptoJS(password)
    return hash
  }
}

/**
 * 检查当前环境是否支持 Web Crypto API
 * @returns {boolean}
 */
export function isWebCryptoAvailable() {
  return typeof crypto !== 'undefined' && typeof crypto.subtle === 'object'
}
