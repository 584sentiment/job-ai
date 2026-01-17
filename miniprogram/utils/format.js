// utils/format.js - 格式化工具

const Format = {
  /**
   * 格式化日期
   */
  formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  },

  /**
   * 格式化相对时间
   */
  relativeTime(date) {
    const now = new Date();
    const target = new Date(date);
    const diff = target - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今天';
    if (days === 1) return '明天';
    if (days === -1) return '昨天';
    if (days > 1) return `${days}天后`;
    return `${Math.abs(days)}天前`;
  },

  /**
   * 截断文本
   */
  truncate(text, length = 50) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }
};

module.exports = Format;
