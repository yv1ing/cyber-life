// 日期和时间工具函数
const DateUtils = {
    /**
     * 格式化日期时间
     * @param {string|number} dateInput - 日期字符串或时间戳（秒级）
     * @returns {string} 格式化后的日期时间
     */
    formatDateTime(dateInput) {
        if (!dateInput) return '-';

        let date;
        // 判断是时间戳（数字）还是日期字符串
        if (typeof dateInput === 'number') {
            // 如果是数字，假设是秒级时间戳，转换为毫秒
            date = new Date(dateInput * 1000);
        } else if (typeof dateInput === 'string') {
            // 如果是字符串，直接解析
            date = new Date(dateInput);
        } else {
            return '-';
        }

        // 检查日期是否有效
        if (isNaN(date.getTime())) return '-';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
};
