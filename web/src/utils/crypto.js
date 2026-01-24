/**
 * 密码加密工具
 */

/**
 * 将字符串转换为 ArrayBuffer
 * @param {string} str - 输入字符串
 * @returns {ArrayBuffer}
 */
function stringToArrayBuffer(str) {
  const encoder = new TextEncoder()
  return encoder.encode(str)
}

/**
 * 将 ArrayBuffer 转换为十六进制字符串
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function arrayBufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * 使用 SHA-256 算法对密码进行哈希加密
 * @param {string} password - 明文密码
 * @returns {Promise<string>} 返回加密后的密码（十六进制字符串）
 */
export async function hashPassword(password) {
  try {
    const data = stringToArrayBuffer(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return arrayBufferToHex(hashBuffer)
  } catch (error) {
    console.error('密码加密失败:', error)
    throw new Error('密码加密失败')
  }
}
