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

        // 从 options 中提取自定义选项
        const skipAuthCheck = options.skipAuthCheck || false;
        const showSuccessToast = options.showSuccessToast !== undefined ? options.showSuccessToast : false;
        const showErrorToast = options.showErrorToast !== undefined ? options.showErrorToast : true;

        // 删除自定义选项，避免传递给 fetch
        delete finalOptions.skipAuthCheck;
        delete finalOptions.showSuccessToast;
        delete finalOptions.showErrorToast;

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
                // 显示过期提示（使用国际化）
                const messageKey = getMessageKeyByCode(InfoCodes.EXPIRED_TOKEN);
                const message = messageKey ? langManager.t(messageKey) : langManager.t('toast.loginExpired');
                Toast.error(message);
                Auth.logout();
                throw new Error('Unauthorized');
            }

            // 如果响应包含 code 字段，根据 code 显示对应的提示消息
            if (data.code !== undefined) {
                const messageKey = getMessageKeyByCode(data.code);

                if (messageKey) {
                    const message = langManager.t(messageKey);

                    // 根据信息码类型判断是成功还是错误
                    if (isSuccessCode(data.code)) {
                        // 成功消息只在明确要求时显示
                        if (showSuccessToast) {
                            Toast.success(message);
                        }
                    } else if (isErrorCode(data.code)) {
                        // 错误消息默认显示
                        if (showErrorToast) {
                            Toast.error(message);
                        }
                        // 对于错误响应，抛出业务异常（标记为业务错误，不打印到控制台）
                        const error = new Error(message);
                        error.isBusinessError = true;
                        throw error;
                    }
                }
            }

            // 处理其他 HTTP 错误状态（没有 code 的情况）
            if (!response.ok && data.code === undefined) {
                const errorMessage = data.info || data.message || data.error || '请求失败';
                if (showErrorToast) {
                    Toast.error(errorMessage);
                }
                const error = new Error(errorMessage);
                error.isBusinessError = true;
                throw error;
            }

            return data;
        } catch (error) {
            // 如果错误已经被处理过（Unauthorized 或业务错误），直接抛出，不打印日志
            if (error.message === 'Unauthorized' || error.isBusinessError) {
                throw error;
            }

            // 只有系统级错误（如网络错误、解析错误等）才打印到控制台
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
