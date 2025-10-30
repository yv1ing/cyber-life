// 管理页面主入口 - 简化版本（从1278行减少到约200行）

// 全局管理器实例
let dataManager;
let formManager;
let searchManager;
let csvManager;
let profileModal;

// 全局回调函数（供表格使用）
window.tableCallbacks = {
    edit: (item) => formManager.openEditModal(item),
    delete: (id) => dataManager.deleteItem(id),
    goToPage: (page) => dataManager.loadData(page, dataManager.currentKeyword)
};

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    // 权限检查
    if (!Auth.checkAuth()) {
        return;
    }

    // 初始化管理器
    dataManager = new DataManager();
    formManager = new AdminFormManager(dataManager);
    searchManager = new SearchManager(dataManager);
    csvManager = new CSVManager(dataManager);

    // 初始化UI组件
    initIcons();
    initUserInfo();
    initThemeToggle();
    initLanguageToggle();
    initNavigation();
    initMobileSidebar();
    initProfileModal();

    // 初始化功能模块
    formManager.initModal();
    searchManager.init();
    csvManager.init();

    // 事件绑定
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('create-btn').addEventListener('click', () => formManager.openEditModal());
    document.getElementById('batch-delete-btn').addEventListener('click', () => dataManager.batchDelete());

    // 恢复上次访问的页面
    const savedPage = Storage.get('current_page') || 'accounts';
    if (PageConfig[savedPage]) {
        dataManager.currentPage = savedPage;
        document.querySelectorAll('.nav-item').forEach(nav => {
            if (nav.getAttribute('data-page') === savedPage) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });
    }

    loadPage(dataManager.currentPage);
});

// 初始化图标
function initIcons() {
    document.getElementById('header-logo-icon').innerHTML = Icons.web;
    document.getElementById('mobile-menu-icon').innerHTML = Icons.menu;
    document.getElementById('logout-icon').innerHTML = Icons.logout;
    document.getElementById('create-icon').innerHTML = Icons.add;
    document.getElementById('export-csv-icon').innerHTML = Icons.download;
    document.getElementById('import-csv-icon').innerHTML = Icons.upload;
    document.getElementById('batch-delete-icon').innerHTML = Icons.delete;
    document.getElementById('search-btn-icon').innerHTML = Icons.search;
    document.getElementById('close-icon').innerHTML = Icons.close;
    document.getElementById('save-icon').innerHTML = Icons.save;
    document.getElementById('edit-profile-icon').innerHTML = Icons.edit;
    document.getElementById('profile-close-icon').innerHTML = Icons.close;
    document.getElementById('profile-save-icon').innerHTML = Icons.save;

    // 导航图标
    document.getElementById('nav-icon-accounts').innerHTML = Icons.account;
    document.getElementById('nav-icon-secrets').innerHTML = Icons.key;
    document.getElementById('nav-icon-hosts').innerHTML = Icons.host;
    document.getElementById('nav-icon-sites').innerHTML = Icons.web;
}

// 初始化用户信息
function initUserInfo() {
    const user = Auth.getCurrentUser();
    if (user && user.username) {
        document.getElementById('user-name').textContent = user.username;
        document.getElementById('user-initial-admin').textContent = user.username.charAt(0).toUpperCase();
    }

    // 用户下拉菜单
    const userMenu = document.getElementById('user-menu');
    const userDropdown = document.getElementById('user-dropdown');

    userMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });

    // 编辑资料按钮
    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        userDropdown.classList.remove('show');
        openProfileModal();
    });
}

// 初始化主题切换
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        themeManager.toggle();
        localStorage.setItem('theme-manual', 'true');
    });
}

// 初始化语言切换
function initLanguageToggle() {
    const langToggle = document.getElementById('lang-toggle');
    langToggle.addEventListener('click', () => {
        langManager.toggle();
    });

    window.addEventListener('languagechange', () => {
        dataManager.loadData(dataManager.currentPageNum, dataManager.currentKeyword);
    });
}

// 初始化导航
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            if (page && PageConfig[page]) {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                dataManager.setCurrentPage(page);

                // 清空搜索框
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = '';
                }

                loadPage(page);
            } else {
                Toast.warning(langManager.t('toast.featureNotImplemented'));
            }
        });
    });
}

// 加载页面
async function loadPage(page) {
    const config = PageConfig[page];
    if (!config) {
        Toast.error('页面配置不存在');
        return;
    }

    // 控制CSV按钮显示
    csvManager.toggleButtons(['accounts', 'hosts', 'secrets'].includes(page));

    // 加载数据
    await dataManager.loadData(1, '');
}

// 初始化移动端侧边栏
function initMobileSidebar() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    const toggleSidebar = () => {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
    };

    const closeSidebar = () => {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
    };

    mobileMenuBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
}

// 初始化资料模态框
function initProfileModal() {
    profileModal = new Modal('profile-modal-overlay');

    document.getElementById('profile-modal-close').addEventListener('click', () => profileModal.close());
    document.getElementById('profile-modal-cancel').addEventListener('click', () => profileModal.close());
    document.getElementById('profile-modal-save').addEventListener('click', handleProfileSave);
}

// 打开编辑资料模态框
async function openProfileModal() {
    try {
        const user = Auth.getCurrentUser();
        if (!user || !user.username) {
            Toast.error(langManager.t('profile.getFailed'));
            return;
        }

        const response = await UserAPI.findByUsername(user.username);
        if (response && response.data && response.data.users && response.data.users.length > 0) {
            const userData = response.data.users[0];

            // 先显示模态框
            profileModal.show();

            // 填充表单数据
            document.getElementById('profile-user-id').value = userData.ID || '';
            document.getElementById('profile-username').value = userData.username || '';
            document.getElementById('profile-name').value = userData.name || '';
            document.getElementById('profile-email').value = userData.email || '';
            document.getElementById('profile-phone').value = userData.phone || '';
            document.getElementById('profile-password').value = '';
        } else {
            Toast.error(langManager.t('profile.getFailed'));
        }
    } catch (error) {
        Toast.error(error.message || langManager.t('profile.getFailed'));
    }
}

// 保存用户资料
async function handleProfileSave() {
    try {
        const userId = document.getElementById('profile-user-id').value;
        const username = document.getElementById('profile-username').value.trim();
        const name = document.getElementById('profile-name').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        const phone = document.getElementById('profile-phone').value.trim();
        const password = document.getElementById('profile-password').value.trim();

        if (!username) {
            Toast.warning(langManager.t('validation.fillAccount'));
            return;
        }

        const userData = {
            username: username,
            name: name,
            email: email,
            phone: phone,
            avatar: '',
            password: password || ''
        };

        await UserAPI.update(userId, userData);
        Toast.success(langManager.t('profile.saveSuccess'));

        // 更新本地存储
        const user = Auth.getCurrentUser();
        user.username = username;
        Storage.set('user', user);

        // 更新页面显示
        document.getElementById('user-name').textContent = username;
        document.getElementById('user-initial-admin').textContent = username.charAt(0).toUpperCase();

        profileModal.close();
    } catch (error) {
        Toast.error(error.message || langManager.t('toast.saveFailed'));
        console.error(error);
    }
}

// 登出
async function handleLogout() {
    try {
        await UserAPI.logout();
    } catch (error) {
        console.error('登出失败:', error);
    } finally {
        Auth.logout();
    }
}
