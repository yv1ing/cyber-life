// 用户API
const UserAPI = {
    /**
     * 用户登录
     * @param {string} username - 用户名
     * @param {string} password - 密码
     * @returns {Promise<Object>}
     */
    login(username, password) {
        // 登录接口跳过 401 自动处理，避免登录失败时自动重定向
        return HTTP.post(`${API_BASE_URL}/sys/users/login`, { username, password }, { skipAuthCheck: true });
    },

    /**
     * 根据用户ID查询用户信息
     * @param {number} userId - 用户ID
     * @returns {Promise<Object>}
     */
    findById(userId) {
        return HTTP.get(`${API_BASE_URL}/sys/users/find`, {
            type: 'user_id',
            user_id: userId
        });
    },

    /**
     * 根据用户名查询用户信息
     * @param {string} username - 用户名
     * @returns {Promise<Object>}
     */
    findByUsername(username) {
        return HTTP.get(`${API_BASE_URL}/sys/users/find`, {
            type: 'username',
            username: username
        });
    },

    /**
     * 更新用户信息
     * @param {number} userId - 用户ID
     * @param {Object} userData - 用户数据
     * @returns {Promise<Object>}
     */
    update(userId, userData) {
        return HTTP.put(`${API_BASE_URL}/sys/users/update`, {
            user_id: parseInt(userId),
            ...userData
        });
    },

    /**
     * 登出
     * @returns {Promise<Object>}
     */
    logout() {
        return HTTP.post(`${API_BASE_URL}/sys/users/logout`);
    }
};
