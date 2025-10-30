// 权限和用户管理
const Auth = {
    // 权限检查
    checkAuth() {
        const jwt_token = Storage.get('jwt_token');
        if (!jwt_token) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    },

    // 获取当前用户信息
    getCurrentUser() {
        return Storage.get('user', {});
    },

    // 登出
    logout() {
        Storage.remove('jwt_token');
        Storage.remove('user');
        window.location.href = '/login.html';
    }
};
