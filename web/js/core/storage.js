// 本地存储封装
const Storage = {
    set(key, value) {
        try {
            // 如果value是字符串，直接存储；否则序列化为JSON
            const storageValue = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, storageValue);
            return true;
        } catch (e) {
            console.error('存储失败:', e);
            return false;
        }
    },

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return defaultValue;

            // 尝试解析JSON，如果失败则直接返回字符串
            try {
                return JSON.parse(item);
            } catch {
                return item;
            }
        } catch (e) {
            console.error('读取失败:', e);
            return defaultValue;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};
