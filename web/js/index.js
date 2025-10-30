// 首页逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 初始化图标
    document.getElementById('search-icon').innerHTML = Icons.search;
    document.getElementById('admin-icon').innerHTML = Icons.adminPanel;

    // 更新 Logo 文本（固定为英文）
    updateLogoText();

    // 语言切换
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            langManager.toggle();
        });
    }

    // 主题切换
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeManager.toggle();
            localStorage.setItem('theme-manual', 'true');
        });
    }

    // 管理面板按钮
    const adminBtn = document.getElementById('admin-btn');
    adminBtn.addEventListener('click', () => {
        const jwt_token = Storage.get('jwt_token');
        if (jwt_token) {
            window.location.href = '/admin.html';
        } else {
            window.location.href = '/login.html';
        }
    });

    // 搜索功能
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchSuggestions = document.getElementById('search-suggestions');

    // 执行搜索
    function performSearch(query) {
        if (!query.trim()) return;

        // 判断是否是 URL
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

        if (urlPattern.test(query)) {
            // 如果是 URL，直接打开
            const url = query.startsWith('http') ? query : `https://${query}`;
            window.open(url, '_blank');
        } else {
            // 否则使用 Google 搜索
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.open(searchUrl, '_blank');
        }

        // 清空输入框
        searchInput.value = '';
        hideSuggestions();
    }

    // 搜索按钮点击
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    // 回车键搜索
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    // 搜索建议（简单实现）
    const commonSearches = [
        'GitHub',
        'Stack Overflow',
        'MDN Web Docs',
        'npm',
        'TypeScript',
        'React',
        'Vue.js',
        'Node.js'
    ];

    function showSuggestions(query) {
        if (!query.trim()) {
            hideSuggestions();
            return;
        }

        const filtered = commonSearches.filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            hideSuggestions();
            return;
        }

        searchSuggestions.innerHTML = filtered.map(item => `
            <div class="suggestion-item" data-query="${escapeHtml(item)}">
                <span class="suggestion-icon icon">${Icons.search}</span>
                <span class="suggestion-text">${escapeHtml(item)}</span>
            </div>
        `).join('');

        searchSuggestions.classList.add('show');

        // 为建议项添加点击事件
        searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const query = item.getAttribute('data-query');
                searchInput.value = query;
                performSearch(query);
            });
        });
    }

    function hideSuggestions() {
        searchSuggestions.classList.remove('show');
    }

    // 输入时显示建议
    searchInput.addEventListener('input', debounce((e) => {
        showSuggestions(e.target.value);
    }, 300));

    // 点击外部关闭建议
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            hideSuggestions();
        }
    });

    // 聚焦时显示建议
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            showSuggestions(searchInput.value);
        }
    });

    // 快捷键支持
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }

        // ESC 取消搜索
        if (e.key === 'Escape') {
            searchInput.blur();
            hideSuggestions();
        }
    });
});

// 更新 Logo 文本
function updateLogoText() {
    const logoText = document.getElementById('logo-text');
    // 主标题始终保持英文 Cyber Life
    logoText.innerHTML = '<span class="highlight">Cyber</span> Life';
}
