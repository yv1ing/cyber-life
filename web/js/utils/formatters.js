// 格式化工具集
const Formatters = {
    /**
     * 格式化存储容量（MB -> GB/TB/PB）
     * @param {number} mb - 容量（单位：MB）
     * @returns {string} 格式化后的容量字符串
     */
    formatStorage(mb) {
        if (!mb || mb === 0) return '-';

        const units = ['MB', 'GB', 'TB', 'PB'];
        let size = mb;
        let unitIndex = 0;

        // 自动转换到合适的单位
        while (size >= 1024 && unitIndex < units.length - 1) {
            size = size / 1024;
            unitIndex++;
        }

        // 保留两位小数，去除末尾的0
        return `${parseFloat(size.toFixed(2))} ${units[unitIndex]}`;
    },

    /**
     * 格式化文件大小（字节 -> KB/MB/GB）
     * @param {number} bytes - 文件大小（字节）
     * @returns {string} 格式化后的大小字符串
     */
    formatFileSize(bytes) {
        if (!bytes || bytes === 0) return '0 B';

        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size = size / 1024;
            unitIndex++;
        }

        return `${parseFloat(size.toFixed(2))} ${units[unitIndex]}`;
    },

    /**
     * 格式化数字（添加千分位分隔符）
     * @param {number} num - 数字
     * @returns {string} 格式化后的数字字符串
     */
    formatNumber(num) {
        if (!num && num !== 0) return '-';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
};
