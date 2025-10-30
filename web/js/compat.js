// 向后兼容包装器 - 为旧代码提供全局函数
// 这个文件确保旧代码中的全局函数调用仍然有效

// 从 common.js 提供的全局函数别名
window.formatDateTime = (dateString) => DateUtils.formatDateTime(dateString);
window.formatRelativeTime = (dateString) => DateUtils.formatRelativeTime(dateString);
window.validateForm = (formElement) => FormGenerator.validate(formElement);
window.checkAuth = () => Auth.checkAuth();
window.getCurrentUser = () => Auth.getCurrentUser();
window.logout = () => Auth.logout();
