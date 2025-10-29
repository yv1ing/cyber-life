// 登录页面逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否已登录
    const token = Storage.get('token');
    if (token) {
        window.location.href = '/admin.html';
        return;
    }

    // 初始化图标
    document.getElementById('logo-icon').innerHTML = Icons.web;

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
                Storage.set('token', response.data.jwt_token);
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
            Toast.error(error.message || langManager.t('login.error'));
            loginBtn.disabled = false;
            loginBtn.textContent = originalText;
        }
    });

    // 回车键登录
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !loginBtn.disabled) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});
