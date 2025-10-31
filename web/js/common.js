// Toast 消息提示
class Toast {
    static show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const iconMap = {
            success: Icons.success,
            error: Icons.error,
            warning: Icons.warning,
            info: Icons.info
        };

        toast.innerHTML = `
            <span class="icon">${iconMap[type] || Icons.info}</span>
            <span class="toast-message">${message}</span>
        `;

        document.body.appendChild(toast);

        // 触发动画
        setTimeout(() => toast.classList.add('show'), 10);

        // 自动关闭
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    static success(message, duration) {
        this.show(message, 'success', duration);
    }

    static error(message, duration) {
        this.show(message, 'error', duration);
    }

    static warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    static info(message, duration) {
        this.show(message, 'info', duration);
    }
}

// 模态框管理
class Modal {
    constructor(id) {
        this.id = id;
        this.element = document.getElementById(id);
        this.overlay = this.element?.closest('.modal-overlay');

        if (this.overlay) {
            // 点击遮罩关闭
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });

            // ESC 键关闭
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.overlay.classList.contains('show')) {
                    this.close();
                }
            });
        }
    }

    show() {
        if (this.overlay) {
            this.overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        if (this.overlay) {
            this.overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    static confirm(title, message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal" style="width: 400px;">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="modal-cancel">取消</button>
                    <button class="btn btn-primary" id="modal-confirm">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('show'), 10);

        const close = () => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.querySelector('#modal-cancel').addEventListener('click', close);
        overlay.querySelector('#modal-confirm').addEventListener('click', () => {
            onConfirm();
            close();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    }
}

// 格式化日期时间
function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 格式化相对时间
function formatRelativeTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) return formatDateTime(dateString);
    if (days > 0) return `${days} 天前`;
    if (hours > 0) return `${hours} 小时前`;
    if (minutes > 0) return `${minutes} 分钟前`;
    if (seconds > 10) return `${seconds} 秒前`;
    return '刚刚';
}

/**
 * 以下工具函数已迁移到 /js/utils/helpers.js
 * 为保持向后兼容，这里保留函数定义，但新代码应使用 Helpers 对象
 *
 * 可用的工具函数：
 * - debounce(func, wait) - 防抖函数
 * - throttle(func, limit) - 节流函数
 * - copyToClipboard(text) - 复制到剪贴板
 * - generateId() - 生成唯一 ID
 * - escapeHtml(text) - HTML 转义
 *
 * 推荐使用方式：
 * - Helpers.debounce(func, 300)
 * - Helpers.escapeHtml(text)
 */

// 验证表单
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--error-color)';

            // 添加错误提示
            let errorMsg = input.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-msg')) {
                errorMsg = document.createElement('span');
                errorMsg.className = 'error-msg';
                errorMsg.style.color = 'var(--error-color)';
                errorMsg.style.fontSize = '12px';
                errorMsg.style.marginTop = '4px';
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
            }
            errorMsg.textContent = '此字段为必填项';

            // 聚焦时清除错误
            input.addEventListener('focus', function clearError() {
                input.style.borderColor = '';
                if (errorMsg) errorMsg.textContent = '';
                input.removeEventListener('focus', clearError);
            });
        }
    });

    return isValid;
}

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

// 权限检查
function checkAuth() {
    const jwt_token = Storage.get('jwt_token');
    if (!jwt_token) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// 获取当前用户信息
function getCurrentUser() {
    return Storage.get('user', {});
}

// 登出
function logout() {
    Storage.remove('jwt_token');
    Storage.remove('user');
    window.location.href = '/login.html';
}
