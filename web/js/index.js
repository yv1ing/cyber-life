// 首页逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 初始化图标
    document.getElementById('search-icon').innerHTML = Icons.search;
    document.getElementById('admin-icon').innerHTML = Icons.adminPanel;

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

    // 初始化常用网站快捷方式
    initShortcuts();
});

// 常用网站快捷方式相关功能
let currentPage = 1;
let isLoading = false;
let hasMore = true;
const pageSize = 12;

async function initShortcuts() {
    // 检查登录状态
    const jwt_token = Storage.get('jwt_token');
    if (!jwt_token) {
        return; // 未登录，不显示快捷方式
    }

    const shortcutsSection = document.getElementById('shortcuts-section');
    shortcutsSection.classList.add('show');

    // 加载第一页数据
    await loadShortcuts(true);

    // 添加滚轮事件监听器
    setupWheelScrolling();
}

async function loadShortcuts(isFirstLoad = false) {
    if (isLoading || !hasMore) return;

    isLoading = true;

    try {
        const jwt_token = Storage.get('jwt_token');
        const headers = {
            'Content-Type': 'application/json',
        };

        if (jwt_token) {
            headers['Authorization'] = `Bearer ${jwt_token}`;
        }

        const response = await fetch(`/api/sites/list?page=${currentPage}&size=${pageSize}`, {
            method: 'GET',
            headers: headers,
        });

        const data = await response.json();

        // SUCCESSFUL_FIND = 100034
        if (data && (data.code === 100034 || data.code === 200 || data.code === 0 || data.code === 1000)) {
            const sites = data.data?.list || [];
            const total = data.data?.total || 0;

            renderShortcuts(sites);

            // 检查是否还有更多数据
            if (currentPage * pageSize >= total) {
                hasMore = false;
            }
        } else {
            console.error('加载站点列表失败:', data?.info || '未知错误');
        }
    } catch (error) {
        console.error('加载站点列表出错:', error);
    } finally {
        isLoading = false;
    }
}

function renderShortcuts(sites) {
    const shortcutsGrid = document.getElementById('shortcuts-grid');
    if (!shortcutsGrid) return;

    const itemsHtml = sites.map(site => {
        const iconUrl = site.logo ? `/site-icons/${site.logo}` : '';
        const siteName = escapeHtml(site.name || '未知站点');
        const siteUrl = site.url || '#';

        return `
            <a href="${escapeHtml(siteUrl)}" target="_blank" rel="noopener noreferrer" class="shortcut-item" data-site-id="${site.id}">
                <div class="shortcut-icon ${!iconUrl ? 'fallback' : ''}">
                    ${iconUrl ?
                        `<img src="${escapeHtml(iconUrl)}" alt="${siteName}" onerror="this.style.display='none'; this.parentNode.classList.add('fallback'); this.parentNode.innerHTML='${siteName.charAt(0).toUpperCase()}'">` :
                        `${siteName.charAt(0).toUpperCase()}`
                    }
                </div>
                <span class="shortcut-name" title="${siteName}">${siteName}</span>
            </a>
        `;
    }).join('');

    if (currentPage === 1) {
        shortcutsGrid.innerHTML = itemsHtml;
    } else {
        shortcutsGrid.insertAdjacentHTML('beforeend', itemsHtml);
    }

    // 计算并标记每行的第一个元素
    updateRowStartMarkers();

    // 为快捷方式项添加点击事件
    shortcutsGrid.querySelectorAll('.shortcut-item').forEach(item => {
        item.addEventListener('click', () => {
            // 处理站点点击
        });
    });
}

// 动态计算每行的元素数量并标记每行的第一个元素
function updateRowStartMarkers() {
    const shortcutsGrid = document.getElementById('shortcuts-grid');
    if (!shortcutsGrid) return;

    const items = shortcutsGrid.querySelectorAll('.shortcut-item');
    if (items.length === 0) return;

    // 移除所有现有的 row-start 类
    items.forEach(item => item.classList.remove('row-start'));

    // 计算每行的元素数量
    const gridWidth = shortcutsGrid.offsetWidth;
    const itemWidth = 72; // shortcut-item 宽度
    const gap = 8; // var(--spacing-sm)，通常是8px
    const itemsPerRow = Math.floor((gridWidth + gap) / (itemWidth + gap));

    // 为每行的第一个元素添加 row-start 类
    items.forEach((item, index) => {
        if (index % itemsPerRow === 0) {
            item.classList.add('row-start');
        }
    });
}

function setupWheelScrolling() {
    const scrollWrapper = document.querySelector('.shortcuts-scroll-wrapper');
    if (!scrollWrapper) return;

    let scrollTimeout;

    // 监听滚动事件以检测是否需要加载更多
    scrollWrapper.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollPercentage =
                (scrollWrapper.scrollTop + scrollWrapper.clientHeight) / scrollWrapper.scrollHeight;

            if (scrollPercentage > 0.8 && hasMore && !isLoading) {
                currentPage++;
                loadShortcuts();
            }
        }, 150);
    });

    // 为触摸设备添加支持（移动端）
    let isScrolling = false;
    let startY = 0;
    let scrollStartTop = 0;

    scrollWrapper.addEventListener('touchstart', (e) => {
        isScrolling = true;
        startY = e.touches[0].pageY;
        scrollStartTop = scrollWrapper.scrollTop;
    });

    scrollWrapper.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;

        const currentY = e.touches[0].pageY;
        const diff = startY - currentY;
        scrollWrapper.scrollTop = scrollStartTop + diff;
    });

    scrollWrapper.addEventListener('touchend', () => {
        isScrolling = false;
    });

    // 监听窗口大小变化，重新计算行标记
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateRowStartMarkers();
        }, 200);
    });
}
