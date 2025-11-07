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
        'common.id': '编号',
        'common.confirm': '确认',
        'common.cancel': '取消',
        'common.save': '保存',
        'common.delete': '删除',
        'common.batchDelete': '批量删除',
        'common.batchDeleteConfirm': '确定要删除选中的 {count} 条记录吗？此操作不可恢复。',
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
        'common.exportCSV': '导出CSV',
        'common.importCSV': '导入CSV',
        'common.generatePassword': '生成随机密码',
        'common.showPassword': '显示密码',
        'common.hidePassword': '隐藏密码',

        // 标题提示
        'title.switchLanguage': '切换语言',
        'title.switchTheme': '切换主题',
        'title.adminPanel': '管理面板',
        'title.backHome': '返回首页',
        'title.search': '搜索',
        'title.uploadNewLogo': '上传新图标',
        'title.enterNameFirst': '请先输入{name}名称',
        'title.clickToCopy': '点击复制',

        // 登录页面
        'login.title': '登录',
        'login.subtitle': '欢迎回来',
        'login.account': '账号',
        'login.accountPlaceholder': '请输入账号',
        'login.password': '密码',
        'login.passwordPlaceholder': '请输入密码',
        'login.submit': '登录',
        'login.loggingIn': '登录中...',
        'login.success': '登录成功',
        'login.error': '登录失败，请检查账号和密码',
        'login.formatError': '登录响应格式错误',
        'login.fillAll': '请填写完整信息',

        // 首页
        'index.title': 'Cyber Life',
        'index.searchPlaceholder': '搜索...',

        // 管理页面
        'admin.title': '管理面板',
        'admin.logout': '退出登录',
        'admin.editProfile': '编辑资料',
        'admin.administrator': '管理员',

        // 侧边栏
        'nav.accounts': '账号管理',
        'nav.secrets': '密钥管理',
        'nav.hosts': '主机管理',
        'nav.sites': '站点管理',

        // 账号记录
        'accounts.title': '账号',
        'accounts.type': '账号类型',
        'accounts.platform': '平台名称',
        'accounts.platformURL': '平台链接',
        'accounts.logo': '平台图标',
        'accounts.username': '平台账号',
        'accounts.password': '平台密码',
        'accounts.securityEmail': '安全邮箱',
        'accounts.securityPhone': '安全电话',
        'accounts.remark': '备注信息',
        'accounts.createdAt': '创建时间',
        'accounts.updatedAt': '更新时间',
        'accounts.createTitle': '新建账号记录',
        'accounts.editTitle': '编辑账号记录',
        'accounts.deleteConfirm': '确定要删除这条记录吗？此操作不可恢复。',
        'accounts.deleteSuccess': '删除成功',
        'accounts.saveSuccess': '保存成功',

        // 密钥记录
        'secrets.title': '密钥',
        'secrets.platform': '平台名称',
        'secrets.platformURL': '平台链接',
        'secrets.logo': '平台图标',
        'secrets.keyID': 'Key ID',
        'secrets.keySecret': 'Key Secret',
        'secrets.remark': '备注信息',
        'secrets.createdAt': '创建时间',
        'secrets.updatedAt': '更新时间',
        'secrets.createTitle': '新建密钥记录',
        'secrets.editTitle': '编辑密钥记录',
        'secrets.deleteConfirm': '确定要删除这条记录吗？此操作不可恢复。',
        'secrets.deleteSuccess': '删除成功',
        'secrets.saveSuccess': '保存成功',

        // 主机记录
        'hosts.title': '主机',
        'hosts.provider': '服务商名称',
        'hosts.providerURL': '服务商链接',
        'hosts.hostname': '主机名称',
        'hosts.address': '主机地址',
        'hosts.ports': '端口映射',
        'hosts.portNumber': '端口号',
        'hosts.portService': '服务名称',
        'hosts.addPort': '添加端口',
        'hosts.username': '登录账号',
        'hosts.password': '登录密码',
        'hosts.os': '操作系统',
        'hosts.logo': '系统图标',
        'hosts.cpuCapacity': '处理器核心数',
        'hosts.cpuPlaceholder': '核心数',
        'hosts.ramCapacity': '内存容量',
        'hosts.ramPlaceholder': '内存容量',
        'hosts.diskCapacity': '磁盘容量',
        'hosts.diskPlaceholder': '磁盘容量',
        'hosts.cpuNum': 'CPU核心数',
        'hosts.ramSize': '内存大小',
        'hosts.diskSize': '磁盘大小',
        'hosts.hardwareSpecs': '硬件配置',
        'hosts.cpuCores': '核',
        'hosts.expirationTime': '到期时间',
        'hosts.createdAt': '创建时间',
        'hosts.updatedAt': '更新时间',
        'hosts.createTitle': '新建主机记录',
        'hosts.editTitle': '编辑主机记录',
        'hosts.deleteConfirm': '确定要删除这条记录吗？此操作不可恢复。',
        'hosts.deleteSuccess': '删除成功',
        'hosts.saveSuccess': '保存成功',

        // 站点记录
        'sites.title': '站点',
        'sites.name': '站点名称',
        'sites.logo': '站点图标',
        'sites.url': '站点链接',
        'sites.createdAt': '创建时间',
        'sites.updatedAt': '更新时间',
        'sites.createTitle': '新建站点记录',
        'sites.editTitle': '编辑站点记录',
        'sites.deleteConfirm': '确定要删除这条记录吗？此操作不可恢复。',
        'sites.deleteSuccess': '删除成功',
        'sites.saveSuccess': '保存成功',

        // 用户资料
        'profile.title': '编辑资料',
        'profile.account': '账号',
        'profile.accountPlaceholder': '请输入账号',
        'profile.password': '密码',
        'profile.passwordPlaceholder': '请输入密码',
        'profile.name': '姓名',
        'profile.namePlaceholder': '请输入姓名',
        'profile.email': '邮箱',
        'profile.emailPlaceholder': '请输入邮箱',
        'profile.phone': '电话',
        'profile.phonePlaceholder': '请输入电话',
        'profile.avatar': '头像链接',
        'profile.avatarPlaceholder': '请输入头像链接URL',
        'profile.saveSuccess': '保存成功',
        'profile.getFailed': '获取用户信息失败',

        // Toast 消息
        'toast.loginExpired': '登录已过期，请重新登录',
        'toast.requestFailed': '请求失败',
        'toast.saveFailed': '保存失败',
        'toast.deleteFailed': '删除失败',
        'toast.copied': '已复制到剪贴板',
        'toast.copyFailed': '复制失败',
        'toast.featureNotImplemented': '该功能暂未实现',
        'toast.noDataChanged': '没有数据发生改变',
        'toast.pageConfigNotFound': '页面配置不存在',
        'toast.pleaseSelectItems': '请先选择要删除的项',

        // 表单验证
        'validation.required': '此字段为必填项',
        'validation.fillAccount': '请输入账号',

        // 空状态
        'empty.noData': '暂无数据',
        'empty.clickCreate': '点击上方"新建"按钮添加数据',

        // API响应消息 - 成功
        'api.success.successfulImport': '导入成功',
        'api.success.successfulExport': '导出成功',
        'api.success.successfulLogin': '登录成功',
        'api.success.successfulLogout': '登出成功',
        'api.success.successfulCreate': '创建成功',
        'api.success.successfulDelete': '删除成功',
        'api.success.successfulUpdate': '更新成功',
        'api.success.successfulFind': '查询成功',
        'api.success.successfulUpload': '上传成功',

        // API响应消息 - 错误
        'api.error.internalError': '系统内部错误',
        'api.error.failedToImport': '导入失败',
        'api.error.failedToExport': '导出失败',
        'api.error.invalidRequestHeader': '无效的请求头',
        'api.error.invalidRequestParams': '无效的请求参数',
        'api.error.expiredToken': '登录令牌已过期',
        'api.error.invalidToken': '无效的登录令牌',
        'api.error.failedToLogin': '登录失败，请检查账号和密码',
        'api.error.failedToLogout': '登出失败',
        'api.error.failedToCreate': '创建失败',
        'api.error.failedToDelete': '删除失败',
        'api.error.failedToUpdate': '更新失败',
        'api.error.failedToFind': '查询失败',
        'api.error.failedToUpload': '上传失败',
        'api.error.recordNotFound': '记录不存在',
        'api.error.usernameAlreadyExists': '用户名已存在',

        // CSV导入导出
        'csv.exporting': '正在导出CSV文件...',
        'csv.exportSuccess': '导出成功',
        'csv.exportFailed': '导出失败',
        'csv.importing': '正在导入CSV文件...',
        'csv.importSuccess': '成功导入 {count} 条记录',
        'csv.importPartial': '导入完成：成功 {success} 条，失败 {failed} 条',
        'csv.importComplete': '导入完成',
        'csv.importFailed': '导入失败',
        'csv.selectCSV': '请选择CSV文件',
        'csv.fileTooLarge': '文件大小不能超过10MB',

        // 图标上传
        'icon.uploadSuccess': '图标上传成功',
        'icon.uploadFailed': '上传失败',
        'icon.enterNameFirst': '请先输入{name}名称'
    },
    en: {
        // System
        'app.name': 'Cyber Life',
        'app.nameEnglish': 'Cyber Life',
        'app.title.login': 'Login - Cyber Life',
        'app.title.admin': 'Admin Panel - Cyber Life',
        'app.title.index': 'Cyber Life',

        // Common
        'common.id': 'ID',
        'common.confirm': 'Confirm',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'common.delete': 'Delete',
        'common.batchDelete': 'Batch Delete',
        'common.batchDeleteConfirm': 'Are you sure you want to delete the selected {count} records? This action cannot be undone.',
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
        'common.exportCSV': 'Export CSV',
        'common.importCSV': 'Import CSV',
        'common.generatePassword': 'Generate Random Password',
        'common.showPassword': 'Show Password',
        'common.hidePassword': 'Hide Password',

        // Title Tooltips
        'title.switchLanguage': 'Switch Language',
        'title.switchTheme': 'Switch Theme',
        'title.adminPanel': 'Admin Panel',
        'title.backHome': 'Back to Home',
        'title.search': 'Search',
        'title.uploadNewLogo': 'Upload New Logo',
        'title.enterNameFirst': 'Please enter {name} name first',
        'title.clickToCopy': 'Click to copy',

        // Login Page
        'login.title': 'Login',
        'login.subtitle': 'Welcome Back',
        'login.account': 'Account',
        'login.accountPlaceholder': 'Enter your account',
        'login.password': 'Password',
        'login.passwordPlaceholder': 'Enter your password',
        'login.submit': 'Sign In',
        'login.loggingIn': 'Logging in...',
        'login.success': 'Login successful',
        'login.error': 'Login failed, please check your account and password',
        'login.formatError': 'Invalid login response format',
        'login.fillAll': 'Please fill in all fields',

        // Index Page
        'index.title': 'Cyber Life',
        'index.searchPlaceholder': 'Search...',

        // Admin Page
        'admin.title': 'Admin Panel',
        'admin.logout': 'Logout',
        'admin.editProfile': 'Edit Profile',
        'admin.administrator': 'Administrator',

        // Sidebar
        'nav.accounts': 'Manage Accounts',
        'nav.secrets': 'Manage Secrets',
        'nav.hosts': 'Manage Hosts',
        'nav.sites': 'Manage Sites',

        // Accounts
        'accounts.title': 'Account',
        'accounts.type': 'Account Type',
        'accounts.platform': 'Platform Name',
        'accounts.platformURL': 'Platform URL',
        'accounts.logo': 'Platform Logo',
        'accounts.username': 'Platform Account',
        'accounts.password': 'Platform Password',
        'accounts.securityEmail': 'Security Email',
        'accounts.securityPhone': 'Security Phone',
        'accounts.remark': 'Remark Information',
        'accounts.createdAt': 'Created At',
        'accounts.updatedAt': 'Updated At',
        'accounts.createTitle': 'Create Account',
        'accounts.editTitle': 'Edit Account',
        'accounts.deleteConfirm': 'Are you sure you want to delete this record? This action cannot be undone.',
        'accounts.deleteSuccess': 'Deleted successfully',
        'accounts.saveSuccess': 'Saved successfully',

        // Secrets
        'secrets.title': 'Secret',
        'secrets.platform': 'Platform Name',
        'secrets.platformURL': 'Platform URL',
        'secrets.logo': 'Platform Icon',
        'secrets.keyID': 'Key ID',
        'secrets.keySecret': 'Key Secret',
        'secrets.remark': 'Remark Information',
        'secrets.createdAt': 'Created At',
        'secrets.updatedAt': 'Updated At',
        'secrets.createTitle': 'Create Secret',
        'secrets.editTitle': 'Edit Secret',
        'secrets.deleteConfirm': 'Are you sure you want to delete this record? This action cannot be undone.',
        'secrets.deleteSuccess': 'Deleted successfully',
        'secrets.saveSuccess': 'Saved successfully',

        // Hosts
        'hosts.title': 'Host',
        'hosts.provider': 'Provider Name',
        'hosts.providerURL': 'Provider URL',
        'hosts.hostname': 'Hostname',
        'hosts.address': 'Address',
        'hosts.ports': 'Port Mapping',
        'hosts.portNumber': 'Port Number',
        'hosts.portService': 'Service Name',
        'hosts.addPort': 'Add Port',
        'hosts.username': 'Login Username',
        'hosts.password': 'Login Password',
        'hosts.os': 'Operating System',
        'hosts.logo': 'System Icon',
        'hosts.cpuCapacity': 'Processor Cores',
        'hosts.cpuPlaceholder': 'Cores',
        'hosts.ramCapacity': 'RAM Capacity',
        'hosts.ramPlaceholder': 'RAM Capacity',
        'hosts.diskCapacity': 'Disk Capacity',
        'hosts.diskPlaceholder': 'Disk Capacity',
        'hosts.cpuNum': 'CPU Cores',
        'hosts.ramSize': 'RAM Size',
        'hosts.diskSize': 'Disk Size',
        'hosts.hardwareSpecs': 'Hardware Specs',
        'hosts.cpuCores': 'Cores',
        'hosts.expirationTime': 'Expiration Time',
        'hosts.createdAt': 'Created At',
        'hosts.updatedAt': 'Updated At',
        'hosts.createTitle': 'Create Host',
        'hosts.editTitle': 'Edit Host',
        'hosts.deleteConfirm': 'Are you sure you want to delete this record? This action cannot be undone.',
        'hosts.deleteSuccess': 'Deleted successfully',
        'hosts.saveSuccess': 'Saved successfully',

        // Sites
        'sites.title': 'Site',
        'sites.name': 'Site Name',
        'sites.logo': 'Site Icon',
        'sites.url': 'Site URL',
        'sites.createdAt': 'Created At',
        'sites.updatedAt': 'Updated At',
        'sites.createTitle': 'Create Site',
        'sites.editTitle': 'Edit Site',
        'sites.deleteConfirm': 'Are you sure you want to delete this record? This action cannot be undone.',
        'sites.deleteSuccess': 'Deleted successfully',
        'sites.saveSuccess': 'Saved successfully',

        // User Profile
        'profile.title': 'Edit Profile',
        'profile.account': 'Account',
        'profile.accountPlaceholder': 'Enter your account',
        'profile.password': 'Password',
        'profile.passwordPlaceholder': 'Enter your password',
        'profile.name': 'Name',
        'profile.namePlaceholder': 'Enter your name',
        'profile.email': 'Email',
        'profile.emailPlaceholder': 'Enter your email',
        'profile.phone': 'Phone',
        'profile.phonePlaceholder': 'Enter your phone',
        'profile.avatar': 'Avatar URL',
        'profile.avatarPlaceholder': 'Enter avatar URL',
        'profile.saveSuccess': 'Saved successfully',
        'profile.getFailed': 'Failed to get user info',

        // Toast Messages
        'toast.loginExpired': 'Login expired, please login again',
        'toast.requestFailed': 'Request failed',
        'toast.saveFailed': 'Save failed',
        'toast.deleteFailed': 'Delete failed',
        'toast.copied': 'Copied to clipboard',
        'toast.copyFailed': 'Copy failed',
        'toast.featureNotImplemented': 'This feature is not yet implemented',
        'toast.noDataChanged': 'No data has changed',
        'toast.pageConfigNotFound': 'Page configuration not found',
        'toast.pleaseSelectItems': 'Please select items to delete first',

        // Form Validation
        'validation.required': 'This field is required',
        'validation.fillAccount': 'Please enter account',

        // Empty State
        'empty.noData': 'No Data',
        'empty.clickCreate': 'Click "Create" button above to add data',

        // API Response Messages - Success
        'api.success.successfulImport': 'Import successful',
        'api.success.successfulExport': 'Export successful',
        'api.success.successfulLogin': 'Login successful',
        'api.success.successfulLogout': 'Logout successful',
        'api.success.successfulCreate': 'Create successful',
        'api.success.successfulDelete': 'Delete successful',
        'api.success.successfulUpdate': 'Update successful',
        'api.success.successfulFind': 'Query successful',
        'api.success.successfulUpload': 'Upload successful',

        // API Response Messages - Error
        'api.error.internalError': 'Internal system error',
        'api.error.failedToImport': 'Import failed',
        'api.error.failedToExport': 'Export failed',
        'api.error.invalidRequestHeader': 'Invalid request header',
        'api.error.invalidRequestParams': 'Invalid request parameters',
        'api.error.expiredToken': 'Login token has expired',
        'api.error.invalidToken': 'Invalid login token',
        'api.error.failedToLogin': 'Login failed, please check your account and password',
        'api.error.failedToLogout': 'Logout failed',
        'api.error.failedToCreate': 'Create failed',
        'api.error.failedToDelete': 'Delete failed',
        'api.error.failedToUpdate': 'Update failed',
        'api.error.failedToFind': 'Query failed',
        'api.error.failedToUpload': 'Upload failed',
        'api.error.recordNotFound': 'Record not found',
        'api.error.usernameAlreadyExists': 'Username already exists',

        // CSV Import/Export
        'csv.exporting': 'Exporting CSV file...',
        'csv.exportSuccess': 'Export successful',
        'csv.exportFailed': 'Export failed',
        'csv.importing': 'Importing CSV file...',
        'csv.importSuccess': 'Successfully imported {count} records',
        'csv.importPartial': 'Import completed: {success} succeeded, {failed} failed',
        'csv.importComplete': 'Import completed',
        'csv.importFailed': 'Import failed',
        'csv.selectCSV': 'Please select a CSV file',
        'csv.fileTooLarge': 'File size cannot exceed 10MB',

        // Icon Upload
        'icon.uploadSuccess': 'Icon uploaded successfully',
        'icon.uploadFailed': 'Upload failed',
        'icon.enterNameFirst': 'Please enter {name} name first'
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
