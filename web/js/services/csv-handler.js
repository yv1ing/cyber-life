// CSV 处理器 - 通用的导入导出功能
const CSVHandler = {
    /**
     * 导出CSV文件
     * @param {string} apiPath - API路径
     * @param {string} filename - 文件名
     * @returns {Promise<void>}
     */
    async exportCSV(apiPath, filename) {
        const jwt_token = Storage.get('jwt_token');
        const response = await fetch(apiPath, {
            method: 'GET',
            headers: jwt_token ? { 'Authorization': `Bearer ${jwt_token}` } : {}
        });

        if (response.status === 401) {
            Toast.error('登录已过期，请重新登录');
            Auth.logout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) throw new Error('导出失败');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    },

    /**
     * 导入CSV文件
     * @param {string} apiPath - API路径
     * @param {File} file - 文件对象
     * @returns {Promise<Object>} 导入结果
     */
    async importCSV(apiPath, file) {
        const jwt_token = Storage.get('jwt_token');
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(apiPath, {
            method: 'POST',
            headers: {
                ...(jwt_token ? { 'Authorization': `Bearer ${jwt_token}` } : {})
            },
            body: formData
        });

        // 检查Content-Type是否为JSON
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');

        let data;
        if (isJson) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = { info: text || `请求失败 (${response.status})` };
        }

        // 处理未授权
        if (response.status === 401) {
            Toast.error('登录已过期，请重新登录');
            Auth.logout();
            throw new Error('Unauthorized');
        }

        // 处理其他错误
        if (!response.ok) {
            throw new Error(data.info || data.message || data.error || '请求失败');
        }

        return data;
    }
};
