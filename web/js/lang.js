// 语言包定义
const translations = {
    zh: {
        // 系统
        'app.name': '赛博人生',
        'app.nameEnglish': 'Cyber Life',
        'app.title.login': '登录 - 赛博人生',
        'app.title.admin': '管理面板 - 赛博人生',
        'app.title.index': '赛博人生',

        // 通用
        'common.confirm': '确认',
        'common.cancel': '取消',
        'common.save': '保存',
        'common.delete': '删除',
        'common.batchDelete': '批量删除',
        'common.edit': '编辑',
        'common.create': '新建',
        'common.search': '搜索',
        'common.searchPlaceholder': '搜索...',
        'common.close': '关闭',
        'common.loading': '加载中...',
        'common.noData': '暂无数据',
        'common.operation': '操作',
        'common.success': '成功',
        'common.error': '错误',
        'common.warning': '警告',

        // 登录页面
        'login.title': '登录',
        'login.subtitle': '欢迎回来',
        'login.account': '账号',
        'login.accountPlaceholder': '请输入账号',
        'login.password': '密码',
        'login.passwordPlaceholder': '请输入密码',
        'login.submit': '登录',
        'login.footer': '© 2025 赛博人生。保留所有权利。',
        'login.loggingIn': '登录中...',
        'login.success': '登录成功',
        'login.error': '登录失败，请检查账号和密码',
        'login.formatError': '登录响应格式错误',
        'login.fillAll': '请填写完整信息',

        // 首页
        'index.title': 'Cyber Life',
        'index.searchPlaceholder': '搜索...',
        'index.footer': '© 2025 赛博人生。保留所有权利。',

        // 管理页面
        'admin.title': '管理面板',
        'admin.logout': '退出登录',
        'admin.editProfile': '编辑资料',
        'admin.administrator': '管理员',

        // 侧边栏
        'nav.accounts': '账号记录',
        'nav.hosts': '主机信息',
        'nav.subscriptions': '订阅信息',
        'nav.sites': '站点信息',

        // 账号记录
        'accounts.title': '账号记录',
        'accounts.platform': '平台',
        'accounts.username': '账号',
        'accounts.password': '密码',
        'accounts.securityEmail': '安全邮箱',
        'accounts.securityPhone': '安全电话',
        'accounts.remark': '备注',
        'accounts.createdAt': '创建时间',
        'accounts.updatedAt': '更新时间',
        'accounts.createTitle': '新建账号记录',
        'accounts.editTitle': '编辑账号记录',
        'accounts.deleteConfirm': '确定要删除这条记录吗？此操作不可恢复。',
        'accounts.deleteSuccess': '删除成功',
        'accounts.saveSuccess': '保存成功',

        // 用户资料
        'profile.title': '编辑资料',
        'profile.account': '账号',
        'profile.accountPlaceholder': '请输入账号',
        'profile.password': '密码',
        'profile.passwordPlaceholder': '留空则不修改密码',
        'profile.name': '姓名',
        'profile.namePlaceholder': '请输入姓名',
        'profile.email': '邮箱',
        'profile.emailPlaceholder': '请输入邮箱',
        'profile.phone': '电话',
        'profile.phonePlaceholder': '请输入电话',
        'profile.saveSuccess': '保存成功',
        'profile.getFailed': '获取用户信息失败',

        // Toast 消息
        'toast.loginExpired': '登录已过期，请重新登录',
        'toast.requestFailed': '请求失败',
        'toast.saveFailed': '保存失败',
        'toast.deleteFailed': '删除失败',
        'toast.copied': '已复制到剪贴板',
        'toast.copyFailed': '复制失败',

        // 表单验证
        'validation.required': '此字段为必填项',
        'validation.fillAccount': '请输入账号',

        // 空状态
        'empty.noData': '暂无数据',
        'empty.clickCreate': '点击上方"新建"按钮添加数据'
    },
    en: {
        // System
        'app.name': 'Cyber Life',
        'app.nameEnglish': 'Cyber Life',
        'app.title.login': 'Login - Cyber Life',
        'app.title.admin': 'Admin Panel - Cyber Life',
        'app.title.index': 'Cyber Life',

        // Common
        'common.confirm': 'Confirm',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'common.delete': 'Delete',
        'common.batchDelete': 'Batch Delete',
        'common.edit': 'Edit',
        'common.create': 'Create',
        'common.search': 'Search',
        'common.searchPlaceholder': 'Search...',
        'common.close': 'Close',
        'common.loading': 'Loading...',
        'common.noData': 'No Data',
        'common.operation': 'Operation',
        'common.success': 'Success',
        'common.error': 'Error',
        'common.warning': 'Warning',

        // Login Page
        'login.title': 'Login',
        'login.subtitle': 'Welcome Back',
        'login.account': 'Account',
        'login.accountPlaceholder': 'Enter your account',
        'login.password': 'Password',
        'login.passwordPlaceholder': 'Enter your password',
        'login.submit': 'Sign In',
        'login.footer': '© 2025 Cyber Life. All rights reserved.',
        'login.loggingIn': 'Logging in...',
        'login.success': 'Login successful',
        'login.error': 'Login failed, please check your account and password',
        'login.formatError': 'Invalid login response format',
        'login.fillAll': 'Please fill in all fields',

        // Index Page
        'index.title': 'Cyber Life',
        'index.searchPlaceholder': 'Search...',
        'index.footer': '© 2025 Cyber Life. All rights reserved.',

        // Admin Page
        'admin.title': 'Admin Panel',
        'admin.logout': 'Logout',
        'admin.editProfile': 'Edit Profile',
        'admin.administrator': 'Administrator',

        // Sidebar
        'nav.accounts': 'Accounts',
        'nav.hosts': 'Hosts',
        'nav.subscriptions': 'Subscriptions',
        'nav.sites': 'Sites',

        // Accounts
        'accounts.title': 'Account Records',
        'accounts.platform': 'Platform',
        'accounts.username': 'Username',
        'accounts.password': 'Password',
        'accounts.securityEmail': 'Security Email',
        'accounts.securityPhone': 'Security Phone',
        'accounts.remark': 'Remark',
        'accounts.createdAt': 'Created At',
        'accounts.updatedAt': 'Updated At',
        'accounts.createTitle': 'Create Account',
        'accounts.editTitle': 'Edit Account',
        'accounts.deleteConfirm': 'Are you sure you want to delete this record? This action cannot be undone.',
        'accounts.deleteSuccess': 'Deleted successfully',
        'accounts.saveSuccess': 'Saved successfully',

        // User Profile
        'profile.title': 'Edit Profile',
        'profile.account': 'Account',
        'profile.accountPlaceholder': 'Enter your account',
        'profile.password': 'Password',
        'profile.passwordPlaceholder': 'Leave blank to keep current password',
        'profile.name': 'Name',
        'profile.namePlaceholder': 'Enter your name',
        'profile.email': 'Email',
        'profile.emailPlaceholder': 'Enter your email',
        'profile.phone': 'Phone',
        'profile.phonePlaceholder': 'Enter your phone',
        'profile.saveSuccess': 'Saved successfully',
        'profile.getFailed': 'Failed to get user info',

        // Toast Messages
        'toast.loginExpired': 'Login expired, please login again',
        'toast.requestFailed': 'Request failed',
        'toast.saveFailed': 'Save failed',
        'toast.deleteFailed': 'Delete failed',
        'toast.copied': 'Copied to clipboard',
        'toast.copyFailed': 'Copy failed',

        // Form Validation
        'validation.required': 'This field is required',
        'validation.fillAccount': 'Please enter account',

        // Empty State
        'empty.noData': 'No Data',
        'empty.clickCreate': 'Click "Create" button above to add data'
    }
};

// 语言管理器
class LanguageManager {
    constructor() {
        this.currentLang = this.getSavedLanguage() || this.detectBrowserLanguage();
        this.translations = translations;
    }

    // 获取保存的语言
    getSavedLanguage() {
        return localStorage.getItem('language');
    }

    // 检测浏览器语言
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('zh') ? 'zh' : 'en';
    }

    // 设置语言
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error(`Language ${lang} not supported`);
            return;
        }

        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.updatePageLanguage();

        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
    }

    // 切换语言
    toggle() {
        const newLang = this.currentLang === 'zh' ? 'en' : 'zh';
        this.setLanguage(newLang);
    }

    // 获取翻译文本
    t(key, params = {}) {
        // 直接从扁平结构的翻译字典中获取值
        let value = this.translations[this.currentLang]?.[key];

        // 如果找不到，返回键本身作为后备
        if (value === undefined) {
            console.warn(`Translation key not found: ${key} for language: ${this.currentLang}`);
            return key;
        }

        // 替换参数
        if (typeof value === 'string') {
            return value.replace(/\{(\w+)\}/g, (match, param) => {
                return params[param] !== undefined ? params[param] : match;
            });
        }

        return value;
    }

    // 更新页面语言
    updatePageLanguage() {
        // 更新所有带 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // 更新所有带 data-i18n-placeholder 属性的元素
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // 更新所有带 data-i18n-title 属性的元素
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // 更新页面标题
        this.updatePageTitle();

        // 更新语言切换按钮图标
        this.updateLanguageIcon();
    }

    // 更新页面标题
    updatePageTitle() {
        const path = window.location.pathname;
        let titleKey = 'app.title.index';

        if (path.includes('login.html')) {
            titleKey = 'app.title.login';
        } else if (path.includes('admin.html')) {
            titleKey = 'app.title.admin';
        }

        document.title = this.t(titleKey);
    }

    // 更新语言图标
    updateLanguageIcon() {
        const langIcon = document.getElementById('lang-icon');
        if (langIcon) {
            langIcon.textContent = this.currentLang === 'zh' ? '中' : 'EN';
        }
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLang;
    }
}

// 创建全局实例
const langManager = new LanguageManager();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    langManager.updatePageLanguage();
});
