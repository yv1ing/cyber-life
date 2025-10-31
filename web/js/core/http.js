// API 基础配置
const API_BASE_URL = '/api';

// HTTP 请求封装
class HTTP {
    static async request(url, options = {}) {
        const jwt_token = Storage.get('jwt_token');
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(jwt_token ? { 'Authorization': `Bearer ${jwt_token}` } : {})
            }
        };

        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        // 从 options 中提取是否跳过 401 自动处理的标志
        const skipAuthCheck = options.skipAuthCheck || false;
        delete finalOptions.skipAuthCheck; // 删除自定义选项，避免传递给 fetch

        try {
            const response = await fetch(url, finalOptions);

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

            // 处理未授权 - 但跳过登录接口的自动处理
            if (response.status === 401 && !skipAuthCheck) {
                Toast.error('登录已过期，请重新登录');
                Auth.logout();
                throw new Error('Unauthorized');
            }

            // 处理其他错误
            if (!response.ok) {
                throw new Error(data.info || data.message || data.error || '请求失败');
            }

            return data;
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }

    static get(url, params = {}, options = {}) {
        const query = new URLSearchParams(params).toString();
        const fullUrl = query ? `${url}?${query}` : url;
        return this.request(fullUrl, { method: 'GET', ...options });
    }

    static post(url, data = {}, options = {}) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options
        });
    }

    static put(url, data = {}, options = {}) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options
        });
    }

    static delete(url, params = {}, options = {}) {
        const query = new URLSearchParams(params).toString();
        const fullUrl = query ? `${url}?${query}` : url;
        return this.request(fullUrl, { method: 'DELETE', ...options });
    }
}
