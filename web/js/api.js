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

            // 处理未授权
            if (response.status === 401) {
                Toast.error('登录已过期，请重新登录');
                logout();
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

    static get(url, params = {}) {
        const query = new URLSearchParams(params).toString();
        const fullUrl = query ? `${url}?${query}` : url;
        return this.request(fullUrl, { method: 'GET' });
    }

    static post(url, data = {}) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static put(url, data = {}) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static delete(url, params = {}) {
        const query = new URLSearchParams(params).toString();
        const fullUrl = query ? `${url}?${query}` : url;
        return this.request(fullUrl, { method: 'DELETE' });
    }
}

// 账号记录 API
const AccountAPI = {
    // 创建账号记录
    create(accountData) {
        return HTTP.post(`${API_BASE_URL}/accounts/create`, accountData);
    },

    // 删除账号记录
    delete(ids) {
        // 如果传入的是单个ID，转换为数组
        const accountIds = Array.isArray(ids) ? ids : [ids];
        return HTTP.request(`${API_BASE_URL}/accounts/delete`, {
            method: 'DELETE',
            body: JSON.stringify({ account_ids: accountIds })
        });
    },

    // 更新账号记录
    update(id, accountData) {
        return HTTP.put(`${API_BASE_URL}/accounts/update`, { account_id: parseInt(id), ...accountData });
    },

    // 查找账号记录
    find(keyword = '', page = 1, pageSize = 10) {
        return HTTP.get(`${API_BASE_URL}/accounts/find`, { keyword, page, size: pageSize });
    },

    // 账号记录列表
    list(page = 1, pageSize = 10) {
        return HTTP.get(`${API_BASE_URL}/accounts/list`, { page, size: pageSize });
    },

    // 导出CSV
    async exportCSV() {
        const jwt_token = Storage.get('jwt_token');
        const response = await fetch(`${API_BASE_URL}/accounts/export`, {
            method: 'GET',
            headers: jwt_token ? { 'Authorization': `Bearer ${jwt_token}` } : {}
        });

        if (response.status === 401) {
            Toast.error('登录已过期，请重新登录');
            logout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) throw new Error('导出失败');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `accounts_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    },

    // 导入CSV
    async importCSV(file) {
        const jwt_token = Storage.get('jwt_token');
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/accounts/import`, {
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
            logout();
            throw new Error('Unauthorized');
        }

        // 处理其他错误
        if (!response.ok) {
            throw new Error(data.info || data.message || data.error || '请求失败');
        }

        return data;
    }
};

// 主机管理 API
const HostAPI = {
    // 创建主机记录
    create(hostData) {
        return HTTP.post(`${API_BASE_URL}/hosts/create`, hostData);
    },

    // 删除主机记录
    delete(ids) {
        // 如果传入的是单个ID，转换为数组
        const hostIds = Array.isArray(ids) ? ids : [ids];
        return HTTP.request(`${API_BASE_URL}/hosts/delete`, {
            method: 'DELETE',
            body: JSON.stringify({ host_ids: hostIds })
        });
    },

    // 更新主机记录
    update(id, hostData) {
        return HTTP.put(`${API_BASE_URL}/hosts/update`, { host_id: parseInt(id), ...hostData });
    },

    // 查找主机记录
    find(keyword = '', page = 1, pageSize = 10) {
        return HTTP.get(`${API_BASE_URL}/hosts/find`, { keyword, page, size: pageSize });
    },

    // 主机记录列表
    list(page = 1, pageSize = 10) {
        return HTTP.get(`${API_BASE_URL}/hosts/list`, { page, size: pageSize });
    },

    // 导出CSV
    async exportCSV() {
        const jwt_token = Storage.get('jwt_token');
        const response = await fetch(`${API_BASE_URL}/hosts/export`, {
            method: 'GET',
            headers: jwt_token ? { 'Authorization': `Bearer ${jwt_token}` } : {}
        });

        if (response.status === 401) {
            Toast.error('登录已过期，请重新登录');
            logout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) throw new Error('导出失败');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `hosts_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    },

    // 导入CSV
    async importCSV(file) {
        const jwt_token = Storage.get('jwt_token');
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/hosts/import`, {
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
            logout();
            throw new Error('Unauthorized');
        }

        // 处理其他错误
        if (!response.ok) {
            throw new Error(data.info || data.message || data.error || '请求失败');
        }

        return data;
    }
};

// 密钥信息 API
const SecretAPI = {
    // 创建密钥记录
    create(secretData) {
        return HTTP.post(`${API_BASE_URL}/secrets/create`, secretData);
    },

    // 删除密钥记录
    delete(ids) {
        // 如果传入的是单个ID，转换为数组
        const secretIds = Array.isArray(ids) ? ids : [ids];
        return HTTP.request(`${API_BASE_URL}/secrets/delete`, {
            method: 'DELETE',
            body: JSON.stringify({ secret_ids: secretIds })
        });
    },

    // 更新密钥记录
    update(id, secretData) {
        return HTTP.put(`${API_BASE_URL}/secrets/update`, { secret_id: parseInt(id), ...secretData });
    },

    // 查找密钥记录
    find(keyword = '', page = 1, pageSize = 10) {
        return HTTP.get(`${API_BASE_URL}/secrets/find`, { keyword, page, size: pageSize });
    },

    // 密钥记录列表
    list(page = 1, pageSize = 10) {
        return HTTP.get(`${API_BASE_URL}/secrets/list`, { page, size: pageSize });
    },

    // 导出CSV
    async exportCSV() {
        const jwt_token = Storage.get('jwt_token');
        const response = await fetch(`${API_BASE_URL}/secrets/export`, {
            method: 'GET',
            headers: jwt_token ? { 'Authorization': `Bearer ${jwt_token}` } : {}
        });

        if (response.status === 401) {
            Toast.error('登录已过期，请重新登录');
            logout();
            throw new Error('Unauthorized');
        }

        if (!response.ok) throw new Error('导出失败');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `secrets_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    },

    // 导入CSV
    async importCSV(file) {
        const jwt_token = Storage.get('jwt_token');
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/secrets/import`, {
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
            logout();
            throw new Error('Unauthorized');
        }

        // 处理其他错误
        if (!response.ok) {
            throw new Error(data.info || data.message || data.error || '请求失败');
        }

        return data;
    }
};

// 站点信息 API（预留）
const SiteAPI = {
    create(siteData) {
        return HTTP.post(`${API_BASE_URL}/sites/create`, siteData);
    },

    delete(id) {
        return HTTP.delete(`${API_BASE_URL}/sites/delete`, { id });
    },

    update(id, siteData) {
        return HTTP.put(`${API_BASE_URL}/sites/update`, { id, ...siteData });
    },

    find(id) {
        return HTTP.get(`${API_BASE_URL}/sites/find`, { id });
    },

    list(page = 1, pageSize = 10, keyword = '') {
        return HTTP.get(`${API_BASE_URL}/sites/list`, { page, page_size: pageSize, keyword });
    }
};

// 用户信息 API
const UserAPI = {
    // 用户登录
    login(username, password) {
        return HTTP.post(`${API_BASE_URL}/sys/users/login`, { username, password });
    },

    // 根据用户ID查询用户信息
    findById(userId) {
        return HTTP.get(`${API_BASE_URL}/sys/users/find`, { type: 'user_id', user_id: userId });
    },

    // 根据用户名查询用户信息
    findByUsername(username) {
        return HTTP.get(`${API_BASE_URL}/sys/users/find`, { type: 'username', username: username });
    },

    // 更新用户信息
    update(userId, userData) {
        return HTTP.put(`${API_BASE_URL}/sys/users/update`, {
            user_id: parseInt(userId),
            ...userData
        });
    },

    // 登出
    logout() {
        return HTTP.post(`${API_BASE_URL}/sys/users/logout`);
    }
};

