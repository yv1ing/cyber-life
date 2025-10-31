// 登录页面逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否已登录
    const jwt_token = Storage.get('jwt_token');
    if (jwt_token) {
        window.location.href = '/admin.html';
        return;
    }

    // 初始化图标
    document.getElementById('logo-icon').innerHTML = Icons.web;
    document.getElementById('home-icon').innerHTML = Icons.home;

    // 语言切换按钮
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            langManager.toggle();
        });
    }

    // 主题切换按钮
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeManager.toggle();
            localStorage.setItem('theme-manual', 'true');
        });
    }

    // 登录表单提交
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm(loginForm)) {
            return;
        }

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // 禁用按钮，显示加载状态
        loginBtn.disabled = true;
        const originalText = loginBtn.textContent;
        loginBtn.innerHTML = `<span class="loading"></span> ${langManager.t('login.loggingIn')}`;

        try {
            const response = await UserAPI.login(username, password);

            // 保存 token 和用户信息
            if (response.data && response.data.jwt_token) {
                Storage.set('jwt_token', response.data.jwt_token);
                Storage.set('user', { username });

                Toast.success(langManager.t('login.success'));

                // 延迟跳转，让用户看到成功提示
                setTimeout(() => {
                    window.location.href = '/admin.html';
                }, 500);
            } else {
                throw new Error(langManager.t('login.formatError'));
            }
        } catch (error) {
            console.error('登录失败:', error);

            // 获取错误消息
            let errorMessage = langManager.t('login.error');
            if (error && error.message) {
                errorMessage = error.message;
            }

            // 确保 Toast 存在再调用
            if (typeof Toast !== 'undefined' && Toast.error) {
                Toast.error(errorMessage);
            } else {
                // 后备方案：使用 alert
                alert(errorMessage);
                console.error('Toast 未定义，使用 alert 显示错误');
            }

            loginBtn.disabled = false;
            loginBtn.textContent = originalText;
        }
    });

    // 回车键登录 - 阻止默认的表单提交行为
    document.addEventListener('keydown', (e) => {
        // 检查是否在表单内按下回车键
        if (e.key === 'Enter' &&
            (e.target.id === 'username' || e.target.id === 'password')) {
            e.preventDefault(); // 阻止表单的默认提交
            if (!loginBtn.disabled) {
                // 手动触发 submit 事件
                loginForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        }
    });
});
