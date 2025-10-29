// 主题管理器
class ThemeManager {
    constructor() {
        this.theme = this.getInitialTheme();
        this.apply();
    }

    getInitialTheme() {
        // 优先使用本地存储的主题
        const stored = localStorage.getItem('theme');
        if (stored) return stored;

        // 检测系统主题偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    apply() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateToggleButton();
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.apply();
    }

    updateToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('.icon');
            if (icon) {
                icon.innerHTML = this.theme === 'light' ? Icons.darkMode : Icons.lightMode;
            }
        }
    }

    // 监听系统主题变化
    watchSystemTheme() {
        if (!window.matchMedia) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // 仅在用户未手动设置主题时自动切换
            if (!localStorage.getItem('theme-manual')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.apply();
            }
        });
    }
}

// 初始化主题管理器
const themeManager = new ThemeManager();
themeManager.watchSystemTheme();
